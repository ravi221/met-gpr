import {DateService} from './date.service';

describe('DateService', () => {
  let service: DateService = new DateService();

  it('should return true for a valid date \'1/1/2018\'', () => {
    expect(service.isDateFormat('1/1/2018')).toBeTruthy();
  });

  it('should return true for a valid date \'10/1/2018\'', () => {
    expect(service.isDateFormat('10/1/2018')).toBeTruthy();
  });

  it('should return true for a valid date \'1/10/2018\'', () => {
    expect(service.isDateFormat('1/10/2018')).toBeTruthy();
  });

  it('should return true for a valid date \'10/10/2018\'', () => {
    expect(service.isDateFormat('10/10/2018')).toBeTruthy();
  });

  it('should return false for an invalid date \'10/10/201\'', () => {
    expect(service.isDateFormat('1/1/201')).toBeFalsy();
  });
});
