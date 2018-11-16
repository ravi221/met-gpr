import {Component} from '@angular/core';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {FormControl} from '../form-control';

/**
 * The {@link FormControl} implementation for the {@link TabsWithRadioComponent}
 */
@Component({
  selector: 'gpr-tabs-with-radio-control',
  template: `
    <gpr-tabs-with-radio [id]="id"
                         [isDisabled]="isDisabled"
                         [choices]="choices"
                         [value]="value"
                         (choiceChange)="onValueChanged($event.value)"></gpr-tabs-with-radio>
  `
})
@FormControlClassProviderService.Register(['tabs-with-radio'])
export class TabsWithRadioControlComponent extends FormControl {
  /**
   * Delegate construction to the superclass
   */
  constructor() {
    super();
  }
}
