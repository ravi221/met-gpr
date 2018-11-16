import DSL from '../../vendor/dsl-wrapper';
import {RuleRunner} from './rule-runner';
import {RuleSetType} from '../enumerations/rule-set-type';
import QuestionConfig from '../config/question-config';

describe('RuleRunner', () => {
  const dsl = new DSL();
  const ruleRunner = new RuleRunner(dsl, this);
  let spy: jasmine.Spy;

  beforeEach(() => {
    spy = spyOn(dsl, 'execute').and.stub();
  });

  describe('Running \'ON_INIT\' rules', () => {
    const ruleSetType: RuleSetType = RuleSetType.ON_INIT;

    it('should not execute rules when the question is null', () => {
      const question = null;

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the question is undefined', () => {
      const question = undefined;

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rules are null', () => {
      const question = new QuestionConfig({
        rules: null,
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rules are undefined', () => {
      const question = new QuestionConfig({
        rules: undefined,
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rule set is null', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: null
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rule set is undefined', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: undefined
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rule set is empty', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: []
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should rules when the rule set length is not empty', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: [{}]
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Running \'ON_CHANGE\' rules', () => {
    const ruleSetType: RuleSetType = RuleSetType.ON_CHANGE;

    it('should not execute rules when the question is null', () => {
      const question = null;

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the question is undefined', () => {
      const question = undefined;

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rules are null', () => {
      const question = new QuestionConfig({
        rules: null,
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rules are undefined', () => {
      const question = new QuestionConfig({
        rules: undefined,
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rule set is null', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: null
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rule set is undefined', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: undefined
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rule set is empty', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: []
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should rules when the rule set length is not empty', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: [{}]
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Running \'ON_ERROR\' rules', () => {
    const ruleSetType: RuleSetType = RuleSetType.ON_ERROR;

    it('should not execute rules when the question is null', () => {
      const question = null;

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the question is undefined', () => {
      const question = undefined;

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rules are null', () => {
      const question = new QuestionConfig({
        rules: null,
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rules are undefined', () => {
      const question = new QuestionConfig({
        rules: undefined,
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rule set is null', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: null
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rule set is undefined', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: undefined
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not execute rules when the rule set is empty', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: []
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should rules when the rule set length is not empty', () => {
      const question = new QuestionConfig({
        rules: {
          [ruleSetType]: [{}]
        },
        control: {
          state: {}
        }
      }, () => {});

      ruleRunner.checkToRunRules(question, ruleSetType);
      expect(spy).toHaveBeenCalled();
    });
  });
});
