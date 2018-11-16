import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SearchByOptions} from '../../enums/SearchByOptions';
import {SearchForOptions} from '../../enums/SearchForOptions';
import {ISearchState} from '../../interfaces/iSearchState';

/**
 * A stub component for {@link SearchOptionsBarComponent}
 */
@Component({selector: 'gpr-search-options-bar', template: ``})
export class SearchOptionsBarStubComponent {
  @Input() searchState: ISearchState;
  @Output() searchByOptionChange: EventEmitter<SearchByOptions> = new EventEmitter<SearchByOptions>();
  @Output() searchForOptionChange: EventEmitter<SearchForOptions> = new EventEmitter<SearchForOptions>();
}
