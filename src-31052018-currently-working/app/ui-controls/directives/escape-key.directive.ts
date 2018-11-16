import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

/**
 * An escape key directive, which fires an event whenever the escape key is pressed
 */
@Directive({
  selector: '[gprEscapeKey]'
})
export class EscapeKeyDirective {

  /**
   * An event emitter called whenever the escape key is pressed
   * @type {EventEmitter<KeyboardEvent>}
   */
  @Output() escapeKeyPress: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  /**
   * Default constructor
   */
  constructor() {
  }

  /**
   * Listens to the document click, and determines if the click was outside the target element
   * @param {Event} event
   */
  @HostListener('document:keydown.escape', ['$event'])
  public onEscapeKeyPress($event: KeyboardEvent) {
    this.escapeKeyPress.emit($event);
  }
}
