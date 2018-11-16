import {Observable} from 'rxjs/Observable';
import {IHistoryRequestParam} from '../interfaces/iHistoryRequestParam';
import {IHistoricalPlan} from '../interfaces/iHistoricalPlan';
import {HttpClient} from '@angular/common/http';
import { contextFlagResponse } from 'assets/test/common-objects/flags.mock';

/**
 * Mock History service.
 */

export class MockHistoryService {

  /**
   * Retrieves a list of plans and their containing flags based on a specific customer number
   *
   * @param {IHistoryRequestParam} historyRequest
   * @returns {Observable<IHistoricalPlan>}
   */
  public getPublishedHistory(historyRequest: IHistoryRequestParam): Observable<IHistoricalPlan[]> {
    return Observable.of();
  }

  /**
   * Function called to notify observers that the toggle all comments button state has been updated
   */
  public toggleAllComments() {
    return Observable.of(contextFlagResponse);
  }

  /**
   * Gets an observable which fires whenever the toggle all comments button has been clicked
   * @returns {Observable<boolean>}
   */
  get toggleAllComments$() {
    return Observable.of([]);
  }
}



