/**
 * This interface is used as the request body for creating flag
 */
export interface ICreateFlagRequest {

  /**
   * name of the category containing the tag
   */
  categoryName: string;
  /**
   * id of the category containing the tag
   */
  categoryId: string;
  /**
   * name of the section containing the tag
   */
  sectionName: string;
  /**
   * id of the section containing the tag
   */
  sectionId: string;
  /**
   * The question id to add the flag to
   */
  questionId: string;
  /**
   * question name the tag is being added to
   */
  questionName: string;
  /**
   * customer number for the plan the tag is being added to
   */
  customerNumber: number;
  /**
   * planId for the plan the tag is being added to
   */
  planId: string;
  /**
   * plan name for the plan the tag is being added to
   */
  planName: string;
  /**
   * ppcmodel fo the plan the tag is being added to
   */
  ppcModelName: string;
  /**
   * ppc version of the plan the tag is being added to
   */
  ppcVersion: string;
  /**
   * coverage id of the plan the tag is being added to
   */
  coverageId: string;
  /**
   * text to be added
   */
  text: string;
  /**
   * value of the question
   */
  questionValue: string;

}
