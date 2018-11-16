import RuleConfig from './rule-config';
import SectionConfig from './section-config';
import {StateResolver} from './state-resolver';
import {CompletionStatus} from '../../plan/enums/completion-status';
import {PlanHelper} from '../../navigation/classes/plan-helper';
import StateConfig from '../../forms-controls/config/state-config';

/**
 * A category is the highest level of subdivision within a plan form. Links
 * to categories can be found on the plan home page, or in the main navigation
 * menu directly below an expanded plan.
 */
export default class CategoryConfig extends StateResolver {
  /**
   * A unique identifier for the category. When the view config is loaded in
   * the UI, these IDs will be used to build a map for O(1) access.
   */
  public categoryId: string;

  /**
   * The label which will appear in the UI to identify the category. This will
   * be the header for the category, and the text bound to any links to this category.
   */
  public label: string;

  /**
   * The index specifying where this category should appear relative to the others.
   * Lower-indexed categories appear first in the UI.
   */
  public order: number;

  /**
   * Any rules which will be run when the category is initialized or changed.
   */
  public rules?: RuleConfig;

  /**
   * An array of the sections which will be displayed within this category.
   */
  public sections: Array<SectionConfig>;

  /**
   * The text of the status displayed to the user
   */
  public statusCode?: CompletionStatus;

  /**
   * indicates the category is complete
   */
  public isComplete: boolean = false;

  /**
   * The class used to style the status
   */
  public statusClass?: string;
  
  public completionPercentage?: number;

  /**
   * Construct a new instance from a JSON representation of the Category
   */
  constructor(json: any, onStateUpdate: (sourceId: string, newState: StateConfig) => void) {
    super(json.categoryId, json.state, onStateUpdate);
    this.categoryId = json.categoryId;
    this.label = json.label;
    this.order = json.order;
    this.rules = json.rules ? new RuleConfig(json.rules) : undefined;
    this.sections = json.sections
      .map(sectionJson => new SectionConfig(sectionJson, this._onChildUpdate))
      .sort((n1, n2) => n1.order - n2.order);
  }

  /**
   * Sets the status of the category
   * @param {number} completionPercentage
   */
  public setStatusCode(completionPercentage: number): void {
    this.statusCode = PlanHelper.getCompletionStatusByCompletionPercentage(completionPercentage);
    if (CompletionStatus[this.statusCode.toUpperCase()] === CompletionStatus.COMPLETE) {
      this.isComplete = true;
    }
    this.statusClass = PlanHelper.getDisplayColorByStatus(this.statusCode);
  }
}
