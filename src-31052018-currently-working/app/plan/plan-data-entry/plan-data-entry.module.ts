import {NgModule} from '@angular/core';
import {CoreModule} from '../../core/core.module';
import {FormsModule} from '@angular/forms';
import {NavigationModule} from '../../navigation/navigation.module';
import {CommonModule} from '@angular/common';
import {PlanDataEntryComponent} from './components/plan-data-entry/plan-data-entry.component';
import {AutoSaveComponent} from './components/auto-save/auto-save.component';
import {ActivityModule} from '../../activity/activity.module';
import {UIControlsModule} from '../../ui-controls/ui-controls.module';
import {PlanDataEntryService} from './services/plan-data-entry.service';
import {PlanSharedModule} from '../plan-shared/plan-shared.module';
import {DynamicFormModule} from '../../dynamic-form/dynamic-form.module';
import { FlagModule } from '../../flag/flag.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    DynamicFormModule,
    NavigationModule,
    FlagModule,
    ActivityModule,
    UIControlsModule,
    PlanSharedModule
  ],
  exports: [
    AutoSaveComponent
  ],
  declarations: [
    PlanDataEntryComponent,
    AutoSaveComponent
  ],
  providers: [
    PlanDataEntryService
  ]
})
export class PlanDataEntryModule {

}
