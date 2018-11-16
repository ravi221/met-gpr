import ChoiceConfig from '../../config/choice-config';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {pull, sortBy} from 'lodash';
import {Subscription} from 'rxjs/Subscription';

/**
 * Represents a add and remove list component, where we have selected values, and unselected values
 * and the ability to filter which values to add to the selected list
 */
@Component({
  selector: 'gpr-add-remove-list',
  template: `
    <main class="add-remove-list">
      <!-- Unselected List -->
      <section class="list-container unselected-list-container">
        <h3 class="list-heading">{{unselectedListLabel}}</h3>
        <ul class="selectable-list">
          <li class="selectable-list-item"
              *ngFor="let choice of filteredUnselectedChoices"
              [class.selected]="selectedChoice && selectedChoice.value === choice.value"
              (click)="onUnselectedChoiceClick(choice)">
            {{choice.value}} - {{choice.label}}
          </li>
        </ul>
        <input class="unselected-list-filter"
               type="text"
               [formControl]="unselectedFilterControl"
               [placeholder]="filterPlaceholder">
      </section>

      <!-- Add and Remove Buttons -->
      <section class="add-remove-buttons">
        <button class="add-remove-button add-button"
                [disabled]="isAddButtonDisabled"
                (click)="addSelectedChoice()"><i class="material-icons">keyboard_arrow_right</i></button>
        <button class="add-remove-button remove-button"
                [disabled]="isRemoveButtonDisabled"
                (click)="removeSelectedChoice()"><i class="material-icons">keyboard_arrow_left</i></button>
      </section>

      <!-- Selected List -->
      <section class="list-container selected-list-container">
        <h3 class="list-heading">{{selectedListLabel}}</h3>
        <ul class="selectable-list">
          <li class="selectable-list-item"
              *ngFor="let choice of selectedChoices"
              [class.selected]="selectedChoice && selectedChoice.value === choice.value"
              (click)="onSelectedChoiceClick(choice)">
            {{choice.value}} - {{choice.label}}
          </li>
        </ul>
      </section>
    </main>
  `,
  styleUrls: ['./add-remove-list.component.scss']
})
export class AddRemoveListComponent implements OnInit, OnDestroy {

  /**
   * Indicates if the entire component is disabled
   */
  @Input() isDisabled: boolean = false;

  /**
   * A placeholder for the filter input
   */
  @Input() filterPlaceholder: string = 'Type a value or label';

  /**
   * The label for the unselected list
   */
  @Input() unselectedListLabel: string = 'Available';

  /**
   * The label for the selected list
   */
  @Input() selectedListLabel: string = 'Selected';

  /**
   * All the choices that are selectable
   */
  @Input() selectableChoices: ChoiceConfig[] = [];

  /**
   * An array of selected values
   */
  @Input() selectedValues: any[] = [];

  /**
   * An event emitter which fires whenever the selected values changes
   */
  @Output() selectedValuesChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  /**
   * Indicates if the add button is disabled
   */
  public isAddButtonDisabled: boolean = true;

  /**
   * Indicates if the remove button is disabled
   */
  public isRemoveButtonDisabled: boolean = true;

  /**
   * The currently selected choice
   */
  public selectedChoice: ChoiceConfig;

  /**
   * A list of filterer unselected choices
   */
  public filteredUnselectedChoices: ChoiceConfig[] = [];

  /**
   * A list of the currently selected choices
   */
  public selectedChoices: ChoiceConfig[] = [];

  /**
   * A list of the currently unselected choices
   */
  public unselectedChoices: ChoiceConfig[] = [];

  /**
   * The filter control which filters out the unselected choices
   */
  public unselectedFilterControl: FormControl = new FormControl();

  /**
   * A subscription to any changes with the filter for unselected values
   */
  private _filterFormControlSubscription: Subscription;

  /**
   * On init, setup the choices for both selected and unselected lists
   */
  ngOnInit(): void {
    this._setupChoices();
    this._filterFormControlSubscription = this.unselectedFilterControl.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)
      .subscribe(newFilterField => {
        this._filterUnselectedChoices(newFilterField.toLowerCase());
      });
  }

  /**
   * On destroy, unsubscribe from any subscriptions
   */
  ngOnDestroy(): void {
    if (this._filterFormControlSubscription) {
      this._filterFormControlSubscription.unsubscribe();
    }
  }

  /**
   * Adds the selected choice to the array of values
   */
  public addSelectedChoice(): void {
    if (this.selectedChoice === null) {
      return;
    }

    if (this.isDisabled) {
      return;
    }

    const newValue = this.selectedChoice.value;
    this.selectedValues.push(newValue);
    this.selectedChoices.push(this.selectedChoice);
    this.unselectedChoices = pull(this.unselectedChoices, this.selectedChoice);
    this._sortChoicesAndValues();
    this._resetSelectedChoice();
  }

  /**
   * Removes the selected choice from the array of values
   */
  public removeSelectedChoice(): void {
    if (this.selectedChoice === null) {
      return;
    }

    if (this.isDisabled) {
      return;
    }

    const oldValue = this.selectedChoice.value;
    this.selectedValues = pull(this.selectedValues, oldValue);
    this.selectedChoices = pull(this.selectedChoices, this.selectedChoice);
    this.unselectedChoices.push(this.selectedChoice);
    this._sortChoicesAndValues();
    this._resetSelectedChoice();
  }

  /**
   * Called when an selected choice is clicked
   */
  public onSelectedChoiceClick(choice: ChoiceConfig): void {
    this.isAddButtonDisabled = true;
    this.isRemoveButtonDisabled = false;
    this.selectedChoice = choice;
  }

  /**
   * Called when an unselected choice is clicked
   */
  public onUnselectedChoiceClick(choice: ChoiceConfig): void {
    this.isAddButtonDisabled = false;
    this.isRemoveButtonDisabled = true;
    this.selectedChoice = choice;
  }

  /**
   * Filters the unselected choices as the user types in a new filter, this filters by both value and label
   */
  private _filterUnselectedChoices(newFilterField: string): void {
    const currentUnselectedChoices = [...this.unselectedChoices];
    this.filteredUnselectedChoices = currentUnselectedChoices.filter((choice: ChoiceConfig) => {
      const matchesValue = choice.value.toLowerCase().includes(newFilterField);
      if (matchesValue) {
        return true;
      }

      const matchesLabel = choice.label.toLowerCase().includes(newFilterField);
      if (matchesLabel) {
        return true;
      }
    });
  }

  /**
   * Resets the selected choice and disables both add and remove buttons
   */
  private _resetSelectedChoice(): void {
    this.selectedChoice = null;
    this.isAddButtonDisabled = true;
    this.isRemoveButtonDisabled = true;
  }

  /**
   * Sets up the choices for both the selected and unselected lists
   */
  private _setupChoices(): void {
    this.selectableChoices = this.selectableChoices || [];
    this.selectedValues = this.selectedValues || [];

    const selectedChoices = [];
    const unselectedChoices = [];
    this.selectableChoices.forEach((choice: ChoiceConfig) => {
      const isSelected = this.selectedValues.includes(choice.value);
      if (isSelected) {
        selectedChoices.push(choice);
      } else {
        unselectedChoices.push(choice);
      }
    });
    this.selectedChoices = selectedChoices;
    this.unselectedChoices = unselectedChoices;
    this.filteredUnselectedChoices = [...this.unselectedChoices];
  }

  /**
   * Sorts the choices and values
   */
  private _sortChoicesAndValues(): void {
    this.unselectedFilterControl.setValue('');
    this.selectedChoices = sortBy(this.selectedChoices, 'value');
    this.unselectedChoices = sortBy(this.unselectedChoices, 'value');
    this.filteredUnselectedChoices = [...this.unselectedChoices];
    this.selectedValues.sort();
    this.selectedValuesChange.emit(this.selectedValues);
  }
}
