import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlanLandingComponent} from './components/plan-landing/plan-landing.component';
import {PlanDataService} from './plan-shared/services/plan-data.service';
import {ViewConfigDataService} from './plan-shared/services/view-config-data.service';
import {PlanListComponent} from './components/plan-list/plan-list.component';
import {CoreModule} from '../core/core.module';
import {NavigationModule} from '../navigation/navigation.module';
import {PlanCategoryListComponent} from './components/plan-category-list/plan-category-list.component';
import {ActivityModule} from 'app/activity/activity.module';
import {FormsModule} from '@angular/forms';
import {PlanContextMenuComponent} from './components/plan-context-menu/plan-context-menu.component';
import {PlanContextMenuService} from './services/plan-context-menu.service';
import {PlanCopyComponent} from './components/plan-copy/plan-copy.component';
import {UIControlsModule} from '../ui-controls/ui-controls.module';
import {PlanInputGridComponent} from './components/plan-input-grid/plan-input-grid.component';
import {PlanCreateComponent} from './components/plan-create/plan-create.component';
import {PlanFilterService} from './services/plan-filter.service';
import {PlanFilterComponent} from 'app/plan/components/plan-filter/plan-filter.component';
import {PlanErrorTooltipComponent} from './components/plan-error-tooltip/plan-error-tooltip.component';

import {HelpDataService} from './services/help-data.service';
import {PlanCategoryLabelStyleService} from './services/plan-category-label-style.service';
import {PlanCategorySectionListComponent} from './components/plan-category-section-list/plan-category-section-list.component';
import {PlanCategorySectionListTemplateComponent} from './components/plan-category-section-list-template/plan-category-section-list-template.component';
import {PlanTerminateComponent} from './components/plan-terminate/plan-terminate.component';
import {PlanInputValidationService} from 'app/plan/services/plan-input-validation.service';
import {MassUpdateModule} from './mass-update/mass-update.module';
import {PlanDataEntryModule} from './plan-data-entry/plan-data-entry.module';
import {PlanSharedModule} from './plan-shared/plan-shared.module';
import { FlagModule } from '../flag/flag.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    NavigationModule,
    FlagModule,
    ActivityModule,
    UIControlsModule,
    MassUpdateModule,
    PlanDataEntryModule,
    PlanSharedModule
  ],
  exports: [
    PlanListComponent,
    PlanContextMenuComponent,
    PlanFilterComponent,
    PlanErrorTooltipComponent,
    MassUpdateModule,
    PlanSharedModule
  ],
  declarations: [
    PlanLandingComponent,
    PlanListComponent,
    PlanCategoryListComponent,
    PlanContextMenuComponent,
    PlanCopyComponent,
    PlanInputGridComponent,
    PlanCreateComponent,
    PlanErrorTooltipComponent,
    PlanCategorySectionListComponent,
    PlanCategorySectionListTemplateComponent,
    PlanTerminateComponent
  ],
  providers: [
    PlanContextMenuService,
    PlanDataService,
    PlanFilterService,
    ViewConfigDataService,
    PlanFilterService,
    HelpDataService,
    PlanCategoryLabelStyleService,
    PlanInputValidationService
  ],
  entryComponents: [
    PlanFilterComponent,
    PlanCopyComponent,
    PlanCreateComponent,
    PlanCategoryListComponent,
    PlanTerminateComponent
  ]
})
/**
 * Exports class as a ngModule with the above metadata.
 */
export class PlanModule {
}
