/**
 * Interface to describe the shape of a breadcrumb to be used by {@link BreadcrumbsComponent}.
 */
export interface IBreadcrumb {
  /**
   * The label to display on for the breadcrumb.
   */
  label: string;
  /**
   * The associated route url to navigate to upon clicking the breadcrumb.
   */
  path: string;
  /**
   * An optional handler to trigger upon clicking the breadcrumb.
   */
  onClick?: any;
}
