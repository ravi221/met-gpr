/**
 * Represents the data needed for paging
 */
export interface IPaging {
    /**
     * Most recent page number within the context of the items being paged
     */
    page: number;
    /**
     * Total number of possible result items that can be returned within the context of the items being paged
     */
    totalCount: number;
    /**
     * Number of items per page
     */
    pageSize: number;
    // Calculated fields
    /**
     * Direction of paging/scrolling
     */
    direction: string;
    /**
     * Number of pages displayed when paging
     */
    viewWindowPages: number;
    /**
     * Number of items displayed when paging
     */
    viewWindowItems: number;
    /**
     * Start Index of the view window being displayed
     */
    viewWindowStartIndex: number;
    /**
     * Maximum start index that the view window can be set to
     */
    viewWindowMaxStartIndex: number;
    /**
     * End index of the view window being displayed
     */
    viewWindowEndIndex: number;
    /**
     * Pages retrieved at the current point in time
     */
    pagesRetrieved: number;
}

