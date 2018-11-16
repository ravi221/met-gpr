import {Component, OnInit} from '@angular/core';
import {FormControl} from '../form-control';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {isNil} from 'lodash';

/**
 * A wrapper around a basic html checkbox.  This exposes the same API
 * as the other form controls, so it should always be used in place
 * of the basic html control.
 *
 * ```html
 * <gpr-checkbox
 *   [value]="myValue"
 *   [choices]="myChoices"
 *   [id]="'a-unique-id'"
 *   (valueChanged)="logNewValue($event)">
 * </gpr-checkbox>`
 * ```
 *
 * ```typescript
 * export class MyCheckboxExampleComponent {
 *   myValue: string;
 *
 *   myChoices: ChoiceConfig = [{
 *     value: 'A',
 *     label: 'Apples'
 *   }, {
 *     value: 'B',
 *     label: 'Bananas'
 *   }];
 *
 *   logNewValue(newValue: string) {
 *     console.log(newValue);
 *   }
 * }
 * ```
 */
@Component({
  selector: 'gpr-checkbox',
  template: `
    <div class="checkbox-group">
      <div class="checkbox-control" *ngFor="let choice of choices" [hidden]="choice.state?.isHidden">
        <input type="checkbox"
               [id]="id + choice.value"
               [name]="id + 'Group'"
               [value]="choice.value"
               [checked]="value && value.includes(choice.value)"
               [disabled]="isDisabled || choice.state?.isDisabled"
               (change)="onValueChanged({ isChecked:$event.target.checked, value:choice.value })"/>
        <label [for]="id + choice.value">{{choice.label}}</label>
      </div>
    </div>
  `
})
@FormControlClassProviderService.Register(['checkbox'])
export class CheckboxComponent extends FormControl implements OnInit {


  /**
   * On init, default the value to an array
   */
  ngOnInit(): void {
    if (isNil(this.value)) {
      this.value = [];
    }
  }

  /**
   * Delegate construction to the superclass
   */
  constructor() {
    super();
  }

  /**
   * The value from this component is an array whose inner values
   * change based on the checkboxs "checked" status
   * So we need to push/remove items depending on the checked state
   * @param {any} eventData
   */
  public onValueChanged(eventData: any): void {
    let index = this.value.indexOf(eventData.value);
    if (eventData.isChecked === false) {
      this.value.splice(index, 1);
    } else if (eventData.isChecked === true && index === -1) {
      this.value.push(eventData.value);
    }
    this.valueChanged.emit(this);
  }
}
