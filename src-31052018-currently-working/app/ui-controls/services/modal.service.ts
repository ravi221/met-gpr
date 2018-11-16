import {
  ApplicationRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  TemplateRef
} from '@angular/core';
import {isNil, isString} from 'lodash';
import {ModalContainerComponent} from '../components/modal/modal-container/modal-container.component';
import {ModalBackdropComponent} from '../components/modal/modal-backdrop/modal-backdrop.component';
import {IModalConfig} from '../interfaces/iModalConfig';
import {ActiveModalRef, ContentRef, ModalRef} from '../classes/modal-references';
import {ModalContentType} from '../models/modal-content-type';

/**
 * The inputs for a container component
 */
const CONTAINER_OPTIONS = [
  'backdrop',
  'closeOnEsc',
  'size',
  'containerClass',
  'title',
  'displayCloseIcon',
  'closeOnBackdropClick'
];

/**
 * An injectable modal service that creates a modal and returns a {@link ModalRef} instance.
 *
 * With this instance, you can close or dismiss the modal as well as subscribe to each respective observable.
 *
 * If a component type is provided as the content, you can inject the {@link ActiveModalRef} class into that component which allows you to close / dismiss the modal from within that class.
 *
 * Opening up a new modal is pretty simple:
 *
 * ```typescript
 * // you can set custom inputs to resolve into your modal content (only applies to content that is a component type class).
 * const inputs:Map<string,any> = new Map();
 * inputs.set('message', 'Are you sure you want to do this?');
 * // apply other modal options
 * const modalConfig:IModalConfig = {size: 'sm', inputs: inputs};
 *
 * // use the 'open' method to create a new modal reference instance passing in the content and options.
 * const modalRef = this._modalService.open(ModalDefaultComponent, modalConfig);
 *
 * // with the modal reference, you can close, dismiss, and subscribe to close and dismiss events.
 * modalRef.close(someResultData);
 * modalRef.onClose.subscribe((result) => console.info(result)); // should output contents of someResultData object.
 *
 * modalRef.dismiss('Dismissed by user');
 * modalRef.onDismiss.subscribe((reason) => console.info(reason)); // should output 'Dismissed by user'.
 *
 * ```
 *
 * If you provide a component type as content, you can access the reference to the active modal in the component like this:
 *
 * ```typescript
 * // modal content component
 * \@Component({...})
 * export class MyCustomContent {
 *  constructor(private _activeModalRef: ActiveModalRef) {}
 *
 *  closeModal(e): void {
 *    this._activeModalRef.close('Closed from content component');
 *  }
 *
 *  dismissModal(e): void {
 *    this._activeModalRef.dismiss('Dismissed from content component');
 *  }
 * }
 *
 * // in the parent component invoking the modal
 * \@Component({...})
 * export class ParentComponent {
 *  const modalRef = this._modalService.open(MyCustomContent);
 *
 *  modalRef.onClose.subscribe((result) => console.info(result)); // should output 'Closed from content component'.
 *  modalRef.onDismiss.subscribe((reason) => console.info(reason)); // should output 'Dismissed from content component'.
 * }
 *
 * ```
 *
 */
@Injectable()
export class ModalService {

  /**
   * The factory for creating a modal container
   */
  private _containerFactory: ComponentFactory<ModalContainerComponent>;

  /**
   * The factory for creating the backdrop
   */
  private _backdropFactory: ComponentFactory<ModalBackdropComponent>;

  /**
   * Constructs the component factories for backdrop and container components.
   * @param {ApplicationRef} _applicationRef
   * @param {Injector} _injector
   * @param {ComponentFactoryResolver} _componentFactoryResolver
   */
  constructor(private _applicationRef: ApplicationRef,
              private _injector: Injector,
              private _componentFactoryResolver: ComponentFactoryResolver) {
    this._containerFactory = this._componentFactoryResolver.resolveComponentFactory(ModalContainerComponent);
    this._backdropFactory = this._componentFactoryResolver.resolveComponentFactory(ModalBackdropComponent);
  }

  /**
   * Public method to create/open a new modal with the provided content and {@link IModalConfig} options.
   *
   * NOTE: Only if you pass in a component class will it allow you to inject a {@link ActiveModalRef} instance into that class to interact with the modal.
   *
   * @param {ModalContentType} content: Content can be HTML string, TemplateRef, or Component Type
   * @param {IModalConfig} options
   * @returns {ModalRef}
   */
  public open(content: ModalContentType, options: IModalConfig = {}): ModalRef {
    return this._createModal(content, options);
  }

  /**
   * Private method that creates a new modal.
   * @param content
   * @param {IModalConfig} options
   * @returns {ModalRef}
   */
  private _createModal(content: ModalContentType, options: IModalConfig): ModalRef {
    const containerSelector = options.container || 'body';
    const containerElement = document.querySelector(containerSelector);

    if (isNil(containerElement)) {
      throw new Error(`The provided modal container "${containerSelector}" could not be found.`);
    }

    const activeModal = new ActiveModalRef();
    const contentRef = this._getContentRef(content, options, activeModal);

    let containerRef: ComponentRef<ModalContainerComponent>;
    let backdropRef: ComponentRef<ModalBackdropComponent>;
    let modalRef: ModalRef;

    if (options.backdrop !== false) {
      backdropRef = this._backdropFactory.create(this._injector);
      this._applicationRef.attachView(backdropRef.hostView);
      containerElement.appendChild(backdropRef.location.nativeElement);
    }

    containerRef = this._containerFactory.create(this._injector, contentRef.nodes);
    this._applicationRef.attachView(containerRef.hostView);
    containerElement.appendChild(containerRef.location.nativeElement);

    modalRef = new ModalRef(containerRef, backdropRef, contentRef);

    activeModal.close = (result: any) => {
      modalRef.close(result);
    };
    activeModal.dismiss = (reason: any) => {
      modalRef.dismiss(reason);
    };

    this._applyContainerOptions(containerRef.instance, options);

    if (!isNil(options.inputs)) {
      this._applyModalInputs(modalRef.componentInstance, options.inputs);
    }

    return modalRef;
  }

  /**
   * Private method to apply the provided options into the container's component input annotations.
   * @param {ModalContainerComponent} containerInstance
   * @param {IModalConfig} options
   */
  private _applyContainerOptions(containerInstance: ModalContainerComponent, options: IModalConfig): void {
    CONTAINER_OPTIONS.forEach((optionKey: string) => {
      if (!isNil(options[optionKey])) {
        containerInstance[optionKey] = options[optionKey];
      }
    });
  }

  /**
   * Applies the given inputs to the modal instance
   * @param {Component} modalInstance
   * @param {Map<string, any>} inputs
   */
  private _applyModalInputs(modalInstance: Component, inputs: Map<string, any>): void {
    inputs.forEach((value, key) => {
      modalInstance[key] = value;
    });
  }

  /**
   * Private method to build a content reference depending on the type of content that is provided.
   *
   * TODO: Perhaps move this method into utility class so we can use it for other UI implementations.
   *
   * @param content
   * @param {IModalConfig} options
   * @param {ActiveModalRef} modalContext
   * @returns {ContentRef}
   */
  private _getContentRef(content: ModalContentType, options: IModalConfig, modalContext: ActiveModalRef): ContentRef {
    const injector = options.injector || this._injector;
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView(modalContext);
      this._applicationRef.attachView(viewRef);
      return new ContentRef([viewRef.rootNodes], viewRef);
    } else if (isString(content)) {
      const textNodes = document.createTextNode(content);
      return new ContentRef([[textNodes]]);
    } else {
      const contentFactory = this._componentFactoryResolver.resolveComponentFactory(content);
      const contentInjector = Injector.create([{
        provide: ActiveModalRef,
        useValue: modalContext
      }], injector);
      const contentComponentRef = contentFactory.create(contentInjector);
      this._applicationRef.attachView(contentComponentRef.hostView);
      return new ContentRef([[contentComponentRef.location.nativeElement]], contentComponentRef.hostView, contentComponentRef);
    }
  }

}
