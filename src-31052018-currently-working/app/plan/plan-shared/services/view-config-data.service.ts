import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import FormConfig from '../../../dynamic-form/config/form-config';
import {HttpClient} from '@angular/common/http';

/**
* View config data service class to retrieve view configurations related to a plan.
* ViewConfigDataService is available as an injectable class, with methods to fetch view metadata for a particular plan within GPR.
* Each request method has multiple signatures, and the return type varies according to which signature is called.
*/
@Injectable()
export class ViewConfigDataService {
  /**
  * Creates the view config data service
  * @param {HttpClient} _http
  */
  constructor(private _http: HttpClient) {
  }

  /**
   * Fetches a view configuration for a particular coverage.
   * @param {string} ppcModelName: The model to look up the view metadata by.
   * @param {string} ppcVersion: the version of the metadata
   * @returns {Observable<FormConfig>}
   */
  public getViewByPPCModel(ppcModelName: string, ppcVersion: string): Observable<FormConfig> {
    const url = `/metadata/${ppcModelName}/${ppcVersion}`;
    return this._http.get<FormConfig>(url)
      .map((response) => {
        return new FormConfig(response);
      });
  }

  /**
   * Fetches a view configuration for a particular coverage and category.
   * @param {string} ppcModelName: The coverage id to look up the view metadata by.
   * @param {string} ppcVersion: The version fo the model
   * @param {string} categoryId: The category to filter on.
   * @returns {Observable<FormConfig>}
   */
  public getViewByCategory(ppcModelName: string, ppcVersion: string, categoryId: string): Observable<FormConfig> {
    const url = `/metadata/${ppcModelName}/${ppcVersion}`;
    return this._http.get<FormConfig>(url)
      .map((response: any) => {
      response.categories = response.categories.filter((c) => c.categoryId === categoryId);
      if (!response.categories.length) {
        throw new Error(`No categories found for requested ID - ${categoryId}`);
      }
      return new FormConfig(response);
    });
  }
}
