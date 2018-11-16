import {ICreatePlanRequest} from 'app/plan/interfaces/iCreatePlanRequest';
import {ICreatePlanResponse} from 'app/plan/interfaces/iCreatePlanResponse';
import {IPaging} from 'app/customer/interfaces/iPaging';
import {IPlanCopyResponse} from 'app/plan/interfaces/iPlanCopyResponse';
import {IPlanRequest} from '../../../customer/interfaces/iPlanRequest';
import {IPlanResponse} from '../../interfaces/iPlanReponse';
import {IPlan} from '../interfaces/iPlan';
import {Observable} from 'rxjs/Observable';

/**
 * A mock service for {@link PlanDataService}
 */
export class MockPlanDataService {
  constructor() {
  }

  public searchPlans(planRequest: IPlanRequest, paging?: IPaging): Observable<IPlanResponse> {
    return Observable.of(null);
  }

  public getPlanById(planId: string): Observable<IPlan> {
    return Observable.of(null);
  }

  public deletePlan(planId: string, payload?: any): Observable<any> {
    return Observable.of(null);
  }

  public cancelPlan(planId: string, payload?: any): Observable<any> {
    return Observable.of(null);
  }

  public terminatePlan(planId: string, terminationDate: Date): Observable<any> {
    return Observable.of(null);
  }

  public copyPlan(plan: IPlan, customerNumber: number): Observable<IPlanCopyResponse> {
    return Observable.of(null);
  }

  public exportPlan(plan: IPlan): Observable<any> {
    return Observable.of(null);
  }

  public createPlan(createPlanRequest: ICreatePlanRequest): Observable<ICreatePlanResponse> {
    return Observable.of(null);
  }
}
