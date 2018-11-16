import {Component, Input, OnInit} from '@angular/core';
import {IPlanCategory} from 'app/plan/plan-shared/interfaces/iPlanCategory';
import {PlanHelper} from 'app/navigation/classes/plan-helper';
import {isNil} from 'lodash';

/**
 * Used to display the Categories on the Main Navigation
 */
@Component({
  selector: 'gpr-nav-category-row-template',
  template: `
    <div class="nav-category-row">{{category?.categoryName}}<span [class]="statusColor">{{statusCode}}</span></div>
  `,
  styleUrls: ['./nav-category-row-template.component.scss']
})
export class NavCategoryRowTemplateComponent implements OnInit {
  /**
   * Category to display details on the main navigation
   */
  @Input() category: IPlanCategory;

  /**
   * Color to show status in
   */
  public statusColor: string;

  /**
   * Current status of the Category
   */
  public statusCode: string;

  /**
   * Initialized the Nav Category Row Template for the Main Navigation
   */
  ngOnInit(): void {
    if (!isNil(this.category)) {
      this.statusCode = PlanHelper.getCompletionStatusByCompletionPercentage(this.category.completionPercentage);
      this.statusColor = PlanHelper.getDisplayColorByStatus(this.statusCode);
    }
  }
}

