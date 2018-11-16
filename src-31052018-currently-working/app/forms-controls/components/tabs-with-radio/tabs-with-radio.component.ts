import ChoiceConfig from '../../config/choice-config';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {isNil} from 'lodash';

/**
 * A component to display tabs side-by-side, with a radio button at the end
 */
@Component({
  selector: 'gpr-tabs-with-radio',
  template: `
    <div class="tabs-with-radio-control">
      <div class="tab-group">
        <div class="tab-control"
             *ngFor="let choice of tabsChoices"
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

      <div class="radio-group">
        <div class="radio-control" *ngFor="let choice of radioChoices" [hidden]="choice.state?.isHidden">
          <input class="radio"
                 type="radio"
                 [id]="id + choice.value"
                 [value]="choice.value"
                 (change)="onChoiceChange(choice)"
                 [checked]="selectedChoice && selectedChoice.value === choice.value"
                 [disabled]="isDisabled || choice.state?.isDisabled"/>
          <label [for]="id + choice.value">{{choice.label}}</label>
        </div>
      </div>
    </div>
  `
})
export class TabsWithRadioComponent implements OnInit, OnChanges {

  /**
   * A unique id for this drop down
   */
  @Input() id: string = '';

  /**
   * A list of choices to display
   */
  @Input() choices: ChoiceConfig[] = [];

  /**
   * Indicates if the entire drop down is disabled
   */
  @Input() isDisabled: boolean = false;

  /**
   * The currently selected value
   */
  @Input() value: any;

  /**
   * An event emitter when the choice changes
   */
  @Output() choiceChange: EventEmitter<ChoiceConfig> = new EventEmitter<ChoiceConfig>();

  /**
   * The current selected choice
   */
  public selectedChoice: ChoiceConfig;

  /**
   * The choices to be displayed in the tabs
   */
  public tabsChoices: ChoiceConfig[];

  /**
   * The choices to be displayed as a radio button
   */
  public radioChoices: ChoiceConfig[];

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
   */
  public onChoiceChange(choice: ChoiceConfig): void {
    this.selectedChoice = choice;
    this.choiceChange.emit(choice);
  }

  /**
   * Sets up the choices
   */
  private _setupChoices(): void {
    if (isNil(this.choices)) {
      return;
    }
    const lastChoiceIndex = this.choices.length - 1;
    this.tabsChoices = this.choices.slice(0, lastChoiceIndex);
    this.radioChoices = [this.choices[lastChoiceIndex]];
    this.selectedChoice = this.choices.find(choice => choice.value === this.value);
  }
}
