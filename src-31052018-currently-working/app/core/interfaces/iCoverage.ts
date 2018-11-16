/**
 * Represents a Coverage in GPR
 */
export interface ICoverage {
  /**
   * The coverage id stored in CDF
   */
  coverageId: string;

  /**
   * The name of the coverage
   */
  coverageName: string;

  /**
   * PPC Model Name
   */
  ppcModelName?: string;
}
