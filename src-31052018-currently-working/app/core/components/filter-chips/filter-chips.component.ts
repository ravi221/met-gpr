import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {IFilterChip} from '../../interfaces/iFilterChip';
import {pull} from 'lodash';

/**
 * Represents a a list of filter chips
 */
@Component({
  selector: 'gpr-filter-chips',
  template: `
    <ul class="filter-chips">
      <li *ngFor="let filterChip of filterChips" class="filter-chip">
        <span class="filter-chip-value">{{filterChip.value}}</span>
        <span class="filter-chip-remove"
              (click)="handleRemoveChip(filterChip)"><gpr-icon [name]="'close-modal'"></gpr-icon></span>
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./filter-chips.component.scss']
})
export class FilterChipsComponent {
  /**
   * The filter chip to display
   * @type {string}
   */
  @Input() filterChips: IFilterChip[] = [];

  /**
   * An event emitter triggered when the user clicks the remove chip icon
   * @type {EventEmitter<void>}
   */
  @Output() remove: EventEmitter<IFilterChip> = new EventEmitter<IFilterChip>();

  /**
   * Handles when the remove icon is clicked
   * @param {IFilterChip} filterChip
   */
  public handleRemoveChip(filterChip: IFilterChip): void {
    pull(this.filterChips, filterChip);
    this.remove.emit(filterChip);
  }
}
