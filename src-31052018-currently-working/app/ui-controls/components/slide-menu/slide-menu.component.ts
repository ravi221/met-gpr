import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AnimationState} from '../../animations/AnimationState';

/**
 * A modal menu that will slide in from the left.  Its methods should be accessed via @ViewChild:
 *
 * In an enclosing Component class:
 *
 * ```typescript
 * template: '<gpr-slide-menu [direction]="'left'"><p>Slide Menu Contents</p></gpr-slide-menu>'
 * // ...
 *
 * \@ViewChild(SlideMenuComponent) private slideMenu: SlideMenuComponent;
 *
 * onSlideMenuTrigger() {
 *   this.slideMenu.openSlideMenu();
 * }
 * ```
 */
@Component({
  selector: 'gpr-slide-menu',
  template: `
    <div class="slide-menu-backdrop" [@fadeInOut]="backdrop.state" (click)="closeSlideMenu()"></div>
    <aside class="slide-menu" [@slideInOut]="slideMenu.state">
      <ng-content></ng-content>
    </aside>`,
  styleUrls: ['./slide-menu.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('visible', style({transform: 'translate3d(0%, 0, 0)'})),
      state('hidden-left', style({transform: 'translate3d(-105%, 0, 0)'})),
      state('hidden-top', style({transform: 'translate3d(0%, -105%, 0)'})),
      transition('visible <=> hidden-left', animate('300ms ease-in-out')),
      transition('visible <=> hidden-top', animate('300ms ease-in-out'))
    ]),
    trigger('fadeInOut', [
      state('visible', style({opacity: '0.64', display: 'block'})),
      state('hidden', style({opacity: '0', display: 'none'})),
      transition('visible <=> hidden', animate('300ms ease-in-out'))
    ])
  ]
})
export class SlideMenuComponent implements OnInit, OnDestroy {

  /**
   * Which direction to slide in/out from
   */
  @Input() direction: 'left' | 'top' = 'left';

  /**
   * {@link ISlideMenu}
   */
  slideMenu: ISlideMenu;

  /**
   * {@link IBackdrop}
   */
  backdrop: IBackdrop;

  /**
   * The hidden state for the slide menu
   */
  hiddenState: string;

  /**
   * The time out for toggling the slide menu
   */
  private _slideMenuTimeout: any;

  /**
   * On init, setup the slide menu and backdrop
   */
  ngOnInit() {
    this.hiddenState = `hidden-${this.direction}`;

    this.slideMenu = {
      state: this.hiddenState,
      isOpening: false
    };

    this.backdrop = {
      state: AnimationState.HIDDEN
    };
  }

  /**
   * On destroy, cancel the time out set for opening the slide menu
   */
  ngOnDestroy(): void {
    if (this._slideMenuTimeout) {
      clearTimeout(this._slideMenuTimeout);
    }
  }

  /**
   * Closes the slide menu unless it is currently being opened
   */
  closeSlideMenu() {
    if (this.slideMenu.state === 'visible' && !this.slideMenu.isOpening) {
      this.slideMenu.state = this.hiddenState;
      this.backdrop.state = AnimationState.HIDDEN;
    }
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
  }

  /**
   * Opens the slide menu and triggers a short period during which it cannot be closed
   */
  openSlideMenu() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('modal-open');
    if (this.slideMenu.state === this.hiddenState) {
      this.slideMenu.isOpening = true;
      this.slideMenu.state = 'visible';
      this.backdrop.state = AnimationState.VISIBLE;

      this._slideMenuTimeout = setTimeout(() => {
        this.slideMenu.isOpening = false;
        this._slideMenuTimeout = null;
      }, 500);
    }
  }
}

/**
 * Tracks the state of a slide menu
 */
interface ISlideMenu {
  /**
   * The state of the slide menu, used for defined animations
   */
  state: string;

  /**
   * Disables closing when the menu is currently being opened.  This fixes an
   * issue with multiple triggers firing at once.
   */
  isOpening: boolean;
}

/**
 * Tracks the state of the the backdrop
 */
interface IBackdrop {
  /**
   * The state of the backdrop
   */
  state: AnimationState;
}
