/**
 * Interface to define how plan data should look
 */
export interface IPlanCategoryData {

  /**
   * The category
   */
  categoryId: string;

  /**
   * The id of the plan
   */
  planId: string;

  /**
   * Questions and their answers
   */
  values?: any;
}
