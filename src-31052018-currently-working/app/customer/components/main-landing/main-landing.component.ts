import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomerDataService} from '../../services/customer-data.service';
import {ICustomerRequest} from '../../interfaces/iCustomerRequest';
import {ICustomers} from 'app/customer/interfaces/iCustomers';
import {ICustomer} from '../../interfaces/iCustomer';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {isNil} from 'lodash';
import {ISortOption} from 'app/core/interfaces/iSortOption';
import {IUserPreference} from 'app/core/interfaces/iUserPreference';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {Observable} from 'rxjs/Observable';
import {PageContextTypes} from '../../../core/enums/page-context-types';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';
import {Subscription} from 'rxjs/Subscription';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {UserProfile} from '../../../core/models/user-profile';

/**
 * A component class for the GPR main landing page.
 */
@Component({
  template: `
    <div gprScroll (scrollAtBottom)="onScrollAtBottom()" class="main-landing">
      <h1 class="user-name">Welcome, {{currentUser?.firstName}}.</h1>
      <div class="row">
        <div class="toggle-icon">
          <gpr-toggle [label]="'Only Show Hidden Customers'" (toggle)="toggleHiddenCustomers($event)"></gpr-toggle>
        </div>
      </div>
      <gpr-customer-list [customers]="customers"
                         [userPreference]="userPreference"
                         (customerHide)="onSetHiddenCustomer($event)"
                         (customerSelect)="onCustomerSelect($event)"
                         (planSelect)="onPlanSelect($event)"
                         (sortChange)="onSortChange($event)"></gpr-customer-list>
      <gpr-loading-icon [show]="isLoadingPaginatedCustomers"></gpr-loading-icon>
    </div>
  `,
  styleUrls: ['./main-landing.component.scss']
})
export class MainLandingComponent implements OnInit, OnDestroy {

  /**
   * Collection of customers currently assigned to the user.
   */
  public customers: ICustomer[] = [];

  /**
   * The current logged in user.
   */
  public currentUser: UserProfile;

  /**
   * Indicates if we are currently loading more customers to append
   */
  public isLoadingPaginatedCustomers: boolean = false;

  /**
   * user preferences object used to set sort options on the user home page
   */
  public userPreference: IUserPreference;

  /**
   * A list of subscriptions
   */
  private _subscriptions: Subscription[] = [];

  /**
   * A request to get a list of customers
   */
  private _customerRequest: ICustomerRequest;

  /**
   * A subscription to get customers
   */
  private _customersSubscription: Subscription;

  /**
   * The total number of customers for this user
   */
  private _totalCustomerCount: number = 0;

  /**
   * Creates the main landing component
   */
  constructor(private _customerDataService: CustomerDataService,
              private _navigator: NavigatorService,
              private _userProfileService: UserProfileService) {
  }

  /**
   * On init, subscribe to the navigation state, get the current user, and whether to display hidden customers
   */
  ngOnInit(): void {
    this.userPreference = this._userProfileService.getUserPreferenceForPage(PageContextTypes.USER_HOME);
    this._customerRequest = this._customerDataService.initCustomerRequest(this.userPreference);

    const navState = this._navigator.subscribe('main', (value: INavState) => {
      this._updateCustomersByNavState(value);
    });
    this._updateCustomersByNavState(navState);
  }

  /**
   * On destroy, unsubscribe from any subscriptions
   */
  ngOnDestroy(): void {
    SubscriptionManager.massUnsubscribe([...this._subscriptions, this._customersSubscription]);
    this._navigator.unsubscribe('main');
  }

  /**
   * Handles the emitted event whenever a customer is selected.
   */
  public onCustomerSelect(customerNumber: number): Observable<boolean> {
    return this._navigator.goToCustomerHome(customerNumber);
  }

  /**
   * Handles the emitted event when a plan is selected
   */
  public onPlanSelect(event: any): Observable<boolean> {
    return this._navigator.goToCustomerPlanHome(event.planId, event.customerNumber);
  }

  /**
   * Handles the scroll event to update and/or retrieve information for scrolling
   */
  public onScrollAtBottom(): void {
    if (this._totalCustomerCount === 0) {
      return;
    }

    const currentCustomerCount = this._customerRequest.page * this._customerRequest.pageSize;
    const shouldLoadMoreCustomers = currentCustomerCount < this._totalCustomerCount;
    if (shouldLoadMoreCustomers) {
      this._customerRequest.page++;
      this.isLoadingPaginatedCustomers = true;
      this.searchCustomers();
    }
  }

  /**
   * Hides the given customer
   */
  public onSetHiddenCustomer(customer: ICustomer): void {
    const customers = [...this.customers];
    let customerIndex = customers.findIndex(c => c.customerNumber === customer.customerNumber);
    customers.splice(customerIndex, 1);
    this.customers = customers;
    this._subscriptions.push(this._userProfileService.updateCustomerVisibility(customer).subscribe());
  }

  /**
   * Handles when the sort changes
   **/
  public onSortChange(sortOption: ISortOption): void {
    this._customerRequest.sortBy = sortOption.sortBy;
    this._customerRequest.sortAsc = sortOption.sortAsc;
    this._saveUserSortPreference(sortOption);
    this.resetPaginationAndSearch();
  }

  /**
   * Resets the pagination and performs a search
   */
  public resetPaginationAndSearch(): void {
    this._customerRequest.page = 1;
    this._customerRequest.pageSize = 12;
    this.searchCustomers();
  }

  /**
   * Searches for the customers
   */
  public searchCustomers(): void {
    this._customerRequest.userId = this.currentUser.userId;
    this._resetCustomersSubscription();
    this._customersSubscription = this._customerDataService.getCustomers(this._customerRequest).subscribe((customers: ICustomers) => {
      this._handleCustomersResponse(customers);
      this._resetCustomersSubscription();
    });
  }

  /**
   * Performs actions of toggle button.
   */
  public toggleHiddenCustomers(showHiddenCustomers: boolean): void {
    this._customerRequest.hidden = showHiddenCustomers;
    this.resetPaginationAndSearch();
  }

  /**
   * Handles when getting a new set of customers
   */
  private _handleCustomersResponse(customers: ICustomers): void {
    this._totalCustomerCount = customers.totalCount;
    this.isLoadingPaginatedCustomers = false;

    const newCustomers = customers.customers;
    if (customers.page === 1) {
      this.customers = [...newCustomers];
    } else {
      this.customers = [...this.customers].concat(newCustomers);
    }
  }

  /**
   * Resets the subscription to get a list of customers
   */
  private _resetCustomersSubscription(): void {
    if (this._customersSubscription) {
      this._customersSubscription.unsubscribe();
      this._customersSubscription = null;
    }
  }

  /**
   * Updates user sort preferences by performing api call and updating singleton user in the user profile service
   */
  private _saveUserSortPreference(sortOption: ISortOption): void {
    const userPreference = this._userProfileService.generateUserPreference(sortOption, PageContextTypes.USER_HOME);
    this._subscriptions.push(this._userProfileService.saveUserPreference(userPreference).subscribe());
  }

  /**
   * Updates the customers based on the nav state changes
   */
  private _updateCustomersByNavState(navState: INavState): void {
    const data = navState.data;
    if (isNil(data)) {
      return;
    }

    const customersPageResults = data.customers;
    if (isNil(customersPageResults)) {
      return;
    }

    this._handleCustomersResponse(customersPageResults);
    this.currentUser = data.currentUser;
  }
}
