import {Component, Input} from '@angular/core';
import {ICustomer} from '../../../interfaces/iCustomer';

/**
* A stub component for {@link CustomerLandingBannerComponent}
 */
@Component({selector: 'gpr-customer-landing-banner', template: ``})
export class CustomerLandingBannerStubComponent {
  @Input() customer: ICustomer;
}
