import DSL, {IObservedRule} from './dsl-wrapper';
import {Subscription} from 'rxjs/Subscription';

describe('DSL', () => {
  let dsl: DSL;
  let id: string;
  let data: any;
  let meta: any;
  let subscription: Subscription;

  beforeEach(() => {
    dsl = new DSL();
    id = 'abc';
    data = {person: {firstName: 'Test', lastName: 'User'}};
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  it('should execute a rule successfully', (done) => {
    meta = {condition: '1 === 1', action: 'this.person.firstName = "Good Test"'};

    subscription = dsl.execute(id, meta, data).subscribe((result: IObservedRule) => {
      expect(result.ids).toContain(id);
      const context = result.context;
      expect(context.person.firstName).toEqual('Good Test');
      done();
    }, (error) => {
      done.fail(new Error('Should not have thrown an error.'));
    });

  });

  it('should execute a rule with registered token', (done) => {
    const customFn = (input) => {
      if (input.firstName === 'Test') {
        return 'Changed by function!';
      }
      return '';
    };
    dsl.register('customFn', customFn);
    meta = {condition: true, action: 'this.person.firstName = customFn(this.person)'};

    subscription = dsl.execute(id, meta, data).subscribe((result: IObservedRule) => {
      expect(result.ids).toContain(id);
      const context = result.context;
      expect(context.person.firstName).toEqual('Changed by function!');
      done();
    }, (error) => {
      done.fail(new Error('Should not have thrown an error.'));
    });
  });

  it('should throw exception when compiling a rule with unknown token', (done) => {
    meta = {condition: true, action: 'this.person.firstName = customFn(this.person)'};

    subscription = dsl.execute(id, meta, data).subscribe((result: IObservedRule) => {
      done.fail(new Error('Should not have been resolved.'));

    }, (error) => {
      expect(error).toBeDefined();
      done();
    });
  });

  it('should subscribe to the DSL source for rule execution updates', (done) => {
    meta = {condition: '1 === 1', action: 'this.person.firstName = "Good Test"'};
    dsl.execute(id, meta, data);
    subscription = dsl.source.subscribe((result: IObservedRule) => {
      expect(result.ids).toContain(id);
      const context = result.context;
      expect(context.person.firstName).toEqual('Good Test');
      done();
    });

  });

  it('should subscribe to the DSL source for rule execution failures', (done) => {
    meta = {condition: '1 === 1', action: 'this = "You should not be doing this!"'}; // assigning value to 'this' should throw an exception within DSL engine.
    dsl.execute(id, meta, data);
    subscription = dsl.source.subscribe((result: IObservedRule) => {
        done.fail(new Error('Show not have been resolved'));
      },
      (error) => {
        expect(error).toBeDefined();
        done();
      });

  });


});
