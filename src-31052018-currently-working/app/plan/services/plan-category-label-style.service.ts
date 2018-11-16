import {Injectable} from '@angular/core';
import {CategoryIconState} from 'app/plan/enums/category-icon-state';
import {CategoryActionStyle} from 'app/plan/enums/category-action-style';

/**
 * Service to fetch the category and section level icons, styles
 */
@Injectable()
export class PlanCategoryLabelStyleService {

  /**
   * Method used to handle the category level icon state based on completion percentage and section level validation indicator
   * @param completionPercentage: number
   * @param sectionValidationStatus: string
   */
  public getIconState(completionPercentage: number, sectionValidationStatus: string) {
    if (completionPercentage === 100
      && sectionValidationStatus === 'Y') {
      return CategoryIconState.ON;
    } else if (completionPercentage === 100
      && sectionValidationStatus === 'N') {
      return CategoryIconState.OFF;
    }
    return CategoryIconState.EMPTY;
  }

  /**
   * Method used to handle the category level action buttons based on completion percentage
   * @param completionPercentage: number
   */
  public getActionStyle(completionPercentage: number) {
    if (completionPercentage === 100) {
      return CategoryActionStyle.TERTIARY;
    }
    return CategoryActionStyle.SECONDARY;
  }
}
