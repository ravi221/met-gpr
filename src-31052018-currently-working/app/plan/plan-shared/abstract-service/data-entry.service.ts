import {UserProfile} from '../../../core/models/user-profile';
import {PageAccessType} from '../../../core/enums/page-access-type';
import {HttpClient} from '@angular/common/http';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {PageAccessService} from '../../../core/services/page-access.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {Observable} from 'rxjs/Observable';

export abstract class DataEntryService {

  /**
   * Creates the plan data service
   * @param {HttpClient} _http
   */
  constructor(protected _http: HttpClient, protected _userProfileService: UserProfileService, protected _pageAccessService: PageAccessService) {
  }

  /**
   * Updates a plan by it's unique id.
   * @param {string} planId: The unique id of the plan.
   * @param {any} payload: The plan data to update.
   * @returns {Observable<any>}
   */
  public abstract save(planId: string, payload: any): Observable<any>;

  /**
   * Checks if the current user is able to call save
   * @returns {boolean}
   */
  public canSave(): boolean {
    const currentUser: UserProfile = this._userProfileService.getCurrentUserProfile();
    const accessType = this._pageAccessService.getAccessType(currentUser.userRoles);
    const accessTypesAbleToSave = [PageAccessType.FULL_STANDARD_ACCESS, PageAccessType.SUPER_USER, PageAccessType.LIMITED_STANDARD_ACCESS];
    return accessTypesAbleToSave.includes(accessType);
  }

  /**
   * Private method to handle error/caught exceptions from observable.
   * @param error
   * @returns {ErrorObservable}
   */
  protected _handleError(error: any) {
    if (error && error.constructor && error.constructor.name === 'String') {
      return Observable.throw(error);
    }
    const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'An error occurred processing this request.';
    return Observable.throw(errMsg);
  }
}
