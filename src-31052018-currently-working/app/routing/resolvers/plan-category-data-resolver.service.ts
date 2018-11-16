import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {IPlanCategoryData} from '../../plan/plan-data-entry/interfaces/iPlanCategoryData';
import {PlanDataEntryService} from '../../plan/plan-data-entry/services/plan-data-entry.service';

/**
 * Resolves plan data for a category prior to data entry
 */
@Injectable()
export class PlanCategoryDataResolverService implements Resolve<IPlanCategoryData> {

  /**
   * Creates the plan data resolver service, used to get plan data based on the route
   * @param {PlanDataEntryService} _dataService
   */
  constructor(private _dataService: PlanDataEntryService) {
  }

  /**
   * Fetches plan data based on its unique id and category
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<IPlanCategoryData>}
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPlanCategoryData> {
    return this._dataService.getPlanCategoryData(route.params.planId, route.params.categoryId)
      .map((response: any) => <IPlanCategoryData> response);
  }
}
