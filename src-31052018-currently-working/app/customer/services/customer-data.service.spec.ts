import * as mockCustomer from '../../../assets/test/customers/customer.mock.json';
import * as mockCustomers from '../../../assets/test/customers/paging/customers1.mock.json';
import {CustomerDataService} from './customer-data.service';
import {CustomerSearchService} from '../../search/services/customer-search.service';
import {DateService} from '../../core/services/date.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ICustomers} from '../interfaces/iCustomers';
import {ISearchResults} from 'app/search/interfaces/iSearchResults';
import {MockUserProfileService} from 'app/core/services/user-profile-service-mock';
import {NotificationService} from '../../core/services/notification.service';
import {Observable} from 'rxjs/Observable';
import {PageContextTypes} from '../../core/enums/page-context-types';
import {PagingService} from 'app/ui-controls/services/paging.service';
import {ScrollService} from '../../ui-controls/services/scroll.service';
import {Subscription} from 'rxjs/Subscription';
import {TestBed} from '@angular/core/testing';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {UserProfile} from 'app/core/models/user-profile';

describe('CustomerDataService', () => {
  let customerService: CustomerDataService;

  let httpMock: HttpTestingController;
  let objUser: UserProfile = new UserProfile({
    userId: '067897',
    firstName: 'Charlie',
    lastName: 'Brown',
    emailAddress: 'charlie.brown@metlife.com',
    metnetId: 'cbrown123',
    userRoles: null,
    userPreferences: [
      {
        pageName: PageContextTypes.USER_HOME,
        sortBy: 'lastActivity',
        sortAsc: true,
        editDisplayCount: 0
      }
    ]
  });

  let currentUser: UserProfile = new UserProfile(objUser);
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerDataService,
        NotificationService,
        PagingService,
        {provide: UserProfileService, useClass: MockUserProfileService},
        ScrollService,
        CustomerSearchService,
        DateService
      ]
    });
    customerService = TestBed.get(CustomerDataService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('Get Cases', () => {
    it('should get a list of cases for a user', (done) => {

      // Subscribe to result
      subscription = customerService.getCustomersForUser(currentUser).subscribe((customers: ICustomers) => {
        expect(customers.customers.length).toBe(9);
        done();
      }, () => {
        done.fail('It should not call error function');
      });





      const url = `/users/067897/customers/`;
      const params = 'sortBy=lastActivity&sortAsc=true&page=1&pageSize=12&hidden=false&globalSearch=false&userSearch=false';
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      // Mock Request
      req.flush(mockCustomers);
      httpMock.verify();
    });

    it('should return error if getCases request failed', (done) => {
      subscription = customerService.getCustomersForUser(currentUser).subscribe(() => {
        done.fail('It should not successfully get cases');
      }, (error) => {
        expect(error.message).toBe('Error getting cases for a customer');
        done();
      });

      const url = `/users/067897/customers/`;
      const params = 'sortBy=lastActivity&sortAsc=true&page=1&pageSize=12&hidden=false&globalSearch=false&userSearch=false';
      const urlWithParams = `${url}?${params}`;

      let req = httpMock.expectOne(urlWithParams);
      let err = new ErrorEvent('ERROR', {
        error: new Error(),
        message: 'Error getting cases for a customer'
      });
      req.error(err);
      httpMock.verify();
    });
  });

  describe('Get Customer by Customer Number', () => {

    it('should return a customer', (done) => {
      const customerNumber = 1;

      subscription = customerService.getCustomer(customerNumber).subscribe((res: any) => {
        expect(res.customerName).toBe(mockCustomer['customerName']);
        done();
      }, () => {
        done.fail('It should not fail when getting a customer');
      });

      const url = `/customers/${customerNumber}`;
      const method = 'GET';
      let req = httpMock.expectOne({url, method});
      req.flush(mockCustomer);
      httpMock.verify();
    });

    it('should return error if getCustomer request failed', (done) => {
      const customerNumber = 1;

      subscription = customerService.getCustomer(customerNumber).subscribe(() => {
        done.fail('It should not successfully get a customer');
      }, (error) => {
        expect(error.message).toBe('Error getting customer by customer number');
        done();
      });

      const url = `/customers/${customerNumber}`;
      const method = 'GET';
      let req = httpMock.expectOne({url, method});
      let err = new ErrorEvent('ERROR', {
        error: new Error(),
        message: 'Error getting customer by customer number'
      });
      req.error(err);
      httpMock.verify();
    });
  });

  describe('Get Customer by Customer Name', () => {

    it('should return a customer', (done) => {
      const customers = JSON.parse(JSON.stringify(mockCustomers));
      const response: ISearchResults = {
        results: customers.customers,
        page: customers.page,
        pageSize: customers.pageSize,
        totalCount: customers.totalCount
      };

      spyOn(TestBed.get(CustomerSearchService), 'searchAllCustomers').and.callFake(() => {
        return Observable.of(response);
      });

      subscription = customerService.getCustomerByName('name').subscribe((res: any) => {
        expect(res).toBe(response.results);
        done();
      });
    });

    it('should return error if getCustomerByName request failed', () => {
      subscription = customerService.getCustomerByName('name').subscribe(() => {
      }, (error) => {
        expect(error.message).toBe('Error getting customer by customer name');
      });
      spyOn(TestBed.get(CustomerSearchService), 'searchAllCustomers').and.throwError('Error getting customer by customer name');
    });
  });
});
