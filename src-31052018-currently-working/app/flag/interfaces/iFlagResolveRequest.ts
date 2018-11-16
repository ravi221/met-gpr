/**
 * Resolve flags
 */

export interface IFlagResolveRequest {
    /**
     * question id
     */
    questionId?: string;
    /**
     * plan number
     */
    planId: string;
    /**
     * should the flag retain
     */
    shouldRetain: boolean;
}
