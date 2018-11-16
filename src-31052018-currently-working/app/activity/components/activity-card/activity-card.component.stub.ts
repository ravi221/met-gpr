import {Component, Input} from '@angular/core';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';

/**
 * Stub of {@link ActivityCardComponent}
 */
@Component({selector: 'gpr-activity-card', template: ``})
export class ActivityCardStubComponent {
  @Input() customer: ICustomer;
  @Input() plan?: IPlan;
}
