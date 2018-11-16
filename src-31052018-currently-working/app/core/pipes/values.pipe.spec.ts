import {ValuesPipe} from './values.pipe';

describe('ValuesPipe', () => {
  let pipe: ValuesPipe = new ValuesPipe();

  it('should return an empty array for empty objects', () => {
    const mockObject = {};
    const expected = [];
    const actual = pipe.transform(mockObject);
    expect(actual).toEqual(expected);
  });

  it('should return an array of objects from object', () => {
    const mockObject = {user1: {name: 'Bob'}, user2: {name: 'Nick'}};
    const expected = [{id: 'user1', name: 'Bob'}, {id: 'user2', name: 'Nick'}];
    const actual = pipe.transform(mockObject);

    expect(actual[0].id).toEqual(expected[0].id);
    expect(actual[1].id).toEqual(expected[1].id);
    expect(actual[0].name).toEqual(expected[0].name);
    expect(actual[1].name).toEqual(expected[1].name);
  });
});
