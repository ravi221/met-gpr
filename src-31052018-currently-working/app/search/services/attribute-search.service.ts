import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ISearchResults} from '../interfaces/iSearchResults';
import {ISearchAttributeDetailsRequest} from '../interfaces/iSearchAttributeDetailsRequest';

/**
 * A service to search for attributes
 */
@Injectable()
export class AttributeSearchService {

  /**
   * Creates the search attribute service
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
  }

  /**
   * Searches for attributes given a attribute details request
   * @param {ISearchAttributeDetailsRequest} attributeDetailsRequest
   * @returns {Observable<ISearchResults>}
   */
  searchAttributes(attributeDetailsRequest: ISearchAttributeDetailsRequest): Observable<ISearchResults> {
    const customerNumber = attributeDetailsRequest.customerNumber;
    const url = `/customers/${customerNumber}/plans/search/details`;
    const params = this._mapRequestParams(attributeDetailsRequest);
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
   * Creates the request when searching for attributes
   * @param {ISearchAttributeDetailsRequest} attributeDetailsRequest
   * @returns {HttpParams}
   * @private
   */
  private _mapRequestParams(attributeDetailsRequest: ISearchAttributeDetailsRequest): HttpParams {
    return new HttpParams()
      .set('model', `${attributeDetailsRequest.model}`)
      .set('attributeLabel', `${attributeDetailsRequest.attributeLabel}`)
      .set('planIds', `${attributeDetailsRequest.planIds}`)
      .set('page', `${attributeDetailsRequest.page}`)
      .set('pageSize', `${attributeDetailsRequest.pageSize}`)
      .set('sortBy', `${attributeDetailsRequest.sortBy}`)
      .set('sortAsc', `${attributeDetailsRequest.sortAsc}`);
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
