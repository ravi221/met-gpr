import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IPlan} from '../../../../plan/plan-shared/interfaces/iPlan';

/**
 * A stub component for {@link SearchPlanListComponent}
 */
@Component({selector: 'gpr-search-plan-list', template: ``})
export class SearchPlanListStubComponent {
  @Input() plans: IPlan[] = [];
  @Output() planClick: EventEmitter<string> = new EventEmitter<string>();
}
