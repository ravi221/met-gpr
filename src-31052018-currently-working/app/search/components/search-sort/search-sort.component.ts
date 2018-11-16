import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, OnInit} from '@angular/core';
import {ISortOption} from '../../../core/interfaces/iSortOption';
import {SearchSortService} from '../../services/search-sort.service';
import {ISearchState} from '../../interfaces/iSearchState';
import {SearchTypes} from '../../enums/SearchTypes';
import {isNil} from 'lodash';

/**
 * Creates a sort component used to sort search results on the {@link SearchLandingComponent}
 */
@Component({
  selector: 'gpr-search-sort',
  template: `
    <aside class="search-sort" *ngIf="showSort">
      <gpr-sort-menu class="pull-right"
                     [sortOptions]="sortOptions"
                     (sortChange)="onSortChange($event)"></gpr-sort-menu>
    </aside>
  `,
  styleUrls: ['./search-sort.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchSortComponent implements OnInit, OnChanges {

  /**
   * The current search state, used for updating search options
   */
  @Input() searchState: ISearchState;

  /**
   * Event emitter when the sort has changed
   * @type {EventEmitter<ISortOption>}
   */
  @Output() sortChange: EventEmitter<ISortOption> = new EventEmitter<ISortOption>();

  /**
   * Indicates if to display the sort menu
   * @type {boolean}
   */
  public showSort: boolean = false;

  /**
   *  A list of sort options for the sort menu
   * @type {Array}
   */
  public sortOptions: ISortOption[] = [];

  /**
   * Creates the search sort
   * @param {SearchSortService} _searchSortService
   */
  constructor(private _searchSortService: SearchSortService) {
  }

  /**
   * On init, set up the sort options based on the search state
   */
  ngOnInit(): void {
    this._updateSort();
  }

  /**
   * On changes, update the sort options based on the search state
   */
  ngOnChanges(): void {
    this._updateSort();
  }

  /**
   * Emit an event when the sort option has changed
   * @param {ISortOption} sortOption
   */
  public onSortChange(sortOption: ISortOption): void {
    this.sortChange.emit(sortOption);
  }

  /**
   * Gets the sort options based on the search type, and emits the initial sort
   * @param {SearchTypes} searchType
   * @returns {ISortOption[]}
   * @private
   */
  private _getSortOptionsBySearchType(searchType: SearchTypes): ISortOption[] {
    const sortOptions = [...this._searchSortService.getSortOptionsBySearchType(searchType)];
    const activeSortOptions = sortOptions.filter(s => s.active);
    if (activeSortOptions.length === 1) {
      this.sortChange.emit(activeSortOptions[0]);
    }
    return sortOptions;
  }

  /**
   * Updates the sort visibility and options
   * @private
   */
  private _updateSort(): void {
    if (!isNil(this.searchState)) {
      this.showSort = this._searchSortService.showSortBySearchState(this.searchState);
      this.sortOptions = this._getSortOptionsBySearchType(this.searchState.searchType);
    } else {
      this.showSort = false;
      this.sortOptions = [];
    }
  }
}
