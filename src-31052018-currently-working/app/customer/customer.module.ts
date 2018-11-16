import {ActivityModule} from 'app/activity/activity.module';
import {CoreModule} from '../core/core.module';
import {CustomerContextMenuComponent} from './components/customer-context-menu/customer-context-menu.component';
import {CustomerDataService} from './services/customer-data.service';
import {CustomerInformationEntryComponent} from './components/customer-information-entry/customer-information-entry.component';
import {CustomerInformationLandingComponent} from './components/customer-information-landing/customer-information-landing.component';
import {CustomerLandingBannerComponent} from './components/customer-landing/customer-landing-banner/customer-landing-banner.component';
import {CustomerLandingButtonsComponent} from './components/customer-landing/customer-landing-buttons/customer-landing-buttons.component';
import {CustomerLandingComponent} from './components/customer-landing/customer-landing.component';
import {CustomerListComponent} from './components/customer-list/customer-list.component';
import {MainLandingComponent} from './components/main-landing/main-landing.component';
import {NavigationModule} from '../navigation/navigation.module';
import {NgModule} from '@angular/core';
import {PlanModule} from '../plan/plan.module';
import {CustomerStructureDataService} from './services/customer-structure-data.service';
import {CustomerLandingService} from './services/customer-landing.service';
import { FlagModule } from '../flag/flag.module';
import { CommentModule } from '../comment/comment.module';

@NgModule({
  imports: [
    ActivityModule,
    CoreModule,
    NavigationModule,
    PlanModule,
    FlagModule,
    CommentModule
  ],
  exports: [
    CustomerListComponent
  ],
  declarations: [
    CustomerContextMenuComponent,
    CustomerInformationEntryComponent,
    CustomerInformationLandingComponent,
    CustomerLandingBannerComponent,
    CustomerLandingButtonsComponent,
    CustomerLandingComponent,
    CustomerListComponent,
    MainLandingComponent
  ],
  providers: [
    CustomerDataService,
    CustomerLandingService,
    CustomerStructureDataService,
  ]
})
/**
 * Exports class as a ngModule with the above metadata.
 */
export class CustomerModule {
}
