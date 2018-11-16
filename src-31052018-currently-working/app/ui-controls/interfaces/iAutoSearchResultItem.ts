/**
 * Interface to define the search results from the auto-search component
 */
export interface IAutoSearchResultItem {
    /**
     * Title to be displayed in autosearch result
     */
    title: string;
    /**
     * Subtitle to be displayed in autosearch result
     */
    subtitle: string;
    /**
     * Model object that will be emitted when an item is selected from the autosearch results list
     */
    model: any;
}
