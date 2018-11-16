import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {SearchTitleService} from '../../services/search-title.service';
import {ISearchState} from '../../interfaces/iSearchState';

/**
 * Creates the search title to show what the user is currently searching within
 */
@Component({
  selector: 'gpr-search-title',
  template: `
    <h2 class="search-title">{{searchTitle}}</h2>
  `,
  styles: ['.search-title { padding: 0 15px; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchTitleComponent implements OnChanges {

  /**
   * The current search state
   */
  @Input() searchState: ISearchState;

  /**
   * The current search you are performing
   */
  public searchTitle: string = '';

  /**
   * Creates the search title component
   * @param {SearchTitleService} _searchTitleService
   */
  constructor(private _searchTitleService: SearchTitleService) {
  }

  /**
   * On changes, update the search title
   */
  ngOnChanges(): void {
    if (this.searchState) {
      this.searchTitle = this._searchTitleService.getSearchTitleBySearchState(this.searchState);
    }
  }
}
