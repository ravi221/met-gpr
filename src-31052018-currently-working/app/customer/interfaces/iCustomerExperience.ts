/**
 * Represents a customer experience information
 */
export interface ICustomerExperience {
  /**
   * The experience number
   */
  experience: number;

  /**
   * An experience's reports
   */
  reports: [{
    report: number;
    subCodes: [{
      subCode: number;
      claimBranches: [{
        claimBranch: number;
        planIds: number[];
      }]
    }]
  }];
}
