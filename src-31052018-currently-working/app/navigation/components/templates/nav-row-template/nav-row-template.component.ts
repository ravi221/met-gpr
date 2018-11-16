import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * This component is presentational only; the rows displayed in the customers
 * menu are styled the same as the rows displayed in the plans menu, so this
 * provides a template.  The only logic provided by the component is toggling
 * the iconState from '' to 'selected' on mouseover so that the alternate-color
 * version of the icon will be displayed.
 *
 * ```html
 * <gpr-nav-row-template
 *   [title]="'The plan or customer name'"
 *   [subtitle]="'Some contextual information that might change based on context'"
 *   [iconName]="'The name of the icon to be used'"
 *   (click)="doSomethingWhenTheUserClicksOnTheWholeRow()"
 *   (more)="doSomethingWhenTheUserClicksTheMoreIcon()">
 * <gpr-nav-row-template>
 * ```
 */
@Component({
  selector: 'gpr-nav-row-template',
  template: `
    <div class="nav-row" (mouseenter)="iconState = 'selected';" (mouseleave)="iconState = '';">
      <div class="nav-icon-wrapper">
        <gpr-icon class="nav-icon" [name]="iconName" [state]="iconState"></gpr-icon>
      </div>
      <div class="nav-info">
        <div class="nav-row-title">{{title}}</div>
        <div class="nav-row-subtitle">{{subtitle}}</div>
      </div>
      <div class="more-icon-wrapper">
        <gpr-icon class="nav-icon" [name]="'more'" (click)="emitMore($event)"></gpr-icon>
      </div>
    </div>
  `,
  styleUrls: ['./nav-row-template.component.scss']
})
export class NavRowTemplateComponent {
  /**
   * The plan or customer name
   */
  @Input() title;

  /**
   * Emits an event when the user clicks on the "more" icon
   */
  @Output() more: EventEmitter<any> = new EventEmitter();

  /**
   * Some contextual information that might change based on filtering or sorting
   */
  @Input() subtitle;

  /**
   * The name of the icon to be used
   */
  @Input() iconName;

  /**
   * The state of the icon, which will change on hover
   */
  iconState: 'selected' | '';

  /**
   * Emit an event indicating to the parent component that the user has clicked on the "more" icon
   */
  emitMore(e: Event) {
    e.stopPropagation();
    this.more.emit();
  }
}
