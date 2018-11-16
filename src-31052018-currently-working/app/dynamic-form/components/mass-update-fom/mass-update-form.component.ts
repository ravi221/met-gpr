import {Component, Type, Output, OnDestroy, EventEmitter} from '@angular/core';
import {Form} from '../form';
import QuestionConfig from '../../config/question-config';
import SectionConfig from '../../config/section-config';
import {MassUpdateQuestionConfig} from '../../config/mass-update-question-config';
import {MassUpdateSelectPlanComponent} from 'app/dynamic-form/components/mass-update-select-plan/mass-update-select-plan.component';
import {ModalService} from 'app/ui-controls/services/modal.service';
import {ModalRef} from 'app/ui-controls/classes/modal-references';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';

@Component({
  selector: 'gpr-mass-update-form',
  templateUrl: './mass-update-form.component.html',
  styleUrls: ['./mass-update-form.component.scss']
})
export class MassUpdateFormComponent extends Form implements OnDestroy  {

  /**
   * The questions for Mass Update
   */
  public questions: MassUpdateQuestionConfig[] = [];

  /**
   * Indicates if the select all checkbox is selected (true) or unselected (false)
   * @type {boolean}
   */
  public areAllPlansSelected: boolean = false;

  /**
   * Indicates the count of the number of questions checked
   * @type {number}
   */
  public checkedQuestionsCount: number = 0;

  /**
   * boolean to set select plan button to be disabled/enabled
   * @type {boolean}
   */
  public canSelectPlans: boolean = false;


  /**
   * Get a copy of the modal service
   * Creates the label for select all checkbox
   * @param {ModalService} _modalService
   */
  constructor(private _modalService: ModalService,
              private _massUpdateDataService: MassUpdateDataService) {
    super();
  }

   /**
	* On destroy, unsubscribe from all subscriptions
	*/
   ngOnDestroy() {

   }

  /**
   * Override intialize section. Extract the questions from the active section
   * @param {SectionConfig} section
   * @private
   */
  protected _initializeSection(section: SectionConfig): void {
    this.activeSectionLabel = section.label;
    this.questions = section.questions;
    this._massUpdateDataService.questions = section.questions;
  }

  /**
   * on Selecting selectAll checkbox it select/deselect vice-versa
   * {checkedQuestionsCount: string[]} Updates the count of questions
   * {isSelectPlanDisabled: boolean} Updates the select plan button to be disabled/enabled
   * @param {areAllPlansSelected : boolean}
   */
  public onSelectAllQuestions(areAllPlansSelected: boolean): void {
    this.questions.forEach((question: MassUpdateQuestionConfig) => {
      question.isChecked = areAllPlansSelected;
    });
    const numQuestionsChecked =  this.questions.filter(question => question.isChecked).length;
    this.canSelectPlans = numQuestionsChecked > 0;
    this.checkedQuestionsCount = numQuestionsChecked;
  }

  /**
   * Gets the count of selected checkboxes
   */
  public countCheckedQuestions(): void {
    this.checkedQuestionsCount = this.questions.filter(question => question.isChecked).length;
    this.areAllPlansSelected = this.checkedQuestionsCount === this.questions.length;
    this.canSelectPlans = this.checkedQuestionsCount > 0;
  }

  /**
   * Opens a table modal and returns a reference to that modal
   * @returns {ModalRef}
   * @private
   */
  private _openSelectPlansModal(): ModalRef {
    const componentType: Type<Component> = MassUpdateSelectPlanComponent as Type<Component>;
    const inputs: Map<string, any> = new Map<string, any>();
    inputs.set('config', this.config);
    inputs.set('model', this.model);
    return this._modalService.open(componentType, {
      backdrop: true,
      size: 'lg',
      displayCloseIcon: false,
      closeOnBackdropClick: true,
      closeOnEsc: true,
      inputs: inputs,
      containerClass: 'mass-update-select-plan',
      title: 'Please select which plans you like to apply this change to'
    });
  }

  /**
   * Handles the opening of the select plans modal
   */
  public handleSelectPlansModal(): void {
    this._openSelectPlansModal();
  }
}
