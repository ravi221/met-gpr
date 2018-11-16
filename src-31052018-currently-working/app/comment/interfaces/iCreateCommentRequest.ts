/**
 * create comment request
 */

export interface ICreateCommentRequest {
    /**
     * customer number
     */
    customerNumber: number;
    /**
     * plan number
     */
    planId: string;
    /**
     * category number
     */
    categoryId: string;
    /**
     * question number
     */
    questionId: string;
    /**
     * section number
     */
    sectionId: string;
    /**
     * comment text
     */
    text: string;
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
}
