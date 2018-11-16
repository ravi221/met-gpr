import {CategoryActionLabel} from 'app/plan/enums/category-action-label';
import {CompletionStatus} from 'app/plan/enums/completion-status';
import {isNil} from 'lodash';
import {PlanStatus} from '../../plan/enums/plan-status';

/**
 * Class used to help centralize helper methods when working with plans
 */
export class PlanHelper {

  /**
   * Holds the different colors based on completion status
   */
  private static readonly _statusColors = {
    [CompletionStatus.COMPLETE.toUpperCase()]: 'green',
    [CompletionStatus.IN_PROGRESS.toUpperCase()]: 'yellow',
    [CompletionStatus.NOT_STARTED.toUpperCase()]: 'red',
  };

  /**
   * Collection of Plan Statuses that should be readonly
   */
  private static readonly _readOnlyPlanStatuses: PlanStatus[] = [PlanStatus.CANCELLED];

  /**
   * Returns a color to be used to display the plan status in on the UI
   * @param {string} planStatus status to get the color for
   */
  static getDisplayColorByStatus(planStatus: string): string {
    if (!isNil(planStatus)) {
      return this._statusColors[planStatus.toUpperCase()];
    }
    return null;
  }

  /**
   * Return PlanStatus Based on completetion percentage
   * @param {number} completionPercentage percentage to get plan status from
   */
  static getCompletionStatusByCompletionPercentage(completionPercentage: number): CompletionStatus {
    if (isNil(completionPercentage) || completionPercentage <= 0) {
      return CompletionStatus.NOT_STARTED;
    } else if (completionPercentage > 0 && completionPercentage < 100) {
      return CompletionStatus.IN_PROGRESS;
    } else if (completionPercentage === 100) {
      return CompletionStatus.COMPLETE;
    }
    return CompletionStatus.NOT_STARTED;
  }

  /**
   * Returns a unique Id based on plan and category Id
   * @param {string} planId Id of plan to be used for unique categoryId
   * @param {string} categoryId Id of category to be used for unique categoryId
   */
  static getUniqueCategoryId(planId: string, categoryId: string): string {
    if (isNil(planId) || isNil(categoryId)) {
      return '';
    }
    return planId + '-' + categoryId;
  }

  /**
   * Return ActionButtonLabel Based on completetion percentage
   * @param {number} completionPercentage percentage to get Action Button Label
   */
  static getActionButtonLabelByCompletionPercentage(completionPercentage: number, planStatus: PlanStatus = null): CategoryActionLabel {

    if (PlanHelper.isPlanReadOnly(planStatus)) {
      return CategoryActionLabel.VIEW;
    }

    if (isNil(completionPercentage) || completionPercentage <= 0) {
      return CategoryActionLabel.START;
    } else if (completionPercentage > 0 && completionPercentage < 100) {
      return CategoryActionLabel.RESUME;
    } else if (completionPercentage === 100) {
      return CategoryActionLabel.EDIT;
    }
    return CategoryActionLabel.START;
  }

  static isPlanReadOnly(planStatus: PlanStatus): boolean {
    return this._readOnlyPlanStatuses.includes(planStatus);
  }
}
