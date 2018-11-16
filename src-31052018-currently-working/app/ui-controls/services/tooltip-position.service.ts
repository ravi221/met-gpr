import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {BrowserHelper} from '../../core/utilities/browser-helper';
import {TooltipPosition} from 'app/ui-controls/enums/tooltip-position';

/**
 * Service to get the position where to place a tooltip on the screen
 */
@Injectable()
export class TooltipPositionService {

  /**
   * Default offset
   */
  static DEFAULT_OFFSET: {
    width: 0, height: 0, top: 0, left: 0
  };

  /**
   * Padding applied to tooltip when it is embeded in a modal window
   */
  static MODAL_OFFSET_PADDING = {
    top: 7, left: 5
  };

  /**
   * Default offset for modal window
   */
  static DEFAULT_MODAL_OFFSET: ITooltipPosition = {
    top: 0, left: 0
  };

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * Returns where to position the tooltip on the screen
   */
  public getTooltipPosition(position: TooltipPosition, hostElement: HTMLElement, targetElement: HTMLElement): ITooltipPosition {
    if (hostElement && targetElement) {
      let hostElPos = this._offset(hostElement);
      let targetElWidth = targetElement.offsetWidth;
      let targetElHeight = targetElement.offsetHeight;

      const offset = 20;
      const centerHorizontal = hostElPos.left + (hostElPos.width / 2) - (targetElWidth / 2) - 8;
      const centerVertical = hostElPos.top + (hostElPos.height / 2) - (targetElHeight / 2) - 2;

      let topVal, leftVal: number;
      const modalOffset = this._getModalOffset();
      switch (position) {
        case TooltipPosition.RIGHT:
          topVal = centerVertical + (modalOffset.top > 0 ? TooltipPositionService.MODAL_OFFSET_PADDING.top : 0);
          leftVal = hostElPos.left + hostElPos.width + offset;
          break;
        case TooltipPosition.LEFT:
          topVal = centerVertical + (modalOffset.top > 0 ? TooltipPositionService.MODAL_OFFSET_PADDING.top : 0);
          leftVal = hostElPos.left - (targetElWidth + offset);
          break;
        case TooltipPosition.BOTTOM:
          topVal = hostElPos.top + hostElPos.height + offset;
          leftVal = centerHorizontal + (modalOffset.top > 0 ? TooltipPositionService.MODAL_OFFSET_PADDING.left : 0);
          break;
        case TooltipPosition.TOP:
        case TooltipPosition.DEFAULT:
        default:
          topVal = hostElPos.top - (targetElHeight + offset);
          leftVal = centerHorizontal;
      }
      if (!BrowserHelper.isIE()) {
        topVal -= modalOffset.top;
        leftVal -= modalOffset.left;
      }
      topVal = Math.round(topVal);
      leftVal = Math.round(leftVal);

      const returnPosition = this._repositionForOffscreen(topVal, leftVal, targetElHeight, targetElWidth);

      return returnPosition;
    }
    return <ITooltipPosition>{};
  }

  /**
   * Method used to account for when a popup might be displayed offscreen
   * @param {number} top
   * @param {number} left
   * @param {number} targetHeight
   * @param {number} targetWidth
   * @returns {ITooltipPosition}
   */
  private _repositionForOffscreen(top: number, left: number, targetHeight: number, targetWidth: number): ITooltipPosition {
    const widowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    const windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const popupBottom = top + targetHeight;
    const popupRight = left + targetWidth;
    if (popupBottom > widowHeight) {
      top = widowHeight - targetHeight;
    }
    if (popupRight > windowWidth) {
      left = windowWidth - targetWidth;
    }
    if (left < 0) {
      left = 0;
    }

    return <ITooltipPosition>{top, left};
  }

  /**
   * Method used to get offset from base element for the tooltip
   * @param nativeEl base element used to determing tooltip offset
   */
  private _offset(nativeEl: HTMLElement): {width: number, height: number, top: number, left: number} {
    if (nativeEl) {
      const boundingClientRect = nativeEl.getBoundingClientRect();
      return {
        width: boundingClientRect.width || nativeEl.offsetWidth,
        height: boundingClientRect.height || nativeEl.offsetHeight,
        top: boundingClientRect.top,
        left: boundingClientRect.left
      };
    }
    return TooltipPositionService.DEFAULT_OFFSET;
  }

  /**
   * Method used to get offset incase tooltip is inside modal popup
   */
  private _getModalOffset(): ITooltipPosition {
    const modalHMTL = this._getModalElement();
    if (modalHMTL) {
      const boundRect = modalHMTL.getBoundingClientRect();
      return <ITooltipPosition>{top: boundRect.top, left: boundRect.left};
    }
    return TooltipPositionService.DEFAULT_MODAL_OFFSET;
  }

  /**
   * Method used to find modal wrapping container
   */
  private _getModalElement(): HTMLElement {
    const modal = document.getElementsByClassName('modal-content');
    if (!isNil(modal) && modal.length > 0) {
      return modal.item(0) as HTMLElement;
    }
    return null;
  }
}

/**
 * Interface to position the tooltip
 */
export interface ITooltipPosition {
  /**
   * The pixel location from the top of the page
   */
  top: number;

  /**
   * The pixel location from the left of the page
   */
  left: number;
}


