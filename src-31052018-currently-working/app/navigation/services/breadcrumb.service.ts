import {Injectable} from '@angular/core';
import {INavState} from '../interfaces/iNavState';
import {IBreadcrumb} from '../interfaces/iBreadcrumb';
import {CUSTOMER_PATTERN, PLAN_PATTERN} from '../models/route-patterns';
import {isNil} from 'lodash';

/**
 * A service to get the breadcrumbs based on the navigation state
 */
@Injectable()
export class BreadcrumbService {

  /**
   * Gets the bread crumbs based on the navigation state
   * @param {INavState} navState
   * @returns {IBreadcrumb[]}
   */
  public getBreadcrumbsFromNavState(navState: INavState): IBreadcrumb[] {
    if (isNil(navState)) {
      return [];
    }

    const initialCrumb: IBreadcrumb = {label: 'Home', path: '/'};
    let crumbs: IBreadcrumb[] = [initialCrumb];

    const segments: string[] = navState.url.split('/');
    const url: string = navState.url;

    const isCustomerRoute: boolean = CUSTOMER_PATTERN.test(url);
    if (isCustomerRoute) {
      const label: string = navState.data.customer.customerName;
      const path: string = segments.slice(1, 3).join('/');
      crumbs.push(this._createBreadcrumb(label, path));
    }

    const isPlanRoute: boolean = PLAN_PATTERN.test(url);
    if (isPlanRoute) {
      const label: string = navState.data.plan.planName;
      const path: string = segments.slice(1, 5).join('/');
      crumbs.push(this._createBreadcrumb(label, path));
    }
    return crumbs;
  }

  /**
   * Creates a breadcrumb with provided label, path, and optional onClick handler.
   * @param {string} label: The label to use for the crumb.
   * @param {string} path: The URL path associated with the crumb.
   * @param {any} onClick: An optional click handler to trigger upon selecting the crumb.
   * @returns {IBreadcrumb}
   */
  private _createBreadcrumb(label: string, path: string, onClick?: any): IBreadcrumb {
    return <IBreadcrumb>{label, path, onClick};
  }
}
