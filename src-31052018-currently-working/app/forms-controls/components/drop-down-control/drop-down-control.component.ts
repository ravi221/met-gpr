import {Component} from '@angular/core';
import {FormControl} from '../form-control';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';

/**
 * A wrapper around a basic html select.  This exposes the same API
 * as the other form controls, so it should always be used in place
 * of the basic html control.
 *
 * ```html
 * <gpr-drop-down-control
 *   [value]="myValue"
 *   [choices]="myChoices"
 *   [id]="'a-unique-id'"
 *   (valueChanged)="logNewValue($event)">
 * </gpr-drop-down-control>`
 * ```
 *
 * ```typescript
 * export class MyDropDownExampleComponent {
 *   myValue: string;
 *
 *   myChoices: ChoiceConfig[] = [{
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
  selector: 'gpr-drop-down-control',
  template: `
    <div class="drop-down-control">
      <gpr-drop-down [id]="id"
                     [isDisabled]="isDisabled"
                     [value]="value"
                     [choices]="choices"
                     (choiceChange)="onValueChanged($event.value)"></gpr-drop-down>
    </div>
  `
})
@FormControlClassProviderService.Register(['drop-down', 'select'])
export class DropDownControlComponent extends FormControl {
  /**
   * Delegate construction to the superclass
   */
  constructor() {
    super();
  }
}
