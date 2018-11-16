import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import {ModalDismissReasons} from '../../../enums/modal-dismiss-reasons';

/**
 * A component class that serves as the wrapping container for the modal content. *
 * This class is responsible for handling the click event of the backdrop click and ESC key press.
 */
@Component({
  selector: 'gpr-modal-container',
  template: `
    <div class="modal fade show {{containerClass ? containerClass : ''}}">
      <div [class]="'modal-dialog' + (size ? ' modal-' + size : '')">
        <div class="modal-content">
          <header *ngIf="title" class="modal-header">
            <h1 class="modal-heading">{{title}}</h1>
            <gpr-icon *ngIf="displayCloseIcon" [name]="'close-modal'" (click)="onCloseClick()" class="close-icon"></gpr-icon>
          </header>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../modal.scss']
})
export class ModalContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Indicates whether we have a backdrop defined (defaults to 'static' which means modal cannot be dismissed by clicking on the backdrop).
   * @type {string}
   */
  @Input() backdrop: boolean | string = 'static';

  /**
   * Indicates whether pressing 'ESC' key will dismiss the modal.
   * @type {boolean}
   */
  @Input() closeOnEsc: boolean = false;

  /**
   * Indicates whether clicking off the modal will dismiss the modal
   * @type {boolean}
   */
  @Input() closeOnBackdropClick: boolean = false;

  /**
   * The size of the modal.
   */
  @Input() size: string;

  /**
   * Custom CSS class to apply to the container element.
   */
  @Input() containerClass: string;

  /**
   * The title for the modal
   * @type {string}
   */
  @Input() title: string = '';

  /**
   * By default, display the close icon
   * @type {boolean}
   */
  @Input() displayCloseIcon: boolean = true;

  /**
   * Emits the dismissal event of the modal (either by clicking on backdrop or pressing ESC key).
   * @type {EventEmitter<any>}
   */
  @Output() onDismiss: EventEmitter<ModalDismissReasons> = new EventEmitter();

  /**
   * Determines if the modal is able to be reached with the tab key
   * @type {string}
   * @private
   */
  @HostBinding('tabindex')
  private _tabIndex = '-1';

  /**
   * The element to focus on after modal has opened.
   */
  private _focusedElement: Element;

  /**
   * The container element that sits around the modal content.
   */
  private _containerElement: Element;

  /**
   * Creates the modal contains
   * @param {ElementRef} _elementRef
   * @param {Renderer2} _renderer
   */
  constructor(private _elementRef: ElementRef,
              private _renderer: Renderer2) {
  }

  /**
   * Set the focused element to currently active element and apply class to body element.
   */
  ngOnInit(): void {
    this._focusedElement = document.activeElement;
    this._renderer.addClass(document.body, 'modal-open');
  }

  /**
   * If this element does not contain the activeElement, than focus on this element.
   */
  ngAfterViewInit(): void {
    if (!this._elementRef.nativeElement.contains(document.activeElement)) {
      this._elementRef.nativeElement['focus'].apply(this._elementRef.nativeElement, []);
    }
    this._containerElement = this._elementRef.nativeElement.children[0];
  }

  /**
   * When modal is dismissed, either focus on the previously active element or body and remove class from body element.
   */
  ngOnDestroy(): void {
    const body = document.body;
    const focusedElement = this._focusedElement;
    let elementToFocus;
    if (focusedElement && focusedElement['focus'] && body.contains(focusedElement)) {
      elementToFocus = focusedElement;
    } else {
      elementToFocus = body;
    }

    elementToFocus['focus'].apply(elementToFocus, []);

    this._focusedElement = null;
    this._renderer.removeClass(body, 'modal-open');
  }

  /**
   * Handles the event when backdrop is clicked.
   * @param $event
   */
  @HostListener('click', ['$event'])
  public backdropClicked($event): void {
    if (this.closeOnBackdropClick && this.backdrop === true && this._containerElement === $event.target) {
      this._emitDismiss(ModalDismissReasons.BACKDROP_CLICKED);
    }
  }

  /**
   * Handles the event when ESC key is pressed.
   * @param $event
   */
  @HostListener('keyup.esc', ['$event'])
  public escKeyPressed($event): void {
    if (this.closeOnEsc && !$event.defaultPrevented) {
      this._emitDismiss(ModalDismissReasons.ESC_KEY_PRESSED);
    }
  }

  /**
   * Handles when the close icon is clicked
   */
  public onCloseClick(): void {
    this._emitDismiss(ModalDismissReasons.CLOSE_ICON_CLICKED);
  }


  /**
   * Emits dismiss event.
   * @param {ModalDismissReasons} reason
   */
  private _emitDismiss(reason: ModalDismissReasons): void {
    this.onDismiss.emit(reason);
  }
}
