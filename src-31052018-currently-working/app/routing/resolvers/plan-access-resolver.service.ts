import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {UserProfileService} from '../../core/services/user-profile.service';
import {UserProfile} from '../../core/models/user-profile';
import {PageAccessService} from '../../core/services/page-access.service';
import {PageAccessType} from '../../core/enums/page-access-type';

/**
 * A resolver to get the page access type when editing on Plan Data Entry
 */
@Injectable()
export class PlanAccessResolverService implements Resolve<PageAccessType> {

  /**
   * Get the Plan data service and the User profile service when instantiating the resolver
   * @param {UserProfileService} _userProfileService
   * @param {PageAccessService} _pageAccessService
   */
  constructor(private _userProfileService: UserProfileService,
              private _pageAccessService: PageAccessService) {}

  /**
   * The resolve function to get the PageAccessType based on the current user's roles
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {PageAccessType}
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PageAccessType {
    const currentUser: UserProfile = this._userProfileService.getCurrentUserProfile();
    return this._pageAccessService.getAccessType(currentUser.userRoles);
  }
}
