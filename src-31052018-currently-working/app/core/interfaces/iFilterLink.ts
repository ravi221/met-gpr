/**
 * Describes the shape of a filter link object that is utilized by {@link FilterBarComponent}.
 */
export interface IFilterLink {
  /**
   * The filter to apply once the link is active.
   */
  filter: any;
  /**
   * The label to display as the link.
   */
  label: string;
  /**
   * Indicates whether the link is currently active.
   */
  active?: boolean;
  /**
   * Any sub links that are triggered once a filter link is selected
   */
  subLinks: Array<IFilterLink>;
}
