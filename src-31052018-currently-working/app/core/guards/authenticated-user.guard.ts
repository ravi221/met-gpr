import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthorizationService} from '../services/authorization.service';
import {Injectable} from '@angular/core';
import {UserProfileService} from '../services/user-profile.service';

/**
 * A guard to detect if the user has permissions to access the current page
 */
@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  /**
   * Default constructor
   * @param {AuthorizationService}_authenticationService Service used to authenticate a user
   * @param {UserProfileService} _userProfileService Service used to get current user
   */
  constructor(private _authenticationService: AuthorizationService,
              private _userProfileService: UserProfileService) {
  }

  /**
   * Call made to check if user is authorized to view a particular route
   * @param {ActivatedRouteSnapshot} route route trying to be accessed
   * @param {RouterStateSnapshot} state state of the route
   */
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this._userProfileService.getCurrentUserProfile();
    const allowedRoles = route.data.allowedRoles;
    const checkAllRoles = route.data.checkAllRoles;
    return this._authenticationService.hasAuthorizedRoles(currentUser, allowedRoles, checkAllRoles);
  }
}
