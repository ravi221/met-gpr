import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IFilterLink} from '../../interfaces/iFilterLink';
import {ISortOption} from '../../interfaces/iSortOption';

/**
 * A stub component for {@link FilterBarComponent}
 */
@Component({selector: 'gpr-filter-bar', template: ``})
export class FilterBarStubComponent {
  @Input() filterLinks: IFilterLink[] = [];
  @Input() filterMenuProperties: string[] = [];
  @Input() showFilterLinks = true;
  @Input() showFilterMenu = true;
  @Input() showSortMenu = false;
  @Input() sortOptions: ISortOption[];
  @Output() filterLinkChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterMenuChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() sortChange: EventEmitter<ISortOption> = new EventEmitter<ISortOption>();
}
