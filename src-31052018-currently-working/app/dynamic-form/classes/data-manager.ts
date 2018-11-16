import {includes, intersection, isArray, isEmpty, isNil, isString} from 'lodash';
import {Entity, IObservedModel} from '../../entity/entity';
import FormConfig from '../config/form-config';
import DSL, {IObservedRule} from '../../vendor/dsl-wrapper';
import {Validator, IObservedValidation} from '../../vendor/validator';
import parseValue from '../utilities/parseValue';
import {Subscription} from 'rxjs/Subscription';
import SectionConfig from '../config/section-config';
import FormControlConfig from '../config/form-control-config';
import {Observable} from 'rxjs/Observable';
import QuestionConfig from '../config/question-config';
import SchemaConfig from '../config/schema-config';
import CategoryConfig from '../config/category-config';
import {DataManagerSubscriptionType} from '../enumerations/data-manager-subscription-type';
import {PageAccessType} from '../../core/enums/page-access-type';
import {IPlan} from 'app/plan/plan-shared/interfaces/iPlan';
import {PlanHelper} from '../../navigation/classes/plan-helper';
import StateConfig from '../../forms-controls/config/state-config';
import {SubscriptionManager} from '../../core/utilities/subscription-manager';
import ChoiceConfig from '../../forms-controls/config/choice-config';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {INavState} from '../../navigation/interfaces/iNavState';
import {RuleSetType} from '../enumerations/rule-set-type';
import {IFormItemConfig} from '../config/iFormItemConfig';
import {RuleRunner} from './rule-runner';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ISectionRequiredData} from '../config/isection-required-data';
import {RequiredQuestionUtility} from '../utilities/required-question-utility';
import {Subject} from 'rxjs/Subject';
import {GroupedQuestionConfig} from '../config/grouped-question-config';

/**
* This data manager class extends the entity class to allow for state management of the data model associated with a {@link FormConfig} instance.
*
* Its primary roles are:
*
* 1. Enforces that the data model can only be modified via the exposed API and only returns a deep copy of data model when asked upon.
* 2. Provides a direct hook into {@link DSL} rule executor so that corresponding rules are ran whenever a question is updated.
* 3. Provides a direct hook into schema {@link Validator} so that a question's schema is validated prior to updating the model (this currently does not prevent the model from being updated but the validity of the form is updated accordingly).
* 4. Has direct API hooks into the {@link FormConfig} instance to receive updates on form's state.
*
* With an instance of {@link FormConfig}, you can initialize a data model for that form by:
*
* ```typescript
* const viewConfig:FormConfig = new FormConfig(someJsonMeta);
* const data = {person: {firstName: 'Tom', lastName: 'Smith'} };
* const model = viewConfig.initializeModel(data);
*
* // if a question with id: 'personFirstName' is bound to the above model, specifically 'person.firstName', to update that value:
* model.setById('personFirstName', 'John');
*
* // To get the value of a question by id:
* const name = model.getById('personFirstName'); // should return 'John'
*
* // the data manager provides ability to subscribe to various sources via one single API:
* const myCallbackFn = (resolved) => {...};
* const sub1 = model.subscribe('model', myCallbackFn); // this subscribes to any updates to the model.
* const sub2 = model.subscribe('model:personFirstName', myCallbackFn); // this subscribes to only updates to the 'personFirstName' question.
* const sub3 = model.subscribe('validation', myCallbackFn); // this subscribes to any updates to the validation state of the model.
* const sub4 = model.subscribe('validation:personFirstName', myCallbackFn); // this subscribes to any updates to the validation state of the 'personFirstName' question only.
* const sub5 = model.subscribe('rules', myCallbackFn); // this subscribes to anytime a rule has been executed.
* const sub6 = model.subscribe('rules:personFirstName', myCallbackFn); // this subscribes to anytime the 'personFirstName' question is affected with a rule being executed (directly or indirectly).
* const sub7 = model.subscribe('form', myCallbackFn); // this subscribes to any updates to the form's state.
* const sub8 = model.subscribe('category', myCallbackFn); // this subscribes to anytime a new category within the form is activated
* const sub9 = model.subscribe('category:categoryA', myCallbackFn); // this subscribes to anytime the 'categoryA' category within the form is activated.
* const sub10 = model.subscribe('section', myCallbackFn); // this subscribes to anytime a new section within the form is activated
* const sub11 = model.subscribe('section:sectionA', myCallbackFn); // this subscribes to anytime the 'sectionA' section within the form is activated.
*
* ```
*/
export default class DataManager extends Entity {
  /**
  * Private reference to the view configuration instance that's bound ot this data manager.
  */
  private _form: FormConfig;

  /**
  * Private instance of the DSL execution class.
  */
  private _dsl: DSL;

  /**
  * Private instance of the schema validator class.
  */
  private _validator: Validator;

  /**
   * Private instance of the rule runner class.
   */
  private _ruleRunner: RuleRunner;

  /**
   * An array of subscriptions to each question
   */
  private _subscriptions: Subscription[];

  /***
   * The plan associated with the data
   * @type {null}
   * @private
   */
  private _plan: IPlan = null;

  /**
   * The customer associated with the data
   * @type {null}
   * @private
   */
  private _customer: ICustomer = null;

  /**
   * Holds the count of required questions for the active category
   * @type {Subject<Map<string, ISectionRequiredData>>}
   * @private
   */
  private _requiredQuestionsMapSubject: BehaviorSubject<Map<string, ISectionRequiredData>> = new BehaviorSubject<Map<string, ISectionRequiredData>>(new Map<string, ISectionRequiredData>());

  /**
  * Delegates the construction of the data model to {@link Entity} class and initializes the manager.
  */
  constructor(viewConfig: FormConfig, navState: INavState) {
    super(navState.data.planCategoryData);
    const navData = navState.data;
    if (navData.plan) {
      this._plan = navData.plan;
    }

    if (navData.customer) {
      this._customer = navData.customer;
    }
    const pageAccessType = navData.pageAccessType;
    this._initialize(viewConfig, pageAccessType);
  }

  /**
   * Initializes the manager and registers API specific methods as tokens for DSL engine to use.
   *
   * As part of this process, we subscribe to the entity source so that whenever the model is updated, we can execute validations and rules.
   */
  private _initialize(viewConfig: FormConfig, pageAccessType: PageAccessType): void {
    this._form = viewConfig;
    this._dsl = new DSL();
    this._validator = new Validator();
    this._ruleRunner = new RuleRunner(this._dsl, this);
    this._registerTokens();

    const disableBasedOnPlanStatus = !isNil(this._plan) && PlanHelper.isPlanReadOnly(this._plan.status);
    if (disableBasedOnPlanStatus) {
      this._disableAllQuestions();
      return;
    }
    switch (pageAccessType) {
      case (PageAccessType.SUPER_USER):
      case (PageAccessType.FULL_STANDARD_ACCESS): {
        this._setUpQuestions().then( (subscriptions) => {
          this._subscriptions = subscriptions;
        });
        break;
      }
      case (PageAccessType.READ_ONLY):
      default: {
        this._disableAllQuestions();
      }
    }
    this._updateSectionRequiredQuestion();
  }

  /**
   * Registers tokens. Tokens are defined as properties to maintain context of 'this'
   * @private
   */
  private _registerTokens(): void {
    this.registerToken('disable', this.disable);
    this.registerToken('doesAnswerContainAnyValue', this.doesAnswerContainAnyValue);
    this.registerToken('enable', this.enable);
    this.registerToken('getActiveCategoryId', this.getActiveCategory);
    this.registerToken('getCategory', this.getCategoryById);
    this.registerToken('getControl', this.getControlByQuestionId);
    this.registerToken('getControlByQuestionId', this.getControlByQuestionId);
    this.registerToken('getCustomerMarketSegmentId', this.getCustomerMarketSegmentId);
    this.registerToken('getIn', this.getIn);
    this.registerToken('getSection', this.getSectionById);
    this.registerToken('hide', this.hide);
    this.registerToken('hideValue', this.hideValue);
    this.registerToken('hideValues', this.hideValues);
    this.registerToken('includes', includes);
    this.registerToken('isIn', this.isIn);
    this.registerToken('isQuestionDisabled', this.isQuestionDisabled);
    this.registerToken('log', console.info);
    this.registerToken('optionalize', this.optionalize);
    this.registerToken('require', this.require);
    this.registerToken('setChoices', this.setChoices);
    this.registerToken('setIn', this.setIn);
    this.registerToken('setState', this.setState);
    this.registerToken('setValueAndDisableQuestion', this.setValueAndDisableQuestion);
    this.registerToken('show', this.show);
    this.registerToken('showAllValues', this.showAllValues);
    this.registerToken('showValue', this.showValue);
    this.registerToken('showValues', this.showValues);
  }

  /**
   * Intended to be used with questions whose answer is an array, like check boxes
   * Returns true if the answer has at least one of the values, else false
   */
  public doesAnswerContainAnyValue = (questionPath: string, values: number[] | string[]): boolean => {
    if (!isArray(values) || isEmpty(values)) {
      return false;
    }
    let answer = this.getIn(questionPath);
    if (typeof answer === 'string' || typeof answer === 'number') {
      answer = [answer];
    }
    if (isEmpty(answer)) {
      return false;
    }

    if (isString(answer[0])) {
      return intersection(values as string[], answer as string[]).length > 0;
    } else {
      return intersection(values as number[], answer as number[]).length > 0;
    }
  }

  /**
   * Private method to run schema validation for a given question and its current value.
   *
   * Currently, if the current value is not valid against the question's schema, it is considered to be a hard error
   * so we apply the validation messages to the `errors` array of the question's state.
   */
  private _runValidations(question: QuestionConfig, currentValue: any): void {
    const control = question.control;
    const schema = question.schema;
    if (schema) {
      const result = this._validator.validate(question.formItemId, currentValue, schema, {propertyName: `The current value '${currentValue}'`});
      control.state.errors = result.messages;
    }
  }

  /**
   * Disables all formItems
   */
  private _disableAllQuestions(): void {
    this._form.questions.forEach((question) => {
      if (question instanceof QuestionConfig) {
        const control = question.control;
        if (control && control.state) {
          control.state.isDisabled = true;
        }
      }
    });
  }

  /**
   * Sets up formItems subscriptions and runs initial rules. Asynchronous in order to avoid performance issues
   */
  private async _setUpQuestions(): Promise<Subscription[]> {
    let subscriptions: Subscription[] = [];
    return this._initializeRules(this._form.questions, subscriptions);
  }

  /**
   * Recursively initalizes rules for all questions
   */
  private _initializeRules(formItems: IFormItemConfig[], subscriptions: Subscription[]): Subscription[] {
    formItems.forEach( (formItem) => {
      if (formItem instanceof QuestionConfig) {
        this._ruleRunner.checkToRunRules(formItem, RuleSetType.ON_INIT);

        if (formItem.viewModel) {
          const viewModelSubscription = this.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:${formItem.formItemId}`, (observed: IObservedModel) => {
            this._runValidations(formItem, observed.currentValue);
            this._ruleRunner.checkToRunRules(formItem, RuleSetType.ON_CHANGE);
          });
          subscriptions.push(viewModelSubscription);
          const value = this.getIn(formItem.viewModel);
          const observedModel: IObservedModel = {path: formItem.viewModel, previousValue: value, currentValue: value};
          this.emitSource(observedModel);
        }
      } else if (formItem instanceof GroupedQuestionConfig) {
        subscriptions = this._initializeRules(formItem.formItems, subscriptions);
      }
    });
    return subscriptions;
  }

  /**
   * Gets a map of the active category and the count of required questions for each section
   * @returns {Observable<Map<string, ISectionRequiredData>>}
   */
  public get requiredQuestions$(): Observable<Map<string, ISectionRequiredData>> {
    return this._requiredQuestionsMapSubject.asObservable();
  }

  /**
   * Updates the required questions for the sections in the active category
   * @private
   */
  private _updateSectionRequiredQuestion(): void {
    const requiredQuestionsMap = RequiredQuestionUtility.getRequiredQuestionsMap(this._form.getCategory(this._form.activeCategoryId), this);
    this._requiredQuestionsMapSubject.next(requiredQuestionsMap);
  }

  /**
   * Subscribes to a specified observable and executes the provided callback.
   *
   * NOTE: If subscriberId is provided, the subscription is filtered to only react to the respective attribute id.
   *
   * @param {string} subscribeTo
   * @param handler
   * @returns {Subscription}
   */
  public subscribe(subscribeTo: string, handler: any): Subscription {
    const items = subscribeTo.split(':');
    const type = items[0];
    const subscriberId = items[1];
    const path = this._form.getPath(subscriberId);
    switch (type) {
      case DataManagerSubscriptionType.VIEW_MODEL:
        if (subscriberId) {
          return this.source
            .filter((observed: IObservedModel) => observed.path === path)
            .subscribe((observed: IObservedModel) => handler(observed));
        }
        return this.source.subscribe((observed: IObservedModel) => handler(observed));

      case DataManagerSubscriptionType.VALIDATION:
        if (subscriberId) {
          return this._validator.source
            .filter((observed: IObservedValidation) => observed.id === subscriberId)
            .subscribe((observed: IObservedValidation) => handler(observed));
        }
        return this._validator.source.subscribe((observed: IObservedValidation) => handler(observed));

      case DataManagerSubscriptionType.RULES:
        if (subscriberId) {
          return this._dsl.source
            .filter((observed: IObservedRule) => observed.ids.some((id) => id === subscriberId))
            .subscribe((observed: IObservedRule) => handler(observed));
        }
        return this._dsl.source.subscribe((item: IObservedRule) => handler(item));

      case DataManagerSubscriptionType.FORM:
        return this._form.source.subscribe((observed: StateConfig) => handler(observed));

      case DataManagerSubscriptionType.SECTION:
        if (subscriberId) {
          return this._form.onSectionChange
            .filter((sectionId: string) => sectionId === subscriberId)
            .subscribe((sectionId: string) => handler(sectionId));
        }
        return this._form.onSectionChange.subscribe((sectionId: string) => handler(sectionId));

      case DataManagerSubscriptionType.CATEGORY:
        if (subscriberId) {
          return this._form.onCategoryChange
            .filter((categoryId: string) => categoryId === subscriberId)
            .subscribe((categoryId: string) => handler(categoryId));
        }
        return this._form.onCategoryChange.subscribe((categoryId: string) => handler(categoryId));

      default:
        console.error(`"${subscribeTo}" is not a valid subscription type.`);
    }
  }

  /**
   * Gets a value of a question by its id.
   * Should only be used within the rules
   * @param {string} id
   * @returns {any}
   */
  public getById(id: string): any {
    if (isNil(id)) {
      return;
    }
    const path = this._form.getPath(id);
    if (!isNil(path)) {
      return this.getIn(path);
    }
  }

  /**
   * Sets a value of a question by its id.
   * Should only be used within the rules
   * NOTE: This method should be used based on user interaction only as it will affect the state of the form.
   *
   * @param {string} id
   * @param value
   * @returns {Observable<IObservedModel>}
   */
  public setById(id: string, value: any): Observable<IObservedModel> {
    if (isNil(id)) {
      return;
    }

    const question: QuestionConfig = this._form.getQuestion(id) as QuestionConfig;
    if (isNil(question)) {
      return;
    }

    const control: FormControlConfig = question.control;
    if (control.state.isDisabled || control.state.isHidden) {
      return;
    }

    const schema: SchemaConfig = question.schema;

    if (schema) {
      // sanitize value in accordance to schema prior to setting value
      value = parseValue(schema.format || schema.type, value);
    }

    const path = this._form.getPath(id);
    if (path && value !== this.getIn(path)) {
      this.setIn(path, value);
      control.state.isDirty = true;
    }
    this._updateSectionRequiredQuestion();
    return this.source;
  }

  /**
   * Deletes all subscriptions to rules. Needed for performance and to avoid memory leaks
   */
  public deleteSubscriptions(): void {
    if (this._subscriptions) {
      SubscriptionManager.massUnsubscribe(this._subscriptions);
    }
  }

  /**
   * Registers custom tokens (functions) to be used within the DSL.
   */
  public registerToken(name: string, callback: any): void {
    this._dsl.register(name, callback);
  }

  /**
   * Returns whether a question (id provided) or form is valid.
   */
  public isValid(id?: string): boolean {
    return this._form.isValid(id);
  }

  /**
   * Gets a form control by the id of the question.
   */
  public getControlByQuestionId = (questionId: string): FormControlConfig => {
    return this._form.getControl(questionId);
  }

  /**
   * Gets a section by the id of the section.
   */
  public getSectionById = (id: string): SectionConfig => {
    return this._form.getSection(id);
  }

  /**
   * Enables a question
   */
  public enable = (questionIds: string | string[]): void => {
    if (isNil(questionIds)) {
        return;
    }
    let questionIdList: string | string[];
    if (questionIds && typeof questionIds === 'string') {
      questionIdList = [questionIds];
    } else {
      questionIdList = questionIds;
    }

    for (let questionId of questionIdList) {
      const control: FormControlConfig = this.getControlByQuestionId(questionId);
      if (isNil(control)) {
        return;
      }
      control.state.isDisabled = false;
    }
  }

  /**
   * Disables a question
   */
  public disable = (questionIds: string | string[]): void => {
    if (isNil(questionIds)) {
        return;
    }

    let questionIdList: string | string[];
    if (questionIds && typeof questionIds === 'string') {
      questionIdList = [questionIds];
    } else {
      questionIdList = questionIds;
    }

    for (let questionId of questionIdList) {
      const question: QuestionConfig = this._form.getQuestion(questionId) as QuestionConfig;
      if (isNil(question)) {
        return;
      }

      const control: FormControlConfig = question.control;
      if (isNil(control)) {
        return;
      }
      if (this.getById(question.formItemId)) {
        this.setById(question.formItemId, null);
      }
      control.state.isDisabled = true;
    }
  }

  /**
   * Sets a value and then disables the field
   * @param {string} questionId
   * @param newValue
   */
  public setValueAndDisableQuestion = (questionId: string, newValue: any): void => {
    if (isNil(questionId)) {
      return;
    }

    const question: QuestionConfig = this._form.getQuestion(questionId) as QuestionConfig;
    if (isNil(question)) {
      return;
    }

    const control: FormControlConfig = question.control;
    if (isNil(control)) {
      return;
    }
    this.setIn(question.viewModel, newValue);
    control.state.isDisabled = true;
  }

  /**
   * Marks a question as required
   */
  public require = (questionId: string): void => {
    const control: FormControlConfig = this.getControlByQuestionId(questionId);
    if (isNil(control)) {
      return;
    }

    control.state.isRequired = true;
    this._updateSectionRequiredQuestion();
  }

  /**
   * Marks a question as optional
   */
  public optionalize = (questionId: string): void => {
    const control: FormControlConfig = this.getControlByQuestionId(questionId);
    if (isNil(control)) {
      return;
    }
    control.state.isRequired = false;
    this._updateSectionRequiredQuestion();
  }

  /**
   * Makes a question hidden
   */
  public hide = (questionId: string): void => {
    const control: FormControlConfig = this.getControlByQuestionId(questionId);
    if (isNil(control)) {
      return;
    }
    control.state.isHidden = true;
  }

  /**
   * Makes a question visible
   */
  public show = (questionId: string): void => {
    const control: FormControlConfig = this.getControlByQuestionId(questionId);
    if (isNil(control)) {
      return;
    }
    control.state.isHidden = false;
  }

  /**
   * Hides a specific value given the question id and value to hide
   */
  public hideValue = (questionId: string, value: any): void => {
    const isHidden = true;
    this._setValueVisibility(questionId, value, isHidden);
  }

  /**
   * Hides a list of values for a question
   */
  public hideValues = (questionId: string, values: any[] = []): void => {
    values.forEach((value: any) => {
      this.hideValue(questionId, value);
    });
  }

  /**
   * Shows a specific value given a question id and the value to show
   */
  public showValue = (questionId: string, value: any): void => {
    const isHidden = false;
    this._setValueVisibility(questionId, value, isHidden);
  }

  /**
   * Shows a list of values for a question
   */
  public showValues = (questionId: string, values: any[] = []): void => {
    values.forEach((value: any) => {
      this.showValue(questionId, value);
    });
  }

  /**
   * Shows all values for a question
   */
  public showAllValues = (questionId: string): void => {
    const control: FormControlConfig = this.getControlByQuestionId(questionId);
    if (isNil(control)) {
      return;
    }

    const choices = control.choices;
    if (isNil(choices)) {
      return;
    }

    const values = choices.map((choice: ChoiceConfig) => choice.value);
    if (isNil(values)) {
      return;
    }
    this.showValues(questionId, values);
  }

  /**
   * Indicates if a question is disabled
   * @param {string} questionId
   * @returns {boolean}
   */
  public isQuestionDisabled = (questionId: string): boolean => {
      const control: FormControlConfig = this.getControlByQuestionId(questionId);
      if (isNil(control)) {
        return;
      }
      return control.state.isDisabled;
  }

  /**
   * Toggles the visibility of a specified value
   * @param {string} questionId
   * @param value
   * @param {boolean} isHidden
   * @private
   */
  private _setValueVisibility(questionId: string, value: any, isHidden: boolean): void {
    const control: FormControlConfig = this.getControlByQuestionId(questionId);
    if (isNil(control)) {
      return;
    }

    const choices = control.choices;
    if (isNil(choices)) {
      return;
    }

    const choiceToUpdate = choices.find((choice: ChoiceConfig) => {
      return choice.value === value;
    });
    if (isNil(choiceToUpdate)) {
      return;
    }

    choiceToUpdate.state.isHidden = isHidden;
  }

  /**
   * Returns the market segment id on the customer associated with the plan
   * NOTE: Since this method is registered as a token to be used within the DSL, it is declared as a property to maintain the context of 'this'.
   * @returns {string}
   */
  public getCustomerMarketSegmentId = (): string => {
    const marketSegmentId = this._customer && this._customer.marketSegmentId ? this._customer.marketSegmentId : '';
    return marketSegmentId;
  }

  /**
   * Gets the status code for the associated plan
   */
  public getPlanStatusCode = (): string => {
    const statusCode = this._plan && this._plan.status ? this._plan.status  : '';
    return statusCode;
  }

  /**
   * DO NOT USE
   * Sets the state of a field by its id.
   *
   * NOTE: Since this method is registered as a token to be used within DSL, it is declared as a property to maintain the context of 'this'.
   *
   * @param {string} id
   * @param {string} field
   * @param {boolean} newValue
   * @deprecated Do not use.
   */
  public setState = (id: string, attribute: string, newValue: boolean): void => {
    if (isNil(id)) {
      return;
    }
    const question: QuestionConfig = this._form.getQuestion(id) as QuestionConfig;

    if (isNil(question)) {
      return;
    }
    const control: FormControlConfig = question.control;
    if (isNil(control)) {
      return;
    }

    switch (attribute) {
      case 'isRequired': {
        control.state.isRequired = newValue;
        break;
      }
      case 'isDisabled': {
        control.state.isDisabled = newValue;
        if (control.state.isDisabled && this.getById(question.formItemId)) {
          const viewModel = '.'.concat(question.formItemId);
          const pathToSection = question.viewModel.replace(viewModel, '');
          let newStore = this.getIn(pathToSection);
          delete newStore[question.formItemId];
          this.setIn(pathToSection, newStore);
        }
        break;
      }
      case 'isHidden': {
        control.state.isHidden = newValue;
        break;
      }
      default: {
        console.error('Unsupported attribute found ' + attribute);
      }
    }
  }

  /**
   * NO NOT USE
   * Sets the value of a form control given its ID and choices' JSON data
   *
   * NOTE: Since this method is registered as a token to be used within DSL, it is declared as a property to maintain the context of 'this'.
   *
   * @param {string} id
   * @param choices
   * @deprecated DO NOT USE
   */
  public setChoices = (id: string, choices: any): void => {
    if (isNil(id)) {
      return;
    }
    const question: QuestionConfig = this._form.getQuestion(id) as QuestionConfig;

    if (isNil(question)) {
      return;
    }
    const control: FormControlConfig = question.control;
    if (isNil(control)) {
      return;
    }
    control.setChoices(choices);
  }

  /**
   * Returns a category given its id
   *
   * NOTE: Since this method is registered as a token to be used within DSL, it is declared as a property to maintain the context of 'this'.
   *
   * @param {string} id
   * @returns {CategoryConfig}
   */
  public getCategoryById = (id: string): CategoryConfig => {
    return this._form.getCategory(id);
  }

  /**
   * Returns the id of the active cateogory
   *
   * NOTE: Since this method is registered as a token to be used within DSL, it is declared as a property to maintain the context of 'this'.
   *
   * @returns {string}
   */
  public getActiveCategory = (): string => {
    return this._form.activeCategoryId;
  }

  /**
   * Gets the id of the active section
   * @returns {string}
   */
  public getActiveSection = (): string => {
    return this._form.activeSectionId;
  }

}
