import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomerLandingService} from '../../services/customer-landing.service';
import {debounce} from '../../../core/decorators/debounce';
import {FilterBarComponent} from '../../../core/components/filter-bar/filter-bar.component';
import {FilterLinkService} from '../../../core/services/filter-link.service';
import {ICoverage} from '../../../core/interfaces/iCoverage';
import {ICustomer} from '../../interfaces/iCustomer';
import {IFilterLink} from '../../../core/interfaces/iFilterLink';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {IPlanAction} from '../../../plan/interfaces/iPlanAction';
import {IPlanRequest} from '../../interfaces/iPlanRequest';
import {IPlanResponse} from '../../../plan/interfaces/iPlanReponse';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import {IProduct} from '../../../core/interfaces/iProduct';
import {IQuickLink} from '../../../core/interfaces/iQuickLink';
import {isNil} from 'lodash';
import {ISortOption} from '../../../core/interfaces/iSortOption';
import {ModalRef} from 'app/ui-controls/classes/modal-references';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {NotificationService} from '../../../core/services/notification.service';
import {NotificationTypes} from '../../../core/models/notification-types';
import {Observable} from 'rxjs/Observable';
import {PageAccessType} from '../../../core/enums/page-access-type';
import {PlanAction} from 'app/plan/enums/plan-action';
import {PlanDataService} from '../../../plan/plan-shared/services/plan-data.service';
import {PlanFilterContextTypes} from 'app/plan/enums/plan-filter-context';
import {PlanListComponent} from '../../../plan/components/plan-list/plan-list.component';
import {ProductDataService} from '../../../core/services/product-data.service';
import {QuickLinkLabel} from '../../../core/enums/quick-link-label';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';
import {Subscription} from 'rxjs/Subscription';

/**
 * A customer landing page component class that serves an the entry view when a customer is selected by the user,
 * which displays a list of plans and actions for each plan, as well as last edits and flags
 */
@Component({
  template: `
    <section class="customer-landing" gprScroll (scrollAtBottom)="onScrollAtBottom()">
      <gpr-breadcrumbs></gpr-breadcrumbs>
      <gpr-customer-landing-banner [customer]="customer"></gpr-customer-landing-banner>
      <gpr-customer-landing-buttons [isAddPlanDisabled]="!canAddPlan"
                                    [isMassUpdateDisabled]="isMassUpdateDisabled"
                                    [isPublishDisabled]="isPublishDisabled"
                                    (addPlanClick)="handleAddPlan()"
                                    (customerInfoClick)="goToCustomerInfo()"
                                    (massUpdateClick)="goToMassUpdate()"
                                    (publishPlansClick)="handlePublishPlans()"></gpr-customer-landing-buttons>
      <div class="row" *ngIf="totalPlanCount > 0">
        <div class="col-md-18">
          <gpr-filter-bar [showSortMenu]="false"
                          [showFilterLinks]="true"
                          [showFilterMenu]="true"
                          [filterLinks]="filterLinks"
                          [filterMenuProperties]="['planName']"
                          (filterLinkChange)="handleFilterLinkChange($event)"
                          (filterMenuChange)="handleFilterMenuChange($event)">
            <ng-container ngProjectAs="filter">
              <gpr-plan-filter [customer]="customer"></gpr-plan-filter>
            </ng-container>
          </gpr-filter-bar>
        </div>
      </div>
      <div class="row">
        <div class="col-md-18">
          <gpr-plan-list [canAddPlan]="canAddPlan"
                         [totalPlanCount]="totalPlanCount"
                         [isSearchingPlans]="isSearchingPlans"
                         [plans]="plans"
                         [sortOptions]="sortOptions"
                         (addPlanClick)="handleAddPlan()"
                         (sortChange)="handleSortChange($event)"
                         (planSelect)="goToPlan($event)"
                         (planAction)="onPlanAction($event)"></gpr-plan-list>
          <gpr-loading-icon [show]="isLoadingPaginatedPlans"></gpr-loading-icon>
        </div>
        <div class="col-md-6">
          <gpr-activity-card [customer]="customer"></gpr-activity-card>
          <gpr-flag-card [customer]="customer"></gpr-flag-card>
          <gpr-quick-links [quickLinks]="quickLinks"></gpr-quick-links>
        </div>
      </div>
    </section>
  `,
  styles: ['.customer-landing {margin-bottom: 160px}']
})
export class CustomerLandingComponent implements OnInit, OnDestroy {

  /**
   * The currently selected customer.
   */
  public customer: ICustomer;

  /**
   * A collection of filter links to pass into {@link FilterBarComponent} to use as filters.
   */
  public filterLinks: IFilterLink[] = [];

  /**
   * The number of plans a customer has, regardless of the current search criteria
   */
  public totalPlanCount: number = 0;

  /**
   * Indicates if the user can add a new plan
   */
  public canAddPlan: boolean = false;

  /**
   * Indicates if the mass update button should be disabled
   */
  public isMassUpdateDisabled: boolean = false;

  /**
   * Indicates if the publish plan button should be disabled
   */
  public isPublishDisabled: boolean = false;

  /**
   * Indicates if a search is currently being performed
   */
  public isSearchingPlans: boolean = false;

  /**
   * Indicates if the more plans are being loaded due to scrolling
   */
  public isLoadingPaginatedPlans: boolean = false;

  /**
   * The sort options for a plan
   */
  public sortOptions: ISortOption[] = [];

  /**
   * A list of plans to display in the {@link PlanListComponent}
   */
  public plans: IPlan[] = [];

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
   * The plan request used to retrieve plans
   */
  private _planRequest: IPlanRequest;

  /**
   * A subscription to get plans
   */
  private _plansSubscription: Subscription;

  /**
   * A subscription to get the products for a specific customer
   */
  private _productSubscription: Subscription;

  /**
   * The current access for this page
   */
  private _pageAccessType: PageAccessType;

  /**
   * A subscription to save user preferences for sort
   */
  private _userSortPreferencesSubscription: Subscription;

  /**
   * The total number of plans in the current search, regardless of pagination
   */
  private _currentSearchPlanCount: number = 0;

  /**
   * Indicates if the current page should recount the initial amount of plans
   * @type {boolean}
   * @private
   */
  private _shouldRecountTotalPlans: boolean = true;

  /**
   * A subscription to the modal
   */
  private _modalSubscription: Subscription;

  /**
   * Creates the customer landing component
   * @param {CustomerLandingService} _customerLandingService
   * @param {FilterLinkService} _filterLinkService
   * @param {NavigatorService} _navigator
   * @param {NotificationService} _notificationService
   * @param {PlanDataService} _planDataService
   * @param {ProductDataService} _productDataService
   */
  constructor(private _customerLandingService: CustomerLandingService,
    private _filterLinkService: FilterLinkService,
    private _navigator: NavigatorService,
    private _notificationService: NotificationService,
    private _planDataService: PlanDataService,
    private _productDataService: ProductDataService) {
  }

  /**
   * On init, subscribe to the navigation state and the plans for this customer
   */
  ngOnInit(): void {
    const navState: INavState = this._navigator.subscribe('customer-landing', (value: INavState) => {
      this._updateNavState(value);
    });
    this._updateNavState(navState);

    this.sortOptions = this._customerLandingService.initSortOptions();
    const activeSortOption = this.sortOptions.find(s => s.active);

    this._planRequest = {
      customerNumber: this.customer.customerNumber,
      sortBy: activeSortOption.sortBy,
      sortAsc: activeSortOption.sortAsc,
      page: PlanDataService.DEFAULT_PAGE,
      pageSize: PlanDataService.DEFAULT_PAGE_SIZE
    };
  }

  /**
   * On destroy, unsubscribe from any subscriptions
   */
  ngOnDestroy(): void {
    const subscriptions: Subscription[] = [
      this._plansSubscription,
      this._productSubscription,
      this._userSortPreferencesSubscription,
      this._modalSubscription
    ];
    SubscriptionManager.massUnsubscribe(subscriptions);
    this._navigator.unsubscribe('customer-landing');
  }

  /**
   * Handles the {@link CustomerLandingButtonsComponent} event emitter when the add plan button is clicked
   */
  public handleAddPlan(): void {
    const addPlanModalRef = this._openAddPlanModal();
    this._modalSubscription = addPlanModalRef.onClose.subscribe(() => {
      this._shouldRecountTotalPlans = true;
      this._getProducts();
      this.resetPaginationAndSearch();
    });
  }

  /**
   * Handles the {@link FilterBarComponent} event emitter when filtering has been updated.
   */
  public handleFilterLinkChange(coverages: ICoverage[]): void {
    this._planRequest.coverages = coverages;
    this.resetPaginationAndSearch();
  }

  /**
   * Handles the {@link FilterMenuComponent} event emitter when filtering has been updated.
   */
  public handleFilterMenuChange(filter: any): void {
    if (isNil(filter)) {
      return;
    }

    if (filter.context !== PlanFilterContextTypes.CUSTOMER_HOME_PAGE) {
      return;
    }

    const planName = filter.planName;
    const planIds = filter.planIds;

    if (isNil(planName) && isNil(planIds)) {
      return;
    }

    this._planRequest.planName = planName;
    this._planRequest.planIds = planIds;
    this.resetPaginationAndSearch();
  }

  /**
   * Handles the {@link CustomerLandingButtonsComponent} event emitter when the publish button is clicked
   */
  public handlePublishPlans(): void {
    // Handle publish
  }

  /**
   * Applies the sort, given the sort by field and sort direction (true for asc, false for desc)
   */
  public handleSortChange(sortOption: ISortOption): void {
    this._planRequest.sortBy = sortOption.sortBy;
    this._planRequest.sortAsc = sortOption.sortAsc;
    this._saveUserSortPreference(sortOption);
    this.resetPaginationAndSearch();
  }

  /**
   * Navigates to the customer information landing page.
   */
  public goToCustomerInfo(): Observable<boolean> {
    return this._navigator.goToCustomerInfoHome(this.customer.customerNumber);
  }

  /**
   * Navigates to the mass update tool landing page.
   */
  public goToMassUpdate(): Observable<boolean> {
    return this._navigator.goToMassUpdateHome(this.customer.customerNumber);
  }

  /**
   * Navigates to the plan landing page.
   */
  public goToPlan(planId: string): Observable<boolean> {
    return this._navigator.goToPlanHome(planId);
  }

  /**
   * Method called when an action was performed on a Plan
   */
  public onPlanAction(planAction: IPlanAction): void {
    if (isNil(planAction)) {
      return;
    }

    const isCopyPlanAction = planAction.planAction === PlanAction.COPY;
    if (isCopyPlanAction) {
      this._handleCopyPlanAction(planAction);
    } else {
      this._handlePlanAction(planAction);
    }
    this._getProducts();
  }

  /**
   * Listens to the scroll event to potentially load more plans
   */
  public onScrollAtBottom(): void {
    if (this._currentSearchPlanCount === 0) {
      return;
    }

    const currentPlanCount = this._planRequest.page * this._planRequest.pageSize;
    const hasMoreResults = currentPlanCount < this._currentSearchPlanCount;
    if (hasMoreResults) {
      this._planRequest.page++;
      this.isLoadingPaginatedPlans = true;
      this.searchPlans();
    }
  }

  /**
   * Resets the pagination and searches for plans
   */
  public resetPaginationAndSearch(): void {
    this._planRequest.page = PlanDataService.DEFAULT_PAGE;
    this._planRequest.pageSize = PlanDataService.DEFAULT_PAGE_SIZE;
    this.isSearchingPlans = true;
    this.searchPlans();
  }

  /**
   * Searches for plans
   */
  @debounce(700)
  public searchPlans(): void {
    this._planRequest.customerNumber = this.customer.customerNumber;

    if (this._plansSubscription) {
      this._plansSubscription.unsubscribe();
      this._plansSubscription = null;
    }

    this._plansSubscription = this._planDataService.searchPlans(this._planRequest)
      .take(1)
      .subscribe((planResponse: IPlanResponse) => {
        this._handlePlanResponse(planResponse);
      });
  }

  /**
   * A call to get the products once plans have been changed
   */
  private _getProducts(): void {
    const customerNumber = this.customer.customerNumber;
    this.filterLinks = [];
    this._planRequest.coverages = [];
    this._productSubscription = this._productDataService.getProductsForCustomer(customerNumber).subscribe((products: IProduct[]) => {
      this.filterLinks = this._filterLinkService.getFilterLinksFromProducts(products);
    });
  }

  /**
   * Handles the plan action for copy
   */
  private _handleCopyPlanAction(planAction: IPlanAction): void {
    if (!isNil(planAction.data) && planAction.data.isDifferentCustomer) {
      this._navigator.goToCustomerHome(planAction.data.customerNumber);
    } else {
      this._shouldRecountTotalPlans = true;
      this.resetPaginationAndSearch();
    }
  }

  /**
   * Handles plan action for anything except copy
   */
  private _handlePlanAction(planAction: IPlanAction): void {
    const hasErrors = !isNil(planAction.error);
    if (hasErrors) {
      this._notificationService.addNotification(NotificationTypes.ERROR, planAction.error);
    } else {
      this._notificationService.addNotification(NotificationTypes.SUCCESS, planAction.data.message);
      this._shouldRecountTotalPlans = true;
      this.resetPaginationAndSearch();
    }
  }

  /**
   * Handles the plan response when searching for plans
   */
  private _handlePlanResponse(planResponse: IPlanResponse): void {
    const planCount = planResponse.totalCount;

    if (this._shouldRecountTotalPlans) {
      this.totalPlanCount = planCount;
      this._shouldRecountTotalPlans = false;
    }

    this._currentSearchPlanCount = planCount;
    this._updateButtons();
    this.isSearchingPlans = false;
    this.isLoadingPaginatedPlans = false;

    const newPlans = planResponse.plans;
    if (planResponse.page === 1) {
      this.plans = [...newPlans];
    } else {
      this.plans = [...this.plans].concat(newPlans);
    }
  }

  /**
   * Creates and opens the add plan modal
   */
  private _openAddPlanModal(): ModalRef {
    return this._customerLandingService.openAddPlanModal(this.customer);
  }

  /**
   * Saves the user's sort preferences
   */
  private _saveUserSortPreference(sortOption: ISortOption): void {
    if (this._userSortPreferencesSubscription) {
      this._userSortPreferencesSubscription.unsubscribe();
      this._userSortPreferencesSubscription = null;
    }

    const saveUserSortPreference$ = this._customerLandingService.saveUserSortPreference(sortOption);
    this._userSortPreferencesSubscription = saveUserSortPreference$.subscribe(() => {
      if (this._userSortPreferencesSubscription) {
        this._userSortPreferencesSubscription.unsubscribe();
        this._userSortPreferencesSubscription = null;
      }
    });
  }

  /**
   * Updates the state of the customer landing buttons
   */
  private _updateButtons(): void {
    const hasPlans = this.totalPlanCount > 0;
    this.canAddPlan = this._customerLandingService.canAddPlan(this.customer, this._pageAccessType);
    this.isMassUpdateDisabled = !hasPlans;
    this.isPublishDisabled = !hasPlans || this._currentSearchPlanCount === 0;
  }

  /**
   * Updates parameters based on the nav state
   */
  private _updateNavState(navState: INavState): void {
    const data = navState.data;
    if (isNil(data)) {
      return;
    }

    this.customer = data.customer;
    this.filterLinks = this._filterLinkService.getFilterLinksFromProducts(data.products);
    this._pageAccessType = data.pageAccessType;
    this._handlePlanResponse(data.customerPlans);
  }
}
