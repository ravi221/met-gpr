import {Component} from '@angular/core';

/**
 * A customer information data entry component class that manages data entry of customer specific information.
 *
 * TODO: This component may end up using the {@link DynamicFormComponent} module to render it's internals.
 */
@Component({
  selector: 'gpr-customer-information-entry',
  template: `
    <gpr-breadcrumbs></gpr-breadcrumbs>
    <div class="banner">
      <h4><strong>Placeholder Category Name</strong></h4>
    </div>
  `,
  styleUrls: []
})
export class CustomerInformationEntryComponent {

}
