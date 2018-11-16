/**
 * Interface for service contract for the Copy Plan Service call
 */
export interface IPlanCopyRequest {
    /**
     * Plan name to copy
     */
    planName: string;
    /**
     * Effective date to copy
     */
    effectiveDate: string;
    /**
     * Customer Number to copy plan to
     */
    customerNumber: number;
    /**
     * Coverage Id
     */
    coverageId?: string;
    /**
     * PPC Model Name
     */
    ppcModelName?: string;
}
