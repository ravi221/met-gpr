import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IPlanAction} from 'app/plan/interfaces/iPlanAction';
import {IPlan} from '../../plan-shared/interfaces/iPlan';
import {ISortOption} from '../../../core/interfaces/iSortOption';

/**
 * A stub component for {@link PlanListComponent}
 */
@Component({selector: 'gpr-plan-list', template: ``})
export class PlanListStubComponent {
  @Input() canAddPlan: boolean = false;
  @Input() totalPlanCount: number = 0;
  @Input() isSearchingPlans: boolean = true;
  @Input() plans: IPlan[] = [];
  @Input() sortOptions: ISortOption[] = [];
  @Output() addPlanClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() planSelect: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortChange: EventEmitter<ISortOption> = new EventEmitter<ISortOption>();
  @Output() planAction: EventEmitter<IPlanAction> = new EventEmitter<IPlanAction>();
}
