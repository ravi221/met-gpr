import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {IPlan} from '../../../../plan/plan-shared/interfaces/iPlan';
import {NavigatorService} from '../../../services/navigator.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {PlansExpansionManager} from '../../../classes/plan-expansion-manager';
import {PlanDataService} from 'app/plan/plan-shared/services/plan-data.service';
import {PlanProductType} from '../../../../plan/enums/plan-product-type';
import {Subscription} from 'rxjs/Subscription';
import {INavState} from '../../../interfaces/iNavState';
import {isNil} from 'lodash';
import {ISortPreferences} from 'app/core/interfaces/iSortPreferences';
import {SortByOption} from 'app/core/enums/sort-by-option';
import {IconType} from '../../../../ui-controls/enums/icon-type';

/**
 * This component displays a single row in the plans nav menu.  It is
 * responsible for fetching the view metadata for the plan, and for displaying
 * a list of category rows if the plan is 'expanded'
 */
@Component({
  selector: 'gpr-plan-nav-row',
  template: `
    <gpr-nav-row-template
      *ngIf="plan"
      [title]="plan.planName"
      [subtitle]="subtitleText"
      [iconName]="productTypeIcon"
      (click)="expansionManager.togglePlan(plan.planId)"
      (more)="navigateToPlan(plan.planId)">
    </gpr-nav-row-template>
    <div [@fade]="''" *ngIf="isExpanded && planDetails && planDetails.categories">
      <gpr-category-nav-row
        *ngFor="let category of planDetails.categories"
        [customerNumber]="customerNumber"
        [planId]="planDetails.planId"
        [category]="category"
        [expansionManager]="expansionManager">
      </gpr-category-nav-row>
    </div>`,
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({opacity: '0', position: 'relative', top: '-10px'}),
        animate('.2s ease-out', style({opacity: '1', position: 'relative', top: '0'}))
      ]),
      transition(':leave', [
        style({opacity: '1', position: 'relative', top: '0'}),
        animate('.2s ease-in', style({opacity: '0', position: 'relative', top: '-10px'}))
      ])
    ])
  ]
})
export class PlanNavRowComponent implements OnInit, OnDestroy {

  /**
   * The customer number of the customer containing this plan
   */
  @Input() customerNumber: number;

  /**
   * The plan corresponding to this row
   */
  @Input() plan: IPlan;

  /**
   * Manages whether this plan is expanded
   */
  @Input() expansionManager: PlansExpansionManager;

  /**
   * Current Sort Option being applied
   */
  @Input() sortPreferences: ISortPreferences;

  /**
   * Stores the current value for the plan's expansion state
   */
  public isExpanded: boolean = false;

  /**
   * Icon to represent the product type
   */
  public productTypeIcon: string = PlanProductType.PLANDOC.toLowerCase();

  /**
   * Plan data returned from plan summary call
   */
  public planDetails: IPlan;

  /**
   * Subtitle text to display
   */
  public subtitleText: string;

  /**
   * Variable that holds the subscription of getPlanById
   */
  private _planSub: Subscription;

  /**
   * Creates the plan nav row component
   * @param {PlanDataService} _planDataService
   * @param {NavigatorService} _navigator
   */
  constructor(private _planDataService: PlanDataService,
    private _navigator: NavigatorService) {
  }

  /**
   * On init, get the plan
   */
  ngOnInit(): void {
    this.subtitleText = ' ';
    if (this.plan) {
      if (this.plan.planId) {
        if (this.plan.productType && this.plan.productType !== PlanProductType.VOLUNTARY) {
          this.productTypeIcon = this.plan.productType.toLowerCase();
        } else {
          this.productTypeIcon = IconType.PLANDOC;
        }

        this.expansionManager.registerPlan(this.plan.planId, isExpanded => this.isExpanded = isExpanded);
        if (this._planSub) {
          this._planSub.unsubscribe();
        }
        this._planSub = this._planDataService.getPlanById(this.plan.planId).subscribe(plan => {
          this.planDetails = <IPlan>plan;
        });
        const navState = this._navigator.getNavigationState() as INavState;
        if (!isNil(navState) && !isNil(navState.data) && !isNil(navState.data.plan)) {
          this.expansionManager.openPlan(navState.data.plan.planId);
        }
      }
      if (!isNil(this.sortPreferences)) {
        if (this.sortPreferences.sortBy === SortByOption.EFFECTIVE_DATE) {
          this.subtitleText = `Effective Date: ${this.plan.effectiveDate}`;
        } else if (this.sortPreferences.sortBy === SortByOption.COMPLETION_PERCENTAGE) {
          this.subtitleText = `${this.plan.completionPercentage}% Complete`;
        }
      }
    }
  }

  /**
   * Method used to cleanup resources when component is destroyed
   */
  ngOnDestroy(): void {
    if (this._planSub) {
      this._planSub.unsubscribe();
    }
  }

  /**
   * Uses the navigator to navigate to the selected plan's home page by id
   * @param {string} planId
   */
  public navigateToPlan(planId: string): void {
    this.expansionManager.togglePlan(planId);
    this._navigator.goToCustomerPlanHome(planId, this.customerNumber);
  }
}
