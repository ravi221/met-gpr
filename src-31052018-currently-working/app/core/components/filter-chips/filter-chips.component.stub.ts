import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IFilterChip} from '../../interfaces/iFilterChip';

/**
 * A stub component for {@link FilterChipsComponent}
 */
@Component({selector: 'gpr-filter-chips', template: ``})
export class FilterChipsStubComponent {
  @Input() filterChips: IFilterChip[] = [];
  @Output() remove: EventEmitter<IFilterChip> = new EventEmitter<IFilterChip>();
}
