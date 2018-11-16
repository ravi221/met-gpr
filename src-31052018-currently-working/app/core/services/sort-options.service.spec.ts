import {SortOptionsService} from './sort-options.service';
import {PageContextTypes} from '../enums/page-context-types';

describe('SortOptionsService', () => {
  let service: SortOptionsService = new SortOptionsService();

  const validateSortByValues = (expectedSortByValues: string[], actualSortByValues: string[]) => {
    actualSortByValues.forEach(actualSortByValue => {
      expect(expectedSortByValues).toContain(actualSortByValue);
    });
  };

  it('should have four options for \'USER_HOME\'', () => {
    const sortOptions = service.getSortOptionsByPage(PageContextTypes.USER_HOME);
    expect(sortOptions.length).toBe(5);

    const expectedSortByValues = ['lastActivity', 'effectiveDate', 'customerName', 'status', 'customerNumber'];
    const actualSortByValues = sortOptions.map(s => s.sortBy);

    validateSortByValues(expectedSortByValues, actualSortByValues);
  });

  it('should have five options for \'CUSTOMER_HOME\'', () => {
    const sortOptions = service.getSortOptionsByPage(PageContextTypes.CUSTOMER_HOME);
    expect(sortOptions.length).toBe(5);

    const expectedSortByValues = ['planName', 'completionPercentage', 'effectiveDate', 'lastUpdatedTimestamp', 'flagsCount'];
    const actualSortByValues = sortOptions.map(s => s.sortBy);

    validateSortByValues(expectedSortByValues, actualSortByValues);
  });

  it('should have three options for \'HISTORY\'', () => {
    const sortOptions = service.getSortOptionsByPage(PageContextTypes.HISTORY);
    expect(sortOptions.length).toBe(2);

    const expectedSortByValues = ['lastUpdatedTimestamp', 'customerName'];
    const actualSortByValues = sortOptions.map(s => s.sortBy);

    validateSortByValues(expectedSortByValues, actualSortByValues);
  });

  it('should have three options for \'NAV_MENU_CUSTOMERS\'', () => {
    const sortOptions = service.getSortOptionsByPage(PageContextTypes.NAV_MENU_CUSTOMERS);
    expect(sortOptions.length).toBe(3);

    const expectedSortByValues = ['customerName', 'completionPercentage', 'effectiveDate'];
    const actualSortByValues = sortOptions.map(s => s.sortBy);

    validateSortByValues(expectedSortByValues, actualSortByValues);
  });

  it('should have four options for \'NAV_MENU_PLANS\'', () => {
    const sortOptions = service.getSortOptionsByPage(PageContextTypes.NAV_MENU_PLANS);
    expect(sortOptions.length).toBe(4);

    const expectedSortByValues = ['planName', 'completionPercentage', 'effectiveDate', 'product'];
    const actualSortByValues = sortOptions.map(s => s.sortBy);

    validateSortByValues(expectedSortByValues, actualSortByValues);
  });
});
