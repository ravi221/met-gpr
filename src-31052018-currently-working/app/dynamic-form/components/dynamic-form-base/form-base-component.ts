import {IFormItemConfig} from '../../config/iFormItemConfig';
import DataManager from '../../classes/data-manager';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import {Input} from '@angular/core';
import {FormControl} from '../../../forms-controls/components/form-control';

export abstract class FormBaseComponent {
  /**
   * The input configuration. All will extend IFormItemConfig
   */
  @Input() config: IFormItemConfig;
  /**
   * An {@link DataManager} wrapping the model object to be edited through the form
   */
  @Input() model: DataManager;

  /**
   * The ordinal index of the item in the form
   */
  @Input() index: number;

  /**
   * Plan object, used for information to create flags and comments
   */
  @Input() plan: IPlan;

  /**
   * Customer id used for information to create flags and comments
   */
  @Input() customerNumber: number;

  /**
   * Handles values being changed. Implementation will vary depending on the type of form
   */
  public abstract onValueChanged(question: FormControl): void;
}
