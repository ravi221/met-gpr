import SchemaConfig from './schema-config';
import RuleConfig from './rule-config';
import FormControlConfig from './form-control-config';
import {IFormItemConfig} from './iFormItemConfig';
import {FormItemType} from '../enumerations/form-items-type';
import HelpConfig from './help-config';
import StateConfig from '../../forms-controls/config/state-config';

/**
 * The answer to each Question represents a single piece of data on a plan.
 * Each question is bound to a plan attribute, and defines a form control
 * which the user will use to modify the value of that attribute.
 */
export default class QuestionConfig implements IFormItemConfig {
  /**
   * Represent the schema associated with this question
   */
  private _schema: SchemaConfig;

  /**
   * A unique identifier for the question.  This should be unique within
   * the entire form, not just within the section.  When the view config
   * is loaded in the UI, these IDs will be used to build a map for O(1)
   * access.
   */
  public formItemId: string;

  /**
   * The index specifying where this question should appear relative to
   * the others in the same section. Lower-indexed questions appear first
   * in the UI.
   */
  public order: number;

  /**
   *  The question text that will be displayed above the form control.
   */
  public label: string;

  /**
   * A string representing the path to the correct attribute in the plan
   * object. A question with model 'PRVD.DFCLT_CD' will be bound to the
   * difficulty code in the plan provisions, at PLN.PRVD.DFCLT_CD.
   */
  public model: string;

  /**
   * A configuration for the form control which will be displayed in the
   * UI and used to modify the model.
   */
  public control: FormControlConfig;

  /**
   *  Any rules which will be run when the question is initialized or
   *  changed, or when an error occurs.
   */
  public rules: RuleConfig;

  /**
   * Help data that will displayed for each question.
   */
  public help: HelpConfig;

  /**
   * The view model of the question. Use for mapping to the answer
   */
  public viewModel: string;

  /**
   * Indicates the checkbox to be true/false
   */
  public isChecked: boolean;

  /**
   * Indicates the answered question
   */
  public questionAnswer: string;

  /**
   * The ids of any questions that must also be sent for validation when
   * this question is sent for validation.  Whenever it is defined, and
   * not empty, that means PPC has a corresponding feature for this question
   * and that at least one PPC validation uses the features corresponding to
   * this and at least one other question.
   */
  public dependentQuestions: Array<String>;

  /**
   * Constructs a new instance from a JSON representation of the Question
   */
  constructor(json: any, onStateUpdate: (sourceId: string, newState: StateConfig) => void) {
    this.formItemId = json.questionId;
    this.order = json.order;
    this.label = json.label;
    this.model = json.model;
    this.viewModel = json.viewModel;
    this.control = new FormControlConfig(json.questionId, json.control, onStateUpdate);
    this.rules = json.rules ? new RuleConfig(json.rules) : undefined;
    this.dependentQuestions = json.dependentQuestions ? json.dependentQuestions : undefined;
    this.schema = json.schema ? new SchemaConfig(json.schema) : undefined;
    this.help = json.help ? new HelpConfig(json.help) : undefined;
  }

  /**
   * The {@link http://json-schema.org/|JSON Schema} which controls the
   * allowed values for the plan attribute
   */
  public get schema(): SchemaConfig {
    Object.keys(this._schema).forEach(key => !this._schema[key] && delete this._schema[key]);
    return this._schema;
  }

  /**
   * Sets the schema for a question
   * @param {SchemaConfig} schema
   */
  public set schema(schema: SchemaConfig) {
    this._schema = schema;
  }

  /**
   * Returns single question
   * @returns {FormItemType}
   */
  public getType(): FormItemType {
    return FormItemType.SINGLE_QUESTION;
  }
}
