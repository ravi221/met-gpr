import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ICustomerStructureRequest} from '../interfaces/iCustomerStructureRequest';
import {ICustomerStructure} from '../interfaces/iCustomerStructure';

/**
 * A customer data service that retrieves customer related information.
 */
@Injectable()
export class CustomerStructureDataService {

  /**
   * A default response when getting an error for a customer's structure information
   * @type {Array}
   */
  private static DEFAULT_RESPONSE: ICustomerStructure[] = [];

  /**
   * Creates the customer data service
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
  }

  /**
   * Gets structure information for a customer
   * @param {ICustomerStructureRequest} customerStructureRequest
   * @returns {Observable<ICustomerStructureResponse>}
   */
  public getStructure(customerStructureRequest: ICustomerStructureRequest): Observable<ICustomerStructure[]> {
    const url = this._buildUrl(customerStructureRequest);
    const params = this._mapRequestParams(customerStructureRequest);
    return this._http.get<ICustomerStructure[]>(url, {params})
      .map((response: any) => {
        return response.structures;
      })
      .catch(this._handleGetStructureError);
  }

  /**
   * Builds the url for the structure request
   * @param {ICustomerStructureRequest} customerStructureRequest
   * @returns {string}
   * @private
   */
  private _buildUrl(customerStructureRequest: ICustomerStructureRequest): string {
    const customerNumber = customerStructureRequest.customerNumber;
    return `/customers/${customerNumber}/structure`;
  }

  /**
   * Maps the request params for getting structure information
   * @param {ICustomerStructureRequest} customerStructureRequest
   * @returns {HttpParams}
   * @private
   */
  private _mapRequestParams(customerStructureRequest: ICustomerStructureRequest): HttpParams {
    let httpParams = new HttpParams();

    const experience = customerStructureRequest.experience;
    if (experience) {
      httpParams = httpParams.set('experience', experience);
    }

    const report = customerStructureRequest.report;
    if (report) {
      httpParams = httpParams.set('report', report);
    }

    const subCode = customerStructureRequest.subCode;
    if (subCode) {
      httpParams = httpParams.set('subCode', subCode);
    }
    return httpParams;
  }

  /**
   * Private method to handle error/caught exceptions from observable.
   * @returns {ErrorObservable}
   */
  private _handleGetStructureError(): Observable<ICustomerStructure[]> {
    return Observable.of(CustomerStructureDataService.DEFAULT_RESPONSE);
  }
}
