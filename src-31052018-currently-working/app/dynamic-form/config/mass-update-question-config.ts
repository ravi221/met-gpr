import StateConfig from '../../forms-controls/config/state-config';
import QuestionConfig from './question-config';

export class MassUpdateQuestionConfig extends QuestionConfig {
  /**
   * Indicates the checkbox to be true/false
   */
  public isChecked: boolean;

  /**
   * Indicates that question got answered or not
   */
  public questionAnswer: string;

  /**
   * Constructs a new instance from a JSON representation of the Question
   */
  constructor(json: any, onStateUpdate: (sourceId: string, newState: StateConfig) => void) {
    super(json, onStateUpdate);
    this.isChecked = json.isChecked;
    this.questionAnswer = json.questionAnswer;
  }

}
