/**
 * Enumeration to represent the possible operators for rSQL values
 */
export enum RsqlOperators {
  EQUAL = '==',
  NOT_EQUAL = '!=',
  LESS_THAN = '<',
  LESS_THAN_OR_EQUAL = '<=',
  GREATER_THAN = '>',
  GREATER_THAN_OR_EQUAL = '>=',
  IN = '=in=',
  OUT = '=out=',
  AND = ';',
  OR = ','
}
