import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ICustomer} from '../../../../customer/interfaces/iCustomer';

/**
 * A stub component for {@link SearchCustomerListComponent}
 */
@Component({selector: 'gpr-search-customer-list', template: ``})
export class SearchCustomerListStubComponent {
  @Input() customers: ICustomer[] = [];
  @Output() customerClick: EventEmitter<number> = new EventEmitter<number>();
}
