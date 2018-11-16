import {AfterViewInit, Directive, EventEmitter, OnDestroy, Output, Input, HostListener, ElementRef} from '@angular/core';
import {ScrollDirection} from 'app/ui-controls/enums/scroll-direction';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {SubscriptionManager} from 'app/core/utilities/subscription-manager';

/**
 * Directive to catch and emit scroll events
 **/
@Directive({
  selector: '[gprScroll]'
})
export class ScrollDirective implements AfterViewInit, OnDestroy {

  /**
   * Output event whenever the scrolling hits the bottom or the top of the page
   */
  @Output() scroll: EventEmitter<ScrollDirection> = new EventEmitter<ScrollDirection>();

  /**
   * An event emitter which emits when the scroll is at the bottom
   */
  @Output() scrollAtBottom: EventEmitter<void> = new EventEmitter<void>();

  /**
   * The previous scroll distance
   */
  private _previousScrollDistance: number = 0;

  /**
   * A subscription to the scroll event on window
   */
  private _windowScrollSubscription: Subscription;

  /**
   * A subscription to the scroll event on element
   */
  private _elementScrollSubscription: Subscription;

  /**
   * Creates the scroll directive
   */
  constructor(private _elRef: ElementRef,
    private _scrollService: ScrollService) {
  }

  /**
   * On view init, listen the scroll event on the window
   */
  ngAfterViewInit(): void {
    this._windowScrollSubscription = Observable.fromEvent(window, 'scroll')
      .debounceTime(20)
      .subscribe(() => {
        this.handleScroll();
      });
    this._elementScrollSubscription = Observable.fromEvent(this._elRef.nativeElement, 'scroll')
      .debounceTime(20)
      .subscribe(() => {
        this.handleScroll(this._elRef.nativeElement, 5);
      });
  }

  /**
   * On destroy, unsubscribes from the scroll subscription
   */
  ngOnDestroy(): void {
    const subscriptions: Subscription[] = [
      this._windowScrollSubscription,
      this._elementScrollSubscription
    ];
    SubscriptionManager.massUnsubscribe(subscriptions);
  }

  /**
   * Handles when a scroll is detected
   */
  public handleScroll(element?: ElementRef, threshold?: number): void {
    this._checkScrollDirection();
    this._checkScrollAtBottom(element, threshold);
  }

  /**
   * Checks the new scroll distance and emits an event based on the direction
   */
  private _checkScrollDirection(): void {
    this.scroll.emit(this._getScrollDirection());
  }

  /**
   * Checks if the scroll is at the bottom of the page and emits an event
   */
  private _checkScrollAtBottom(element?: ElementRef, threshold?: number): void {
    const isScrollAtBottom = this._scrollService.isNearBottom(element, threshold);
    if (isScrollAtBottom) {
      this.scrollAtBottom.emit();
    }
  }

  /**
   * Returns the direction the user is currently scrolling
   * @returns ScrollDirections
   */
  private _getScrollDirection(): ScrollDirection {
    const newScrollDistance = this._scrollService.getScrollDistance();
    const isScrollNext = newScrollDistance > this._previousScrollDistance;
    this._previousScrollDistance = newScrollDistance;
    if (isScrollNext) {
      return ScrollDirection.NEXT;
    } else {
      return ScrollDirection.PREVIOUS;
    }
  }
}
