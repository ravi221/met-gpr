import {ChangeDetectionStrategy, Component, OnInit, Input} from '@angular/core';
import {IMassUpdateCheckedPlansResponse} from 'app/plan/mass-update/interfaces/iMassUpdateCheckedPlansResponse';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';

/**
 * A component to show the updated plans on tooltip.
 */
@Component({
  selector: 'gpr-mass-update-select-plans-tooltip',
  template: `
        <div class="mass-update-tooltip" >
      <gpr-tooltip-content #errorTooltipContent>
        <div class="mass-update-tooltip-content" *ngIf="index === _massUpdateDataService?.isCategorySelected()">
          <p class="mass-update-tooltip-msg" *ngFor="let plansList of selectedPlansResponse.planNames">

           <small>{{plansList}}</small></p>
        </div>
      </gpr-tooltip-content>
      <span name="validation-error"
        gprTooltip
        [tooltipContent]="errorTooltipContent"
        [position]="'bottom'"
        [showArrow]="true"
        [theme]="'white'"
        [displayCloseIcon]="false"
        [maxWidth]="300"
      >
	  <div *ngFor="let categoryIndex of categoryIndexes">
	    <p *ngIf="selectedPlansLength !== 0 && categoryIndex === _massUpdateDataService?.isCategorySelected();then plansResponse else actualText" class="mass-update-label-message">These attributes have not been sent to any plans yet</p>
	  </div>
	  <ng-template #plansResponse><span class="mass-update-label-message">sent to <a>2 plans</a></span></ng-template>
      <ng-template #actualText><span class="mass-update-label-message">These attributes have not been sent to any plans yet</span></ng-template>
      </span>
    </div>
  `,
  styleUrls: ['./mass-update-select-plans-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MassUpdateSelectPlansTooltipComponent implements OnInit {

  /**
   * Gets the selected plans response
   */
  @Input() selectedPlansResponse: IMassUpdateCheckedPlansResponse[];

  /**
   * Gets the index number
   */
  @Input() index: number;

  /**
   * It stores the category indexes for mapping selected plans response to category labels
   */
  public categoryIndexes: number[] = [];

  /**
   * Gets the length of selected plans
   */
  public selectedPlansLength: number;

  constructor(private _massUpdateDataService: MassUpdateDataService) {}

  ngOnInit(): void {
    this.categoryIndexes.push(this.index);
  }
  /**
   * On initialize, gets the selected plans length
   */
  private _initialize() {
    this.selectedPlansLength =  this.selectedPlansResponse.length;
  }
}
