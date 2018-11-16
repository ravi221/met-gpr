import DateTime from '../../core/models/date-time';

/**
 * Method used by {@link Entity} class to parse primitive model values based on jsonSchema type that's currently defined.
 * @param {string} type: JsonSchema type
 * @param value: Model value
 * @returns {any}: Parsed value
 */
export default function parseValue(type: string, value: any) {

  if (typeof value === 'undefined' || value === null || value === '') {
    return value;
  }

  switch (type) {
    case 'date-time':
      return new DateTime(value).asString();
    case 'number':
    case 'integer':
      return parseInt(value);
    case 'string':
      return value.toString();
    case 'boolean':
      return ('true' === value.toString());
    default : {
      return value;
    }
  }
}
