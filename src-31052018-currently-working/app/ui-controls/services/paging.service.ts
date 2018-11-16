import {Injectable} from '@angular/core';
import {IPaging} from 'app/customer/interfaces/iPaging';
import {ScrollDirection} from 'app/ui-controls/enums/scroll-direction';
import {ScrollService} from './scroll.service';
import {IPagingDefaultOptions} from 'app/customer/interfaces/iPagingDefault';
import {isNil} from 'lodash';

/**
 * A service to keep track of paginating data
 */
@Injectable()
export class PagingService {

  /**
   * Creates the paging service
   * @param {ScrollService} _scrollService
   */
  constructor(private _scrollService: ScrollService) {
  }

  /**
   * Increments page for call to retrieve next page
   * @param paging Used to track and hold information related to paging
   */
  public getNextPageNumber(paging: IPaging): number {
    try {
      let newPage: number = paging.page;
      if (paging.direction === ScrollDirection.NEXT) {
        newPage = paging.page + 1;
      }
      return newPage;
    } catch (error) {
      throw (error.message);
    }
  }

  /**
   * Sets and calculates properties for paging
   * @param {number} arrayLength
   * @param {number} totalCount
   * @param {IPagingDefaultOptions} defaultOptions
   * @returns {IPaging}
   */
  public initializePaging(arrayLength: number, totalCount: number, defaultOptions: IPagingDefaultOptions): IPaging {
    if (isNil(arrayLength) || isNil(totalCount)
      || isNil(defaultOptions.pageSize) || isNil(defaultOptions.viewWindowPages)
      || isNil(defaultOptions.page)) {
      throw new Error('required field(s) for paging is/are invalid');
    }

    try {
      let totalPages = Math.ceil(totalCount / defaultOptions.pageSize);
      let maxStartIndex = (totalPages - defaultOptions.viewWindowPages) * defaultOptions.pageSize;
      let paging: IPaging = {
        page: defaultOptions.page,
        totalCount: totalCount,
        pageSize: defaultOptions.pageSize,
        direction: null,
        viewWindowPages: defaultOptions.viewWindowPages,
        viewWindowStartIndex: 0,
        viewWindowMaxStartIndex: maxStartIndex >= 0 ? maxStartIndex : 0,
        viewWindowEndIndex: arrayLength < defaultOptions.pageSize * defaultOptions.viewWindowPages ? arrayLength : defaultOptions.pageSize * defaultOptions.viewWindowPages,
        viewWindowItems: defaultOptions.pageSize * defaultOptions.viewWindowPages,
        pagesRetrieved: defaultOptions.page
      };

      return paging;
    } catch (error) {
      throw (error.message);
    }
  }

  /**
   * Entry point for processing scrolling event
   * @param displayItems Array of items from screen to be modified
   * @param resultItems Array of items to be appended, if necessary, to array of items from screen
   * @param paging Used to track and hold information related to paging
   */
  public processItems(displayItems: Array<any>, resultItems: Array<any>, paging: IPaging): void {
    try {
      if (paging.direction === ScrollDirection.NEXT) {
        this._processNext(displayItems, resultItems, paging);
      }

      if (paging.direction === ScrollDirection.PREVIOUS) {
        this._processPrevious(displayItems, paging);
      }
    } catch (error) {
      throw (error.message);
    }
  }

  /**
   * Process display items when an item has been removed from array.
   * The method should pull items into the view window from the end of the array until the point that they have been
   * exhausted and the total page count has been reduced by 1.
   * At which point the equivalent of a scroll up event will occur.
   *
   * @param displayItems Array of items from screen to be modified
   * @param paging Used to track and hold information related to paging
   */
  public reProcessItems(displayItems: Array<any>, paging: IPaging): void {
    paging.totalCount--;

    if (displayItems.length > paging.viewWindowEndIndex) {
      this._setArrayItemVisibility(displayItems, paging);
    } else if (displayItems.length % paging.pageSize === 0) {
      paging.viewWindowEndIndex = displayItems.length;
      let maxStartIndex = paging.viewWindowEndIndex - paging.viewWindowItems;
      paging.viewWindowMaxStartIndex = maxStartIndex > 0 ? maxStartIndex : 0;
      this._processPrevious(displayItems, paging);
      paging.pagesRetrieved--;
    }
  }

  /**
   * Processes scroll down event.  Determines what items to display when user scrolls to next page.
   * Appends new items to display array when applicable.
   *
   * @param displayItems Array of items from screen to be modified
   * @param resultItems Items to be appended, if necessary, to array of items from screen
   * @param paging Used to track and hold information related to paging
   */
  private _processNext(displayItems: Array<any>, resultItems: Array<any>, paging: IPaging): void {
    if (resultItems && resultItems.length > 0) {
      displayItems.push.apply(displayItems, resultItems);
      paging.pagesRetrieved++;
    }
    this._updateNextPageDisplayIndices(displayItems, paging);
    this._setArrayItemVisibility(displayItems, paging);
  }

  /**
   * Processes scroll up event.  Determines what items to display when user scrolls to previous page.
   * @param displayItems Array of items from screen to be modified
   * @param paging Used to track and hold information related to paging
   */
  private _processPrevious(displayItems: Array<any>, paging: IPaging): void {
    this._updatePreviousPageDisplayIndices(paging);
    this._setArrayItemVisibility(displayItems, paging);
    this._scrollWindow(paging);
  }

  /**
   * Calculates start end end indices for display items when scrolling to next page and increments paging page number when applicable
   * @param displayItems Array of items from screen to be modified
   * @param paging Used to track and hold information related to paging
   */
  private _updateNextPageDisplayIndices(displayItems: Array<any>, paging: IPaging): void {
    // if display items length is less or equal to the allowed number of display items
    if (displayItems.length <= paging.viewWindowItems) {
      // start index will always be zero when display items length is less or equal to the allowed number of display items
      paging.viewWindowStartIndex = 0;

      // end index of displayable items. Either calculated index or length of display items
      let nextEndDisplayIndex: number = paging.viewWindowEndIndex === paging.viewWindowItems ? paging.viewWindowItems : displayItems.length;

      // if end display index has changed increment page and set index
      if (nextEndDisplayIndex > paging.viewWindowEndIndex) {
        paging.viewWindowEndIndex = nextEndDisplayIndex;
        paging.page++;
      }
      // if display items length is greater than the allowed number of display items
    } else if (displayItems.length > paging.viewWindowItems) {
      // start index for next display page
      let nextStartDisplayIndex: number = paging.viewWindowStartIndex + paging.pageSize;
      // end index for next display page
      let nextEndDisplayIndex: number = displayItems.length >= paging.viewWindowEndIndex + paging.pageSize ? paging.viewWindowEndIndex + paging.pageSize : displayItems.length;

      // if start index for next display page is less than or equal to the calculated start index limit than set indices and increment page
      if (nextStartDisplayIndex <= paging.viewWindowMaxStartIndex) {
        paging.viewWindowStartIndex = nextStartDisplayIndex;
        paging.viewWindowEndIndex = nextEndDisplayIndex;
        paging.page++;
      }
    }
  }

  /**
   * Calculates start and end indices for display items when scrolling to previous page and
   * decrements paging page number when applicable
   *
   * @param paging Used to track and hold information related to paging
   */
  private _updatePreviousPageDisplayIndices(paging: IPaging): void {
    let actualViewWindowItemCount: number = paging.viewWindowEndIndex - paging.viewWindowStartIndex;
    let missingItemCount = 0;
    if (actualViewWindowItemCount < paging.viewWindowItems) {
      missingItemCount = paging.viewWindowItems - actualViewWindowItemCount;
    }

    let previousStartDisplayIndex: number = paging.viewWindowStartIndex - paging.pageSize;
    let previousEndDisplayIndex: number = (paging.viewWindowEndIndex + missingItemCount) - paging.pageSize;

    if (previousStartDisplayIndex >= 0 && previousEndDisplayIndex <= paging.viewWindowEndIndex) {
      paging.viewWindowStartIndex = previousStartDisplayIndex;
      paging.viewWindowEndIndex = previousEndDisplayIndex;
      paging.page--;
    }
  }

  /**
   * Sets display of items in array of items from screen
   * @param displayItems Array of items from screen to be modified
   * @param paging Used to track and hold information related to paging
   */
  private _setArrayItemVisibility(displayItems: Array<any>, paging: IPaging) {
    displayItems.forEach((item, index) => {
      const isWithinLowerRange = index >= paging.viewWindowStartIndex;
      const isWithinUpperRange = index < paging.viewWindowEndIndex;
      item.scrollVisibility = isWithinLowerRange && isWithinUpperRange;
    });
  }

  /**
   * Sets window below the top of the page to allow user to trigger additional scrolling events
   * @param paging Used to track and hold information related to paging
   */
  private _scrollWindow(paging: IPaging): void {
    if (paging.page > paging.viewWindowPages) {
      this._scrollService.scrollTo(0, 200);
    }
  }
}
