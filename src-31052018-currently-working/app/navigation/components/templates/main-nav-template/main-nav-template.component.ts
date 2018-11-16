import {Component, HostListener} from '@angular/core';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {IScrollEvent} from 'app/ui-controls/interfaces/iScrollEvent';
import {ScrollEventOrigin} from 'app/ui-controls/enums/scroll-event-origin';

/**
 * This component is presentational only - it will hold common styling
 * for all of the contextual nav menus.  Because it uses a class-based
 * selector for the ng-content, the following usage is required:
 *
 * ```html
 * <gpr-main-nav-template>
 *   <div class="nav-header">
 *     My header content here
 *   </div>
 *   <div class="nav-content">
 *     My main content here
 *   </div>
 * </gpr-main-nav-template>
 * ```
 */
@Component({
  selector: 'gpr-main-nav-template',
  template: `
    <div class="main-nav-top-section">
      <div class="main-nav-header">
        <ng-content select=".nav-header"></ng-content>
      </div>

      <div class="horizontal-rule"></div>
    <div>
    <div class="main-nav-content" (scroll)="onScroll($event)" [style.height.px]="contentHeight">
      <ng-content select=".nav-content"></ng-content>
    </div>`,
  styleUrls: ['./main-nav-template.component.scss']
})
export class MainNavTemplateComponent {

  /**
   * Height of the top section of the main nav window
   */
  private _mainNavTopSectionHeight: number = 152;

  /**
   * Height of the bottom section that holds the plans and customers on the main nav
   */
  public contentHeight: number;

  /**
   * The scroll event for the main nav template
   * @type {IScrollEvent}
   */
  private _scrollEvent: IScrollEvent = {
    eventElement: null,
    bottomThreshold: 150,
    eventOrigin: ScrollEventOrigin.MAIN_NAV_MENU
  };

  /**
   * Creates the main nav template component
   * @param {ScrollService} _scrollService
   */
  constructor(private _scrollService: ScrollService) {
    this.onWindowResize();
  }

  /**
   * Handles the scroll event
   * @param event
   */
  public onScroll(event): void {
    this._scrollEvent.eventElement = event;
    this._scrollService.sendScrollEvent(this._scrollEvent);
  }

  /**
   * Called when the window is resized
   */
  @HostListener('window:resize', [])
  public onWindowResize(): void {
    const height = document.documentElement.clientHeight || document.body.clientHeight;
    this.contentHeight = height - this._mainNavTopSectionHeight;
  }
}
