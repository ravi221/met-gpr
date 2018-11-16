import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * A stub component for {@link ToggleComponent}
 */
@Component({selector: 'gpr-toggle', template: ``})
export class ToggleStubComponent {
  @Input() label: string = '';
  @Output() toggle: EventEmitter<boolean> = new EventEmitter<boolean>();
}
