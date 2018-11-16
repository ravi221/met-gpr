import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

/**
 * An outside click directive, which fires an event whenever the document is clicked outside of the target element
 */
@Directive({
  selector: '[gprOutsideClick]'
})
export class OutsideClickDirective {

  /**
   * An optional selector to specifically query for an element
   * @type {string}
   */
  @Input() selector: string = '';

  /**
   * An event emitter called whenever an outside click has occurred
   * @type {EventEmitter<Event>}
   */
  @Output() outsideClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Get copies of elementRef and renderer2 to access and modify the host element
   * @param {ElementRef} _el
   */
  constructor(private _el: ElementRef) {
  }

  /**
   * Listens to the document click, and determines if the click was outside the target element
   * @param {Event} event
   */
  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: Event): void {
    const target = this._getTargetElement();
    const isOutsideClick = !target.contains(event.target);
    if (isOutsideClick) {
      this.outsideClick.emit();
    }
  }

  /**
   * Gets the target element to check against if the click is outside
   * @returns {any}
   * @private
   */
  private _getTargetElement(): any {
    if (this.selector === '') {
      return this._el.nativeElement;
    }
    return this._el.nativeElement.querySelector(this.selector);
  }
}
