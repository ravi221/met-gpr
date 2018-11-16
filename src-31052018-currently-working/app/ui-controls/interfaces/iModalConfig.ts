import {Injector} from '@angular/core';

/**
 * Describes the shape of the modal options to be passed into {@link ModalService} when creating a new modal.
 */
export interface IModalConfig {
  /**
   * Whether a backdrop element should be created for a given modal (true by default).
   * Alternatively, specify 'static' for a backdrop which doesn't close the modal on click.
   */
  backdrop?: boolean | 'static';

  /**
   * An element to which to attach newly opened modal windows.
   */
  container?: string;

  /**
   * Injector to use for modal content.
   */
  injector?: Injector;

  /**
   * Whether to close the modal when escape key is pressed (true by default).
   */
  closeOnEsc?: boolean;

  /**
   * Size of a new modal window.
   */
  size?: 'sm' | 'med' | 'lg';

  /**
   * Custom class to append to the modal container.
   */
  containerClass?: string;

  /**
   * Map of inputs to be passed into component class that's used as the modal content.
   */
  inputs?: Map<string, any>;

  /**
   * The title of the modal
   */
  title?: string;

  /**
   * Indicates if to display the close icon for the modal
   */
  displayCloseIcon?: boolean;

  /**
   * Indicates if the user can click off the modal to dismiss
   */
  closeOnBackdropClick?: boolean;
}
