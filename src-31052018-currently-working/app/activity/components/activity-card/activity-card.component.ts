import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IActivity} from '../../interfaces/iActivity';
import {Subscription} from 'rxjs/Subscription';
import {ActivityService} from '../../services/activity.service';
import {IUserInfo} from 'app/customer/interfaces/iUserInfo';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import {isNil} from 'lodash';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';

/**
 * A card component to show recent activity
 */
@Component({
  selector: 'gpr-activity-card',
  template: `
    <gpr-detail-card [heading]="'Last Edit'" *ngIf="hasActivity">
      <div class="activity-card">
        <span class="activity-text">{{recentCustomerPlanUpdateMessage}}</span>
        <gpr-user-tooltip [userInfo]="userInfo" [position]="'bottom'"></gpr-user-tooltip>
        <span class="timestamp">{{activity?.timestamp | date:'MM/dd/yy h:mm a'}}</span>
      </div>
    </gpr-detail-card>
  `,
  styleUrls: ['./activity-card.component.scss']
})
export class ActivityCardComponent implements OnInit, OnDestroy {

  /**
   * The customer object that is used to display information for.
   */
  @Input() customer: ICustomer;

  /**
   * The plan object that is used to display information for.
   */
  @Input() plan?: IPlan;

  /**
   * Indicates if the activity exists
   * @type {boolean}
   */
  public hasActivity: boolean = false;

  /**
   * Recent customer plan update message
   */
  public recentCustomerPlanUpdateMessage: string;

  /**
   * User information for user info tooltip
   */
  public userInfo: IUserInfo;

  /**
   * An activity object to show information about last edit.
   */
  public activity: IActivity;

  /**
   * An activity observable
   */
  private _activityObs: Observable<IActivity>;

  /**
   * An subscription that is used to retrieve data for an edit
   */
  private _activitySubscription: Subscription;

  /**
   * A subscription to watch for any updates to activity
   */
  private _activityUpdateSubscription: Subscription;

  /**
   * Constructor that contains the PlanAuditService which will retrieve audit information.
   * @param {ActivityService} _activityService
   * @param {NavigatorService} _navigator
   */
  constructor(private _activityService: ActivityService,
              private _navigator: NavigatorService) {
  }

  /**
   * On init, retrieves the data for the recent edit
   */
  ngOnInit(): void {
    const navState: INavState = this._navigator.subscribe('activity-card', (value: INavState) => {
      this._initialize(value);
    });
    this._initialize(navState);

    this._activityUpdateSubscription = this._activityService.update$.subscribe(() => {
      this._getLastActivity();
    });
  }

  /**
   * On destroy, remove the subscription from recent edit
   */
  ngOnDestroy(): void {
    const subscriptions: Subscription[] = [
      this._activitySubscription,
      this._activityUpdateSubscription
    ];
    SubscriptionManager.massUnsubscribe(subscriptions);
    this._navigator.unsubscribe('activity-card');
  }

  /**
   * method to get all recent customer plan update
   */
  private _getLastActivity() {
    const planId = this.plan ? this.plan.planId : '';
    this._activityObs = this._activityService.getRecentCustomerPlanUpdate(this.customer.customerNumber, planId);

    this._activitySubscription = this._activityObs.subscribe(data => {
      this.activity = data;
      if (this.activity) {
        this.recentCustomerPlanUpdateMessage = this._activityService.getRecentCustomerPlanUpdateMessage(this.activity);
        this.hasActivity = this.recentCustomerPlanUpdateMessage !== '';
        this.userInfo = {
          firstName: this.activity.firstName,
          lastName: this.activity.lastName,
          emailAddress: this.activity.emailId,
          metnetId: this.activity.metnetId
        };
      }
    });
  }

  /**
   * Private initialization method to set the plan variable and load the associated view configuration.
   * @param {INavState} navState: The state of the current route provided by {@link NavigatorService}.
   */
  private _initialize(navState: INavState): void {
    const data = navState.data;
    if (isNil(data)) {
      return;
    }

    this.plan = data.plan;
    this.customer = data.customer;
    if (this.customer) {
      this._getLastActivity();
    }
  }
}
