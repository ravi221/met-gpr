import {Entity} from './entity';
import {fakeAsync} from '@angular/core/testing';
import {Subscription} from 'rxjs/Subscription';

const MOCK_DATA = {person: {firstName: 'Tom', lastName: 'Smith', dob: '06/01/1985'}};

describe('Entity', () => {
  let entity: Entity;
  let subscription: Subscription;

  beforeEach(() => {
    entity = new Entity(MOCK_DATA);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  it('should return a new copy of the data model', () => {
    const copy = entity.toJS();
    expect(copy).not.toBe(MOCK_DATA);
  });

  it('should set an existing path with a new value in the model', () => {
    entity.setIn('person.firstName', 'John');
    expect(entity.getIn('person.firstName')).toEqual('John');
  });

  it('should set a new path in the model', () => {
    entity.setIn('person.address', '123 Test Lane');
    expect(entity.getIn('person.address')).toEqual('123 Test Lane');
  });

  it('should return the JSON value of the model', () => {
    const expected = JSON.stringify(MOCK_DATA);
    expect(entity.toJSON()).toEqual(expected);
  });

  it('should emit an event when a value has been updated', (done) => {
    subscription = entity.source.subscribe((resolve) => {
      expect(resolve.path).toEqual('person.firstName');
      expect(resolve.previousValue).toEqual('Tom');
      expect(resolve.currentValue).toEqual('John');
      done();
    });

    entity.setIn('person.firstName', 'John');

  });

  it('should not emit an event when updated value is the same in the model', (done) => {
    subscription = entity.source.subscribe((resolve) => {
      done.fail(new Error('Should not have been emitted.'));
    });
    entity.setIn('person.firstName', 'Tom');
    done();
  });
});
