import {Injectable} from '@angular/core';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {SearchTypes} from '../enums/SearchTypes';
import {ISearchState} from '../interfaces/iSearchState';

/**
 * A service to get the text for the search title, based on the current search state
 */
@Injectable()
export class SearchTitleService {

  /**
   * Object containing strings for search title
   */
  private static readonly searchTitles = {
    allCustomers: 'Search within All Customers',
    recentCustomers: 'Recent Customers',
    byUser: 'Search By User',
    thisCustomer: 'Search with this customer'
  };

  /**
   * Object containing strings used to display an (s) after result in the search title
   */
  private static readonly resultsLabels = {
    singleResult: 'Result',
    multipleOrEmptyResults: 'Results'
  };

  /**
   * Creates the search title service
   */
  constructor() {
  }

  /**
   * Sets the search state, and updates the search title
   * @param {ISearchState} searchState
   */
  getSearchTitleBySearchState(searchState: ISearchState): string {
    if (searchState.showSearchResults) {
      const searchResultsCount = searchState.searchResults.totalCount;
      return this._getSearchTitleForSearchResults(searchState.searchType, searchResultsCount, searchState.searchCustomer);
    } else {
      return this._getSearchTitleBeforeSearching(searchState.searchType, searchState.searchCustomer);
    }
  }

  /**
   * Updates the search title before searching
   * @private
   */
  private _getSearchTitleBeforeSearching(searchType: SearchTypes, searchCustomer: ICustomer): string {
    if (searchType === SearchTypes.ALL_CUSTOMERS) {
      return SearchTitleService.searchTitles.allCustomers;
    } else if (searchType === SearchTypes.RECENT_CUSTOMERS) {
      return SearchTitleService.searchTitles.recentCustomers;
    } else if (searchType === SearchTypes.BY_USER) {
      return SearchTitleService.searchTitles.byUser;
    } else {
      if (searchCustomer) {
        return `Search within ${searchCustomer.customerName}`;
      } else {
        return SearchTitleService.searchTitles.thisCustomer;
      }
    }
  }

  /**
   * Updates the search title when displaying search results
   * @private
   */
  private _getSearchTitleForSearchResults(searchType: SearchTypes, searchResultsCount: number, searchCustomer: ICustomer): string {
    const resultsWording = this._getResultsWording(searchResultsCount);
    if (searchType === SearchTypes.ALL_CUSTOMERS) {
      return `${searchResultsCount} ${resultsWording} within All Customers`;
    } else if (searchType === SearchTypes.RECENT_CUSTOMERS) {
      return SearchTitleService.searchTitles.recentCustomers;
    } else if (searchType === SearchTypes.BY_USER) {
      return `${searchResultsCount} ${resultsWording} for user`;
    } else {
      if (searchCustomer) {
        return `${searchResultsCount} ${resultsWording} within ${searchCustomer.customerName}`;
      } else {
        return `${searchResultsCount} ${resultsWording} within this customer`;
      }
    }
  }

  /**
   * Gets whether to display an (s) at the end of the word results in the search title
   * @param {number} searchResultsCount
   * @returns {string}
   * @private
   */
  private _getResultsWording(searchResultsCount: number): string {
    if (searchResultsCount === 1) {
      return SearchTitleService.resultsLabels.singleResult;
    }
    return SearchTitleService.resultsLabels.multipleOrEmptyResults;
  }
}
