/**
 * Interface for what the Plan Copy Service call will return
 */
export interface IPlanCopyResponse {
    /**
     * Status message sent back from server
     */
    responseMessage?: string;
    /**
     * Customer Number where the plan was copied to
     */
    customerNumber?: number;
    /**
     * Plan ID of newly copied plan
     */
    planId?: number;
    /**
     * Plan Name of the plan that was copied
     */
    planName?: string;
}
