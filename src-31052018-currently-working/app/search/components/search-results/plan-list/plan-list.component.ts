import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IPlan} from '../../../../plan/plan-shared/interfaces/iPlan';

/**
 * Displays a list of plan search results
 *
 * Usage:
 * ```html
 *    <gpr-search-plan-list [plans]="plans"
 *                          (planClick)="fn($event)"></gpr-search-plan-list>
 * ```
 */
@Component({
  selector: 'gpr-search-plan-list',
  template: `
    <div class="search-plan-list">
      <gpr-search-plan-list-item *ngFor="let plan of plans"
                                 [plan]="plan"
                                 (planClick)="onPlanClick($event)"></gpr-search-plan-list-item>
    </div>
  `
})
export class SearchPlanListComponent {

  /**
   * The list of plans to display
   */
  @Input() plans: IPlan[] = [];

  /**
   * Emits a plan id when a plan has been clicked
   * @type {EventEmitter<string>}
   */
  @Output() planClick: EventEmitter<string> = new EventEmitter<string>();

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * When a plan is clicked, emit the plan id
   * @param {string} planId
   */
  public onPlanClick(planId: string): void {
    this.planClick.emit(planId);
  }
}
