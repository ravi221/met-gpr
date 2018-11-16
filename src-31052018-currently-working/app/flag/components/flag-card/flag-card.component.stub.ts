import {Component, Input} from '@angular/core';
import {ICustomer} from '../../../customer/interfaces/iCustomer';

/**
 * Stub of {@link FlagCardComponent}
 */
@Component({selector: 'gpr-flag-card', template: ``})
export class FlagCardStubComponent {
  @Input() customer: ICustomer;
  @Input() planId: string;
  @Input() categoryId: string;
}
