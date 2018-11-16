import { IFlaggedPlan } from 'app/flag/interfaces/iFlaggedPlan';



/**
 * Flag responses got from the service
 */
export interface IFlagsResponse {
    /**
     * total number of flags available for the plan
     */
    totalFlagCount: number;
    /**
     * a collection of plans
     */
    plans: IFlaggedPlan[];

}
