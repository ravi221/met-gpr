import {Injectable} from '@angular/core';
import {IScrollEvent} from 'app/ui-controls/interfaces/iScrollEvent';
import {Subject} from 'rxjs/Subject';
import {debounce} from 'app/core/decorators/debounce';

/**
 * A service used to detect the scrolling information
 */
@Injectable()
export class ScrollService {

  /**
   * Subject used to broadcast scroll events
   */
  private _scrollObserved = new Subject<IScrollEvent>();

  /**
   * The number of pixels near the bottom the user must scroll to indicate if near the bottom of the screen
   * @type {number}
   * @private
   */
  private readonly _threshold: number = 75;

  /**
   * Timeout for when to update scroll position of page
   */
  private _timeoutMillis: number = 15;
  /**
   * Increments how fast the page scrolls
   */
  private _acceleration: number = 0.05;

  /**
   * Observable that can be subscribed to get scroll events
   */
  public scrollEvent$ = this._scrollObserved.asObservable();

  /**
   * Gets the number of pixels scrolled from the top of the page
   * @returns {number}
   */
  public getScrollDistance(): number {
    if (window.scrollY) {
      return window.scrollY;
    }
    if (window.pageYOffset) {
      return window.pageYOffset;
    }
    return 0;
  }

  /**
   * Indicates if the current scroll is at the top, with respect to the window element
   * @returns {boolean}
   */
  public isAtTop(): boolean {
    const scrollDistance = this.getScrollDistance();
    return scrollDistance === 0;
  }

  /**
   * Indicates if the user has scrolled near the browser, within a defined threshold
   * @returns {boolean}
   */
  public isNearBottom(element?: any, threshold?: number): boolean {
    const thresh = threshold ? threshold : this._threshold;
    if (element) {
      const bottom = element.scrollHeight - element.clientHeight - thresh;
      return element.scrollTop >= bottom;
    } else {
      const documentHeight = this._getDocumentHeight();
      const scrollDistance = this.getScrollDistance();
      return (scrollDistance + window.innerHeight) > (documentHeight - thresh);
    }
  }

  /**
   * Scrolls by a given x and y coordinate, negative values scroll upwards
   * @param {number} x
   * @param {number} y
   */
  public scrollBy(x: number = 0, y: number = 0): void {
    window.scrollBy(x, y);
  }

  /**
   * Scrolls to a given x and y coordinate
   * @param {number} x
   * @param {number} y
   */
  public scrollTo(x: number = 0, y: number = 0): void {
    window.scrollTo(x, y);
  }

  /**
   * Scrolls to the top of the page
   */
  public scrollToTop(): void {
    let distanceToScroll = 0;
    let newDistance = 0;
    let timeElapsed = 0;
    const timerID = setInterval(() => {
      this.scrollBy(0, -distanceToScroll);
      timeElapsed += this._timeoutMillis;
      newDistance = (0.5 * this._acceleration * (timeElapsed * timeElapsed));
      distanceToScroll = newDistance - distanceToScroll;

      const isAtTop = this.isAtTop();
      if (isAtTop) {
        clearInterval(timerID);
      }
    }, this._timeoutMillis);
  }

  /**
   * Called to send scroll event to subscribers
   * @param event Element being scrolled
   */
  @debounce(100)
  public sendScrollEvent(event: IScrollEvent): void {
    if (event && event.eventElement && event.eventOrigin) {
      event.isNearBottom = this.isNearBottom(event.eventElement.srcElement, event.bottomThreshold);
      this._scrollObserved.next(event);
    }
  }

  /**
   * Gets the document height, regardless of browser
   * @returns {number}
   */
  private _getDocumentHeight(): number {
    const doc = document;
    return Math.max(
      doc.body.scrollHeight, doc.documentElement.scrollHeight,
      doc.body.offsetHeight, doc.documentElement.offsetHeight,
      doc.body.clientHeight, doc.documentElement.clientHeight
    );
  }
}
