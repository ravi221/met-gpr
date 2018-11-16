import {IPlanSection} from 'app/plan/plan-shared/interfaces/iPlanSection';
import {CompletionStatus} from '../../enums/completion-status';
/**
 * Interface used by to define what a Plan Category Object should contain
 */
export interface IPlanCategory {
  /**
   * The unique id for the category
   */
  categoryId: string;

  /**
   * The name of the category
   */
  categoryName: string;

  /**
   * the percentage complete of the category
   */
  completionPercentage: number;

  /**
   * The sections of a category
   */
  sections: IPlanSection[];

  /**
   * The status of the plan
   */
  statusCode: CompletionStatus;

  /**
   * Indicates if there are validation issues
   */
  validationIndicator: string;

  /**
   * Indicates the error count
   */
  errorCount: number;
}
