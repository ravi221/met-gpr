import {ScrollEventOrigin} from 'app/ui-controls/enums/scroll-event-origin';

/**
 * Interface that defines data that will be sent to subscribers of Navigation Scroll Events
 */
export interface IScrollEvent {
    /**
     * Event object where the scroll event took place
     */
    eventElement?: any;
    /**
     * Calculated field that informs subscribes if the scroll bar is near the bottom of the container
     */
    isNearBottom?: boolean;
    /**
     * Where the scroll event originated from
    */
    eventOrigin?: ScrollEventOrigin;
    /**
     * Number of pixels to offset from the bottom of the scroll window
     */
    bottomThreshold?: number;
}
