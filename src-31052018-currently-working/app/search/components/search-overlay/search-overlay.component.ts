import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SlideMenuComponent} from '../../../ui-controls/components/slide-menu/slide-menu.component';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {SearchBarService} from '../../services/search-bar.service';

/**
 * Creates the search overlay component
 *
 * Usage:
 * ```html
 *  <gpr-search-overlay></gpr-search-overlay>
 *  ```
 */
@Component({
  selector: 'gpr-search-overlay',
  template: `
    <gpr-slide-menu [direction]="'top'">
      <section class="search-overlay">
        <a class="close-search-overlay" (click)="closeSearchOverlay()">
          <i class="material-icons">close</i>
          <span>CLOSE</span>
        </a>
        <gpr-search-page (showMoreResultsClick)="navigateToSearchHome()"></gpr-search-page>
      </section>
    </gpr-slide-menu>
  `,
  styleUrls: ['./search-overlay.component.scss']
})
export class SearchOverlayComponent implements OnInit, OnDestroy {

  /**
   * The slide menu component
   */
  @ViewChild(SlideMenuComponent) slideMenu;

  /**
   * Creates the search overlay component
   * @param {NavigatorService} _navigator
   * @param {SearchBarService} _searchBarService
   */
  constructor(private _navigator: NavigatorService,
              private _searchBarService: SearchBarService) {
  }

  /**
   * On init, subscribe to the navigation service
   */
  ngOnInit(): void {
    this._navigator.subscribe('search-overlay', () => {
      this._toggleOverlayByNavContext();
    });
  }

  /**
   * On destroy, unsubscribe from the navigation subscription
   */
  ngOnDestroy(): void {
    this._navigator.unsubscribe('search-overlay');
  }

  /**
   * Closes the search overlay
   */
  public closeSearchOverlay(): void {
    this.slideMenu.closeSlideMenu();
  }

  /**
   * Opens the search overlay and focuses the input field
   */
  public openSearchOverlay(): void {
    this.slideMenu.openSlideMenu();
    this._searchBarService.focus();
  }

  /**
   * Navigates to search home page
   */
  public navigateToSearchHome(): void {
    this._navigator.goToSearchHome();
  }

  /**
   * Shows the search overlay when on the search screen, otherwise hides when switching between contexts
   * @private
   */
  private _toggleOverlayByNavContext(): void {
    this.closeSearchOverlay();
  }
}
