/**
 * Class used to help with browser specific tasks
 */
export class BrowserHelper {
    /**
     * Returns true if client is using Internet Explorer otherwise false.
     */
    public static isIE(): boolean {
        return BrowserHelper.getIEVersion() > 0;
    }
    /**
     * Method returns version of IE the client is running. Will return 0 if not IE.
     */
    public static getIEVersion(): number {
        const sAgent = window.navigator.userAgent;
        const index = sAgent.indexOf('MSIE');
        // If IE, return version number.
        if (index > 0) {
            return parseInt(sAgent.substring(index + 5, sAgent.indexOf('.', index)));
        } else if (!!navigator.userAgent.match(/Trident\/7\./)) {
            // If IE 11 then look for Updated user agent string.
            return 11;
        } else {
            return 0; // It is not IE
        }
    }
}
