/**
 * comments request
 */

export interface ICommentsRequest {
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
    categoryId?: string;
    /**
     * question number
     */
    questionId?: string;
    /**
     * section number
     */
    sectionId?: string;
}
