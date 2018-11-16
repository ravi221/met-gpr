import {Component, OnInit} from '@angular/core';
import {FormControl} from '../form-control';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';

/**
 * A wrapper around a basic html input.  This exposes the same API
 * as the other form controls, so it should always be used in place
 * of the basic html control.
 *
 * ```html
 * <gpr-text-input
 *   [value]="myValue"
 *   [id]="'a-unique-id'"
 *   (valueChanged)="logNewValue($event)">
 * </gpr-text-input>
 * ```
 *
 * ```typescript
 * export class MyTextInputExampleComponent {
 *   myValue: string;
 *
 *   logNewValue(newValue: string) {
 *     console.log(newValue);
 *   }
 * }
 * ```
 */
@Component({
  selector: 'gpr-text-input',
  template: `<input [id]="id" class="input-control"
                    [value]="value"
                    [type]="type"
                    [gprMinAttribute]="type"
                    [disabled]="isDisabled"
                    (change)="onValueChanged($event.target.value)">`
})
@FormControlClassProviderService.Register(['text', 'number', 'input', 'text-input'])
export class TextInputComponent extends FormControl implements OnInit {
  /**
   * Delegate construction to the superclass
   */
  constructor() {
    super();
  }

  /**
   * On init, if the value is undefined, set the value to be an empty string
   */
  ngOnInit() {
    if (this.config && this.config.schema && this.config.schema.pattern) {
      this.regex = new RegExp(this.config.schema.pattern);
    }
    if (typeof this.value === 'undefined') {
      this.value = '';
    }
  }

  /**
   * A common handler for value changes.  This can be called from
   * the child components to fire the `valueChanged` event.
   */
  public onValueChanged(value): void {
    this.value = value;
    if (!this.regex) {
      this.valueChanged.emit(this);
      return;
    }
    const isValid = this.regex.test(this.value);
    if (isValid) {
      this.valueChanged.emit(this);
      return;
    }
    const errorMessage = this.config.schema.patternDescription ? this.config.schema.patternDescription : 'Invalid Format';
      if (this.config.control.state.errors && this.config.control.state.errors.length > 0) {
        const hasErrorMessage = this.config.control.state.errors.includes(errorMessage);
        if (hasErrorMessage) {
          return;
        }
        this.config.control.state.errors.push(errorMessage);
      } else {
        this.config.control.state.errors = [errorMessage];
      }
  }
}
