/**
 * Interface which represents highlighting text, currently supports only highlighting a single instance
 * Example:
 *
 * Search Term: iss
 * Text: mississippi
 * Highlighted-Text: mISSissippi (first instance of ISS is highlighted)
 */
export interface IHighlightText {
  /**
   * The text before the highlighting starts
   */
  preText: string;

  /**
   * The text that is highlighted
   */
  text: string;

  /**
   * The text after the highlighting
   */
  postText: string;
}
