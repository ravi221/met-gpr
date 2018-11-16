import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {PlanDataService} from '../../plan/plan-shared/services/plan-data.service';
import {Observable} from 'rxjs/Observable';
import {IPlan} from '../../plan/plan-shared/interfaces/iPlan';

/**
 * Resolves a plan prior to navigating to a particular route.
 */
@Injectable()
export class PlanResolverService implements Resolve<IPlan> {

  /**
   * Creates the plan resolver service, used to get plans based on the route
   * @param {PlanDataService} _dataService
   */
  constructor(private _dataService: PlanDataService) {
  }

  /**
   * Fetches a given plan by using the current route's params.
   * @param {ActivatedRouteSnapshot} route: The current activated route.
   * @param {RouterStateSnapshot} state: The router state.
   * @returns {Observable<IPlan>}: An observable that's accessed via {@link Router} data object.
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPlan> {
    return this._dataService.getPlanById(route.params.planId)
      .map((response: IPlan) => response);
  }
}
