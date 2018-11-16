import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../core/core.module';
import {RouterModule} from '@angular/router';
import {MainNavMenuComponent} from './components/main-nav-menu.component';
import {CustomersNavMenuComponent} from './components/customers-nav-menu/customers-nav-menu.component';
import {MainNavTitleComponent} from './components/main-nav-title/main-nav-title.component';
import {MainNavTemplateComponent} from './components/templates/main-nav-template/main-nav-template.component';
import {CustomerNavRowComponent} from './components/customers-nav-menu/customer-nav-row/customer-nav-row.component';
import {PlansNavMenuComponent} from './components/plans-nav-menu/plans-nav-menu.component';
import {PlanNavRowComponent} from './components/plans-nav-menu/plan-nav-row/plan-nav-row.component';
import {NavRowTemplateComponent} from './components/templates/nav-row-template/nav-row-template.component';
import {NavCategoryRowTemplateComponent} from './components/templates/nav-category-row-template/nav-category-row-template.component';
import {NavSectionRowTemplateComponent} from './components/templates/nav-section-row-template/nav-section-row-template.component';
import {BreadcrumbsComponent} from './components/breadcrumbs/breadcrumbs.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {NavigatorService} from './services/navigator.service';
import {CategoryNavRowComponent} from './components/plans-nav-menu/category-nav-row/category-nav-row.component';
import {SectionNavRowComponent} from './components/plans-nav-menu/section-nav-row/section-nav-row.component';
import {FormsModule} from '@angular/forms';
import {PlanFilterComponent} from 'app/plan/components/plan-filter/plan-filter.component';
import {LogoutComponent} from './components/logout/logout.component';
import {ModalService} from '../ui-controls/services/modal.service';
import {LogoutService} from './services/logout.service';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';
import {NavBarService} from './services/nav-bar.service';
import {BreadcrumbService} from './services/breadcrumb.service';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    FormsModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  declarations: [
    MainNavMenuComponent,
    CustomersNavMenuComponent,
    CustomerNavRowComponent,
    MainNavTitleComponent,
    MainNavTemplateComponent,
    PlansNavMenuComponent,
    PlanNavRowComponent,
    NavRowTemplateComponent,
    NavCategoryRowTemplateComponent,
    NavSectionRowTemplateComponent,
    BreadcrumbsComponent,
    NavBarComponent,
    CategoryNavRowComponent,
    SectionNavRowComponent,
    PlanFilterComponent,
    LogoutComponent
  ],
  exports: [
    MainNavMenuComponent,
    BreadcrumbsComponent,
    NavBarComponent,
    PlanFilterComponent
  ],
  providers: [
    NavigatorService,
    ModalService,
    LogoutService,
    NavBarService,
    BreadcrumbService
  ],
  entryComponents: [
    PlanFilterComponent,
    LogoutComponent
  ]
})
/**
 * Exports class as a ngModule with the above metadata.
 */
export class NavigationModule {
}
