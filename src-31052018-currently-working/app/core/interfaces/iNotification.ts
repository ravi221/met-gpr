import {NotificationTypes} from '../models/notification-types';

/**
 * Describes the shape of a notification that's stored and is emitted by {@link NotificationService}.
 */
export interface INotification {

  /**
   * The unique id of the alert.
   */
  id: string;

  /**
   * The type of the notification.
   */
  type: NotificationTypes;

  /**
   * The message of the alert.
   */
  message: string;
}
