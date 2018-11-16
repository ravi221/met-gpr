import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBreadcrumb} from '../../interfaces/iBreadcrumb';
import {NavigatorService} from '../../services/navigator.service';
import {INavState} from '../../interfaces/iNavState';
import {Observable} from 'rxjs/Observable';
import {BreadcrumbService} from '../../services/breadcrumb.service';

/**
 * Breadcrumb component to present current trail of routes user has taken.
 * Subscribes to {@link NavigatorService} to retrieve current route information.
 * This component was implemented to be specific to GPR as it relies on navigator service.
 * TODO: This component can be refactored to be more generic for better re-use.
 */
@Component({
  selector: 'gpr-breadcrumbs',
  template: `
    <div>
      <a (click)="onBreadcrumbClick(breadcrumb)"
         *ngFor="let breadcrumb of breadcrumbs">{{breadcrumb.label}}<span>/</span></a>
    </div>
  `,
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  /**
   * Collection of breadcrumbs
   * @type {Array}
   */
  public breadcrumbs: IBreadcrumb[] = [];

  /**
   * Creates the breadcrumbs component
   * @param {BreadcrumbService} _breadcrumbService
   * @param {NavigatorService} _navigator
   */
  constructor(private _breadcrumbService: BreadcrumbService,
              private _navigator: NavigatorService) {
  }

  /**
   * On init, subscribe to the navigation state
   */
  ngOnInit(): void {
    const navState = this._navigator.subscribe('breadcrumbs', (value: INavState) => {
      this.breadcrumbs = this._getBreadcrumbs(value);
    });
    this.breadcrumbs = this._getBreadcrumbs(navState);
  }

  /**
   * On destroy, unsubscribe from the navigation subscription
   */
  ngOnDestroy(): void {
    this._navigator.unsubscribe('breadcrumbs');
  }

  /**
   * Handle click event of breadcrumb.
   * Will navigate to selected crumb's path URL.
   * @param {IBreadcrumb} breadcrumb
   * @returns {Observable<boolean>}
   */
  public onBreadcrumbClick(breadcrumb: IBreadcrumb): Observable<boolean> {
    if (breadcrumb.onClick instanceof Function) {
      breadcrumb.onClick();
    }
    return this._navigator.goToUrl(breadcrumb.path);
  }

  /**
   * Gets new breadcrumbs based on the navigation state
   * @param {INavState} navState
   * @returns {IBreadcrumb[]}
   */
  private _getBreadcrumbs(navState: INavState): IBreadcrumb[] {
    return this._breadcrumbService.getBreadcrumbsFromNavState(navState);
  }
}
