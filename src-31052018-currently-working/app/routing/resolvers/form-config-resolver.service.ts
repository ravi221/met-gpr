import FormConfig from '../../dynamic-form/config/form-config';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {IPlan} from '../../plan/plan-shared/interfaces/iPlan';
import {Observable} from 'rxjs/Observable';
import {PlanDataService} from '../../plan/plan-shared/services/plan-data.service';
import {ViewConfigDataService} from '../../plan/plan-shared/services/view-config-data.service';

/**
 * A resolver to get the page access type when editing on Plan Data Entry
 */
@Injectable()
export class FormConfigResolverService implements Resolve<FormConfig> {

  /**
   * Get the Plan data service and the User profile service when instantiating the resolver
   */
  constructor(private _planDataService: PlanDataService,
              private _viewConfigDataService: ViewConfigDataService) {}

  /**
   * The resolve function to get the PageAccessType based on the current user's roles
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FormConfig> {
    const planId = route.params.planId;
    const categoryId = route.params.categoryId;
    const planRequest$ = this._planDataService.getPlanById(planId);
    return planRequest$.flatMap((plan: IPlan) => {
      const ppcModelName = plan.ppcModelName;
      const ppcModelVersion = plan.ppcModelVersion;
      return this._viewConfigDataService.getViewByCategory(ppcModelName, ppcModelVersion, categoryId)
        .map((response => response));
    });
  }
}
