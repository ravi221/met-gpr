import {ChangeDetectionStrategy, Component, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';

/**
 * A component to show the select plan button and display text on tooltip onMouseover/onMouseleave when the button is Disabled/Enabled.
 */
@Component({
  selector: 'gpr-mass-update-select-plans-toolbar',
  template: `
    <div class="mass-update-tooltip" >
      <gpr-tooltip-content #errorTooltipContent>
        <div class="mass-update-tooltip-content" *ngIf="!canSelectPlans">
          <p class="mass-update-tooltip-msg">Please select at least one</p>
        </div>
      </gpr-tooltip-content>
      <span gprHoverTooltip
        [tooltipContent]="errorTooltipContent"
        [position]="'top'"
        [theme]="'white'"
        [isMousedOver]="true"
        [displayCloseIcon]="false"
        [maxWidth]="200">
        <button type="button" (click)="openModal()" [disabled]="!canSelectPlans" class="btn btn-secondary" >Select Plans</button>   {{checkedQuestionsCount}} Attributes selected
      </span>
    </div>
  `,
  styleUrls: ['./mass-update-select-plans-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MassUpdateSelectPlansToolbarComponent implements OnDestroy {

  /**
   * Gets the count of checked questions
   * param{number}
   */
  @Input() checkedQuestionsCount: number = 0;

  /**
   * Handles select plan button tobe disabled/enabled
   * param{boolean}
   */
  @Input() canSelectPlans: boolean = false;

  /**
   * Output event to navigate to the select plans modal when the Select Plans button is clicked
   */
  @Output() handleSelectPlansModal: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Creates the Mass Update Component
   * @param {_massUpdateDataService} _massUpdateDataService
   */
  constructor(private _massUpdateDataService: MassUpdateDataService) {}

  /**
   * On destroy, unsubscribe from all subscriptions
   */
  ngOnDestroy() {

  }

  /**
   * Function to emit the select plans event
   */
  public openModal(): void {
    this.handleSelectPlansModal.emit();
  }
}
