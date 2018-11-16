import {NotificationService} from './notification.service';
import {Subscription} from 'rxjs/Subscription';
import {INotification} from '../interfaces/iNotification';
import {NotificationTypes} from '../models/notification-types';

describe('NotificationService', () => {
  let subscription: Subscription;
  let service: NotificationService;
  const mockNotification: INotification = {
    id: 'mockId',
    message: 'This is a mock notification.',
    type: NotificationTypes.SUCCESS
  };

  beforeEach(() => {
    service = new NotificationService();
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('Adding notifications', () => {
    it('should add an alert', (done) => {
      subscription = service.getNotifications().subscribe((notifications: INotification[]) => {
        expect(notifications).toBeTruthy();
        expect(notifications.length).toEqual(1);
        const notification = notifications[0];
        expect(notification.type).toEqual(mockNotification.type);
        expect(notification.message).toEqual(mockNotification.message);
        done();
      });

      const result = service.addNotification(mockNotification.type, mockNotification.message);
      expect(result).toBeTruthy();
      expect(result.type).toEqual(mockNotification.type);
      expect(result.message).toEqual(mockNotification.message);
    });
  });

  describe('Deleting notifications', () => {
    it('should return false when removing alert with null id', (done) => {
      subscription = service.getNotifications().subscribe(() => {
        done.fail(new Error('Subscription should not have been called.'));
      });
      const result = service.deleteNotification(null);
      expect(result).toBeFalsy();
      done();
    });

    it('should return false when removing alert with undefined id', (done) => {
      subscription = service.getNotifications().subscribe(() => {
        done.fail(new Error('Subscription should not have been called.'));
      });
      const result = service.deleteNotification(undefined);
      expect(result).toBeFalsy();
      done();
    });

    it('should successfully delete an alert', (done) => {
      const notification = service.addNotification(mockNotification.type, mockNotification.message);
      subscription = service.getNotifications().subscribe((notifications: INotification[]) => {
        expect(notifications).toBeTruthy();
        expect(notifications.length).toEqual(0);
        done();
      });

      const result = service.deleteNotification(notification.id);
      expect(result).toBeTruthy();
    });

    it('should not delete an alert with an invalid id', (done) => {
      service.addNotification(mockNotification.type, mockNotification.message);
      subscription = service.getNotifications().subscribe(() => {
        done.fail(new Error('Subscription should not have been called.'));
      });

      const result = service.deleteNotification('invalidId');
      expect(result).toBeFalsy();
      done();
    });

    it('should delete all alerts', (done) => {
      service.addNotification(mockNotification.type, mockNotification.message);
      service.addNotification(mockNotification.type, mockNotification.message);
      service.addNotification(mockNotification.type, mockNotification.message);

      subscription = service.getNotifications().subscribe((notifications: INotification[]) => {
        expect(notifications).toBeTruthy();
        expect(notifications.length).toEqual(0);
        done();
      });
      service.deleteAll();
    });
  });
});
