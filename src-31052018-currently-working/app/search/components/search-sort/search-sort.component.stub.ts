import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISortOption} from '../../../core/interfaces/iSortOption';
import {ISearchState} from '../../interfaces/iSearchState';

/**
 * A stub component for {@link SearchSortComponent}
 */
@Component({selector: 'gpr-search-sort', template: ``})
export class SearchSortStubComponent {
  @Input() searchState: ISearchState;
  @Output() sortChange: EventEmitter<ISortOption> = new EventEmitter<ISortOption>();
}
