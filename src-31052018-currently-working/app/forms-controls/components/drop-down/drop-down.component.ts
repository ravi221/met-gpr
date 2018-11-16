import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import ChoiceConfig from '../../config/choice-config';

/**
 * A drop down component to display a list of choices and one selected value
 *
 * Usage:
 * ```html
 * <gpr-drop-down [choices]="choices"
 *                [id]="id"
 *                [isDisabled]="isDisabled"
 *                [value]="value"
 *                (choiceChange)="onChoiceChange($event)"></gpr-drop-down>
 * ```
 */
@Component({
  selector: 'gpr-drop-down',
  template: `
    <div class="drop-down"
         [id]="id"
         [class.disabled]="isDisabled"
         gprOutsideClick
         [selector]="'.drop-down-list'"
         (outsideClick)="onOutsideClick()">
      <span class="drop-down-selection"
            (click)="toggleChoicesVisibility($event)">
        <span class="drop-down-label">{{selectedChoice?.label}}</span>
        <i class="material-icons">arrow_drop_down</i>
      </span>
      <ul class="drop-down-list" [hidden]="!showChoices">
        <li *ngFor="let choice of choices"
            class="drop-down-list-item"
            [class.disabled]="isDisabled || choice.state?.isDisabled"
            [class.selected]="selectedChoice && selectedChoice.value === choice.value"
            (click)="onChoiceSelected(choice)"
            [hidden]="choice.state?.isHidden">
          {{choice.label}}
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit, OnChanges {

  /**
   * A unique id for this drop down
   * @type {string}
   */
  @Input() id: string = '';

  /**
   * A list of choices to display
   * @type {Array}
   */
  @Input() choices: ChoiceConfig[] = [];

  /**
   * Indicates if the entire drop down is disabled
   * @type {boolean}
   */
  @Input() isDisabled: boolean = false;

  /**
   * The currently selected value
   */
  @Input() value: any;

  /**
   * An event emitter when the choice changes
   * @type {EventEmitter<ChoiceConfig>}
   */
  @Output() choiceChange: EventEmitter<ChoiceConfig> = new EventEmitter<ChoiceConfig>();

  /**
   * The currently selected choice
   */
  public selectedChoice: ChoiceConfig;

  /**
   * Indicates if to show the choices, simulating a select with options
   * @type {boolean}
   */
  public showChoices: boolean = false;

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * On init, update the choices
   */
  ngOnInit(): void {
    this._updateChoices();
  }

  /**
   * On changes, update the choices
   */
  ngOnChanges(): void {
    this._updateChoices();
  }

  /**
   * Function called when the choice is selected
   * @param {ChoiceConfig} choice
   */
  public onChoiceSelected(choice: ChoiceConfig): void {
    if (this.isDisabled) {
      return;
    }

    const isDisabled = choice.state && choice.state.isDisabled;
    if (isDisabled) {
      return;
    }

    this.hideChoicesVisibility();
    this.selectedChoice = choice;
    this.choiceChange.emit(choice);
  }

  /**
   * Toggles the visibility of choices
   */
  public toggleChoicesVisibility(event: Event): void {
    if (this.isDisabled) {
      return;
    }
    event.stopPropagation();
    this.showChoices = !this.showChoices;
  }

  /**
   * Hide the visibility of choices
   */
  public hideChoicesVisibility(): void {
    this.showChoices = false;
  }

  /**
   * Close the choices on click
   */
  public onOutsideClick(): void {
    if (!this.showChoices) {
      return;
    }
    this.hideChoicesVisibility();
  }

  /**
   * Updates the choices and the currently selected choice based on the given value
   * @private
   */
  private _updateChoices(): void {
    this.selectedChoice = this.choices.find(choice => choice.value === this.value);
  }

}
