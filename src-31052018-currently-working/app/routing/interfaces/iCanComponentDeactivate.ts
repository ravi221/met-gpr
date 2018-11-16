import {Observable} from 'rxjs/Observable';

/**
 * Used to determine if a component implements canDeactivate
 */
export interface ICanComponentDeactivate {

  /**
   * Override this method to implement a canDeactivateGuard
   * @returns {Observable<boolean> | Promise<boolean> | boolean}
   */
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
