import {Component, Input} from '@angular/core';
import {IPlanSection} from 'app/plan/plan-shared/interfaces/iPlanSection';
import {NavigatorService} from 'app/navigation/services/navigator.service';

@Component({
  selector: 'gpr-plan-category-section-list',
  template: `
   <gpr-plan-category-section-list-template [section]="section" (click)="navigate()" ></gpr-plan-category-section-list-template>
  `
})
export class PlanCategorySectionListComponent {

  /**
   * The id of the customer
   */
  @Input() customerNumber: number;

  /**
   * The id of the plan
   */
  @Input() planId: string;

  /**
   * The id of the category
   */
  @Input() categoryId: string;

  /**
   * The section corresponding to this row
   */
  @Input() section: IPlanSection;

  /**
   * It handles which screen to navigate
   * @param {NavigatorService} _navigator
   */
  constructor(private _navigator: NavigatorService) {
  }

  /**
   * Uses the navigator to navigate to the respective screens.
   */
  public navigate(): void {
    if (this.customerNumber && this.planId && this.categoryId && this.section.sectionId) {
      this._navigator.goToPlanEntrySectionFromNav(this.customerNumber, this.planId, this.categoryId, this.section.sectionId);
    }
  }

}
