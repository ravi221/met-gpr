import {Injectable} from '@angular/core';
import {ISearchState} from '../interfaces/iSearchState';
import {ISearchResults} from '../interfaces/iSearchResults';
import {SearchTypes} from '../enums/SearchTypes';
import {NavContextType} from '../../navigation/enums/nav-context';
import {isNil} from 'lodash';

/**
 * A service to handle all appearance and actions on the search result list page
 */
@Injectable()
export class SearchResultListService {

  /**
   * Displays none of the lists
   */
  static readonly CLEAR_LISTS = {
    attribute: false,
    customer: false,
    plan: false,
    planAttribute: false,
    user: false
  };

  /**
   * Indicates if there are results and they are empty
   * @param searchState
   * @returns {boolean}
   */
  public hasEmptyResults(searchState): boolean {
    if (!searchState.showSearchResults) {
      return false;
    }

    const searchResults = searchState.searchResults;
    if (!searchResults) {
      return false;
    }

    const displayResults = searchResults.results;
    if (!displayResults) {
      return false;
    }
    return displayResults.length === 0;
  }

  /**
   * Gets which text to display for the show more label
   * @param {ISearchState} searchState
   * @returns {string}
   */
  public getShowMoreLabelBySearchState(searchState: ISearchState): string {
    return searchState.navContext === NavContextType.SEARCH ? 'Show More' : 'See all results';
  }

  /**
   * Indicates if to show the background
   * @returns {boolean}
   * @private
   */
  public showBackgroundBySearchState(searchState: ISearchState): boolean {
    const isSearchContext = searchState.navContext === NavContextType.SEARCH;
    if (!isSearchContext) {
      return false;
    }

    const isUserSearch = searchState.searchType === SearchTypes.BY_USER;
    if (isUserSearch) {
      return false;
    }

    return this._hasDisplayResults(searchState.searchResults);
  }

  /**
   * Indicates if to show the more results link
   * @param {ISearchState} searchState
   * @returns {boolean}
   */
  public hasMoreResults(searchState: ISearchState): boolean {
    if (!searchState.showSearchResults) {
      return false;
    }

    const searchResults = searchState.searchResults;
    const hasDisplayResults = this._hasDisplayResults(searchResults);
    if (!hasDisplayResults) {
      return false;
    }

    const isRecentCustomerSearch = searchState.searchType === SearchTypes.RECENT_CUSTOMERS;
    if (isRecentCustomerSearch) {
      return false;
    }

    const currentDisplayAmount = searchResults.page * searchResults.pageSize;
    return currentDisplayAmount < searchResults.totalCount;
  }

  /**
   * Indicates if to display the show more link
   * @param {ISearchState} searchState
   * @returns {boolean}
   */
  public shouldShowMoreLink(searchState: ISearchState): boolean {
    return searchState.navContext !== NavContextType.SEARCH;
  }

  /**
   * Decides which list to display based on the search state
   * @param {ISearchState} searchState
   * @returns {any}
   */
  public showListsBySearchState(searchState: ISearchState): any {
    if (!searchState.showSearchResults) {
      return SearchResultListService.CLEAR_LISTS;
    }

    const hasDisplayResults = this._hasDisplayResults(searchState.searchResults);
    if (!hasDisplayResults) {
      return SearchResultListService.CLEAR_LISTS;
    }

    const searchType = searchState.searchType;
    return {
      attribute: searchType === SearchTypes.ATTRIBUTE,
      attributeDetails: searchType === SearchTypes.ATTRIBUTE_DETAILS,
      customer: searchType === SearchTypes.ALL_CUSTOMERS || searchType === SearchTypes.RECENT_CUSTOMERS,
      plan: searchType === SearchTypes.PLAN,
      user: searchType === SearchTypes.BY_USER
    };
  }

  /**
   * Indicates if there are display results
   * @returns {boolean}
   * @private
   */
  private _hasDisplayResults(searchResults: ISearchResults): boolean {
    if (isNil(searchResults)) {
      return false;
    }

    const displayResults = searchResults.results;
    if (isNil(displayResults)) {
      return false;
    }
    return displayResults.length > 0;
  }
}
