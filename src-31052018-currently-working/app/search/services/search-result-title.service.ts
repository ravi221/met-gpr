import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IHighlightText} from '../interfaces/iHighlightText';

/**
 * A class to determine how to highlight a search result title
 */
@Injectable()
export class SearchResultTitleService {

  /**
   * The current search field
   * @type {string}
   * @private
   */
  private _searchField: string = '';

  /**
   * Sets the search field, used for highlighting a search result title
   * @param {string} searchField
   */
  public setSearchField(searchField: string): void {
    this._searchField = searchField;
  }

  /**
   * Splits the given title into highlighted parts, based on the search field
   * @param {string} title
   * @returns {any}
   */
  public highlight(title: string): IHighlightText {
    if (!this._isNonEmptyString(title)) {
      return this._getDefaultHighlight('');
    }

    if (!this._isNonEmptyString(this._searchField)) {
      return this._getDefaultHighlight(title);
    }

    const searchField = this._searchField.toLowerCase();
    const newTitle = title.toLowerCase();
    const startHighlightIndex = newTitle.indexOf(searchField);
    const endHighlightIndex = startHighlightIndex + searchField.length;

    if (startHighlightIndex === -1) {
      return this._getDefaultHighlight(title);
    }

    return <IHighlightText>{
      preText: title.substring(0, startHighlightIndex),
      text: title.substring(startHighlightIndex, endHighlightIndex),
      postText: title.substring(endHighlightIndex)
    };
  }

  /**
   * Gets the default highlighting, without any parts of the title highlighted
   * @param {string} title
   * @returns {any}
   * @private
   */
  private _getDefaultHighlight(title: string): IHighlightText {
    return <IHighlightText>{
      preText: title,
      text: '',
      postText: ''
    };
  }

  /**
   * Tests if the given string is non-empty
   * @param {string} str
   * @private
   */
  private _isNonEmptyString(str: string): boolean {
    if (isNil(str)) {
      return false;
    }
    return str.length > 0;
  }
}
