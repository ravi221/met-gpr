import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {CustomerSearchService} from './customer-search.service';
import {PlanSearchService} from './plan-search.service';
import {SearchTypes} from '../enums/SearchTypes';
import {AttributeSearchService} from './attribute-search.service';
import {ISearchResults} from '../interfaces/iSearchResults';
import {ISearchState} from '../interfaces/iSearchState';
import {ICustomerRequest} from '../../customer/interfaces/iCustomerRequest';
import {ISearchPlanRequest} from '../interfaces/iSearchPlanRequest';
import {ISearchAttributeDetailsRequest} from '../interfaces/iSearchAttributeDetailsRequest';
import {isNil} from 'lodash';
import {UserSearchService} from './user-search.service';

/**
 * A service to search for customers, plans, and attributes
 */
@Injectable()
export class SearchService {

  /**
   * The current search state
   */
  private _searchState: ISearchState;

  /**
   * A custom object to decide which search to perform
   * @type {{}}
   * @private
   */
  private _searchBySearchType = {
    [SearchTypes.ALL_CUSTOMERS]: () => {
      const customerRequest: ICustomerRequest = {
        searchField: this._searchState.searchField,
        sortBy: this._searchState.sortBy,
        sortAsc: this._searchState.sortAsc,
        page: this._searchState.page,
        pageSize: this._searchState.pageSize,
        hidden: false,
        globalSearch: true
      };
      return this._customerSearchService.searchAllCustomers(customerRequest);
    },
    [SearchTypes.RECENT_CUSTOMERS]: () => {
      return this._customerSearchService.searchRecentCustomers();
    },
    [SearchTypes.PLAN]: () => {
      const customer = this._searchState.searchCustomer;
      if (isNil(customer)) {
        return Observable.of({
          results: [],
          totalCount: 0,
          page: 1,
          pageSize: 10
        });
      }

      const planRequest: ISearchPlanRequest = {
        customerNumber: customer.customerNumber,
        searchCriteria: 'planName',
        searchKey: this._searchState.searchField,
        sortBy: this._searchState.sortBy,
        sortAsc: this._searchState.sortAsc,
        page: this._searchState.page,
        pageSize: this._searchState.pageSize
      };
      return this._planSearchService.searchPlans(planRequest);
    },
    [SearchTypes.ATTRIBUTE]: () => {
      const planRequest: ISearchPlanRequest = {
        customerNumber: this._searchState.searchCustomer.customerNumber,
        searchCriteria: 'attribute',
        searchKey: this._searchState.searchField,
        sortBy: this._searchState.sortBy,
        sortAsc: this._searchState.sortAsc,
        page: this._searchState.page,
        pageSize: this._searchState.pageSize
      };
      return this._planSearchService.searchPlans(planRequest);
    },
    [SearchTypes.ATTRIBUTE_DETAILS]: () => {
      const searchParams = this._searchState.optionalSearchParams;

      const attributeDetailsRequest: ISearchAttributeDetailsRequest = {
        customerNumber: this._searchState.searchCustomer.customerNumber,
        planIds: searchParams.planIds,
        model: searchParams.model,
        attributeLabel: searchParams.attributeLabel,
        sortBy: this._searchState.sortBy,
        sortAsc: this._searchState.sortAsc,
        page: this._searchState.page,
        pageSize: this._searchState.pageSize
      };
      return this._attributeSearchService.searchAttributes(attributeDetailsRequest);
    },
    [SearchTypes.BY_USER]: () => {
      const userId = this._searchState.searchField;
      const customerRequest: ICustomerRequest = {
        searchField: null,
        hidden: false,
        globalSearch: false,
        userSearch: true,
        sortBy: this._searchState.sortBy,
        sortAsc: this._searchState.sortAsc,
        page: this._searchState.page,
        pageSize: this._searchState.pageSize
      };
      return this._userSearchService.searchCustomersByUser(userId, customerRequest);
    }
  };

  /**
   * Creates the search service
   * @param {AttributeSearchService} _attributeSearchService
   * @param {CustomerSearchService} _customerSearchService
   * @param {PlanSearchService} _planSearchService
   * @param {UserSearchService} _userSearchService
   */
  constructor(private _attributeSearchService: AttributeSearchService,
              private _customerSearchService: CustomerSearchService,
              private _planSearchService: PlanSearchService,
              private _userSearchService: UserSearchService) {
  }

  /**
   * Indicates if we are able to perform a search
   * @returns {boolean}
   */
  public canSearch(): boolean {
    if (isNil(this._searchState)) {
      return false;
    }

    const hasValidSearchField = this._hasValidSearchField();
    const hasValidSearchType = this._hasValidSearchType();
    return hasValidSearchField && hasValidSearchType;
  }

  /**
   * Performs the search with an optional search params and optional search type
   * @returns {Observable<ISearchResults>}
   */
  public search(): Observable<ISearchResults> {
    const searchType = this._searchState.searchType;
    return this._searchBySearchType[searchType]();
  }

  /**
   * Sets the search state
   * @param {ISearchState} searchState
   */
  public setSearchState(searchState: ISearchState): void {
    this._searchState = searchState;
  }

  /**
   * Indicates if the search field is valid
   * @returns {boolean}
   * @private
   */
  private _hasValidSearchField(): boolean {
    const searchField = this._searchState.searchField;
    return !isNil(searchField);
  }

  /**
   * Checks if the search type is valid
   * @returns {boolean}
   * @private
   */
  private _hasValidSearchType(): boolean {
    const searchType = this._searchState.searchType;
    return !isNil(searchType);
  }
}
