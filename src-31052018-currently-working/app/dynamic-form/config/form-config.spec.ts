import * as configuration from '../../../assets/test/dynamic-form/form-config.mock.json';
import FormConfig from './form-config';
import CategoryConfig from './category-config';
import SectionConfig from './section-config';
import QuestionConfig from './question-config';
import FormControlConfig from './form-control-config';
import RuleConfig from './rule-config';
import SchemaConfig from './schema-config';
import {Subscription} from 'rxjs/Subscription';

describe('FormConfig', () => {
  let formConfig: FormConfig;
  let subscription: Subscription;

  beforeEach(() => {
    formConfig = new FormConfig(configuration);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  it('should create an instance of form config class', () => {
    expect(formConfig.id).toEqual('mock-config');
    expect(formConfig.version).toEqual('1.0.0');
    expect(formConfig.title).toEqual('Mock Configuration');
    expect(formConfig.categories.length).toBeGreaterThan(0);
  });

  it('should return all formItems as an array', () => {
    const questions = formConfig.questions;
    expect(questions).toEqual(jasmine.any(Array));
    expect(questions.length).toBeGreaterThan(0);
  });

  it('should return a category by id', () => {
    const category = formConfig.getCategory('mockCategory');
    expect(category).toEqual(jasmine.any(CategoryConfig));
    expect(category.label).toEqual('Mock Category');
  });

  it('should return a section by id', () => {
    const section = formConfig.getSection('mockSection');
    expect(section).toEqual(jasmine.any(SectionConfig));
    expect(section.label).toEqual('Mock Section');
  });

  it('should return a question by id', () => {
    const question = formConfig.getQuestion('questionA');
    expect(question).toEqual(jasmine.any(QuestionConfig));
    expect(question.label).toEqual('Who likes to test?');
  });

  it('should return a control by id', () => {
    const control = formConfig.getControl('questionA');
    expect(control).toEqual(jasmine.any(FormControlConfig));
    expect(control.type).toEqual('select');
  });

  it('should return a question\'s model path by id', () => {
    const path = formConfig.getPath('questionA');
    expect(path).toBeDefined();
    expect(path).toEqual('mockCategory.mockSection.questionA');
  });

  it('should return rules for a question by id', () => {
    const rules = formConfig.getRules('questionA');
    expect(rules).toEqual(jasmine.any(RuleConfig));
    expect(rules.onChange.length).toBeGreaterThan(0);
  });

  it('should return the schema for a question by id', () => {
    const schema = formConfig.getSchema('questionA');
    expect(schema).toEqual(jasmine.any(SchemaConfig));
    expect(schema.type).toEqual('number');
  });

  it('should return a question id by any valid prop', () => {
    expect(formConfig.getQuestionId('viewModel', 'mockCategory.mockSection.questionA')).toEqual('questionA');
    expect(formConfig.getQuestionId('label', 'Who likes to test?')).toEqual('questionA');
    expect(formConfig.getQuestionId('invalidProp', 'invalidValue')).toBeUndefined();
  });

  it('should update the hasErrors property of a question when adding/removing error messages', () => {
    const controlA = formConfig.getControl('questionA');
    controlA.state.hasErrors = false;

    controlA.state.errors = ['This is an error message'];
    expect(controlA.state.hasErrors).toBeTruthy();

    controlA.state.errors = [];
    expect(controlA.state.hasErrors).toBeFalsy();
  });

  it('should update the hasWarnings property of a question when adding/removing warning messages', () => {
    const controlA = formConfig.getControl('questionA');
    controlA.state.hasWarnings = false;

    controlA.state.warnings = ['This is a warning message'];
    expect(controlA.state.hasWarnings).toBeTruthy();

    controlA.state.warnings = [];
    expect(controlA.state.hasWarnings).toBeFalsy();
  });

  it('should empty the errors array of a question when setting hasErrors to false', () => {
    const controlA = formConfig.getControl('questionA');
    controlA.state.hasErrors = true;
    controlA.state.errors = ['This is an error message'];

    controlA.state.hasErrors = false;
    expect(controlA.state.errors.length).toEqual(0);
  });

  it('should empty the warnings array of a question when setting hasWarnings to false', () => {
    const controlA = formConfig.getControl('questionA');
    controlA.state.hasWarnings = true;
    controlA.state.warnings = ['This is an error message'];

    controlA.state.hasWarnings = false;
    expect(controlA.state.warnings.length).toEqual(0);
  });

  it('should accurately track the form\'s validity with controls of different validity', () => {
    const messages = ['This field is invalid!'];
    const sectionA = formConfig.getSection('mockSection');
    const categoryA = formConfig.getCategory('mockCategory');

    const controlA = formConfig.getControl('questionA');
    controlA.state.hasErrors = true;
    controlA.state.errors = messages;

    const controlB = formConfig.getControl('questionB');
    controlB.state.hasErrors = true;
    controlB.state.errors = messages;

    expect(sectionA.state.hasErrors).toBeTruthy();
    expect(sectionA.state.isValid).toBeFalsy();

    expect(categoryA.state.hasErrors).toBeTruthy();
    expect(categoryA.state.isValid).toBeFalsy();

    expect(formConfig.state.hasErrors).toBeTruthy();
    expect(formConfig.state.isValid).toBeFalsy();

    controlA.state.hasErrors = false;
    controlA.state.errors = [];

    expect(sectionA.state.hasErrors).toBeTruthy();
    expect(sectionA.state.isValid).toBeFalsy();

    expect(categoryA.state.hasErrors).toBeTruthy();
    expect(categoryA.state.isValid).toBeFalsy();

    expect(formConfig.state.hasErrors).toBeTruthy();
    expect(formConfig.state.isValid).toBeFalsy();

  });

  it('should accurately propagate the validity of a child control to all of its parent nodes using the hasErrors property', () => {
    const controlA = formConfig.getControl('questionA');
    const sectionA = formConfig.getSection('mockSection');
    const categoryA = formConfig.getCategory('mockCategory');

    controlA.state.hasErrors = true;

    expect(sectionA.state.hasErrors).toBeTruthy();
    expect(sectionA.state.isValid).toBeFalsy();

    expect(categoryA.state.hasErrors).toBeTruthy();
    expect(categoryA.state.isValid).toBeFalsy();

    expect(formConfig.state.hasErrors).toBeTruthy();
    expect(formConfig.state.isValid).toBeFalsy();
  });

  it('should accurately propagate the validity of a child control to all of its parent nodes when adding error messages to a question', () => {
    const errors = ['This is an error message'];
    const controlA = formConfig.getControl('questionA');
    const sectionA = formConfig.getSection('mockSection');
    const categoryA = formConfig.getCategory('mockCategory');

    controlA.state.errors = errors;

    expect(sectionA.state.hasErrors).toBeTruthy();
    expect(sectionA.state.isValid).toBeFalsy();

    expect(categoryA.state.hasErrors).toBeTruthy();
    expect(categoryA.state.isValid).toBeFalsy();

    expect(formConfig.state.hasErrors).toBeTruthy();
    expect(formConfig.state.isValid).toBeFalsy();
  });

  it('should accurately propagate the validity of a child control to all of its parent nodes using the hasWarnings property', () => {
    const controlA = formConfig.getControl('questionA');
    const sectionA = formConfig.getSection('mockSection');
    const categoryA = formConfig.getCategory('mockCategory');

    controlA.state.hasWarnings = true;

    expect(sectionA.state.hasWarnings).toBeTruthy();
    expect(sectionA.state.isValid).toBeFalsy();

    expect(categoryA.state.hasWarnings).toBeTruthy();
    expect(categoryA.state.isValid).toBeFalsy();

    expect(formConfig.state.hasWarnings).toBeTruthy();
    expect(formConfig.state.isValid).toBeFalsy();
  });

  it('should accurately propagate the validity of a child control to all of its parent nodes when adding warning messages to a question', () => {
    const warnings = ['This is a warning message'];
    const controlA = formConfig.getControl('questionA');
    const sectionA = formConfig.getSection('mockSection');
    const categoryA = formConfig.getCategory('mockCategory');

    controlA.state.warnings = warnings;

    expect(sectionA.state.hasWarnings).toBeTruthy();
    expect(sectionA.state.isValid).toBeFalsy();

    expect(categoryA.state.hasWarnings).toBeTruthy();
    expect(categoryA.state.isValid).toBeFalsy();

    expect(formConfig.state.hasWarnings).toBeTruthy();
    expect(formConfig.state.isValid).toBeFalsy();
  });

  it('should accurately track and propagate the error state of a child control to all of its parent nodes', () => {
    const controlA = formConfig.getControl('questionA');
    const sectionA = formConfig.getSection('mockSection');
    const categoryA = formConfig.getCategory('mockCategory');

    controlA.state.hasErrors = true;

    expect(sectionA.state.hasErrors).toBeTruthy();
    expect(sectionA.state.isValid).toBeFalsy();

    expect(categoryA.state.hasErrors).toBeTruthy();
    expect(categoryA.state.isValid).toBeFalsy();

    expect(formConfig.state.hasErrors).toBeTruthy();
    expect(formConfig.state.isValid).toBeFalsy();

    controlA.state.hasErrors = false;

    expect(sectionA.state.hasErrors).toBeFalsy();
    expect(sectionA.state.isValid).toBeTruthy();

    expect(categoryA.state.hasErrors).toBeFalsy();
    expect(categoryA.state.isValid).toBeTruthy();

    expect(formConfig.state.hasErrors).toBeFalsy();
    expect(formConfig.state.isValid).toBeTruthy();
  });

  it('should accurately track and propagate the warning state of a child control to all of its parent nodes', () => {
    const controlA = formConfig.getControl('questionA');
    const sectionA = formConfig.getSection('mockSection');
    const categoryA = formConfig.getCategory('mockCategory');

    controlA.state.hasWarnings = true;

    expect(sectionA.state.hasWarnings).toBeTruthy();
    expect(sectionA.state.isValid).toBeFalsy();

    expect(categoryA.state.hasWarnings).toBeTruthy();
    expect(categoryA.state.isValid).toBeFalsy();

    expect(formConfig.state.hasWarnings).toBeTruthy();
    expect(formConfig.state.isValid).toBeFalsy();

    controlA.state.hasWarnings = false;

    expect(sectionA.state.hasWarnings).toBeFalsy();
    expect(sectionA.state.isValid).toBeTruthy();

    expect(categoryA.state.hasWarnings).toBeFalsy();
    expect(categoryA.state.isValid).toBeTruthy();

    expect(formConfig.state.hasWarnings).toBeFalsy();
    expect(formConfig.state.isValid).toBeTruthy();
  });

  it('should accurately track and propagate the dirty state of a child control to all of its parent nodes', () => {
    const controlA = formConfig.getControl('questionA');
    const sectionA = formConfig.getSection('mockSection');
    const categoryA = formConfig.getCategory('mockCategory');

    controlA.state.isDirty = true;

    expect(sectionA.state.isDirty).toBeTruthy();
    expect(categoryA.state.isDirty).toBeTruthy();
    expect(formConfig.state.isDirty).toBeTruthy();

    controlA.state.isDirty = false;

    expect(sectionA.state.isDirty).toBeFalsy();
    expect(categoryA.state.isDirty).toBeFalsy();
    expect(formConfig.state.isDirty).toBeFalsy();
  });

  it('should accurately set the disabled state of all parent nodes to FALSE when a child control is no longer disabled', () => {
    const controlA = formConfig.getControl('questionA');
    controlA.state.isDisabled = true;

    const sectionA = formConfig.getSection('mockSection');
    const categoryA = formConfig.getCategory('mockCategory');

    controlA.state.isDisabled = false;

    expect(sectionA.state.isDisabled).toBeFalsy();
    expect(categoryA.state.isDisabled).toBeFalsy();
  });

  it('should accurately set the hidden state of all parent nodes to FALSE when a child control is no longer hidden', () => {
    const controlA = formConfig.getControl('questionA');
    controlA.state.isHidden = true;

    const sectionA = formConfig.getSection('mockSection');
    const categoryA = formConfig.getCategory('mockCategory');

    controlA.state.isHidden = false;

    expect(sectionA.state.isHidden).toBeFalsy();
    expect(categoryA.state.isHidden).toBeFalsy();
  });

  it('should emit event when a value in the form\'s state is updated', (done) => {
    subscription = formConfig.source.subscribe((newState) => {
      expect(newState.isDirty).toBeTruthy();
      done();
    });
    formConfig.state.isDirty = true;
  });

  it('should activate a section and emit appropriate event', (done) => {
    subscription = formConfig.onSectionChange.subscribe((sectionId: string) => {
      expect(sectionId).toBeTruthy();
      expect(sectionId).toEqual('mockSection');
      done();
    });
    formConfig.activateSectionById('mockSection');
  });

  it('should not activate a section if section is disabled', (done) => {
    const section = formConfig.getSection('mockSection');
    section.state.isDisabled = true;

    subscription = formConfig.onSectionChange.subscribe((sectionId: string) => {
      done.fail(new Error('Should not have been triggered.'));
    });

    const subject = formConfig.activateSectionById('mockSection');
    expect(subject).toBeDefined();
    done();
  });

  it('should not activate a section if section is hidden', (done) => {
    const section = formConfig.getSection('mockSection');
    section.state.isHidden = true;

    subscription = formConfig.onSectionChange.subscribe((sectionId: string) => {
      done.fail(new Error('Should not have been triggered.'));
    });

    const subject = formConfig.activateSectionById('mockSection');
    expect(subject).toBeDefined();
    done();
  });

  it('should update the section', () => {
    const sectionA = formConfig.getSection('mockSection');
    sectionA.label = 'changed';
    formConfig.setSectionById(sectionA.sectionId, sectionA);
    expect(formConfig.getSection('mockSection').label).toBe('changed');
  });
});
