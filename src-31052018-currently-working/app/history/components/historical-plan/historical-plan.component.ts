/**
 * Shows the historical plan information in a expand/collapse container
 */
import {Component, Input} from '@angular/core';
import {fadeInOut} from '../../../ui-controls/animations/fade-in-out';
import {AnimationState} from '../../../ui-controls/animations/AnimationState';
import {IHistoricalPlan} from '../../interfaces/iHistoricalPlan';

@Component({
  selector: 'gpr-historical-plan',
  template: `
    <div class="historical-plan">
      <gpr-expand-collapse-icon class="icon" [isExpanded]="true"
                                (expand)="toggleDetailsVisibility($event)"></gpr-expand-collapse-icon>

      <div class="plan-info">
        <div class="plan-name">
          {{historicalPlan.planName}}
        </div>
        <div class="text-muted plan-details">
          <span>Effective Date: {{historicalPlan.effectiveDate}}</span>Status: {{historicalPlan?.planStatus}}
        </div>
      </div>
      <section [@fadeInOut]="historicalPlanState">
        <gpr-historical-version-list [historicalVersions]="historicalPlan.historicalVersions"></gpr-historical-version-list>
      </section>
    </div>
  `,
  styleUrls: ['./historical-plan.component.scss'],
  animations: [fadeInOut]
})
export class HistoricalPlanComponent {

  /**
   * The currently historical plan.
   */
  @Input() historicalPlan: IHistoricalPlan;

  /**
   * The state of historical plan details
   * @type {AnimationState}
   */
  public historicalPlanState: AnimationState = AnimationState.VISIBLE;

  /**
   * Toggles the display of historical plan information details
   * @param {boolean} isExpanded
   */
  public toggleDetailsVisibility(isExpanded: boolean): void {
    this.historicalPlanState = isExpanded ? AnimationState.VISIBLE : AnimationState.HIDDEN;
  }
}
