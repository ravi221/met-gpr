import {Component, EventEmitter, Output} from '@angular/core';

/**
 * A stub component for {@link FilterMenuComponent}
 */
@Component({selector: 'gpr-filter-menu', template: ``})
export class FilterMenuStubComponent {
  @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();
}
