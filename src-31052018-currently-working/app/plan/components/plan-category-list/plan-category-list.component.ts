import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import CategoryConfig from '../../../dynamic-form/config/category-config';
import {IPlanCategory} from '../../plan-shared/interfaces/iPlanCategory';
import {CompletionStatus} from '../../enums/completion-status';
import {ValidationStatus} from '../../enums/validation-status';
import {PlanHelper} from '../../../navigation/classes/plan-helper';
import {PlanCategoryLabelStyleService} from 'app/plan/services/plan-category-label-style.service';
import {fadeInOut} from '../../../ui-controls/animations/fade-in-out';
import {AnimationState} from '../../../ui-controls/animations/AnimationState';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {PlanStatus} from '../../enums/plan-status';
import FormConfig from '../../../dynamic-form/config/form-config';
import {IPlan} from '../../plan-shared/interfaces/iPlan';
import {isNil} from 'lodash';

/**
 * A plan category list component class that receives a list of {@link CategoryConfig} categories and displays them with associated action button.
 * Implemented dynamic progress and action button text for each category.
 */
@Component({
  selector: 'gpr-plan-category-list',
  template: `
    <div class="category-item">
      <section class="category-info">
        <!-- Category Icon -->
        <gpr-icon *ngIf="stateIcon || stateIcon == '' "
                  [name]="'plandoc'"
                  [state]="stateIcon"
                  class="doc-icon"></gpr-icon>

        <!-- Category Info --->
        <section class="category-info-row">
          <section class="category-label-info">
            <label class="category-label">{{label}}</label>
            <div class="category-label-status">
              <span [class]="statusColor">{{statusCode}}</span>
              <gpr-plan-error-tooltip [errorCount]="categories?.errorCount"
                                      [planId]="planId"></gpr-plan-error-tooltip>
            </div>
          </section>
          <gpr-expand-collapse-icon (expand)="toggleSectionsVisibility($event)"></gpr-expand-collapse-icon>
        </section>

        <!-- Category Actions -->
        <section class="category-action-buttons">
          <gpr-validate-plan *ngIf="stateIcon === 'off'" [plan]="plan" [config]="formConfig"></gpr-validate-plan>
          <button *ngIf="showActionLabel"
            class="btn btn-{{showActionStyle}}"
            (click)="actionButtonClicked(showActionLabel , categories)">{{showActionLabel}}
          </button>
        </section>
      </section>

      <!-- Category Sections -->
      <section class="section-info" [@fadeInOut]="sectionVisibilityState">
        <gpr-plan-category-section-list
          *ngFor="let section of categories.sections"
          [section]="section"
          [categoryId]="categoryId"
          [planId]="planId"
          [customerNumber]="customerNumber"></gpr-plan-category-section-list>
      </section>
    </div>
  `,
  styleUrls: ['./plan-category-list.component.scss'],
  animations: [fadeInOut]
})
export class PlanCategoryListComponent implements OnInit {

  /**
   * The id of the customer
   */
  @Input() customerNumber: number;

  /**
   * The id of the plan
   */
  @Input() planId: string;

  /**
   * The id of the Category
   */
  @Input() categoryId: string;

  /**
   * Receives a list of categories.
   */
  @Input() categories: IPlanCategory;

  /**
   * The form configuration for the current plan
   */
  @Input() formConfig: FormConfig;

  /**
   * The current plan instance.
   */
  @Input() plan: IPlan;

  /**
   * Receives the category Label.
   */
  @Input() label: string;

  /**
   * Receives the category Percentage.
   */
  @Input() categoryPercentage: number;

  /**
   * Receives the category Indicator.
   */
  @Input() categoryIndicator: ValidationStatus;

  /**
   * Event emitter for when an action button is clicked.
   * @type {EventEmitter<any>}
   */
  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event emitter for when an action button validate is clicked.
   * @type {EventEmitter<any>}
   */
  @Output() validate: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The section's visibility
   * @type {AnimationState}
   */
  public sectionVisibilityState: AnimationState = AnimationState.HIDDEN;

  /**
   * Current status of the Color
   */
  public statusColor: string;

  /**
   * Current status of the Category
   */
  public statusCode: CompletionStatus;

  /**
   * Indicates the state icons
   * {'on','off',''}
   */
  public stateIcon: string;

  /**
   * Indicates that Category Action Labels
   */
  public showActionLabel: string;

  /**
   * Indicates that Category Action Label validate
   */
  public showActionLabelValidate: string;

  /**
   * Indicates that Category Action Styles
   */
  public showActionStyle: string;

  /**
   * Indicates that Category Action Style Validate
   */
  public showActionStyleValidate: string;

  /**
   * Creates the plan category list {Labels, Styles, IconState}
   * @param {PlanCategoryLabelStyleService} _planCategoryLabelStyleService
   */
  constructor(private _planCategoryLabelStyleService: PlanCategoryLabelStyleService,
    private _navigatorService: NavigatorService) {

  }

  /**
   * On init, fetches all plan related information
   */
  ngOnInit(): void {
    const navState = this._navigatorService.getNavigationState();
    const planStatus = this._getPlanStatusFromNavState(navState);
    this.statusCode = PlanHelper.getCompletionStatusByCompletionPercentage(this.categoryPercentage);
    this.statusColor = PlanHelper.getDisplayColorByStatus(this.statusCode);
    this.categories.sections.forEach((validation) => {
      this.stateIcon = this._planCategoryLabelStyleService.getIconState(this.categoryPercentage, validation.validationIndicator);
    });
    this.showActionLabel = PlanHelper.getActionButtonLabelByCompletionPercentage(this.categoryPercentage, planStatus);
    this.showActionStyle =
    this._planCategoryLabelStyleService.getActionStyle(this.categoryPercentage);
  }

  /**
   * Toggles the visibility of a category's sections
   * @param {boolean} isExpanded
   */
  public toggleSectionsVisibility(isExpanded: boolean): void {
    this.sectionVisibilityState = isExpanded ? AnimationState.VISIBLE : AnimationState.HIDDEN;
  }

  /**
   * Handles the click event of an action button associated with a category.
   * @param {string} action: The type of action attached to the button.
   * @param {IPlanCategory} category: The category that the button is attached to.
   */
  public actionButtonClicked(action: string, category: IPlanCategory): void {
    this.action.emit({action, category});
  }

  /**
   * Handles the click event of an action button validate associated with a category.
   */
  public onValidateClick(): void {
    this.validate.emit();
  }

  /**
   * Returns the plan status from navigation state if available
   * @param navState
   */
  private _getPlanStatusFromNavState(navState: INavState): PlanStatus {
    const navStateIsNull = isNil(navState) || isNil(navState.data) || isNil(navState.data.plan);
    if (navStateIsNull) {
      return null;
    }
    return navState.data.plan.status;
  }
}
