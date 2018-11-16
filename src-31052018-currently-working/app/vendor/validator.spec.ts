import {IValidationResult, Validator} from './validator';
import {Subscription} from 'rxjs/Subscription';

describe('Validator', () => {
  let validator: Validator;
  let subscription: Subscription;

  beforeEach(() => {
    validator = new Validator();
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  it('should return invalid result when value does not comply with schema', () => {
    const id = 'abc';
    const value = 'Test';
    const schema = {'type': 'number'};

    const result: IValidationResult = validator.validate(id, value, schema);

    expect(result.isValid).toEqual(false);
    expect(result.messages.length).toBeGreaterThan(0);
  });

  it('should return valid result when value complies with schema', () => {
    const id = 'abc';
    const value = 99;
    const schema = {'type': 'number', 'minimum': 0, 'maximum': 100};

    const result: IValidationResult = validator.validate(id, value, schema);

    expect(result.isValid).toEqual(true);
    expect(result.messages.length).toEqual(0);
  });

  it('should return valid result when value is empty string', () => {
    const id = 'abc';
    const value = '';
    const schema = {'type': 'string'};

    const result: IValidationResult = validator.validate(id, value, schema);

    expect(result.isValid).toEqual(true);
    expect(result.messages.length).toEqual(0);
  });

  it('should return valid result when value is null', () => {
    const id = 'abc';
    const value = null;
    const schema = {'type': 'string'};

    const result: IValidationResult = validator.validate(id, value, schema);

    expect(result.isValid).toEqual(true);
    expect(result.messages.length).toEqual(0);
  });

  it('should return valid result when value is undefined', () => {
    const id = 'abc';
    const value = undefined;
    const schema = {'type': 'string'};

    const result: IValidationResult = validator.validate(id, value, schema);

    expect(result.isValid).toEqual(true);
    expect(result.messages.length).toEqual(0);
  });

  it('should emit validation result when validation is executed', (done) => {
    const id = 'abc';
    const value = 99;
    const schema = {'type': 'number', 'minimum': 0, 'maximum': 100};

    subscription = validator.source.subscribe((resolve) => {
      expect(resolve.id).toEqual(id);
      expect(resolve.validationResult.isValid).toEqual(true);
      expect(resolve.validationResult.messages.length).toEqual(0);
      done();
    });

    validator.validate(id, value, schema);
  });
});
