import {Component, Input} from '@angular/core';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import { IFlag } from '../../interfaces/iFlag';

/**
 * Stub of {@link FlagResolverTooltipComponent}
 */
@Component({selector: 'gpr-flag-resolver-tooltip', template: ``})
export class FlagResolverTooltipStubComponent {
  @Input() position;
  @Input() flag: IFlag;
  @Input() customer: ICustomer;
}
