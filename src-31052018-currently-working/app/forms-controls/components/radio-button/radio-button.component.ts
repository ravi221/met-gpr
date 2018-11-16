import {Component} from '@angular/core';
import {FormControl} from '../form-control';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';

/**
 * A wrapper around a basic html radio button group.  This exposes
 * the same API as the other form controls, so it should always be
 * used in place of the basic html control.
 *
 * ```html
 * <gpr-radio-button
 *   [value]="myValue"
 *   [choices]="myChoices"
 *   [id]="'a-unique-id'"
 *   (valueChanged)="logNewValue($event)">
 * </gpr-radio-button>`
 * ```
 *
 * ```typescript
 * export class MyRadioButtonExampleComponent {
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
  selector: 'gpr-radio-button',
  template: `
    <div class="radio-group">
      <div class="radio-control" *ngFor="let choice of choices" [hidden]="choice.state?.isHidden">
        <input class="radio"
               type="radio"
               [id]="id + choice.value"
               [value]="choice.value"
               (change)="onValueChanged(choice.value)"
               [checked]="value == choice.value"
               [disabled]="isDisabled || choice.state?.isDisabled"/>
        <label [for]="id + choice.value">{{choice.label}}</label>
      </div>
    </div>
  `
})
@FormControlClassProviderService.Register(['radio', 'radio-button'])
export class RadioButtonComponent extends FormControl {
  /**
   * Delegate construction to the superclass
   */
  constructor() {
    super();
  }
}
