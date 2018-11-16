import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {IHistoryRequestParam} from '../interfaces/iHistoryRequestParam';
import {IHistoricalPlan} from '../interfaces/iHistoricalPlan';
import {Subject} from 'rxjs/Subject';

/**
 * A service used for history.
 */
@Injectable()
export class HistoryService {

  /**
   * Subject to alert any observers that new flags have been created
   * @type {Subject<any>}
   * @private
   */
  private _toggleAllComments: Subject<boolean> = new Subject<boolean>();

  /**
   * Creates the flag service
   * @param {HttpClient} _http
   */

  /**
   * Creates the history service
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
  }

  /**
   * Retrieves a list of plans and their containing flags based on a specific customer number
   *
   * @param {IHistoryRequestParam} historyRequest
   * @returns {Observable<IHistoricalPlan>}
   */
  public getPublishedHistory(historyRequest: IHistoryRequestParam): Observable<IHistoricalPlan[]> {
    return this._http.get<IHistoricalPlan[]>('assets/test/history/historicalPlan.json', {headers: {'X-Mock-Request': ''}});
  }

  /**
   * Function called to notify observers that the toggle all comments button state has been updated
   */
  public toggleAllComments(showAllComments: boolean): void {
    this._toggleAllComments.next(showAllComments);
  }

  /**
   * Gets an observable which fires whenever the toggle all comments button has been clicked
   * @returns {Observable<boolean>}
   */
  get toggleAllComments$(): Observable<boolean> {
    return this._toggleAllComments.asObservable();
  }
}


