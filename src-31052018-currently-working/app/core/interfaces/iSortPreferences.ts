/**
 * Interface to represent a sort preferences for controls
 */
export interface ISortPreferences {
  /**
   * field to sort by
   */
  sortBy: string;
  /**
   * sort direction. true for ascending false for descending
   */
  sortAsc: boolean;
}
