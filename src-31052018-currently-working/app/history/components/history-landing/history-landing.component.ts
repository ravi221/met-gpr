import {Component, OnDestroy, OnInit} from '@angular/core';
import {FilterLinkService} from '../../../core/services/filter-link.service';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {IFilterLink} from '../../../core/interfaces/iFilterLink';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {IPaging} from '../../../customer/interfaces/iPaging';
import {isNil} from 'lodash';
import {ISortOption} from '../../../core/interfaces/iSortOption';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {PageContextTypes} from '../../../core/enums/page-context-types';
import {SortOptionsService} from '../../../core/services/sort-options.service';
import {IHistoryRequestParam} from '../../interfaces/iHistoryRequestParam';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {HistoryService} from '../../services/history.service';
import {IHistoricalPlan} from '../../interfaces/iHistoricalPlan';

/**
 * The landing page for GPR history
 */
@Component({
  selector: 'gpr-history-landing',
  template: `
    <div class="banner padding-top-banner">
      <h4><strong>History</strong></h4>
    </div>
    <div class="row">
      <div class="col-md-23">
        <gpr-filter-bar [showSortMenu]="true"
                        [filterLinks]="filterLinks"
                        [sortOptions]="sortOptions"
                        [showFilterLinks]="true"
                        [showFilterMenu]="true"
                        (filterLinkChange)="handleFilterLinkChange($event)"
                        (filterMenuChange)="handleFilterMenuChange($event)"
                        (sortChange)="applySort($event)">
          <ng-container ngProjectAs="filter">
            <gpr-history-filter [customer]="customer"></gpr-history-filter>
          </ng-container>
        </gpr-filter-bar>
      </div>
    </div>
    <gpr-card>
      <gpr-history-heading [customerName]="customer?.customerName"
                           [customerNumber]="customer?.customerNumber"
                           [effectiveDate]="customer?.effectiveDate">
      </gpr-history-heading>
      <gpr-historical-plan-list [historicalPlans]="historicalPlans"></gpr-historical-plan-list>
    </gpr-card>
  `,
  styleUrls: ['./history-landing.component.scss']
})
export class HistoryLandingComponent implements OnInit, OnDestroy {

  /**
   * The subscription to load the filterLinks and history on initial startup
   */
  private _initSubscription: Subscription;

  /**
   * Information about the customer. Should be passed in using Resolver
   */
  public customer: ICustomer;

  /**
   * An array of history items that hold history information.
   * @type {Array}
   */
  public historicalPlans: IHistoricalPlan[] = [];

  /**
   * The sort options for the history on the History page
   */

  public sortOptions: ISortOption[] = [];

  /**
   * Current paging preferences
   */
  public currentPaging: IPaging;

  /**
   * Observable history objects
   */
  public historicalPlansObservable: Observable<IHistoricalPlan[]>;

  /**
   * The conditions that will be used to Filter History results.
   */
  public filterLinks: IFilterLink[] = [];

  /**
   * Default Paging
   */
  public DEFAULT_PAGING = <IPaging>{
    page: 1,
    pageSize: 15,
    viewWindowPages: 4
  };

  /**
   * Request object to get historyItems
   */
  private _historyRequest;

  /**
   * An Array to hold the coverages that a user will search for
   * @type {Array}
   * @private
   */
  private _coverageIds: string[] = [];

  /**
   * An array of coverages chosen on the filter bar
   * @type {Array}
   * @public
   */
  public chosenCoverageIDs: Array<string> = [];

  /**
   * Creates the history landing component
   */
  constructor(private _historyService: HistoryService,
              private _navigator: NavigatorService,
              private _sortOptionsService: SortOptionsService,
              private _filterLinkService: FilterLinkService) {
  }

  /**
   * On init
   */
  ngOnInit() {
    const navState: INavState = this._navigator.subscribe('history', (value: INavState) => {
      this._updateNavState(value);
    });

    if (isNil(navState)) {
      throw new Error(`The current navigation state should not be null`);
    } else {
      this.customer = navState.data.customer;
      if (!isNil(navState.data.plan)) {
        this._coverageIds = [navState.data.plan.coverageId];
      }
      const customerNumber = this.customer.customerNumber;
      this._handlePageSetUp(customerNumber);
    }
    this._updateNavState(navState);
    this.sortOptions = this._sortOptionsService.getSortOptionsByPage(PageContextTypes.HISTORY);
  }

  /**
   * Method that handles initial loadup of page
   * @param {number} customerNumber
   * @private
   */
  private _handlePageSetUp(customerNumber: number) {
    const iHistoryRequestParam: IHistoryRequestParam = {customerNumber};
    if (this._coverageIds) {
      iHistoryRequestParam.coverageIds = this._coverageIds.toString();
    }
    this.historicalPlansObservable = this._historyService.getPublishedHistory(iHistoryRequestParam);
    this._initSubscription = this.historicalPlansObservable.subscribe((historicalPlans) => {
      this.historicalPlans = historicalPlans;
    });
  }

  /**
   * When the user selects a new sorter in the GPR Sort Menu,
   * call service to get new list sorted.
   */
  public applySort(sortOption: ISortOption): void {
    this._historyRequest = {
      customerNumber: null,
      sortBy: sortOption.sortBy,
      sortAsc: sortOption.sortAsc,
      page: this.DEFAULT_PAGING.page,
      pageSize: this.DEFAULT_PAGING.pageSize
    };
    this.currentPaging = null;
  }

  /**
   * Updates parameters based on the nav state
   * @param {INavState} navState
   * @private
   */
  private _updateNavState(navState: INavState): void {
    const data = navState.data;
    if (isNil(data)) {
      return;
    }
    this.customer = data.customer;
    this.filterLinks = this._filterLinkService.getFilterLinksFromProducts(data.products);
  }

  /**
   * Method that handles the filter change event
   */
  public onFilterChange(coverages: any) {
    this.chosenCoverageIDs = coverages.coverages.map(x => x.id);
  }

  /**
   *
   * @param event
   */
  public handleFilterLinkChange(event) {

  }

  /**
   *
   * @param event
   */
  public handleFilterMenuChange(event) {

  }

  /**
   * Unsubscribe the subscription that manages navigation
   */
  ngOnDestroy(): void {
    this._navigator.unsubscribe('history');

    if (this._initSubscription) {
      this._initSubscription.unsubscribe();
    }
  }
}
