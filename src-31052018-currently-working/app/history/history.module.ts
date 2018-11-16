import {CommonModule} from '@angular/common';
import {CoreModule} from '../core/core.module';
import {FormsModule} from '@angular/forms';
import {HistoryFilterComponent} from './components/history-filter/history-filter.component';
import {HistoryFilterService} from './services/history-filter.service';
import {HistoryHeadingComponent} from './components/history-heading/history-heading.component';
import {HistoricalAttributeComponent} from './components/historical-attribute/historical-attribute.component';
import {HistoryLandingComponent} from './components/history-landing/history-landing.component';
import {NavigationModule} from '../navigation/navigation.module';
import {NgModule} from '@angular/core';
import {UIControlsModule} from '../ui-controls/ui-controls.module';
import {HistoryService} from './services/history.service';
import {HistoricalPlanListComponent} from './components/historical-plan-list/historical-plan-list.component';
import {HistoricalVersionListComponent} from './components/historical-version-list/historical-version-list.component';
import {HistoricalAttributeItemComponent} from './components/historical-attribute-item/historical-attribute-item.component';
import {FormControlsModule} from '../forms-controls/form-controls.module';
import { FlagModule } from '../flag/flag.module';
import { CommentModule } from '../comment/comment.module';
import {HistoricalPlanComponent} from './components/historical-plan/historical-plan.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    FormControlsModule,
    NavigationModule,
    FlagModule,
    CommentModule,
    UIControlsModule
  ],
  providers: [HistoryFilterService, HistoryService],
  declarations: [
    HistoricalAttributeComponent,
    HistoricalAttributeItemComponent,
    HistoricalPlanComponent,
    HistoricalPlanListComponent,
    HistoricalVersionListComponent,
    HistoryFilterComponent,
    HistoryHeadingComponent,
    HistoryLandingComponent
  ],
  entryComponents: [
    HistoryFilterComponent
  ],
  exports: [HistoryFilterComponent],
})

export class HistoryModule {
}
