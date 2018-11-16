/**
 * Helper class to create a "GUID-like" string to use for temporary uniqueness.
 * NOTE: This is not a true GUID generator so do not persist this information.
 */
export class Guid {

  /**
   * Creates a unique guid
   * @returns {string}
   */
  static create() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char: string) => {
      const rand = Math.floor(Math.random() * 16);
      const value = char === 'x' ? rand : (rand % 4 + 4);
      return value.toString(16);
    });
  }
}
