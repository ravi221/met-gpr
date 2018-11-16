import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isNil } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { join } from 'path';
import { IFlagsRequest } from '../interfaces/iFlagsRequest';
import { IFlagsResponse } from '../interfaces/iFlagsResponse';
import { IFlagResolveRequest } from '../interfaces/iFlagResolveRequest';
import { ISummaryFlagsRequest } from '../interfaces/iSummaryFlagsRequest';
import { ICreateFlagRequest } from '../interfaces/iCreateFlagRequest';
import { ISummaryFlagsResponse } from '../interfaces/iSummaryFlagsResponse';
import { FlagContextTypes } from 'app/flag/enums/flag-context-types';
import { PageAccessType } from 'app/core/enums/page-access-type';
import { ResponseCodes } from 'app/core/enums/response-codes';

/**
 * FlagService calls backend to retrieve list of flags
 */
@Injectable()
export class FlagService {

  /**
   * The flag cards heading depending on the current context
   */
  public static FLAGS_HEADINGS = {
    [FlagContextTypes.CUSTOMER]: 'Customer Flags',
    [FlagContextTypes.PLAN]: 'Plan Flags',
    [FlagContextTypes.CATEGORY]: 'Category Flags',
  };

  /**
   * Customer statuses that are not allowed for creating a new flag/comment
   * @type {[CustomerStatus]}
   */
  public static readonly DISALLOWED_PAGE_ACCESS_TYPES: PageAccessType[] = [
    PageAccessType.READ_ONLY
  ];

  /**
   * A message to display when there are not any flags for a customer, plan, or category
   */
  public static NO_FLAGS_MESSAGES = {
    [FlagContextTypes.CUSTOMER]: 'No flags for this customer',
    [FlagContextTypes.PLAN]: 'No flags for this plan',
    [FlagContextTypes.CATEGORY]: 'No flags for this category',
  };

  /**
   * The default response when getting flags, in case of error or bad data
   */
  private static DEFAULT_RESPONSE: ISummaryFlagsResponse = {
    totalFlagCount: 0,
    flags: []
  };

  /**
   * Subject to alert any observers that new flags have been created
   * @type {Subject<any>}
   * @private
   */
  private _flagsUpdated: Subject<void> = new Subject<void>();

  /**
   * Creates the flag service
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
  }

  /**
   * Retrieves a list of plans and their containing flags based on a specific customer number
   *
   * @param {IFlagRequest} flagRequest
   * @returns {Observable<any>}
   */
  public getPlansWithFlags(flagRequest: IFlagsRequest): Observable<any> {
    const isPayloadInvalid = this._validateFlagRequestParams(flagRequest);
    if (isPayloadInvalid) {
      return Observable.throw(isPayloadInvalid);
    }

    const params = this._mapRequestParams(flagRequest);
    const url = `/flags/`;
    return this._http.get(url, { params })
      .map((response: IFlagsResponse) => response)
      .catch(this._handleError);
  }

  /**
   * Maps the search plan request to request parameters
   * @param {IFlagsRequest} flagRequest
   * @returns {HttpParams}
   * @private
   */
  private _mapRequestParams(flagRequest: IFlagsRequest): HttpParams {
    let params = new HttpParams()
      .set('customerNumber', `${flagRequest.customerNumber}`);

    if (flagRequest.isResolved && flagRequest.isResolved !== '' && flagRequest.isResolved !== 'null') {
      params = params.set('isResolved', `${flagRequest.isResolved}`);
    }

    if (flagRequest.coverages && flagRequest.coverages.length > 0) {
      const coverageIds = flagRequest.coverages.map(c => c.coverageId).join(',');
      params = params.set('coverageId', coverageIds);
    }

    if (flagRequest.planId) {
      params = params.set('planId', `${flagRequest.planId}`);
    }

    if (flagRequest.planName) {
      params = params.set('planName', `${flagRequest.planName}`);
    }

    return params;
  }

  /**
   * Method used to ensure all required parameters are present before trying to copy a plan
   * @param customerNumber plan to validate
   * @param resolved customerNumber to validate
   */
  private _validateFlagRequestParams(flagRequest: IFlagsRequest): string {
    if (!flagRequest.customerNumber) {
      return 'Customer ID is required';
    }
  }

  /**
   * Function called to notify observers that flags have been updated
   */
  public update(): void {
    this._flagsUpdated.next();
  }

  /**
   * Gets an observable which fires whenever the flags have been updated
   * @returns {Observable<void>}
   */
  get update$(): Observable<void> {
    return this._flagsUpdated.asObservable();
  }

  /**
   * Maps the flag summary request object to http params
   * @returns {HttpParams}
   */
  private _mapFlagsSummaryRequestParams(flagRequest: ISummaryFlagsRequest): HttpParams {

    let httpParams = new HttpParams()
      .set('customerNumber', `${flagRequest.customerNumber}`);

    if (flagRequest.planId) {
      httpParams = httpParams.set('planId', flagRequest.planId);
    }

    if (flagRequest.categoryId) {
      httpParams = httpParams.set('categoryId', flagRequest.categoryId);
    }

    if (flagRequest.flagCount) {
      httpParams = httpParams.set('flagCount', `${flagRequest.flagCount}`);
    }

    return httpParams;
  }

  /**
   * Returns all the tags based on a specific parameter.
   * @param {FlagContextTypes} flagContext
   * @param {ISummaryFlagsRequest} flagRequest
   * @returns {Observable<ISummaryFlagsResponse>}
   */
  public getFlags(flagContext: FlagContextTypes, flagRequest: ISummaryFlagsRequest): Observable<ISummaryFlagsResponse> {
    const url = '/flags/summary';

    const params: HttpParams = this._mapFlagsSummaryRequestParams(flagRequest);
    return this._http.get<ISummaryFlagsResponse>(url, { params })
      .map(response => {
        const flags = response.flags;
        if (isNil(flags)) {
          return FlagService.DEFAULT_RESPONSE;
        }

        const totalFlagCount = response.totalFlagCount;
        if (isNil(totalFlagCount)) {
          return FlagService.DEFAULT_RESPONSE;
        }
        return <ISummaryFlagsResponse>{ totalFlagCount, flags };
      })
      .catch(this._handleError);
  }

  /**
   * Indicates if the user is able to add a plan
   * @param {PageAccessType} pageAccessType
   * @returns {boolean}
   */
  public canAddFlagComment(pageAccessType: PageAccessType): boolean {
    const canAccessPage = FlagService.DISALLOWED_PAGE_ACCESS_TYPES.includes(pageAccessType);
    return !canAccessPage;
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
   * resolve flag
   * @param {IResolveFlagsRequest} resolveFlagRequest
   */
  public resolveFlag(resolveFlagsRequest: IFlagResolveRequest): Observable<any> {

    if (!resolveFlagsRequest.planId) {
      return Observable.throw('Plan ID is required');
    }
    const url = `/flags/resolve`;
    return this._http.post(url, resolveFlagsRequest)
    .map((response: HttpResponse<any>) => {
      if (!(response['responseCode'] === 'SUCCESS')) {
        return this._handleError(response);
      }
    }).catch(this._handleError);
  }

  /**
   * posts in order to create a new flag
   * @param createFlagRequest
   * @param flagExists
   */
  public createFlag(createFlagRequest: ICreateFlagRequest, flagExists: boolean): Observable<any> {
    const url = '/flags/';
    return this._http.post(url, createFlagRequest)
      .map((response: HttpResponse<any>) => {
        if (!(response['responseCode'] === 'SUCCESS')) {
          return this._handleError('Error');
        }
        this.update();
        const body = response;
        return body;
      }).catch(this._handleError);
  }

}
