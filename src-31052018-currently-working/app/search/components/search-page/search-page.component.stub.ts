import {Component, EventEmitter, Output} from '@angular/core';

/**
 * A stub component for the {@link SearchPageComponent}
 */
@Component({
  selector: 'gpr-search-page',
  template: ``,
})
export class SearchPageStubComponent {
  @Output() showMoreResultsClick: EventEmitter<any> = new EventEmitter<any>();
}
