import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import FormConfig from '../../dynamic-form/config/form-config';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {IHelpText} from '../interfaces/iHelpText';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

/**
 * Help data service is used to update help text for the formItems.
 */
@Injectable()
export class HelpDataService {

  /**
   * Creates the view config data service
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
  }

  /**
   * Fetches a view configuration for a particular coverage.
   * @param {IHelpText} helpText
   * @returns {Observable<FormConfig>}
   *
   */
  public updateHelpText(helpText: IHelpText): Observable<FormConfig> {
    const url = `/metadata/help`;
    return this._http.put(url, helpText )
      .map((response: any) => response)
      .catch(this._handleError);
        }


  /**
   * Private method to handle error/caught exceptions from observable.
   * @param error
   * @returns {ErrorObservable}
   */
  private _handleError(error: any): ErrorObservable {
    if (error && error.constructor && error.constructor.name === 'String') {
      return Observable.throw(error);
    }
    const errMsg: string = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'An unidentified error occurred. Time to debug!';
    return Observable.throw(errMsg);
  }
}
