import {EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import FormConfig from '../config/form-config';
import DataManager from '../classes/data-manager';
import {IPlan} from '../../plan/plan-shared/interfaces/iPlan';
import SectionConfig from '../config/section-config';
import {Subscription} from 'rxjs/Subscription';

/**
 * An abstract form. Extend this class for any new types of form
 */
export abstract class Form implements OnChanges, OnDestroy {

  /**
   * An {@link FormConfig} instance to use to render the active section.
   */
  @Input() config: FormConfig;

  /**
   * An {@link DataManager} instance wrapping the model object to be edited through the form
   */
  @Input() model: DataManager;

  /**
   * plan data that needs to be passed to a child component
   */
  @Input() plan: IPlan;

  /**
   * customer number to be passed to a child component
   */
  @Input() customerNumber: number;

  /**
   * The label of the active section.
   */
  public activeSectionLabel: string;

  /**
   * A subscription to the section change
   */
  protected _sectionChangeSubscription: Subscription;


  /**
   * Change section upon a new section
   * @param $event
   */
  ngOnChanges($event) {
    if ($event.config && $event.config.currentValue) {
      this._sectionChangeSubscription = this.config.onSectionChange.subscribe((sectionId: string) => this._initialize(sectionId));
      this._initialize(this.config.activeSectionId);
    }
  }

  /**
   * Unsubscribe to any subscriptions
   */
  ngOnDestroy() {
    if (this._sectionChangeSubscription) {
      this._sectionChangeSubscription.unsubscribe();
    }
  }

  /**
   * Private method to initialize a section. Counts the number of  answeredQuestion formItems
   * @param {string} sectionId
   */
  protected _initialize(sectionId: string): void {
    const section = this.config.getSection(sectionId);
    if (section) {
      this._initializeSection(section);
    }
  }

  /**
   * sets the number of answered questions and then emits the value
   * @param {SectionConfig} section
   * @private
   */
  protected _initializeSection(section: SectionConfig): void {
    this.activeSectionLabel = section.label;
  }
}
