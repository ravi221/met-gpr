import {SortWithComparatorPipe} from './sort-with-comparator.pipe';

describe('SortWithComparatorPipe', () => {
  let pipe: SortWithComparatorPipe = new SortWithComparatorPipe();
  let mockArray: string[];
  let myComparatorFunction = (first, second) => first > second ? 1 : -1;

  beforeEach(() => {
    mockArray = ['Banana', 'Cat', 'Apple'];
  });

  it('should return null when array is undefined', () => {
    const expected = undefined;
    const actual = pipe.transform(undefined, myComparatorFunction);
    expect(actual).toEqual(expected);
  });

  it('should return null when array is null', () => {
    const expected = null;
    const actual = pipe.transform(null, myComparatorFunction);
    expect(actual).toEqual(expected);
  });

  it('should return array of strings in alphabetical order', () => {
    const expected = ['Apple', 'Banana', 'Cat'];
    const actual = pipe.transform(mockArray, myComparatorFunction);
    expect(actual[0]).toEqual(expected[0]);
    expect(actual[1]).toEqual(expected[1]);
    expect(actual[2]).toEqual(expected[2]);
  });

  it('should return array of strings in reverse alphabetical order', () => {
    const expected = ['Cat', 'Banana', 'Apple'];
    const actual = pipe.transform(mockArray, myComparatorFunction, true);
    expect(actual[0]).toEqual(expected[0]);
    expect(actual[1]).toEqual(expected[1]);
    expect(actual[2]).toEqual(expected[2]);
  });
});
