import {NavContextType} from '../../navigation/enums/nav-context';
import {SearchSortService} from './search-sort.service';
import {SearchTypes} from '../enums/SearchTypes';
import {ISearchState} from '../interfaces/iSearchState';
import {mockSearchState} from '../../../assets/test/common-objects/search-state.mock';

describe('SearchSortService', () => {
  let service: SearchSortService = new SearchSortService();
  let searchState: ISearchState;

  beforeEach(() => {
    searchState = mockSearchState;
  });

  describe('Sort Options', () => {
    it('should get three options for sorting for customer results', () => {
      const sortOptions = service.getSortOptionsBySearchType(SearchTypes.ALL_CUSTOMERS);
      expect(sortOptions).toBeTruthy();
      expect(sortOptions.length).toBe(3);

      expect(sortOptions[0].label).toBe('A-Z');
      expect(sortOptions[1].label).toBe('Completion');
      expect(sortOptions[2].label).toBe('Effective Date');
    });

    it('should get three options for sorting for plan results', () => {
      const sortOptions = service.getSortOptionsBySearchType(SearchTypes.PLAN);
      expect(sortOptions).toBeTruthy();
      expect(sortOptions.length).toBe(3);

      expect(sortOptions[0].label).toBe('A-Z');
      expect(sortOptions[1].label).toBe('Completion');
      expect(sortOptions[2].label).toBe('Effective Date');
    });

    it('should get two options for sorting for attribute results', () => {
      const sortOptions = service.getSortOptionsBySearchType(SearchTypes.ATTRIBUTE);
      expect(sortOptions).toBeTruthy();
      expect(sortOptions.length).toBe(2);

      expect(sortOptions[0].label).toBe('A-Z');
      expect(sortOptions[1].label).toBe('Effective Date');
    });

    it('should return no sort options with an invalid search type', () => {
      let sortOptions = service.getSortOptionsBySearchType(SearchTypes.RECENT_CUSTOMERS);
      expect(sortOptions).toBeTruthy();
      expect(sortOptions.length).toBe(0);

      sortOptions = service.getSortOptionsBySearchType(null);
      expect(sortOptions).toBeTruthy();
      expect(sortOptions.length).toBe(0);
    });

    it('should get no options when sorting by user search', () => {
      const sortOptions = service.getSortOptionsBySearchType(SearchTypes.BY_USER);
      expect(sortOptions).toBeTruthy();
      expect(sortOptions.length).toBe(0);
    });
  });

  describe('Show Sort', () => {
    it('should not show the sort when the showSearchResults flag is false', () => {
      searchState.showSearchResults = false;
      searchState.navContext = NavContextType.SEARCH;
      searchState.searchResults = {page: 1, pageSize: 10, totalCount: 2, results: [{}, {}]};

      const showSort = service.showSortBySearchState(searchState);
      expect(showSort).toBeFalsy();
    });

    it('should not show the sort when there are zero search results', () => {
      searchState.showSearchResults = true;
      searchState.navContext = NavContextType.SEARCH;
      searchState.searchResults = {page: 1, pageSize: 10, totalCount: 0, results: []};

      const showSort = service.showSortBySearchState(searchState);
      expect(showSort).toBeFalsy();
    });

    it('should not show the sort when not in the search context', () => {
      searchState.showSearchResults = false;
      searchState.navContext = NavContextType.DEFAULT;
      searchState.searchResults = {page: 1, pageSize: 10, totalCount: 2, results: [{}, {}]};

      let showSort = service.showSortBySearchState(searchState);
      expect(showSort).toBeFalsy();

      searchState.navContext = NavContextType.CUSTOMER;
      showSort = service.showSortBySearchState(searchState);
      expect(showSort).toBeFalsy();
    });

    it('should not show the sort when searching by user', () => {
      searchState.showSearchResults = false;
      searchState.navContext = NavContextType.SEARCH;
      searchState.searchResults = {page: 1, pageSize: 10, totalCount: 2, results: [{}, {}]};
      searchState.searchType = SearchTypes.BY_USER;

      const showSort = service.showSortBySearchState(searchState);
      expect(showSort).toBeFalsy();
    });


    it('should show the sort when there are search results, showSearchResults is true and the context is search', () => {
      searchState.showSearchResults = true;
      searchState.navContext = NavContextType.SEARCH;
      searchState.searchResults = {page: 1, pageSize: 10, totalCount: 2, results: [{}, {}]};
      searchState.searchType = SearchTypes.ALL_CUSTOMERS;

      const showSort = service.showSortBySearchState(searchState);
      expect(showSort).toBeTruthy();
    });
  });
});
