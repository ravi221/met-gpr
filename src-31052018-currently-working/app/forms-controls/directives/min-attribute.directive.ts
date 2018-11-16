import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';

/**
 * This directive is used to add a min attribute to dynamically generated inputs of type number
 */
@Directive({
  selector: '[gprMinAttribute]'
})
export class MinAttributeDirective implements OnInit {

  /**
   * The type of input of the host element
   */
    // tslint:disable-next-line
  @Input('gprMinAttribute') inputType: string;

  /**
   * Get copies of elementRef and renderer2 to access and modify the host element
   * @param {ElementRef} _el
   * @param {Renderer2} _renderer
   */
  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  /**
   * Check the type of the input and add the min attribute if it is of type number
   */
  ngOnInit() {
    if (this.inputType && this.inputType === 'number') {
      this._renderer.setAttribute(this._el.nativeElement, 'min', '0');
    }
  }
}
