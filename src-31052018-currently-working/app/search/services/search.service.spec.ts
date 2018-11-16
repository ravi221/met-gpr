import {TestBed} from '@angular/core/testing';
import {SearchService} from './search.service';
import {CustomerSearchService} from './customer-search.service';
import {PlanSearchService} from './plan-search.service';
import {SearchTypes} from '../enums/SearchTypes';
import {AttributeSearchService} from './attribute-search.service';
import {ISearchState} from '../interfaces/iSearchState';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DateService} from '../../core/services/date.service';
import {mockSearchState} from '../../../assets/test/common-objects/search-state.mock';
import {UserProfileService} from '../../core/services/user-profile.service';
import {AuthorizationService} from '../../core/services/authorization.service';
import {LogoutService} from '../../navigation/services/logout.service';
import {Idle, IdleExpiry} from '@ng-idle/core';
import {MockIdleExpiry} from 'app/core/services/idle-expiry.mock';
import {UserPreferencesService} from '../../core/services/user-preferences.service';
import {SortOptionsService} from '../../core/services/sort-options.service';
import {UserSearchService} from './user-search.service';

describe('SearchService', () => {
  let service: SearchService;
  let customerSearchService: CustomerSearchService;
  let planSearchService: PlanSearchService;
  let attributeSearchService: AttributeSearchService;
  let searchState: ISearchState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SearchService,
        CustomerSearchService,
        PlanSearchService,
        AttributeSearchService,
        DateService,
        UserProfileService,
        AuthorizationService,
        LogoutService,
        Idle,
        SortOptionsService,
        UserPreferencesService,
        UserSearchService,
        {provide: IdleExpiry, useClass: MockIdleExpiry}
      ]
    });
    service = TestBed.get(SearchService);
    customerSearchService = TestBed.get(CustomerSearchService);
    planSearchService = TestBed.get(PlanSearchService);
    attributeSearchService = TestBed.get(AttributeSearchService);
    searchState = mockSearchState;
  });

  describe('Customer Search', () => {
    it('should call customerSearchService to search all customers', () => {
      const spy = spyOn(customerSearchService, 'searchAllCustomers').and.stub();
      searchState.searchType = SearchTypes.ALL_CUSTOMERS;
      service.setSearchState(searchState);
      service.search();
      expect(spy).toHaveBeenCalled();
    });

    it('should call customerSearchService to search recent customers', () => {
      const spy = spyOn(customerSearchService, 'searchRecentCustomers').and.stub();
      searchState.searchType = SearchTypes.RECENT_CUSTOMERS;
      service.setSearchState(searchState);
      service.search();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Plan Search', () => {
    it('should call planSearchService to search plans by plan name', () => {
      const spy = spyOn(planSearchService, 'searchPlans').and.stub();
      searchState.searchType = SearchTypes.PLAN;
      service.setSearchState(searchState);
      service.search();
      expect(spy).toHaveBeenCalled();
    });

    it('should call planSearchService to search plans by attribute name', () => {
      const spy = spyOn(planSearchService, 'searchPlans').and.stub();
      searchState.searchType = SearchTypes.ATTRIBUTE;
      service.setSearchState(searchState);
      service.search();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Attribute Search', () => {
    it('should call attributeSearchService to search for attribute details', () => {
      const spy = spyOn(attributeSearchService, 'searchAttributes').and.stub();
      searchState.searchType = SearchTypes.ATTRIBUTE_DETAILS;
      searchState.optionalSearchParams = {
        planIds: [],
        model: '',
        label: ''
      };
      service.setSearchState(searchState);
      service.search();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Valid Search', () => {
    it('should return true when the search field and search type are valid', () => {
      searchState.searchField = '1';
      searchState.searchType = SearchTypes.RECENT_CUSTOMERS;
      service.setSearchState(searchState);

      expect(service.canSearch()).toBeTruthy();
    });

    it('should return false when the search field is null', () => {
      searchState.searchField = null;
      searchState.searchType = SearchTypes.RECENT_CUSTOMERS;
      service.setSearchState(searchState);

      expect(service.canSearch()).toBeFalsy();
    });

    it('should return false when the search field is undefined', () => {
      searchState.searchField = undefined;
      searchState.searchType = SearchTypes.RECENT_CUSTOMERS;
      service.setSearchState(searchState);

      expect(service.canSearch()).toBeFalsy();
    });

    it('should return false when the search type is null', () => {
      searchState.searchField = '1';
      searchState.searchType = null;
      service.setSearchState(searchState);

      expect(service.canSearch()).toBeFalsy();
    });

    it('should return false when the search type is undefined', () => {
      searchState.searchField = '1';
      searchState.searchType = undefined;
      service.setSearchState(searchState);

      expect(service.canSearch()).toBeFalsy();
    });

    it('should return false when the search state is undefined', () => {
      searchState = undefined;
      service.setSearchState(searchState);

      expect(service.canSearch()).toBeFalsy();
    });

    it('should return false when the search state is null', () => {
      searchState = null;
      service.setSearchState(searchState);

      expect(service.canSearch()).toBeFalsy();
    });


  });
});
