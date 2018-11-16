import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {INavState} from '../../interfaces/iNavState';
import {Location} from '@angular/common';
import {NavBarService} from '../../services/nav-bar.service';
import {NavContextType} from '../../enums/nav-context';
import {NavigatorService} from '../../services/navigator.service';

/**
 * Global fixed navigation bar for GPR.
 * The nav items on the left and right hand side are contextual and are available depending on current route
 *
 * Usage:
 * ```html
 * <gpr-nav-bar (openSlideMenu)="onOpenSlideMenu()"
 *              (openSearchOverlay)="onOpenSearchOverlay()"
 *              (openLogout)="onOpenLogout()"></gpr-nav-bar>
 * ```
 */
@Component({
  selector: 'gpr-nav-bar',
  template: `
    <nav class="nav-bar" role="navigation">

      <!-- Left Navigation Links -->
      <ul class="nav-links">
        <!-- Main menu -->
        <li [hidden]="!navLinkVisibility.mainMenu" class="nav-link">
          <a (click)="onSlideMenuClick()">
            <gpr-icon class="nav-icon" name="menu"></gpr-icon>
            GPR MENU</a>
        </li>

        <!-- Back button -->
        <li [hidden]="!navLinkVisibility.back" class="nav-link">
          <a (click)="navigateBack()">
            <gpr-icon class="nav-icon" name="back"></gpr-icon>
          </a>
        </li>
      </ul>

      <!-- MetLife Logo -->
      <div class="nav-brand">
        <gpr-icon class="brand-icon" [name]="'metlife-logo'" (click)="navigateToHome()"></gpr-icon>
      </div>

      <!-- Right Navigation Links -->
      <ul class="nav-links">
        <!-- Flags Home -->
        <li [hidden]="!navLinkVisibility.flags" class="nav-link">
          <a (click)="navigateToFlagHome()">
            <gpr-icon class="nav-icon" name="nav-flag" [state]="'off'"></gpr-icon>
            FLAGS</a>
        </li>

        <!-- History Home -->
        <li [hidden]="!navLinkVisibility.history" class="nav-link">
          <a (click)="navigateToHistoryHome()">
            <gpr-icon class="nav-icon history-nav-icon" name="clock"></gpr-icon>
            HISTORY</a>
        </li>

        <!-- Search Overlay -->
        <li [hidden]="!navLinkVisibility.search" class="nav-link">
          <a (click)="onSearchClick()">
            <gpr-icon class="nav-icon" name="search"></gpr-icon>
            SEARCH</a>
        </li>

        <!-- Logout -->
        <li [hidden]="!navLinkVisibility.logout" class="nav-link">
          <a (click)="onLogoutClick()">LOGOUT</a>
        </li>
      </ul>
      <gpr-progress-bar class="nav-progress-bar"></gpr-progress-bar>
    </nav>
  `,
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
  /**
   * Triggers an event to open the slide menu
   */
  @Output() openSlideMenu: EventEmitter<void> = new EventEmitter<void>();
  /**
   * Triggers an event to open the search overlay
   */
  @Output() openSearchOverlay: EventEmitter<void> = new EventEmitter<void>();
  /**
   * Triggers an event to open logout modal
   */
  @Output() openLogout: EventEmitter<void> = new EventEmitter<void>();
  /**
   * An object to indicate which links to display
   */
  public navLinkVisibility = NavBarService.DEFAULT_NAV_LINK_VISIBILITY;

  /**
   * Creates the nav bar component
   * @param {Location} _location
   * @param {NavBarService} _navBarService
   * @param {NavigatorService} _navigator
   */
  constructor(private _location: Location,
              private _navBarService: NavBarService,
              private _navigator: NavigatorService) {
  }

  /**
   * On init, subscribe to the navigation state
   */
  ngOnInit(): void {
    const navState = this._navigator.subscribe('navbar', (value: INavState) => {
      this._updateNavLinks(value.context);
    });
    this._updateNavLinks(navState.context);
  }

  /**
   * On destroy, unsubscribe from navigation subscription
   */
  ngOnDestroy(): void {
    this._navigator.unsubscribe('navbar');
  }

  /**
   * Navigates back to the previous page
   */
  public navigateBack(): void {
    this._location.back();
  }

  /**
   * Navigates to Flag Page
   */
  public navigateToFlagHome(): void {
    this._navigator.goToFlagHome();
  }

  /**
   * Navigates to History Page
   */
  public navigateToHistoryHome(): void {
    this._navigator.goToHistoryHome();
  }

  /**
   * Navigates to the home page
   */
  public navigateToHome(): void {
    this._navigator.goToUrl('/');
  }

  /**
   * Handles click even for logout
   */
  public onLogoutClick(): void {
    this.openLogout.emit();
  }

  /**
   * Handles click event of search button
   */
  public onSearchClick(): void {
    this.openSearchOverlay.emit();
  }

  /**
   * Handles click event of main menu button
   */
  public onSlideMenuClick(): void {
    this.openSlideMenu.emit();
  }

  /**
   * Updates the navigation links based on nav state context
   * @param {NavContextType} navContext
   * @private
   */
  private _updateNavLinks(navContext: NavContextType): any {
    this.navLinkVisibility = this._navBarService.getNavLinkVisibility(navContext);
  }
}
