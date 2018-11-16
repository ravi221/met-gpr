import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {CommonModule} from '@angular/common';
import {MassUpdateEntryComponent} from './components/mass-update-entry/mass-update-entry.component';
import {MassUpdateLandingComponent} from './components/mass-update-landing/mass-update-landing.component';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';
import {NavigationModule} from '../../navigation/navigation.module';
import {ActivityModule} from 'app/activity/activity.module';
import {UIControlsModule} from 'app/ui-controls/ui-controls.module';
import {PlanSharedModule} from 'app/plan/plan-shared/plan-shared.module';
import {PlanDataEntryModule} from 'app/plan/plan-data-entry/plan-data-entry.module';
import {DynamicFormModule} from '../../dynamic-form/dynamic-form.module';
import {MassUpdateSaveComponent} from './components/mass-update-save/mass-update-save.component';
import {FlagModule} from '../../flag/flag.module';
import {MassUpdateFormComponent} from 'app/dynamic-form/components/mass-update-fom/mass-update-form.component';
import {MassUpdateSelectPlansToolbarComponent} from 'app/plan/mass-update/components/mass-update-select-plans-toolbar/mass-update-select-plans-toolbar.component';
import {MassUpdateSelectPlansTooltipComponent} from 'app/plan/mass-update/components/mass-update-select-plans-tooltip/mass-update-select-plans-tooltip.component';
import {CheckboxComponent} from 'app/forms-controls/components/checkbox/checkbox.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    NavigationModule,
    DynamicFormModule,
    PlanSharedModule,
    ActivityModule,
    UIControlsModule,
    PlanDataEntryModule,
    FlagModule
  ],
  exports: [
    MassUpdateEntryComponent,
    MassUpdateLandingComponent,
    MassUpdateFormComponent,
    PlanDataEntryModule,
    CheckboxComponent,
    MassUpdateSelectPlansTooltipComponent
  ],
  declarations: [
    MassUpdateEntryComponent,
    MassUpdateLandingComponent,
    MassUpdateSaveComponent,
    MassUpdateFormComponent,
    MassUpdateSelectPlansToolbarComponent,
    CheckboxComponent,
    MassUpdateSelectPlansTooltipComponent
  ],
  providers: [MassUpdateDataService
              ],
  entryComponents: [
    MassUpdateFormComponent,
    MassUpdateSelectPlansToolbarComponent,
    CheckboxComponent,
    MassUpdateSelectPlansTooltipComponent,
    MassUpdateLandingComponent
  ]
})
/**
 * Mass Update module to perform mass updates to a customer's plans
 */
export class MassUpdateModule {
}
