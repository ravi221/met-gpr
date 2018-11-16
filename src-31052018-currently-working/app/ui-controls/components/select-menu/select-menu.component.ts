import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import ChoiceConfig from '../../../forms-controls/config/choice-config';

/**
 * Represents a select menu that takes in a list of ChoiceConfig, also has a input for a label.
 *
 */
@Component({
  selector: 'gpr-select-menu',
  template: `
    <div class="select">
      <label class="select-label">{{label}}</label>
      <select class='select-option' (change)="onChoiceSelected($event)">
        <option *ngFor="let choice of selectChoices" [value]="choice.value">{{choice.label}}</option>
      </select>
    </div>
  `,
  styleUrls: ['./select-menu.component.scss']
})
export class SelectMenuComponent implements OnInit {

  /**
   * The list of select options
   * @type {number}
   */
  @Input() selectChoices: ChoiceConfig[];

  /**
   * The label to display next to the select menu
   * @type {string}
   */
  @Input() label: string = '';

  /**
   * EventEmitter for when choice is changed.
   * @type {EventEmitter<ChoiceConfig>}
   */
  @Output() choiceChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Has the value for the current active choice;
   */
  public activeChoice: ChoiceConfig;

  /**
   * the on init method
   */
  public ngOnInit () {
    this.activeChoice = this.selectChoices[0];
  }
  /**
   * method for when a choice is selected
   * @param event
   */
  public onChoiceSelected(event) {
    this.choiceChange.emit(event.target.value);
  }
}
