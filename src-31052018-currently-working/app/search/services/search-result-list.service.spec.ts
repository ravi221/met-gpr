import {NavContextType} from '../../navigation/enums/nav-context';
import {ISearchState} from '../interfaces/iSearchState';
import {SearchResultListService} from './search-result-list.service';
import {SearchTypes} from '../enums/SearchTypes';

describe('SearchResultListService', () => {
  let service: SearchResultListService = new SearchResultListService();

  describe('Should show more results link', () => {
    it ('should return true when nav context is not search', () => {
      const searchState = <ISearchState> {navContext: NavContextType.CUSTOMER};
      expect(service.shouldShowMoreLink(searchState)).toBeTruthy();
    });

    it ('should return false when nav context is search', () => {
      const searchState = <ISearchState> {navContext: NavContextType.SEARCH};
      expect(service.shouldShowMoreLink(searchState)).toBeFalsy();
    });
  });

  describe('Show More Label', () => {
    it('should display \'Show More\' when the nav context is \'SEARCH\'', () => {
      const searchState = <ISearchState> {navContext: NavContextType.SEARCH};

      const showMoreLabel = service.getShowMoreLabelBySearchState(searchState);
      expect(showMoreLabel).toBe('Show More');
    });

    it('should display \'See all results\' when the nav context is not \'SEARCH\'', () => {
      const searchState = <ISearchState> {navContext: NavContextType.CUSTOMER};

      const showMoreLabel = service.getShowMoreLabelBySearchState(searchState);
      expect(showMoreLabel).toBe('See all results');
    });
  });

  describe('Check for empty results', () => {
    it('should return true when there are results that are empty', () => {
      const searchState = <ISearchState> {
        showSearchResults: true,
        searchResults: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          results: []
        }
      };
      expect(service.hasEmptyResults(searchState)).toBeTruthy();
    });

    it('should return false when there are results that are not empty', () => {
      const searchState = <ISearchState> {
        showSearchResults: true,
        searchResults: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          results: [{}]
        }
      };
      expect(service.hasEmptyResults(searchState)).toBeFalsy();
    });

    it('should return false when there is not a search result object', () => {
      const searchState = <ISearchState> {
        showSearchResults: true
      };
      expect(service.hasEmptyResults(searchState)).toBeFalsy();
    });

    it('should return false when there the flag to show search results is false', () => {
      const searchState = <ISearchState> {
        showSearchResults: false
      };
      expect(service.hasEmptyResults(searchState)).toBeFalsy();
    });
  });

  describe('Show Search Background', () => {
    it('should display background when there are results and the nav context is \'SEARCH\'', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.SEARCH,
        searchResults: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          results: [{}]
        }
      };
      expect(service.showBackgroundBySearchState(searchState)).toBeTruthy();
    });

    it('should not display when the search type is \'BY_USER\'', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.CUSTOMER,
        searchType: SearchTypes.BY_USER
      };
      expect(service.showBackgroundBySearchState(searchState)).toBeFalsy();
    });

    it('should not display background when nav context is not \'SEARCH\'', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.CUSTOMER
      };
      expect(service.showBackgroundBySearchState(searchState)).toBeFalsy();
    });

    it('should not display when there is no search result object', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.SEARCH
      };
      expect(service.showBackgroundBySearchState(searchState)).toBeFalsy();
    });

    it('should not display when there are results but the results are empty', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.SEARCH,
        searchResults: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          results: []
        }
      };
      expect(service.showBackgroundBySearchState(searchState)).toBeFalsy();
    });
  });

  describe('Has more results', () => {
    it('should return true when the total count of results is greater than current page', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.SEARCH,
        searchResults: {
          page: 1,
          pageSize: 10,
          totalCount: 12,
          results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        },
        showSearchResults: true,
        searchType: SearchTypes.ALL_CUSTOMERS
      };
      expect(service.hasMoreResults(searchState)).toBeTruthy();
    });

    it('should return false when show search results is false', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.SEARCH,
        searchResults: {
          page: 1,
          pageSize: 10,
          totalCount: 12,
          results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        },
        showSearchResults: false,
        searchType: SearchTypes.ALL_CUSTOMERS
      };
      expect(service.hasMoreResults(searchState)).toBeFalsy();
    });

    it('should return false when there are search results are null', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.SEARCH,
        searchResults: null,
        showSearchResults: true,
        searchType: SearchTypes.ALL_CUSTOMERS
      };
      expect(service.hasMoreResults(searchState)).toBeFalsy();
    });

    it('should return false when there are search results are undefined', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.SEARCH,
        searchResults: undefined,
        showSearchResults: true,
        searchType: SearchTypes.ALL_CUSTOMERS
      };
      expect(service.hasMoreResults(searchState)).toBeFalsy();
    });

    it('should return false when search type is recent customers', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.SEARCH,
        searchResults: {
          page: 1,
          pageSize: 10,
          totalCount: 12,
          results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        },
        showSearchResults: true,
        searchType: SearchTypes.RECENT_CUSTOMERS
      };
      expect(service.hasMoreResults(searchState)).toBeFalsy();
    });

    it('should return false when number of current results is greater than total count', () => {
      const searchState = <ISearchState> {
        navContext: NavContextType.SEARCH,
        searchResults: {
          page: 2,
          pageSize: 10,
          totalCount: 12,
          results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        },
        showSearchResults: true,
        searchType: SearchTypes.ALL_CUSTOMERS
      };
      expect(service.hasMoreResults(searchState)).toBeFalsy();
    });
  });
});
