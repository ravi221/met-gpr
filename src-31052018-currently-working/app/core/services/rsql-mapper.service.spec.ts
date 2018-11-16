import {RsqlMapperService} from './rsql-mapper.service';

describe('RsqlMapperService', () => {
  let service: RsqlMapperService = new RsqlMapperService();

  describe('IN operator', () => {
    it('should correctly map number array using \'in\' operator', () => {
      const testObject = {
        key1: [1, 2, 3]
      };
      const rsql = service.mapObjectToRsql(testObject);
      expect(rsql).toBe('key1=in=(1,2,3)');
    });

    it('should correctly map a number array and string using \'in\' operator', () => {
      const testObject = {
        key1: [1, 2, 3],
        key2: ['Hi', 'Hello']
      };
      const rsql = service.mapObjectToRsql(testObject);
      expect(rsql).toBe('key1=in=(1,2,3);key2=in=(Hi,Hello)');
    });
  });

  describe('EQUAL operator', () => {
    it('should correctly map number using \'equal\' operator', () => {
      const testObject = {
        key1: 1
      };
      const rsql = service.mapObjectToRsql(testObject);
      expect(rsql).toBe('key1==1');
    });

    it('should correctly map numbers and string using \'equal\' operator', () => {
      const testObject = {
        key1: 1,
        key2: 'Hi'
      };
      const rsql = service.mapObjectToRsql(testObject);
      expect(rsql).toBe('key1==1;key2==Hi');
    });
  });

  describe('EQUAL and IN operator', () => {
    it('should correctly map number and number array using \'equal\' and \'in\' operator', () => {
      const testObject = {
        key1: 1,
        key2: [2, 3]
      };
      const rsql = service.mapObjectToRsql(testObject);
      expect(rsql).toBe('key1==1;key2=in=(2,3)');
    });

    it('should correctly map string and number array using \'equal\' and \'in\' operator', () => {
      const testObject = {
        key1: 'Hi',
        key2: [1, 2, 3]
      };
      const rsql = service.mapObjectToRsql(testObject);
      expect(rsql).toBe('key1==Hi;key2=in=(1,2,3)');
    });
  });
});
