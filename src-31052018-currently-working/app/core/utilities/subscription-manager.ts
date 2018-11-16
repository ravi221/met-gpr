import {Subscription} from 'rxjs/Subscription';

/**
 * Used to manage multiple subscriptions
 */
export class SubscriptionManager {

  /**
   * Unsubscribes from a group of subscriptions
   * @param {Subscription[]} subscriptions
   */
  public static massUnsubscribe(subscriptions: Subscription[]): void {
    subscriptions.forEach( (subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }
}
