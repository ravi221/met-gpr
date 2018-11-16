import {TestBed} from '@angular/core/testing';
import {PlanSearchService} from './plan-search.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Subscription} from 'rxjs/Subscription';
import {ISearchPlanRequest} from '../interfaces/iSearchPlanRequest';
import {DateService} from '../../core/services/date.service';
import * as mockPlansByPlanName from '../../../assets/test/search/plans/search-plans-by-plan-name.mock.json';
import * as mockPlansByAttribute from '../../../assets/test/search/plans/search-plans-by-attribute.mock.json';

describe('PlanSearchService', () => {
  let service: PlanSearchService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;
  let planRequest: ISearchPlanRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlanSearchService, DateService]
    });
    planRequest = {
      customerNumber: 1,
      searchCriteria: 'planName',
      searchKey: 'test',
      sortBy: 'planName',
      sortAsc: true,
      page: 1,
      pageSize: 4
    };
    service = TestBed.get(PlanSearchService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  describe('Search by plan name', () => {
    it('should return a list of plans when searching by plan name', () => {

      // Subscribe to result
      subscription = service.searchPlans(planRequest).subscribe(searchResults => {
        const plans = searchResults.results;
        expect(plans.length).toBe(4);
      });

      const params = 'searchKey=test&searchCriteria=planName&sortAsc=true&sortBy=planName&page=1&pageSize=4';
      const url = `/customers/1/plans/search`;
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      req.flush(mockPlansByPlanName);
      httpMock.verify();
    });

    it('should search by effective date when the search key is \'01/01/2018\'', () => {
      planRequest.searchKey = '01/01/2018';

      // Subscribe to result
      subscription = service.searchPlans(planRequest).subscribe(searchResults => {
        const plans = searchResults.results;
        expect(plans.length).toBe(4);
      });

      const params = 'searchKey=01/01/2018&searchCriteria=effectiveDate&sortAsc=true&sortBy=planName&page=1&pageSize=4';
      const url = `/customers/1/plans/search`;
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      req.flush(mockPlansByPlanName);
      httpMock.verify();
    });

    it('should search by effective date when the search key is \'1/1/2018\'', () => {
      planRequest.searchKey = '1/1/2018';

      // Subscribe to result
      subscription = service.searchPlans(planRequest).subscribe(searchResults => {
        const plans = searchResults.results;
        expect(plans.length).toBe(4);
      });

      const params = 'searchKey=1/1/2018&searchCriteria=effectiveDate&sortAsc=true&sortBy=planName&page=1&pageSize=4';
      const url = `/customers/1/plans/search`;
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      req.flush(mockPlansByPlanName);
      httpMock.verify();
    });
  });

  describe('Search by attribute', () => {
    it('should return a list of plans when searching by attribute', () => {
      planRequest.searchCriteria = 'attribute';

      // Subscribe to result
      subscription = service.searchPlans(planRequest).subscribe(searchResults => {
        const plans = searchResults.results;
        expect(plans.length).toBe(2);
      });

      const params = 'searchKey=test&searchCriteria=attribute&sortAsc=true&sortBy=planName&page=1&pageSize=4';
      const url = `/customers/1/plans/search`;
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      req.flush(mockPlansByAttribute);
      httpMock.verify();
    });

    it('should not search by effective date when the search is for attribute', () => {
      planRequest.searchCriteria = 'attribute';
      planRequest.searchKey = '01/01/2018';

      // Subscribe to result
      subscription = service.searchPlans(planRequest).subscribe(searchResults => {
        const plans = searchResults.results;
        expect(plans.length).toBe(2);
      });

      const params = 'searchKey=01/01/2018&searchCriteria=attribute&sortAsc=true&sortBy=planName&page=1&pageSize=4';
      const url = `/customers/1/plans/search`;
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      req.flush(mockPlansByAttribute);
      httpMock.verify();
    });
  });
});
