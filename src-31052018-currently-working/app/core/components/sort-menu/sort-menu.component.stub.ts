import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISortOption} from 'app/core/interfaces/iSortOption';
import {ISortPreferences} from 'app/core/interfaces/iSortPreferences';

/**
 * A stub component for {@link SortMenuComponent}
 */
@Component({selector: 'gpr-sort-menu', template: ``})
export class SortMenuStubComponent {
  @Input() offsetX: number = 0;
  @Input() sortOptions: ISortOption[] = [];
  @Input() sortPreferences: ISortPreferences;
  @Output() sortChange: EventEmitter<ISortOption> = new EventEmitter<ISortOption>();
}
