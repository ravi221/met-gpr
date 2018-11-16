import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PlanDataEntryServiceMock {

  private _SAVE_TIME_MS: number = 1000;
  /**
   * Updates a plan by it's unique id.
   * @param {string} planId: The unique id of the plan.
   * @param {any} payload: The plan data to update.
   * @returns {Observable<any>}
   */
  public save(planId: string, payload: any): Observable<any> {
    return Observable.interval(this._SAVE_TIME_MS);
  }

  public canSave(): boolean {
    return true;
  }
}
