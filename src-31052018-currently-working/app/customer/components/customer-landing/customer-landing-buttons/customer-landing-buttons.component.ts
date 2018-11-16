import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Component to hold all buttons on the {@link CustomerLandingComponent}
 *
 * Usage:
 * ```html
 *    <gpr-customer-landing-buttons [isAddPlanDisabled]="true"
 *                                  [isMassUpdateDisabled]="true"
 *                                  [isPublishDisabled]="true"
 *                                  (addPlanClick)="fn()"
 *                                  (customerInfoClick)="fn()"
 *                                  (massUpdateClick)="fn()"
 *                                  (publishPlansClick)="fn()"></gpr-customer-landing-buttons>
 * ```
 */
@Component({
  selector: 'gpr-customer-landing-buttons',
  template: `
    <div class="customer-landing-buttons">
      <button class="btn btn-secondary" [disabled]="isAddPlanDisabled" (click)="goToAddPlan()">Add a Plan</button>
      <button class="btn btn-tertiary" (click)="goToCustomerInfo()">Customer Info</button>
      <button class="btn btn-tertiary" [disabled]="isMassUpdateDisabled" (click)="goToMassUpdate()">Mass Update Tool</button>
      <button class="btn btn-tertiary" [disabled]="isPublishDisabled" (click)="triggerPublishPlans()">Publish</button>
    </div>
  `,
  styleUrls: ['./customer-landing-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerLandingButtonsComponent {

  /**
   * Indicates if the add plan button is disabled
   * @type {boolean}
   */
  @Input() isAddPlanDisabled: boolean = false;

  /**
   * Indicates if the mass update tool button is disabled
   * @type {boolean}
   */
  @Input() isMassUpdateDisabled: boolean = false;

  /**
   * Indicates if the publish button is disabled
   * @type {boolean}
   */
  @Input() isPublishDisabled: boolean = false;

  /**
   * Output event to navigate to the Add Plan modal when the Add A Plan button is clicked
   */
  @Output() addPlanClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Output event to navigate to customer info screen when the customer info button is clicked
   */
  @Output() customerInfoClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Output event to navigate to mass update screen when the mass update button is clicked
   */
  @Output() massUpdateClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Output event to trigger publishing of plans on the customer landing page
   * @type {EventEmitter<any>}
   */
  @Output() publishPlansClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * Function to emit the add plan event
   */
  public goToAddPlan(): void {
    this.addPlanClick.emit();
  }

  /**
   * Function to emit customer info event
   */
  public goToCustomerInfo(): void {
    this.customerInfoClick.emit();
  }

  /**
   * Function to emit mass update event
   */
  public goToMassUpdate(): void {
    this.massUpdateClick.emit();
  }

  /**
   * Function to emit publish click event
   */
  public triggerPublishPlans(): void {
    this.publishPlansClick.emit();
  }
}
