import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IPlan} from '../interfaces/iPlan';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {ISortOption} from '../../../core/interfaces/iSortOption';
import {IPlanCopyResponse} from 'app/plan/interfaces/iPlanCopyResponse';
import {IPlanCopyRequest} from 'app/plan/interfaces/iPlanCopyRequest';
import {ICreatePlanRequest} from 'app/plan/interfaces/iCreatePlanRequest';
import {ICreatePlanResponse} from 'app/plan/interfaces/iCreatePlanResponse';
import {PlanErrors} from 'app/plan/enums/plan-errors';
import {IPlanRequest} from '../../../customer/interfaces/iPlanRequest';
import {IPlanResponse} from '../../interfaces/iPlanReponse';
import {PagingService} from 'app/ui-controls/services/paging.service';
import {IPaging} from 'app/customer/interfaces/iPaging';
import {IPlanInputTemplate} from 'app/plan/interfaces/iPlanInputTemplate';
import {isNil} from 'lodash';
import {ResponseCodes} from '../../../core/enums/response-codes';
import {IPlanStatusUpdateResponse} from 'app/plan/interfaces/iPlanStatusUpdateResponse';
import {PlanAction} from '../../enums/plan-action';

/**
 * Data service class for all plan related API calls.
 * PlanDataService is available as an injectable class, with methods to fetch/post data for a particular plan within GPR.
 * Each request method has multiple signatures, and the return type varies according to which signature is called.
 */
@Injectable()
export class PlanDataService {

  /**
   * A list of all the sort options for a plan
   * @type {[ISortOption , ISortOption , ISortOption , ISortOption]}
   */
  static readonly PLAN_SORT_OPTIONS: ISortOption[] = [
    {label: 'Plan Name', sortBy: 'planName', sortAsc: true, active: false},
    {label: 'Plan Status', sortBy: 'completionPercentage', sortAsc: true, active: false},
    {label: 'Effective Date', sortBy: 'effectiveDate', sortAsc: true, active: false},
    {label: 'Last Updated', sortBy: 'lastUpdatedTimestamp', sortAsc: true, active: true},
    {label: 'Flags', sortBy: 'flagsCount', sortAsc: true, active: false}
  ];

  /**
   * The default sort options for plans on Navigation Menu
   * @type {[ISortOption , ISortOption , ISortOption , ISortOption]}
   */
  static readonly DEFAULT_NAV_MENU_SORT_OPTIONS: ISortOption[] = [
    <ISortOption>{label: 'A-Z', sortBy: 'planName', sortAsc: true, active: true},
    <ISortOption>{label: 'Completion', sortBy: 'completionPercentage', sortAsc: true, active: false},
    <ISortOption>{label: 'Effective Date', sortBy: 'effectiveDate', sortAsc: true, active: false},
    <ISortOption>{label: 'Product', sortBy: 'product', sortAsc: true, active: false},
  ];

  /**
   * The default sort to perform
   * @type {ISortOption}
   */
  static readonly DEFAULT_SORT: ISortOption = PlanDataService.PLAN_SORT_OPTIONS[3];

  /**
   * The default plans returned in case of a bad response
   */
  static readonly NO_PLAN_RESULTS: IPlanResponse = {
    page: 1,
    pageSize: 10,
    plans: [],
    totalCount: 0
  };

  /**
   * The default page to retrieve
   * @type {number}
   */
  static readonly DEFAULT_PAGE: number = 1;

  /**
   * The default page size to retrieve
   * @type {number}
   */
  static readonly DEFAULT_PAGE_SIZE: number = 10;

  /**
   * Creates the plan data service
   * @param {HttpClient} _http
   * @param {PagingService} _pagingService
   */
  constructor(private _http: HttpClient,
    private _pagingService: PagingService) {
  }

  /**
   * Searches for plans given a plan request
   * @param {IPlanRequest} planRequest
   * @param {IPaging} paging
   */
  public searchPlans(planRequest: IPlanRequest, paging?: IPaging): Observable<IPlanResponse> {
    const params: HttpParams = this._mapSearchPlansRequestParams(planRequest, paging);
    const customerNumber = planRequest.customerNumber;
    const url = `/customers/${customerNumber}/plans/filter`;
    return this._http.get<IPlanResponse>(url, {params})
      .map((response: any) => {
        if (!response.objects) {
          return PlanDataService.NO_PLAN_RESULTS;
        }
        return {
          page: response.page,
          pageSize: response.pageSize,
          totalCount: response.totalCount,
          plans: response.objects
        };
      });
  }

  /**
   * Maps the plan request object to http params
   * @returns {HttpParams}
   */
  private _mapSearchPlansRequestParams(planRequest: IPlanRequest, paging?: IPaging): HttpParams {
    const page = paging ? this._pagingService.getNextPageNumber(paging) : planRequest.page;

    let httpParams = new HttpParams()
      .set('page', `${page}`)
      .set('pageSize', `${planRequest.pageSize}`)
      .set('sortBy', `${planRequest.sortBy}`)
      .set('sortAsc', `${planRequest.sortAsc}`);

    const coverages = planRequest.coverages;
    if (coverages && coverages.length > 0) {
      const coverageIds = planRequest.coverages.map(c => c.coverageId).join(',');
      httpParams = httpParams.set('coverageIds', coverageIds);
    }

    const planName = planRequest.planName;
    if (planName) {
      httpParams = httpParams.set('planName', planName);
    }

    const planIds = planRequest.planIds;
    if (planIds && planIds.length > 0) {
      httpParams = httpParams.set('planIds', planIds.join(','));
    }
    return httpParams;
  }

  /**
   * Fetches a plan by it's unique id.
   * @param {string} planId: The unique id of the plan.
   * @returns {Observable<IPlan>}
   */
  public getPlanById(planId: string): Observable<IPlan> {
    const url = `/plans/${planId}/summary`;
    return this._http.get<IPlan>(url)
      .map((response: any) => {
        let categories = response.categories;
        categories.sort((n1, n2) => {
          n1.sections.sort((a, b) => {
            return a.order - b.order;
          });
          n2.sections.sort((a, b) => {
            return a.order - b.order;
          });
          return n1.order - n2.order;
        });
        if (!response.categories.length) {
          throw new Error(`No categories found for requested ID`);
        }
        return response;
      });
  }

  /**
   * Deletes a plan by it's unique id.
   * @param {string} planId: The unique id of the plan.
   * @param payload: The plan data to update.
   * @returns {Observable<any>}
   */
  public deletePlan(planId: string, payload?: any): Observable<any> {
    const url = `/plans/${planId}/delete`;
    return this._http.delete(url, payload)
      .map((response: any) => {
        if (!this._isSuccessfulResponse(response)) {
          return this._handleError(response);
        }
        return response;
      }).catch(this._handleError);
  }


  /**
   * Cancel a plan by it's unique id.
   * @param {string} planId: The unique id of the plan.
   * @param payload: The plan data to update.
   * @returns {Observable<any>}
   */
  public cancelPlan(planId: string, payload?: any): Observable<any> {
    const url = `/plans/${planId}/cancel`;
    return this._http.put(url, payload)
      .map((response: HttpResponse<any>) => {
        if (!this._isSuccessfulResponse(response)) {
          return this._handleError(response);
        }
        return response;
      }).catch(this._handleError);
  }

  /**
   * Terminate a plan by it's unique id.
   * @param {string} planId: The unique id of the plan.
   * @param {Date} terminationDate
   * @returns {Observable<any>}
   */
  public terminatePlan(planId: string, terminationDate: Date): Observable<any> {
    const hasInvalidTerminateParams = this._validateTerminateParams(planId, terminationDate);
    if (hasInvalidTerminateParams) {
      return Observable.throw(<IPlanStatusUpdateResponse>{
        planId: planId,
        responseMessage: hasInvalidTerminateParams,
        planAction: PlanAction.TERMINATE
      });
    }
    const url = `/plans/terminate`;
    const reqBody = {
      planId: planId,
      terminationDate: terminationDate
    };
    return this._http.put(url, JSON.stringify(reqBody))
      .map((response: HttpResponse<any>) => {
        if (!this._isSuccessfulResponse(response)) {
          return this._handleError(response);
        }
        return response;
      }).catch(this._handleError);
  }

  /**
   * Service call to copy plan from one customer to another
   * @param plan plan to copy
   * @param customerNumber customer number to copy plan to
   */
  public copyPlan(plan: IPlan, customerNumber: number): Observable<IPlanCopyResponse> {
    const val = this._validateCopyPlanParams(plan, customerNumber);
    if (val) {
      return Observable.throw(<IPlanCopyResponse>{
        responseMessage: val
      });
    }
    const url = `/plans/${plan.planId}/copy`;
    let payload = <IPlanCopyRequest>{
      planName: plan.planName,
      effectiveDate: plan.effectiveDate,
      customerNumber: customerNumber
    };
    return this._http.post(url, payload)
      .map((response: any) => {
        if (!this._isSuccessfulResponse(response)) {
          return this._handleError(response.statusText);
        }
        const resp = this._getCopyResponse(response);
        return resp;
      }).catch(this._handleError);
  }

  /**
   * Service call to export plan
   * @param plan plan to export
   * @returns {Observable<any>}
   */
  public exportPlan(plan: IPlan): Observable<any> {
    const url = `/plans/${plan.planId}/export`;
    return this._http.get(url, {
      headers: {
        'Content-Type': 'application/pdf',
        'Accept': 'application/pdf'
      },
      responseType: 'blob',
      observe: 'response'
    }).map((response: HttpResponse<any>) => {
      if (!this._isSuccessfulResponse(response)) {
        return this._handleError(response.statusText);
      }
      return response;
    }).catch(this._handleError);
  }

  /**
   * Creates a new plan given a create plan request
   * @param {ICreatePlanRequest} createPlanRequest
   * @returns {Observable<ICreatePlanResponse>}
   */
  public createPlan(createPlanRequest: ICreatePlanRequest): Observable<ICreatePlanResponse> {
    const url = '/plans';
    return this._http.post(url, createPlanRequest)
      .map((response: HttpResponse<any>) => {
        if (!(response['responseCode'] === 'SUCCESS')) {
          return this._handleError(response.statusText);
        }
        const body = response;
        return body;
      }).catch(this._handleError);
  }

  /**
   * Method used to ensure all required parameters are present before trying to copy a plan
   * @param plan plan to validate
   * @param customerNumber customerNumber to validate
   */
  private _validateCopyPlanParams(plan: IPlan, customerNumber: number): string {
    if (isNil(plan)) {
      return PlanErrors.EMPTY_PLAN;
    } else if (isNil(plan.planName)) {
      return PlanErrors.EMPTY_PLAN_NAME;
    } else if (isNil(plan.planId)) {
      return PlanErrors.EMPTY_PLAN_ID;
    } else if (isNil(plan.effectiveDate)) {
      return PlanErrors.EMPTY_EFFECTIVE_DATE;
    } else if (isNil(customerNumber)) {
      return PlanErrors.EMPTY_CUSTOMER_ID;
    } else {
      return null;
    }
  }
  /**
   * Method to validate required fields for plan terminate call
   * @param {string} planId
   * @param {Date} terminationDate
   */
  private _validateTerminateParams(planId: string, terminationDate: Date): string {
    if (isNil(planId)) {
      return PlanErrors.EMPTY_PLAN_ID;
    }
    if (isNil(terminationDate)) {
      return PlanErrors.EMPTY_TERMINATION_DATE;
    }
    return null;
  }

  /**
   * Private method to handle error/caught exceptions from observable.
   * @param error
   * @returns {ErrorObservable}
   */
  private _handleError(error: any) {
    if (error && error.constructor && error.constructor.name === 'String') {
      return Observable.throw(error);
    }
    const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'An error occurred processing this request.';
    return Observable.throw(errMsg);
  }

  /**
   * Method translates HTML response to IPlanCopyResponse
   * @param response reponse to convert to IPlanCopyResponse
   */
  private _getCopyResponse(response: any): IPlanCopyResponse {
    let copyRes: IPlanCopyResponse = {};

    if (!isNil(response)) {
      copyRes.planId = response.planId;
      copyRes.customerNumber = response.customerNumber;
      copyRes.planName = response.planName;
      copyRes.responseMessage = response.responseMessage;
    }

    return copyRes;
  }
  /**
   * Method checks if response from service was valid
   * @param response response to validate
   */
  private _isSuccessfulResponse(response: any): boolean {
    if (!isNil(response)) {
      if (!isNil(response.headers) && response.headers.get('Content-Type') === 'application/pdf' &&
        response.status === 200) {
        return true;
      } else if (!isNil(response.responseMessage) &&
        response.responseMessage.toUpperCase() === ResponseCodes.SUCCESS) {
        return true;
      } else if (!isNil(response.responseCode) &&
        response.responseCode.toUpperCase() === ResponseCodes.SUCCESS) {
        return true;
      }
    }
    return false;
  }
}
