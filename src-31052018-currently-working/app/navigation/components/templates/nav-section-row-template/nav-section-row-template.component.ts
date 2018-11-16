import {Component, Input, OnInit} from '@angular/core';
import {IPlanSection} from 'app/plan/plan-shared/interfaces/iPlanSection';
import {PlanHelper} from 'app/navigation/classes/plan-helper';
import {isNil} from 'lodash';

/**
 * Placeholder for a generic navigation sub-sub-row (such as
 * the section names displayed beneath an expanded category row)
 */
@Component({
  selector: 'gpr-nav-section-row-template',
  template: `
    <div class="nav-section-row">{{section?.sectionName}}<span [class]="statusColor">{{statusCode}}</span></div>
  `,
  styleUrls: ['./nav-section-row-template.component.scss']
})
export class NavSectionRowTemplateComponent implements OnInit {
  /**
   * The Section Information to be displayed
   */
  @Input() section: IPlanSection;

  /**
   * Color to show status in
   */
  public statusColor: string;

  /**
   * Current status of the Category
   */
  public statusCode: string;

  /**
   * On init, setup the section row
   */
  ngOnInit(): void {
    if (!isNil(this.section)) {
      this.statusCode = PlanHelper.getCompletionStatusByCompletionPercentage(this.section.completionPercentage);
      this.statusColor = PlanHelper.getDisplayColorByStatus(this.statusCode);
    }
  }
}
