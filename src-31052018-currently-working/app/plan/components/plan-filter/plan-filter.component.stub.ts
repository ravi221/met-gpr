import {Component, Input} from '@angular/core';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {PlanFilterContextTypes} from '../../enums/plan-filter-context';

/**
 * A stub component for {@link PlanFilterComponent}
 */
@Component({selector: 'gpr-plan-filter', template: ``})
export class PlanFilterStubComponent {
  @Input() customer: ICustomer;
  @Input() context: PlanFilterContextTypes = PlanFilterContextTypes.CUSTOMER_HOME_PAGE;
}
