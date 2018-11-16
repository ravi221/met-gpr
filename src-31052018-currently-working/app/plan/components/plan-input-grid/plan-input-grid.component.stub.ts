import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {IPlanInputTemplate} from '../../interfaces/iPlanInputTemplate';
import {IPlan} from 'app/plan/plan-shared/interfaces/iPlan';
import {PlanModes} from 'app/plan/enums/plan-modes';

/**
 * A stub component for {@link PlanInputGridComponent}
 */
@Component({selector: 'gpr-plan-input-grid', template: ``})
export class PlanInputGridStubComponent {
  @Input() plans: IPlan[] = [];
  @Input() customer: ICustomer;
  @Input() planMode: PlanModes = PlanModes.CREATE;
  @Input() allowScroll: boolean = false;
  @Output() plansCreate: EventEmitter<IPlanInputTemplate[]> = new EventEmitter<IPlanInputTemplate[]>();
}
