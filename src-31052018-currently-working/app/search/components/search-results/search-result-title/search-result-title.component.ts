import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {SearchResultTitleService} from '../../../services/search-result-title.service';
import {IHighlightText} from '../../../interfaces/iHighlightText';

/**
 * Component to render the search result title, including highlighting based on search
 *
 * Usage:
 * ```html
 *    <gpr-search-result-title [title]="title"></gpr-search-result-title>
 * ```
 */
@Component({
  selector: 'gpr-search-result-title',
  template: `
    <h1 class="search-result-title">
      <span>{{highlight.preText}}</span>
      <span class="highlight">{{highlight.text}}</span>
      <span>{{highlight.postText}}</span>
    </h1>
  `,
  styleUrls: ['./search-result-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultTitleComponent implements OnInit, OnChanges {

  /**
   * The search result title
   */
  @Input() title: string = '';

  /**
   * Shows the highlighting for the title, with highlight.text being the highlighted portion
   */
  public highlight: IHighlightText = {
    preText: '',
    text: '',
    postText: ''
  };

  /**
   * Creates the search result title
   * @param {SearchResultTitleService} _searchResultTitleService
   */
  constructor(private _searchResultTitleService: SearchResultTitleService) {
  }

  /**
   * On init, create the highlighting for the search result title
   */
  ngOnInit(): void {
    this._updateHighlight();
  }

  /**
   * On changes, update the highlight
   */
  ngOnChanges(): void {
    this._updateHighlight();
  }

  /**
   * Updates the highlight for the current title
   * @private
   */
  private _updateHighlight(): void {
    this.highlight = this._searchResultTitleService.highlight(this.title);
  }
}
