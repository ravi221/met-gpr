import {ICoverage} from './iCoverage';

/**
 * Represents a product in GPR
 */
export interface IProduct {

  /**
   * The products name
   */
  productName: string;

  /**
   * A products list of coverages
   */
  coverages: ICoverage[];
}
