import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * A stub component for {@link CustomerLandingButtonsComponent}
 */
@Component({selector: 'gpr-customer-landing-buttons', template: ``})
export class CustomerLandingButtonsStubComponent {
  @Input() isAddPlanDisabled: boolean = false;
  @Input() isMassUpdateDisabled: boolean = false;
  @Input() isPublishDisabled: boolean = false;
  @Output() addPlanClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() customerInfoClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() massUpdateClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() publishPlansClick: EventEmitter<void> = new EventEmitter<void>();
}
