import {Component, Input, OnInit} from '@angular/core';

/**
 * A component that handles the creation of a flag. When an icon is clicked a popover pops up that allows the user
 * to create a flag
 */
@Component({
  selector: 'gpr-flag-create-tooltip',
  template: `
    <gpr-tooltip-content #flagToolTip>
      <div class="plrbt-15 tooltip-container">
        <span>Create a Flag</span>
        <br>
        <textarea maxlength="256" class="flag-textarea"></textarea>
        <footer class="flag-footer">
          <button class="save-button">Save</button>
        </footer>
      </div>
    </gpr-tooltip-content>
    <gpr-icon gprTooltip [tooltipContent]="flagToolTip"
              [position]="position"
              [theme]="'white'"
              [displayCloseIcon]="false" name="flag-on">
    </gpr-icon>

  `,
  styleUrls: ['./flag-create-tooltip.component.scss']
})
export class FlagCreateTooltipComponent implements OnInit {

  /**
   * The position where to place the tooltip
   */
  @Input() position: string = 'left';

  /**
   * The customer number to add the flag to
   */
  @Input() customerNumber: number;

  /**
   * The plan id to add the flag to
   */
  @Input() planId: number;

  /**
   * The question id to add the flag to
   */
  @Input() questionId: string;

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * On init, nothing to do yet
   */
  ngOnInit() {
  }

}
