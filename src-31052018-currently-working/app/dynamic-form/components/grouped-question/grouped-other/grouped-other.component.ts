import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DynamicFormBaseComponent} from '../../dynamic-form-base/dynamic-form-base.component';
import {GroupedQuestionConfig} from '../../../config/grouped-question-config';
import QuestionConfig from '../../../config/question-config';
import {FormControlType} from '../../../enumerations/form-control-type';
import {Subscription} from 'rxjs/Subscription';
import {DataManagerSubscriptionType} from '../../../enumerations/data-manager-subscription-type';
import {IObservedModel} from '../../../../entity/entity';
import {SubscriptionManager} from '../../../../core/utilities/subscription-manager';
import {FormControl} from '../../../../forms-controls/components/form-control';

/**
 * Groups together checkboxes, drop downs, and radio buttons that have an other option with a text box
 */
@Component({
  selector: `gpr-grouped-other`,
  template: `
    <fieldset class="control-group grouped-question"
              [disabled]="primaryQuestion.control.state?.isDisabled"
              [hidden]="primaryQuestion.control.state?.isHidden"
              [ngClass]="{'has-errors' : !primaryQuestion.control.state.isValid}">

      <table class="question-table">
        <tr>
          <td>
            <span class="control-number">{{index}}.</span>
          </td>
          <td>
            <label class="control-label">{{primaryQuestion.label}}&nbsp;
              <span [hidden]="!primaryQuestion.control.state?.isRequired">*</span></label>
          </td>
          <td>
            <gpr-dynamic-question-actions [config]="primaryQuestion" [model]="model" [questionFlag]="questionFlag" [questionComments]="questionComments"></gpr-dynamic-question-actions>
          </td>
        </tr>
      </table>
      <gpr-dynamic-form-control
        [value]="primaryQuestionValue"
        [config]="primaryQuestion"
        [id]="primaryQuestion.formItemId"
        [type]="primaryQuestion.control.type"
        [choices]="primaryQuestion.control.choices"
        [isDisabled]="primaryQuestion.control.state?.isDisabled"
        [isHidden]="primaryQuestion.control.state?.isHidden"
        [isValid]="primaryQuestion.control.state?.isValid"
        [isRequired]="primaryQuestion.control.state?.isRequired"
        (valueChanged)="onValueChanged($event)">
      </gpr-dynamic-form-control>
      <table class="question-table" [hidden]="textBox.control.state.isHidden">
        <tr>
          <td>
            <label class="control-label text-box-label">{{textBox.label}}&nbsp;
              <span [hidden]="!textBox.control.state?.isRequired">*</span></label>
          </td>
        </tr>
      </table>
      <gpr-dynamic-form-control
        [value]="textBoxValue"
        [config]="textBox"
        [id]="textBox.formItemId"
        [type]="textBox.control.type"
        [choices]="textBox.control.choices"
        [isDisabled]="textBox.control.state?.isDisabled"
        [hidden]="textBox.control.state?.isHidden"
        [isValid]="textBox.control.state?.isValid"
        [isRequired]="textBox.control.state?.isRequired"
        (valueChanged)="onTextBoxChange($event)">
      </gpr-dynamic-form-control>
      <p class="control-errors" *ngFor="let message of primaryQuestion.control.state.messages">{{message}}</p>
    </fieldset>`,
  styleUrls: ['./grouped-other.component.scss']
})
export class GroupedOtherComponent extends DynamicFormBaseComponent implements OnInit, OnDestroy {

  /**
   * The configuration for the group
   */
  @Input() config: GroupedQuestionConfig;

  /**
   * The primary questions
   */
  public primaryQuestion: QuestionConfig;

  /**
   * The value of the primary question
   */
  public primaryQuestionValue: string;

  /**
   * The text box config
   */
  public textBox: QuestionConfig;

  /**
   * The value in the text box
   */
  public textBoxValue: string;

  /**
   * An array of subcriptions
   * @private
   */
  private _subscriptions: Subscription[] = [];

  /**
   * Constant for other
   */
  public other: string | number;

  /**
   * The default value for Other
   */
  readonly DEFAULT_OTHER = 'Other';

  /**
   * Get the primary and text box components and subscribe to their view models
   */
  ngOnInit() {
    this.other = this.config.valueOfOther || this.DEFAULT_OTHER;
      this.primaryQuestion = this.config.questions.find( (question) => !this._isTextBox( question.control.type as FormControlType) );
     this.textBox = this.config.questions.find( (question) => this._isTextBox(question.control.type as FormControlType) );
    if (this.model) {
      this._subscriptions.push(this.model.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:${this.primaryQuestion.formItemId}`, (model: IObservedModel) => this.primaryQuestionValue = model.currentValue));
      this._subscriptions.push(this.model.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:${this.textBox.formItemId}`, (model: IObservedModel) => this.textBoxValue = model.currentValue));
      if (this.primaryQuestion && this.primaryQuestion.formItemId) {
        this.primaryQuestionValue = this.model.getById(this.primaryQuestion.formItemId);
        const isOther = this.primaryQuestionValue === this.other;
        this.textBox.control.state.isRequired = isOther;
        this.textBox.control.state.isHidden = !isOther;
      }
      if (this.textBox && this.textBox.formItemId) {
        this.textBoxValue = this.model.getById(this.textBox.formItemId);
      }
    }
  }

  /**
   * Unsubscribe to all subscriptions
   */
  ngOnDestroy() {
    if (this.textBox.control.state.isHidden) {
      this.model.setById(this.textBox.formItemId, null);
    }
    SubscriptionManager.massUnsubscribe(this._subscriptions);
  }

  /**
   * Checks if the textbox should be required and enabled. Emits if the question is newly answered and sets the value in the model.
   * @param question
   */
  public onValueChanged(question: FormControl): void {
    if (!question.value) {
      return;
    }
    if (question.type === FormControlType.CHECK_BOX) {
      this.textBox.control.state.isRequired = question.value.includes(this.other);
      this.textBox.control.state.isHidden = !question.value.includes(this.other);
    } else  {
      this.textBox.control.state.isRequired = question.value === this.other;
      this.textBox.control.state.isHidden = question.value !== this.other;
    }
    if (this.model) {
      this.model.setById(question.id, question.value);
    }
  }

  /**
   * Sets the value of the text box in the model.
   * @param question
   */
  public onTextBoxChange(question): void {
    if (this.model) {
      this.model.setById(question.id, question.value);
    }
  }

  /**
   * Checks if the control would be a text box.
   * @param {string} type
   * @returns {boolean}
   * @private
   */
  private _isTextBox(type: FormControlType): boolean {
    const textBoxTypes = [FormControlType.INPUT, FormControlType.NUMBER, FormControlType.TEXT, FormControlType.TEXT_INPUT];
    return textBoxTypes.includes(type);
  }
}
