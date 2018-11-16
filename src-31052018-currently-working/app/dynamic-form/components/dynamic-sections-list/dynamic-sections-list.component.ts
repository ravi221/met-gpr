import {Component, Input, OnDestroy, OnChanges, OnInit} from '@angular/core';
import SectionConfig from '../../config/section-config';
import FormConfig from '../../config/form-config';
import {Subscription} from 'rxjs/Subscription';
import CategoryConfig from '../../config/category-config';
import DataManager from '../../classes/data-manager';
import {ISectionRequiredData} from '../../config/isection-required-data';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';

/**
 * Displays a list of sections for navigation
 */
@Component({
  selector: 'gpr-dynamic-sections-list',
  template: `
    <ul class="nav-list-stacked">
      <li *ngFor="let sectionConfig of sections" [hidden]="sectionConfig.state.isHidden"
          [class.active]="sectionConfig.sectionId === activeSectionId">
        <gpr-dynamic-sections-list-item [config]="config" [section]="sectionConfig"></gpr-dynamic-sections-list-item>
      </li>
    </ul>
  `,
  styleUrls: ['./dynamic-sections-list.component.scss']
})
export class DynamicSectionsListComponent implements OnDestroy, OnChanges, OnInit {

  /**
   * The form configuration instance.
   */
  @Input() config: FormConfig;

  /**
   * The model for the data
   */
  @Input() model: DataManager;

  /**
   * The id of the currently active section.
   */
  public activeSectionId: string;

  /**
   * The sections under the active category.
   */
  public sections: Array<SectionConfig> = [];

  /**
   * Subscription to form state changes.
   */
  private _subscription: Subscription;

  /**
   * A subscription to the Map
   */
  private _requiredMapSubscription: Subscription;

  ngOnInit() {
    this._requiredMapSubscription = this.model.requiredQuestions$.subscribe( (sectionsMap: Map<string, ISectionRequiredData>) => {
      this.sections.forEach( (section) => {
        const requiredQuestionConfig = sectionsMap.get(section.sectionId);
        if (section) {
          section.requiredQuestionCount = requiredQuestionConfig.totalRequiredQuestions;
          section.answeredRequiredQuestionCount = requiredQuestionConfig.answeredRequiredQuestions;
        }
      });

    });
  }

  /**
   * detects changes to the section and initializes a new active section if there is a change
   * @param $event
   */
  ngOnChanges($event) {
    if ($event.config && $event.config.currentValue) {
      this._subscription = this.config.onSectionChange.subscribe((sectionId: string) => this._initialize(sectionId));
      const category: CategoryConfig = this.config.categories.find(c => c.categoryId === this.config.activeCategoryId);
      if (category) {
        this.sections = category.sections;
        this._initialize(this.config.activeSectionId);
      }
    }
  }

  /**
   * unsubscribe to any subscriptions to prevent memory leaks
   */
  ngOnDestroy() {
    const subscriptions = [this._subscription, this._requiredMapSubscription];
    SubscriptionManager.massUnsubscribe(subscriptions);
  }

  /**
   * Private method to initialize the sections under a category.
   * @param {string} sectionId
   */
  private _initialize(sectionId: string): void {
    this.activeSectionId = sectionId;
  }

}
