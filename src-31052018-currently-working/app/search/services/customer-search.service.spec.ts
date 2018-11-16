import {TestBed} from '@angular/core/testing';
import {CustomerSearchService} from './customer-search.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Subscription} from 'rxjs/Subscription';
import {ICustomerRequest} from '../../customer/interfaces/iCustomerRequest';
import * as mockAllCustomers from '../../../assets/test/search/customers/search-all-customers.mock.json';
import * as mockRecentCustomers from '../../../assets/test/search/customers/search-recent-customers.mock.json';
import {DateService} from '../../core/services/date.service';
import {UserProfileService} from '../../core/services/user-profile.service';
import {MockUserProfileService} from '../../core/services/user-profile-service-mock';

describe('CustomerSearchService', () => {
  let service: CustomerSearchService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;
  let customerRequest: ICustomerRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerSearchService, DateService, {provide: UserProfileService, useClass: MockUserProfileService}]
    });
    service = TestBed.get(CustomerSearchService);
    httpMock = TestBed.get(HttpTestingController);
    customerRequest = {
      searchField: 'test',
      page: 1,
      pageSize: 10,
      sortBy: 'customerName',
      sortAsc: true,
      hidden: false,
      globalSearch: true
    };
  });

  afterEach(() => {
    httpMock.verify();
    if (subscription) {
      subscription.unsubscribe();
    }
  });


  describe('Search All Customers', () => {
    it('should return a list of all customers', () => {

      // Subscribe to result
      subscription = service.searchAllCustomers(customerRequest).subscribe(searchResults => {
        const customers = searchResults.results;
        expect(customers.length).toBe(4);
        expect(customers).toEqual(mockAllCustomers['customers']);
      });

      const params = 'sortAsc=true&sortBy=customerName&page=1&pageSize=10&customerDetail=test';
      const url = `/customers`;
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      // There is currently an error when testing http calls with query params, this is the work around
      // https://github.com/angular/angular/issues/19974
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      // Mock Request
      req.flush(mockAllCustomers);
    });

    describe('Effective Date', () => {
      it('should add effective date for XX/YY/ZZZZ format', () => {
        customerRequest.searchField = '01/01/2017';

        // Subscribe to result
        subscription = service.searchAllCustomers(customerRequest).subscribe(searchResults => {
          const customers = searchResults.results;
          expect(customers.length).toBe(4);
          expect(customers).toEqual(mockAllCustomers['customers']);
        });

        const params = 'sortAsc=true&sortBy=customerName&page=1&pageSize=10&effectiveDate=01/01/2017';
        const url = `/customers`;
        const method = 'GET';
        const urlWithParams = `${url}?${params}`;

        // Expect Request
        const req = httpMock.expectOne(r => {
          return r.method === method && r.urlWithParams === urlWithParams;
        });

        // Mock Request
        req.flush(mockAllCustomers);
      });

      it('should add effective date for X/Y/ZZZZ format', () => {
        customerRequest.searchField = '1/1/2017';

        // Subscribe to result
        subscription = service.searchAllCustomers(customerRequest).subscribe(searchResults => {
          const customers = searchResults.results;
          expect(customers.length).toBe(4);
          expect(customers).toEqual(mockAllCustomers['customers']);
        });

        const params = 'sortAsc=true&sortBy=customerName&page=1&pageSize=10&effectiveDate=1/1/2017';
        const url = `/customers`;
        const method = 'GET';
        const urlWithParams = `${url}?${params}`;

        // Expect Request
        const req = httpMock.expectOne(r => {
          return r.method === method && r.urlWithParams === urlWithParams;
        });

        // Mock Request
        req.flush(mockAllCustomers);
      });
    });
  });

  describe('Search Recent Customers', () => {
    it('should return a list of recent customers', () => {

      // Subscribe to result
      subscription = service.searchRecentCustomers().subscribe(searchResults => {
        const customers = searchResults.results;
        expect(customers.length).toBe(3);
        expect(customers).toEqual(mockRecentCustomers['customers']);
      });

      const params = 'page=1&pageSize=3&sortBy=customerName&sortAsc=true&hidden=false&globalSearch=true';
      const url = `/users/cbrown123/customers`;
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      // Mock Request
      req.flush(mockRecentCustomers);
    });
  });
});
