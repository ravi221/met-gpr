import {Component, OnInit} from '@angular/core';
import {FormControl} from '../form-control';
import {isEmpty, isNil} from 'lodash';
import DateTime from '../../../core/models/date-time';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {IDatePickerOutput} from '../../../ui-controls/interfaces/iDatePickerOutput';

/**
 * A basic date input for the GPR application
 *
 * ```html
 * <gpr-datepicker
 *   [value]="myValue"
 *   [id]="'a-unique-id'"
 *   (valueChanged)="logNewValue($event)">
 * </gpr-datepicker>`
 * ```
 *
 * ```typescript
 * export class MyDatepickerExampleComponent {
 *   myDateString: string;
 *
 *   logNewValue(newValue: string) {
 *     console.log(newValue);
 *   }
 * }
 * ```
 */
@Component({
  selector: 'gpr-date-picker-control',
  template: `
  <div class="date-picker-control">
    <gpr-date-picker allowInput="false"
      (dateChanged)="onValueChanged($event)"></gpr-date-picker>
  </div>
  `
})
@FormControlClassProviderService.Register(['date-picker', 'date'])
export class DatePickerControlComponent extends FormControl implements OnInit {
  /**
   * Delegate construction to the superclass
   */
  constructor() {
    super();
  }

  /**
   * On init, normalize the date
   */
  ngOnInit(): void {
    this.value = normalizeDate(this.value);
  }

  /**
   * The value can come to this component either as a string or as
   * a {@link DateTime}.  We need to ensure that the type of the
   * value is consistent.
   */
  onValueChanged(value: IDatePickerOutput) {
    this.value = normalizeDate(value.dateString);
    this.valueChanged.emit(this);
  }
}

/**
 * This must be defined outside the class because otherwise, the constructor function
 * DatePickerComponent will not be assignable to type Type<FormControl> since it has
 * additional properties.
 */
function normalizeDate(value: string): any {
  if (isNil(value) || isEmpty(value)) {
    return value;
  } else {
    return new DateTime(value).asMoment().format('MM/DD/YYYY');
  }
}
