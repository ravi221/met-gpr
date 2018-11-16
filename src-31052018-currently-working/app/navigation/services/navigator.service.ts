import {
  ActivatedRoute, NavigationEnd, NavigationExtras, NavigationStart, Router, RouterEvent,
  UrlTree
} from '@angular/router';
import {INavState} from '../interfaces/iNavState';
import {Injectable, OnDestroy} from '@angular/core';
import {isNil} from 'lodash';
import {LoadingSpinnerService} from '../../ui-controls/services/loading-spinner.service';
import {NavContextType} from '../enums/nav-context';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {SubscriptionManager} from '../../core/utilities/subscription-manager';
import {Subscription} from 'rxjs/Subscription';

/**
 * Navigates to a particular view and maintains an internal state of current view to be observed upon.
 * NavigatorService is available as an injectable class, with methods to navigate to a particular view within GPR.
 * Each request method has multiple signatures, and the return type varies according to which signature is called.
 */
@Injectable()
export class NavigatorService implements OnDestroy {

  /**
   * Default observable when a navigation route should fail
   * @type {Observable<boolean>}
   */
  private static readonly NAVIGATION_FAIL: Observable<boolean> = Observable.of(false);

  /**
   * Object that holds the state of the current route.
   */
  private _navigationState: INavState;

  /**
   * Internal route subject to be emitted upon route changes.
   * @type {Subject<any>}
   */
  private _routeSubject: Subject<INavState> = new Subject();

  /**
   * Map of all current _subscriptions to route source.
   * @type {Map<string, Subscription>}
   */
  private _subscriptions: Map<string, Subscription> = new Map<string, Subscription>();

  /**
   * The subscription to the {@link Router} NavigationEnd event
   */
  private _routerSubscriptions: Subscription[] = [];

  /**
   * Constructs the initial state of the navigation state object and subscribes to the router's {@link NavigationEnd} event.
   * When this event is triggered, this class updates its internal navigation state and notify subscribers of change.
   * @param {Router} _router
   * @param {LoadingSpinnerService} _loadingSpinnerService
   */
  constructor(private _router: Router,
    private _loadingSpinnerService: LoadingSpinnerService) {
    this._navigationState = {
      context: NavContextType.DEFAULT,
      url: '',
      params: null,
      data: null
    };
    this._subscribeToNavigationStart();
    this._subscribeToNavigationEnd();
  }

  /**
   * On destroy, unsubscribe from the router and all held subscriptions
   */
  ngOnDestroy(): void {
    SubscriptionManager.massUnsubscribe(this._routerSubscriptions);
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this._subscriptions.clear();
  }

  /**
   * Navigate to customer landing page.
   * @param {number} customerNumber: The currently active customer number.
   * @param {NavigationExtras} options: The extra options used during navigation.
   * @returns {Observable<boolean>}
   *  - Returns an observed value that:
   *    - equals to 'true' when navigation succeeds,
   *    - equals to 'false' when navigation fails,
   *    - is rejected when an error happens.
   */
  public goToCustomerHome(customerNumber: number, options?: NavigationExtras): Observable<boolean> {
    return Observable.fromPromise(this._router.navigate(['customers', customerNumber], options));
  }

  /**
   * Navigate to customer information landing page.
   * @param {number} customerNumber: The currently active customer number.
   * @param {NavigationExtras} options: The extra options used during navigation.
   * @returns {Observable<boolean>}
   *  - Returns an observed value that:
   *    - equals to 'true' when navigation succeeds,
   *    - equals to 'false' when navigation fails,
   *    - is rejected when an error happens.
   */
  public goToCustomerInfoHome(customerNumber: number, options?: NavigationExtras): Observable<boolean> {
    return Observable.fromPromise(this._router.navigate(['customers', customerNumber, 'information'], options));
  }

  /**
   * Navigate to mass update landing page.
   * @param {number} customerNumber: The currently active customer number.
   * @param {NavigationExtras} options: The extra options used during navigation.
   * @returns {Observable<boolean>}
   *  - Returns an observed value that:
   *    - equals to 'true' when navigation succeeds,
   *    - equals to 'false' when navigation fails,
   *    - is rejected when an error happens.
   */
  public goToMassUpdateHome(customerNumber: number, options?: NavigationExtras): Observable<boolean> {
    return Observable.fromPromise(this._router.navigate(['customers', customerNumber, 'mass-update'], options));
  }


  getProductPlans(options?: NavigationExtras): Observable<boolean> {
    const customerNumber = this._navigationState.params.get('customerNumber');
    return Observable.fromPromise(this._router.navigate(['customers', customerNumber, 'mass-update'], options));
  }
  /**
   * Navigate to plan landing page.
   * @param {string} planId: The unique id of the plan.
   * @param {NavigationExtras} options: The extra options used during navigation.
   * @returns {Observable<boolean>}
   *  - Returns an observed value that:
   *    - equals to 'true' when navigation succeeds,
   *    - equals to 'false' when navigation fails,
   *    - is rejected when an error happens.
   */
  public goToPlanHome(planId: string, options?: NavigationExtras): Observable<boolean> {
    const customerNumber = this._navigationState.params.get('customerNumber');
    if (isNil(customerNumber)) {
      return NavigatorService.NAVIGATION_FAIL;
    }
    return this.goToCustomerPlanHome(planId, customerNumber, options);
  }

  /**
   * This also navigates to plan landing page from Home screen.  Customer Number is not available in the Navigation state params because
   * those appear to come from the active route which on the home screen does not have customer number.
   * @param planId: The unique id of the customer plan home
   * @param customerNumber: The unique identifier of the customer
   * @param options: The extra options used during navigation.
   */
  public goToCustomerPlanHome(planId: string, customerNumber: number, options?: NavigationExtras): Observable<boolean> {
    return Observable.fromPromise(this._router.navigate([
      'customers', customerNumber,
      'plans', planId
    ], options));
  }

  /**
   * Navigate to flag landing page.
   * @param {NavigationExtras} options: The extra options used during navigation.
   * @returns {Observable<boolean>}
   *  - Returns an observed value that:
   *    - equals to 'true' when navigation succeeds,
   *    - equals to 'false' when navigation fails,
   *    - is rejected when an error happens.
   */
  public goToFlagHome(options?: NavigationExtras): Observable<boolean> {
    const customerNumber = this._navigationState.params.get('customerNumber');
    if (isNil(customerNumber)) {
      return NavigatorService.NAVIGATION_FAIL;
    }
    const planId = this._navigationState.params.get('planId');
    if (!isNil(planId)) {
      return Observable.fromPromise(this._router.navigate([
        'customers', customerNumber,
        'plans', planId,
        'flags'
      ], options));
    }
    return Observable.fromPromise(this._router.navigate([
      'customers', customerNumber,
      'flags'
    ], options));
  }

  /**
   * Navigate to plan data entry page for a specified category.
   * @param {string} categoryId
   * @param {NavigationExtras} options
   * @returns {Observable<boolean>}
   */
  public goToPlanEntry(categoryId: string, options?: NavigationExtras): Observable<boolean> {
    const customerNumber = this._navigationState.params.get('customerNumber');
    if (isNil(customerNumber)) {
      return NavigatorService.NAVIGATION_FAIL;
    }

    const planId = this._navigationState.params.get('planId');
    if (isNil(planId)) {
      return NavigatorService.NAVIGATION_FAIL;
    }

    return Observable.fromPromise(this._router.navigate([
      'customers', customerNumber,
      'plans', planId,
      'categories', categoryId
    ], options));
  }

  /**
   * Navigate to mass update Entry page.
   * @param {string} categoryId
   * @param {NavigationExtras} options
   * @returns {Observable<boolean>}
   */
  public goToMassUpdateEntry(categoryId: string, options?: NavigationExtras): Observable<boolean> {
    const customerNumber = this._navigationState.params.get('customerNumber');
    if (isNil(customerNumber)) {
      return NavigatorService.NAVIGATION_FAIL;
    }

    return Observable.fromPromise(this._router.navigate([
      'customers', customerNumber,
      'mass-update',
      'categories', categoryId
    ], options));
  }

  /**
   * Navigate to plan data entry page for a specified category from main nav.
   * @param {string} customerNumber
   * @param {string} planId
   * @param {string} categoryId
   * @param {NavigationExtras} options
   * @returns {Observable<boolean>}
   */
  public goToPlanEntryFromNav(customerNumber: number, planId: string, categoryId: string, options?: NavigationExtras): Observable<boolean> {
    if (isNil(customerNumber)) {
      return NavigatorService.NAVIGATION_FAIL;
    }

    if (isNil(planId)) {
      return NavigatorService.NAVIGATION_FAIL;
    }

    return Observable.fromPromise(this._router.navigate([
      'customers', customerNumber,
      'plans', planId,
      'categories', categoryId
    ], options));
  }

  /**
   * Navigate to a particular section on the plan details page.
   * @param {string} categoryId: the unique id of the category
   * @param {string} sectionId: The unique id of the section.
   * @param {NavigationExtras} options: The extra options used during navigation.
   * @returns {Observable<boolean>}
   *  - Returns an observed value that:
   *    - equals to 'true' when navigation succeeds,
   *    - equals to 'false' when navigation fails,
   *    - is rejected when an error happens.
   */
  public goToPlanEntrySection(categoryId: string, sectionId: string, options?: NavigationExtras): Observable<boolean> {
    const additionalOptions = {queryParams: {sectionId}};
    options = options || {};
    Object.assign(options, additionalOptions);
    return this.goToPlanEntry(categoryId, options);
  }

  /**
   * Navigate to a particular section on the plan details page from main nav.
   * @param {number} customerNumber
   * @param {string} planId
   * @param {string} categoryId
   * @param {string} sectionId
   * @param {NavigationExtras} options
   * @returns {Observable<boolean>}
   */
  public goToPlanEntrySectionFromNav(customerNumber: number, planId: string, categoryId: string, sectionId: string, options?: NavigationExtras): Observable<boolean> {
    const additionalOptions = {queryParams: {sectionId}};
    options = options || {};
    Object.assign(options, additionalOptions);
    return this.goToPlanEntryFromNav(customerNumber, planId, categoryId, options);
  }

  /**
   * Navigates to a specific plan error report given a plan id, and uses the customer number from the route
   * @param {string} planId
   * @param {NavigationExtras} options
   * @returns {Observable<boolean>}
   */
  public goToPlanErrorReport(planId: string, options?: NavigationExtras): Observable<boolean> {
    const customerNumber = this._navigationState.params.get('customerNumber');
    if (isNil(customerNumber)) {
      return NavigatorService.NAVIGATION_FAIL;
    }

    if (isNil(planId)) {
      return NavigatorService.NAVIGATION_FAIL;
    }

    return Observable.fromPromise(this._router.navigate([
      'customers', customerNumber,
      'plans', planId,
      'validations'
    ], options));
  }

  /**
   * Navigate to history landing page.
   * @param {NavigationExtras} options: The extra options used during navigation.
   * @returns {Observable<boolean>}
   *  - Returns an observed value that:
   *    - equals to 'true' when navigation succeeds,
   *    - equals to 'false' when navigation fails,
   *    - is rejected when an error happens.
   */
  public goToHistoryHome(options?: NavigationExtras): Observable<boolean> {
    const customerNumber = this._navigationState.params.get('customerNumber');
    if (isNil(customerNumber)) {
      return NavigatorService.NAVIGATION_FAIL;
    }
    return Observable.fromPromise(this._router.navigate([
      'customers', customerNumber,
      'history'
    ], options));
  }

  /**
   * Navigate to search landing page.
   * @param {NavigationExtras} options: The extra options used during navigation.
   * @returns {Observable<boolean>}
   *  - Returns an observed value that:
   *    - equals to 'true' when navigation succeeds,
   *    - equals to 'false' when navigation fails,
   *    - is rejected when an error happens.
   */
  public goToSearchHome(options?: NavigationExtras): Observable<boolean> {
    return Observable.fromPromise(this._router.navigate([
      '/search'
    ], options));
  }

  /**
   * Navigate to home page.
   * @param {NavigationExtras} options: The extra options used during navigation.
   * @returns {Observable<boolean>}
   *  - Returns an observed value that:
   *    - equals to 'true' when navigation succeeds,
   *    - equals to 'false' when navigation fails,
   *    - is rejected when an error happens.
   */
  public goToHome(options?: NavigationExtras): Observable<boolean> {
    return Observable.fromPromise(this._router.navigate([
      '/home'
    ], options));
  }

  /**
   * Subscribe to the navigator's router source observable.
   * This method is an abstraction of the actual subscription to the route observable, enabling this class to maintain it's own map of current subscribers.
   * @param {string} subscriberId: Id of the calling subscriber to be used as key in _subscriptions map.
   * @param handler: Event handler to invoke when route change is triggered.
   * @returns {INavState}: The current state of the navigator.
   */
  public subscribe(subscriberId: string, handler: any): INavState {
    const newSub = this._routeSubject.subscribe((value: INavState) => handler(value));
    this._subscriptions.set(subscriberId, newSub);
    return this.getNavigationState();
  }

  /**
   * Unsubscribe from the the navigator's router source observable.
   * @param {string} subscriberId: The unique id associated to the subscription.
   */
  public unsubscribe(subscriberId: string): void {
    const subscription = this._subscriptions.get(subscriberId);

    if (subscription) {
      subscription.unsubscribe();
      this._subscriptions.delete(subscriberId);
    }
  }

  /**
   * Returns the current state of the navigator
   * @returns {INavState}: The state of the current route
   */
  public getNavigationState(): INavState {
    return Object.assign({}, this._navigationState);
  }

  /**
   * Navigates to a given URL
   *
   * @param {string} url: The URL to navigate to.
   * @param {NavigationExtras} options: The extra options used during navigation.
   * @returns {Observable<boolean>}
   *  - Returns an observed value that:
   *    - equals to 'true' when navigation succeeds,
   *    - equals to 'false' when navigation fails,
   *    - is rejected when an error happens.
   */
  public goToUrl(url: string, options?: NavigationExtras): Observable<boolean> {
    return Observable.fromPromise(this._router.navigateByUrl(url, options));
  }

  /**
   * Parses a given string into a {@link UrlTree}.
   * @param {string} url: The url string to parse.
   * @returns {UrlTree}
   */
  public parseUrl(url: string): UrlTree {
    return this._router.parseUrl(url);
  }

  /**
   * Handles the navigation state event
   * @private
   */
  private _subscribeToNavigationStart(): void {
    const navigationStartSubscription = this._router.events
      .filter((routerEvent: RouterEvent) => routerEvent instanceof NavigationStart)
      .subscribe(() => {
        this._loadingSpinnerService.show();
      });
    this._routerSubscriptions.push(navigationStartSubscription);
  }

  /**
   * Handles the navigation end event
   * @private
   */
  private _subscribeToNavigationEnd(): void {
    const navigationEndSubscription = this._router.events
      .filter((routerEvent: RouterEvent) => routerEvent instanceof NavigationEnd)
      .subscribe(() => {
        this._loadingSpinnerService.hide();
        this._navigationState.url = this._router.url;
        const activeRoute: ActivatedRoute = this._router.routerState.root.firstChild;

        Observable.zip(activeRoute.data, activeRoute.paramMap)
          .subscribe(results => {
            this._navigationState.data = results[0];
            this._navigationState.context = results[0].context;
            this._navigationState.params = results[1];
            this._routeSubject.next(this._navigationState);
          });
      });
    this._routerSubscriptions.push(navigationEndSubscription);
  }
}
