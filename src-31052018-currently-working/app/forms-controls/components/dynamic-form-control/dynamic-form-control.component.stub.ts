import {Component, EventEmitter, Input, Output} from '@angular/core';
import ChoiceConfig from '../../config/choice-config';

/**
 * A stub component for {@link DynamicFormControlComponent}
 */
@Component({selector: 'gpr-dynamic-form-control', template: ``})
export class DynamicFormControlStubComponent {
  @Input() value: any;
  @Input() id: string;
  @Input() type: string;
  @Input() choices: Array<ChoiceConfig>;
  @Input() isDisabled: boolean;
  @Input() isHidden: boolean;
  @Input() isValid: boolean;
  @Input() isRequired: boolean;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
}
