import {Component} from '@angular/core';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {FormControl} from '../form-control';

/**
 * Creates a set of tabs to select from, same functionality as radio buttons
 */
@Component({
  selector: 'gpr-tabs-control',
  template: `
    <gpr-tabs [id]="id"
              [choices]="choices"
              [isDisabled]="isDisabled"
              [value]="value"
              (choiceChange)="onValueChanged($event.value)"></gpr-tabs>
  `
})
@FormControlClassProviderService.Register(['tabs', 'tabs-control'])
export class TabsControlComponent extends FormControl {
  /**
   * Delegate construction to the superclass
   */
  constructor() {
    super();
  }
}
