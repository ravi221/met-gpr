/**
 * Each schema field controls the allowed values for a field using
 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.3.3}
 * syntax. Typically these should match the corresponding node in the schema which is used to validate the
 * JSON payloads server-side.
 */
export default class SchemaConfig {
  /**
   * The type of field
   */
  type: string;

  /**
   * A regular expression pattern for matching a string
   */
  pattern?: string;

  /**
   * A message for the format from the pattern
   */
  patternDescription?: string;

  /**
   * A specific format to follow, {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7}
   */
  format?: string;

  /**
   * The minimum length for a string
   */
  minLength?: number;

  /**
   * The maximum length for a string
   */
  maxLength?: number;

  /**
   * The minimum value for a number
   */
  minimum?: number;

  /**
   * The maximum value for a number
   */
  maximum?: number;

  /**
   * Indicates if the minimum is exclusive
   */
  exclusiveMinimum?: boolean;

  /**
   * Indicates if the maximum is exclusive
   */
  exclusiveMaximum?: boolean;

  /**
   * Represents a multiple of a number, must be greater than 0
    */
  multipleOf?: number;

  /**
   * Represents a non-empty array of all schema validations that must be validated as successful
   */
  allOf?: SchemaConfig[];

  /**
   * Represents a non-empty array of all schema validations where at least one needs to be successful
   */
  anyOf?: SchemaConfig[];

  /**
   * Represents a non-empty array of all schema validations where one and only one validation must be successful
   */
  oneOf?: SchemaConfig[];

  /**
   * Inner schema configuration that should validate unsuccessfully
   */
  not?: SchemaConfig;

  /**
   * Determines how child instances validate for arrays
   */
  additionalItems?: boolean | SchemaConfig;

  /**
   * Determines how child instances validate for arrays
   */
  items?: SchemaConfig[];

  /**
   * The maximum amount of items to have, must be greater than 0
   */
  maxItems?: number;

  /**
   * The minimum items to have, must be greater than 0
   */
  minItems?: number;

  /**
   * Determines if all instances must be unique
   */
  uniqueItems?: boolean;

  /**
   * An array of allowable types
   */
  'enum'?: any[];

  /**
   * Creates the schema configuration based on a json object
   * @param json
   */
  constructor(json: any) {
    this.type = json.type;
    this.pattern = json.pattern;
    this.patternDescription = json.patternDescription;
    this.format = json.format;
    this.minLength = json.minLength;
    this.maxLength = json.maxLength;
    this.minimum = json.minimum;
    this.maximum = json.maximum;
    this.exclusiveMaximum = json.exclusiveMaximum;
    this.exclusiveMinimum = json.exclusiveMinimum;
    this.multipleOf = json.multipleOf;
    this.allOf = json.allOf ? new Array<SchemaConfig>(json.allOf) : undefined;
    this.anyOf = json.anyOf ? new Array<SchemaConfig>(json.anyOf) : undefined;
    this.oneOf = json.oneOf ? new Array<SchemaConfig>(json.oneOf) : undefined;
    this.not = json.not ? new SchemaConfig(json.not) : undefined;
    if (json.additionalItems) {
      this.additionalItems = typeof json.additionalItems === 'boolean' ? json.additionalItems : new SchemaConfig(json.additionalItems);
    }
    this.items = json.items ? new Array<SchemaConfig>(json.items) : undefined;
    this.maxItems = json.maxItems;
    this.minItems = json.minItems;
    this.uniqueItems = json.uniqueItems;
    this.enum = json.enum ? json.enum : undefined;
  }
}
