import * as configuration from '../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../assets/test/dynamic-form/data-manager.mock.json';
import DataManager from './data-manager';
import FormConfig from '../config/form-config';
import {Subscription} from 'rxjs/Subscription';
import {IObservedModel} from '../../entity/entity';
import {IObservedValidation} from '../../vendor/validator';
import {IObservedRule} from '../../vendor/dsl-wrapper';
import {DataManagerSubscriptionType} from '../enumerations/data-manager-subscription-type';
import StateConfig from '../../forms-controls/config/state-config';
import Spy = jasmine.Spy;
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {CustomerStatus} from '../../customer/enums/customer-status';
import {INavState} from '../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../assets/test/NavStateHelper';
import {IPlan} from '../../plan/plan-shared/interfaces/iPlan';
import {PlanStatus} from '../../plan/enums/plan-status';

describe('DataManager', () => {
  let dataManager: DataManager;
  let formConfig: FormConfig;
  let subscription: Subscription;
  let navState: INavState = getNavStateForDataManager(data);
  beforeEach(() => {
    formConfig = new FormConfig(configuration);
    formConfig.activateCategoryById('mockCategory');
    dataManager = formConfig.initializeModel(navState);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('Test logic in doesAnswerContainAnyValue', () => {
    it ('should return true if answer has at least one of the values', () => {
      spyOn(dataManager, 'getIn').and.returnValue([1, 2, 3, 4, 5]);
      const doesAnswerContainAnyValue: boolean = dataManager.doesAnswerContainAnyValue('questionPath', [5, 6]);
      expect(doesAnswerContainAnyValue).toBeTruthy();
    });

    it ('should return true if answer has at least one of the values', () => {
      spyOn(dataManager, 'getIn').and.returnValue(['a', 'b', 'c', 'd', 'e']);
      const doesAnswerContainAnyValue: boolean = dataManager.doesAnswerContainAnyValue('questionPath', ['e', 'f']);
      expect(doesAnswerContainAnyValue).toBeTruthy();
    });

    it ('should return false if the answer is empty', () => {
      spyOn(dataManager, 'getIn').and.returnValue([1, 2, 3, 4, 5]);
      const doesAnswerContainAnyValue: boolean = dataManager.doesAnswerContainAnyValue('questionPath', []);
      expect(doesAnswerContainAnyValue).toBeFalsy();
    });

    it ('should return false if the values are missing', () => {
      spyOn(dataManager, 'getIn').and.returnValue([1, 2, 3, 4, 5]);
      const doesAnswerContainAnyValue: boolean = dataManager.doesAnswerContainAnyValue('questionPath', []);
      expect(doesAnswerContainAnyValue).toBeFalsy();
    });

  });

  describe('Basic Enable and Disable Functionality', () => {
    it('should enable the question', () => {
      const control = dataManager.getControlByQuestionId('questionA');
      control.state.isDisabled = true;
      dataManager.enable('questionA');
      expect(control.state.isDisabled).toBeFalsy();
    });

    it('should disable the question', () => {
      const control = dataManager.getControlByQuestionId('questionA');
      control.state.isDisabled = false;
      dataManager.disable('questionA');
      expect(control.state.isDisabled).toBeTruthy();
    });

    it('should return undefined on calling with blank question id', () => {
      expect(dataManager.enable('')).toBeUndefined();
    });

    it('should return undefined on calling with blank question id', () => {
      expect(dataManager.disable('')).toBeUndefined();
    });

    it('should return undefined on calling with blank question id', () => {
      expect(dataManager.enable(null)).toBeUndefined();
    });

    it('should return undefined on calling with blank question id', () => {
      expect(dataManager.disable(null)).toBeUndefined();
    });

    it('should enable the questions', () => {
      const controlA = dataManager.getControlByQuestionId('questionA');
      controlA.state.isDisabled = true;
      const controlB = dataManager.getControlByQuestionId('questionB');
      controlB.state.isDisabled = true;
      dataManager.enable(['questionA', 'questionB']);
      expect(controlA.state.isDisabled).toBeFalsy();
      expect(controlB.state.isDisabled).toBeFalsy();
    });

    it('should disable the questions', () => {
      const controlA = dataManager.getControlByQuestionId('questionA');
      controlA.state.isDisabled = false;
      const controlB = dataManager.getControlByQuestionId('questionB');
      controlB.state.isDisabled = false;
      dataManager.disable(['questionA', 'questionB']);
      expect(controlA.state.isDisabled).toBeTruthy();
      expect(controlB.state.isDisabled).toBeTruthy();
    });
  });

  describe('Basic Set and Get Functionality', () => {
    const customer: ICustomer = {
      customerNumber: 1,
      customerName: 'Test Customer',
      effectiveDate: '01/01/2016',
      market: 'Small Market',
      status: CustomerStatus.APPROVED,
      hiddenStatus: false,
      percentageCompleted: 1,
      scrollVisibility: true,
      marketSegmentId: '4'
    };
    it('should return undefined when getById is called with null id', () => {
      expect(dataManager.getById(null)).toBeUndefined();
    });

    it('should return undefined when getById is called with undefined id', () => {
      expect(dataManager.getById(undefined)).toBeUndefined();
    });

    it('should return undefined when getById is called with an invalid id', () => {
      expect(dataManager.getById('invalidId')).toBeUndefined();
    });

    it('should return the value of the question when getById is called with a valid id', () => {
      expect(dataManager.getById('questionA')).toEqual(1);
    });

    it('should return undefined when setById is called with a null value', () => {
      expect(dataManager.setById(null, 'value')).toBeUndefined();
    });

    it('should return undefined when setById is called with an undefined value', () => {
      expect(dataManager.setById(undefined, 'value')).toBeUndefined();
    });

    it('should return undefined when setState is called with an undefined value', () => {
      expect(dataManager.setState(undefined, 'isDisabled', true)).toBeUndefined();
    });

    it('should return undefined when setState is called with a null value', () => {
      expect(dataManager.setState(null, 'isDisabled', true)).toBeUndefined();
    });

    it('should return undefined when setChoices is called with an undefined value', () => {
      expect(dataManager.setChoices(undefined, 'test')).toBeUndefined();
    });

    it('should return undefined when setChoices is called with a null value', () => {
      expect(dataManager.setChoices(null, 'test')).toBeUndefined();
    });

    it('should return undefined when getCategoryById is called with a null value', () => {
      expect(dataManager.getCategoryById(null)).toBeUndefined();
    });

    it('should return undefined when getCategoryById is called with an undefined value', () => {
      expect(dataManager.getCategoryById(undefined)).toBeUndefined();
    });

    it('should return updated value in model when setById is called with a valid id and a value', (done) => {
      subscription = dataManager.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:questionA`, (observed: IObservedModel) => {
        expect(observed.currentValue).toEqual(2);
        done();
      });
      dataManager.setById('questionA', 2);
    });

    it('should return undefined when setById is called for a disabled question', () => {
      const control = dataManager.getControlByQuestionId('questionA');
      control.state.isDisabled = true;
      expect(dataManager.setById('questionA', 2)).toBeUndefined();
    });

    it('should return undefined when setById is called for a hidden question', () => {
      const control = dataManager.getControlByQuestionId('questionA');
      control.state.isHidden = true;
      expect(dataManager.setById('questionA', 2)).toBeUndefined();
    });

    it('should return undefined when setById is called with invalid id', () => {
      expect(dataManager.setById('badId', 2)).toBeUndefined();
    });

    it('should emit a new form state change with invalid state when setById is called with invalid value', (done) => {
      subscription = dataManager.subscribe(DataManagerSubscriptionType.FORM, (newState: StateConfig) => {
        expect(newState.hasErrors).toBeTruthy();
        expect(newState.isValid).toBeFalsy();
        done();
      });

      dataManager.setById('questionA', 'badValue');
    });

    it('should emit a new form state change with proper state values when setById is called with valid value', (done) => {
      subscription = dataManager.subscribe(DataManagerSubscriptionType.FORM, (newState: StateConfig) => {
        expect(newState.hasErrors).toBeFalsy();
        expect(newState.isValid).toBeTruthy();
        expect(newState.isDirty).toBeTruthy();
        done();
      });

      dataManager.setById('questionA', 2);
    });

    it('should return the correct marketSegmentId', () => {
      navState.data.customer = customer;
      dataManager = formConfig.initializeModel(navState);
      const returnedMarketSegment = dataManager.getCustomerMarketSegmentId();
      expect(returnedMarketSegment).toBe('4');
    });

    it('should return an empty string when the marketSegment id is null', () => {
      customer.marketSegmentId = null;
      navState.data.customer = customer;
      dataManager = formConfig.initializeModel(navState);
      const returnedMarketSegment = dataManager.getCustomerMarketSegmentId();
      expect(returnedMarketSegment).toBe('');
    });

    it('should return an empty string when the marketSegmentId is undefined', () => {
      customer.marketSegmentId = undefined;
      navState.data.customer = customer;
      dataManager = formConfig.initializeModel(navState);
      const returnedMarketSegment = dataManager.getCustomerMarketSegmentId();
      expect(returnedMarketSegment).toBe('');
    });

    it('should return an empty string when customer is null', () => {
      navState.data.customer = null;
      dataManager = formConfig.initializeModel(navState);
      const returnedMarketSegment = dataManager.getCustomerMarketSegmentId();
      expect(returnedMarketSegment).toBe('');
    });

    it('should return an empty sring when customer is undefined', () => {
      navState.data.customer = undefined;
      dataManager = formConfig.initializeModel(navState);
      const returnedMarketSegment = dataManager.getCustomerMarketSegmentId();
      expect(returnedMarketSegment).toBe('');
    });

    describe('getPlanStatusCode', () => {
      let plan: IPlan = {
        status: PlanStatus.ACTIVE
      };
      it('should return the correct plan status code', () => {
        navState.data.plan = plan;
        dataManager = formConfig.initializeModel(navState);
        const returnedPlanCode = dataManager.getPlanStatusCode();
        expect(returnedPlanCode).toBe(PlanStatus.ACTIVE.toString());
      });

      it('should return an empty string when plan status is null', () => {
        plan.status = null;
        navState.data.plan = plan;
        dataManager = formConfig.initializeModel(navState);
        const returnedPlanCode = dataManager.getPlanStatusCode();
        expect(returnedPlanCode).toBe('');
      });

      it('should return an empty string when the plan status is undefined', () => {
        plan.status = undefined;
        navState.data.plan = plan;
        dataManager = formConfig.initializeModel(navState);
        const returnedPlanCode = dataManager.getPlanStatusCode();
        expect(returnedPlanCode).toBe('');
      });

      it('should return an empty string when plan is null', () => {
        navState.data.plan = null;
        dataManager = formConfig.initializeModel(navState);
        const returnedPlanCode = dataManager.getPlanStatusCode();
        expect(returnedPlanCode).toBe('');
      });

      it('should return an empty string when plan is undefined', () => {
        navState.data.plan = undefined;
        dataManager = formConfig.initializeModel(navState);
        const returnedPlanCode = dataManager.getPlanStatusCode();
        expect(returnedPlanCode).toBe('');
      });
    });

    describe('isQuestionDisabled', () => {
      it('should be truthy when the question is disabled', () => {
        const control = dataManager.getControlByQuestionId('questionA');
        control.state.isDisabled = true;
        expect(dataManager.isQuestionDisabled('questionA')).toBeTruthy();
      });

      it('should be falsy when the question is not disabled', () => {
        const control = dataManager.getControlByQuestionId('questionA');
        control.state.isDisabled = false;
        expect(dataManager.isQuestionDisabled('questionA')).toBeFalsy();
      });

      it('should be falsy when the questionId is an invalid question', () => {
        const control = dataManager.getControlByQuestionId('questionA');
        control.state.isDisabled = true;
        expect(dataManager.isQuestionDisabled('invalidId')).toBeFalsy();
      });

      it('should be falsy when isDisabled is null', () => {
        const control = dataManager.getControlByQuestionId('questionA');
        control.state.isDisabled = null;
        expect(dataManager.isQuestionDisabled('questionA')).toBeFalsy();
      });

      it('should be falsy when isDisabled is undefined', () => {
        const control = dataManager.getControlByQuestionId('questionA');
        control.state.isDisabled = undefined;
        expect(dataManager.isQuestionDisabled('questionA')).toBeFalsy();
      });
    });
  });

  describe('setValueAndDisableQuestion', () => {
    let spy: Spy;

    beforeEach( () => {
      spy = spyOn(dataManager, 'setIn').and.callThrough();
    });

    it('should set and disable the field', () => {
      const control = dataManager.getControlByQuestionId('questionA');
      control.state.isDisabled = false;
      dataManager.setValueAndDisableQuestion('questionA', 2);
      expect(control.state.isDisabled).toBeTruthy();
      expect(dataManager.getById('questionA')).toBe(2);
      expect(spy).toHaveBeenCalled();
    });

    it('should  not call the set method when questionId is null', () => {
      dataManager.setValueAndDisableQuestion(null, 2);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call the set method when questionId is undefined', () => {
      dataManager.setValueAndDisableQuestion(undefined, 2);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call the set method  questionId is blank', () => {
      dataManager.setValueAndDisableQuestion('', 2);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call the set method when questionId does not correspond to an existing question', () => {
      dataManager.setValueAndDisableQuestion('undefinedQuestionId', 2);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Hiding/Showing Values', () => {
    it('should properly hide a value for a question', () => {
      dataManager.setChoices('questionA', [{value: 'A', state: {isHidden: false}}]);
      let control = dataManager.getControlByQuestionId('questionA');
      expect(control.choices[0].state.isHidden).toBeFalsy();

      dataManager.hideValue('questionA', 'A');
      control = dataManager.getControlByQuestionId('questionA');
      expect(control.choices[0].state.isHidden).toBeTruthy();
    });

    it('should properly hide a list of values for a question', () => {
      const choices = [{value: 'A', state: {isHidden: false}}, {value: 'B', state: {isHidden: false}}];
      dataManager.setChoices('questionA', choices);
      let choiceStates = dataManager.getControlByQuestionId('questionA').choices.map(c => c.state);
      choiceStates.forEach(choiceState => {
        expect(choiceState.isHidden).toBeFalsy();
      });

      dataManager.hideValues('questionA', ['A', 'B']);
      choiceStates = dataManager.getControlByQuestionId('questionA').choices.map(c => c.state);
      choiceStates.forEach(choiceState => {
        expect(choiceState.isHidden).toBeTruthy();
      });
    });

    it('should not hide a value when given an invalid value', () => {
      dataManager.setChoices('questionA', [{value: 'A', state: {isHidden: false}}]);
      let control = dataManager.getControlByQuestionId('questionA');
      expect(control.choices[0].state.isHidden).toBeFalsy();

      dataManager.hideValue('questionA', 'B');
      control = dataManager.getControlByQuestionId('questionA');
      expect(control.choices[0].state.isHidden).toBeFalsy();
    });

    it('should properly show a value for a question', () => {
      dataManager.setChoices('questionA', [{value: 'A', state: {isHidden: true}}]);
      let control = dataManager.getControlByQuestionId('questionA');
      expect(control.choices[0].state.isHidden).toBeTruthy();

      dataManager.showValue('questionA', 'A');
      control = dataManager.getControlByQuestionId('questionA');
      expect(control.choices[0].state.isHidden).toBeFalsy();
    });

    it('should properly show a list of values for a question', () => {
      const choices = [{value: 'A', state: {isHidden: true}}, {value: 'B', state: {isHidden: true}}];
      dataManager.setChoices('questionA', choices);
      let choiceStates = dataManager.getControlByQuestionId('questionA').choices.map(c => c.state);
      choiceStates.forEach(choiceState => {
        expect(choiceState.isHidden).toBeTruthy();
      });

      dataManager.showValues('questionA', ['A', 'B']);
      choiceStates = dataManager.getControlByQuestionId('questionA').choices.map(c => c.state);
      choiceStates.forEach(choiceState => {
        expect(choiceState.isHidden).toBeFalsy();
      });
    });

    it('should properly show all values for a question', () => {
      const choices = [
        {value: 'A', state: {isHidden: true}},
        {value: 'B', state: {isHidden: true}},
        {value: 'C', state: {isHidden: true}}
        ];
      dataManager.setChoices('questionA', choices);
      let choiceStates = dataManager.getControlByQuestionId('questionA').choices.map(c => c.state);
      choiceStates.forEach(choiceState => {
        expect(choiceState.isHidden).toBeTruthy();
      });

      dataManager.showAllValues('questionA');
      choiceStates = dataManager.getControlByQuestionId('questionA').choices.map(c => c.state);
      choiceStates.forEach(choiceState => {
        expect(choiceState.isHidden).toBeFalsy();
      });
    });

    it('should not show a value when given an invalid value', () => {
      dataManager.setChoices('questionA', [{value: 'A', state: {isHidden: true}}]);
      let control = dataManager.getControlByQuestionId('questionA');
      expect(control.choices[0].state.isHidden).toBeTruthy();

      dataManager.showValue('questionA', 'B');
      control = dataManager.getControlByQuestionId('questionA');
      expect(control.choices[0].state.isHidden).toBeTruthy();
    });
  });

  describe('Subscriptions', () => {

    it('should emit event to model subscribers', (done) => {
      subscription = dataManager.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:questionA`, (observed: IObservedModel) => {
        expect(observed.path).toEqual('mockCategory.mockSection.questionA');
        expect(observed.previousValue).toEqual(1);
        expect(observed.currentValue).toEqual(2);
        done();
      });
      dataManager.setById('questionA', 2);
    });

    it('should emit event only to model by id subscribers', (done) => {
      const subscriptionA = dataManager.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:questionA`, (observed: IObservedModel) => {
        expect(observed.path).toEqual('mockCategory.mockSection.questionA');
        expect(observed.previousValue).toEqual(1);
        expect(observed.currentValue).toEqual(2);
        subscriptionA.unsubscribe();
        done();
      });
      const subscriptionB = dataManager.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:questionB`, (observed: IObservedModel) => {
        subscriptionB.unsubscribe();
        done.fail(new Error('Should not have received event'));
      });
      dataManager.setById('questionA', 2);
    });

    it('should emit event to validation subscribers', (done) => {
      subscription = dataManager.subscribe(DataManagerSubscriptionType.VALIDATION, (result: IObservedValidation) => {
        expect(result.id).toEqual('questionA');
        expect(result.validationResult.isValid).toBeFalsy();
        expect(result.validationResult.messages.length).toBeGreaterThan(0);
        done();
      });
      dataManager.setById('questionA', 'badValue');
    });

    it('should emit event only to validation by id subscribers', (done) => {
      const subscriptionA = dataManager.subscribe(`${DataManagerSubscriptionType.VALIDATION}:questionA`, (result: IObservedValidation) => {
        expect(result.id).toEqual('questionA');
        expect(result.validationResult.isValid).toBeTruthy();
        expect(result.validationResult.messages.length).toEqual(0);
        subscriptionA.unsubscribe();
        done();
      });
      const subscriptionB = dataManager.subscribe(`${DataManagerSubscriptionType.VALIDATION}:questionB`, (result: IObservedValidation) => {
        subscriptionB.unsubscribe();
        done.fail(new Error('Should not have received event'));
      });
      dataManager.setById('questionA', 2);
    });

    it('should emit event to rules subscribers', (done) => {
      subscription = dataManager.subscribe(DataManagerSubscriptionType.RULES, (resolve: IObservedRule) => {
        expect(resolve.ids).toContain('questionA');
        expect(resolve.context).toEqual(jasmine.any(DataManager));
        done();
      });
      dataManager.setById('questionA', 2);
    });

    it('should emit state update event to form subscribers when model is updated', (done) => {
      subscription = dataManager.subscribe(DataManagerSubscriptionType.FORM, (newState: StateConfig) => {
        expect(newState.errors.length).toEqual(0);
        expect(newState.hasErrors).toBeFalsy();
        expect(newState.isValid).toBeTruthy();
        expect(newState.isDirty).toBeTruthy();
        done();
      });

      dataManager.setById('questionA', 2);
    });

    it('should emit event to section subscribers', (done) => {
      subscription = dataManager.subscribe(DataManagerSubscriptionType.SECTION, (sectionId: string) => {
        expect(sectionId).toEqual('mockSection');
        done();
      });
      formConfig.activateSectionById('mockSection');
    });

    it('should emit event only to section by id subscribers', (done) => {
      const subscriptionA = dataManager.subscribe(`${DataManagerSubscriptionType.SECTION}:mockSection`, (sectionId: string) => {
        expect(sectionId).toEqual('mockSection');
        subscriptionA.unsubscribe();
        done();
      });
      const subscriptionB = dataManager.subscribe(`${DataManagerSubscriptionType.SECTION}:mockSection2`, (sectionId: string) => {
        subscriptionB.unsubscribe();
        done.fail(new Error('Should not have received event'));
      });
      formConfig.activateSectionById('mockSection');
    });

    it('should emit event to category subscribers', (done) => {
      subscription = dataManager.subscribe(DataManagerSubscriptionType.CATEGORY, (categoryId: string) => {
        expect(categoryId).toEqual('mockCategory');
        done();
      });
      formConfig.activateCategoryById('mockCategory');
    });

    it('should emit event only to category by id subscribers', (done) => {
      const subscriptionA = dataManager.subscribe(`${DataManagerSubscriptionType.CATEGORY}:mockCategory`, (categoryId: string) => {
        expect(categoryId).toEqual('mockCategory');
        subscriptionA.unsubscribe();
        done();
      });
      const subscriptionB = dataManager.subscribe(`${DataManagerSubscriptionType.CATEGORY}:mockCategory2`, (categoryId: string) => {
        subscriptionB.unsubscribe();
        done.fail(new Error('Should not have received event'));
      });

      formConfig.activateCategoryById('mockCategory');
    });

    it('should throw an error when subscribing to invalid type', () => {
      const spy = spyOn(console, 'error');
      subscription = dataManager.subscribe('invalidType', () => {
      });
      expect(spy).toHaveBeenCalledWith('"invalidType" is not a valid subscription type.');
    });

    it('should be in a disabled state when the state is set to disabled', () => {
      dataManager.disable('questionA');
      const control = dataManager.getControlByQuestionId('questionA');
      expect(control.state.isDisabled).toBe(true);
    });

    it('should be in a required state when the state is set to disabled', () => {
      dataManager.require('questionA');
      const control = dataManager.getControlByQuestionId('questionA');
      expect(control.state.isRequired).toBe(true);
    });

    it('should be in a hidden state when the state is set to hidden', () => {
      dataManager.hide('questionA');
      const control = dataManager.getControlByQuestionId('questionA');
      expect(control.state.isHidden).toBe(true);
    });

    it('should not be in a disabled state when the state is set to not disabled', () => {
      dataManager.enable('questionA');
      const control = dataManager.getControlByQuestionId('questionA');
      expect(control.state.isDisabled).toBe(false);
    });

    it('should not be in a required state when the state is set to not required', () => {
      dataManager.optionalize('questionA');
      const control = dataManager.getControlByQuestionId('questionA');
      expect(control.state.isRequired).toBe(false);
    });

    it('should not be in a hidden state when the state is set to not hidden', () => {
      dataManager.show('questionA');
      const control = dataManager.getControlByQuestionId('questionA');
      expect(control.state.isHidden).toBe(false);
    });

    it('should set the choices of the form control', () => {
      dataManager.setChoices('questionA', [{label : 'Fully Underwritten', value : 'FLUW'} ]);
      const control = dataManager.getControlByQuestionId('questionA');
      expect(control.choices[0].label).toBe('Fully Underwritten');
      expect(control.choices[0].value).toBe('FLUW');
    });

    it('should return the correct category', () => {
      const category = dataManager.getCategoryById('mockCategory');
      expect(category.categoryId).toBe('mockCategory');
    });

    it('should be undefined when the ID does not exist', () => {
      const category = dataManager.getCategoryById('notFoundCategory');
      expect(category).toBeUndefined();
    });

    it('should return the id of the active cateogory', (done) => {
      subscription = dataManager.subscribe(DataManagerSubscriptionType.CATEGORY, () => {
        const id = dataManager.getActiveCategory();
        expect(id).toBe('mockCategory');
        done();
      });
      formConfig.activateCategoryById('mockCategory');
    });

  });
});
