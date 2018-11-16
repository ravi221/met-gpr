import {IdleExpiry} from '@ng-idle/core';

/**
 * Mock class for idle expiry
 */
export class MockIdleExpiry extends IdleExpiry {
  /**
   * Mock last date field
   */
  public lastDate: Date;

  /**
   * Mock now date
   */
  public mockNow: Date;

  /**
   * Mock last call
   * @param {Date} value
   * @returns {Date}
   */
  last(value?: Date): Date {
    if (value !== void 0) {
      this.lastDate = value;
    }

    return this.lastDate;
  }

  /**
   * Mock now call
   * @returns {Date}
   */
  now(): Date {
    return this.mockNow || new Date();
  }
}
