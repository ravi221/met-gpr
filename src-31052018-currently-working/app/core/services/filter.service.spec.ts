import {FilterService} from './filter.service';
import {Subscription} from 'rxjs/Subscription';

describe('FilterService', () => {
  let service: FilterService;
  let subscription: Subscription;

  beforeEach(() => {
    service = new FilterService();
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  it('should update filters', (done) => {
    expect(service).toBeTruthy();

    const filters = {
      data: 'test'
    };

    subscription = service.getFilters().subscribe(newFilters => {
      expect(newFilters).toBeTruthy();
      expect(newFilters.data).toBe('test');
      done();
    });
    service.setFilters(filters);
  });
});
