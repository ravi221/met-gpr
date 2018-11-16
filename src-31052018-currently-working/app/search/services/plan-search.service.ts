import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ISearchResults} from '../interfaces/iSearchResults';
import {ISearchPlanRequest} from '../interfaces/iSearchPlanRequest';
import {DateService} from '../../core/services/date.service';

/**
 * A service to searching for plans in global search. We are able to search by plan name and attribute name
 */
@Injectable()
export class PlanSearchService {

  /**
   * Creates the plan search service
   * @param {HttpClient} _http
   * @param {DateService} _dateService
   */
  constructor(private _http: HttpClient,
              private _dateService: DateService) {
  }

  /**
   * Searches for plans given a plan request
   * @param {ISearchPlanRequest} planRequest
   * @returns {Observable<ISearchResults>}
   */
  searchPlans(planRequest: ISearchPlanRequest): Observable<ISearchResults> {
    const customerNumber: number = planRequest.customerNumber;
    const url = `/customers/${customerNumber}/plans/search`;
    const params = this._mapRequestParams(planRequest);
    return this._http.get(url, {params})
      .map((response: any) => {
        return <ISearchResults>{
          results: response.objects,
          page: response.page,
          pageSize: response.pageSize,
          totalCount: response.totalCount
        };
      })
      .catch(this._handleError);
  }

  /**
   * Maps the search plan request to request parameters
   * @param {ISearchPlanRequest} planRequest
   * @returns {HttpParams}
   * @private
   */
  private _mapRequestParams(planRequest: ISearchPlanRequest): HttpParams {
    const searchKey = planRequest.searchKey;
    let searchCriteria = planRequest.searchCriteria;
    if (searchCriteria === 'planName') {
      const isDate = this._dateService.isDateFormat(searchKey);
      if (isDate) {
        searchCriteria = 'effectiveDate';
      }
    }

    return new HttpParams()
      .set('searchKey', searchKey)
      .set('searchCriteria', searchCriteria)
      .set('sortAsc', `${planRequest.sortAsc}`)
      .set('sortBy', planRequest.sortBy)
      .set('page', `${planRequest.page}`)
      .set('pageSize', `${planRequest.pageSize}`);
  }

  /**
   * Private method to handle error/caught exceptions from observable.
   * @param error
   * @returns {ErrorObservable}
   */
  private _handleError(error: any) {
    if (error && error.error) {
      return Observable.throw(error.error);
    }
    const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'An unidentified error occurred. Time to debug!';
    return Observable.throw(errMsg);
  }
}
