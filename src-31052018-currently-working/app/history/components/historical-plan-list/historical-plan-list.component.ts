import {Component, Input} from '@angular/core';
import {IHistoricalPlan} from '../../interfaces/iHistoricalPlan';

/**
 * Represents a historical plan
 */
@Component({
  selector: 'gpr-historical-plan-list',
  template: `
    <div class="section">
      <div class="historical-plan-list" *ngFor="let historicalPlan of historicalPlans">
        <gpr-historical-plan [historicalPlan]="historicalPlan"></gpr-historical-plan>
      </div>
    </div>
  `,
  styleUrls: ['./historical-plan-list.component.scss']
})
export class HistoricalPlanListComponent {

  /**
   * A historical plans to be displayed
   */
  @Input() historicalPlans: IHistoricalPlan[] = [];

}
