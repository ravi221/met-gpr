import {EventEmitter, Input, Output} from '@angular/core';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import {IFormItemConfig} from '../../config/iFormItemConfig';
import DataManager from '../../classes/data-manager';
import {FormBaseComponent} from './form-base-component';
import {FormControl} from '../../../forms-controls/components/form-control';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { IComment } from '../../../comment/interfaces/iComment';

/**
 * An abstract representation of a component that will go on the form. Used with the DynamicFormFactory to create components for forms items
 */
export abstract class DynamicFormBaseComponent extends FormBaseComponent {

  /**
   * Contains flag if one exists for this question
   */
  @Input() questionFlag: IFlag;

  /**
   * contains comments if they already exist for this question
   */
  @Input() questionComments: IComment;

  /**
   * Function called when the value if changed
   * Checks if the question has not been answered and alerts the parent if thats the case
   * @param id
   */
  protected _hasAnswer(id: string): boolean {
    return this.model.getById(id);
  }

  /**
   * Function called when the value is changed
   * Checks if the question has not been answered and alerts the parent if that's the case
   * @param question
   */
  public onValueChanged(question: FormControl): void {
    if (this.model) {
      this.model.setById(question.id, question.value);
    }
  }
}
