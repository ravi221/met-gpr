import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {Observable} from 'rxjs/Observable';
import FormConfig from '../../../dynamic-form/config/form-config';
import {Subscription} from 'rxjs/Subscription';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {isNil} from 'lodash';
import {PlanAction} from 'app/plan/enums/plan-action';
import {IPlanAction} from '../../interfaces/iPlanAction';
import {NotificationService} from '../../../core/services/notification.service';
import {NotificationTypes} from 'app/core/models/notification-types';
import {PlanLandingAction} from '../../enums/plan-entry-action';
import {IQuickLink} from '../../../core/interfaces/iQuickLink';
import {IPlan} from '../../plan-shared/interfaces/iPlan';
import {ViewConfigDataService} from '../../plan-shared/services/view-config-data.service';
import {PlanDataService} from '../../plan-shared/services/plan-data.service';
import {IPlanCategory} from '../../plan-shared/interfaces/iPlanCategory';
import {QuickLinkLabel} from '../../../core/enums/quick-link-label';

/**
 * A plan landing page component class for user to manage a plan instance.
 */
@Component({
  template: `

    <gpr-breadcrumbs></gpr-breadcrumbs>
    <div class="banner">
      <h4>{{plan?.planName}}</h4>
    </div>
    <div class="row">
      <div class="col-md-18">
        <gpr-card [asyncMode]="configObservable">
          <div class="card">
            <div>
              <p class="subtitle"><label>Effective Date:&nbsp;</label>{{plan?.effectiveDate}}</p>
              <p class="subtitle"><label>Status:&nbsp;</label>{{plan?.status}} {{plan?.completionPercentage}}%</p>
              <a class="pull-right">
                <gpr-plan-context-menu [plan]="plan" (planAction)="onPlanAction($event)"></gpr-plan-context-menu>
              </a>
            </div>
            <div *ngFor="let categories of categoryData; let i = index">
            <gpr-plan-category-list
              [categories]="categories"
              [formConfig]="formConfig"
			  [plan]="plan"
              [label]="categories.categoryName"
              [categoryId]="categories.categoryId"
              [planId]="plan.planId"
              [customerNumber]="customer.customerNumber"
              [categoryPercentage]="categories.completionPercentage"
              [categoryIndicator]="categories.validationIndicator"
              (action)="onCategorySelect($event)"></gpr-plan-category-list>
          </div>

            <div class="text-right mt-32">
              <span *ngIf="formConfig">
                <gpr-validate-plan [plan]="plan" [config]="formConfig" ></gpr-validate-plan>
              </span>
              <button class="btn btn-primary" disabled="disabled">Publish</button>
            </div>
          </div>
        </gpr-card>
      </div>
      <div class="col-md-6">
        <gpr-activity-card [customer]="customer" [plan]="plan"></gpr-activity-card>
        <gpr-flag-card [customer]="customer" [planId]="plan.planId"></gpr-flag-card>
        <gpr-quick-links [quickLinks]="quickLinks"></gpr-quick-links>
      </div>
    </div>
  `,
  styleUrls: ['./plan-landing.component.scss']
})
export class PlanLandingComponent implements OnInit, OnDestroy {

  /**
   * The view config data service observable.
   */
  public configObservable: Observable<FormConfig>;

  /**
   * Customer that the user is looking at, used for the flag card
   */
  public customer: ICustomer;

  /**
   * The current plan's associated view configuration to display the list of categories.
   */
  public formConfig: FormConfig;

  /**
   * The current plan instance.
   */
  public plan: IPlan;

  /**
   * Receives a list of categories.
   */
  public categoryData: IPlanCategory[];

  /**
   * A list of quick links
   */
  public quickLinks: IQuickLink[] = [
    {url: '', label: QuickLinkLabel.LIVE_LINK},
    {url: '', label: QuickLinkLabel.WORK_INSTRUCTIONS},
    {url: '', label: QuickLinkLabel.UNDERWRITER_GUIDELINES},
    {url: '', label: QuickLinkLabel.DOCUMENT_GENERATION}
  ];

  /**
   * Private subscription to view data service observable.
   */
  private _viewSub: Subscription;

  /**
   * Creates the Plan Landing Component
   * @param {PlanDataService} _dataService
   * @param {NavigatorService} _navigator
   * @param {ViewConfigDataService} _viewConfigDataService
   * @param {NotificationService} _notificationService
   */
  constructor(private _dataService: PlanDataService,
    private _navigator: NavigatorService,
    private _viewConfigDataService: ViewConfigDataService,
    private _notificationService: NotificationService) {
  }

  /**
   * On init, subscribe to the navigation state
   */
  ngOnInit() {

    const navState: INavState = this._navigator.subscribe('plan-landing', (value: INavState) => this._initialize(value));
    this._initialize(navState);
  }

  /**
   * On destroy, unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    if (this._viewSub) {
      this._viewSub.unsubscribe();
    }
    this._navigator.unsubscribe('plan-landing');
  }

  /**
   * Handles the emitted event from {@link PlanCategoryListComponent} whenever user clicks on action button.
   * @param e: An object that has the action type and the corresponding category.
   * TODO: Need to implement this more dynamically.
   */
  public onCategorySelect(buttonLabel): void {
    switch (buttonLabel.action) {
      case PlanLandingAction.EDIT:
      case PlanLandingAction.START:
      case PlanLandingAction.RESUME:
      case PlanLandingAction.VIEW:
        this._navigator.goToPlanEntry(buttonLabel.category.categoryId);
        break;
      case PlanLandingAction.VALIDATE:
        break;
    }
  }

  /**
   * Event triggered once a plan action is performed on a plan
   * @param {IPlanAction} planAction
   */
  public onPlanAction(planAction: IPlanAction): void {
    if (!isNil(planAction)) {
      if (planAction.planAction === PlanAction.COPY) {
        this._reloadScreen();
      } else {
        const hasErrors = !isNil(planAction.error);
        if (hasErrors) {
          this._notificationService.addNotification(NotificationTypes.ERROR, planAction.error);
        } else {
          this._reloadScreen();
        }
      }
    }
  }

  /**
   * Reloads current screen
   */
  private _reloadScreen() {
    const planSub = this._dataService.getPlanById(this.plan.planId).map((response: IPlan) => response).subscribe(response => {
      this.plan = response;
      if (this.plan) {
        this._loadViewConfig(this.plan.ppcModelName, this.plan.ppcModelVersion);
      }
      if (planSub) {
        planSub.unsubscribe();
      }
    });
  }

  /**
   * Private method to fetch the associated view configuration for the current plan.
   * @param {number} coverageId: The coverage Id of the plan.
   */
  private _loadViewConfig(modelName: string, ppcVersion: string): void {
    this.configObservable = this._viewConfigDataService.getViewByPPCModel(modelName, ppcVersion);
    this._viewSub = this.configObservable.subscribe((resolve: FormConfig) => {
      this.formConfig = resolve;
      this.categoryData = this.plan.categories;
    });
  }

  /**
   * Private initialization method to set the plan variable and load the associated view configuration.
   * @param {INavState} navState: The state of the current route provided by {@link NavigatorService}.
   */
  private _initialize(navState: INavState): void {
    if (navState.data) {
      this.plan = navState.data.plan;
      this.customer = navState.data.customer;
      if (this.plan) {
        this._loadViewConfig(this.plan.ppcModelName, this.plan.ppcModelVersion);
      }
    }
  }

}
