import {Component, Input} from '@angular/core';
import {ISearchState} from '../../interfaces/iSearchState';

/**
 * A stub component for {@link SearchTitleComponent}
 */
@Component({selector: 'gpr-search-title', template: ``})
export class SearchTitleStubComponent {
  @Input() searchState: ISearchState;
}
