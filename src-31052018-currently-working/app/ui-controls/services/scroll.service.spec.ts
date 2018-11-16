import {ScrollService} from './scroll.service';
import {IScrollEvent} from 'app/ui-controls/interfaces/iScrollEvent';
import {Subscription} from 'rxjs/Subscription';
import {ScrollEventOrigin} from 'app/ui-controls/enums/scroll-event-origin';

describe('ScrollService', () => {
  let service: ScrollService = new ScrollService();

  it('should call window scroll by', () => {
    const spy = spyOn(window, 'scrollBy').and.stub();
    service.scrollBy(10, 10);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(10, 10);
  });

  it('should call window scroll to', () => {
    const spy = spyOn(window, 'scrollTo').and.stub();
    service.scrollTo(10, 10);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(10, 10);
  });

  describe('Pub-sub functionality', () => {
    let subscription: Subscription;

    afterEach(() => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });

    it('should pass event object to subscribers when scrolled', (done) => {
      subscription = service.scrollEvent$.subscribe(event => {
        expect(event).toBeDefined();
        expect(event.eventOrigin).toBe(ScrollEventOrigin.MAIN_NAV_MENU);
        expect(event.isNearBottom).toBeFalsy();
        done();
      });
      const scrollEvent = <IScrollEvent>{
        bottomThreshold: 150,
        eventOrigin: ScrollEventOrigin.MAIN_NAV_MENU,
        eventElement: {
          srcElement: {
            scrollTop: 100,
            scrollHeight: 1000,
            clientHeight: 450
          }
        }
      };
      service.sendScrollEvent(scrollEvent);
    });

    it('should be near bottom', (done) => {
      subscription = service.scrollEvent$.subscribe(event => {
        expect(event).toBeDefined();
        expect(event.eventOrigin).toBe(ScrollEventOrigin.MAIN_NAV_MENU);
        expect(event.isNearBottom).toBeTruthy();
        done();
      });
      const scrollEvent = <IScrollEvent>{
        bottomThreshold: 150,
        eventOrigin: ScrollEventOrigin.MAIN_NAV_MENU,
        eventElement: {
          srcElement: {
            scrollTop: 800,
            scrollHeight: 1000,
            clientHeight: 450
          }
        }
      };
      service.sendScrollEvent(scrollEvent);
    });
  });
});
