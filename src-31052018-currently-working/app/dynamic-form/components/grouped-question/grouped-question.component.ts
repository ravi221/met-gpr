import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DynamicFormBaseComponent} from '../dynamic-form-base/dynamic-form-base.component';
import {GroupedQuestionConfig} from '../../config/grouped-question-config';
import {Subscription} from 'rxjs/Subscription';
import {DataManagerSubscriptionType} from '../../enumerations/data-manager-subscription-type';
import {IObservedModel} from '../../../entity/entity';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';
import {FormItemType} from '../../enumerations/form-items-type';
import QuestionConfig from '../../config/question-config';
import {DataType} from '../../enumerations/data-type';
import {FormUtility} from '../../classes/form-utility';
import { IFlag } from 'app/flag/interfaces/iFlag';

/**
 * Displays all members of a grouped question
 */
@Component({
  selector: `gpr-grouped-question`,
  template: `
    <fieldset class="control-group" >
      <ul class="control-list">
        <table class="question-table">
          <tr>
            <td>
              <label class="control-label">{{config.label}}&nbsp;</label>
            </td>
          </tr>
        </table>
        <li *ngFor="let questionConfig of config.formItems; let i = index;">
          <div *ngIf="questionConfig.getType() === formItemTypeSingle; else groupBlock">
            <fieldset class="control-group grouped-question" [disabled]="questionConfig.control.state?.isDisabled"
                      [hidden]="questionConfig.control.state?.isHidden" [ngClass]="{'has-errors' : !questionConfig.control.state.isValid}">
              <table class="question-table">
                <tr>
                  <td>
                    <span class="control-number">{{index + i}}.</span>
                  </td>
                  <td>
                    <label class="control-label">{{questionConfig.label}}&nbsp;
                     <span [hidden]="!questionConfig.control.state?.isRequired">*</span></label>
                  </td>
                </tr>
              </table>
              <gpr-dynamic-form-control
                [value]="values.get(questionConfig.formItemId)"
                [config]="questionConfig"
                [id]="questionConfig.formItemId"
                [type]="questionConfig.control.type"
                [choices]="questionConfig.control.choices"
                [isDisabled]="questionConfig.control.state?.isDisabled"
                [isHidden]="questionConfig.control.state?.isHidden"
                [isValid]="questionConfig.control.state?.isValid"
                [isRequired]="questionConfig.control.state?.isRequired"
                (valueChanged)="onValueChanged($event, questionConfig)">
              </gpr-dynamic-form-control>
              <p class="control-errors" *ngFor="let message of questionConfig.control.state.messages">{{message}}</p>
            </fieldset>
          </div>
            <!-- default to dynamic form item here as dynamic form items will do the grouped case and the missing group case-->
            <ng-template #groupBlock>
              <gpr-dynamic-form-item
                 [config]="questionConfig"
                 [index]="index + i"
                 [model]="model"
                 [plan]="plan"
                 [customerNumber]="customerNumber"
                 [questionFlag]="questionflag"
                 [questionComments]="questionComments">
              </gpr-dynamic-form-item>
            </ng-template>
        </li>
      </ul>
    </fieldset>`,
  styleUrls: ['./grouped-question.component.scss']

})
export class GroupedQuestionComponent extends DynamicFormBaseComponent implements OnInit, OnDestroy {

  /**
   * The configuration for the inputed group
   */
  @Input() config: GroupedQuestionConfig;

  /**
   * Values of the formItems in the config. Used for display purposes. The possible types should be updated as needed
   */
  public values: Map<string, any>;

  /**
   * A subscription for each question. Does not includes grouped questions as those questions are managed in their respective components
   */
  private _subscriptions: Subscription[] = [];
  /**
   * Make form item type single a class member. Allows use in the template
   * @type {FormItemType.SINGLE_QUESTION}
   */
  public formItemTypeSingle = FormItemType.SINGLE_QUESTION;

  /**
   * Initialize the values for each question
   */
  ngOnInit() {
    this.values = new Map<string, any>();
    this.config.questions.forEach( (question) => {
      if (question && question.formItemId) {
        this.values.set(question.formItemId, this.model.getById(question.formItemId));
        this._subscriptions.push(this.model.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:${question.formItemId}`,
          (model: IObservedModel) => this.values.set(question.formItemId, model.currentValue )));
      }
    });
  }

  /**
   * Overrides the parent method. Takes in the question and its config.
   * @param question
   * @param {QuestionConfig} questionConfig
   */
  public onValueChanged(question, questionConfig?: QuestionConfig): void {
    if (this.model) {
      if (FormUtility.isSchemaTypeNumber(questionConfig.schema.type)  && typeof question.value === DataType.STRING) {
        question.value = parseInt(question.value);
      }
      this.model.setById(question.id, question.value);
    }
  }

  /**
   * Unsubscribe to all subscriptions
   */
  ngOnDestroy() {
    SubscriptionManager.massUnsubscribe(this._subscriptions);
  }
}


