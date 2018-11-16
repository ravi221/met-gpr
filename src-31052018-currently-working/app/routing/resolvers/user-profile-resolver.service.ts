import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {UserProfile} from '../../core/models/user-profile';
import {UserProfileService} from '../../core/services/user-profile.service';

/**
 * A resolver class for retrieving a given customer.
 */
@Injectable()
export class UserProfileResolverService implements Resolve<UserProfile> {

  /**
   * Creates the user profile service, used to get a current user profile
   * @param {UserProfileService} _userProfileService
   */
  constructor(private _userProfileService: UserProfileService) {
  }

  /**
   * Fetches current user profile.
   * @param {ActivatedRouteSnapshot} route: The current activated route.
   * @param {RouterStateSnapshot} state: The router state.
   * @returns {UserProfile}: Current user profile.
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UserProfile {
    return this._userProfileService.getCurrentUserProfile();
  }
}
