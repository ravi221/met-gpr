
/**
 * Interface to describe the shape of the flag filter types to be used by {@link FlagFilterComponent} .
 */
export interface IFlagFilter {
    /**
     * Plan name
     */
    planName: string;

    /**
     * status of the flag if resolved or open
     */
    status: boolean;
  }

