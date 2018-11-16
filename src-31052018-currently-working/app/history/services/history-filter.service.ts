import {IHistoryFilter} from '../interfaces/iHistoryFilter';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

/**
 * A service to pass filters used in the history filter menu
 */
@Injectable()
export class HistoryFilterService {
  /**
   * Holds the current applied filters
   * @type {Subject<any>}
   * @private
   */
  private _filters: Subject<IHistoryFilter> = new Subject<IHistoryFilter>();

  /**
   * Gets an observable of the filters
   * @returns {Observable<any>}
   */
  public getFilters(): Observable<IHistoryFilter> {
    return this._filters.asObservable();
  }

  /**
   * Sets the filters
   * @param filters
   */
  public setFilters(filters: IHistoryFilter): void {
    this._filters.next(filters);
  }
}
