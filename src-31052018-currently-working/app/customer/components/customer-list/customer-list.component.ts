import {ActivityService} from '../../../activity/services/activity.service';
import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {ICustomer} from '../../interfaces/iCustomer';
import {ISortOption} from '../../../core/interfaces/iSortOption';
import {IUserPreference} from '../../../core/interfaces/iUserPreference';
import {PageContextTypes} from '../../../core/enums/page-context-types';
import {SortOptionsService} from '../../../core/services/sort-options.service';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {Subscription} from 'rxjs/Subscription';
import {IActivity} from '../../../activity/interfaces/iActivity';
import {isNil} from 'lodash';

/**
 * A component to display a list of customers
 */
@Component({
  selector: 'gpr-customer-list',
  template: `
    <gpr-card *ngIf="hasCustomers">
      <table class="table table-condensed table-list">
        <thead>
        <tr>
          <th *ngFor="let sortOption of sortOptions"
              (click)="applySort(sortOption)"
              class="sort-header"
              [class.active]="sortOption.active">
            <span class="sort-label">{{sortOption.label}}</span>
            <span class="sort-icon">
                <i *ngIf="sortOption.active && sortOption.sortAsc" class="material-icons">arrow_drop_down</i>
                <i *ngIf="sortOption.active && !sortOption.sortAsc" class="material-icons">arrow_drop_up</i>
                <gpr-icon *ngIf="!sortOption.active" [name]="'sort'"></gpr-icon>
            </span>
          </th>
          <th>Actions</th>
          <th>
            <gpr-icon [name]="'flag-on'"></gpr-icon>
            Flags
          </th>
          <th *ngIf="canHideCustomers"></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let customer of customers;trackBy: trackByCustomerNumber">
          <td class="customer-name"><a (click)="selectCustomer(customer.customerNumber)">{{customer.customerName}}</a>
          </td>
          <td class="customer-number"><a
            (click)="selectCustomer(customer.customerNumber)">{{customer.customerNumber}}</a></td>
          <td><span class="text-muted">{{customer.effectiveDate}}</span></td>
          <td>
            <span class="text-muted">{{customer.lastActivity?.timestamp | date:'MM/dd/yy hh:mm a'}}</span>
            <gpr-activity-tooltip [activity]="customer.lastActivity"></gpr-activity-tooltip>
          </td>
          <td class="customer-status">{{customer.percentageCompleted}}% Complete</td>
          <td>
            <div class="customer-actions">
              <a class="customer-action" *ngIf="customer.percentageCompleted === 0; else resumeLink"
                (click)="selectCustomer(customer.customerNumber)">
                Start
              </a>
              <ng-template #resumeLink>
                <a class="customer-action"
                  (click)="handleResumeClick(customer)">
                  Resume
                </a>
              </ng-template>
              <a class="customer-action" *ngIf="customer.percentageCompleted > 0"
                 (click)="selectPlan(customer.customerNumber, customer.lastActivity?.planId)">
                Plan Home
              </a>
            </div>
          </td>
          <td>
            <span *ngIf="customer.lastActivity && customer.lastActivity.totalFlagCount > 0" class="customer-flags">
              <span class="badge badge-warning">{{customer.lastActivity?.totalFlagCount}}</span>
            </span>
          </td>
          <td *ngIf="canHideCustomers">
            <gpr-customer-context-menu [customer]="customer"
                                       (customerHide)="onCustomerHide($event)"></gpr-customer-context-menu>
          </td>
        </tr>
        </tbody>
      </table>
    </gpr-card>
    <label [hidden]="hasCustomers" class="text-muted no-customers-msg">
      No customers are currently present in your display.
    </label>
  `,
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * Indicates if the user can hide customers
   * @type {boolean}
   */
  @Input() canHideCustomers: boolean = true;

  /**
   * A list of customers to display
   * @type {Array}
   */
  @Input() customers: ICustomer[] = [];

  /**
   * The user preference for sorting customers
   */
  @Input() userPreference: IUserPreference;

  /**
   * An output event which returns a customer object to toggle a customer's hidden status
   * @type {EventEmitter<ICustomer>}
   */
  @Output() customerHide: EventEmitter<ICustomer> = new EventEmitter<ICustomer>();

  /**
   * An output event when the customer is selected, navigates to customer by the customer number
   * @type {EventEmitter<number>}
   */
  @Output() customerSelect: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An output event which returns a planId and customerNumber wrapped in an object when a plan is selected
   * @type {EventEmitter<any>}
   */
  @Output() planSelect: EventEmitter<{ customerNumber, planId }> = new EventEmitter<{ customerNumber, planId }>();

  /**
   * An output event which returns the new sort option to sort the customers
   * @type {EventEmitter<ISortOption>}
   */
  @Output() sortChange: EventEmitter<ISortOption> = new EventEmitter<ISortOption>();

  /**
   * Indicates if the current list has customers
   * @type {boolean}
   */
  public hasCustomers: boolean = false;

  /**
   * The list of sort options to display as column headers
   * @type {Array}
   */
  public sortOptions: ISortOption[] = [];

  /**
   * A list of subscriptions for getting customer plan information for the current customers
   * @type {Array}
   * @private
   */
  private _customerPlanSubscriptions: Subscription[] = [];

  /**
   * Caches activity based on the customer number
   * @type {boolean}
   * @private
   */
  private _cachedActivity: Map<number, IActivity> = new Map<number, IActivity>();

  /**
   * Creates the customer list component
   * @param {ActivityService} _activityService
   * @param {SortOptionsService} _sortOptionsService
   */
  constructor(private _activityService: ActivityService,
              private _sortOptionsService: SortOptionsService,
              private _navigator: NavigatorService) {
  }

  /**
   * On init, setup the customer list
   */
  ngOnInit(): void {
    this._initSortOptions();
    this._updateCustomers();
  }

  /**
   * On changes, update the customer list
   */
  ngOnChanges(): void {
    this._updateCustomers();
  }

  /**
   * On destroy, unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this._customerPlanSubscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Applies the sort when a table header is clicked
   * @param {ISortOption} sortOption
   */
  public applySort(sortOption: ISortOption): void {
    if (sortOption.active) {
      sortOption.sortAsc = !sortOption.sortAsc;
    } else {
      this.sortOptions.forEach((s: ISortOption) => {
        s.active = false;
        s.sortAsc = true;
      });
      sortOption.active = true;
    }
    this.sortChange.emit(sortOption);
  }

  /**
   * Emit an event when a customer's hidden state is toggled
   * @param {ICustomer} customer
   */
  public onCustomerHide(customer: ICustomer): void {
    this.customerHide.emit(customer);
  }

  /**
   * Triggered when a customer has been selected
   * @param {number} customerNumber
   */
  public selectCustomer(customerNumber: number): void {
    this.customerSelect.emit(customerNumber);
  }

  /**
   * Triggered when 'Plan Home' is selected
   * @param {number} customerNumber
   * @param {string} planId
   */
  public selectPlan(customerNumber: number, planId: string): void {
    this.planSelect.emit({customerNumber, planId});
  }

  /**
   * Tracks the customers by customer number, used with trackBy when going through customers
   * @param {number} index
   * @param {ICustomer} customer
   * @returns {number}
   */
  public trackByCustomerNumber(index: number, customer: ICustomer): number {
    return customer.customerNumber;
  }

  /**
   * Sets up the sort options
   * @private
   */
  private _initSortOptions(): void {
    this.sortOptions = this._sortOptionsService.getSortOptionsByPage(PageContextTypes.USER_HOME);

    const hasUserPreference = !isNil(this.userPreference);
    if (hasUserPreference) {
      const sortByPreference = this.userPreference.sortBy;
      const sortAscPreference = this.userPreference.sortAsc;
      const activeSortOption = this.sortOptions.find(s => s.sortBy === sortByPreference);
      activeSortOption.active = true;
      activeSortOption.sortAsc = sortAscPreference;
    } else {
      const activeSortOption = this.sortOptions[3];
      activeSortOption.active = true;
    }
  }

  /**
   * Updates the list of customers
   * @private
   */
  private _updateCustomers(): void {
    this.hasCustomers = this.customers && this.customers.length > 0;
    this.customers.forEach(customer => {
      if (customer.lastActivity) {
        return;
      }
      const customerNumber = customer.customerNumber;
      if (this._cachedActivity.has(customerNumber)) {
        customer.lastActivity = this._cachedActivity.get(customerNumber);
      } else {
        const activity$ = this._activityService.getRecentCustomerPlanUpdate(customerNumber);
        const customerPlanSubscription = activity$
          .take(1)
          .subscribe(lastActivity => {
            customer.lastActivity = lastActivity;
            this._cachedActivity.set(customerNumber, lastActivity);
          });
        this._customerPlanSubscriptions.push(customerPlanSubscription);
      }
    });
  }

  /**
   * Triggered when a resume link is clicked
   * @param {ICustomer} customer
   */
  public handleResumeClick(customer: ICustomer): void {
    const {
      customerNumber,
      lastActivity
    } = customer;
    const {
      sectionId,
      categoryId,
      planId
    } = lastActivity;
    if (lastActivity && sectionId && categoryId) {
      this._navigator.goToPlanEntrySectionFromNav(customerNumber, planId, categoryId, sectionId);
    } else {
      this.selectPlan(customerNumber, planId);
    }
  }
}
