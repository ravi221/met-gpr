import {Component, Input} from '@angular/core';
import SectionConfig from '../../config/section-config';
import FormConfig from '../../config/form-config';
import {Subject} from 'rxjs/Subject';
import DataManager from '../../classes/data-manager';

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
export class DynamicSectionsListItemStubComponent {
  @Input() section: SectionConfig;
  @Input() config: FormConfig;
  @Input() model: DataManager;
  public isComplete: boolean = false;
  constructor() {
  }
  public switchSection(section: SectionConfig): Subject<string> {
    return this.config.activateSectionById(section.sectionId);
  }
}
