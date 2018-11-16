import {ProgressService} from './progress.service';
import {Subscription} from 'rxjs/Subscription';
import {IProgress} from '../interfaces/iProgress';

describe('ProgressService', () => {
  let subscription: Subscription;
  let service: ProgressService;

  beforeEach(() => {
    service = new ProgressService();
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  it('should emit an updated progress when a transaction is added', (done) => {
    subscription = service.source.subscribe((progress: IProgress) => {
      expect(progress.active).toBeTruthy();
      expect(progress.totalRequests).toEqual(1);
      expect(progress.completedRequests).toEqual(0);
      done();
    });

    service.addTransaction('testA', 'test/url', 'GET');
  });

  it('should emit an updated progress when 2 transactions are active', (done) => {
    service.addTransaction('testA', 'test/url', 'GET');

    subscription = service.source.subscribe((progress: IProgress) => {
      expect(progress.active).toBeTruthy();
      expect(progress.totalRequests).toEqual(2);
      expect(progress.completedRequests).toEqual(0);
      done();
    });

    service.addTransaction('testB', 'test/url', 'GET');
  });

  it('should emit an updated progress when 2 transactions are active and 1 is removed', (done) => {
    service.addTransaction('testA', 'test/url', 'GET');
    service.addTransaction('testB', 'test/url', 'GET');

    subscription = service.source.subscribe((progress: IProgress) => {
      expect(progress.active).toBeTruthy();
      expect(progress.totalRequests).toEqual(2);
      expect(progress.completedRequests).toEqual(1);
      expect(progress.value).toEqual(0.5);
      done();
    });

    service.removeTransaction('testA');
  });
});
