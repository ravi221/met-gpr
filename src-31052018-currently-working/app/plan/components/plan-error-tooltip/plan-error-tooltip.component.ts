import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {NavigatorService} from '../../../navigation/services/navigator.service';

/**
 * A component to show the number of errors for a plan and allow the user to click
 * an additional link to display a full error report
 *
 * This component is used on the {@link PlanListComponent} and {@link PlanLandingComponent}
 */
@Component({
  selector: 'gpr-plan-error-tooltip',
  template: `
    <div class="plan-error-tooltip" *ngIf="hasErrors">
      <gpr-tooltip-content #errorTooltipContent>
        <div class="plan-error-tooltip-content">
          <p class="plan-error-msg">{{errorMessage}}</p>
          <a class="plan-error-link" (click)="navigateToErrorReport()">View Error Report</a>
        </div>
      </gpr-tooltip-content>
      <gpr-icon name="validation-error"
                gprTooltip
                [tooltipContent]="errorTooltipContent"
                [position]="'right'"
                [theme]="'default'"
                [displayCloseIcon]="true"
                [maxWidth]="300"></gpr-icon>
    </div>
  `,
  styleUrls: ['./plan-error-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanErrorTooltipComponent implements OnInit, OnChanges {

  /**
   * The number of errors
   * @type {number}
   */
  @Input() errorCount: number = 0;

  /**
   * The plan id for this plan, used to navigate to the error report
   */
  @Input() planId: string;

  /**
   * The error message to display
   * @type {number}
   */
  public errorMessage: string = '';

  /**
   * Indicates if there are errors
   * @type {boolean}
   */
  public hasErrors: boolean = false;

  /**
   * Creates the plan error tooltip component
   * @param {NavigatorService} _navigator
   */
  constructor(private _navigator: NavigatorService) {
  }

  /**
   * On init, setup the error tooltip
   */
  ngOnInit(): void {
    this._updateTooltip();
  }

  /**
   * On changes, setup the error tooltip
   */
  ngOnChanges(): void {
    this._updateTooltip();
  }

  /**
   * Navigates to a plan error report
   */
  public navigateToErrorReport(): void {
    this._navigator.goToPlanErrorReport(this.planId);
  }

  /**
   * Updates the tooltip
   * @private
   */
  private _updateTooltip(): void {
    const errorCount = this.errorCount;
    this.hasErrors = errorCount > 0;

    const errorMessageEnd = errorCount === 1 ? 'Error' : 'Errors';
    this.errorMessage = `${this.errorCount} ${errorMessageEnd}`;
  }
}
