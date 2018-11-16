import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {IPlanCategoryData} from '../interfaces/iPlanCategoryData';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {PageAccessService} from '../../../core/services/page-access.service';
import {DataEntryService} from '../../plan-shared/abstract-service/data-entry.service';

/**
 * gets data related to specific categories. Associated with data entry screen.
 */
@Injectable()
export class PlanDataEntryService extends DataEntryService {

  /**
   * Creates the plan data service
   * @param {HttpClient} _http
   */
  constructor( _http: HttpClient,  _userProfileService: UserProfileService,  _pageAccessService: PageAccessService) {
    super(_http, _userProfileService, _pageAccessService);
  }

  /**
   * Gets plan data for a specific plan
   * @param {string} planId
   * @param {string} category
   * @returns {Observable<ErrorObservable | any>}
   */
  public getPlanCategoryData(planId: string, category: string): Observable<ErrorObservable | IPlanCategoryData> {
    const url = `/plans/${planId}/categories/${category}`;
    return this._http.get<any>(url)
      .map((response) => <IPlanCategoryData>response)
      .catch(this._handleError);
  }

  /**
   * Updates a plan by it's unique id.
   * @param {string} planId: The unique id of the plan.
   * @param {any} payload: The plan data to update.
   * @returns {Observable<any>}
   */
  public save(planId: string, payload: any): Observable<any> {
    const url = `/plans/${planId}`;
    return this._http.put(url, payload)
      .map((response: any) => {
        return response;
      })
      .catch(this._handleError);
  }
}
