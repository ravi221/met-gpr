import { CoreModule } from 'app/core/core.module';
import { NgModule } from '@angular/core';
import { NavigationModule } from 'app/navigation/navigation.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalContainerComponent } from 'app/ui-controls/components/modal/modal-container/modal-container.component';
import { FlagService } from 'app/flag/services/flag.service';
import { FlagFilterService } from 'app/flag/services/flag-filter.service';
import { FlagLandingComponent } from 'app/flag/components/flag-landing/flag-landing.component';
import { FlagListComponent } from 'app/flag/components/flag-list/flag-list.component';
import { FlaggedPlanComponent } from 'app/flag/components/flagged-plan/flagged-plan.component';
import { FlagItemComponent } from 'app/flag/components/flag-item/flag-item.component';
import { FlagCardComponent } from 'app/flag/components/flag-card/flag-card.component';
import { FlagResolverPopupComponent } from 'app/flag/components/flag-resolver-popup/flag-resolver-popup.component';
import { FlagCreateTooltipComponent } from 'app/flag/components/flag-create-tooltip/flag-create-tooltip.component';
import { FlagResolverTooltipComponent } from 'app/flag/components/flag-resolver-tooltip/flag-resolver-tooltip.component';
import { FlagFilterComponent } from 'app/flag/components/flag-filter/flag-filter.component';
import { CommentService } from '../comment/services/comment.service';

/**
 * Exports class as a ngModule with the above metadata.
 */

@NgModule({
    imports: [
      CoreModule,
      NavigationModule,
      CommonModule,
      FormsModule
    ],
    providers: [
      FlagService,
      FlagFilterService,
      CommentService
    ],
    declarations: [
      FlagLandingComponent,
      FlagListComponent,
      FlaggedPlanComponent,
      FlagItemComponent,
      FlagCardComponent,
      FlagResolverPopupComponent,
      FlagCreateTooltipComponent,
      FlagResolverTooltipComponent,
      FlagFilterComponent
    ],
    exports: [
      FlagCardComponent,
      FlagFilterComponent
    ],
    entryComponents: [
      FlagResolverPopupComponent,
      FlagFilterComponent
    ]
  })
export class FlagModule {
}
