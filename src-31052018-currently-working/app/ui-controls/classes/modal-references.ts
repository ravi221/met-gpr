import {ComponentRef, ViewRef} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ModalContainerComponent} from '../components/modal/modal-container/modal-container.component';
import {ModalBackdropComponent} from '../components/modal/modal-backdrop/modal-backdrop.component';
import {Observable} from 'rxjs/Observable';

/**
 * Holds the reference to the content provided in the modal.
 */
export class ContentRef {

  /**
   * Creates the content reference
   * @param nodes The list of nodes to create
   * @param viewRef A reference to the view
   * @param componentRef A reference to the component
   */
  constructor(public nodes: any[],
              public viewRef?: ViewRef,
              public componentRef?: ComponentRef<any>) {
  }
}

/**
 * Holds the reference to an active modal. This instance can be injected into the componentRef that's used as the modal's content.
 */
export class ActiveModalRef {
  /**
   * Method to close the active modal with optional result.
   * @param result
   */
  close(result?: any): void {
  }

  /**
   * Method to dismiss the active modal with optional reason.
   * @param reason
   */
  dismiss(reason?: any): void {
  }
}

/**
 * This is the reference to newly created modal. This is what is returned by the {@link ModalService} upon creating a new modal.
 */
export class ModalRef {

  /**
   * Close subject to watch as an observable
   */
  private _onCloseSubject: Subject<any> = new Subject();

  /**
   * Dismiss subject to watch as an observable
   * @type {Subject<any>}
   * @private
   */
  private _onDismissSubject: Subject<any> = new Subject();

  /**
   * Returns the instance of the component that was used as the modal content (read-only).
   * @returns {any}
   */
  get componentInstance(): any {
    if (this._contentRef.componentRef) {
      return this._contentRef.componentRef.instance;
    }
  }

  /**
   * The on close observable
   * @type {Observable<any>}
   */
  onClose: Observable<any> = this._onCloseSubject.asObservable();

  /**
   * The on dismiss observable
   * @type {Observable<any>}
   */
  onDismiss: Observable<any> = this._onDismissSubject.asObservable();

  /**
   * Constructs the modal reference and subscribes to the {@link ModalContainerComponent} onDismiss event emitter.
   * @param {ComponentRef<ModalContainerComponent>} _containerRef
   * @param {ComponentRef<ModalBackdropComponent>} _backdropRef
   * @param {ContentRef} _contentRef
   */
  constructor(private _containerRef: ComponentRef<ModalContainerComponent>, private _backdropRef: ComponentRef<ModalBackdropComponent>, private _contentRef: ContentRef) {
    this._containerRef.instance.onDismiss.subscribe((reason: any) => this.dismiss(reason));
  }

  /**
   * Method to close the modal and do some clean-up.
   * @param result
   */
  close(result?: any): void {
    if (this._containerRef) {
      this._onCloseSubject.next(result);
      this._cleanUp();
    }
  }

  /**
   * Method to dismiss a modal and do some clean-up.
   * @param reason
   */
  dismiss(reason?: any): void {
    if (this._containerRef) {
      this._onDismissSubject.next(reason);
      this._cleanUp();
    }
  }

  /**
   * Method to remove modal elements from DOM and destroy all component references.
   * @private
   */
  private _cleanUp() {
    const containerElement = this._containerRef.location.nativeElement;
    if (containerElement.parentNode) {
      containerElement.parentNode.removeChild(containerElement);
    }
    this._containerRef.destroy();

    if (this._backdropRef) {
      const backdropElement = this._backdropRef.location.nativeElement;
      if (backdropElement.parentNode) {
        backdropElement.parentNode.removeChild(backdropElement);
      }
      this._backdropRef.destroy();
    }

    if (this._contentRef && this._contentRef.viewRef) {
      this._contentRef.viewRef.destroy();
    }

    this._containerRef = null;
    this._backdropRef = null;
    this._contentRef = null;

    this._onCloseSubject.complete();
    this._onDismissSubject.complete();
  }
}
