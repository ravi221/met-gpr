import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlanDataService} from '../../../plan/plan-shared/services/plan-data.service';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {NavigatorService} from '../../services/navigator.service';
import {Subscription} from 'rxjs/Subscription';
import {PlansExpansionManager} from '../../classes/plan-expansion-manager';
import {REQUEST_ERROR} from '../../../core/utilities/messages';
import {IPlanRequest} from '../../../customer/interfaces/iPlanRequest';
import {IPlanResponse} from '../../../plan/interfaces/iPlanReponse';
import {PlanFilterContextTypes} from 'app/plan/enums/plan-filter-context';
import {ISortOption} from 'app/core/interfaces/iSortOption';
import {IScrollEvent} from 'app/ui-controls/interfaces/iScrollEvent';
import {PagingService} from 'app/ui-controls/services/paging.service';
import {UserProfile} from 'app/core/models/user-profile';
import {IPaging} from 'app/customer/interfaces/iPaging';
import {ScrollDirection} from 'app/ui-controls/enums/scroll-direction';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {ScrollEventOrigin} from 'app/ui-controls/enums/scroll-event-origin';
import {SortOptionsService} from '../../../core/services/sort-options.service';
import {PageContextTypes} from '../../../core/enums/page-context-types';
import {cloneDeep, isNil} from 'lodash';
import {ISortPreferences} from '../../../core/interfaces/iSortPreferences';
import {IUserPreference} from 'app/core/interfaces/iUserPreference';
import {UserProfileService} from '../../../core/services/user-profile.service';

/**
 * This is one of the main contextual navigation menus.  This displays a list
 * of plans for a customer.  Within the context of the main navigation, this
 * component manages the basic customer data, and the list of plans.  Any
 * additional data needed inside will be managed by inner components.
 */
@Component({
  selector: 'gpr-plans-nav-menu',
  template: `
    <gpr-main-nav-template>
      <header class="nav-header">
        <div class="row">
          <div class="col-md-24">
            <gpr-main-nav-title>{{customer?.customerName}}</gpr-main-nav-title>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <gpr-sort-menu [offsetX]="20" [sortOptions]="sortOptions"
                           (sortChange)="applySort($event)"></gpr-sort-menu>
          </div>
          <div class="col-md-12">
            <gpr-filter-menu (filterChange)="handleFilterMenuChange($event)">
              <ng-container ngProjectAs="filter">
                <gpr-plan-filter [customer]="customer" [context]="context"></gpr-plan-filter>
              </ng-container>
            </gpr-filter-menu>
          </div>
        </div>
      </header>

      <nav class="nav-content">
        <div *ngIf="!showErrorMessage; else error">
          <gpr-loading-icon [show]="isSearchQueued"></gpr-loading-icon>
          <gpr-plan-nav-row [hidden]="isSearchQueued"
                            *ngFor="let plan of plans"
                            [customerNumber]="customer.customerNumber"
                            [plan]="plan"
                            [expansionManager]="expansionManager"
                            [sortPreferences]="currentSortPrefs">
          </gpr-plan-nav-row>
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
  styleUrls: ['./plans-nav-menu.component.scss']
})
export class PlansNavMenuComponent implements OnInit, OnDestroy {
  /**
   * The customer corresponding to the current UI state.  This may or may
   * not be passed in from the parent component; if it is null then we will
   * get it from the nav state.
   */
  @Input() customer: ICustomer;

  /**
   * The list of plans on the customer.  Each plan will correspond to a row in the menu.
   */
  public plans: Array<IPlan> = [];

  /**
   * Maintains the state of which plans and categories are expanded
   */
  public expansionManager: PlansExpansionManager;

  /**
   * A message to display in case there are any issues when loading data
   */
  public errorMessage: string;

  /**
   * Flag used to show error message and hide plans
   */
  public showErrorMessage: boolean = false;

  /**
   * Context to send to plan filter
   */
  public context: PlanFilterContextTypes = PlanFilterContextTypes.MAIN_MENU;

  /**
   * The sort options for a plan on Nav Menu
   */
  public sortOptions: ISortOption[] = [];

  /**
   * Current User Profile
   */
  public user: UserProfile;

  /**
   * Current paging preferences
   */
  public currentPaging: IPaging;

  /**
   * Current sort preferences
   */
  public currentSortPrefs: ISortPreferences;

  /**
   * Default Paging
   */
  public DEFAULT_PAGING = <IPaging>{
    page: 1,
    pageSize: 15,
    viewWindowPages: 4
  };

  /**
   * Used to show and hide loading icon while service is call is being made
   */
  public isSearchQueued: boolean;

  /**
   * Plans Subscription
   */
  private _plansSubscription: Subscription;

  /**
   * Request object to get plans
   */
  private _planRequest: IPlanRequest;

  /**
   * Subscription to the scrolling service
   */
  private _scrollSubscription: Subscription;

  /**
   * Variable used to store navigation context data
   */
  private _navData: any;

  /**
   * Collection of the default sort option for Plans Nav menu
   */
  private _defaultSortOptions: ISortOption[] = [];
  /**
   * A subscription to save user preferences for sort
   */
  private _userSortPreferencesSubscription: Subscription;

  /**
   * Creates the Plans Nav Menu component
   * @param {NavigatorService} _navigator
   * @param {PlanDataService} _planDataService
   * @param {ScrollService} _scrollService
   * @param {SortOptionsService} _sortOptionsService
   * @param {PagingService} _pagingService
   * @param {UserProfileService} _userProfileService
   */
  constructor(private _navigator: NavigatorService,
    private _planDataService: PlanDataService,
    private _scrollService: ScrollService,
    private _sortOptionsService: SortOptionsService,
    private _pagingService: PagingService,
    private _userProfileService: UserProfileService) {
  }

  /**
   * On init, setup the plans
   */
  ngOnInit(): void {
    this._scrollSubscription = this._scrollService.scrollEvent$.subscribe(event => {
      if (event.eventOrigin === ScrollEventOrigin.MAIN_NAV_MENU) {
        this.onScrollEventHandler(event);
      }
    });
    this.sortOptions = this._sortOptionsService.getSortOptionsByPage(PageContextTypes.NAV_MENU_PLANS);
    const userPreference = this._userProfileService.getUserPreferenceForPage(PageContextTypes.NAV_MENU_PLANS);
    this._defaultSortOptions = cloneDeep(this.sortOptions);
    this._initSortOptions(userPreference);
    this.currentPaging = null;
    this._planRequest = {
      customerNumber: null,
      sortBy: this.currentSortPrefs.sortBy,
      sortAsc: this.currentSortPrefs.sortAsc,
      page: this.DEFAULT_PAGING.page,
      pageSize: this.DEFAULT_PAGING.pageSize
    };
    this.expansionManager = new PlansExpansionManager();

    const navState = this._navigator.getNavigationState();
    this._navData = navState.data;
    this._loadNavData(true);
  }

  /**
   * On destroy, unsubscribe from any subscription held
   */
  ngOnDestroy(): void {
    if (this._plansSubscription) {
      this._plansSubscription.unsubscribe();
    }
    if (this._scrollSubscription) {
      this._scrollSubscription.unsubscribe();
    }
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
    this._planRequest = {
      customerNumber: null,
      sortBy: sortOption.sortBy,
      sortAsc: sortOption.sortAsc,
      page: this.DEFAULT_PAGING.page,
      pageSize: this.DEFAULT_PAGING.pageSize
    };
    this.currentPaging = null;

    const userPreference: IUserPreference = {
      sortBy: sortOption.sortBy,
      sortAsc: sortOption.sortAsc,
      pageName: PageContextTypes.NAV_MENU_PLANS,
      editDisplayCount: 0
    };
    this._userSortPreferencesSubscription = this._userProfileService.saveUserPreference(userPreference).subscribe(() => {
      if (this._userSortPreferencesSubscription) {
        this._userSortPreferencesSubscription.unsubscribe();
      }
    });

    this._loadNavData(true);
  }

  /**
   * Handles the {@link FilterMenuComponent} event emitter when filtering has been updated.
   * @param filter
   */
  public handleFilterMenuChange(filter: any): void {
    if (filter && filter.context === this.context) {
      this._planRequest.planName = filter.planName;
      this._planRequest.planIds = filter.planIds;
      this._loadNavData(true);
    }
  }

  /**
   * Handles the scroll event to update and/or retrieve information for scrolling
   * @param event string representation of scroll direction
   */
  public onScrollEventHandler(event: IScrollEvent): void {
    if (event.isNearBottom && this.currentPaging && this.plans.length < this.currentPaging.totalCount
      && this.currentPaging.page === this.currentPaging.pagesRetrieved) {
      this.currentPaging.direction = ScrollDirection.NEXT;
      this._loadNavData(false);
    }
  }

  /**
   * Loads all pertinent information for the current nav menu context
   * @param {boolean} clearPaging
   * @private
   */
  private _loadNavData(clearPaging: boolean): void {
    const handleError = () => {
      this.errorMessage = REQUEST_ERROR;
      this.isSearchQueued = false;
      this.showErrorMessage = true;
    };

    if (isNil(this.customer) && !isNil(this._navData) && !isNil(this._navData.customer)) {
      this.customer = this._navData.customer;
    }

    if (!isNil(this.customer)) {
      this._planRequest.customerNumber = this.customer.customerNumber;
      if (this._plansSubscription) {
        this._plansSubscription.unsubscribe();
      }
      if (clearPaging) {
        this.isSearchQueued = true;
      }
      this._plansSubscription = this._planDataService.searchPlans(this._planRequest, this.currentPaging).subscribe((planResponse: IPlanResponse) => {
        this.isSearchQueued = false;
        if (clearPaging) {
          this.plans = planResponse.plans;
          this.currentPaging = this._pagingService.initializePaging(this.plans.length, planResponse.totalCount, this.DEFAULT_PAGING);
        } else {
          this._pagingService.processItems(this.plans, planResponse.plans, this.currentPaging);
        }
        if (isNil(this.plans) || this.plans.length === 0) {
          this.errorMessage = 'No Plans appear for the Customer';
          this.showErrorMessage = true;
        } else {
          this.errorMessage = null;
          this.showErrorMessage = false;
        }
      }, handleError);
    } else {
      handleError();
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

}
