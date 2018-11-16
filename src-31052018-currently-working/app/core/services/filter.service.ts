import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

/**
 * A service to pass filters used in the filter menu
 */
@Injectable()
export class FilterService {
  /**
   * Holds the current applied filters
   * @type {Subject<any>}
   * @private
   */
  private _filters: Subject<any> = new Subject<any>();

  /**
   * Gets an observable of the filters
   * @returns {Observable<any>}
   */
  public getFilters(): Observable<any> {
    return this._filters.asObservable();
  }

  /**
   * Sets the filters
   * @param filters
   */
  public setFilters(filters: any): void {
    this._filters.next(filters);
  }
}
