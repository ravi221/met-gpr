import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ProductDataService} from 'app/core/services/product-data.service';
import {IProduct} from 'app/core/interfaces/iProduct';
import {IPlan} from 'app/plan/plan-shared/interfaces/iPlan';
import {IPlanInputTemplate} from 'app/plan/interfaces/iPlanInputTemplate';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {Subscription} from 'rxjs/Subscription';
import {PlanInputValidationService} from 'app/plan/services/plan-input-validation.service';
import {PlanModes} from 'app/plan/enums/plan-modes';
import {every, some} from 'lodash';
import {IDatePickerOutput} from 'app/ui-controls/interfaces/iDatePickerOutput';

/**
 * A component to manage creating new plans for a customer or to copy plans to a different customer
 */
@Component({
  selector: 'gpr-plan-input-grid',
  template: `
    <div class="plan-input-grid">

      <!-- Table Headers -->
      <table class="plan-input-table">
        <thead>
        <tr>
          <th class="column-heading">Product</th>
          <th class="column-heading">
            <span>Plan Name</span>
            <gpr-help-tooltip class="help-tooltip"
                              [maxWidth]="300"
                              [theme]="'default'"
                              [position]="'right'"
                              [displayCloseIcon]="true">{{planNameHelpText}}
            </gpr-help-tooltip>
          </th>
          <th class="column-heading">Effective Date</th>
          <th *ngIf="!isCopyMode">&nbsp;</th>
        </tr>
        </thead>
      </table>
      <section class="plan-input-grid-content" [class.scroll]="allowScroll">
        <table class="plan-input-table">
          <tbody>
          <tr *ngFor="let planTemplate of planTemplates; let i = index"
              class="plan-template"
              [class.validation-errors]="planTemplate.hasErrors">
            <!-- Product -->
            <td *ngIf="!isCopyMode">
              <gpr-product-drop-down class="product-drop-down" [products]="products" (coverageSelect)="onCoverageSelection($event.coverageName, planTemplate)"></gpr-product-drop-down>
              <!-- Plan Template Errors -->
              <label *ngFor="let error of planTemplate.errors"
                     class="plan-template-error">
                <gpr-icon [name]="'validation-error'"></gpr-icon>
                <span>{{error}}</span>
              </label>
            </td>

            <!-- Display Only Product -->
            <td *ngIf="isCopyMode">
              <span>{{plans[0]?.productType}}</span>
              <!-- Plan Template Errors -->
              <label *ngFor="let error of planTemplate.errors"
                     class="plan-template-error">
                <gpr-icon [name]="'validation-error'"></gpr-icon>
                <span>{{error}}</span>
              </label>
            </td>

            <!-- Plan Name -->
            <td>
                <span class="plan-name-prefix"
                      *ngIf="planTemplate.planNamePrefix">{{planTemplate.planNamePrefix}}</span>
              <input type="text"
                     class="plan-name"
                     (change)="validatePlanTemplate(planTemplate)"
                     [(ngModel)]="planTemplate.planNameBody"
                     placeholder="The product type will be added to your plan name"/>
            </td>

            <!-- Effective Date -->
            <td>
              <gpr-date-picker [shouldAllowInput]="true"
                               [dateFormat]="'MM/dd/yyyy'"
                               [placeholder]="'mm/dd/yyyy'"
                               [flatPickerDateFormat]="'m/d/Y'"
                               [minDate]="minEffectiveDate"
                               [initialValue]="firstEffectiveDate"
                               (dateChanged)="setEffectiveDate($event, planTemplate)"></gpr-date-picker>
            </td>

            <!-- Remove Row -->
            <td *ngIf="!isCopyMode">
              <gpr-icon *ngIf="planTemplates.length > 1" class="remove-row-icon icon-24x24" name="remove" (click)="removeRow(i)"></gpr-icon>
            </td>
          </tr>
          </tbody>
        </table>
      </section>

      <!-- Plan Input Actions -->
      <div class="plan-input-actions">
        <a *ngIf="!isCopyMode" class="add-another-plan-link" (click)="addBlankRow()">Add another Plan</a>
        <button class="btn btn-primary create-plans-btn" (click)="createPlans()" [disabled]="isCreateDisabled">{{createPlansLabel}}</button>
      </div>
    </div>
  `,
  styleUrls: ['./plan-input-grid.component.scss']
})
export class PlanInputGridComponent implements OnInit, OnDestroy {

  /**
   * Array of plans sent in by parent component
   */
  @Input() plans: IPlan[] = [];

  /**
   * Customer need to validate effective date against when configuring the plan
   */
  @Input() customer: ICustomer;

  /**
   * Component will behave slightly different based on if this is a create or copy plan action
   */
  @Input() planMode: PlanModes = PlanModes.CREATE;

  /**
   * Indicates if the plan input grid can scroll, set to true by default
   * @type {boolean}
   */
  @Input() allowScroll: boolean = true;

  /**
   * Emitter to be called when the creation of plan(s) is completed
   */
  @Output() plansCreate: EventEmitter<IPlanInputTemplate[]> = new EventEmitter<IPlanInputTemplate[]>();

  /**
   * The label for the create plans button
   * @type {string}
   */
  public createPlansLabel: 'Create Plans' | 'Create Plan' = 'Create Plan';

  /**
   * Property used to disable the create button
   */
  public isCreateDisabled: boolean = true;

  /**
   * The minimum effective date
   */
  public minEffectiveDate: Date;

  /**
   * List of products to populate the product drop down
   */
  public products: IProduct[] = [];

  /**
   * Indicates if the user is copying or creating plans
   * @type {boolean}
   */
  public isCopyMode: boolean = false;

  /**
   * holds grid data
   */
  public planTemplates: IPlanInputTemplate[] = [];

  /**
   * Help text to display when user clicks on the Plan Name help button
   */
  public planNameHelpText: string = 'Plan names will automatically show in GPR with their product type. ' +
    'You don\'t need to add the product type in the plan name. For example, if you choose a dental product, ' +
    'your plan name will show as "Dental [Plan name here]"';

  /**
   * Holds the first effective date selected.
   */
  public firstEffectiveDate: String;

  /**
   * A subscription to get a list of products
   */
  private _productSubscription: Subscription;

  /**
   * Creates the plan input grid
   * @param {ProductDataService} _productService
   * @param {PlanInputValidationService} _planInputValidationService
   */
  constructor(private _productService: ProductDataService,
              private _planInputValidationService: PlanInputValidationService) {
  }

  /**
   * On init, setup the component for copying or creating plans
   */
  ngOnInit(): void {
    this._setMinEffectiveDate(this.customer.effectiveDate);
    const isCopyMode = this.planMode === PlanModes.COPY && this.plans && this.plans.length > 0;
    const isCreateMode = this.planMode === PlanModes.CREATE;
    if (isCopyMode) {
      this._initCopyMode();
    } else if (isCreateMode) {
      this._initCreateMode();
    }

    this._getProducts();
  }

  /**
   * On destroy, unsubscribe from getting products
   */
  ngOnDestroy(): void {
    if (this._productSubscription) {
      this._productSubscription.unsubscribe();
    }
  }

  /**
   * Method that adds a new row to the Plans array and to the UI
   */
  public addBlankRow(): void {
    const newPlanTemplate = <IPlanInputTemplate>{
      hasErrors: false,
      errors: [],
      isComplete: false,
      planNamePrefix: '',
      planNameBody: ''
    };
    this.planTemplates.push(newPlanTemplate);
    this._updateCreatePlansButton();
  }

  /**
   * Method that removes plan object of the selected index from the plans array
   * @param index row index
   */
  public removeRow(index: number): void {
    this.planTemplates.splice(index, 1);
    this._updateCreatePlansButton();
  }

  /**
   * Method that emits the plan was created
   */
  public createPlans(): void {
    const customerNumber = this.customer.customerNumber;
    this.planTemplates.forEach(planTemplate => planTemplate.customerNumber = customerNumber);
    this.plansCreate.emit(this.planTemplates);
  }

  /**
   * Method called when a coverage is selected for a plan template
   * @param {string} coverageName
   * @param {IPlanInputTemplate} planTemplate
   */
  public onCoverageSelection(coverageName: string, planTemplate: IPlanInputTemplate): void {
    planTemplate.planNamePrefix = '';
    planTemplate.coverageId = '';
    planTemplate.coverageName = '';
    planTemplate.ppcModelName = '';
    this.products.forEach((product: IProduct) => {
      const coverage = product.coverages.find(c => c.coverageName === coverageName);
      if (coverage) {
        planTemplate.planNamePrefix = `${product.productName} - `;
        planTemplate.coverageId = coverage.coverageId;
        planTemplate.coverageName = coverage.coverageName;
        planTemplate.ppcModelName = coverage.ppcModelName;
      }
    });
    this.validatePlanTemplate(planTemplate);
  }

  /**
   * Validates the given plan template
   * @param {IPlanInputTemplate} planTemplate
   */
  public validatePlanTemplate(planTemplate: IPlanInputTemplate): void {
    const hasCompletedAllFields = this._planInputValidationService.hasCompletedAllFields(planTemplate);
    planTemplate.isComplete = hasCompletedAllFields;

    if (hasCompletedAllFields) {
      const customerEffectiveDate = this.customer.effectiveDate;
      const errors = this._planInputValidationService.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
      planTemplate.hasErrors = errors.length > 0;
      planTemplate.errors = errors;
    }

    this._updateCreatePlansButton();
  }

  /**
   * Sets the effective date when a date is selected
   * @param {IDatePickerOutput} datePickerObject
   * @param {IPlanInputTemplate} planTemplate
   */
  public setEffectiveDate(datePickerObject: IDatePickerOutput, planTemplate: IPlanInputTemplate): void {
    if (this.planTemplates[0] === planTemplate) {
      this.firstEffectiveDate = datePickerObject.dateString;
    }
    planTemplate.effectiveDate = datePickerObject.dateString;
    this.validatePlanTemplate(planTemplate);
  }

  /**
   * Sets the minimum effective date
   * @private
   */
  private _setMinEffectiveDate(customerEffectiveDate: string): void {
    let effectiveDate = new Date(customerEffectiveDate);
    this.minEffectiveDate = effectiveDate;
  }

  /**
   * Checks to enable the create plans button
   */
  private _updateCreatePlansButton(): void {
    const allRowsCompleted = every(this.planTemplates, 'isComplete');
    const hasTemplateErrors = some(this.planTemplates, 'hasErrors');
    this.isCreateDisabled = !allRowsCompleted || hasTemplateErrors;
    this.createPlansLabel = this.planTemplates.length === 1 ? 'Create Plan' : 'Create Plans';
  }

  /**
   * Gets a list of all products in GPR
   * @private
   */
  private _getProducts(): void {
    this._productSubscription = this._productService.getProducts().subscribe((products: IProduct[]) => {
      this.products = [...products];
    });
  }

  /**
   * Initializes the plan input grid for copying
   * @private
   */
  private _initCopyMode(): void {
    this.isCopyMode = true;
    const plan = this.plans[0];
    this.planTemplates.push(
      {
        planNameBody: plan.planName,
        planNamePrefix: plan.productType,
        effectiveDate: plan.effectiveDate,
        customerNumber: this.customer.customerNumber,
        ppcModelName: plan.ppcModelName,
        coverageId: plan.coverageId,
        hasErrors: false,
        errors: [],
        coverageName: plan.coverageName,
        isComplete: true
      }
    );
  }

  /**
   * Initializes the plan input grid for creating
   * @private
   */
  private _initCreateMode(): void {
    this.isCopyMode = false;
    this.planTemplates.push(<IPlanInputTemplate>{});
    this.planTemplates[0].planNamePrefix = '';
    this.isCreateDisabled = true;
  }
}
