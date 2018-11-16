import {Injectable} from '@angular/core';

/**
 * A service for testing date formats
 */
@Injectable()
export class DateService {

  /**
   * A regular expression for matching the correct date format (M/D/YYYY) or (MM/DD/YYYY)
   * @type {RegExp}
   */
  private static readonly DATE_REGEX: RegExp = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

  /**
   * Tests if the given string is in the correct format for a date, current accepts
   * 1/1/2018 and 01/01/2018
   * @param {string} date
   * @returns {boolean}
   */
  public isDateFormat(date: string): boolean {
    return DateService.DATE_REGEX.test(date);
  }
}
