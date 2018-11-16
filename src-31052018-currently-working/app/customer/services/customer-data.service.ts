import {CustomerSearchService} from 'app/search/services/customer-search.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ICustomerRequest} from '../interfaces/iCustomerRequest';
import {ICustomers} from 'app/customer/interfaces/iCustomers';
import {ICustomer} from '../interfaces/iCustomer';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {PageContextTypes} from '../../core/enums/page-context-types';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {UserProfile} from 'app/core/models/user-profile';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {IUserPreference} from '../../core/interfaces/iUserPreference';
import {isNil} from 'lodash';

/**
 * A customer data service that retrieves customer related information.
 */
@Injectable()
export class CustomerDataService {

  /**
   * Creates the customer data service
   * @param {HttpClient} _http
   * @param {UserProfileService} _userProfileService
   * @param {CustomerSearchService} _customerSearchService
   */
  constructor(private _http: HttpClient,
    private _userProfileService: UserProfileService,
    private _customerSearchService: CustomerSearchService) {
  }

  /**
   * Gets a customer by customer name
   */
  public getCustomerByName(customerName: string, pageNumber: number = 1): Observable<ICustomer[]> {
    if (!customerName.trim()) {
      return Observable.of([]);
    }
    if (pageNumber < 1) {
      pageNumber = 1;
    }
    const searchRequest: ICustomerRequest = {
      searchField: customerName,
      sortAsc: true,
      sortBy: 'customerName',
      page: pageNumber,
      pageSize: 10,
      hidden: false,
      globalSearch: false
    };
    return this._customerSearchService.searchAllCustomers(searchRequest)
      .map((response) => {
        return <ICustomer[]>response.results;
      })
      .catch(this._handleError);
  }

  /**
   * Gets a customer by customer number
   */
  public getCustomer(customerNumber: number): Observable<ICustomer> {
    const url = `/customers/${customerNumber}`;
    return this._http.get<ICustomer>(url)
      .map((response: any) => response)
      .catch(this._handleError);
  }

  /**
   * Gets a list of customers for a specific user
   */
  public getCustomersForUser(user: UserProfile): Observable<ICustomers> {
    const userPreference = this._userProfileService.getUserPreferenceForPage(PageContextTypes.USER_HOME);
    const customerRequest: ICustomerRequest = this.initCustomerRequest(userPreference, user.userId);
    return this.getCustomers(customerRequest);
  }

  /**
   * Gets a list of customers based on a request
   */
  public getCustomers(customerRequest: ICustomerRequest): Observable<ICustomers> {
    const params: HttpParams = this._mapCustomersRequestParams(customerRequest);
    const url = `/users/${customerRequest.userId}/customers/`;
    return this._http.get(url, {params})
      .catch(this._handleError);
  }

  /**
   * Initializes a customer request
   */
  public initCustomerRequest(userPreference: IUserPreference, userId?: string): ICustomerRequest {
    return {
      searchField: '',
      sortAsc: userPreference.sortAsc,
      sortBy: userPreference.sortBy,
      page: 1,
      pageSize: 12,
      hidden: false,
      globalSearch: false,
      userId
    };
  }

  /**
   * Maps the request params for a customer request
   */
  private _mapCustomersRequestParams(customerRequest: ICustomerRequest): HttpParams {
    return new HttpParams()
      .set('sortBy', `${customerRequest.sortBy}`)
      .set('sortAsc', `${customerRequest.sortAsc}`)
      .set('page', `${customerRequest.page}`)
      .set('pageSize', `${customerRequest.pageSize}`)
      .set('hidden', `${customerRequest.hidden}`)
      .set('globalSearch', `${false}`)
      .set('userSearch', `${false}`);
  }

  /**
   * Private method to handle error/caught exceptions from observable.
   */
  private _handleError(error: any): ErrorObservable {
    if (error && error.error) {
      return Observable.throw(error.error);
    }
    const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'An unidentified error occurred. Time to debug!';
    return Observable.throw(errMsg);
  }
}
