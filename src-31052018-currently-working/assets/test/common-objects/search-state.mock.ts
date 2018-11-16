import {ISearchState} from '../../../app/search/interfaces/iSearchState';
import {NavContextType} from '../../../app/navigation/enums/nav-context';
import {SearchByOptions} from '../../../app/search/enums/SearchByOptions';
import {SearchTypes} from '../../../app/search/enums/SearchTypes';
import {CustomerStatus} from '../../../app/customer/enums/customer-status';

/**
 * A common search state for testing purposes
 */
export const mockSearchState: ISearchState = {
  isSearchQueued: false,
  isSearchTriggered: false,
  navContext: NavContextType.CUSTOMER,
  optionalSearchParams: {},
  page: 1,
  pageSize: 10,
  searchByOption: SearchByOptions.ALL_CUSTOMERS,
  searchCustomer: {
    customerNumber: 1,
    customerName: '',
    market: '',
    percentageCompleted: 0,
    effectiveDate: '',
    status: CustomerStatus.UNAPPROVED,
    hiddenStatus: false,
    scrollVisibility: true
  },
  searchField: '',
  searchForOption: null,
  searchResults: {
    page: 1,
    pageSize: 10,
    totalCount: 1,
    results: [{}]
  },
  searchType: SearchTypes.ALL_CUSTOMERS,
  showSearchResults: true,
  sortBy: 'customerName',
  sortAsc: true
};
