import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {PlanDataService} from '../../plan/plan-shared/services/plan-data.service';
import {Observable} from 'rxjs/Observable';
import {IPlan} from '../../plan/plan-shared/interfaces/iPlan';
import {IPPCResponse} from '../../plan/plan-shared/interfaces/iPPCResponse';
import {ValidatePlanService} from '../../plan/plan-shared/services/validate-plan.service';

/**
 * Resolves a plan prior to navigating to a particular route.
 */
@Injectable()
export class PPCValidationResolverService implements Resolve<IPPCResponse> {
  /**
   * Creates the ppc validation resolver service
   *
   * @param {PlanDataService} _planDataService
   * @param {ValidatePlanService} _validatePlanService
   */
  constructor(private _planDataService: PlanDataService,
              private _validatePlanService: ValidatePlanService) {
  }

  /**
   * Gets the current validation status for a given plan
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<IPPCResponse>}
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPPCResponse> {
    const planId = route.params.planId;
    const planRequest$ = this._planDataService.getPlanById(planId);
    return planRequest$.flatMap((plan: IPlan) => {
      return this._validatePlanService.validate(planId, plan.ppcModelName, plan.ppcModelVersion)
        .map((response => response));
    });
  }
}
