import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ISortOption} from 'app/core/interfaces/iSortOption';
import {ISortPreferences} from 'app/core/interfaces/iSortPreferences';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';

/**
 * Sort menu component that displays the available sort options based on inputs from parent component.
 * The sort menu does not do any actual sorting of data, it simply emits an event with new sort options.
 */
@Component({
  selector: 'gpr-sort-menu',
  template: `
    <div class="sort-menu tooltip-menu" *ngIf="sortOptions && sortOptions.length > 0">
      <a class="sort-menu-link"
         gprTooltip
         [displayCloseIcon]="false"
         [position]="'bottom'"
         [theme]="'white'"
         [tooltipContent]="menu">
        {{activeSortOption.label}}
        <i class="material-icons"
           [class.invert]="!activeSortOption.sortAsc">arrow_drop_down</i>
      </a>
      <gpr-tooltip-content [offsetX]="offsetX" #menu>
        <ul class="tooltip-options-list">
          <li *ngFor="let sortOption of sortOptions">
            <a [class.active]="sortOption.active" (click)="updateSort(sortOption)">{{sortOption.label}}</a>
          </li>
        </ul>
      </gpr-tooltip-content>
    </div>
  `,
  styleUrls: ['./sort-menu.component.scss']
})
export class SortMenuComponent implements OnInit {
  /**
   * Additional offset for popup box
   */
  @Input() offsetX: number = 0;

  /**
   * An array of sort options to display
   */
  @Input() sortOptions: ISortOption[] = [];

  /**
   * User sort preferences
   */
  @Input() sortPreferences: ISortPreferences;

  /**
   * Emit event when apply button is clicked
   */
  @Output() sortChange: EventEmitter<ISortOption> = new EventEmitter<ISortOption>();

  /**
   * Holds the currently selected sort value
   */
  public activeSortOption: ISortOption;

  /**
   * Creates the sort menu component
   * @param {TooltipService} _tooltipService
   */
  constructor(private _tooltipService: TooltipService) {
  }

  /**
   * On init, sort preferences and sort options
   */
  ngOnInit(): void {
    if (this.sortPreferences) {
      this._setSortPreferences();
    }

    // TODO - Once all components using this component are initialized using user preferences this if statement should be removed
    if (this.sortOptions) {
      this.activeSortOption = this.sortOptions.find(o => o.active);
    }
  }

  /**
   * Called to alert parent the sort was changed and close the tooltip
   */
  public updateSort(sortOption: ISortOption): void {
    if (sortOption.active) {
      this.activeSortOption.sortAsc = !this.activeSortOption.sortAsc;
    } else {
      this._updateActiveSortOption(sortOption);
    }
    this.sortChange.emit(this.activeSortOption);
    this._tooltipService.hideAllTooltips();
  }

  /**
   * updates the active sort option
   */
  private _updateActiveSortOption(newSortOption: ISortOption): void {
    this.sortOptions.forEach(o => o.active = false);
    newSortOption.active = true;
    newSortOption.sortAsc = true;
    this.activeSortOption = newSortOption;
  }

  /**
   * Sets active sort option and sort direction based on user profile preferences
   */
  private _setSortPreferences(): void {
    let index = this.sortOptions.findIndex(x => x.sortBy === this.sortPreferences.sortBy);
    this.sortOptions[index].active = true;
    this.sortOptions[index].sortAsc = this.sortPreferences.sortAsc;
    this.activeSortOption = this.sortOptions[index];
  }
}
