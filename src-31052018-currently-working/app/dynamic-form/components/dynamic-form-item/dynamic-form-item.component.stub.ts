import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import DataManager from '../../classes/data-manager';
import {IFormItemConfig} from '../../config/iFormItemConfig';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { IComment } from '../../../comment/interfaces/iComment';

/**
 * a stub component for {@link DynamicFormItemComponent}
 */
@Component({
  selector: `gpr-dynamic-form-item`,
  template: ``
})
export class DynamicFormItemStubComponent {
  /**
   * The configuration item
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
   * Contains flag if one exists for this question
   */
  @Input() questionFlag: IFlag;

  /**
   * contains comments if they already exist for this question
   */
  @Input() questionComments: IComment;

  /**
   * Alerts the parent component the question has been answered for the first time
   */
  @Output() answeredQuestion: EventEmitter<any> = new EventEmitter();
}
