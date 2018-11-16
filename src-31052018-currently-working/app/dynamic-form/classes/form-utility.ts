import {DataType} from '../enumerations/data-type';

/**
 * Utility class for form items
 */
export class FormUtility {

  /**
   * Used to determine if a form's schema would be a numeric type
   * @param {string} type
   * @returns {boolean}
   */
  public static isSchemaTypeNumber(type: string): boolean {
    return type.toLowerCase() === DataType.DECIMAL || type.toLowerCase() === DataType.NUMBER;
  }
}

