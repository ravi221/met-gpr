import {Component, OnDestroy, OnInit, Type, ViewChild} from '@angular/core';
import {SlideMenuComponent} from './ui-controls/components/slide-menu/slide-menu.component';
import {SearchOverlayComponent} from './search/components/search-overlay/search-overlay.component';
import {NotificationService} from './core/services/notification.service';
import {Subscription} from 'rxjs/Subscription';
import {INotification} from './core/interfaces/iNotification';
import {LogoutService} from './navigation/services/logout.service';
import {LogoutComponent} from './navigation/components/logout/logout.component';
import {ModalService} from './ui-controls/services/modal.service';
import {ModalRef} from './ui-controls/classes/modal-references';
import {LogoutStates} from './navigation/enums/logout-states';
import {UserProfileService} from './core/services/user-profile.service';
import {AuthorizationService} from './core/services/authorization.service';
import {isNil} from 'lodash';
import {SubscriptionManager} from './core/utilities/subscription-manager';
import {LoadingSpinnerService} from './ui-controls/services/loading-spinner.service';
import {AnimationState} from './ui-controls/animations/AnimationState';

/**
 * The root of the application, containing the router outlet, slide menu, and search overlay
 */
@Component({
  selector: 'gpr-root',
  template: `
    <gpr-nav-bar (openSlideMenu)="openSlideMenu()"
                 (openSearchOverlay)="openSearchOverlay()"
                 (openLogout)="openLogout()"></gpr-nav-bar>
    <div class="clear-nav-bar"></div>
    <gpr-slide-menu>
      <div *ngIf="isMainNavOpen">
        <gpr-main-nav-menu (close)="closeSlideMenu()"></gpr-main-nav-menu>
      </div>
    </gpr-slide-menu>
    <gpr-search-overlay></gpr-search-overlay>
    <gpr-scroll-to-top></gpr-scroll-to-top>
    <gpr-notification-banner [notification]="notification"></gpr-notification-banner>
    <router-outlet></router-outlet>
    <gpr-loading-spinner [state]="loadingSpinnerState"></gpr-loading-spinner>
  `
})
export class AppComponent implements OnInit, OnDestroy {

  /**
   * The currently display notification
   */
  public notification: INotification;

  /**
   * Flag to remove navigation menu from the dom
   */
  public isMainNavOpen: boolean = false;

  /**
   * Indicates if to display the loading spinner
   */
  public loadingSpinnerState: AnimationState = AnimationState.HIDDEN;

  /**
   * A reference to the Modal that pops up when flags are resolved
   */
  private _modalRef: ModalRef;

  /**
   * A list of subscriptions
   */
  private _subscriptions: Subscription[] = [];

  /**
   * The slide menu component
   */
  @ViewChild(SlideMenuComponent) private _slideMenu: SlideMenuComponent;

  /**
   * The search overlay component
   */
  @ViewChild(SearchOverlayComponent) private _searchOverlay: SearchOverlayComponent;

  /**
   * Creates the app component, the root component of GPR
   * @param {LoadingSpinnerService} _loadingSpinnerService
   * @param {LogoutService} _logoutService
   * @param {ModalService} _modalService
   * @param {NotificationService} _notificationService
   * @param {UserProfileService} _userProfileService
   * @param {AuthorizationService} _authorizationService
   */
  constructor(private _loadingSpinnerService: LoadingSpinnerService,
              private _logoutService: LogoutService,
              private _modalService: ModalService,
              private _notificationService: NotificationService,
              private _userProfileService: UserProfileService,
              private _authorizationService: AuthorizationService) {
  }

  /**
   * On init, subscribe to any notifications
   */
  ngOnInit(): void {
    this._verifyCurrentUser();
    this._subscribeToNotifications();
    this._subscribeToLoadingSpinner();
    this._subscriptions.push(this._logoutService.onTimeout.subscribe(() => {
      this._handleLogout(LogoutStates.BY_TIMEOUT);
    }));
  }

  /**
   * On destroy, unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    SubscriptionManager.massUnsubscribe(this._subscriptions);
  }

  /**
   * Opens the search overlay
   */
  public openSearchOverlay(): void {
    this._searchOverlay.openSearchOverlay();
  }

  /**
   * Opens the slide menu
   */
  public openSlideMenu(): void {
    this.isMainNavOpen = true;
    this._slideMenu.openSlideMenu();
  }

  /**
   * Closes the slide menu
   */
  public closeSlideMenu(): void {
    this._slideMenu.closeSlideMenu();
    this.isMainNavOpen = false;
  }

  /**
   * Opens the logout for a user
   */
  public openLogout(): void {
    this._handleLogout(LogoutStates.BY_USER);
  }

  /**
   * Handles when the user log out manually, or is logged out by a specified timeout
   * @param {LogoutStates} logoutState
   * @private
   */
  private _handleLogout(logoutState: LogoutStates): void {
    let componentType: Type<Component> = LogoutComponent as Type<Component>;
    const logoutOptions = this._logoutService.getLogoutOptions(logoutState);
    const title = logoutOptions.get('title');
    this._modalRef = this._modalService.open(componentType, {
      title,
      backdrop: true,
      size: 'med',
      closeOnEsc: false,
      inputs: logoutOptions
    });
    this._subscriptions.push(this._modalRef.onClose.subscribe(() => {
      this._logoutService.restartUserTimeout();
    }));
    this._subscriptions.push(this._modalRef.onDismiss.subscribe(() => {
      this._logoutService.restartUserTimeout();
    }));
  }

  /**
   * Subscribes to any changes with the loading spinner
   * @private
   */
  private _subscribeToLoadingSpinner(): void {
    this._subscriptions.push(this._loadingSpinnerService.visibility$.subscribe((loadingSpinnerState: AnimationState) => {
      this.loadingSpinnerState = loadingSpinnerState;
    }));
  }

  /**
   * Subscribe to the {@link NotificationService} to get notifications
   * @private
   */
  private _subscribeToNotifications(): void {
    this._subscriptions.push(this._notificationService.getNotifications().subscribe((notifications) => {
      if (notifications && notifications.length > 0) {
        this.notification = notifications[notifications.length - 1];
      }
    }));
  }

  /**
   * Makes sure on app create, that the user is logged in and is authorized
   * @private
   */
  private _verifyCurrentUser(): void {
    const currentUser = this._userProfileService.getCurrentUserProfile();
    if (isNil(currentUser)) {
      this._logoutService.logoutUser();
    }

    const isAuthorized = this._authorizationService.isUserAuthorized(currentUser);
    if (!isAuthorized) {
      this._logoutService.logoutUser();
    }
  }
}
