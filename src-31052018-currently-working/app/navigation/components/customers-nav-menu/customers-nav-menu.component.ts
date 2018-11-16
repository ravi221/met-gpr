import {cloneDeep, isNil} from 'lodash';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {CustomerDataService} from '../../../customer/services/customer-data.service';
import {ICustomerRequest} from '../../../customer/interfaces/iCustomerRequest';
import {ICustomers} from '../../../customer/interfaces/iCustomers';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {IScrollEvent} from 'app/ui-controls/interfaces/iScrollEvent';
import {ISortOption} from 'app/core/interfaces/iSortOption';
import {ISortPreferences} from 'app/core/interfaces/iSortPreferences';
import {IUserPreference} from 'app/core/interfaces/iUserPreference';
import {PageContextTypes} from '../../../core/enums/page-context-types';
import {REQUEST_ERROR} from '../../../core/utilities/messages';
import {ScrollEventOrigin} from 'app/ui-controls/enums/scroll-event-origin';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {SortOptionsService} from '../../../core/services/sort-options.service';
import {Subscription} from 'rxjs/Subscription';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {UserProfile} from 'app/core/models/user-profile';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';

/**
 * This is one of the main contextual navigation menus.  This displays a list
 * of customers for a user.  Within the context of the main navigation, this
 * component manages only the list of customers; any additional data needed
 * inside will be managed by inner components.
 */
@Component({
  selector: 'gpr-customers-nav-menu',
  template: `
    <gpr-main-nav-template>
      <header class="nav-header">
        <div class="row">
          <div class="col-md-24">
            <gpr-main-nav-title>Customers</gpr-main-nav-title>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <gpr-sort-menu [offsetX]="20" [sortOptions]="sortOptions" (sortChange)="applySort($event)"></gpr-sort-menu>
          </div>
        </div>
      </header>

      <nav class="nav-content">
        <div *ngIf="!showErrorMessage; else error">
          <gpr-customer-nav-row [hidden]="!hasCustomers"
                                *ngFor="let customer of customers"
                                (click)="selectCustomer(customer)"
                                [customer]="customer"
                                [sortPreferences]="currentSortPrefs">
          </gpr-customer-nav-row>
          <gpr-loading-icon [show]="isLoadingPaginatedCustomers || !hasCustomers"></gpr-loading-icon>
        </div>
        <ng-template #error>
          <span class="nav-menu-error-message">
          <gpr-icon [name]="'validation-error'"></gpr-icon>
          <span>{{errorMessage}}</span>
        </span>
        </ng-template>
      </nav>
    </gpr-main-nav-template>
  `,
  styleUrls: ['./customers-nav-menu.component.scss']
})
export class CustomersNavMenuComponent implements OnInit, OnDestroy {

  /**
   * Emits an event when a customer is selected
   */
  @Output() customerSelect: EventEmitter<ICustomer> = new EventEmitter();

  /**
   * The list of customers.  Each customer will correspond to a row in the menu.
   */
  public customers: ICustomer[] = [];

  /**
   * A message to display in case there are any issues when loading data
   */
  public errorMessage: string;

  /**
   * Flag used to show error message and hide customers
   */
  public showErrorMessage: boolean = false;

  /**
   * The sort options for a customer
   */
  public sortOptions: ISortOption[] = [];

  /**
   * Current User Profile
   */
  public user: UserProfile;

  /**
   * Current sort preferences
   */
  public currentSortPrefs: ISortPreferences;

  /**
   * Used to show and hide loading icon while service is call is being made
   */
  public hasCustomers: boolean = false;

  /**
   * Indicates if the menu is loading more customers
   */
  public isLoadingPaginatedCustomers: boolean = false;

  /**
   * Subscription for the get customers call
   */
  private _customersSubscription: Subscription;

  /**
   * A request to get a list of customers
   */
  private _customerRequest: ICustomerRequest;

  /**
   * Collection of the default sort option for Customer Nav menu
   */
  private _defaultSortOptions: ISortOption[] = [];

  /**
   * Subscription to the navigator scrolling service
   */
  private _scrollSubscription: Subscription;

  /**
   * A subscription to save user preferences for sort
   */
  private _userSortPreferencesSubscription: Subscription;

  /**
   * The total number of customers for this user
   */
  private _totalCustomerCount: number = 0;

  /**
   * Creates the Customers Nav Menu component
   * @param {CustomerDataService} _customerDataService
   * @param {UserProfileService} _userProfileService
   * @param {ScrollService} _scrollService
   * @param {SortOptionsService} _sortOptionsService
   */
  constructor(private _customerDataService: CustomerDataService,
              private _userProfileService: UserProfileService,
              private _scrollService: ScrollService,
              private _sortOptionsService: SortOptionsService) {
  }

  /**
   * On init, get the customers
   */
  ngOnInit(): void {
    this.user = this._userProfileService.getCurrentUserProfile();
    const userPreference = this._userProfileService.getUserPreferenceForPage(PageContextTypes.NAV_MENU_CUSTOMERS);
    this._customerRequest = this._customerDataService.initCustomerRequest(userPreference, this.user.userId);

    this._scrollSubscription = this._scrollService.scrollEvent$.subscribe((scrollEvent: IScrollEvent) => {
      const isNavMenuContext = scrollEvent.eventOrigin === ScrollEventOrigin.MAIN_NAV_MENU;
      const isNearBottom = scrollEvent.isNearBottom;
      if (isNavMenuContext && isNearBottom) {
        this.checkToLoadMoreCustomers();
      }
    });
    this.sortOptions = this._sortOptionsService.getSortOptionsByPage(PageContextTypes.NAV_MENU_CUSTOMERS);
    this._defaultSortOptions = cloneDeep(this.sortOptions);
    this._initSortOptions(userPreference);
    this.searchCustomers();
  }

  /**
   * On destroy, unsubscribes from subscription
   */
  ngOnDestroy(): void {
    const subscriptions: Subscription[] = [
      this._customersSubscription,
      this._scrollSubscription
    ];
    SubscriptionManager.massUnsubscribe(subscriptions);
  }

  /**
   * When the user selects a new sorter in the GPR Sort Menu,
   * call service to get new list sorted.
   */
  public applySort(sortOption: ISortOption): void {
    if (this.currentSortPrefs.sortBy !== sortOption.sortBy) {
      const defaultSort = this._defaultSortOptions.find(o => o.sortBy === sortOption.sortBy);
      sortOption.sortAsc = defaultSort.sortAsc;
    }
    this.currentSortPrefs = <ISortPreferences>{
      sortAsc: sortOption.sortAsc,
      sortBy: sortOption.sortBy
    };
    this._saveUserSortPreference(sortOption);
    this._customerRequest.sortBy = sortOption.sortBy;
    this._customerRequest.sortAsc = sortOption.sortAsc;
    this.resetPaginationAndSearch();
  }

  /**
   * Handles the scroll event to update and/or retrieve information for scrolling
   */
  public checkToLoadMoreCustomers(): void {
    if (this._totalCustomerCount === 0) {
      return;
    }

    const currentCustomerCount = this._customerRequest.page * this._customerRequest.pageSize;
    const hasMoreResults = currentCustomerCount < this._totalCustomerCount;
    if (hasMoreResults) {
      this._customerRequest.page++;
      this.isLoadingPaginatedCustomers = true;
      this.searchCustomers();
    }
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
   * Searches for customers
   */
  public searchCustomers(): void {
    this._resetCustomersSubscription();
    this._customersSubscription = this._customerDataService.getCustomers(this._customerRequest).subscribe((customers: ICustomers) => {
      this._handleCustomersResponse(customers);
      this._resetCustomersSubscription();
    }, () => {
      this._displayErrorMessage();
    });
  }

  /**
   * Emits the customerSelect event
   */
  public selectCustomer(customer: ICustomer): void {
    this.customerSelect.emit(customer);
  }

  /**
   * Checks if to display an error message after getting a new set of customers
   */
  private _checkToDisplayErrorMessage(): void {
    if (isNil(this.customers) || this.customers.length === 0) {
      this.errorMessage = 'No Customers appear for this user';
      this.showErrorMessage = true;
    } else {
      this.errorMessage = null;
      this.showErrorMessage = false;
    }
  }

  /**
   * Displays the error message when an error occurs
   */
  private _displayErrorMessage(): void {
    this.errorMessage = REQUEST_ERROR;
    this.hasCustomers = false;
    this.showErrorMessage = true;
    this.isLoadingPaginatedCustomers = false;
  }

  /**
   * Handles when getting a new set of customers
   */
  private _handleCustomersResponse(customers: ICustomers): void {
    const newCustomers = customers.customers;
    if (customers.page === 1) {
      this.customers = [...newCustomers];
    } else {
      this.customers = [...this.customers].concat(newCustomers);
    }

    this._totalCustomerCount = customers.totalCount;
    this.hasCustomers = this.customers.length > 0;
    this.isLoadingPaginatedCustomers = false;
    this._checkToDisplayErrorMessage();
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
   * Initializes the sort options for this page, given the current user preferences
   * @param {IUserPreference} userPreference
   * @private
   */
  private _initSortOptions(userPreference: IUserPreference): void {
    if (isNil(userPreference)) {
      this._setDefaultSort();
    } else {
      let activeSortOption = this.sortOptions.find(s => s.sortBy === userPreference.sortBy);
      if (!isNil(activeSortOption)) {
        this.sortOptions.forEach(s => {
          s.active = false;
        });
        activeSortOption.active = true;
        activeSortOption.sortAsc = userPreference.sortAsc;
        this.currentSortPrefs = <ISortPreferences>{
          sortAsc: userPreference.sortAsc,
          sortBy: userPreference.sortBy
        };
      } else {
        this._setDefaultSort();
      }
    }
  }

  /**
   * Returns sorting menu back to default sort
   */
  private _setDefaultSort() {
    this.sortOptions.forEach(s => {
      s.active = false;
    });
    const defaultSort = this._defaultSortOptions.find(s => s.active);
    const activeSortOption = this.sortOptions.find(s => s.sortBy === defaultSort.sortBy);
    activeSortOption.active = true;
    activeSortOption.sortAsc = defaultSort.sortAsc;
    this.currentSortPrefs = <ISortPreferences>{
      sortAsc: activeSortOption.sortAsc,
      sortBy: activeSortOption.sortBy
    };
  }

  /**
   * Updates user sort preferences by performing api call and updating singleton user in the user profile service
   */
  private _saveUserSortPreference(sortOption: ISortOption): void {
    const userPreference = this._userProfileService.generateUserPreference(sortOption, PageContextTypes.NAV_MENU_CUSTOMERS);
    this._userSortPreferencesSubscription = this._userProfileService.saveUserPreference(userPreference).subscribe(() => {
      if (this._userSortPreferencesSubscription) {
        this._userSortPreferencesSubscription.unsubscribe();
      }
    });
  }
}
