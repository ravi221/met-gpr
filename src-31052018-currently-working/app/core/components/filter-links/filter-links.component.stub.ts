import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IFilterLink} from '../../interfaces/iFilterLink';

/**
 * A stub component for {@link FilterLinksComponent}
 */
@Component({selector: 'gpr-filter-links', template: ``})
export class FilterLinksStubComponent {
  @Input() filterLinks: IFilterLink[] = [];
  @Output() filterLinkChange: EventEmitter<IFilterLink> = new EventEmitter<IFilterLink>();
}
