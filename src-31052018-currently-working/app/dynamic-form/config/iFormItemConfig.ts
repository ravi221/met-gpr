/**
 * Defines an interface implentable by all items that go on a form
 */
import {FormItemType} from '../enumerations/form-items-type';

/**
 * Generic item that goes on a form. Any thing that goes on the form should implement this interface
 */
export interface IFormItemConfig {

  /**
   * The index of the item
   */
  order: number;

  /**
   * The unique id for the item
   */
  formItemId: string;

  /**
   * The text label displayed to the user
   */
  label: string;

  /**
   * Returns the type of config
   * @returns {FormItemType}
   */
  getType(): FormItemType;
}
