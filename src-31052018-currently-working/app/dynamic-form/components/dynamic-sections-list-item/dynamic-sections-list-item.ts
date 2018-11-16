import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import SectionConfig from '../../config/section-config';
import {Subscription} from 'rxjs/Subscription';
import FormConfig from '../../config/form-config';
import {Subject} from 'rxjs/Subject';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';
import DataManager from '../../classes/data-manager';
import {ISectionRequiredData} from '../../config/isection-required-data';


/**
 * An individual item listed on the section list
 */
@Component({
  selector: `gpr-dynamic-sections-list-item`,
  template: `
    <gpr-icon [name]="'circle-check'" [state]=" isComplete ? 'on' : 'off'"></gpr-icon>
    <a (click)="switchSection(section)"
       [class.disabled]="section?.state.isDisabled">{{section.label}}</a>
    <span>{{section.answeredRequiredQuestionCount}} / {{section.requiredQuestionCount}}</span>
    <gpr-icon [name]="'validation-error'" class="validation-icon" *ngIf="section.state.hasErrors"></gpr-icon>`
})
export class DynamicSectionsListItemComponent implements OnInit, OnDestroy {
  /**
   * The section of the item
   */
  @Input() section: SectionConfig;

  /**
   * The section's form config
   */
  @Input() config: FormConfig;

  /**
   * Indicates if the section has been validated and completed
   * @type {boolean}
   */
  public isComplete: boolean = false;

  private _subscriptions: Subscription[] = [];

  /**
   * Subscribe to the state of the form and change isComplete based on the section's status
   */
  ngOnInit() {
    this.isComplete = this.section.answeredRequiredQuestionCount >= this.section.requiredQuestionCount && this.section.state.isComplete && !this.section.state.isDirty;
    const stateSubscription = this.config.source.subscribe( () => {
      if (this.section) {
        this.isComplete = this.section.answeredRequiredQuestionCount >= this.section.requiredQuestionCount && this.section.state.isComplete && !this.section.state.isDirty;
      }
    });
    this._subscriptions.push(stateSubscription);
  }

  /**
   * unSubscribe to any subscriptions
   */
  ngOnDestroy() {
    SubscriptionManager.massUnsubscribe(this._subscriptions);
  }

  /**
   * Switch to a new section. Lets subscribes know the section has changed
   * @param {SectionConfig} section
   * @returns {Subject<string>}
   */
  public switchSection(section: SectionConfig): Subject<string> {
    return this.config.activateSectionById(section.sectionId);
  }
}
