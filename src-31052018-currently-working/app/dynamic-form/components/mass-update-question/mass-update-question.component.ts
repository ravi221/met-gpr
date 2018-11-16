import {Component, Input, Output, OnDestroy, OnInit, EventEmitter, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {FormUtility} from '../../classes/form-utility';
import {DataManagerSubscriptionType} from '../../enumerations/data-manager-subscription-type';
import {DataType} from '../../enumerations/data-type';
import {IObservedModel} from '../../../entity/entity';
import {FormBaseComponent} from '../dynamic-form-base/form-base-component';
import QuestionConfig from '../../config/question-config';
import {isNil} from 'lodash';
import {HelpTooltipComponent} from 'app/ui-controls/components/help-tooltip/help-tooltip.component';
import {IHelpText} from 'app/plan/interfaces/iHelpText';

/**
 * One question on the mass update form.
 */
@Component({
  selector: 'gpr-mass-update-question',
  templateUrl: './mass-update-question.component.html',
  styleUrls: ['./mass-update-question.component.scss']
})
export class MassUpdateQuestionComponent extends FormBaseComponent implements OnInit, OnDestroy {

  /**
   * The configuration for the question
   * @override
   */
  @Input() config: QuestionConfig;

  /**
   * The value of the question
   */
  public value: any;

  /**
   * Updates the parent component,
   * If any checkbox gets checked.
   */
  @Output() valueChanged: EventEmitter<void> = new EventEmitter<void>();

  /**
   * A subscription to any model changes
   */
  private _subscription: Subscription;

  /**
   *  Reference to the updated help and url text for this question.
   * @type {IHelpText}
   */
  public helpData: IHelpText = <IHelpText>{};

  /**
   * View of the help tooltip Component.
   */
  @ViewChild(HelpTooltipComponent) helpTooltip: HelpTooltipComponent;

  /**
   * Displays flag message when checkbox is selected without answering the question
   */
  public flagMessage: string;

  /**
   * Error message if the question has not been answered
   */
  public message = 'Please answer the question to select checkbox';

  /**
   * On init, subscribe to any model changes and update the question's value
   */
  ngOnInit() {
    if (this.model) {
      this._subscription = this.model.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:${this.config.viewModel}`, (model: IObservedModel) => this.value = model.currentValue);

      if (this.config && this.config.formItemId) {
        this.value = this.model.getById(this.config.formItemId);
      }
    }
    this._setHelpData();
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
      if (FormUtility.isSchemaTypeNumber(this.config.schema.type) && typeof question.value === DataType.STRING) {
        question.value = parseInt(question.value);
      }
      this.model.setById(question.id, question.value);
    }
    if (isNil(question)) {
      return;
    }
    if (question.value) {
      this.config.isChecked = !isNil(question.value);
      this.flagMessage = '';
      this.valueChanged.emit();
    }
  }

  /**
   * onChange Updates the selected checkboxes count
   * @param {isCheckboxChecked: boolean}
   */
  public handleCheckboxChange(isCheckboxChecked: boolean): void {
    if (isCheckboxChecked) {
      if (isNil(this.config.questionAnswer)) {
        this.flagMessage = this.message;
      }
    }
    this.valueChanged.emit();
  }

  /**
   *
   *  Reset any dirty edit and close the text editor.
   */
  public onCancelHelpText(): void {
    this._resetHelpData();
    this.helpTooltip.closeHelpTextEditor();
  }


  /**
   * updates the help data form teh component.
   */
  public handleSaveHelpText(): void {
    this._setHelpData();
    this.helpTooltip.saveHelpTextEditor(this.helpData);
  }

  /**
   * link to open the gpr tooltip
   * @param url {String}
   */
  public handleOpenHelpWindow(url: string): void {
    window.open(url, 'GPR Help');
  }

  /**
   * Updates helpdata opbject with current model data.
   */
  private _setHelpData(): void {
    this.helpData.questionId = this.config.formItemId;
    this.helpData.helpText = this.config.help.helpText;
    this.helpData.urlText = this.config.help.helpUrl;
  }

  /**
   * set Previous Help Data
   */
  private _resetHelpData(): void {
    this.config.help.helpText = this.helpData.helpText;
    this.config.help.helpUrl = this.helpData.urlText;
  }
}
