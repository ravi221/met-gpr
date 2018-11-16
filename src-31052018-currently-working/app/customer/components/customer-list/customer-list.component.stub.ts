import {IUserPreference} from '../../../core/interfaces/iUserPreference';
import {Component, Input} from '@angular/core';
import {ICustomer} from '../../interfaces/iCustomer';

/**
 * Stub of {@link CustomerListComponent}
 */
@Component({selector: 'gpr-customer-list', template: ``})
export class CustomerListStubComponent {
  @Input() canHideCustomers: boolean = true;
  @Input() customers: ICustomer[];
  @Input() userPreference: IUserPreference;
}
