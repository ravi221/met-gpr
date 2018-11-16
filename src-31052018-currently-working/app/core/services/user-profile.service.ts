import {AuthorizationService} from './authorization.service';
import {HttpClient} from '@angular/common/http';
import {IAccessRole} from 'app/core/interfaces/iAccessRole';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {ISortOption} from '../interfaces/iSortOption';
import {IUserPreference} from 'app/core/interfaces/iUserPreference';
import {Observable} from 'rxjs/Observable';
import {PageContextTypes} from '../enums/page-context-types';
import {UserPreferencesService} from './user-preferences.service';
import {UserProfile} from 'app/core/models/user-profile';

/**
 * A service to keep track of the currently logged in user
 */
@Injectable()
export class UserProfileService {

  /**
   * A default response when receiving bad data or an error when updating customer visibility
   */
  private static readonly DEFAULT_CUSTOMER_VISIBILITY_RESPONSE: Observable<any> = Observable.of({
    responseMessage: 'Error'
  });

  /**
   * Private store of the current user to reduce calls to api to retrieve the user profile.
   */
  private _currentUser: UserProfile;

  /**
   * Creates the user profile service
   * @param {AuthorizationService} _authorizationService
   * @param {HttpClient} _http
   * @param {UserPreferencesService} _userPreferencesService
   */
  constructor(private _authorizationService: AuthorizationService,
              private _http: HttpClient,
              private _userPreferencesService: UserPreferencesService) {
  }

  /**
   * Adds a customer to the current user's profile
   */
  public addCustomerToCurrentUser(customerNumber: number): Observable<any> {
    const metnetId = this._currentUser.metnetId;
    const url = `/users/${metnetId}/profile/customers/${customerNumber}/?hidden=false`;
    return this._http.put(url, null).catch(() => this._handleErrorCustomerVisibility());
  }

  /**
   * Creates a new user preference model
   */
  public generateUserPreference(sortOption: ISortOption, pageContext: PageContextTypes, editDisplayCount: number = 0): IUserPreference {
    return this._userPreferencesService.generateUserPreference(sortOption, pageContext, editDisplayCount);
  }

  /**
   * Method to return the current user's access roles.
   */
  public getRoles(): IAccessRole[] {
    const currentUser = this._currentUser;
    if (isNil(currentUser)) {
      return [];
    }
    return currentUser.userRoles;
  }

  /**
   * This method returns a user preference object from the user profile user preferences collection for a particular page
   */
  public getUserPreferenceForPage(pageContext: PageContextTypes): IUserPreference {
    const currentUser = this._currentUser;
    if (isNil(currentUser)) {
      return <IUserPreference>{};
    }

    const userPreferences = currentUser.userPreferences;
    if (isNil(userPreferences)) {
      return <IUserPreference>{};
    }

    return userPreferences.find(p => p.pageName === pageContext);
  }

  /**
   * This method sends user preferences for a page to the backend api and updates them on the current user's user preferences collection
   */
  public saveUserPreference(userPreference: IUserPreference): Observable<any> {
    this._currentUser.userPreferences = this._userPreferencesService.updateUserPreferences(this._currentUser, userPreference);
    return this._userPreferencesService.saveUserPreference(this._currentUser, userPreference);
  }

  /**
   * This method updates the hidden status of a customer for a user
   */
  public updateCustomerVisibility(customer: ICustomer): Observable<any> {
    const metnetId = this._currentUser.metnetId;
    const customerNumber = customer.customerNumber;
    const hiddenStatus = customer.hiddenStatus;

    const url = `/users/${metnetId}/profile/customers/${customerNumber}/?hidden=${hiddenStatus}`;
    return this._http.put(url, null).catch(() => this._handleErrorCustomerVisibility());
  }

  /**
   * This method returns the user profile for the current user
   */
  public getCurrentUserProfile(): UserProfile {
    return this._currentUser;
  }

  /**
   * Method to return the logged in user's profile.
   *
   * If profile is undefined, we make a request to retrieve the user profile from REST API.
   *
   * NOTE: We're returning a promise for this method because the APP_INITIALIZER only accept promises as return value.
   *
   * TODO: The 'metnetId' param is currently optional because it has yet to be determined if API requires that information in request.
   *
   * @param {string} metnetId
   * @returns {Promise<UserProfile>}
   */
  public getUserProfile(metnetId?: string): Promise<UserProfile> {
    if (isNil(metnetId) || metnetId === '') {
      return new Promise<UserProfile>(resolve => {
        resolve(null);
      });
    }

    const url = `/users/${metnetId}/profile/`;
    return this._http.get(url)
      .toPromise()
      .then(response => {
        this._currentUser = this._createUserProfile(response);
        return this._currentUser;
      })
      .catch(() => {
        return null;
      });
  }

  /**
   * Create user profile from the service's response
   */
  private _createUserProfile(response: any): UserProfile {
    let currentUser = new UserProfile(response);
    if (!this._authorizationService.isUserAuthorized(currentUser)) {
      return null;
    }
    currentUser.userPreferences = this._userPreferencesService.initializeUserPreferences(currentUser);
    return currentUser;
  }

  /**
   * Handles error when updating customer visibility
   */
  private _handleErrorCustomerVisibility(): Observable<any> {
    return UserProfileService.DEFAULT_CUSTOMER_VISIBILITY_RESPONSE;
  }
}
