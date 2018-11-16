import {IPlan} from '../plan-shared/interfaces/iPlan';
import {PlanAction} from '../enums/plan-action';

/**
 * Interface describing an action on a Plan
 */
export interface IPlanAction {
    /**
     * Plan that was acted upon
     */
    plan?: IPlan;
    /**
     * Action taken on plan
     */
    planAction?: PlanAction;
    /**
     * Data associated with the action
     */
    data?: any;
    /**
     * Error that occurred while processing
     */
    error?: any;
}
