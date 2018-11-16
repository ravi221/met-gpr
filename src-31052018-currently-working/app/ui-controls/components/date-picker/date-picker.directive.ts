import {Directive, ElementRef, HostListener} from '@angular/core';

/**
 * A directive to convert a value to a date
 */
@Directive({
  selector: '[gprValueAsDate]'
})
export class ValueAsDateDirective {

  /**
   * The allowable regex values for a date
   * @type {[string , string , string , string , string , string , string , string , string , string]}
   */
  regex: string[] = [
    '\\d{1}',
    '\\d{2}',
    '\\d{2}[-\/]',
    '\\d{2}[-\/]\\d{1}',
    '\\d{2}[-\/]\\d{2}',
    '\\d{2}[-\/]\\d{2}[-\/]',
    '\\d{2}[-\/]\\d{2}[-\/]\\d{1}',
    '\\d{2}[-\/]\\d{2}[-\/]\\d{2}',
    '\\d{2}[-\/]\\d{2}[-\/]\\d{3}',
    '\\d{2}[-\/]\\d{2}[-\/]\\d{4}'
  ];

  /**
   * The allowable keys to be used with this directive
   * @type {[string , string , string , string , string , string , string]}
   */
  private specialKeys: Array<string> = ['Backspace', 'Delete', 'Tab', 'End', 'Home', '-', '/'];

  /**
   * Creates the directive
   * @param {ElementRef} el
   */
  constructor(private el: ElementRef) {
  }

  /**
   * Function called whenever a keydown event is emitted
   * @param {KeyboardEvent} event
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    const regex = this.regex[next.length - 1];
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }
}
