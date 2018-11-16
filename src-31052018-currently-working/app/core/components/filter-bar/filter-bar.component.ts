import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {IFilterLink} from '../../interfaces/iFilterLink';
import {ISortOption} from '../../interfaces/iSortOption';
import {IFilterChip} from '../../interfaces/iFilterChip';

/**
 * Generic filter bar component that displays the available filter and sort options based on inputs from parent component.
 * The filter bar does not do any actual filtering of data, it simply emits an event with new filtered options.
 */
@Component({
  selector: 'gpr-filter-bar',
  template: `
    <div class="filter-bar">
      <div class="row">
        <div *ngIf="showFilterLinks" class="col-sm-18">
          <gpr-filter-links [filterLinks]="filterLinks"
                            (filterLinkChange)="updateActiveLink($event)"></gpr-filter-links>
          <gpr-filter-links *ngIf="activeLink && activeLink.subLinks.length > 0"
                            [filterLinks]="activeLink.subLinks"
                            (filterLinkChange)="updateActiveSubLink($event)"></gpr-filter-links>
        </div>
        <div class="col-sm-6">
          <div class="menus">
            <div *ngIf="showFilterMenu" class="menu">
              <gpr-filter-menu (filterChange)="handleFilterMenuChange($event)">
                <ng-container ngProjectAs="filter">
                  <ng-content select="filter"></ng-content>
                </ng-container>
              </gpr-filter-menu>
            </div>
            <div *ngIf="showSortMenu" class="menu">
              <gpr-sort-menu [sortOptions]="sortOptions"
                             (sortChange)="applySort($event)"></gpr-sort-menu>
            </div>
          </div>
        </div>
      </div>
      <div class="row" *ngIf="showFilterMenu">
        <div class="col-sm-24">
          <gpr-filter-chips [filterChips]="filterChips" (remove)="handleFilterChipRemove($event)"></gpr-filter-chips>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit, OnChanges {

  /**
   * The collection of filter links to display horizontal for user to select on.
   * @type {Array}
   */
  @Input() filterLinks: IFilterLink[] = [];

  /**
   * A list of properties to track from the filter menu
   */
  @Input() filterMenuProperties: string[] = [];

  /**
   * Indicates whether to render the filter bar.
   * @type {boolean}
   */
  @Input() showFilterLinks = true;

  /**
   * Indicates whether to render the filter menu link.
   * @type {boolean}
   */
  @Input() showFilterMenu = true;

  /**
   * Indicates whether to render the sort menu link.
   * @type {boolean}
   */
  @Input() showSortMenu = false;

  /**
   * List of sort options
   * @type {string[]}
   */
  @Input() sortOptions: ISortOption[] = [];

  /**
   * Event emitter to emit event to parent component whenever the filter link has changed.
   * @type {EventEmitter<any>}
   */
  @Output() filterLinkChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event emitter to emit event to parent component whenever the filter menu options have changed.
   * @type {EventEmitter<any>}
   */
  @Output() filterMenuChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event emitter to emit event to parent component whenever sort has been changed.
   * @type {EventEmitter<any>}
   */
  @Output() sortChange: EventEmitter<ISortOption> = new EventEmitter<ISortOption>();

  /**
   * The current active link
   */
  public activeLink: IFilterLink;

  /**
   * A list of filter chips to display the current filtered values
   * @type {Array}
   */
  public filterChips: IFilterChip[] = [];

  /**
   * The current filter object
   */
  private _filter: any = {};

  /**
   * On init, update the active link
   */
  ngOnInit(): void {
    this._updateActiveLink();
  }

  /**
   * On changes, update the active link
   */
  ngOnChanges(): void {
    this._updateActiveLink();
  }

  /**
   * Emits the sort event to parent component
   */
  public applySort(sortOption: ISortOption): void {
    this.sortChange.emit(sortOption);
  }

  /**
   * Emits the filter event to parent component
   */
  public handleFilterMenuChange(filter: any): void {
    this._filter = filter;
    this.filterChips = this._buildFilterChips(filter);
    this.filterMenuChange.emit(filter);
  }

  /**
   * Handles when a filter chip is removed
   * @param {IFilterChip} filterChip
   */
  public handleFilterChipRemove(filterChip: IFilterChip): void {
    const property = filterChip.property;
    this._filter[property] = '';
    this.handleFilterMenuChange(this._filter);
  }

  /**
   * Handles the when a link is clicked.
   */
  public updateActiveLink(filterLink: IFilterLink): void {
    this.activeLink = filterLink;
    this._resetSubLinks();
    this.filterLinkChange.emit(filterLink.filter);
  }

  /**
   * Handles the when a sub-link is clicked.
   */
  public updateActiveSubLink(filterSubLink: IFilterLink): void {
    this.filterLinkChange.emit(filterSubLink.filter);
  }

  /**
   * Builds the filter chips based on the current filters applied
   * @param filter
   * @private
   */
  private _buildFilterChips(filter: any): IFilterChip[] {
    const filterChips: IFilterChip[] = [];
    this.filterMenuProperties.forEach((filterMenuProperty: string) => {
      const value = filter[filterMenuProperty];
      if (value) {
        filterChips.push({property: filterMenuProperty, value});
      }
    });
    return filterChips;
  }

  /**
   * Updates the active link
   * @private
   */
  private _updateActiveLink(): void {
    this.activeLink = this.filterLinks.find(filterLink => filterLink.active);
  }

  /**
   * Resets all sub-links to inactive
   */
  private _resetSubLinks(): void {
    this.activeLink.subLinks.forEach(subLink => subLink.active = false);
  }
}
