/**
 * Activity used for activity card
*/
export interface IActivity {
    /**
     * The id of the customer
     */
    customerNumber: number;
    /**
     * The id of the plan
     */
    planId: string;
    /**
     * The name of the plan
     */
    planName: string;
    /**
     * The status of the recent update
    */
    status: string;
    /**
     * The attribute name
    */
    attribute: string;
    /**
     * The timestamp of recent activity
    */
    timestamp: string;
    /**
     * The first name of the person who made changes
    */
    firstName: string;
    /**
     * The last name of the person who made changes
    */
    lastName: string;
    /**
     * The emailid of the person who made changes
    */
    emailId: string;
    /**
     * The metnetid of the person who made changes
    */
    metnetId: string;
    /**
     * totalflagcount for a plan
     */
    totalFlagCount: number;
    /**
     * section ID
     */
    sectionId?: string;
    /**
     * category ID
     */
    categoryId?: string;
  }
