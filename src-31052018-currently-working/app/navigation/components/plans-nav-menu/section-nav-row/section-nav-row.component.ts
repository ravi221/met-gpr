import {Component, Input} from '@angular/core';
import {NavigatorService} from '../../../services/navigator.service';
import {IPlanSection} from 'app/plan/plan-shared/interfaces/iPlanSection';
import {isNil} from 'lodash';

/**
 * A section nav row component which handles navigating to a section
 */
@Component({
  selector: 'gpr-section-nav-row',
  template: `
    <gpr-nav-section-row-template [section]="section" (click)="navigate()"></gpr-nav-section-row-template>`
})
export class SectionNavRowComponent {
  /**
   * The customer number of the customer containing this section
   */
  @Input() customerNumber: number;

  /**
   * The id of the plan containing this section
   */
  @Input() planId: string;

  /**
   * The id of the category containing this section
   */
  @Input() categoryId: string;

  /**
   * The section corresponding to this row
   */
  @Input() section: IPlanSection;

  /**
   * Creates the section nav row
   * @param {NavigatorService} _navigator
   */
  constructor(private _navigator: NavigatorService) {
  }

  /**
   * Uses the navigator to navigate to the plan entry screen with the selected section active
   */
  public navigate(): void {
    const canNavigateToSection = this._canNavigateToSection();
    if (canNavigateToSection) {
      this._navigator.goToPlanEntrySectionFromNav(this.customerNumber, this.planId, this.categoryId, this.section.sectionId);
    }
  }

  /**
   * Determines if the user is able to navigate to the specific section given the inputs
   * @returns {boolean}
   * @private
   */
  private _canNavigateToSection(): boolean {
    if (isNil(this.customerNumber)) {
      return false;
    }

    const planId = this.planId;
    if (isNil(planId) || planId.length === 0) {
      return false;
    }

    const categoryId = this.categoryId;
    if (isNil(categoryId) || categoryId.length === 0) {
      return false;
    }

    const section = this.section;
    if (isNil(section)) {
      return false;
    }

    const sectionId = section.sectionId;
    if (isNil(sectionId) || sectionId.length === 0) {
      return false;
    }
    return true;
  }
}
