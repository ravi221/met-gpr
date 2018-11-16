import {Component, Input} from '@angular/core';
import DataManager from '../../../dynamic-form/classes/data-manager';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import QuestionConfig from '../../../dynamic-form/config/question-config';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { IComment } from 'app/comment/interfaces/iComment';

@Component({
  selector: `gpr-dynamic-question-actions`,
  template: ``
})
export class DynamicQuestionActionsStubComponent {
  /**
   * The configuration for the question
   * @override
   */
  @Input() config: QuestionConfig;

  /**
   * An {@link DataManager} wrapping the model object to be edited through the form
   */
  @Input() model: DataManager;

  /**
   * Contains flag if one exists for this question
   */
  @Input() questionFlag: IFlag;

  /**
   * contains comments if they already exist for this question
   */
  @Input() questionComments: IComment;

  /**
   * Plan object, used for information to create flags and comments
   */
  @Input() plan: IPlan;

  /**
   * Customer id used for information to create flags and comments
   */
  @Input() customerNumber: number;
}
