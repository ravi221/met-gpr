import parseValue from './parseValue';
import moment = require('moment');
import DateTime from '../../core/models/date-time';

describe('ParseValue', () => {

  it('should return null if value is null', () => {
    expect(parseValue('', null)).toBeNull();
  });

  it('should return undefined if value is undefined', () => {
    expect(parseValue('', undefined)).toBeUndefined();
  });

  it('should return same value if type is not valid', () => {
    expect(parseValue('badType', 'testValue')).toEqual('testValue');
  });

  it('should return boolean value if type is boolean', () => {
    expect(parseValue('boolean', 'true')).toEqual(true);
  });

  it('should return string value if type is string', () => {
    expect(parseValue('string', 123)).toEqual('123');
  });

  it('should return number value if type is number or integer', () => {
    expect(parseValue('number', '123')).toEqual(123);
    expect(parseValue('integer', '345')).toEqual(345);
  });

  it('should return ISO datetime value if type is date-time', () => {
    let currentDate = moment().format('MM/DD/YYYY');
    expect(parseValue('date-time', currentDate)).toEqual(new DateTime(currentDate).asString());
  });
});
