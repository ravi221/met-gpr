import {Component, Input} from '@angular/core';
import {IHistoricalPlan} from '../../interfaces/iHistoricalPlan';

/**
 * A stub component for {@link HistoricalPlanListComponent}
 */
@Component({selector: 'gpr-historical-plan-list', template: ``})
export class HistoricalPlanListStubComponent {
  @Input() historicalPlans: IHistoricalPlan[] = [];
}
