import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ISearchResults} from '../interfaces/iSearchResults';
import {ICustomerRequest} from '../../customer/interfaces/iCustomerRequest';
import {DateService} from '../../core/services/date.service';
import {UserProfileService} from '../../core/services/user-profile.service';
import {isNil} from 'lodash';

/**
 * A service to handle searching for customers
 */
@Injectable()
export class CustomerSearchService {

  /**
   * Url to call search all customers
   * @type {string}
   */
  private static readonly ALL_CUSTOMERS_URL = '/customers';

  /**
   * A default response in case of error or bad data
   */
  private static readonly DEFAULT_RESPONSE: Observable<ISearchResults> = Observable.of({
    results: [],
    page: 1,
    pageSize: 10,
    totalCount: 0
  });

  /**
   * The parameters used when searching for recent customers
   * @type {HttpParams}
   */
  private static readonly RECENT_CUSTOMERS_PARAMS: HttpParams = new HttpParams()
    .set('page', `1`)
    .set('pageSize', `3`)
    .set('sortBy', `customerName`)
    .set('sortAsc', `true`)
    .set('hidden', `false`)
    .set('globalSearch', `true`);

  /**
   * Creates the customer search service
   * @param {HttpClient} _http
   * @param {DateService} _dateService
   * @param {UserProfileService} _userProfileService
   */
  constructor(private _http: HttpClient,
              private _dateService: DateService,
              private _userProfileService: UserProfileService) {
  }

  /**
   * Searches for all customers given a search field
   * @param {ICustomerRequest} customerRequest
   * @returns {Observable<ISearchResults>}
   */
  public searchAllCustomers(customerRequest: ICustomerRequest): Observable<ISearchResults> {
    const isValidRequest = this._isValidRequest(customerRequest);
    if (!isValidRequest) {
      return CustomerSearchService.DEFAULT_RESPONSE;
    }

    const params: HttpParams = this._createAllCustomerParams(customerRequest);
    return this._http.get<ISearchResults>(CustomerSearchService.ALL_CUSTOMERS_URL, {params})
      .map((response: any) => {
        return <ISearchResults>{
          results: response.customers,
          page: response.page,
          pageSize: response.pageSize,
          totalCount: response.totalCount
        };
      })
      .catch(this._handleError);
  }

  /**
   * Searches for recent customers
   * @returns {Observable<ISearchResults>}
   */
  public searchRecentCustomers(): Observable<ISearchResults> {
    const metnetId = this._userProfileService.getCurrentUserProfile().metnetId;
    const params: HttpParams = CustomerSearchService.RECENT_CUSTOMERS_PARAMS;
    const url = `/users/${metnetId}/customers`;
    return this._http.get<ISearchResults>(url, {params})
      .map((response: any) => {
        return <ISearchResults>{
          results: response.customers,
          page: response.page,
          pageSize: response.pageSize,
          totalCount: response.totalCount
        };
      })
      .catch(this._handleError);
  }

  /**
   * Creates the request when searching all customers
   * @param {ICustomerRequest} customerRequest
   * @returns {HttpParams}
   * @private
   */
  private _createAllCustomerParams(customerRequest: ICustomerRequest): HttpParams {
    const customerDetail = customerRequest.searchField;
    const customerDetailParam = this._dateService.isDateFormat(customerDetail) ? 'effectiveDate' : 'customerDetail';
    return new HttpParams()
      .set('sortAsc', `${customerRequest.sortAsc}`)
      .set('sortBy', customerRequest.sortBy)
      .set('page', `${customerRequest.page}`)
      .set('pageSize', `${customerRequest.pageSize}`)
      .set(customerDetailParam, customerDetail);
  }

  /**
   * Indicates if the request is valid
   * @param {ICustomerRequest} customerRequest
   * @returns {boolean}
   * @private
   */
  private _isValidRequest(customerRequest: ICustomerRequest): boolean {
    const searchField = customerRequest.searchField;
    const hasSearchField = !isNil(searchField) && searchField.length > 0;
    if (!hasSearchField) {
      return false;
    }
    return true;
  }

  /**
   * In case of error, return an empty response
   * @returns {Observable<ISearchResults>}
   * @private
   */
  private _handleError(): Observable<ISearchResults> {
    return CustomerSearchService.DEFAULT_RESPONSE;
  }
}
