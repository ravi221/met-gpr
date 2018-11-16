import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {UserProfileService} from '../../core/services/user-profile.service';
import {IPlanResponse} from '../../plan/interfaces/iPlanReponse';
import {IUserPreference} from '../../core/interfaces/iUserPreference';
import {PlanDataService} from '../../plan/plan-shared/services/plan-data.service';
import {PageContextTypes} from '../../core/enums/page-context-types';

/**
 * A resolver class for retrieving a plans for a given customer
 */
@Injectable()
export class CustomerPlansResolverService implements Resolve<IPlanResponse> {

  /**
   * Creates the resolver service to get a customer's plans for the {@link CustomerLandingComponent} before getting to
   * the page
   * @param {PlanDataService} _planDataService
   * @param {UserProfileService} _userProfileService
   */
  constructor(private _planDataService: PlanDataService,
              private _userProfileService: UserProfileService) {
  }

  /**
   * Fetches a customer by the specified customer number and adds this customer to the current user
   * @param {ActivatedRouteSnapshot} route: The current activated route.
   * @param {RouterStateSnapshot} state: The router state.
   * @returns {Observable<ICustomer>}: An observable that's accessed via {@link Router} data object.
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPlanResponse> {
    const customerNumber = parseInt(route.params.customerNumber);
    const userPreferences: IUserPreference = this._userProfileService.getUserPreferenceForPage(PageContextTypes.CUSTOMER_HOME);
    const planRequest = {
      customerNumber,
      sortBy: userPreferences.sortBy,
      sortAsc: userPreferences.sortAsc,
      page: PlanDataService.DEFAULT_PAGE,
      pageSize: PlanDataService.DEFAULT_PAGE_SIZE
    };
    return this._planDataService.searchPlans(planRequest);
  }
}
