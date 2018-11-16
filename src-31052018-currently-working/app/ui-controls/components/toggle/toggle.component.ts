import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {isNil} from 'lodash';

/**
 * Represents a toggle button with an on and off state, including an optional label
 *
 * Usage:
 * ```html
 *  <gpr-toggle [label]="'Example Label'" (toggle)="onToggle($event)"></gpr-toggle>
 * ```
 */
@Component({
  selector: 'gpr-toggle',
  template: `
    <div class="toggle">
      <span (click)="toggleButton()">
        <gpr-icon [name]="'button-toggle'" [state]="buttonState"></gpr-icon>
      </span>
      <label class="toggle-label" *ngIf="hasLabel">{{label}}</label>
    </div>
  `,
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit, OnChanges {

  /**
   * The label to display next to the toggle button
   * @type {string}
   */
  @Input() label: string = '';

  /**
   * Output event when the toggle changes
   * @type {EventEmitter<boolean>}
   */
  @Output() toggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Indicates if there is a label
   * @type {boolean}
   */
  public hasLabel: boolean = false;

  /**
   * The button state to change based on the toggleState
   * @type {string}
   */
  public buttonState: 'on' | 'off' = 'off';

  /**
   * The current state of the toggle (true if on, false if off)
   * @type {boolean}
   * @private
   */
  private _toggleState: boolean = false;

  /**
   * On init, update the toggle state
   */
  ngOnInit(): void {
    this._updateToggleState();
  }

  /**
   * On changes, update the toggle state
   */
  ngOnChanges(): void {
    this._updateToggleState();
  }

  /**
   * Toggles the button
   */
  public toggleButton(): void {
    this._toggleState = !this._toggleState;
    this.buttonState = this._toggleState ? 'on' : 'off';
    this.toggle.emit(this._toggleState);
  }

  /**
   * Updates the state of the toggle
   * @private
   */
  private _updateToggleState(): void {
    this.hasLabel = !isNil(this.label) && this.label.length > 0;
    this.buttonState = this._toggleState ? 'on' : 'off';
  }
}
