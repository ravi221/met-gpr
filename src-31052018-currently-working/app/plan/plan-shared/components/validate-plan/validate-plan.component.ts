import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IPPCResponse} from '../../interfaces/iPPCResponse';
import {PlanDataService} from '../../services/plan-data.service';
import {Subscription} from 'rxjs/Subscription';
import {IPlan} from '../../interfaces/iPlan';
import FormConfig from '../../../../dynamic-form/config/form-config';
import {ValidatePlanService} from '../../services/validate-plan.service';
import {Subject} from 'rxjs/Subject';
import {NotificationService} from '../../../../core/services/notification.service';
import {SubscriptionManager} from '../../../../core/utilities/subscription-manager';

/**
 * Runs validate for the plan home and data entry screens
 */
@Component({
  selector: `gpr-validate-plan`,
  template: `<button class="btn btn-secondary" [disabled]="isValidateDisabled" (click)="validate()">Validate</button>`
})
export class ValidatePlanComponent implements OnInit, OnDestroy {

  /**
   * Data on the current plan
   */
  @Input() plan: IPlan;

  /**
   * The form configuration for the current plan
   */
  @Input() config: FormConfig;

  /**
   * A save subject. Used to check the success of saving dirty data before validation
   */
  @Input() saveSubject?: Subject<boolean>;

  /**
   * Tells the parent the data is dirty and needs saving before validation
   * @type {EventEmitter<any>}
   */
  @Output() saveDirtyData: EventEmitter<any> = new EventEmitter();
  /**
   * A flag to disable the validate button
   */
  @Input() isValidateDisabled: boolean = true;

  /**
   * A subscription to the validation service
   */
  private _validationSubscription: Subscription;

  /**
   * Subscription to the save Subject
   */
  private _saveSubjectSubscription: Subscription;

  /**
   * Get an instance of the validate service
   * @param {PlanDataService} _dataService
   */
  constructor(private _dataService: ValidatePlanService, private _notificationService: NotificationService) {}

  /**
   * Initializes the status of each category
   */
  ngOnInit() {
    this._initializeStatus();
    if (this._dataService.canValidatePlan()) {
      this.isValidateDisabled = false;
      if (!(this.plan.completionPercentage > 0) && !(this.config.activeCategoryId)) {
        this.isValidateDisabled = true;
      }
	  this.plan.categories.forEach((category) => {
	    if (this.config.activeCategoryId && !(category.completionPercentage > 0) ) {
          this.isValidateDisabled = true;
        }
	  });
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    const subscriptions = [this._validationSubscription, this._saveSubjectSubscription];
    SubscriptionManager.massUnsubscribe(subscriptions);

  }
  /**
   * Handles the click event of validate button.
   */
  public validate(): void {
    const activeCategoryId: string = this.config.activeCategoryId ? this.config.activeCategoryId : null;
    if (this.config.activeSectionId) {
      this.resetValidation();
    }
    const isDataDirty = this.config.state.isDirty === true;
    if (isDataDirty) {
      this.saveAndGetValidation(activeCategoryId);
    } else {
      this.handleValidation(activeCategoryId);
    }

  }

  /**
   * Resets the validation for the active section
   * @public
   */
  public resetValidation(): void {
    const currentSection = this.config.getSection(this.config.activeSectionId);
    currentSection.questions.forEach( (question) => {
      const control = this.config.getControl(question.formItemId);
      if (control) {
        control.state.errors = [];
      }
    });
  }

  /**
   * Calls the validation service
   * @param {string} activeCategoryId
   */
  public handleValidation(activeCategoryId: string): void {
    this._validationSubscription = this._dataService.validate(this.plan.planId, this.plan.ppcModelName, this.plan.ppcModelVersion, activeCategoryId).subscribe( (ppcResponse: IPPCResponse) => {
      this._parseResponse(ppcResponse);
      const notification = this._dataService.getValidationNotification(this.plan, this.config);
      this._notificationService.addNotification(notification.type, notification.message);
    });
  }

  /**
   * Saves then calls the validation service
   * @param {string} activeCategoryId
   */
  public saveAndGetValidation(activeCategoryId: string): void {
    this._saveSubjectSubscription = this.saveSubject.subscribe( (response) => {
      this._saveSubjectSubscription.unsubscribe();
      if (response === true) {
        this.handleValidation(activeCategoryId);
      }
    });
    this.saveDirtyData.emit(null);
  }

  /**
   * Initializes the status for each category config
   * @private
   */
  private _initializeStatus(): void {
    this.plan.categories.forEach((category) => {
      const planCategory = this.config.getCategory(category.categoryId);
      if (planCategory) {
        planCategory.setStatusCode(category.completionPercentage);
        if (this.isValidateDisabled === true) {
          this.isValidateDisabled = !planCategory.isComplete;
        }
      }
    });
    const activeSection = this.config.getSection(this.config.activeSectionId);
    if (activeSection) {
      const errors = activeSection.state.errors;
      if (!errors || errors.length === 0) {
        activeSection.state.isComplete = true;
        this.config.setSectionById(activeSection.sectionId, activeSection);
      }
    }
  }

  /**
   * parses validation data
   * @param {IPPCResponse} response
   * @private
   */
  private _parseResponse(response: IPPCResponse) {
    response.categories.forEach((category) => {
      category.sections.forEach((section) => {
        section.questions.forEach((question) => {
          const control = this.config.getControl(question.questionId);
          if (control) {
            control.state.errors = question.errors;
          }
        });
      });
    });
    this._initializeStatus();
  }
}
