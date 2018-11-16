import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * A stub component for {@link SearchBarComponent}
 */
@Component({selector: 'gpr-search-bar', template: ``})
export class SearchBarStubComponent {
  @Input() minSearchLength: number = 0;
  @Input() delayMs: number = 0;
  @Input() placeholder: string = '';
  @Output() searchTriggered: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchTyped: EventEmitter<string> = new EventEmitter<string>();
}
