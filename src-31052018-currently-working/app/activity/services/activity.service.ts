import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IActivity} from 'app/activity/interfaces/iActivity';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';

/**
 * A service used for retrieving information regarding recent activity.
 */
@Injectable()
export class ActivityService {

  /**
   * Subject to alert any observers that new flags have been created
   * @type {Subject<any>}
   * @private
   */
  private _activityUpdated: Subject<void> = new Subject<void>();

  /**
   * Creates the activity service
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
  }

  /**
   * Gets latest activity data based on customer Number
   * @param {string} customerNumber
   * @param {string} planId
   * @returns {Observable<IActivity>}
   */
  public getRecentCustomerPlanUpdate(customerNumber: number, planId: string = ''): Observable<IActivity> {
    const url = `/customers/${customerNumber}/plan/recentUpdate`;
    const params = this._mapParams(planId);
    return this._http.get(url, {params})
      .catch(this._handleError);
  }

  /**
   * Gets recent customer plan updates
   * @param {IActivity} lastActivity
   * @returns {string}
   */
  public getRecentCustomerPlanUpdateMessage(lastActivity: IActivity): string {
    if (lastActivity.attribute) {
      return `${lastActivity.attribute} in ${lastActivity.planName} updated by `;
    }
    if (lastActivity.status) {
      return `${lastActivity.planName} ${lastActivity.status} by `;
    }
    return '';
  }

  /**
   * Notifies observers that the activity has been updated for a customer or plan
   */
  public update(): void {
    this._activityUpdated.next();
  }

  /**
   * An observable to watch if any updates have been made, used to recall route to get new activity
   * @returns {Observable<void>}
   */
  get update$(): Observable<void> {
    return this._activityUpdated.asObservable();
  }

  /**
   * Maps the plan request object to http params
   * @returns {HttpParams}
   */
  private _mapParams(planId: string = ''): HttpParams {
    if (planId.length === 0) {
      return new HttpParams();
    }
    return new HttpParams().set('planId', planId);
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
