import DSL from '../../vendor/dsl-wrapper';
import QuestionConfig from '../config/question-config';
import {isNil} from 'lodash';
import {Observable} from 'rxjs/Observable';
import {RuleSetType} from '../enumerations/rule-set-type';

/**
 * A class used to run rules
 */
export class RuleRunner {

  /**
   * Creates the rule runner class
   */
  constructor(private _dsl: DSL,
              private _context: any) {
  }

  /**
   * Checks if to run a certain rules set given the question
   */
  public checkToRunRules(question: QuestionConfig, ruleSetType: RuleSetType): void {
    if (this._shouldRunRules(question, ruleSetType)) {
      this._runRules(question, ruleSetType);
    }
  }

  /**
   * Determines if the given rule set type should be run
   */
  private _shouldRunRules(question: QuestionConfig, ruleSetType: RuleSetType): boolean {
    if (isNil(question)) {
      return false;
    }

    const rules = question.rules;
    if (isNil(rules)) {
      return false;
    }

    const ruleSet = question.rules[ruleSetType];
    if (isNil(ruleSet)) {
      return false;
    }
    return ruleSet.length > 0;
  }

  /**
   * Private method to execute {@link DSL} rules given a question
   */
  private _runRules(question: QuestionConfig, ruleSetType: RuleSetType): Observable<any> {
    const ruleSet = question.rules[ruleSetType];
    return this._dsl.execute(question.formItemId, ruleSet, this._context);
  }
}
