import {AuthorizationService} from 'app/core/services/authorization.service';
import {BuildVersionComponent} from './components/build-version/build-version.component';
import {BuildVersionService} from './services/build-version.service';
import {CommonModule} from '@angular/common';
import {DateService} from './services/date.service';
import {FilterBarComponent} from './components/filter-bar/filter-bar.component';
import {FilterChipsComponent} from './components/filter-chips/filter-chips.component';
import {FilterLinksComponent} from './components/filter-links/filter-links.component';
import {FilterLinkService} from './services/filter-link.service';
import {FilterMenuComponent} from './components/filter-menu/filter-menu.component';
import {FilterService} from './services/filter.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpInterceptorService} from './services/http-interceptor.service';
import {LogService} from './services/log.service';
import {NgModule} from '@angular/core';
import {NotificationService} from './services/notification.service';
import {PageAccessService} from './services/page-access.service';
import {ProductDataService} from './services/product-data.service';
import {QuickLinksComponent} from './components/quick-links/quick-links.component';
import {RsqlMapperService} from './services/rsql-mapper.service';
import {SortMenuComponent} from './components/sort-menu/sort-menu.component';
import {SortOptionsService} from './services/sort-options.service';
import {SortWithComparatorPipe} from './pipes/sort-with-comparator.pipe';
import {UIControlsModule} from '../ui-controls/ui-controls.module';
import {UserPreferencesService} from './services/user-preferences.service';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {UserTooltipComponent} from 'app/core/components/user-tooltip/user-tooltip.component';
import {ValuesPipe} from './pipes/values.pipe';
import {VendorModule} from '../vendor/vendor.module';
import {ProductDropDownComponent} from './components/product-drop-down/product-drop-down.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    UIControlsModule,
    VendorModule
  ],
  declarations: [
    BuildVersionComponent,
    FilterBarComponent,
    FilterChipsComponent,
    FilterLinksComponent,
    FilterMenuComponent,
    ProductDropDownComponent,
    QuickLinksComponent,
    SortMenuComponent,
    SortWithComparatorPipe,
    UserTooltipComponent,
    ValuesPipe
  ],
  entryComponents: [
    FilterMenuComponent
  ],
  exports: [
    BuildVersionComponent,
    CommonModule,
    FilterBarComponent,
    FilterChipsComponent,
    FilterLinksComponent,
    FilterMenuComponent,
    ProductDropDownComponent,
    QuickLinksComponent,
    SortMenuComponent,
    SortWithComparatorPipe,
    UIControlsModule,
    UserTooltipComponent,
    ValuesPipe,
    VendorModule
  ],
  providers: [
    AuthorizationService,
    BuildVersionService,
    DateService,
    FilterLinkService,
    FilterService,
    LogService,
    NotificationService,
    PageAccessService,
    ProductDataService,
    RsqlMapperService,
    SortOptionsService,
    SortOptionsService,
    SortWithComparatorPipe,
    UserPreferencesService,
    UserProfileService,
    ValuesPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
  ]
})
/**
 * Exports class as a ngModule with the above metadata.
 */
export class CoreModule {
}
