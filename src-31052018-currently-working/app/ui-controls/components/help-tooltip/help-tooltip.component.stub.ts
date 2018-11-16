import {Component, Input} from '@angular/core';

@Component({
  selector: 'gpr-help-tooltip',
  template: ``
})
export class HelpTooltipStubComponent {
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  /**
   * The theme of the tooltip
   */
  @Input() theme: 'default' | 'white' = 'white';

  /**
   * Boolean if to display the close 'X' button or not
   */
  @Input() displayCloseIcon = false;

  /**
   * Max width for popup box
   */
  @Input() maxWidth?: number;

  /**
   * Editable help text
   */
  @Input() editable: boolean = false;
}
