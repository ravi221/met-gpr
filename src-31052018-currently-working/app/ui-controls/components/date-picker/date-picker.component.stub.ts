import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IDatePickerOutput} from '../../interfaces/iDatePickerOutput';

/**
 * Stub component for {@link DatePickerComponent}
 */
@Component({selector: 'gpr-date-picker', template: ``})
export class DatePickerStubComponent {
  @Input() required: boolean = false;
  @Input() dateRegex: string = '\\d{2}[-\/]\\d{2}[-\/]\\d{4}';
  @Input() initialValue: string | Date | Date[];
  @Input() placeholder: string = 'mm-dd-yyyy';
  @Input() mode: 'single' | 'multiple' | 'range';
  @Input() maxDate: string | Date;
  @Input() minDate: string | Date;
  @Input() dateFormat: string = 'MM-dd-yyyy';
  @Input() flatPickerDateFormat: string = 'm-d-Y';
  @Input() shouldAllowInput: boolean;
  @Output() dateChanged: EventEmitter<IDatePickerOutput> = new EventEmitter<IDatePickerOutput>();
}
