import {Form} from '../form';
import QuestionConfig from '../../config/question-config';
import {Component} from '@angular/core';
import SectionConfig from '../../config/section-config';

/**
 * A stub component the for {@link MassUpdateFormComponent}
 */
@Component({selector: 'gpr-mass-update-form', template: ``})
export class MassUpdateFormStubComponent extends Form  {
  public questions: QuestionConfig[];
  protected _initializeSection(section: SectionConfig): void {
    this.activeSectionLabel = section.label;
    this.questions = section.questions;
  }
}
