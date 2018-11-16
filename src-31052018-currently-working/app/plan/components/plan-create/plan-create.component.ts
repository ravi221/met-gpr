import {Component, Input, OnDestroy} from '@angular/core';
import {ActiveModalRef} from '../../../ui-controls/classes/modal-references';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {PlanDataService} from 'app/plan/plan-shared/services/plan-data.service';
import {NotificationService} from 'app/core/services/notification.service';
import {NotificationTypes} from 'app/core/models/notification-types';
import {IPlanInputTemplate} from '../../interfaces/iPlanInputTemplate';
import {Subscription} from 'rxjs/Subscription';
import {ICreatePlanResponse} from '../../interfaces/iCreatePlanResponse';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';
import {PlanModes} from '../../enums/plan-modes';
import {ICreatePlanRequest} from '../../interfaces/iCreatePlanRequest';

/**
 * A component used to create new plans for a given customer, using the {@link PlanInputGridComponent}
 */
@Component({
  selector: 'gpr-plan-create',
  template: `
    <gpr-plan-input-grid [planMode]="planMode"
                         [customer]="customer"
                         (plansCreate)="createPlansFromTemplates($event)"></gpr-plan-input-grid>
  `
})
export class PlanCreateComponent implements OnDestroy {

  /**
   * The current Customer
   */
  @Input() customer: ICustomer;

  /**
   * The plan mode to create plans
   * @type {PlanModes}
   */
  public planMode: PlanModes = PlanModes.CREATE;

  /**
   * A list of all the plan names that were successfully created
   */
  private _createdPlanNames: string[] = [];

  /**
   * A list of all the plan names that failed to create
   */
  private _failedPlanNames: string[] = [];

  /**
   * A list of subscriptions to create plans
   */
  private _createPlanSubscriptions: Subscription[] = [];

  /**
   * The total of number of plans to create
   */
  private _plansToCreateCount: number = 0;

  /**
   * Creates the plan create component
   * @param {ActiveModalRef} _activeModalRef
   * @param {PlanDataService} _planDataService
   * @param {NotificationService} _notificationService
   */
  constructor(private _activeModalRef: ActiveModalRef,
              private _planDataService: PlanDataService,
              private _notificationService: NotificationService) {
  }

  /**
   * On destroy, unsubscribe from any subscriptions
   */
  ngOnDestroy(): void {
    SubscriptionManager.massUnsubscribe(this._createPlanSubscriptions);
  }

  /**
   * Called when the PlanInputGrid is ready to create/copy
   */
  public createPlansFromTemplates(planTemplates: IPlanInputTemplate[]): void {
    this._plansToCreateCount = planTemplates.length;
    planTemplates.forEach(planTemplate => {
      const createPlanRequest = this._initCreatePlanRequest(planTemplate);
      const createPlan$ = this._planDataService.createPlan(createPlanRequest);
      const createPlanSubscription = createPlan$.subscribe((createPlanResponse: ICreatePlanResponse) => {
        this._handleCreatePlanSuccess(createPlanResponse);
      }, () => {
        this._handleCreatePlanError(planTemplate);
      });
      this._createPlanSubscriptions.push(createPlanSubscription);
    });
  }

  /**
   * Creates the create plan request based on the plan input template
   * @param {IPlanInputTemplate} planTemplate
   * @returns {ICreatePlanRequest}
   * @private
   */
  private _initCreatePlanRequest(planTemplate: IPlanInputTemplate): ICreatePlanRequest {
    return {
      planName: `${planTemplate.planNamePrefix}${planTemplate.planNameBody}`,
      coverageId: planTemplate.coverageId,
      coverageName: planTemplate.coverageName,
      effectiveDate: planTemplate.effectiveDate,
      customerNumber: planTemplate.customerNumber,
      ppcModelName: planTemplate.ppcModelName
    };
  }

  /**
   * Handles when a plan is successfully created
   * @param {ICreatePlanResponse} createPlanResponse
   * @private
   */
  private _handleCreatePlanSuccess(createPlanResponse: ICreatePlanResponse) {
    this._createdPlanNames.push(createPlanResponse.planName);
    this._checkAllCreatedPlansFinished();
  }

  /**
   * Handles when a plan is unsuccessfully created
   * @param {IPlanInputTemplate} planTemplate
   * @private
   */
  private _handleCreatePlanError(planTemplate: IPlanInputTemplate) {
    const failedPlanName = `${planTemplate.planNamePrefix}${planTemplate.planNameBody}`;
    this._failedPlanNames.push(failedPlanName);
    this._checkAllCreatedPlansFinished();
  }

  /**
   * Tests to see if all plans have been created or failed
   * @returns {boolean}
   * @private
   */
  private _areAllPlansFinished(): boolean {
    const totalPlansFinished = this._failedPlanNames.length + this._createdPlanNames.length;
    return totalPlansFinished === this._plansToCreateCount;
  }

  /**
   * Checks if all created plans have returned with an error or successfully
   * @private
   */
  private _checkAllCreatedPlansFinished(): void {
    if (!this._areAllPlansFinished()) {
      return;
    }

    const successfullyCreatedAllPlans = this._createdPlanNames.length === this._plansToCreateCount;
    if (successfullyCreatedAllPlans) {
      this._notificationService.addNotification(NotificationTypes.SUCCESS, this._getAllPlansCreatedSuccessfullyMessage());
    } else {
      this._notificationService.addNotification(NotificationTypes.ERROR, this._getAllErrorPlanNamesMessage());
    }
    this._activeModalRef.close();
  }

  /**
   * Gets the message when all plans were created successfully
   * @returns {string}
   * @private
   */
  private _getAllPlansCreatedSuccessfullyMessage(): string {
    return `Successfully created: ${this._createdPlanNames.join(', ')}`;
  }

  /**
   * Gets the message when all plans were created successfully
   * @returns {string}
   * @private
   */
  private _getAllErrorPlanNamesMessage(): string {
    return `Unsuccessfully created: ${this._failedPlanNames.join(', ')}`;
  }
}
