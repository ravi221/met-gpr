/**
 * Expression to match a non-customer home page (i.e. `~/customers/12345/abc`).
 * @type {RegExp}
 */
export const CUSTOMER_PATTERN: RegExp = /customers\/([0-9]+)\/([a-z]+)/i;
/**
 * Expression to match plan data entry page URL (i.e. `~/plans/12345/abc`).
 * @type {RegExp}
 */
export const PLAN_PATTERN: RegExp = /plans\/([0-9]+)\/([a-z]+)/i;
