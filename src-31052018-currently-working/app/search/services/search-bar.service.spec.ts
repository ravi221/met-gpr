import {SearchBarService} from './search-bar.service';

describe('SearchBarService', () => {
  let service: SearchBarService = new SearchBarService();

  it('should trigger focus', (done) => {
    const subscription = service.focus$.subscribe(() => {
      subscription.unsubscribe();
      done();
    });
    service.focus();
  });
});
