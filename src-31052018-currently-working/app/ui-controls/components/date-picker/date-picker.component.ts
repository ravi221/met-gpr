import * as flatpickr from 'flatpickr';
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {DatePickerDefaults} from '../../services/date-picker-defaults.service';
import {isUndefined, isNil} from 'lodash';
import {DatePipe} from '@angular/common';
import {IDatePickerOutput} from '../../interfaces/iDatePickerOutput';


/**
 * A component which allows the selection of a date, wrapped around flatpickr JS library
 */
@Component({
  selector: 'gpr-date-picker',
  template: `
    <input type="text"
           class="gpr-date-picker"
           [class.invalid-date]="isInvalidDate"
           minlength="10"
           maxlength="10"
           (blur)="checkValue(this.value)"
           [(ngModel)]="value"
           [placeholder]="placeholder"
           gprValueAsDate/>
  `,
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  /**
   * Indicator used to determine if the user must enter a date
   */
  @Input() required: boolean = false;
  /**
   * A Regular Expression syntax for detecting a date
   * @type {string}
   */
  @Input() dateRegex: string = '\\d{2}[/\/]\\d{2}[/\/]\\d{4}';

  /**
   * Initial value for date picker
   */
  @Input() initialValue: string | Date | Date[];

  /**
   * Placeholder text shown in the input field when first rendered
   */
  @Input() placeholder: string = 'mm/dd/yyyy';

  /**
   * Select a single date, multiple dates or a date range.
   */
  @Input() mode: 'single' | 'multiple' | 'range';

  /**
   * The maximum date that a user can pick to (inclusive).
   */
  @Input() maxDate: string | Date;

  /**
   * The minimum date that a user can start picking from (inclusive).
   */
  @Input() minDate: string | Date;

  /**
   * A string of characters which are used to define how the date will be displayed in the input box.
   * The supported characters are defined in the table below.
   */
  @Input() dateFormat: string = 'MM/dd/yyyy';
  /**
   * A string of characters which are used to define how the date will be displayed in the input box.
   * The supported characters are defined in the table below.
   */
  @Input() flatPickerDateFormat: string = 'm/d/Y';

  /**
   * Allows the user to enter a date directly input the input field. By default, direct entry is disabled.
   */
  @Input() shouldAllowInput: boolean;

  /**
   * Gets triggered when the user selects a date, or changes the time on a selected date.
   */
  @Output() dateChanged: EventEmitter<IDatePickerOutput> = new EventEmitter<IDatePickerOutput>();

  /**
   * Property used to store the value of the textbox
   */
  public value: string;

  /**
   * Set when the date entered is validated
   */
  public isInvalidDate: boolean = false;

  /**
   * Private property that maintains the instance of the flatpickr object
   */
  private _instance: any;

  /**
   * Creates the date picker component, which wraps the flatpickr js library to give the user a datepicker control
   * @param {ElementRef} elRef
   * @param {DatePickerDefaults} defaults
   * @param {DatePipe} _datePipe
   */
  constructor(private elRef: ElementRef,
    private defaults: DatePickerDefaults,
    private _datePipe: DatePipe) {

  }

  /**
   * On init, nothing to do yet
   */
  ngOnInit() {
    if (typeof this.initialValue === 'string') {
      this.initialValue = new Date(this.initialValue);
    }
    if (!isNil(this.initialValue)) {
      this.value = this._datePipe.transform(this.initialValue, this.dateFormat);
    }
  }

  /**
   * Component needs to wait until after the view is rendered before it binds the calendar control
   */
  ngAfterViewInit(): void {
    if (typeof this.minDate === 'string') {
      this.minDate = new Date(this.minDate);
    }
    if (typeof this.maxDate === 'string') {
      this.maxDate = new Date(this.maxDate);
    }
    let options = {
      onChange: (selectedDates: Date[], dateString: string, instance: any) => {
        this.checkValue(dateString, selectedDates);
      },
      maxDate: this.maxDate,
      minDate: this.minDate,
      defaultDate: this.initialValue,
      allowInput: this.shouldAllowInput,
      mode: this.mode,
      dateFormat: this.flatPickerDateFormat
    };
    options = this._setDefaultOptions(options);
    this._instance = flatpickr(this.elRef.nativeElement.querySelector('input'), options);
  }

  /**
   * On change, update the date picker instance
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this._instance) {
      Object.keys(changes).forEach(inputKey => {
        this._instance.set(inputKey, (this as any)[inputKey]);
      });
    }
  }

  /**
   * On destroy, remove the instance of the flatpickr
   */
  ngOnDestroy(): void {
    if (this._instance) {
      this._instance.destroy();
    }
  }

  /**
   * Check value after entered to make sure it's a valid date
   * @param value value to check
   */
  public checkValue(value: string, selectedDates: Date[] = null): void {
    if (isNil(value) || value === '') {
      this.isInvalidDate = this.required;
      this.dateChanged.emit({dateString: '', flatpickerInstance: this._instance});
    } else {
      this.isInvalidDate = !Date.parse(value) || isNil(String(value).match(this.dateRegex));
      if (this.isInvalidDate) {
        this.value = value;
        this.dateChanged.emit({dateString: '', flatpickerInstance: this._instance});
        return;
      } else {
        this.value = this._datePipe.transform(value, this.dateFormat);
      }
      this.dateChanged.emit({selectedDates, dateString: this.value, flatpickerInstance: this._instance});
    }
  }

  /**
   * Sets the defaults for the options for properties that are undefined
   * @param options
   */
  private _setDefaultOptions(options: any): any {
    for (let option in options) {
      if (options.hasOwnProperty(option)) {
        const optionValue = options[option];
        if (isUndefined(optionValue)) {
          options[option] = this.defaults[option];
        }
      }
    }
    return options;
  }
}
