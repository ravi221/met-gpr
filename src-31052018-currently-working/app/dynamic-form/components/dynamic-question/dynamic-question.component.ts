import {Component, OnInit, OnDestroy, Input, EventEmitter, Output} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import QuestionConfig from '../../config/question-config';
import {IObservedModel} from '../../../entity/entity';
import {DataManagerSubscriptionType} from '../../enumerations/data-manager-subscription-type';
import {FormUtility} from '../../classes/form-utility';
import {DynamicFormBaseComponent} from '../dynamic-form-base/dynamic-form-base.component';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { DataType } from 'app/dynamic-form/enumerations/data-type';
import DataManager from 'app/dynamic-form/classes/data-manager';
import { IPlan } from 'app/plan/plan-shared/interfaces/iPlan';
import { IComment } from 'app/comment/interfaces/iComment';

/**
 * One question on a dynamic form.
 */
@Component({
  selector: 'gpr-dynamic-question',
  template: `
    <fieldset class="control-group" [disabled]="config.control.state?.isDisabled"
              [hidden]="config.control.state?.isHidden" [ngClass]="{'has-errors' : !config.control.state.isValid}">

      <table class="question-table">
        <tr>
          <td>
            <span class="control-number">{{index}}.</span>
          </td>
          <td>
            <label class="control-label">{{config.label}}&nbsp;
              <span [hidden]="!config.control.state?.isRequired">*</span></label>
          </td>
          <td>
            <gpr-dynamic-question-actions [config]="config" [model]="model" [questionFlag]="questionFlag" [questionComments]="questionComments"></gpr-dynamic-question-actions>
          </td>
        </tr>
      </table>
      <gpr-dynamic-form-control
        [value]="value"
        [config]="config"
        [id]="config.formItemId"
        [type]="config.control.type"
        [choices]="config.control.choices"
        [isDisabled]="config.control.state.isDisabled"
        [isHidden]="config.control.state.isHidden"
        [isValid]="config.control.state.isValid"
        [isRequired]="config.control.state.isRequired"
        (valueChanged)="onValueChanged($event)">
      </gpr-dynamic-form-control>
      <p class="control-errors" *ngFor="let message of config.control.state.messages">{{message}}</p>
    </fieldset>
  `,
  styleUrls: ['./dynamic-question.component.scss']
})
export class DynamicQuestionComponent extends DynamicFormBaseComponent implements OnInit, OnDestroy  {

  @Input() config: QuestionConfig;
  /**
   * The value of the question
   */
  public value: any;

  /**
   * A subscription to any model changes
   */
  private _subscription: Subscription;

  /**
   * On init, subscribe to any model changes and update the question's value
   */
  ngOnInit() {
    if (this.model) {
      this._subscription = this.model.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:${this.config.formItemId}`, (model: IObservedModel) => this.value = model.currentValue);

      if (this.config && this.config.formItemId) {
        this.value = this.model.getById(this.config.formItemId);
      }
    }
  }

  /**
   * On destroy, unsubscribe from any subscriptions
   */
  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  /**
   * Function called when the value if changed
   * Checks if the question has not been answered and alerts the parent if thats the case
   * @param question
   */
  public onValueChanged(question): void {
    if (this.model) {
      if (FormUtility.isSchemaTypeNumber(this.config.schema.type)  && typeof question.value === DataType.STRING) {
        question.value = parseInt(question.value);
      }
      this.model.setById(question.id, question.value);
    }
  }
}
