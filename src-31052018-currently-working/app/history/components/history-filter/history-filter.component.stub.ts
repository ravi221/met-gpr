import {Component, Input} from '@angular/core';
import {ICustomer} from '../../../customer/interfaces/iCustomer';

/**
 * A stub component for {@link HistoryFilterComponent}
 */
@Component({
  selector: 'gpr-history-filter', template: ``
})
export class HistoryFilterStubComponent {
  @Input() customer: ICustomer;
}
