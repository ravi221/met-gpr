import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * A stub component for {@link SearchAttributeListComponent}
 */
@Component({selector: 'gpr-search-attribute-list', template: ``})
export class SearchAttributeListStubComponent {
  @Input() attributes: any[] = [];
  @Output() attributeDetailsClick: EventEmitter<any> = new EventEmitter<any>();
}
