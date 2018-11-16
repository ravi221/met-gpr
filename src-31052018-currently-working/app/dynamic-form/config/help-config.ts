/**
 * Defines help Text  Data
 */
export default class HelpConfig {

  /**
   * Help text to be displayed as tool tip
   */
    public helpText: string;

  /**
   * URL to be displayed as 'more help'
   */
    public helpUrl: string;

  /**
   *
    * @param json  a JSON representation of the HelpConfig
   */
  constructor(json: any) {
    this.helpText = json.helpText;
    this.helpUrl = json.helpUrlText;
  }
}
