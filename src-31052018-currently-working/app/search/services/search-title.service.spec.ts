import {ISearchResults} from '../interfaces/iSearchResults';
import {ISearchState} from '../interfaces/iSearchState';
import {mockCustomer} from '../../../assets/test/common-objects/customer.mock';
import {mockSearchState} from '../../../assets/test/common-objects/search-state.mock';
import {NavContextType} from '../../navigation/enums/nav-context';
import {SearchByOptions} from '../enums/SearchByOptions';
import {SearchForOptions} from '../enums/SearchForOptions';
import {SearchTitleService} from './search-title.service';
import {SearchTypes} from '../enums/SearchTypes';
import {TestBed} from '@angular/core/testing';

describe('SearchTitleService', () => {
  let service: SearchTitleService;
  let searchState: ISearchState;

  const testSearchResults: ISearchResults = {
    page: 1,
    pageSize: 10,
    totalCount: 5,
    results: [{}, {}, {}, {}, {}]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchTitleService]
    });
    service = TestBed.get(SearchTitleService);
    searchState = mockSearchState;
  });

  describe('Changing search by options', () => {
    it('should set the search title to \'Search within All Customers\' when the \'All Customers\' button is selected and nav context is search', () => {
      searchState.navContext = NavContextType.SEARCH;
      searchState.showSearchResults = false;
      searchState.searchByOption = SearchByOptions.ALL_CUSTOMERS;
      searchState.searchForOption = null;
      searchState.searchType = SearchTypes.ALL_CUSTOMERS;
      const searchTitle = service.getSearchTitleBySearchState(searchState);
      expect(searchTitle).toBe('Search within All Customers');
    });

    it('should set the search title to \'Recent Customers\' when the \'All Customers\' button is selected and nav context is customer', () => {
      searchState.navContext = NavContextType.CUSTOMER;
      searchState.showSearchResults = false;
      searchState.searchByOption = SearchByOptions.ALL_CUSTOMERS;
      searchState.searchForOption = null;
      searchState.searchType = SearchTypes.RECENT_CUSTOMERS;
      const searchTitle = service.getSearchTitleBySearchState(searchState);
      expect(searchTitle).toBe('Recent Customers');
    });

    it('should set the search title to \'Search By User\' when the \'By User\' button is selected', () => {
      searchState.navContext = NavContextType.DEFAULT;
      searchState.showSearchResults = false;
      searchState.searchByOption = SearchByOptions.BY_USER;
      searchState.searchForOption = null;
      searchState.searchType = SearchTypes.BY_USER;
      const searchTitle = service.getSearchTitleBySearchState(searchState);
      expect(searchTitle).toBe('Search By User');
    });

    it('should set the search title to \'Search within Test Customer\' when the \'This Customer\' button is selected', () => {
      searchState.navContext = NavContextType.CUSTOMER;
      searchState.showSearchResults = false;
      searchState.searchByOption = SearchByOptions.THIS_CUSTOMER;
      searchState.searchForOption = SearchForOptions.PLAN;
      searchState.searchType = SearchTypes.PLAN;
      searchState.searchCustomer = mockCustomer;
      const searchTitle = service.getSearchTitleBySearchState(searchState);
      expect(searchTitle).toBe('Search within Test Customer');
    });
  });

  describe('Changing search result count', () => {
    it('should set the search title to \'5 Results within All Customers\' when there are 5 customer results', () => {
      searchState.navContext = NavContextType.DEFAULT;
      searchState.showSearchResults = true;
      searchState.searchByOption = SearchByOptions.ALL_CUSTOMERS;
      searchState.searchForOption = null;
      searchState.searchType = SearchTypes.ALL_CUSTOMERS;
      searchState.searchResults = testSearchResults;
      const searchTitle = service.getSearchTitleBySearchState(searchState);
      expect(searchTitle).toBe('5 Results within All Customers');
    });

    it('should set the search title to \'5 Results for user\' when there are 5 user results', () => {
      searchState.navContext = NavContextType.SEARCH;
      searchState.showSearchResults = true;
      searchState.searchByOption = SearchByOptions.BY_USER;
      searchState.searchForOption = null;
      searchState.searchType = SearchTypes.BY_USER;
      searchState.searchResults = testSearchResults;
      const searchTitle = service.getSearchTitleBySearchState(searchState);
      expect(searchTitle).toBe('5 Results for user');
    });

    it('should set the search title to \'5 Results within Test Customer\' when there are 5 results for this customer', () => {
      searchState.navContext = NavContextType.CUSTOMER;
      searchState.showSearchResults = true;
      searchState.searchByOption = SearchByOptions.THIS_CUSTOMER;
      searchState.searchForOption = SearchForOptions.PLAN;
      searchState.searchType = SearchTypes.PLAN;
      searchState.searchCustomer = mockCustomer;
      searchState.searchResults = testSearchResults;
      const searchTitle = service.getSearchTitleBySearchState(searchState);
      expect(searchTitle).toBe('5 Results within Test Customer');
    });
  });

  describe('Multiple/Single/Empty results', () => {
    describe('\'All Customer\' Results', () => {
      beforeEach(() => {
        searchState.navContext = NavContextType.DEFAULT;
        searchState.showSearchResults = true;
        searchState.searchByOption = SearchByOptions.ALL_CUSTOMERS;
        searchState.searchForOption = null;
        searchState.searchType = SearchTypes.ALL_CUSTOMERS;
        searchState.searchResults = testSearchResults;
      });

      it('should contain \'Results\' in the search title when multiple results', () => {
        searchState.searchResults.totalCount = 5;
        const searchTitle = service.getSearchTitleBySearchState(searchState);
        expect(searchTitle).toBe('5 Results within All Customers');
      });

      it('should contain \'Results\' in the search title when empty results', () => {
        searchState.searchResults.totalCount = 0;
        const searchTitle = service.getSearchTitleBySearchState(searchState);
        expect(searchTitle).toBe('0 Results within All Customers');
      });

      it('should contain \'Result\' in the search title when one results', () => {
        searchState.searchResults.totalCount = 1;
        const searchTitle = service.getSearchTitleBySearchState(searchState);
        expect(searchTitle).toBe('1 Result within All Customers');
      });
    });

    describe('\'This Customer\' Results', () => {
      beforeEach(() => {
        searchState.navContext = NavContextType.CUSTOMER;
        searchState.showSearchResults = true;
        searchState.searchByOption = SearchByOptions.THIS_CUSTOMER;
        searchState.searchForOption = SearchForOptions.PLAN;
        searchState.searchType = SearchTypes.PLAN;
        searchState.searchCustomer = mockCustomer;
        searchState.searchResults = testSearchResults;
      });

      it('should contain \'Results\' in the search title when multiple results', () => {
        searchState.searchResults.totalCount = 5;
        const searchTitle = service.getSearchTitleBySearchState(searchState);
        expect(searchTitle).toBe('5 Results within Test Customer');
      });

      it('should contain \'Results\' in the search title when empty results', () => {
        searchState.searchResults.totalCount = 0;
        const searchTitle = service.getSearchTitleBySearchState(searchState);
        expect(searchTitle).toBe('0 Results within Test Customer');
      });

      it('should contain \'Result\' in the search title when one results', () => {
        searchState.searchResults.totalCount = 1;
        const searchTitle = service.getSearchTitleBySearchState(searchState);
        expect(searchTitle).toBe('1 Result within Test Customer');
      });
    });
  });
});
