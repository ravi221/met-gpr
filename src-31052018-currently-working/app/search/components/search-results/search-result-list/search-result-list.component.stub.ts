import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISearchState} from '../../../interfaces/iSearchState';

/**
 * A stub component for {@link SearchResultListComponent}
 */
@Component({selector: 'gpr-search-result-list', template: ``})
export class SearchResultListStubComponent {
  @Input() searchState: ISearchState;
  @Output() attributeDetailsClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() customerClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() planClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() showMoreResultsClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() showMoreResultsScroll: EventEmitter<any> = new EventEmitter<any>();
}
