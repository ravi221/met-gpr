/**
 * Interface to represent a sort option, used by {@link SortMenuComponent}
 */
export interface ISortOption {

  /**
   * The label of the sort option
   */
  label: string;

  /**
   * The field to sort by
   */
  sortBy: string;

  /**
   * Indicates whether to sort by ascending (true) or descending (false)
   */
  sortAsc: boolean;

  /**
   * Indicates whether the sort option is the currently selected sort option
   */
  active: boolean;

  /**
   * An optional icon to display next to sort option label
   */
  icon?: string;
}
