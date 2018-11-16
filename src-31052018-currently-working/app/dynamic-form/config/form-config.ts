import QuestionConfig from './question-config';
import SectionConfig from './section-config';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import CategoryConfig from './category-config';
import FormControlConfig from './form-control-config';
import RuleConfig from './rule-config';
import SchemaConfig from './schema-config';
import DataManager from '../classes/data-manager';
import {isNil} from 'lodash';
import {StateResolver} from './state-resolver';
import {IFormItemConfig} from './iFormItemConfig';
import {GroupedQuestionConfig} from './grouped-question-config';
import StateConfig from '../../forms-controls/config/state-config';
import {INavState} from '../../navigation/interfaces/iNavState';

/**
 * Represents the default state of a form config
 */
const DEFAULT_STATE = {
  isHidden: false,
  isDisabled: false,
  isValid: true,
  isDirty: false
};

/**
 * For each coverage, we specify how the view will appear and behave by using a JSON configuration
 * file, which will be stored in the GPR database. The initial version of the view metadata will
 * be generated based on the Data Mapping Spreadsheet, the Erwin data model sheet, the PPC model,
 * and a view definition spreadsheet from the business. Rules will then be added manually.
 */
export default class FormConfig extends StateResolver {

  /**
   * A map of category ids to category configurations
   * @type {Map<string, CategoryConfig>}
   * @private
   */
  private _categoriesById: Map<string, CategoryConfig> = new Map<string, CategoryConfig>();

  /**
   * A map of section ids to section configurations
   * @type {Map<string, SectionConfig>}
   * @private
   */
  private _sectionsById: Map<string, SectionConfig> = new Map<string, SectionConfig>();

  /**
   * A map of question ids to question configurations
   * @type {Map<string, IFormItemConfig>}
   * @private
   */
  private _formItemsById: Map<string, IFormItemConfig> = new Map<string, IFormItemConfig>();

  /**
   * A form subject to watch the state change
   * @type {Subject<StateConfig>}
   * @private
   */
  private _formSubject: Subject<StateConfig> = new Subject<StateConfig>();

  /**
   * Stores the current active category id
   */
  private _activeCategoryId: string;

  /**
   * Stores the current active section id
   */
  private _activeSectionId: string;

  /**
   * An observable to which a consumer can subscribe for updates to the form's state
   */
  public source: Observable<StateConfig> = this._formSubject.asObservable();

  /**
   * A unique identifier for the form - typically the coverage id
   */
  public id: string;

  /**
   * The view configuration will be versioned similarly to the plan
   * schema - this field will store the version number.
   */
  public version: string;

  /**
   *  The title of the form - typically the coverage name. This will not
   *  be bound to the UI - it is intended to provide a human-readable identifier
   *  for the form, since the coverage ID requires a lookup.
   */
  public title: string;

  /**
   * An array of the {@link CategoryConfig|categories} which will be displayed for this coverage type.
   */
  public categories: Array<CategoryConfig>;

  /**
   * A subject to emit event whenever a section has been switched out.
   * @type {Subject<string>}
   */
  public onSectionChange: Subject<string> = new Subject<string>();

  /**
   * A subject to emit event whenever a category has been switched out.
   * @type {Subject<string>}
   */
  public onCategoryChange: Subject<string> = new Subject<string>();

  /**
   * Construct a new FormConfig
   * @param json - a JSON representation of the form config.
   */
  constructor(json: any) {
    super(json.formId, DEFAULT_STATE, (sourceId: string, newState: StateConfig) => {
      this.emitFormChange(newState);
    });
    this.id = json.formId;
    this.version = json.version;
    this.title = json.title;
    this.categories = json.categories
      .map(categoryJson => new CategoryConfig(categoryJson, this._onChildUpdate))
      .sort((n1, n2) => n1.order - n2.order);
    this.initializeMap();
  }

  /**
   * The id of the {@link CategoryConfig} that's currently active.
   */
  public get activeCategoryId(): string {
    return this._activeCategoryId;
  }

  /**
   * The id of the {@link SectionConfig} that's currently active.
   */
  public get activeSectionId(): string {
    return this._activeSectionId;
  }

  /**
   * An array of all {@link QuestionConfig|questions} on the form
   */
  public get questions(): Array<IFormItemConfig> {
    return Array.from(this._formItemsById.values());
  }

  /**
   * Get a category by its id.  This will be available from the rules.
   * @param {string} id The id of a category
   * @returns {CategoryConfig} The category
   */
  public getCategory(id: string): CategoryConfig {
    return id ? this._categoriesById.get(id) : undefined;
  }

  /**
   * Get a section by its id.  This will be available from the rules.
   * @param {string} id The id of a section
   * @returns {SectionConfig} The section
   */
  public getSection(id: string): SectionConfig {
    return id ? this._sectionsById.get(id) : undefined;
  }


  /**
   * Sets the value of a section by its id
   * @param {string} id
   * @param {SectionConfig} section
   */
  public setSectionById(id: string, section: SectionConfig): void {
    this._sectionsById.set(id, section);
  }

  /**
   * Get a question by its id.  This will be available from the rules.
   * @param {string} id The id of a question
   * @returns {QuestionConfig} The question
   */
  public getQuestion(id: string): IFormItemConfig {
    return id ? this._formItemsById.get(id) : undefined;
  }

  /**
   * Get a control by the id of its question.  This will be available from the rules.
   * @param {string} id The id of a question
   * @returns {FormControlConfig} The control config for that question
   */
  public getControl(id: string): FormControlConfig {
    if (this._hasQuestion(id)) {
      const questionConfig = this._formItemsById.get(id) as QuestionConfig;
      return questionConfig.control;
    }
  }

  /**
   * Get the path through the plan object to the data bound to the answer to a question,
   * by the id of that question
   *
   * ```typescript
   * formConfig.getValue('planName'); // returns 'PLN_NM'
   * ```
   *
   * @param {string} id The id of a question
   * @returns {string} The path representing the field in the plan corresponding to that question's data
   */
  public getPath(id: string): string {
    if (this._hasQuestion(id)) {
      const questionConfig = this._formItemsById.get(id) as QuestionConfig;
      return questionConfig.viewModel;
    }
  }

  /**
   * Get rules by question id
   * @param {string} id The id of a question
   * @returns {RuleConfig} The rules which run for that question
   */
  public getRules(id: string): RuleConfig {
    if (this._hasQuestion(id)) {
      const questionConfig = this._formItemsById.get(id) as QuestionConfig;
      return questionConfig.rules;
    }
  }

  /**
   * Get schema by question id
   * @param {string} id The id of a question
   * @returns {SchemaConfig} The JSON Schema for that question's value
   */
  public getSchema(id: string): SchemaConfig {
    if (this._hasQuestion(id)) {
      const questionConfig = this._formItemsById.get(id) as QuestionConfig;
      return questionConfig.schema;
    }
  }

  /**
   * Given a property of a {@link QuestionConfig|question} and a value, return
   * the id of a question for which that property has that value
   *
   * ```typescript
   * formConfig.getQuestionId('model', 'PLN_NM'); // returns 'planName'
   * ```
   *
   * @param {string} prop The name of the property to match
   * @param value The name of the value to match
   * @returns {string} The id of a question for which 'prop' has the value 'value'
   */
  public getQuestionId(prop: string, value: any) {
    return Array.from(this._formItemsById.keys())
      .find(key => this._formItemsById.get(key)[prop] === value);
  }

  /**
   * Activates a {@link SectionConfig} and emits the activation.
   * @param {string} sectionId
   * @returns {Subject<string>}
   */
  public activateSectionById(sectionId: string): Subject<string> {
    const section = this.getSection(sectionId);
    if (section && !section.state.isHidden && !section.state.isDisabled) {
      this._activeSectionId = sectionId;
      this.onSectionChange.next(sectionId);
    }
    return this.onSectionChange;
  }

  /**
   * Activates a {@link CategoryConfig} and emits the activation.
   * @param {string} categoryId
   * @returns {Subject<string>}
   */
  public activateCategoryById(categoryId: string): Subject<string> {
    const category = this.getCategory(categoryId);
    if (category && !category.state.isHidden && !category.state.isDisabled) {
      this._activeCategoryId = categoryId;
      this.onCategoryChange.next(categoryId);
    }
    return this.onCategoryChange;
  }

  /**
   * Determines whether a control or form is valid.
   * @param {string} id
   * @returns {boolean}
   */
  public isValid(id?: string): boolean {
    if (id) {
      const control = this.getControl(id);
      return control.state.isValid;
    }
    return this.state.isValid;
  }

  /**
   * Initialization method to create a new {@link DataManager} instance of the provided data model.
   * @param model
   * @returns {DataManager}
   */
  public initializeModel(navState: INavState): DataManager {
    return new DataManager(this, navState);
  }

  /**
   * Private method to initialize all respective maps for categories, sections and formItems to allow for quick lookups.
   */
  private initializeMap(): void {
    this.categories.forEach(category => {
      this._categoriesById.set(category.categoryId, category);
      category.sections.forEach(section => {
        this._sectionsById.set(section.sectionId, section);
        this._iterateOverFormItems(section.formItems);
      });
    });
  }

  /**
   * Iterates over the formItems and adds them to map. Recursive for groups
   * @param {IFormItemConfig[]} formItems
   * @private
   */
  private _iterateOverFormItems(formItems: IFormItemConfig[]): void {
    formItems.forEach(formItem => {
      if (formItem instanceof QuestionConfig) {
        this._formItemsById.set(formItem.formItemId, formItem);
      } else {
        const group = formItem as GroupedQuestionConfig;
        this._iterateOverFormItems(group.formItems);
      }
    });
  }

  /**
   * Private method to emit an event indicating to all subscribers to the source that the state of the form has changed.
   * @param {StateConfig} newState
   */
  private emitFormChange = (newState: StateConfig): void => {
    if (!isNil(newState)) {
      this._formSubject.next(newState);
    }
  }

  /**
   * Returns true if the question exists and it is of type questionConfig
   * @param {string} id
   * @returns {boolean}
   * @private
   */
  private _hasQuestion(id: string): boolean {
    return id && this._formItemsById.has(id) && this._formItemsById.get(id) instanceof QuestionConfig;
  }
}
