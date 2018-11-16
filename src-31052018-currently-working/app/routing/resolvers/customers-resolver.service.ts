import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {CustomerDataService} from '../../customer/services/customer-data.service';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {ICustomers} from 'app/customer/interfaces/iCustomers';

/**
 * A resolver class for retrieving assigned customers for a user
 */
@Injectable()
export class CustomersResolverService implements Resolve<ICustomers> {

  /**
   * Creates the cases resolver service, used to get a user's customers
   * @param {CustomerDataService} _dataService
   * @param {UserProfileService} _userProfileService
   */
  constructor(private _dataService: CustomerDataService,
              private _userProfileService: UserProfileService) {
  }

  /**
   * Fetches the cases that's currently assigned to a user.
   * @param {ActivatedRouteSnapshot} route: The current activated route.
   * @param {RouterStateSnapshot} state: The router state.
   * @returns {Observable<ICustomer[]>}: An observable that's accessed via {@link Router} data object.
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICustomers> {
    let user = this._userProfileService.getCurrentUserProfile();
    return this._dataService.getCustomersForUser(user);
  }
}
