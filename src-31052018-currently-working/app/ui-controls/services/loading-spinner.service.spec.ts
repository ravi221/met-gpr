import {AnimationState} from '../animations/AnimationState';
import {LoadingSpinnerService} from './loading-spinner.service';
import {Subscription} from 'rxjs/Subscription';

describe('LoadingSpinnerService', () => {
  const service: LoadingSpinnerService = new LoadingSpinnerService();
  let subscription: Subscription;

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  it('should change the state of the loading spinner to visible', (done) => {
    subscription = service.visibility$.subscribe((state: AnimationState) => {
      expect(state).toBe(AnimationState.VISIBLE);
      done();
    });
    service.show();
  });

  it('should not change the state of the loading spinner to hidden', (done) => {
    subscription = service.visibility$.subscribe((state: AnimationState) => {
      expect(state).toBe(AnimationState.HIDDEN);
      done();
    });
    service.hide();
  });
});
