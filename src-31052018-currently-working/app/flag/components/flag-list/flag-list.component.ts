import {Component, Input, Type} from '@angular/core';
import { ModalRef } from 'app/ui-controls/classes/modal-references';
import { isNil } from 'lodash';
import { FlagLandingComponent } from '../flag-landing/flag-landing.component';
import { Subscription } from 'rxjs/Subscription';
import { FlagResolverPopupComponent } from '../flag-resolver-popup/flag-resolver-popup.component';
import { ModalService } from 'app/ui-controls/services/modal.service';
import { ICustomer } from '../../../customer/interfaces/iCustomer';
import { IFlaggedPlan } from '../../interfaces/iFlaggedPlan';
import { Observable } from 'rxjs/Observable';
import { NavigatorService } from '../../../navigation/services/navigator.service';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { IPlan } from 'app/plan/plan-shared/interfaces/iPlan';

/**
 * Component used to contain a list of Plans and their flags. It will have the ability to resolve all the flags.
 */
@Component({
  selector: 'gpr-flag-list',
  template: `
    <section id="flag-section">
      <div id="flag-header">
        <div class="customer-title">
          {{customer.customerName}}
        </div>
        <gpr-expand-collapse-icon (expand)="toggleDetails($event)"></gpr-expand-collapse-icon>

        <section class="customer-details" *ngIf="shouldDisplayDetails">
          <section class="customer-detail-section">
            <p class="subtitle">Customer Number: {{customer.customerNumber}}</p>
          </section>
        </section>
        <div class="lead-right flag-resolver-container">
          <gpr-icon name="flag-off"></gpr-icon>
          <span class="flags-count">{{flagsCount}}</span>
          <span class="resolve-link" (click)="handleResolveAll()">Resolve All</span>
        </div>
      </div>
      <div>
        <div *ngFor="let plan of flaggedPlans">
          <gpr-flagged-plan [plan]="plan" (planSelect)="onPlanSelect($event)" (flagResolve)="onFlagResolve($event, plan)"></gpr-flagged-plan>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./flag-list.component.scss']
})
export class FlagListComponent {

  /**
   * Customer
   */
  @Input() customer: ICustomer;

  /**
   * The total flags count for the customer.
   */
  @Input() flagsCount: number;

  /**
   * A list of Plans with their containing flags. Each item will be used as input for FlagItem Component.
   * @type {Array} should contain a Plan and its containing flags.
   */
  @Input() flaggedPlans: IFlaggedPlan[] = [];

  /**
   * Boolean value whether to display the customer's high level details
   */
  public shouldDisplayDetails = false;

  /**
   * plan
   */
  public plan: IPlan = <IPlan>{};

  /**
   * A subscription to the modal
   */
  private _modalSubscription: Subscription;

  /**
   * Constructor for FlagListComponent.
   */
  constructor(private _modalService: ModalService,
              private _flagLanding: FlagLandingComponent,
              private _navigator: NavigatorService) {
  }

  /**
   * Handles resolve events and notifies parent component.
   * @param event should emit an event when a flag has been resolved.
   */
  public onFlagResolve(event: IFlag, plan: IFlaggedPlan, modalRef?: ModalRef): void {
    if (isNil(modalRef)) {
      modalRef = this._getResolveFlagModal(event, plan);
    }
    this._modalSubscription = modalRef.onClose.subscribe(() => {
      this._flagLanding.searchFlags();
    });
  }

  /**
   * Handles resolve events and notifies parent component.
   * @param event should emit an event when a plan is selected.
   */
  public onPlanSelect(event: string): Observable<boolean> {
    return this._navigator.goToCustomerPlanHome(event, this.customer.customerNumber);
  }

  /**
   * Toggles the display of customer information details
   * @param {boolean} isExpanded
   */
  public toggleDetails(isExpanded: boolean): void {
    this.shouldDisplayDetails = isExpanded;
  }

  /**
   * handles resolve all functionality for flags
   * @param modalRef
   */
  public handleResolveAll(modalRef?: ModalRef): void {
    if (isNil(modalRef)) {
      modalRef = this._getResolveAllModal(this.flaggedPlans, this.flagsCount);
    }
    this._modalSubscription = modalRef.onClose.subscribe(() => {
      this._flagLanding.searchFlags();
    });
  }

  /**
   * Creates the Resolve All Modal
   * @private
   */
  private _getResolveAllModal(plans: IFlaggedPlan[], flagsCount: number): ModalRef {
    const componentType: Type<Component> = FlagResolverPopupComponent as Type<Component>;
    const inputs: Map<string, any> = new Map<string, any>();
    inputs.set('customer', this.customer);
    inputs.set('flaggedPlans', plans);
    inputs.set('flagsCount', flagsCount);
    return this._modalService.open(componentType, {
      backdrop: true,
      size: 'lg',
      closeOnEsc: true,
      inputs: inputs,
      containerClass: 'flag-resolver-popup-container'
    });
  }

  /**
   * Creates the Resolve All Modal
   * @private
   */
  private _getResolveFlagModal(flag: IFlag, plan: IFlaggedPlan): ModalRef {
    const componentType: Type<Component> = FlagResolverPopupComponent as Type<Component>;
    const inputs: Map<string, any> = new Map<string, any>();
    inputs.set('customer', this.customer);
    inputs.set('flag', flag);
    inputs.set('planDetails', plan);
    return this._modalService.open(componentType, {
      backdrop: true,
      size: 'lg',
      closeOnEsc: true,
      inputs: inputs,
      containerClass: 'flag-resolver-popup-container'
    });
  }

}
