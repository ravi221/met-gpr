import {NotHiddenPipe} from './not-hidden.pipe';

describe('NotHiddenPipe', () => {
  let pipe: NotHiddenPipe;
  beforeEach(() => {
    pipe = new NotHiddenPipe();
  });

  it('should remove items where isHidden is "true"', () => {
    const mockArray = [
      {id: 1, person: 'Test User 1', isHidden: true},
      {id: 2, person: 'Test User 2'},
      {id: 3, person: 'Test User 3', isHidden: true},
      {id: 4, person: 'Test User 4'}
    ];
    const result = pipe.transform(mockArray);

    expect(result.find((i) => i.id === 1)).toBeUndefined();
    expect(result.find((i) => i.id === 2)).toBeDefined();
    expect(result.find((i) => i.id === 3)).toBeUndefined();
    expect(result.find((i) => i.id === 4)).toBeDefined();
  });

  it('should remove items where isHidden is "1"', () => {
    const mockArray = [
      {id: 1, person: 'Test User 1', isHidden: 1},
      {id: 2, person: 'Test User 2'},
      {id: 3, person: 'Test User 3', isHidden: 1},
      {id: 4, person: 'Test User 4'}
    ];
    const result = pipe.transform(mockArray);

    expect(result.find((i) => i.id === 1)).toBeUndefined();
    expect(result.find((i) => i.id === 2)).toBeDefined();
    expect(result.find((i) => i.id === 3)).toBeUndefined();
    expect(result.find((i) => i.id === 4)).toBeDefined();
  });

  it('should not remove any items', () => {
    const mockArray = [
      {id: 1, person: 'Test User 1', isHidden: false},
      {id: 2, person: 'Test User 2'},
      {id: 3, person: 'Test User 3', isHidden: 0},
      {id: 4, person: 'Test User 4'}
    ];
    const result = pipe.transform(mockArray);

    expect(result.length).toEqual(mockArray.length);
  });

  it('should return empty array when value is null', () => {
    const result = pipe.transform(null);
    expect(result).toEqual([]);
  });

});
