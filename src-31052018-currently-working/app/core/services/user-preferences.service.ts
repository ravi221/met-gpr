import {Injectable} from '@angular/core';
import {UserProfile} from '../models/user-profile';
import {IUserPreference} from '../interfaces/iUserPreference';
import {PageContextTypes} from '../enums/page-context-types';
import {SortOptionsService} from './sort-options.service';
import {ISortOption} from '../interfaces/iSortOption';
import {isNil} from 'lodash';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {SortByOption} from 'app/core/enums/sort-by-option';

/**
 * Helper class for getting a user's preferences
 */
@Injectable()
export class UserPreferencesService {

  /**
   * A list of default user preferences
   */
  public static defaultUserPreferences: IUserPreference[] = [
    {
      pageName: PageContextTypes.USER_HOME,
      sortBy: 'lastActivity',
      sortAsc: true,
      editDisplayCount: 0
    }, {
      pageName: PageContextTypes.CUSTOMER_HOME,
      sortBy: 'lastUpdatedTimestamp',
      sortAsc: true,
      editDisplayCount: 0
    }, {
      pageName: PageContextTypes.NAV_MENU_CUSTOMERS,
      sortBy: SortByOption.CUSTOMER_NAME,
      sortAsc: true,
      editDisplayCount: 0
    }, {
      pageName: PageContextTypes.NAV_MENU_PLANS,
      sortBy: SortByOption.EFFECTIVE_DATE,
      sortAsc: true,
      editDisplayCount: 0
    }
  ];

  /**
   * A map of  page context types to the allowable sort by options
   * @type {Map<PageContextTypes, string[]>}
   */
  private static validSortByValues: Map<PageContextTypes, string[]> = new Map<PageContextTypes, string[]>();

  /**
   * Creates the user preferences service, setting up the allowable sort by values for each page
   */
  constructor(private _http: HttpClient,
    private _sortOptionsService: SortOptionsService) {
    this._populateValidSortByValues(PageContextTypes.USER_HOME);
    this._populateValidSortByValues(PageContextTypes.CUSTOMER_HOME);
    this._populateValidSortByValues(PageContextTypes.NAV_MENU_CUSTOMERS);
    this._populateValidSortByValues(PageContextTypes.NAV_MENU_PLANS);
  }

  /**
   * Initializes a user's preferences based on the user passed in
   * @param {UserProfile} user
   * @returns {IUserPreference[]}
   */
  public initializeUserPreferences(user: UserProfile): IUserPreference[] {
    let newUserPreferences: IUserPreference[] = [];
    let userPreferences = [...user.userPreferences];

    const pageContexts = [PageContextTypes.USER_HOME, PageContextTypes.CUSTOMER_HOME, PageContextTypes.NAV_MENU_CUSTOMERS, PageContextTypes.NAV_MENU_PLANS];

    pageContexts.forEach((pageContext: PageContextTypes) => {
      const pageName = pageContext;
      let useDefaultPreference = false;
      let userPreference = userPreferences.find(u => u.pageName === pageName);
      if (isNil(userPreference)) {
        useDefaultPreference = true;
      } else {
        const isValidUserPreference = this._isValidUserPreference(pageContext, userPreference);
        if (!isValidUserPreference) {
          useDefaultPreference = true;
        }
      }

      if (useDefaultPreference) {
        userPreference = UserPreferencesService.defaultUserPreferences.find(p => p.pageName === pageContext);
      }
      if (!isNil(userPreference)) {
        newUserPreferences.push(userPreference);
      }
    });
    return newUserPreferences;
  }

  /**
   * Generates a new user preference
   */
  public generateUserPreference(sortOption: ISortOption, pageContext: PageContextTypes, editDisplayCount: number = 0): IUserPreference {
    return {
      sortBy: sortOption.sortBy,
      sortAsc: sortOption.sortAsc,
      pageName: pageContext,
      editDisplayCount
    };
  }

  /**
   * This method sends user preferences for a page to the backend api and updates them on the current user's user preferences collection
   * @param {UserProfile} user The user to update their user preferences for
   * @param {IUserPreference} userPreference Sent to backend api and updated on the user's user preferences collection
   * @returns {Observable<any>}
   */
  public saveUserPreference(user: UserProfile, userPreference: IUserPreference): Observable<any> {
    const metnetId = user.metnetId;
    const url = `/users/${metnetId}/profile/preference/`;
    return this._http.put<UserProfile>(url, userPreference)
      .catch(this._handleError);
  }

  /**
   * Updates a user's preferences
   * @param {UserProfile} user
   * @param {IUserPreference} userPreference
   */
  public updateUserPreferences(user: UserProfile, userPreference: IUserPreference): IUserPreference[] {
    const userPreferences = [...user.userPreferences];
    let preferenceIndex: number = userPreferences.findIndex(p => p.pageName === userPreference.pageName);
    if (preferenceIndex > -1) {
      userPreferences[preferenceIndex] = userPreference;
    } else {
      userPreferences.push(userPreference);
    }
    return userPreferences;
  }

  /**
   * Populates the valid sort by values for a specific page context
   * @param {PageContextTypes} pageContext
   * @private
   */
  private _populateValidSortByValues(pageContext: PageContextTypes): void {
    const validSortByValues = this._getValidSortByValues(pageContext);
    if (isNil(validSortByValues)) {
      return;
    }
    UserPreferencesService.validSortByValues.set(pageContext, validSortByValues);
  }

  /**
   * Gets valid sort by values based on the current page context
   * @param {PageContextTypes} pageContext
   * @returns {string[]}
   * @private
   */
  private _getValidSortByValues(pageContext: PageContextTypes): string[] {
    const sortOptions: ISortOption[] = this._sortOptionsService.getSortOptionsByPage(pageContext);
    return sortOptions.map(s => s.sortBy);
  }

  /**
   * Determines if the current user preference is valid
   * @param {PageContextTypes} pageContext
   * @param {IUserPreference} userPreference
   * @returns {boolean}
   * @private
   */
  private _isValidUserPreference(pageContext: PageContextTypes, userPreference: IUserPreference): boolean {
    const validSortByValues = UserPreferencesService.validSortByValues.get(pageContext);
    const sortByValue = userPreference.sortBy;
    return validSortByValues.includes(sortByValue);
  }

  /**
   * This method handles errors for calls to an api
   * @param error An error object or message or anything really
   */
  private _handleError(error: any): ErrorObservable {
    if (error && error.error) {
      return Observable.throw(error.error);
    }
    const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'An unidentified error occurred. Time to debug!';
    return Observable.throw(errMsg);
  }
}
