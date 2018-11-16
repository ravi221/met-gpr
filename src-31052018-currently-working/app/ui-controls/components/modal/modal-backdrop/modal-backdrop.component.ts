import {Component} from '@angular/core';

/**
 * A modal backdrop component class to display backdrop when modal is invoked.
 *
 * TODO: This can perhaps to made to be more generic as a backdrop for other components to use. i.e. {@link SlideMenuComponent}.
 */
@Component({
  selector: 'gpr-modal-backdrop',
  template: '<div class="modal-backdrop fade show"></div>',
  styleUrls: ['../modal.scss']
})
export class ModalBackdropComponent {
}
