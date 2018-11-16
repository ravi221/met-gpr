import {Component, Input, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {PlansExpansionManager} from '../../../classes/plan-expansion-manager';
import {IPlanCategory} from 'app/plan/plan-shared/interfaces/iPlanCategory';
import {PlanHelper} from 'app/navigation/classes/plan-helper';
import {NavigatorService} from '../../../services/navigator.service';
import {INavState} from 'app/navigation/interfaces/iNavState';
import {isNil} from 'lodash';

@Component({
  selector: 'gpr-category-nav-row',
  template: `
    <gpr-nav-category-row-template
      [category]="category"
      (click)="expansionManager.toggleCategory(categoryUniqueId)">
    </gpr-nav-category-row-template>

    <div [@fade]="''" class="nav-section-row-container" *ngIf="isExpanded">
      <gpr-section-nav-row
        *ngFor="let section of category.sections"
        [customerNumber]="customerNumber"
        [planId]="planId"
        [categoryId]="category.categoryId"
        [section]="section">
      </gpr-section-nav-row>
    </div>
  `,
  styles: ['.nav-section-row-container { padding-bottom: 10px; }'],
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
export class CategoryNavRowComponent implements OnInit {
  /**
   * The customer number of the customer containing this category
   */
  @Input() customerNumber: number;

  /**
   * The id of the plan containing this category
   */
  @Input() planId: string;

  /**
   * The category corresponding to this row
   */
  @Input() category: IPlanCategory;

  /**
   * Maintains the expansion state
   */
  @Input() expansionManager: PlansExpansionManager;

  /**
   * Stores the current expansion state of the category
   */
  public isExpanded: boolean;

  /**
   * Unique Id to be used to toggle categories for a given plan on the main navigation
   */
  public categoryUniqueId: string;

  /**
   * Default constructor
   * @param {NavigatorService} _navigator navigator service
   */
  constructor(private _navigator: NavigatorService) {
  }

  /**
   * On init, register this category to expand/collapse
   */
  ngOnInit(): void {
    if (this.planId && this.category && this.category.categoryId) {
      this.categoryUniqueId = PlanHelper.getUniqueCategoryId(this.planId, this.category.categoryId);
      this.expansionManager.registerCategory(this.categoryUniqueId, isExpanded => this.isExpanded = isExpanded);
    }
    const navState = this._navigator.getNavigationState() as INavState;
    this._openCategoryByNavState(navState);
  }

  /**
   * Opens the a category given the nav state
   * @param {INavState} navState
   * @private
   */
  private _openCategoryByNavState(navState: INavState): void {
    if (isNil(navState)) {
      return;
    }

    const data = navState.data;
    if (isNil(data)) {
      return;
    }

    const planCategoryData = data.planCategoryData;
    if (isNil(planCategoryData)) {
      return;
    }

    const planId = planCategoryData.planId;
    const categoryId = planCategoryData.categoryId;
    this.expansionManager.openCategory(PlanHelper.getUniqueCategoryId(planId, categoryId));
  }
}
