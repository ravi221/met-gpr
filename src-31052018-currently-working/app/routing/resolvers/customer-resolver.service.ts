import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {CustomerDataService} from '../../customer/services/customer-data.service';
import {UserProfileService} from '../../core/services/user-profile.service';

/**
 * A resolver class for retrieving a given customer.
 */
@Injectable()
export class CustomerResolverService implements Resolve<ICustomer> {

  /**
   * Creates the customer resolver service, used to get a customer based on the customer number in the route
   * and add the customer to the currently logged in user
   * @param {CustomerDataService} _customerDataService
   * @param {UserProfileService} _userProfileService
   */
  constructor(private _customerDataService: CustomerDataService,
              private _userProfileService: UserProfileService) {
  }

  /**
   * Fetches a customer by the specified customer number and adds this customer to the current user
   * @param {ActivatedRouteSnapshot} route: The current activated route.
   * @param {RouterStateSnapshot} state: The router state.
   * @returns {Observable<ICustomer>}: An observable that's accessed via {@link Router} data object.
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICustomer> {
    const customerNumber = parseInt(route.params.customerNumber);
    return Observable.forkJoin(
      this._customerDataService.getCustomer(customerNumber),
      this._userProfileService.addCustomerToCurrentUser(customerNumber)
    ).map(data => {
      return data[0];
    });
  }
}
