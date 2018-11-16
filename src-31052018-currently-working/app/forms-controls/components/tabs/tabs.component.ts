import ChoiceConfig from '../../config/choice-config';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

/**
 * Creates a set of tabs to select from, same functionality as radio buttons
 */
@Component({
  selector: 'gpr-tabs',
  template: `
    <div class="tab-group">
      <div class="tab-control"
           *ngFor="let choice of choices"
           [hidden]="choice.state?.isHidden"
           [class.selected]="selectedChoice && selectedChoice.value === choice.value">
        <input class="radio"
               type="radio"
               [id]="id + choice.value"
               [value]="choice.value"
               [checked]="selectedChoice && selectedChoice.value === choice.value"
               [disabled]="isDisabled || choice.state?.isDisabled"/>
        <label [for]="id + choice.value" (click)="onChoiceChange(choice)">{{choice.label}}</label>
      </div>
    </div>
  `
})
export class TabsComponent implements OnInit, OnChanges {

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
   * The current selected choice
   */
  public selectedChoice: ChoiceConfig;

  /**
   * On init, setup the choices
   */
  ngOnInit(): void {
    this._setupChoices();
  }

  /**
   * On changes, setup the choices
   */
  ngOnChanges(): void {
    this._setupChoices();
  }

  /**
   * When the choice changes, emit that new choice
   * @param {ChoiceConfig} choice
   */
  public onChoiceChange(choice: ChoiceConfig): void {
    if (this.isDisabled) {
      return;
    }

    if (choice.state && choice.state.isDisabled) {
      return;
    }

    this.selectedChoice = choice;
    this.choiceChange.emit(choice);
  }

  /**
   * Sets up the choices
   * @private
   */
  private _setupChoices(): void {
    if (!this.choices) {
      return;
    }
    this.selectedChoice = this.choices.find(choice => choice.value === this.value);
  }
}
