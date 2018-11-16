import {FormControl} from './form-control';
import {Subscription} from 'rxjs/Subscription';

describe('FormControl', () => {
  let component: TestControlClass;
  let subscription: Subscription;

  beforeEach(() => {
    component = new TestControlClass();
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  it('should emit event when onValueChanged method is called', () => {
    const expected = 'New Value';
    subscription = component.valueChanged.subscribe((observed: TestControlClass) => {
      expect(observed.value).toEqual(expected);
    });
    component.onValueChanged(expected);
  });

  class TestControlClass extends FormControl {
    constructor() {
      super();
    }
  }
});
