import {Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {IPlan} from '../../interfaces/iPlan';
import {IPlanCategory} from '../../interfaces/iPlanCategory';
import {IPlanSection} from '../../interfaces/iPlanSection';
import {isNil} from 'lodash';
import {NavigatorService} from '../../../../navigation/services/navigator.service';
import {ElementSchemaRegistry} from '@angular/compiler';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {IPlanEntryNavigate} from 'app/plan/plan-shared/interfaces/iPlanEntryNavigate';
import {PlanEntryNavigationDirection} from 'app/plan/enums/plan-entry-navigation-direction';

@Component({
  selector: 'gpr-plan-entry-navigation-button',
  template: `
    <div *ngIf="shouldShowPrevious" class="previous">
      <a class="btn" (click)="onNavigate()" title="{{hoverText}}"><i class="material-icons">arrow_back</i>PREVIOUS</a>
    </div>
    <div *ngIf="shouldShowNext">
    <button class="btn btn-primary next" (click)="onNavigate()" title="{{hoverText}}">NEXT<i class="material-icons">arrow_forward</i></button>
    </div>
  `,
  styleUrls: ['./plan-entry-navigation-button.component.scss']
})
export class PlanEntryNavigationButtonComponent implements OnInit, OnChanges {

  /**
   * Used to determine which direction the arrow is displayed and styling
   */
  @Input() direction: PlanEntryNavigationDirection;
  /**
   * Plan being displayed on the data entry screen
   */
  @Input() plan: IPlan;

  /**
   * Current Category being displayed on the data entry screen
   */
  @Input() currentCategory: IPlanCategory;
  /**
   * Current Section being displayed on the data entry screen
   */
  @Input() currentSection: IPlanSection;

  /**
   * Emitter used to notified when a user clicks a button to switch screens
   */
  @Output() navigate: EventEmitter<IPlanEntryNavigate> = new EventEmitter<IPlanEntryNavigate>();

  /**
   * Text to display on the button
   */
  public hoverText: string = '';
  /**
   * Flag used to determine if the previous button should be displayed
   */
  public shouldShowPrevious: boolean = true;
  /**
   * Flag used to determine if the next button should be displayed
   */
  public shouldShowNext: boolean = true;

  /**
   * Used to store the current category index
   */
  private _categoryIndex: number;
  /**
   * Used to store the current section index
   */
  private _sectionIndex: number;

  /**
   * Used to store the new Category Id
   */
  private _newCategoryId: string;
  /**
   * Used to store the new Section Id
   */
  private _newSectionId: string;

  constructor() {}

  ngOnInit() {
    this._initialize();
  }
  /**
 * detects changes to the section/category and initializes a new active section if there is a change
 * @param $event
 */
  ngOnChanges($event) {
    this._initialize();
  }

  /**
   * Called when the user clicks next/previous button
   */
  public onNavigate(): void {
    this.navigate.emit(<IPlanEntryNavigate>{
      newSectionId: this._newSectionId,
      newCategoryId: this._newCategoryId
    });
  }

  /**
   * Initialization method that determines the navigation button
   */
  private _initialize() {
    this.shouldShowNext = false;
    this.shouldShowPrevious = false;
    if (this._validInputs()) {
      this._categoryIndex = this.plan.categories.findIndex((category) => category.categoryId === this.currentCategory.categoryId);
      this._sectionIndex = this.currentCategory.sections.findIndex((section) => section.sectionId === this.currentSection.sectionId);
      switch (this.direction) {
        case PlanEntryNavigationDirection.PREVIOUS:
          this.shouldShowPrevious = true;
          this._determinePreviousButtonHoverText();
          break;
        case PlanEntryNavigationDirection.NEXT:
          this.shouldShowNext = true;
          this._determineNextButtonHoverText();
          break;
      }
    }
  }

  /**
   * Determines if all the necessary inputs were sent to the component
   */
  private _validInputs(): boolean {
    if (isNil(this.plan)) {
      return false;
    }
    if (isNil(this.plan.categories) || this.plan.categories.length === 0) {
      return false;
    }
    if (isNil(this.currentCategory) || isNil(this.currentSection)) {
      return false;
    }
    return true;
  }

  /**
   * Determines what the previous button should be display as hover text
   */
  private _determinePreviousButtonHoverText(): void {
    const newSectionIndex = this._sectionIndex - 1;
    if (newSectionIndex < 0) {
      const newCategoryIndex = this._categoryIndex - 1;
      if (newCategoryIndex < 0) {
        this.shouldShowPrevious = false;
        this._newCategoryId = null;
        this._newSectionId = null;
      } else {
        this.hoverText = this.plan.categories[newCategoryIndex].categoryName;
        this._newCategoryId = this.plan.categories[newCategoryIndex].categoryId;
        this._newSectionId = null;
      }
    } else {
      this.hoverText = this.currentCategory.sections[newSectionIndex].sectionName;
      this._newCategoryId = null;
      this._newSectionId = this.currentCategory.sections[newSectionIndex].sectionId;
    }
  }

  /**
   * Determines what the next button should be display as hover text
   */
  private _determineNextButtonHoverText(): void {
    const newSectionIndex = this._sectionIndex + 1;
    if (newSectionIndex >= this.currentCategory.sections.length) {
      const newCategoryIndex = this._categoryIndex + 1;
      if (newCategoryIndex >= this.plan.categories.length) {
        this.shouldShowNext = false;
        this._newCategoryId = null;
        this._newSectionId = null;
      } else {
        this.hoverText = this.plan.categories[newCategoryIndex].categoryName;
        this._newCategoryId = this.plan.categories[newCategoryIndex].categoryId;
        this._newSectionId = null;
      }
    } else {
      this.hoverText = this.currentCategory.sections[newSectionIndex].sectionName;
      this._newCategoryId = null;
      this._newSectionId = this.currentCategory.sections[newSectionIndex].sectionId;
    }
  }

}
