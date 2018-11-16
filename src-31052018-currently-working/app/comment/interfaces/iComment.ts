/**
 * create comments
 */

export interface IComment {
    /**
     * text of the comment
     */
    text: string;
    /**
     * comments updated by
     */
    lastUpdatedBy: string;
    /**
     * comments updated timestamp
     */
    lastUpdatedByTimestamp: string;
    /**
     * comments updated email
     */
    lastUpdatedByEmail: string;
    /**
     * comment number
     */
    commentId: number;
    /**
     * question number
     */
    questionId: string;
}
