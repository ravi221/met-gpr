import {Component, OnInit} from '@angular/core';
import {NavigatorService} from '../../../../navigation/services/navigator.service';
import {IPPCResponse} from '../../interfaces/iPPCResponse';
import {IPPCResponseSection} from '../../interfaces/iPPCResponseSection';
import {IPPCResponseCategory} from '../../interfaces/iPPCResponseCategory';
import {IPPCValidation} from '../../interfaces/iPPCValidation';


/**
 * A component to show the validation error report based PPC validations
 */
@Component({
  selector: 'gpr-validation-error-report',
  template: `
    <section class="validation-error-report">
      <h2 class="validation-error-title">{{errorReportTitle}}</h2>
      <gpr-card>
        <div class="validation-errors" *ngIf="hasErrors">
          <!-- Categories -->
          <section class="validation-category-error" *ngFor="let category of errorCategories">
            <h3 class="error-label">{{category.categoryLabel}}</h3>
            <h5 class="error-message">{{category.errorMessage}}</h5>

            <!-- Sections -->
            <section class="validation-section-error" *ngFor="let section of category.sections">
              <header class="section-errors-header">
                <gpr-icon [name]="'validation-error'"></gpr-icon>
                <div class="section-label">
                  <h3 class="error-label">{{section.sectionLabel}}</h3>
                  <h5 class="error-message">{{section.errorMessage}}</h5>
                </div>
              </header>

              <!-- Questions -->
              <section class="validation-question-error" *ngFor="let question of section.questions">
                <h3 class="question-label">{{question.questionSelection}}</h3>
                <h5 class="error-message question-error">{{question.errors.join('')}}</h5>
              </section>
            </section>
          </section>
        </div>
        <div class="no-validation-errors" *ngIf="!hasErrors">
          <span class="text-muted">All categories and sections are valid for this plan.</span>
        </div>
      </gpr-card>
    </section>
  `,
  styleUrls: ['./validation-error-report.component.scss']
})
export class ValidationErrorReportComponent implements OnInit {

  /**
   * The title for the error report
   * @type {string}
   */
  public errorReportTitle: string = '';

  /**
   * All of the error categories
   * @type {Array}
   */
  public errorCategories: any[] = [];

  /**
   * Indicates if there are errors
   * @type {boolean}
   */
  public hasErrors: boolean = true;

  /**
   * When creating the validation error report, get the navigation route data
   * @param {NavigatorService} _navigator
   */
  constructor(private _navigator: NavigatorService) {
  }

  /**
   * On init get the data from the navigation state
   */
  ngOnInit(): void {
    const navState = this._navigator.getNavigationState();
    const ppcResponse = navState.data.ppcResponse;
    this._setupErrorReport(ppcResponse);
  }

  /**
   * Sets up the error report based on the given ppc response
   * @param {IPPCResponse} ppcResponse
   * @private
   */
  private _setupErrorReport(ppcResponse: IPPCResponse): void {
    const errorCount = ppcResponse.errorCount;
    this.hasErrors = errorCount > 0;
    this.errorReportTitle = `${errorCount} errors in ${ppcResponse.planName}`;
    this._setupCategories(ppcResponse.categories);
  }

  /**
   * Sets up the categories for the error report
   * @private
   */
  private _setupCategories(categories: IPPCResponseCategory[]): void {
    this.errorCategories = categories.filter(category => category !== null);
    this.errorCategories.forEach((category: any) => {
      const errorCount = category.errorCount;
      category.errorMessage = `${errorCount} ${this._getErrorMessageEnding(errorCount)}`;
      category.sections = this._setupSections(category.sections);
    });
  }

  /**
   * Sets up the sections for the error report
   * @private
   */
  private _setupSections(sections: IPPCResponseSection[]): any[] {
    const errorSections = sections.filter(section => section !== null);
    errorSections.forEach((section: any) => {
      const errorCount = section.errorCount;
      section.errorMessage = `${errorCount} ${this._getErrorMessageEnding(errorCount)}`;
      section.questions = this._setupQuestions(section.questions);
    });
    return errorSections;
  }

  /**
   * Sets up the questions for the error report
   * @private
   */
  private _setupQuestions(questions: IPPCValidation[]): any[] {
    const errorQuestions = questions.filter(question => question !== null);
    errorQuestions.forEach((question: any) => {
      const questionValue = question.questionValue;
      const newQuestionValue = questionValue === '' ? '(No Selection)' : `(${questionValue})`;
      question.questionSelection = `${question.questionLabel}: ${newQuestionValue}`;
    });
    return errorQuestions;
  }

  /**
   * Gets the ending for displaying errors, either with an (s) or without
   * @param {number} errorCount
   * @returns {string}
   * @private
   */
  private _getErrorMessageEnding(errorCount: number): string {
    return errorCount === 1 ? 'error' : 'errors';
  }
}
