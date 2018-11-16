import {AddRemoveListComponent} from './components/add-remove-list/add-remove-list.component';
import {AddRemoveListControlComponent} from './components/add-remove-list-control/add-remove-list-control.component';
// import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {CommonModule} from '@angular/common';
import {DatePickerControlComponent} from './components/date-picker-control/date-picker-control.component';
import {DropDownComponent} from './components/drop-down/drop-down.component';
import {DropDownControlComponent} from './components/drop-down-control/drop-down-control.component';
import {DynamicFormControlComponent} from './components/dynamic-form-control/dynamic-form-control.component';
import {FormControlClassProviderService} from './services/form-control-class-provider.service';
import {MinAttributeDirective} from './directives/min-attribute.directive';
import {NgModule} from '@angular/core';
import {RadioButtonComponent} from './components/radio-button/radio-button.component';
import {ReactiveFormsModule} from '@angular/forms';
import {StaticTextComponent} from './components/static-text/static-text.component';
import {TabsComponent} from './components/tabs/tabs.component';
import {TabsControlComponent} from './components/tabs-control/tabs-control.component';
import {TabsWithRadioComponent} from './components/tabs-with-radio/tabs-with-radio.component';
import {TextInputComponent} from './components/text-input/text-input.component';
import {UIControlsModule} from '../ui-controls/ui-controls.module';
import {TabsWithRadioControlComponent} from './components/tabs-with-radio-control/tabs-with-radio-control.component';

/**
 * Module for form controls
 */
@NgModule({
  imports: [
    CommonModule,
    UIControlsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AddRemoveListComponent,
    AddRemoveListControlComponent,
    // CheckboxComponent,
    DatePickerControlComponent,
    DropDownComponent,
    DropDownControlComponent,
    DynamicFormControlComponent,
    MinAttributeDirective,
    RadioButtonComponent,
    StaticTextComponent,
    TabsComponent,
    TabsControlComponent,
    TabsWithRadioComponent,
    TabsWithRadioControlComponent,
    TextInputComponent,
  ],
  entryComponents: [
    AddRemoveListComponent,
    // CheckboxComponent,
    DatePickerControlComponent,
    DropDownComponent,
    DropDownControlComponent,
    RadioButtonComponent,
    StaticTextComponent,
    TabsComponent,
    TabsControlComponent,
    TabsWithRadioComponent,
    TextInputComponent
  ],
  exports: [
    DropDownComponent,
    DynamicFormControlComponent,
    TabsComponent,
    TabsWithRadioComponent
  ],
  providers: [FormControlClassProviderService]
})
export class FormControlsModule {
}
