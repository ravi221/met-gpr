import {EventEmitter, Input, OnInit, Output} from '@angular/core';
import ChoiceConfig from '../config/choice-config';
import QuestionConfig from '../../dynamic-form/config/question-config';

/**
 * Any form control should expose the same API so that they can be used
 * interchangeably with no variation in the calling code.  This superclass
 * defines the inputs and outputs for its subclasses.
 */
export abstract class FormControl implements OnInit {
  /**
   * The model value represented by, and modified by, this form control
   */
  @Input() value: any;

  /**
   * The type of the control defined in the meta configuration
   */
  @Input() type: string;

  /**
   * An id to uniquely identify the control
   */
  @Input() id: string;

  /**
   * The configuration for the question
   */
  @Input() config: QuestionConfig;

  /**
   * An array of choices for the control - this should be non-empty for any control
   * with a finite number of options such as a radio button or dropdown.
   */
  @Input() choices: Array<ChoiceConfig>;

  /**
   * True if the control is disabled.  False by default.
   */
  @Input() isDisabled: boolean;

  /**
   * True if the control is hidden.  False by default.
   */
  @Input() isHidden: boolean;

  /**
   * True if the control is in a valid state.  True by default.
   */
  @Input() isValid = true;

  /**
   * True if the control is required.  False by default.
   */
  @Input() isRequired: boolean;

  /**
   * Emits an event when the control changes the model
   */
  @Output() valueChanged = new EventEmitter();

  /**
   * A regular expression. Used for pattern matching
   */
  public regex: RegExp;

  /**
   * A common handler for value changes.  This can be called from
   * the child components to fire the `valueChanged` event.
   */
  onValueChanged(value) {
    this.value = value;
    this.valueChanged.emit(this);
  }

  /**
   * On init, nothing to do yet
   */
  ngOnInit() {
  }
}
