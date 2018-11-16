import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {CustomerDataService} from '../../../customer/services/customer-data.service';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {ISearchResults} from '../../interfaces/iSearchResults';
import {ISearchState} from '../../interfaces/iSearchState';
import {ISearchUser} from '../../interfaces/iSearchUser';
import {ISortOption} from '../../../core/interfaces/iSortOption';
import {NavContextType} from '../../../navigation/enums/nav-context';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {SearchBarService} from '../../services/search-bar.service';
import {SearchByOptions} from '../../enums/SearchByOptions';
import {SearchForOptions} from '../../enums/SearchForOptions';
import {SearchResultTitleService} from '../../services/search-result-title.service';
import {SearchService} from '../../services/search.service';
import {SearchStateService} from '../../services/search-state.service';
import {SearchTypes} from '../../enums/SearchTypes';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';
import {Subscription} from 'rxjs/Subscription';

/**
 * The search component which contains all elements used for searching
 */
@Component({
  selector: 'gpr-search-page',
  template: `
    <section class="search-page">
      <gpr-search-options-bar [searchState]="searchState"
                              (searchByOptionChange)="onSearchByOptionChange($event)"
                              (searchForOptionChange)="onSearchForOptionChange($event)"></gpr-search-options-bar>
      <div [ngSwitch]="isUserSearch">
        <gpr-search-user-bar *ngSwitchCase="true"
                             (userSelect)="onUserSelect($event)"></gpr-search-user-bar>
        <gpr-search-bar *ngSwitchCase="false"
                        [delayMs]="searchDelayMs"
                        [minSearchLength]="minSearchLength"
                        [placeholder]="'Type at least two characters to begin search.'"
                        (searchTriggered)="onSearchTriggered($event)"
                        (searchTyped)="onSearchTyped($event)"></gpr-search-bar>
      </div>
      <div class="search-title-sort">
        <gpr-search-title [searchState]="searchState"></gpr-search-title>
        <gpr-search-sort [searchState]="searchState" (sortChange)="onSortChange($event)"></gpr-search-sort>
      </div>
      <gpr-search-result-list [searchState]="searchState"
                              (attributeDetailsClick)="onAttributeDetailsClick($event)"
                              (customerClick)="onCustomerClick($event)"
                              (planClick)="onPlanClick($event)"
                              (showMoreResultsClick)="onShowMoreResultsClick()"
                              (showMoreResultsScroll)="onShowMoreResultsScroll()"
                              (sortChange)="onSortChange($event)"></gpr-search-result-list>
    </section>
  `,
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {

  /**
   * Emits event when the show all results button has clicked
   */
  @Output() showMoreResultsClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The amount of time to delay the search from firing
   */
  public searchDelayMs: number = 500;

  /**
   * The minimum number of letters required to perform a search
   */
  public minSearchLength: number = 2;

  /**
   * Indicates if the current search is by user
   */
  public isUserSearch: boolean = false;

  /**
   * Represents the current search state
   */
  public searchState: ISearchState;

  /**
   * The current search results, used to track pagination
   */
  private _searchResults: ISearchResults;

  /**
   * A subscription to get any changes for the search state
   */
  private _searchStateSubscription: Subscription;

  /**
   * A subscription to the search service
   */
  private _searchSubscription: Subscription;

  /**
   * Creates the search page component
   * @param {CustomerDataService} _customerDataService
   * @param {NavigatorService} _navigator
   * @param {SearchBarService} _searchBarService
   * @param {SearchService} _searchService
   * @param {SearchStateService} _searchStateService
   * @param {SearchResultTitleService} _searchResultTitleService
   */
  constructor(private _customerDataService: CustomerDataService,
              private _navigator: NavigatorService,
              private _searchBarService: SearchBarService,
              private _searchService: SearchService,
              private _searchStateService: SearchStateService,
              private _searchResultTitleService: SearchResultTitleService) {
  }

  /**
   * On init, subscribe to any navigation state changes and the search state service
   */
  ngOnInit(): void {
    this._searchStateSubscription = this._searchStateService.getChanges().subscribe(searchState => {
      this._handleSearchStateChanges(searchState);
    });

    const navState = this._navigator.subscribe('search-page', (value: INavState) => {
      this._updateByNavState(value);
    });
    this._updateByNavState(navState);
  }

  /**
   * On destroy, unsubscribe from any subscriptions
   */
  ngOnDestroy(): void {
    const subscriptions: Subscription[] = [
      this._searchStateSubscription,
      this._searchSubscription
    ];
    SubscriptionManager.massUnsubscribe(subscriptions);
    this._navigator.unsubscribe('search-page');
  }

  /**
   * When an attribute search plans button is clicked
   */
  public onAttributeDetailsClick(attribute: any): void {
    this._navigator.goToSearchHome();
    const searchParams = {
      model: attribute.model,
      planIds: attribute.planIds,
      attributeLabel: attribute.attributeLabel
    };
    this._searchStateService.setOptionalSearchParams(searchParams);
    this._searchStateService.setSearchType(SearchTypes.ATTRIBUTE_DETAILS);
  }

  /**
   * When a customer is clicked, navigate to that customer's Customer Home Page
   */
  public onCustomerClick(customerNumber: number): void {
    this._navigator.goToCustomerHome(customerNumber);
  }

  /**
   * When a plan is clicked, navigate to that plan's Plan Home Page
   */
  public onPlanClick(planId: string): void {
    this._navigator.goToPlanHome(planId);
  }

  /**
   * Function called when the search by option is changed
   */
  public onSearchByOptionChange(searchByOption: SearchByOptions): void {
    this._searchBarService.focus();

    if (searchByOption === SearchByOptions.BY_USER) {
      this._navigator.goToSearchHome();
    }
    this._searchStateService.setSearchByOption(searchByOption);
  }

  /**
   * Function called when the search for option is changed
   */
  public onSearchForOptionChange(searchForOption: SearchForOptions): void {
    this._searchBarService.focus();
    this._searchStateService.setSearchForOption(searchForOption);
  }

  /**
   * Handles when the {@link SearchResultListComponent} emits a scroll event to load more results
   */
  public onShowMoreResultsScroll(): void {
    const isSearchContext = this.searchState.navContext === NavContextType.SEARCH;
    if (!isSearchContext) {
      return;
    }

    const nextPage = this.searchState.page + 1;
    this._searchStateService.setPage(nextPage);
  }

  /**
   * Event handler when the search is triggered, calls the back-end service to get search results
   */
  public onSearchTriggered(searchField: string): void {
    this._searchStateService.setSearchField(searchField);
    this._searchStateService.setSearchTriggered(true);
  }

  /**
   * Event handler when the search field text changes
   */
  public onSearchTyped(searchField: string): void {
    this._searchStateService.setSearchField(searchField);
  }

  /**
   * Function to emit event when the show all results link is clicked
   */
  public onShowMoreResultsClick(): void {
    this.showMoreResultsClick.emit();
  }

  /**
   * Handles when the sort changes from the {@link SearchSortComponent}
   */
  public onSortChange(sortOption: ISortOption): void {
    this._searchStateService.setSortAsc(sortOption.sortAsc);
    this._searchStateService.setSortBy(sortOption.sortBy);
  }

  /**
   * Function called when a user has been selected, used to perform search on user
   */
  public onUserSelect(user: ISearchUser): void {
    this._searchStateService.setSearchField(user.userId);
    this._searchStateService.setSearchTriggered(true);
  }

  /**
   * Sets the serach results based on the current pagination
   */
  private _getPaginatedSearchResults(searchResults: ISearchResults): ISearchResults {
    if (searchResults.page === 1) {
      this._searchResults = searchResults;
      return searchResults;
    }
    const previousResults = [...this._searchResults.results];
    const newResults = searchResults.results;
    this._searchResults = searchResults;
    this._searchResults.results = previousResults.concat(newResults);
    return this._searchResults;
  }

  /**
   * Handles any changes done to the search state
   */
  private _handleSearchStateChanges(searchState: ISearchState): void {
    if (!searchState) {
      return;
    }
    this.searchState = searchState;
    this._searchResultTitleService.setSearchField(searchState.searchField);
    this.isUserSearch = searchState.searchType === SearchTypes.BY_USER;
    this._searchService.setSearchState(searchState);

    if (searchState.isSearchTriggered) {
      this._searchStateService.setSearchTriggered(false);
      this._performSearch();
    }
  }

  /**
   * Handles when there are new search results
   */
  private _handleSearchResults(searchResults: ISearchResults): void {
    const paginatedSearchResults = this._getPaginatedSearchResults(searchResults);
    this._searchStateService.setShowSearchResults(true);
    this._searchStateService.setSearchResults(paginatedSearchResults);
    this._searchStateService.setSearchQueued(false);
    this._resetSearchSubscription();
  }

  /**
   * Calls the search service with an optional search params
   */
  private _performSearch(): void {
    if (!this._searchService.canSearch()) {
      return;
    }

    this._resetSearchSubscription();
    this._searchSubscription = this._searchService.search().subscribe((searchResults: ISearchResults) => {
      this._handleSearchResults(searchResults);
    });
  }

  /**
   * Resets the search subscription
   */
  private _resetSearchSubscription(): void {
    if (this._searchSubscription) {
      this._searchSubscription.unsubscribe();
      this._searchSubscription = null;
    }
  }

  /**
   * Updates the view when the nav context is changed
   */
  private _updateByNavState(navState: INavState): void {
    const params = navState.params;
    if (params) {
      const customerNumber = +params.get('customerNumber');
      this._updateSearchCustomer(customerNumber);
    }
    this._searchStateService.setNavContext(navState.context);
  }

  /**
   * Gets the current customer to search based on a customer number
   */
  private _updateSearchCustomer(customerNumber: number): void {
    if (!customerNumber) {
      return;
    }
    const subscription = this._customerDataService.getCustomer(customerNumber).subscribe(customer => {
      this._searchStateService.setSearchCustomer(customer);
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }
}
