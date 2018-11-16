import {ISortOption} from '../../core/interfaces/iSortOption';
import {SearchTypes} from '../enums/SearchTypes';
import {Injectable} from '@angular/core';
import {ISearchState} from '../interfaces/iSearchState';
import {NavContextType} from '../../navigation/enums/nav-context';

/**
 * A Service to get the sort options depending on the type of search performed
 */
@Injectable()
export class SearchSortService {

  /**
   * The sort options for an attribute
   */
  private static readonly ATTRIBUTE_SORT_OPTIONS: ISortOption[] = [
    <ISortOption>{label: 'A-Z', sortBy: 'attributeName', sortAsc: true, active: true},
    <ISortOption>{label: 'Effective Date', sortBy: 'effectiveDate', sortAsc: true, active: false},
  ];

  /**
   * The sort options for a customer
   */
  private static readonly CUSTOMER_SORT_OPTIONS: ISortOption[] = [
    <ISortOption>{label: 'A-Z', sortBy: 'customerName', sortAsc: true, active: true},
    <ISortOption>{label: 'Completion', sortBy: 'completionPercentage', sortAsc: true, active: false},
    <ISortOption>{label: 'Effective Date', sortBy: 'effectiveDate', sortAsc: true, active: false},
  ];

  /**
   * The sort options for a plan
   */
  private static readonly PLAN_SORT_OPTIONS: ISortOption[] = [
    <ISortOption>{label: 'A-Z', sortBy: 'planName', sortAsc: true, active: true},
    <ISortOption>{label: 'Completion', sortBy: 'completionPercentage', sortAsc: true, active: false},
    <ISortOption>{label: 'Effective Date', sortBy: 'effectiveDate', sortAsc: true, active: false},
  ];

  /**
   * Gets the sort options based on the current search type
   * @param {SearchTypes} searchType
   * @returns {ISortOption[]}
   */
  public getSortOptionsBySearchType(searchType: SearchTypes): ISortOption[] {
    if (searchType === SearchTypes.ALL_CUSTOMERS) {
      return SearchSortService.CUSTOMER_SORT_OPTIONS;
    }

    if (searchType === SearchTypes.PLAN) {
      return SearchSortService.PLAN_SORT_OPTIONS;
    }

    if (searchType === SearchTypes.ATTRIBUTE || searchType === SearchTypes.ATTRIBUTE_DETAILS) {
      return SearchSortService.ATTRIBUTE_SORT_OPTIONS;
    }
    return [];
  }

  /**
   * Indicates if to display the sort icon given the search state
   * @param {ISearchState} searchState
   * @returns {boolean}
   */
  public showSortBySearchState(searchState: ISearchState): boolean {
    if (!searchState.showSearchResults) {
      return false;
    }

    const isSearchContext = searchState.navContext === NavContextType.SEARCH;
    if (!isSearchContext) {
      return false;
    }

    const isUserSearch = searchState.searchType === SearchTypes.BY_USER;
    if (isUserSearch) {
      return false;
    }

    const searchResultsCount = searchState.searchResults.totalCount;
    return searchResultsCount > 0;
  }
}
