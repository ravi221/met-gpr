import {Component, Input, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {ActiveModalRef} from '../../../ui-controls/classes/modal-references';
import {IPlan} from 'app/plan/plan-shared/interfaces/iPlan';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {CustomerDataService} from '../../../customer/services/customer-data.service';
import {cloneDeep, isNil} from 'lodash';
import {IAutoSearchResultItem} from 'app/ui-controls/interfaces/iAutoSearchResultItem';
import {isArray} from 'util';
import {IPlanInputTemplate} from 'app/plan/interfaces/iPlanInputTemplate';
import {PlanDataService} from '../../plan-shared/services/plan-data.service';
import {NotificationService} from '../../../core/services/notification.service';
import {NotificationTypes} from '../../../core/models/notification-types';
import {Subscription} from 'rxjs/Subscription';

/**
 * A component used to copy plans from one customer to either the same customer or a new customer
 */
@Component({
  selector: 'gpr-plan-copy',
  templateUrl: 'plan-copy.component.html',
  styleUrls: ['./plan-copy.component.scss']
})
export class PlanCopyComponent implements OnInit, OnDestroy {

  /**
   * The Current Customer to copy to.
   * @type {ICustomer}
   */
  @Input() customerToCopyTo: ICustomer;

  /**
   * The Copied Plan.
   * @type {ICustomer}
   */
  @Input() copiedPlan: IPlan;

  /**
   * The Plan to copy.
   * @type {IPlan}
   */
  @Input() planToCopy: IPlan;

  /**
   * Property used to toggle between auto search and static text
   */
  showCustomerSelectBox: boolean;

  /**
   * Property used to determine after a user selects a new customer
   */
  isDifferentCustomer: boolean;

  /**
   * The customer to copy plan(s) from
   */
  public customerCopyFrom: ICustomer;

  /**
   * Plans used to send as input into the create copy component
   */
  public plans: IPlan[];

  /**
   * Service call used by auto-complete search
   */
  public serviceCall: any;

  /**
   * Property used to hold help text displayed on the modal window
   */
  public customerHelpText: string = 'Creates a copy under the current or different customer.';

  /**
   * Variable to hold the copy plan subscription
   * @private
   */
  private _copyPlanSubscription: Subscription;

  /**
   * Creates the plan copy component
   * @param {ActiveModalRef} _activeModalRef
   * @param {CustomerDataService} _customerDataService
   * @param {PlanDataService} _planDataService
   */
  constructor(private _activeModalRef: ActiveModalRef,
    private _customerDataService: CustomerDataService,
    private _planDataService: PlanDataService,
    private _notificationService: NotificationService) {
  }

  /**
   * On init, setup the component
   */
  ngOnInit() {
    this.serviceCall = this._customerDataService.getCustomerByName.bind(this._customerDataService);
    this.isDifferentCustomer = false;
    this.showCustomerSelectBox = !this.customerToCopyTo;
    this.customerCopyFrom = this.customerToCopyTo;
    this.copiedPlan = cloneDeep(this.planToCopy);
    this.plans = [
      this.copiedPlan
    ];
  }
  /**
   * Method called when component is being destroyed
   */
  ngOnDestroy(): void {
    if (!isNil(this._copyPlanSubscription)) {
      this._copyPlanSubscription.unsubscribe();
    }
  }

  /**
   * Closes the modal window
   */
  public dismissModal(): void {
    this._activeModalRef.dismiss();
  }
  /**
   * Closes the modal window
   */
  public closeModal(): void {
    this._activeModalRef.close(
      {
        customerNumber: this.customerToCopyTo.customerNumber,
        isDifferentCustomer: this.customerToCopyTo.customerNumber !== this.customerCopyFrom.customerNumber
      }
    );
  }

  /**
   * Updates UI to alert user to change customer
   */
  public changeCustomer(): void {
    this.showCustomerSelectBox = true;
    this.isDifferentCustomer = true;
  }

  /**
   * Method is used for map data returned from service into an Array of IAutoSearchResultItems
   * @param data Data returned from service call
   */
  public formatDataFunction(data: any): IAutoSearchResultItem[] {
    if (data && isArray(data)) {
      return data.map(element => {
        return <IAutoSearchResultItem>{title: element.customerName + ' #' + element.customerNumber, model: element};
      });
    }
    return [<IAutoSearchResultItem>{title: data.customerName + ' #' + data.customerNumber, model: data}];
  }

  /**
   * Method called when item is selected in the auto complete search
   * @param e data sent by emitter
   */
  public itemSelected(e): void {
    this.customerToCopyTo = <ICustomer>e;
    this.showCustomerSelectBox = false;
  }

  /**
   * Called when the PlanInputGrid is ready to copy
   * @param {IPlanInputTemplate[]} plans data emitted by plan-create-component's emitter
   */
  public planCopy(plans: IPlanInputTemplate[]): void {
    let plan = this._getPlan(plans[0]);
    plan.planId = this.planToCopy.planId;
    if (!isNil(this._copyPlanSubscription)) {
      this._copyPlanSubscription.unsubscribe();
    }
    this._copyPlanSubscription = this._planDataService.copyPlan(plan, this.customerToCopyTo.customerNumber).subscribe(response => {
      if (this._copyPlanSubscription) {
        this._copyPlanSubscription.unsubscribe();
      }
      if (!isNil(response) && response.responseMessage === 'SUCCESS') {
        const numberCopied = 1;
        this._notificationService.addNotification(NotificationTypes.SUCCESS, `Successfully copied to ${numberCopied} plan`);
        this.closeModal();
      }
    });
  }

  /**
   * Converts a IPlanInputTemplate to IPlan
   * @param {IPlanInputTemplate} plan plan to be converted
   */
  private _getPlan(plan: IPlanInputTemplate): IPlan {
    let retPlan = <IPlan>{};
    if (plan) {
      retPlan.coverageId = plan.coverageId;
      retPlan.planName = plan.planNameBody;
      retPlan.effectiveDate = plan.effectiveDate;
    }
    return retPlan;
  }
}
