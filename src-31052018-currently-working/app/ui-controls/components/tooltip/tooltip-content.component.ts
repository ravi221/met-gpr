import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {TooltipService} from '../../services/tooltip.service';
import {ITooltip} from '../../interfaces/iTooltip';
import {TooltipPositionService} from '../../services/tooltip-position.service';
import {debounce} from 'app/core/decorators/debounce';
import {TooltipPosition} from '../../enums/tooltip-position';

/**
 * Component to hold the content of the tooltip
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
@Component({
  selector: 'gpr-tooltip-content',
  template: `
    <div class="tooltip-content {{theme}}"
         [style.top.px]="top"
         [style.left.px]="left"
         [ngStyle]="(maxWidth && maxWidth >= 0)?{'width': maxWidth + 'px'}:{}"
         [class.visible]="isVisible"
         [class.no-close-icon]="!displayCloseIcon"
         gprEscapeKey
         (escapeKeyPress)="onEscapeKeyPress($event)">
      <ng-container *ngIf="showArrow">
        <div class="tooltip-arrow {{position}}"></div>
      </ng-container>
      <a *ngIf="displayCloseIcon" class="tooltip-close" (click)="closeTooltip()"><i class="material-icons">close</i></a>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./tooltip-content.component.scss']
})
export class TooltipContentComponent {
  /**
   * Indicates whether pressing 'ESC' key will close the tooltip.
   * @type {boolean}
   */
  @Input() closeOnEsc: boolean = true;

  /**
   * Indicates whether clicking off the tooltip will close it.
   * @type {boolean}
   */
  @Input() closeOnClickOff: boolean = true;

  /**
   * A reference to the {@link ITooltip}
   */
  @Input() tooltip: ITooltip;

  /**
   * The element the tooltip is attached to
   */
  @Input() htmlElement: HTMLElement;

  /**
   * The position of the tooltip
   */
  @Input('position')
  set position(value: any) {
    switch (value) {
      case TooltipPosition.TOP:
      case TooltipPosition.LEFT:
      case TooltipPosition.RIGHT:
      case TooltipPosition.BOTTOM:
        this._position = <TooltipPosition>value;
        break;
      default:
        this._position = TooltipPosition.DEFAULT;
    }
  }
  get position(): any {
    if (this._position === null) {
      this._position = TooltipPosition.DEFAULT;
    }
    return this._position;
  }

  /**
   * The theme of the tooltip
   */
  @Input() theme: 'default' | 'white' = 'default';

  /**
   * Boolean if to display the close 'X' button or not
   */
  @Input() displayCloseIcon: boolean = true;

  /**
   * Max width for popup box
   */
  @Input() maxWidth?: number;

  /**
   * Additional offset for popup box
   */
  @Input() offsetX: number = 0;

  /**
   * display tooltip  arrows
   */
  @Input() showArrow?: boolean = false;

  /**
   * The top position of the tooltip
   */
  public top: number;

  /**
   * The left position of the tooltip
   */
  public left: number;

  /**
   * A boolean whether to show or hide the tooltip
   */
  public isVisible: boolean = false;

  /**
   * Stores position of tooltip
   */
  private _position: TooltipPosition;

  /**
   * Creates the tooltip content
   * @param {ElementRef} elementRef
   * @param {TooltipPositionService} _tooltipPositionService
   * @param {TooltipService} _tooltipService
   */
  constructor(public elementRef: ElementRef,
    private _tooltipPositionService: TooltipPositionService,
    private _tooltipService: TooltipService) {
  }

  /**
   * Closes the tooltip
   */
  public closeTooltip(): void {
    this._tooltipService.hide(this.tooltip);
  }

  /**
   * Function to either show or display the tooltip
   * @param {boolean} isVisible If true, the tooltip will be displayed
   */
  public setVisiblity(isVisible: boolean): void {
    this.isVisible = isVisible;
    if (this.tooltip) {
      this.tooltip.isVisible = this.isVisible;
    }
    this.updateTooltipPosition();
  }

  /**
   * Updates the position of the tooltip
   */
  @debounce(5)
  public updateTooltipPosition(): void {
    if (!this.isVisible) {
      return;
    }
    const pos = this._tooltipPositionService.getTooltipPosition(this.position, this.htmlElement, this.elementRef.nativeElement.children[0]);
    this.top = pos.top;
    this.left = pos.left + this.offsetX;
  }

  /**
   * Handles the event user clicks off the tooltip and host element
   * @param $event
   */
  public handleDocumentClick($event: any): void {
    if (this.closeOnClickOff) {
      const target = this.elementRef.nativeElement;
      const isOutsideClick = !(target.contains($event.target) || this.htmlElement.contains($event.target));
      if (isOutsideClick) {
        this.closeTooltip();
      }
    }
  }

  /**
   * Called by gprEscapeKey directive's emitter when the ESC key is pressed
   * @param $event
   */
  public onEscapeKeyPress($event: KeyboardEvent): void {
    const shouldCloseTooltip = this.isVisible && this.closeOnEsc && !$event.defaultPrevented;
    if (shouldCloseTooltip) {
      this.closeTooltip();
    }
  }
}
