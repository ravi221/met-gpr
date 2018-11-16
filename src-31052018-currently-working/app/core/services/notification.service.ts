import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {isNil} from 'lodash';
import {INotification} from '../interfaces/iNotification';
import {NotificationTypes} from '../models/notification-types';
import {Guid} from '../utilities/guid';

/**
 * A singleton service that houses all notifications added by the client
 */
@Injectable()
export class NotificationService implements OnDestroy {

  /**
   * Internal store of notifications
   * @type {Array}
   * @private
   */
  private _notifications: INotification[] = [];

  /**
   * Internal alert subject to be emitted upon adding/removing of notifications.
   * @type {Subject<INotification[]>}
   * @private
   */
  private _notificationSubject: Subject<INotification[]> = new Subject<INotification[]>();

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * On destroy, remove all notifications
   */
  ngOnDestroy(): void {
    this.deleteAll();
    this._notificationSubject.complete();
  }

  /**
   * Adds a new notification to notification store, and returns the new notification.
   *
   * @param {NotificationTypes} type
   * @param {string} message
   * @returns {INotification}
   */
  public addNotification(type: NotificationTypes, message: string): INotification {
    const id = Guid.create();
    const notification: INotification = {
      id, type, message
    };
    this._notifications.push(notification);
    this._notificationSubject.next([...this._notifications]);
    return notification;
  }

  /**
   * Gets a list of notifications as an observable.
   * @returns {Observable<INotification>}
   */
  public getNotifications(): Observable<INotification[]> {
    return this._notificationSubject.asObservable().debounceTime(250);
  }

  /**
   * Removes an existing notification by it's id.
   * @param {string} id
   * @returns {boolean}
   */
  public deleteNotification(id: string): boolean {
    if (isNil(id)) {
      return false;
    }
    const idx = this._notifications.findIndex(n => n.id === id);
    if (idx > -1) {
      this._notifications.splice(idx, 1);
      this._notificationSubject.next([...this._notifications]);
      return true;
    }
    return false;
  }

  /**
   * Removes all alerts from current store.
   */
  public deleteAll(): void {
    this._notifications = [];
    this._notificationSubject.next([...this._notifications]);
  }
}
