import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

/**
 * A mock of {@link MassUpdateDataService}
 */
@Injectable()
export class MassUpdateDataServiceMock  {
  private _SAVE_TIME_MS: number = 1000;
 save(planId: string, payload: any): Observable<any> {
    return Observable.interval(this._SAVE_TIME_MS);
  }
  public canSave(): boolean {
    return true;
  }
}
