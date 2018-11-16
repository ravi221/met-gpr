import {ActivityCardComponent} from './components/activity-card/activity-card.component';
import {ActivityService} from './services/activity.service';
import {ActivityTooltipComponent} from './components/activity-tooltip/activity-tooltip.component';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../core/core.module';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: [
    ActivityCardComponent,
    ActivityTooltipComponent
  ],
  providers: [
    ActivityService
  ],
  exports: [
    ActivityCardComponent,
    ActivityTooltipComponent
  ]
})
export class ActivityModule {
}
