import {ActivityService} from 'app/activity/services/activity.service';
import {IActivity} from 'app/activity/interfaces/iActivity';
import {Observable} from 'rxjs/Observable';

/**
 * Mock activity service
*/
export class MockActivityService extends ActivityService {

  /**
   * Gets latest change data based on customer Number
   * @param customerNumber: customer number to get last updated plan information
   */
  public getRecentCustomerPlanUpdate(customerNumber: number, planId?: string): Observable<IActivity> {
    return Observable.of();
  }

  /**
   * Gets recent customer plan updates
   * @param lastEdit
   */
  public getRecentCustomerPlanUpdateMessage(lastEdit: IActivity): string {
    return super.getRecentCustomerPlanUpdateMessage(lastEdit);
  }
}
