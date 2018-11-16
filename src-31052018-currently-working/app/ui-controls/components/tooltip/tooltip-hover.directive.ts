import {Directive, HostListener, Input, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {TooltipContentComponent} from './tooltip-content.component';
import {TooltipService} from '../../services/tooltip.service';
import {ITooltip} from '../../interfaces/iTooltip';
import {TooltipPosition} from 'app/ui-controls/enums/tooltip-position';

/**
 * A tooltip to display custom content once the tooltip is clicked
 *
 * In an enclosing Component class:
 *
 * ```typescript
 * template: '
 * <gpr-tooltip-content #myTooltipContent>
 *     <p>Place the contents of the tooltip in here.</p>
 * </gpr-tooltip-content>
 * <button gprTooltip [tooltipContent]="myTooltipContent">Click me to trigger tooltip</button>
 * '
 * ```
 */
@Directive({
  selector: '[gprHoverTooltip]'
})
export class TooltipHoverDirective implements OnInit, OnDestroy {

  /**
   * The content to display inside of tooltip
   */
  @Input() tooltipContent: TooltipContentComponent;

  /**
   * The position of the tooltip
   */
  @Input() position: TooltipPosition = TooltipPosition.DEFAULT;

  /**
   * The theme of the tooltip
   */
  @Input() theme: 'default' | 'white' = 'default';

  /**
   * Boolean if to display the close 'X' button or not
   */
  @Input() displayCloseIcon = true;

  /**
   * Max width for popup box
   */
  @Input() maxWidth?: number;

  /**
   * display tooltip  arrows
   */
  @Input() showArrow?: boolean = true;

  /**
   * Indicates if the tooltip has been created
   * @type {boolean}
   * @private
   */
  private _hasCreatedTooltip: boolean = false;

  /**
   * A reference to {@link ITooltip}
   */
  private tooltipRef: ITooltip;

  /**
   * Indicates the tooltip need to visible on mouseover
   * @type {boolean}
   */
  @Input() isMousedOver: boolean = true;

  /**
   * Creates the tooltip directive
   * @param {TooltipService} _tooltipService
   * @param {ViewContainerRef} _viewContainerRef
   */
  constructor(private _tooltipService: TooltipService,
    private _viewContainerRef: ViewContainerRef) {
  }

  /**
   * On init, setup the tooltip
   */
  ngOnInit(): void {

  }

  /**
   * On destroy, remove the tooltip
   */
  ngOnDestroy(): void {
    this._tooltipService.destroy(this.tooltipRef);
  }

  /**
   * Show the tooltip on mouseover event
   */
  @HostListener('mouseover', [])
  public onMouseover(): void {
    if (!this._hasCreatedTooltip) {
      this._createTooltip();
    }
    if (this.isMousedOver) {
      this._tooltipService.show(this.tooltipRef);
    }
  }

  /**
   * Hide tooltip on mouseleave event
   */
  @HostListener('mouseleave', [])
  public onMouseLeave(): void {
    if (this.isMousedOver) {
      this._tooltipService.hide(this.tooltipRef);
    }
  }

  /**
   * Creates the tooltip
   * @private
   */
  private _createTooltip(): void {
    this.tooltipRef = this._tooltipService.create(this.tooltipContent);
    this.tooltipContent.htmlElement = this._viewContainerRef.element.nativeElement;
    this.tooltipContent.position = this.position;
    this.tooltipContent.theme = this.theme;
    this.tooltipContent.tooltip = this.tooltipRef;
    this.tooltipContent.displayCloseIcon = this.displayCloseIcon;
    this.tooltipContent.maxWidth = this.maxWidth;
    this.tooltipContent.showArrow = this.showArrow;
    this.tooltipContent.isVisible = false;
    this._hasCreatedTooltip = true;
  }
}
