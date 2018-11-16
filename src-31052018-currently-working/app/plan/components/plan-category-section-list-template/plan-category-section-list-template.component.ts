import {Component, Input, OnInit} from '@angular/core';
import {IPlanSection} from 'app/plan/plan-shared/interfaces/iPlanSection';
import {PlanHelper} from 'app/navigation/classes/plan-helper';

@Component({
  selector: 'gpr-plan-category-section-list-template',
  template: `
    <div class="category-section-row">
      {{section?.sectionName}}
      <span [class]="statusColor">{{statusCode}}</span>
    </div>
  `,
  styleUrls: ['./plan-category-section-list-template.component.scss']
})
export class PlanCategorySectionListTemplateComponent implements OnInit {
  /**
   * The section corresponding to this row
   */
  @Input() section: IPlanSection;

  /**
   * Current status of the Color
   */
  public statusColor: string;

  /**
   * Current status of the Category
   */
  public statusCode: string;

  /**
   * On init, fetches all plan related information
   */
  ngOnInit(): void {
    if (this.section && this.section.completionPercentage >= 0) {
      this.statusCode = PlanHelper.getCompletionStatusByCompletionPercentage(this.section.completionPercentage);
      this.statusColor = PlanHelper.getDisplayColorByStatus(this.statusCode);
    }
  }
}
