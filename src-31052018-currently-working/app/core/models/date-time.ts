import * as moment from 'moment';

/**
 * Datetime class to create a normalized datetime instance for date data types.
 */
export default class DateTime {
  /**
   * Private moment instance of the datetime value.
   */
  private _date: moment.Moment;

  /**
   * Constructs a given value and create the moment instance.
   * @param {DateTime | string} value
   * @returns {DateTime}
   */
  constructor(value?: DateTime | string) {
    if (value instanceof DateTime) {
      return value;
    } else if (moment.isMoment(value)) {
      this._date = value;
    } else if (value) {
      this._date = moment(value, ['MM/DD/YYYY', 'M/D/YYYY', 'YYYY-MM-DD']);
    } else {
      this._date = moment();
    }
  }

  /**
   * Returns the date value as a string in the provided format
   * @param {string} format: Moment syntax formats
   * @returns {string}
   */
  public asString(format?: string): string {
    return this._date.format(format);
  }

  /**
   * Returns the moment instance of the datetime object.
   * @returns {moment.Moment}
   */
  public asMoment(): moment.Moment {
    return this._date;
  }

  /**
   * Returns the string representation of the datetime object.
   * This method is used by JSON.stringify prior to serializing data for API communications.
   * @returns {string}
   */
  public toJSON(): string {
    return this.asString();
  }
}
