import {Injectable} from '@angular/core';
import {ISearchResults} from '../interfaces/iSearchResults';
import {Observable} from 'rxjs/Observable';
import {SearchTypes} from '../enums/SearchTypes';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {NavContextType} from '../../navigation/enums/nav-context';
import {SearchByOptions} from '../enums/SearchByOptions';
import {SearchForOptions} from '../enums/SearchForOptions';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {isNil} from 'lodash';

/**
 * A service to maintain the search state
 */
@Injectable()
export class SearchStateService {

  /**
   * Indicates if a new search is queued
   * @type {BehaviorSubject<boolean>}
   * @private
   */
  private _isSearchQueued: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Indicates if a search should occur
   * @type {BehaviorSubject<boolean>}
   * @private
   */
  private _isSearchTriggered: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The current nav context
   * @type {BehaviorSubject<NavContextType>}
   * @private
   */
  private _navContext: BehaviorSubject<NavContextType> = new BehaviorSubject<NavContextType>(NavContextType.DEFAULT);

  /**
   * The current optional search params
   * @type {BehaviorSubject<any>}
   * @private
   */
  private _optionalSearchParams: BehaviorSubject<any> = new BehaviorSubject<any>({});

  /**
   * The current page to get
   * @type {BehaviorSubject<number>}
   * @private
   */
  private _page: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  /**
   * The current size of the page to get
   * @type {BehaviorSubject<number>}
   * @private
   */
  private _pageSize: BehaviorSubject<number> = new BehaviorSubject<number>(4);

  /**
   * The current search by option
   * @type {BehaviorSubject<SearchByOptions>}
   * @private
   */
  private _searchByOption: BehaviorSubject<SearchByOptions> = new BehaviorSubject<SearchByOptions>(SearchByOptions.ALL_CUSTOMERS);

  /**
   * The current customer being search on
   * @type {BehaviorSubject<ICustomer>}
   * @private
   */
  private _searchCustomer: BehaviorSubject<ICustomer> = new BehaviorSubject<ICustomer>(null);

  /**
   * The current search field to search by
   * @type {BehaviorSubject<string>}
   * @private
   */
  private _searchField: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * The current search for option
   * @type {BehaviorSubject<SearchForOptions>}
   * @private
   */
  private _searchForOption: BehaviorSubject<SearchForOptions> = new BehaviorSubject<SearchForOptions>(null);

  /**
   * The current search results
   * @type {BehaviorSubject<ISearchResults>}
   * @private
   */
  private _searchResults: BehaviorSubject<ISearchResults> = new BehaviorSubject<ISearchResults>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    results: []
  });

  /**
   * The current search type
   * @type {BehaviorSubject<SearchTypes>}
   * @private
   */
  private _searchType: BehaviorSubject<SearchTypes> = new BehaviorSubject<SearchTypes>(SearchTypes.ALL_CUSTOMERS);

  /**
   * Indicates if to display the search results
   * @type {BehaviorSubject<boolean>}
   * @private
   */
  private _showSearchResults: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Determines which field to sort the search results by
   * @type {BehaviorSubject<string>}
   * @private
   */
  private _sortBy: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Indicates whether to sort search results ascending
   * @type {BehaviorSubject<boolean>}
   * @private
   */
  private _sortAsc: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * Gets any changes that are made to search state as an observable
   * @returns {Observable<any>}
   */
  getChanges(): Observable<any> {
    return Observable.combineLatest(
      this._getSearchQueued(),
      this._getSearchTriggered(),
      this._getNavContext(),
      this._getOptionalSearchParams(),
      this._getPage(),
      this._getPageSize(),
      this._getSearchByOption(),
      this._getSearchCustomer(),
      this._getSearchField(),
      this._getSearchForOption(),
      this._getSearchResults(),
      this._getSearchType(),
      this._getShowSearchResults(),
      this._getSortAsc(),
      this._getSortBy(),
      (isSearchQueued,
       isSearchTriggered,
       navContext,
       optionalSearchParams,
       page,
       pageSize,
       searchByOption,
       searchCustomer,
       searchField,
       searchForOption,
       searchResults,
       searchType,
       showSearchResults,
       sortAsc,
       sortBy) => (
        {
          isSearchQueued,
          isSearchTriggered,
          navContext,
          optionalSearchParams,
          page,
          pageSize,
          searchByOption,
          searchCustomer,
          searchField,
          searchForOption,
          searchResults,
          searchType,
          showSearchResults,
          sortAsc,
          sortBy
        })
    ).debounceTime(50);
  }

  /**
   * Gets if a search is queued
   * @returns {Observable<boolean>}
   * @private
   */
  private _getSearchQueued(): Observable<boolean> {
    return this._isSearchQueued.asObservable().distinctUntilChanged();
  }

  /**
   * Gets if a search should be triggered
   * @returns {Observable<boolean>}
   * @private
   */
  private _getSearchTriggered(): Observable<boolean> {
    return this._isSearchTriggered.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the nav context
   * @returns {Observable<NavContextType>}
   * @private
   */
  private _getNavContext(): Observable<NavContextType> {
    return this._navContext.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the optional search params
   * @returns {Observable<any>}
   * @private
   */
  private _getOptionalSearchParams(): Observable<any> {
    return this._optionalSearchParams.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the page
   * @returns {Observable<number>}
   * @private
   */
  private _getPage(): Observable<number> {
    return this._page.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the page size
   * @returns {Observable<number>}
   * @private
   */
  private _getPageSize(): Observable<number> {
    return this._pageSize.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the search by option
   * @returns {Observable<SearchByOptions>}
   * @private
   */
  private _getSearchByOption(): Observable<SearchByOptions> {
    return this._searchByOption.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the search customer
   * @returns {Observable<ICustomer>}
   * @private
   */
  private _getSearchCustomer(): Observable<ICustomer> {
    return this._searchCustomer.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the search field
   * @returns {Observable<string>}
   * @private
   */
  private _getSearchField(): Observable<string> {
    return this._searchField.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the search for option
   * @returns {Observable<SearchForOptions>}
   * @private
   */
  private _getSearchForOption(): Observable<SearchForOptions> {
    return this._searchForOption.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the search results
   * @returns {Observable<ISearchResults>}
   * @private
   */
  private _getSearchResults(): Observable<ISearchResults> {
    return this._searchResults.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the search type
   * @returns {Observable<SearchTypes>}
   * @private
   */
  private _getSearchType(): Observable<SearchTypes> {
    return this._searchType.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the showSearchResults indicator
   * @returns {Observable<boolean>}
   * @private
   */
  private _getShowSearchResults(): Observable<boolean> {
    return this._showSearchResults.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the sortAsc indicator
   * @returns {Observable<boolean>}
   * @private
   */
  private _getSortAsc(): Observable<boolean> {
    return this._sortAsc.asObservable().distinctUntilChanged();
  }

  /**
   * Gets the sort by field
   * @returns {Observable<boolean>}
   * @private
   */
  private _getSortBy(): Observable<string> {
    return this._sortBy.asObservable().distinctUntilChanged();
  }

  /**
   * Sets if the queue a search
   * @param {boolean} isSearchQueued
   */
  public setSearchQueued(isSearchQueued: boolean): void {
    this._isSearchQueued.next(isSearchQueued);
  }

  /**
   * Sets if to trigger a search
   * @param {boolean} isSearchTriggered
   */
  public setSearchTriggered(isSearchTriggered: boolean): void {
    if (isSearchTriggered) {
      this._isSearchQueued.next(true);
    }
    this._isSearchTriggered.next(isSearchTriggered);
  }

  /**
   * Sets the nav context
   * @param {NavContextType} navContext
   */
  public setNavContext(navContext: NavContextType): void {
    const isNewNavContext = navContext !== this._navContext.getValue();
    if (isNewNavContext) {

      const isDefaultContext = navContext === NavContextType.DEFAULT;
      if (isDefaultContext) {
        this.setSearchByOption(SearchByOptions.ALL_CUSTOMERS);
        this.setSearchForOption(null);
      } else if (navContext === NavContextType.CUSTOMER) {
        this.setSearchByOption(SearchByOptions.THIS_CUSTOMER);
        this.setSearchForOption(SearchForOptions.PLAN);
      }

      const hasSearchResults = this._searchResults.getValue().results.length > 0;
      if (!hasSearchResults) {
        this.resetSearch();
      }

      this._updatePaginationByNavContext(navContext);
    }
    this._navContext.next(navContext);
    this._updateSearchType();
  }

  /**
   * Sets optional search params
   * @param optionalSearchParams
   */
  public setOptionalSearchParams(optionalSearchParams: any): void {
    this._optionalSearchParams.next(optionalSearchParams);
  }

  /**
   * Sets the page
   * @param {number} page
   */
  public setPage(page: number): void {
    const isNewPage = page !== this._page.getValue();
    if (isNewPage) {
      this._page.next(page);
      this._checkToTriggerSearch();
    }
  }

  /**
   * Sets the page size
   * @param {number} pageSize
   */
  public setPageSize(pageSize: number): void {
    const isNewPageSize = pageSize !== this._pageSize.getValue();
    if (isNewPageSize) {
      this._pageSize.next(pageSize);
      this._checkToTriggerSearch();
    }
  }

  /**
   * Sets the search by option, updates the search type
   * @param {SearchByOptions} searchByOption
   */
  public setSearchByOption(searchByOption: SearchByOptions): void {
    if (searchByOption !== SearchByOptions.THIS_CUSTOMER) {
      this.setSearchForOption(null);
    } else {
      this.setSearchForOption(SearchForOptions.PLAN);
    }
    this._searchByOption.next(searchByOption);
    this.setShowSearchResults(false);
    this.resetSearchResults();
    this._updateSearchType();
  }

  /**
   * Sets the search customer
   * @param {ICustomer} searchCustomer
   */
  public setSearchCustomer(searchCustomer: ICustomer): void {
    this._searchCustomer.next(searchCustomer);
  }

  /**
   * Sets the search field
   * @param {string} searchField
   */
  public setSearchField(searchField: string): void {
    this._searchField.next(searchField);
    this.setShowSearchResults(false);
    this._updateSearchType(true);
    this.setPage(1);
  }

  /**
   * Sets the search for option, updates the search type
   * @param {SearchForOptions} searchForOption
   */
  public setSearchForOption(searchForOption: SearchForOptions): void {
    this._searchForOption.next(searchForOption);
    this.setShowSearchResults(false);
    this.resetSearchResults();
    this._updateSearchType();
  }

  /**
   * Sets the search results
   * @param {ISearchResults} searchResults
   */
  public setSearchResults(searchResults: ISearchResults): void {
    this._searchResults.next(searchResults);
  }

  /**
   * Sets the search type
   * @param {SearchTypes} searchType
   */
  public setSearchType(searchType: SearchTypes): void {
    const isNewSearchType = searchType !== this._searchType.getValue();
    if (isNewSearchType) {
      this._updateSort(searchType);
      this._searchType.next(searchType);
    }

    const isAttributeDetailsSearch = searchType === SearchTypes.ATTRIBUTE_DETAILS;
    if (isAttributeDetailsSearch) {
      this.setShowSearchResults(false);
      this.setPage(1);
      this.setPageSize(10);
      this.setSearchTriggered(true);
    }
  }

  /**
   * Sets if to show the search results
   * @param {boolean} showSearchResults
   */
  public setShowSearchResults(showSearchResults: boolean): void {
    this._showSearchResults.next(showSearchResults);
  }

  /**
   * Sets the sort ascending indicator
   * @param {boolean} sortAsc
   */
  public setSortAsc(sortAsc: boolean): void {
    const isNewSortAsc = sortAsc !== this._sortAsc.getValue();
    if (isNewSortAsc) {
      this._sortAsc.next(sortAsc);
      this.setPage(1);
      this._checkToTriggerSearch();
    }
  }

  /**
   * Sets the sort by field
   * @param {string} sortBy
   */
  public setSortBy(sortBy: string): void {
    const isNewSortBy = sortBy !== this._sortBy.getValue();
    if (isNewSortBy) {
      this._sortBy.next(sortBy);
      this.setPage(1);
      this._checkToTriggerSearch();
    }
  }

  /**
   * Resets the search results
   */
  public resetSearchResults(): void {
    this._searchResults.next({
      page: 1,
      pageSize: 10,
      totalCount: 0,
      results: []
    });
  }

  /**
   * Resets the search
   */
  public resetSearch(): void {
    this._isSearchQueued.next(false);
    this._isSearchTriggered.next(false);
    this._optionalSearchParams.next({});
    this._page.next(1);
    this._pageSize.next(4);
    this._searchField.next('');
    this._showSearchResults.next(false);
    this._searchCustomer.next(null);
    this.resetSearchResults();
  }

  /**
   * Checks if to trigger the search
   * @private
   */
  private _checkToTriggerSearch(): void {
    const hasSearchField = this._hasSearchField();
    if (hasSearchField) {
      this.setSearchTriggered(true);
    }
  }

  /**
   * Indicates if the search field is valid
   * @returns {boolean}
   * @private
   */
  private _hasSearchField(): boolean {
    const searchField = this._searchField.getValue();
    if (isNil(searchField)) {
      return false;
    }
    return searchField.length > 1;
  }

  /**
   * Updates the pagination based on the current nav context, this will make the search overlay
   * search for  4 results, and search page search for 10 results
   * @param {NavContextType} navContext
   * @private
   */
  private _updatePaginationByNavContext(navContext: NavContextType): void {
    const page = 1;
    let pageSize = 4;

    if (navContext === NavContextType.SEARCH) {
      pageSize = 10;
    }

    this.setPage(page);
    this.setPageSize(pageSize);
  }

  /**
   * Updates the type of search to perform
   * @returns {SearchTypes}
   * @private
   */
  private _updateSearchType(isNewSearchField: boolean = false): void {
    const searchByOption = this._searchByOption.getValue();

    if (searchByOption === SearchByOptions.ALL_CUSTOMERS) {
      this._handleCustomerSearch();
    } else if (searchByOption === SearchByOptions.BY_USER) {
      this.setSearchType(SearchTypes.BY_USER);
    } else if (searchByOption === SearchByOptions.THIS_CUSTOMER) {
      this._handlePlanSearch(isNewSearchField);
    }
  }

  /**
   * Handles when the search type is changed to All Customers
   * @private
   */
  private _handleCustomerSearch(): void {
    const searchField = this._searchField.getValue();
    const isDefaultContext = this._navContext.getValue() === NavContextType.DEFAULT;
    const isSearchFieldEmpty = !isNil(searchField) && searchField.length === 0;

    if (isDefaultContext && isSearchFieldEmpty) {
      this.setSearchType(SearchTypes.RECENT_CUSTOMERS);
      this.setSearchQueued(true);
      this.setSearchTriggered(true);
    } else {
      this.setSearchType(SearchTypes.ALL_CUSTOMERS);
    }
  }

  /**
   * Handles when the search type is changed to This Customer
   * @param {boolean} isNewSearchField
   * @private
   */
  private _handlePlanSearch(isNewSearchField: boolean): void {
    const searchType = this._searchType.getValue();
    const searchForOption = this._searchForOption.getValue();
    let newSearchType: SearchTypes = null;

    if (searchType === SearchTypes.ATTRIBUTE_DETAILS && !isNewSearchField) {
      newSearchType = SearchTypes.ATTRIBUTE_DETAILS;
    } else {
      if (searchForOption === SearchForOptions.PLAN) {
        newSearchType = SearchTypes.PLAN;
      } else if (searchForOption === SearchForOptions.ATTRIBUTE) {
        newSearchType = SearchTypes.ATTRIBUTE;
      }
    }
    this.setSearchType(newSearchType);
  }

  /**
   * Updates the sort based on the change in sort type
   * @param {SearchTypes} searchType
   * @private
   */
  private _updateSort(searchType: SearchTypes): void {
    const isAllCustomersSearch = searchType === SearchTypes.ALL_CUSTOMERS;
    const isUserSearch = searchType === SearchTypes.BY_USER;
    if (isAllCustomersSearch || isUserSearch) {
      this.setSortBy('customerName');
      this.setSortAsc(true);
      return;
    }

    const isPlanSearch = searchType === SearchTypes.PLAN;
    if (isPlanSearch) {
      this.setSortBy('planName');
      this.setSortAsc(true);
      return;
    }

    const isAttributeSearch = searchType === SearchTypes.ATTRIBUTE || searchType === SearchTypes.ATTRIBUTE_DETAILS;
    if (isAttributeSearch) {
      this.setSortBy('attributeName');
      this.setSortAsc(true);
      return;
    }
  }
}
