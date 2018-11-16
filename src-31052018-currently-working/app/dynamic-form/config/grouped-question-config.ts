import {IFormItemConfig} from './iFormItemConfig';
import QuestionConfig from './question-config';
import {FormItemType} from '../enumerations/form-items-type';
import {FormGroupType} from '../enumerations/form-group-type';
import StateConfig from '../../forms-controls/config/state-config';

/**
 * Contains the configuration for grouped formItems
 */
export class GroupedQuestionConfig implements IFormItemConfig {
  /**
   * The index of the group
   */
  public order: number;
  /**
   * The text label of the group
   */
  public label: string;
  /**
   * The unique id associated with the group
   */
  public formItemId: string;

  /**
   * The child formItems of the group
   */
  public questions: QuestionConfig[];

  /**
   * Grouped formItems within the grouped question. Optional.
   */
  public groupedQuestions?: GroupedQuestionConfig[];

  /**
   * The type of group
   */
  public groupType: FormGroupType;

  /**
   * an array of form items
   * @type {IFormItemConfig[]}
   */
  public formItems: IFormItemConfig[] = [];

  /**
   * Maintains the value of other for grouped others. This is an optional value
   */
  public valueOfOther?: string | number;

  /**
   * Parse the input json adn construct all of the child formItems
   * @param json
   * @param {(sourceId: string, newState: StateConfig) => void} onStateUpdate
   */
  constructor(json: any, onStateUpdate: (sourceId: string, newState: StateConfig) => void) {
    this.order = json.order;
    this.label = json.label;
    this.formItemId = json.groupId;
    this.groupType = json.type;
    if (json.questions) {
      json.questions  = json.questions.filter( (question) => question.order > 0);
      this.questions = json.questions
        .map(questionJson => new QuestionConfig( questionJson, onStateUpdate));
      this.formItems = this.formItems.concat(this.questions);
    }
    if (json.groupedQuestions) {
      json.groupedQuestions = json.groupedQuestions.filter( (question) => question.order > 0);
      this.groupedQuestions = json.groupedQuestions.
      map( (groupedQuestionJson) => new GroupedQuestionConfig(groupedQuestionJson, onStateUpdate));
      this.formItems = this.formItems.concat(this.groupedQuestions);
    }
    if (json.otherValue) {
      this.valueOfOther = json.otherValue;
    }
    this.formItems.sort( (n1, n2) => n1.order - n2.order);
  }

  /**
   * Returns group formItems.
   * @returns {FormItemType}
   */
  public getType(): FormItemType {
    return FormItemType.GROUPED_QUESTION;
  }

  /**
   * Counts the total number of questions in the group. The base case is the config is not a vertical grouping. Grouped others and tables count as one question for counting
   * @returns {number}
   */
  public getQuestionCount(): number {
    let totalCount = 0;
    if (this.groupType === FormGroupType.VERTICAL_GROUP) {
        totalCount += this._countVerticalGroup();
    } else {
      totalCount += 1;
    }

    return totalCount;
  }

  /**
   * Recursive call to count each item in a vertical group
   * @returns {number}
   * @private
   */
  private _countVerticalGroup(): number {
    let count = 0;
    this.formItems.forEach( (formItem) => {
      if (formItem instanceof GroupedQuestionConfig) {
        count += formItem.getQuestionCount();
      } else {
        count += 1;
      }
    });
    return count;
  }


}
