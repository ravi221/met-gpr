import {ISearchState} from '../interfaces/iSearchState';
import {NavContextType} from '../../navigation/enums/nav-context';
import {SearchByOptions} from '../enums/SearchByOptions';
import {SearchForOptions} from '../enums/SearchForOptions';
import {SearchStateService} from './search-state.service';
import {Subscription} from 'rxjs/Subscription';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {SearchTypes} from '../enums/SearchTypes';

describe('SearchStateService', () => {
  let service: SearchStateService;
  let subscription: Subscription;

  beforeEach(() => {
    service = new SearchStateService();
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('Changing nav context', () => {
    it('should update search by option to \'All Customers\' when nav context is \'DEFAULT\'', (done) => {
      service.setNavContext(NavContextType.SEARCH);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.searchByOption).toBe(SearchByOptions.ALL_CUSTOMERS);
        expect(searchState.searchForOption).toBeNull();
        expect(searchState.navContext).toBe(NavContextType.DEFAULT);
        done();
      });
      service.setNavContext(NavContextType.DEFAULT);
    });

    it('should update search by option to \'This Customer\' when nav context is \'CUSTOMER\'', (done) => {
      service.setNavContext(NavContextType.SEARCH);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.searchByOption).toBe(SearchByOptions.THIS_CUSTOMER);
        expect(searchState.searchForOption).toBe(SearchForOptions.PLAN);
        expect(searchState.navContext).toBe(NavContextType.CUSTOMER);
        done();
      });
      service.setNavContext(NavContextType.CUSTOMER);
    });

    it('should not change the search by options when the nav context is the same', (done) => {
      service.setNavContext(NavContextType.CUSTOMER);
      service.setSearchForOption(SearchForOptions.ATTRIBUTE);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.searchByOption).toBe(SearchByOptions.THIS_CUSTOMER);
        expect(searchState.searchForOption).toBe(SearchForOptions.ATTRIBUTE);
        expect(searchState.navContext).toBe(NavContextType.CUSTOMER);
        done();
      });
      service.setNavContext(NavContextType.CUSTOMER);
    });

    it('should call to change search by options when the nav context is changed to \'SEARCH\'', () => {
      service.setNavContext(NavContextType.CUSTOMER);
      const spy = spyOn(service, 'setSearchByOption').and.stub();
      service.setNavContext(NavContextType.SEARCH);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call to change search for options when the nav context is changed to \'SEARCH\'', () => {
      service.setNavContext(NavContextType.CUSTOMER);
      const spy = spyOn(service, 'setSearchForOption').and.stub();
      service.setNavContext(NavContextType.SEARCH);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call to update search type when the nav context is changed', () => {
      const spy = spyOn(service, 'setSearchType').and.stub();
      service.setNavContext(NavContextType.CUSTOMER);
      expect(spy).toHaveBeenCalled();
    });

    it('should update page size to be 10 when switching to \'SEARCH\' context', (done) => {
      service.setNavContext(NavContextType.CUSTOMER);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.pageSize).toEqual(10);
        done();
      });
      service.setNavContext(NavContextType.SEARCH);
    });

    it('should update page size to be 4 when switching to \'DEFAULT\' context', (done) => {
      service.setNavContext(NavContextType.CUSTOMER);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.pageSize).toEqual(4);
        done();
      });
      service.setNavContext(NavContextType.DEFAULT);
    });

    it('should update page to be 1 when switching nav contexts', (done) => {
      service.setPage(2);
      service.setNavContext(NavContextType.CUSTOMER);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.page).toEqual(1);
        done();
      });
      service.setNavContext(NavContextType.DEFAULT);
    });
  });

  describe('Changing optional parameters', () => {
    it('should update optional parameters', (done) => {
      const optionalSearchParams = {test: 'test'};
      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.optionalSearchParams).toEqual(optionalSearchParams);
        done();
      });
      service.setOptionalSearchParams(optionalSearchParams);
    });
  });

  describe('Changing page', () => {
    it('should not trigger change when page is the same', (done) => {
      service.setPage(1);

      subscription = service.getChanges().subscribe(() => {
        done.fail('Should not call an update when the page is the same');
      });
      service.setPage(1);
      done();
    });

    it('should change page', (done) => {
      service.setPage(1);
      const newPage = 2;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.page).toEqual(newPage);
        done();
      });
      service.setPage(newPage);
    });

    it('should set isSearchTriggered to true when page changes with a search field', (done) => {
      service.setPage(1);
      service.setSearchField('Test');
      service.setSearchTriggered(false);
      const newPage = 2;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.page).toEqual(newPage);
        expect(searchState.isSearchTriggered).toBeTruthy();
        done();
      });
      service.setPage(newPage);
    });

    it('should not set isSearchTriggered to true when page changes with an empty search field', (done) => {
      service.setPage(1);
      service.setSearchField('');
      service.setSearchTriggered(false);
      const newPage = 2;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.page).toEqual(newPage);
        expect(searchState.isSearchTriggered).toBeFalsy();
        done();
      });
      service.setPage(newPage);
    });

    it('should not set isSearchTriggered to true when page changes with a null search field', (done) => {
      service.setPage(1);
      service.setSearchField(null);
      service.setSearchTriggered(false);
      const newPage = 2;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.page).toEqual(newPage);
        expect(searchState.isSearchTriggered).toBeFalsy();
        done();
      });
      service.setPage(newPage);
    });

    it('should not set isSearchTriggered to true when page changes with an undefined search field', (done) => {
      service.setPage(1);
      service.setSearchField(undefined);
      service.setSearchTriggered(false);
      const newPage = 2;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.page).toEqual(newPage);
        expect(searchState.isSearchTriggered).toBeFalsy();
        done();
      });
      service.setPage(newPage);
    });
  });

  describe('Changing page size', () => {
    it('should not trigger change when page size is the same', (done) => {
      service.setPageSize(10);

      subscription = service.getChanges().subscribe(() => {
        done.fail('Should not call an update when the page size is the same');
      });
      service.setPageSize(10);
      done();
    });

    it('should change page size', (done) => {
      service.setPageSize(10);
      const newPageSize = 11;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.pageSize).toEqual(newPageSize);
        done();
      });
      service.setPageSize(newPageSize);
    });

    it('should set isSearchTriggered to true when page size changes with a search field', (done) => {
      service.setPageSize(10);
      service.setSearchField('Test');
      service.setSearchTriggered(false);
      const newPageSize = 11;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.pageSize).toEqual(newPageSize);
        expect(searchState.isSearchTriggered).toBeTruthy();
        done();
      });
      service.setPageSize(newPageSize);
    });

    it('should not set isSearchTriggered to true when page size changes with an empty search field', (done) => {
      service.setPageSize(10);
      service.setSearchField('');
      service.setSearchTriggered(false);
      const newPageSize = 11;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.pageSize).toEqual(newPageSize);
        expect(searchState.isSearchTriggered).toBeFalsy();
        done();
      });
      service.setPageSize(newPageSize);
    });

    it('should not set isSearchTriggered to true when page size changes with a null search field', (done) => {
      service.setPageSize(10);
      service.setSearchField(null);
      service.setSearchTriggered(false);
      const newPageSize = 11;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.pageSize).toEqual(newPageSize);
        expect(searchState.isSearchTriggered).toBeFalsy();
        done();
      });
      service.setPageSize(newPageSize);
    });

    it('should not set isSearchTriggered to true when page size changes with an undefined search field', (done) => {
      service.setPageSize(10);
      service.setSearchField(undefined);
      service.setSearchTriggered(false);
      const newPageSize = 11;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.pageSize).toEqual(newPageSize);
        expect(searchState.isSearchTriggered).toBeFalsy();
        done();
      });
      service.setPageSize(newPageSize);
    });
  });

  describe('Changing search by option', () => {
    it('should set the search for option to null when search by option is \'All Customers\'', (done) => {
      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.searchForOption).toBeNull();
        done();
      });
      service.setSearchByOption(SearchByOptions.ALL_CUSTOMERS);
    });

    it('should set the search for option to null when search by option is \'By User\'', (done) => {
      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.searchForOption).toBeNull();
        done();
      });
      service.setSearchByOption(SearchByOptions.BY_USER);
    });

    it('should set the search for option to \'Plan\' when search by option is \'This Customer\'', (done) => {
      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.searchForOption).toBe(SearchForOptions.PLAN);
        done();
      });
      service.setSearchByOption(SearchByOptions.THIS_CUSTOMER);
    });

    it('should set showSearchResults to false', (done) => {
      service.setShowSearchResults(true);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.showSearchResults).toBeFalsy();
        done();
      });
      service.setSearchByOption(SearchByOptions.THIS_CUSTOMER);
    });

    it('should set call to update searchType', () => {
      const spy = spyOn(service, 'setSearchType').and.stub();
      service.setSearchByOption(SearchByOptions.THIS_CUSTOMER);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Changing search for option', () => {
    it('should update the search for option', (done) => {
      const searchForOption = SearchForOptions.ATTRIBUTE;
      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.searchForOption).toBe(searchForOption);
        done();
      });
      service.setSearchForOption(searchForOption);
    });

    it('should set showSearchResults to false', (done) => {
      service.setShowSearchResults(true);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.showSearchResults).toBeFalsy();
        done();
      });
      service.setSearchForOption(SearchForOptions.ATTRIBUTE);
    });

    it('should call to update searchType', () => {
      const spy = spyOn(service, 'setSearchType').and.stub();
      service.setSearchForOption(SearchForOptions.ATTRIBUTE);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Changing customer', () => {
    it('should update the search customer', (done) => {
      const searchCustomer = <ICustomer>{customerName: 'Test Customer', customerNumber: 1111111};
      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.searchCustomer).toEqual(searchCustomer);
        done();
      });
      service.setSearchCustomer(searchCustomer);
    });
  });

  describe('Changing search field', () => {
    it('should update the search field', (done) => {
      const searchField = 'test';
      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.searchField).toEqual(searchField);
        done();
      });
      service.setSearchField(searchField);
    });

    it('should set the page to 1', (done) => {
      service.setPage(2);
      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.page).toEqual(1);
        done();
      });
      service.setSearchField('test');
    });

    it('should set showSearchResults to false', (done) => {
      service.setShowSearchResults(true);
      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.showSearchResults).toBeFalsy();
        done();
      });
      service.setSearchField('test');
    });
  });

  describe('Changing search type', () => {
    it('should update the search type', (done) => {
      service.setSearchType(SearchTypes.ALL_CUSTOMERS);
      const searchType = SearchTypes.BY_USER;

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.searchType).toEqual(searchType);
        done();
      });
      service.setSearchType(searchType);
    });

    it('should not update sort if the search type is the same', () => {
      const searchType = SearchTypes.ALL_CUSTOMERS;
      service.setSearchType(searchType);
      const spy = spyOn(service, 'setSortBy').and.stub();

      service.setSearchType(searchType);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Changing show search results', () => {
    it('should update the show search results', (done) => {
      service.setShowSearchResults(false);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.showSearchResults).toBeTruthy();
        done();
      });
      service.setShowSearchResults(true);
    });
  });

  describe('Changing sort asc', () => {
    it('should update sort asc', (done) => {
      service.setSortAsc(false);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.sortAsc).toBeTruthy();
        done();
      });
      service.setSortAsc(true);
    });

    it('should not update page when sort asc is the same', () => {
      service.setSortAsc(true);
      const spy = spyOn(service, 'setPage').and.stub();
      service.setSortAsc(true);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should update page to 1 when sort asc changes', (done) => {
      service.setPage(2);
      service.setSortAsc(false);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.sortAsc).toBeTruthy();
        expect(searchState.page).toEqual(1);
        done();
      });
      service.setSortAsc(true);
    });

    it('should update isSearchTriggered to true when sort asc changes', (done) => {
      service.setSearchField('valid-search-field');
      service.setSearchTriggered(false);
      service.setSortAsc(false);

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.sortAsc).toBeTruthy();
        expect(searchState.isSearchTriggered).toBeTruthy();
        done();
      });
      service.setSortAsc(true);
    });
  });

  describe('Changing sort by', () => {
    it('should update sort by', (done) => {
      service.setSortBy('test');
      const sortBy = 'newSort';

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.sortBy).toEqual(sortBy);
        done();
      });
      service.setSortBy(sortBy);
    });

    it('should not update page when sort by is the same', () => {
      service.setSortBy('test');
      const spy = spyOn(service, 'setPage').and.stub();
      service.setSortBy('test');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should update page to 1 when sort by changes', (done) => {
      service.setPage(2);
      service.setSortBy('test');
      const sortBy = 'newSort';

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.sortBy).toEqual(sortBy);
        expect(searchState.page).toEqual(1);
        done();
      });
      service.setSortBy(sortBy);
    });

    it('should update isSearchTriggered when sort by changes', (done) => {
      service.setSearchField('valid-search-field');
      service.setSearchTriggered(false);
      service.setSortBy('test');
      const sortBy = 'newSort';

      subscription = service.getChanges().subscribe((searchState: ISearchState) => {
        expect(searchState.sortBy).toEqual(sortBy);
        expect(searchState.isSearchTriggered).toBeTruthy();
        done();
      });
      service.setSortBy(sortBy);
    });
  });
});
