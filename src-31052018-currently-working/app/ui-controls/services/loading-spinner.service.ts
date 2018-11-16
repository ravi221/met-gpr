import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {AnimationState} from '../animations/AnimationState';

/**
 * A service to show and hide a loading spinner
 */
@Injectable()
export class LoadingSpinnerService {

  /**
   * Indicates if to show the loading spinner
   * @type {Subject<boolean>}
   * @private
   */
  private _loadingSpinnerState: Subject<AnimationState> = new Subject<AnimationState>();

  /**
   * The default constructor.
   */
  constructor() {

  }

  /**
   * Toggles the spinner to show in the UI
   */
  public show(): void {
    this._loadingSpinnerState.next(AnimationState.VISIBLE);
  }

  /**
   * Toggles the spinner to hide in the UI
   */
  public hide(): void {
    this._loadingSpinnerState.next(AnimationState.HIDDEN);
  }

  /**
   * Gets an observable to see whether to show or hide the loading spinner
   * @returns {Observable<boolean>}
   */
  get visibility$(): Observable<AnimationState> {
    return this._loadingSpinnerState.asObservable()
      .distinctUntilChanged()
      .debounceTime(175);
  }
}
