import {FormUtility} from './form-utility';

describe('FormUtility', () => {
  describe('Schema Number', () => {
    it('should return true when value is a decimal', () => {
      expect(FormUtility.isSchemaTypeNumber('decimal')).toBeTruthy();
    });

    it('should return true when value is a decimal with case ignored', () => {
      expect(FormUtility.isSchemaTypeNumber('DECIMAL')).toBeTruthy();
    });

    it('should return true when value is a number', () => {
      expect(FormUtility.isSchemaTypeNumber('number')).toBeTruthy();
    });

    it('should return true when value is a number with case ignored', () => {
      expect(FormUtility.isSchemaTypeNumber('NUMBER')).toBeTruthy();
    });

    it('should return false when value is not a decimal or a number', () => {
      expect(FormUtility.isSchemaTypeNumber('other')).toBeFalsy();
    });
  });
});
