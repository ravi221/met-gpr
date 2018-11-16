import {Injectable, OnDestroy} from '@angular/core';
import {ITooltip} from '../interfaces/iTooltip';
import {TooltipContentComponent} from '../components/tooltip/tooltip-content.component';
import {Guid} from '../../core/utilities/guid';
import {isNil} from 'lodash';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {SubscriptionManager} from '../../core/utilities/subscription-manager';

/**
 * Service to keep track of all tooltips on a given page, only allowing one to show at a given time
 */
@Injectable()
export class TooltipService implements OnDestroy {

  /**
   * An array of {@link ITooltip}
   */
  public tooltips: ITooltip[] = [];

  /**
   * An observable to watch the window resize
   * @type {Observable<any>}
   */
  private _click$: Observable<any> = Observable.fromEvent(window, 'click');

  /**
   * An observable to watch the window resize
   * @type {Observable<any>}
   */
  private _resize$: Observable<any> = Observable.fromEvent(window, 'resize');

  /**
   * An observable to watch the window scroll
   * @type {Observable<any>}
   */
  private _scroll$: Observable<any> = Observable.fromEvent(window, 'scroll');

  /**
   * A subscription to watch the click event
   */
  private _clickSubscription: Subscription;

  /**
   * A subscription to watch the resize event
   */
  private _resizeSubscription: Subscription;

  /**
   * A subscription to watch the scroll event
   */
  private _scrollSubscription: Subscription;

  /**
   * Creates the tooltip service
   */
  constructor() {
    this._clickSubscription = this._click$.subscribe(($event: any) => {
      this._updateTooltipVisibility($event);
    });
    this._resizeSubscription = this._resize$.subscribe(() => {
      this._updateTooltipPositions();
    });
    this._scrollSubscription = this._scroll$.subscribe(() => {
      this._updateTooltipPositions();
    });
  }

  /**
   * On destroy, remove subscriptions to the window
   */
  ngOnDestroy(): void {
    const subscriptions: Subscription[] = [
      this._clickSubscription,
      this._resizeSubscription,
      this._scrollSubscription
    ];
    SubscriptionManager.massUnsubscribe(subscriptions);
  }

  /**
   * Creates a new tooltip
   * @param {TooltipContentComponent} tooltipContent The content of the new tooltip
   */
  public create(tooltipContent: TooltipContentComponent): ITooltip {
    const id = Guid.create();
    const isVisible = false;
    const tooltip: ITooltip = {id, tooltipContent, isVisible};
    this.tooltips.push(tooltip);
    return tooltip;
  }

  /**
   * Removes the tooltip from our list of tooltips
   * @param {ITooltip} tooltip The tooltip to remove
   */
  public destroy(tooltip: ITooltip): void {
    if (isNil(tooltip)) {
      return;
    }
    const index = this.tooltips.findIndex((t: ITooltip) => {
      return t.id === tooltip.id;
    });

    const doesTooltipExist = index !== -1;
    if (!doesTooltipExist) {
      return;
    }

    tooltip.isVisible = false;
    tooltip.tooltipContent.setVisiblity(false);
    this.tooltips.splice(index, 1);
  }

  /**
   * Toggles whether to hide or show the tooltip
   * @param {ITooltip} tooltip The tooltip that is being hidden/shown
   */
  public toggle(tooltip: ITooltip): void {
    tooltip.isVisible = !tooltip.isVisible;
    if (tooltip.isVisible) {
      this.show(tooltip);
    } else {
      this.hide(tooltip);
    }
  }

  /**
   * Called to hide the tooltip
   * @param {ITooltip} tooltip The tooltip to hide
   */
  public hide(tooltip: ITooltip): void {
    tooltip.isVisible = false;
    tooltip.tooltipContent.setVisiblity(false);
  }

  /**
   * Called to show the tooltip
   * @param {ITooltip} tooltip The tooltip to show
   */
  public show(tooltip: ITooltip): void {
    this.hideAllTooltips();
    tooltip.isVisible = true;
    tooltip.tooltipContent.setVisiblity(true);
  }

  /**
   * Hides all other tooltips
   */
  public hideAllTooltips(): void {
    this.tooltips.forEach((tooltip: ITooltip) => {
      this.hide(tooltip);
    });
  }

  /**
   * Updates visible tooltips when the document is clicked
   * @param {any} $event
   * @private
   */
  private _updateTooltipVisibility($event: any): void {
    const visibleTooltips = this.tooltips.filter(tooltip => tooltip.isVisible);
    visibleTooltips.forEach(tooltip => {
      tooltip.tooltipContent.handleDocumentClick($event);
    });
  }

  /**
   * Updates the tooltip positions, updated when the window resizes or scrolls
   * @private
   */
  private _updateTooltipPositions(): void {
    const visibleTooltips = this.tooltips.filter(tooltip => tooltip.isVisible);
    visibleTooltips.forEach(tooltip => {
      tooltip.tooltipContent.updateTooltipPosition();
    });
  }
}
