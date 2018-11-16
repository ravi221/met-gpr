import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

/**
 * A service to help with the search bar
 */
@Injectable()
export class SearchBarService {

  /**
   * A subject to focus the search bar
   * @type {Subject<any>}
   */
  private _focus: Subject<any> = new Subject<any>();

  /**
   * Function called to focus the search bar
   */
  public focus(): void {
    this._focus.next();
  }

  /**
   * Gets an observable which fires whenever the search bar should focus
   * @returns {Observable<any>}
   */
  get focus$(): Observable<any> {
    return this._focus.asObservable();
  }
}
