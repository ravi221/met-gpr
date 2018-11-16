import QuestionConfig from './question-config';
import RuleConfig from './rule-config';
import {StateResolver} from './state-resolver';
import {IFormItemConfig} from './iFormItemConfig';
import {GroupedQuestionConfig} from './grouped-question-config';
import StateConfig from '../../forms-controls/config/state-config';

/**
 * A section is a further level of subdivision within a plan form. When a
 * section is selected, the user will be presented with a form for answering
 * the formItems. Links to sections can be found on the left of the page
 * when a category is selected, or in the main navigation menu directly below
 * an expanded category.
 */
export default class SectionConfig extends StateResolver {
  /**
   * A unique identifier for the section. This should be unique within the
   * entire form, not just within the category. When the view config is loaded
   * in the UI, these IDs will be used to build a map for O(1) access.
   */
  public sectionId: string;

  /**
   * The index specifying where this section should appear relative to the
   * others in the same category. Lower-indexed sections appear first in the UI.
   */
  public order: number;

  /**
   * The label which will appear in the UI to identify the section. This will
   * be the header for the section, and the text bound to any links to this
   * section.
   */
  public label: string;

  /**
   * Any rules which will be run when the section is initialized or changed.
   */
  public rules?: RuleConfig;

  /**
   * An array of the formItems which will be displayed within this section.
   */
  public questions: QuestionConfig[];

  /**
   * An array of items that will be rendered on the form
   */
  public formItems: IFormItemConfig[];

  /**
   * The number of formItems answer in the section
   */
  public answeredRequiredQuestionCount: number = 0;

  /**
   * The number of required formItems
   */
  public requiredQuestionCount: number = 0;

  /**
   * Grouped Questions
   */
  public groupedQuestions: GroupedQuestionConfig[];

  /**
   * Construct a new instance from a JSON representation of the Section
   */
  constructor(json: any, onStateUpdate: (sourceId: string, newState: StateConfig) => void) {
    super(json.sectionId, json.state, onStateUpdate);
    this.sectionId = json.sectionId;
    this.order = json.order;
    this.label = json.label;
    this.rules = json.rules ? new RuleConfig(json.rules) : undefined;
    this.formItems = [];
    if (json.questions) {
      json.questions = json.questions.filter((questions) => questions.order > 0);
      this.questions = json.questions
        .map(questionJson => new QuestionConfig( questionJson, this._onChildUpdate));
      this.formItems = this.formItems.concat(this.questions);
    }

    if (json.groupedQuestions) {
      json.groupedQuestions = json.groupedQuestions.filter( (formItem) => formItem.order > 0);
      this.groupedQuestions = json.groupedQuestions.
        map( (groupedQuestionJson) => new GroupedQuestionConfig(groupedQuestionJson, this._onChildUpdate));
      this.formItems = this.formItems.concat(this.groupedQuestions);
    }
    this.formItems.sort( (n1, n2) => n1.order - n2.order);
  }
}
