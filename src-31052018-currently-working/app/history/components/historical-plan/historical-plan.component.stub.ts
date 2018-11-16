/**
 *  A stub component for {@link HistoricalPlanComponent}
 */
import {Component, Input} from '@angular/core';
import {IHistoricalPlan} from '../../interfaces/iHistoricalPlan';

@Component({selector: 'gpr-historical-plan', template: ``})
export class HistoricalPlanStubComponent {
  @Input() historicalPlan: IHistoricalPlan;
}
