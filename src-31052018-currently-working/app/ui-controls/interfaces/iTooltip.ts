import {TooltipContentComponent} from '../components/tooltip/tooltip-content.component';

/**
 * Interface to represent a tooltip on the screen
 */
export interface ITooltip {
  /**
   * The unique id of the tool tip
   */
  id: string;

  /**
   * A reference to the the inner html content
   */
  tooltipContent: TooltipContentComponent;

  /**
   * Value to determine if the tooltip is visible
   */
  isVisible: boolean;
}
