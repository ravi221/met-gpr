import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * A ui component to show an expand or collapse icon depending on the current state
 */
@Component({
  selector: 'gpr-expand-collapse-icon',
  template: `
    <span class="expand-collapse-icon" (click)="toggleExpanded()">
      <i class="material-icons" *ngIf="isExpanded">keyboard_arrow_up</i>
      <i class="material-icons" *ngIf="!isExpanded">keyboard_arrow_down</i>
    </span>
  `,
  styles: ['.expand-collapse-icon {cursor: pointer;}']
})
export class ExpandCollapseIconComponent {
  /**
   * Indicates if the icon should display as expanded
   * @type {boolean}
   */
  @Input() isExpanded: boolean = false;

  /**
   * Outputs true if to expand content, false if to collapse
   * @type {EventEmitter<boolean>}
   */
  @Output() expand: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Toggles the state of expanded (true for expand, false for collapse)
   */
  public toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
    this.expand.emit(this.isExpanded);
  }
}
