import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlan} from '../../../../plan/plan-shared/interfaces/iPlan';
import {isNil} from 'lodash';
import {IconType} from '../../../../ui-controls/enums/icon-type';

/**
 * Displays a single plan search result with an icon for each product type, the name of the plan,
 * and a subtitle with the effective date and completion percentage
 *
 * Usage:
 * ```html
 *       <gpr-search-plan-list-item [plan]="plan" (planClick)="fn($event)"></gpr-search-plan-list-item>
 * ```
 */
@Component({
  selector: 'gpr-search-plan-list-item',
  template: `
    <gpr-search-result
      [title]="plan.planName"
      [subtitle]="planSubtitle"
      [icon]="planIcon"
      (searchResultClick)="onSearchResultClick()">
    </gpr-search-result>
  `
})
export class SearchPlanListItemComponent implements OnInit {

  /**
   * The plan result to display
   */
  @Input() plan: any;

  /**
   * Event emitter called when a plan is clicked, emits the plan id
   * @type {EventEmitter<IPlan>}
   */
  @Output() planClick: EventEmitter<string> = new EventEmitter<string>();

  /**
   * The subtitle for the plan
   */
  public planSubtitle: string;

  /**
   * The icon to display, based on the coverage id
   */
  public planIcon: string;

  /**
   * On init, sets the plan's subtitle and icon
   */
  ngOnInit(): void {
    this.planSubtitle = `Effective: ${this.plan.effectiveDate}, ${this.plan.completionPercentage}% Complete`;
    this.planIcon = this._getPlanIcon(this.plan.productType);
  }

  /**
   * Function called when the plan is clicked
   */
  public onSearchResultClick(): void {
    const planId = this.plan.planIds[0];
    this.planClick.emit(planId);
  }

  /**
   * Gets the plan icon to display for a given coverageId
   * @returns {string} An icon to display next to the plan
   * @private
   */
  private _getPlanIcon(productType: string): string {
    if (isNil(productType)) {
      return IconType.PLANDOC;
    }
    const icon = productType.toLowerCase();
    return icon === IconType.VOLUNTARY ? IconType.PLANDOC : icon;
  }
}
