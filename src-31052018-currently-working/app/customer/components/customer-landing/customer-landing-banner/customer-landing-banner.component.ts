import {AnimationState} from '../../../../ui-controls/animations/AnimationState';
import {Component, Input} from '@angular/core';
import {fadeInOut} from '../../../../ui-controls/animations/fade-in-out';
import {ICustomer} from '../../../interfaces/iCustomer';

/**
 * A banner component to display information about the current customer, used on the {@link CustomerLandingComponent}
 *
 * ```html
 *    <gpr-customer-landing-banner [customer]="customer"></gpr-customer-landing-banner>
 * ```
 */
@Component({
  selector: 'gpr-customer-landing-banner',
  template: `
    <div class="banner customer-landing-banner">
      <h4 class="customer-name">
        <strong>{{customer?.customerName}}</strong>
        <gpr-expand-collapse-icon [isExpanded]="true"
                                  (expand)="toggleDetailsVisibility($event)"></gpr-expand-collapse-icon>
      </h4>

      <section class="customer-details" [@fadeInOut]="customerDetailsState">
        <section class="customer-detail-section">
          <p class="subtitle">Customer Number: {{customer?.customerNumber}}</p>
          <p class="subtitle">Effective Date: {{customer?.effectiveDate}}</p>
        </section>
        <section class="customer-detail-section">
          <p class="subtitle">Status: {{customer?.status}}</p>
          <p class="subtitle">Market: {{customer?.market}}</p>
        </section>
      </section>
    </div>
  `,
  styleUrls: ['./customer-landing-banner.component.scss'],
  animations: [fadeInOut]
})
export class CustomerLandingBannerComponent {

  /**
   * The currently selected customer.
   */
  @Input() customer: ICustomer;

  /**
   * The state of customer details
   * @type {AnimationState}
   */
  public customerDetailsState: AnimationState = AnimationState.VISIBLE;

  /**
   * Toggles the display of customer information details
   * @param {boolean} isExpanded
   */
  public toggleDetailsVisibility(isExpanded: boolean): void {
    this.customerDetailsState = isExpanded ? AnimationState.VISIBLE : AnimationState.HIDDEN;
  }
}
