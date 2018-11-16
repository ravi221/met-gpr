import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthorizationService} from '../../../core/services/authorization.service';
import {CustomerDataService} from '../../../customer/services/customer-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {mockSearchState} from '../../../../assets/test/common-objects/search-state.mock';
import {NavContextType} from '../../../navigation/enums/nav-context';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {PagingService} from '../../../ui-controls/services/paging.service';
import {RouterTestingModule} from '@angular/router/testing';
import {ScrollService} from '../../../ui-controls/services/scroll.service';
import {SearchBarService} from '../../services/search-bar.service';
import {SearchBarStubComponent} from '../search-bar/search-bar.component.stub';
import {SearchByOptions} from '../../enums/SearchByOptions';
import {SearchForOptions} from '../../enums/SearchForOptions';
import {SearchOptionsBarStubComponent} from '../search-options-bar/search-options-bar.component.stub';
import {SearchPageComponent} from './search-page.component';
import {SearchResultListStubComponent} from '../search-results/search-result-list/search-result-list.component.stub';
import {SearchResultTitleService} from '../../services/search-result-title.service';
import {SearchService} from '../../services/search.service';
import {SearchSortStubComponent} from '../search-sort/search-sort.component.stub';
import {SearchStateService} from '../../services/search-state.service';
import {SearchTitleStubComponent} from '../search-title/search-title.component.stub';
import {SearchUserBarStubComponent} from '../search-user-bar/search-user-bar.component.stub';
import {SortOptionsService} from '../../../core/services/sort-options.service';
import {UserPreferencesService} from '../../../core/services/user-preferences.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let searchStateService: SearchStateService;
  let searchBarService: SearchBarService;
  let navigator: NavigatorService;

  class MockCustomerDataService {
    public getCustomer() {

    }
  }

  class MockSearchService {
    public canSearch() {
    }

    public search() {
    }

    public setSearchState() {
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [
        SearchBarStubComponent,
        SearchOptionsBarStubComponent,
        SearchPageComponent,
        SearchResultListStubComponent,
        SearchSortStubComponent,
        SearchTitleStubComponent,
        SearchUserBarStubComponent,
      ],
      providers: [
        AuthorizationService,
        PagingService,
        ScrollService,
        SearchBarService,
        SearchResultTitleService,
        SearchStateService,
        SortOptionsService,
        UserPreferencesService,
        UserProfileService,
        {provide: NavigatorService, useClass: MockNavigatorService},
        {provide: CustomerDataService, useClass: MockCustomerDataService},
        {provide: SearchService, useClass: MockSearchService}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SearchPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Updating search state service', () => {
    beforeEach(() => {
      searchStateService = TestBed.get(SearchStateService);
    });

    it('should update search triggered', () => {
      const searchTriggeredSpy = spyOn(searchStateService, 'setSearchTriggered').and.stub();
      component.onSearchTriggered('test');
      expect(searchTriggeredSpy).toHaveBeenCalled();
      expect(searchTriggeredSpy).toHaveBeenCalledWith(true);
    });

    it('should update search field', () => {
      const newSearchField = 'ab';
      const searchFieldSpy = spyOn(searchStateService, 'setSearchField').and.stub();
      component.onSearchTyped(newSearchField);
      expect(searchFieldSpy).toHaveBeenCalled();
      expect(searchFieldSpy).toHaveBeenCalledWith(newSearchField);
    });

    it('should update sort asc and sort by when sort changes', () => {
      const newSortOption = {
        sortBy: 'test',
        sortAsc: false,
        label: 'Test Label',
        active: true
      };
      const sortAscSpy = spyOn(searchStateService, 'setSortAsc').and.stub();
      const sortBySpy = spyOn(searchStateService, 'setSortBy').and.stub();
      component.onSortChange(newSortOption);
      expect(sortAscSpy).toHaveBeenCalled();
      expect(sortAscSpy).toHaveBeenCalledWith(newSortOption.sortAsc);
      expect(sortBySpy).toHaveBeenCalled();
      expect(sortBySpy).toHaveBeenCalledWith(newSortOption.sortBy);
    });

    it('should update the search field and set search triggered to true when a user is selected', () => {
      const newSearchUser = {
        firstName: 'First',
        lastName: 'Last',
        userId: '1234567',
        emailAddress: ''
      };
      const searchFieldSpy = spyOn(searchStateService, 'setSearchField').and.stub();
      const searchTriggeredSpy = spyOn(searchStateService, 'setSearchTriggered').and.stub();
      component.onUserSelect(newSearchUser);
      expect(searchFieldSpy).toHaveBeenCalled();
      expect(searchFieldSpy).toHaveBeenCalledWith(newSearchUser.userId);
      expect(searchTriggeredSpy).toHaveBeenCalled();
      expect(searchTriggeredSpy).toHaveBeenCalledWith(true);
    });

    it('should not update the search page when the context is not \'SEARCH\' when scrolling', () => {
      component.searchState = mockSearchState;
      component.searchState.navContext = NavContextType.CUSTOMER;

      const pageSpy = spyOn(searchStateService, 'setPage').and.stub();
      component.onShowMoreResultsScroll();
      expect(pageSpy).not.toHaveBeenCalled();
    });

    it('should update the search page when the context is \'SEARCH\' when scrolling', () => {
      component.searchState = mockSearchState;
      component.searchState.navContext = NavContextType.SEARCH;
      component.searchState.page = 1;

      const pageSpy = spyOn(searchStateService, 'setPage').and.stub();
      component.onShowMoreResultsScroll();
      expect(pageSpy).toHaveBeenCalled();
      expect(pageSpy).toHaveBeenCalledWith(2);
    });

    it('should update the \'Search By\' option', () => {
      const newSearchByOption = SearchByOptions.ALL_CUSTOMERS;
      const searchByOptionSpy = spyOn(searchStateService, 'setSearchByOption').and.stub();
      component.onSearchByOptionChange(newSearchByOption);
      expect(searchByOptionSpy).toHaveBeenCalled();
      expect(searchByOptionSpy).toHaveBeenCalledWith(newSearchByOption);
    });

    it('should update the \'Search For\' option', () => {
      const newSearchForOption = SearchForOptions.ATTRIBUTE;
      const searchForOptionSpy = spyOn(searchStateService, 'setSearchForOption').and.stub();
      component.onSearchForOptionChange(newSearchForOption);
      expect(searchForOptionSpy).toHaveBeenCalled();
      expect(searchForOptionSpy).toHaveBeenCalledWith(newSearchForOption);
    });
  });

  describe('Focusing search bar', () => {
    beforeEach(() => {
      searchBarService = TestBed.get(SearchBarService);
    });

    it('should focus when \'Search By\' option changes', () => {
      const spy = spyOn(searchBarService, 'focus').and.stub();
      component.onSearchByOptionChange(SearchByOptions.ALL_CUSTOMERS);
      expect(spy).toHaveBeenCalled();
    });

    it('should focus when \'Search For\' option changes', () => {
      const spy = spyOn(searchBarService, 'focus').and.stub();
      component.onSearchForOptionChange(SearchForOptions.ATTRIBUTE);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Navigating', () => {
    beforeEach(() => {
      navigator = TestBed.get(NavigatorService);
    });

    it('should navigate to search home when search by option is \'By User\'', () => {
      const spy = spyOn(navigator, 'goToSearchHome').and.stub();
      component.onSearchByOptionChange(SearchByOptions.BY_USER);
      expect(spy).toHaveBeenCalled();
    });

    it('should not navigate to search home when search by option is \'This Customer\'', () => {
      const spy = spyOn(navigator, 'goToSearchHome').and.stub();
      component.onSearchByOptionChange(SearchByOptions.THIS_CUSTOMER);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should navigate to search home when attribute details is clicked', () => {
      const spy = spyOn(navigator, 'goToSearchHome').and.stub();
      component.onSearchByOptionChange(SearchByOptions.BY_USER);
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to customer home when a customer is clicked', () => {
      const customerNumber = 1;
      const spy = spyOn(navigator, 'goToCustomerHome').and.stub();
      component.onCustomerClick(customerNumber);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(customerNumber);
    });

    it('should navigate to plan home when a plan is clicked', () => {
      const planId = '1';
      const spy = spyOn(navigator, 'goToPlanHome').and.stub();
      component.onPlanClick(planId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(planId);
    });
  });
});
