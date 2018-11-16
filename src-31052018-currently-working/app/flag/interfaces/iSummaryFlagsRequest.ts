/**
 * Summary flags for flag card request
 */

export interface ISummaryFlagsRequest {
    /**
     * customer number
     */
    customerNumber: number;
    /**
     * plan number
     */
    planId?: string;
    /**
     * category number
     */
    categoryId?: string;
    /**
     * count number of flags
     */
    flagCount: number;
}
