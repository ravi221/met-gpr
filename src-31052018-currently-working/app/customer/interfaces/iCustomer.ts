import {IActivity} from '../../activity/interfaces/iActivity';
import {CustomerStatus} from '../enums/customer-status';

/**
 * Describes the shape of a GPR customer.
 */
export interface ICustomer {

  /**
   * The name of the customer.
   */
  customerName: string;

  /**
   * The customer number.
   */
  customerNumber: number;

  /**
   * The date in which the customer is effective.
   */
  effectiveDate: string;

  /**
   * The completion percentage of the customer.
   * This is an aggregated number for all plan attributes that's completed.
   */
  percentageCompleted: number;

  /**
   * The market segment of the customer
   */
  market: string;

  /**
   * The id for the market segment
   */
  marketSegmentId?: string;

  /**
   * The current status of the customer.
   */
  status: CustomerStatus;

  /**
   * The visibility property of the customer
   * This determines how the customer should display on the home screen based on a toggle button
   */
  hiddenStatus: boolean;

  /**
   * property used to toggle the visibility of customers while scrolling
   */
  scrollVisibility: boolean;

  /**
   * An optional last activity for this customer
   */
  lastActivity?: IActivity;

  /**
   * The clientId for the customer
   */
  clientId?: string;
}
