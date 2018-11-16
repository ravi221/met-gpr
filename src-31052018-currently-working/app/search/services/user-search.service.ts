import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ISearchResults} from '../interfaces/iSearchResults';
import {IAutoSearchResultItem} from '../../ui-controls/interfaces/iAutoSearchResultItem';
import {ISearchUser} from '../interfaces/iSearchUser';
import {isNil} from 'lodash';
import {ICustomerRequest} from '../../customer/interfaces/iCustomerRequest';

/**
 * A service used to search for users and provides helper functions for the {@link SearchUserBarComponent}
 */
@Injectable()
export class UserSearchService {

  /**
   * A default response in case of error or bad data
   */
  private static DEFAULT_CUSTOMERS_RESPONSE: ISearchResults = {
    results: [],
    page: 1,
    pageSize: 10,
    totalCount: 0
  };


  /**
   * A list of default search users, in case of no results or error
   * @type {Array}
   */
  private static EMPTY_USERS: ISearchUser[] = [];

  /**
   * Creates the user search service
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
  }

  /**
   * A function to format users to use with the auto search results
   * @param {ISearchUser[]} users
   * @returns {IAutoSearchResultItem[]}
   */
  public formatUsers(users: ISearchUser[]): IAutoSearchResultItem[] {
    return users.map(user => {
      return <IAutoSearchResultItem>{
        title: `${user.lastName}, ${user.firstName}`,
        subtitle: user.emailAddress,
        model: user
      };
    });
  }

  /**
   * Searches the user for its customers
   * @param {string} userId
   * @param {ICustomerRequest} customerRequest
   * @returns {Observable<ISearchResults>}
   */
  public searchCustomersByUser(userId: string, customerRequest: ICustomerRequest): Observable<ISearchResults> {
    const url = `/users/${userId}/customers`;
    const params = this._createUserCustomerParams(customerRequest);
    return this._http.get(url, {params})
      .map((response: any) => {
        return this._handleSearchUserCustomersSuccess(response);
      })
      .catch(this._handleSearchUserCustomersError);
  }

  /**
   * Searches for users given a user detail string
   * @param {string} userDetails
   * @returns {Observable<ISearchResults>}
   */
  public searchUsers(userDetails: string): Observable<ISearchUser[]> {
    const url = `/users`;
    const params = this._createUserParams(userDetails);
    return this._http.get(url, {params})
      .map((response: any) => {
        return this._handleSearchUsersSuccess(response);
      })
      .catch(this._handleSearchUsersError);
  }

  /**
   * Creates the parameters for searching for a user's customers
   * @param {ICustomerRequest} customerRequest
   * @returns {HttpParams}
   * @private
   */
  private _createUserCustomerParams(customerRequest: ICustomerRequest): HttpParams {
    return new HttpParams()
      .set('sortBy', `${customerRequest.sortBy}`)
      .set('sortAsc', `${customerRequest.sortAsc}`)
      .set('page', `${customerRequest.page}`)
      .set('pageSize', `${customerRequest.pageSize}`)
      .set('hidden', `${customerRequest.hidden}`)
      .set('globalSearch', `${customerRequest.globalSearch}`)
      .set('userSearch', `${customerRequest.userSearch}`);
  }

  /**
   * Creates the http params given the user details string to search by
   * @param {string} userDetails
   * @returns {HttpParams}
   * @private
   */
  private _createUserParams(userDetails: string): HttpParams {
    return new HttpParams()
      .set('userDetails', userDetails)
      .set('page', '1')
      .set('pageSize', '5');
  }

  /**
   * Handles when the call to get a user's customers is successful
   * @param response
   * @returns {ISearchResults}
   * @private
   */
  private _handleSearchUserCustomersSuccess(response: any): ISearchResults {
    if (isNil(response)) {
      return UserSearchService.DEFAULT_CUSTOMERS_RESPONSE;
    }

    const customers = response.customers;
    if (isNil(customers)) {
      return UserSearchService.DEFAULT_CUSTOMERS_RESPONSE;
    }

    return <ISearchResults> {
      results: response.customers,
      page: response.page,
      pageSize: response.pageSize,
      totalCount: response.totalCount
    };
  }

  /**
   * Handles when the call to get a user's customers is an error
   * @returns {Observable<ISearchResults>}
   * @private
   */
  private _handleSearchUserCustomersError(): Observable<ISearchResults> {
    return Observable.of(UserSearchService.DEFAULT_CUSTOMERS_RESPONSE);
  }

  /**
   * Handles when the call to get users is successful
   * @param response
   * @returns {Observable<ISearchUser[]>}
   * @private
   */
  private _handleSearchUsersSuccess(response: any): ISearchUser[] {
    if (isNil(response)) {
      return UserSearchService.EMPTY_USERS;
    }

    const users = response.users;
    if (isNil(users)) {
      return UserSearchService.EMPTY_USERS;
    }

    return users;
  }

  /**
   * Handles error when searching by users
   * @returns {ErrorObservable}
   */
  private _handleSearchUsersError(): Observable<ISearchUser[]> {
    return Observable.of(UserSearchService.EMPTY_USERS);
  }
}
