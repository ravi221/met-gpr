import {Component, EventEmitter, Input, Output} from '@angular/core';
import ChoiceConfig from '../../../forms-controls/config/choice-config';
import {HistoryService} from '../../services/history.service';

/**
 * The heading section for the history page.
 */
@Component({
  selector: 'gpr-history-heading',
  template: `
    <div class="section">
      <div class="header">
        <div class="customer-info">
          <div class="customer-title">
            {{customerName}}
          </div>
          <div class="text-muted customer-details">
            <span>Customer Number: {{customerNumber}}</span>Effective Date: {{effectiveDate}}
          </div>
        </div>
        <div class="select">
          <gpr-select-menu [label]="'Show Last Edits'"
                           [selectChoices]="selectOptions"
                           (choiceChange)="choiceChanged($event)">
          </gpr-select-menu>
        </div>
        <div class="toggle">
          <gpr-toggle [label]="'Show Comments'" (toggle)="toggleComments($event)"></gpr-toggle>
        </div>
      </div>
      <hr/>
    </div>
  `,
  styleUrls: ['./history-heading.component.scss']
})
export class HistoryHeadingComponent {

  /**
   * The name of the specific customer that is viewed.
   */
  @Input() customerName: string;

  /**
   * The number of the specific customer that is viewed.
   */
  @Input() customerNumber: string;

  /**
   * The effective date of the specific customer that is viewed.
   */
  @Input() effectiveDate: string;

  /**
   * The event emitter for the toggle button
   */
  @Output() commentsShow: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * The event emitter for the select menu
   */
  @Output() selectOption: EventEmitter<ChoiceConfig> = new EventEmitter<ChoiceConfig>();

  /**
   * The list of current select options
   * @type {number[]}
   */
  public selectOptions: ChoiceConfig[] = [
    <ChoiceConfig> {value: 5, label: '5'},
    <ChoiceConfig> {value: 15, label: '15'},
    <ChoiceConfig> {value: 25, label: '25'}];

  /**
   * Constructor for the history heading
   * @param {HistoryService} _historyService
   */
  constructor(private _historyService: HistoryService) {
  }

  /**
   * Performs actions of toggle button.
   * shows/hides the comments.
   */
  public toggleComments(toggle: boolean): void {
    this._historyService.toggleAllComments(toggle);
  }

  /**
   * Emits the event when a choice is changed.
   * @param {ChoiceConfig} choice
   */
  public choiceChanged(choice: ChoiceConfig): void {
    this.selectOption.emit(choice);
  }
}
