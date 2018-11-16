import {Params} from '@angular/router';
import {NavContextType} from '../enums/nav-context';

/**
 * Interface to describe the shape of the current route to be emitted by the {@link NavigatorService}.
 */
export interface INavState {
  /**
   * The current context that a particular route is associated with.
   */
  context: NavContextType;
  /**
   * The corresponding URL for a particular route.
   */
  url: string;
  /**
   * A map of matrix and query params defined for the current route.
   */
  params: Params;
  /**
   * Contains both static and resolved data for a route.
   */
  data: any;
}
