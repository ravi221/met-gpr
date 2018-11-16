import {ActivityModule} from '../../activity/activity.module';
import {NgModule} from '@angular/core';
import {UIControlsModule} from '../../ui-controls/ui-controls.module';
import {CoreModule} from '../../core/core.module';
import {FormsModule} from '@angular/forms';
import {NavigationModule} from '../../navigation/navigation.module';
import {CommonModule} from '@angular/common';
import {ValidatePlanComponent} from './components/validate-plan/validate-plan.component';
import {ValidatePlanService} from './services/validate-plan.service';
import {ViewConfigDataService} from './services/view-config-data.service';
import {PlanDataService} from './services/plan-data.service';
import {ValidationErrorReportComponent} from './components/validation-error-report/validation-error-report.component';
import { FlagModule } from '../../flag/flag.module';
import {PlanEntryNavigationButtonComponent} from './components/plan-entry-navigation-button/plan-entry-navigation-button.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    NavigationModule,
    FlagModule,
    ActivityModule,
    UIControlsModule,
  ],
  exports: [
    ValidatePlanComponent,
    ValidationErrorReportComponent,
    PlanEntryNavigationButtonComponent
  ],
  declarations: [
    ValidatePlanComponent,
    ValidationErrorReportComponent,
    PlanEntryNavigationButtonComponent
  ],
  providers: [
    ValidatePlanService,
    ViewConfigDataService,
    PlanDataService
  ],
  entryComponents: [
    ValidatePlanComponent
  ]
})
export class PlanSharedModule {

}
