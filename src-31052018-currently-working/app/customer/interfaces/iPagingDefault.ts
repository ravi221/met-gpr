/**
 * Represents the configurable default data needed for paging
 */
export class IPagingDefaultOptions {
    /**
     * Most recent page number within the context of the items being paged
     */
    page: number;
    /**
     * Number of items per page
     */
    pageSize: number;
    /**
     * Number of pages displayed when paging
     */
    viewWindowPages: number;
}

