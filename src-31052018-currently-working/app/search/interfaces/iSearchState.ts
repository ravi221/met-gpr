import {ISearchResults} from './iSearchResults';
import {SearchTypes} from '../enums/SearchTypes';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {NavContextType} from '../../navigation/enums/nav-context';
import {SearchByOptions} from '../enums/SearchByOptions';
import {SearchForOptions} from '../enums/SearchForOptions';

/**
 * Interface to keep track of the current search state
 */
export interface ISearchState {

  /**
   * Indicates if a search is queued, prior to triggered
   */
  isSearchQueued: boolean;

  /**
   * Indicates if a search should be triggered
   */
  isSearchTriggered: boolean;

  /**
   * The current navigation context
   */
  navContext: NavContextType;

  /**
   * The current optional search params
   */
  optionalSearchParams: any;

  /**
   * The current page to search for
   */
  page: number;

  /**
   * The current number of results to get per page
   */
  pageSize: number;

  /**
   * The current search by option
   */
  searchByOption: SearchByOptions;

  /**
   * The current customer to search through
   */
  searchCustomer?: ICustomer;

  /**
   * The search field
   */
  searchField: string;

  /**
   * The current search for option
   */
  searchForOption: SearchForOptions;

  /**
   * The current search results
   */
  searchResults: ISearchResults;

  /**
   * The type of search to perform
   */
  searchType: SearchTypes;

  /**
   * Indicates if to display the search results
   */
  showSearchResults: boolean;

  /**
   * The current field to sort by
   */
  sortBy: string;

  /**
   * Indicates whether to sort ascending (true) or descending (false)
   */
  sortAsc: boolean;
}
