import {Component, Input} from '@angular/core';
import {ICustomer} from '../../../../customer/interfaces/iCustomer';
import {ISortPreferences} from 'app/core/interfaces/iSortPreferences';

/**
 * A stub component for {@link CustomerNavRowComponent}
 */
@Component({selector: 'gpr-customer-nav-row', template: ``})
export class CustomerNavRowStubComponent {
  @Input() customer: ICustomer;
  @Input() sortPreferences: ISortPreferences;
}
