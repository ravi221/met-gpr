import { IFlag } from 'app/flag/interfaces/iFlag';

/**
 * Summary flags for flag card response
 */

export interface ISummaryFlagsResponse {
    /**
     * array of flags
     */
    flags: IFlag[];
    /**
     * count number of flags
     */
    totalFlagCount: number;
}
