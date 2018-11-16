import {PlanAction} from '../enums/plan-action';

/**
 * Interface for the reponses when a user updates the status of a Plan
 */
export interface IPlanStatusUpdateResponse {
    /**
     * Status message sent back from server
     */
    responseMessage?: string;
    /**
     * Plan ID of newly copied plan
     */
    planId?: string;
    /**
     * Action taken on Plan
     */
    planAction?: PlanAction;
}
