import {AttributeSearchService} from './services/attribute-search.service';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../core/core.module';
import {CustomerModule} from '../customer/customer.module';
import {CustomerSearchService} from './services/customer-search.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavigationModule} from '../navigation/navigation.module';
import {NgModule} from '@angular/core';
import {PlanSearchService} from './services/plan-search.service';
import {SearchAttributeDetailsListComponent} from './components/search-results/attribute-details-list/attribute-details-list.component';
import {SearchAttributeDetailsListItemComponent} from './components/search-results/attribute-details-list-item/attribute-details-list-item.component';
import {SearchAttributeListComponent} from './components/search-results/attribute-list/attribute-list.component';
import {SearchAttributeListItemComponent} from './components/search-results/attribute-list-item/attribute-list-item.component';
import {SearchBarComponent} from './components/search-bar/search-bar.component';
import {SearchChoicesService} from './services/search-choices.service';
import {SearchCustomerListComponent} from './components/search-results/customer-list/customer-list.component';
import {SearchCustomerListItemComponent} from './components/search-results/customer-list-item/customer-list-item.component';
import {SearchLandingComponent} from './components/search-landing/search-landing.component';
import {SearchOptionsBarComponent} from './components/search-options-bar/search-options-bar.component';
import {SearchOverlayComponent} from './components/search-overlay/search-overlay.component';
import {SearchPageComponent} from './components/search-page/search-page.component';
import {SearchPlanListComponent} from './components/search-results/plan-list/plan-list.component';
import {SearchPlanListItemComponent} from './components/search-results/plan-list-item/plan-list-item.component';
import {SearchResultComponent} from './components/search-results/search-result/search-result.component';
import {SearchResultListComponent} from './components/search-results/search-result-list/search-result-list.component';
import {SearchResultListService} from './services/search-result-list.service';
import {SearchResultTitleComponent} from './components/search-results/search-result-title/search-result-title.component';
import {SearchResultTitleService} from './services/search-result-title.service';
import {SearchService} from './services/search.service';
import {SearchSortComponent} from './components/search-sort/search-sort.component';
import {SearchSortService} from './services/search-sort.service';
import {SearchStateService} from './services/search-state.service';
import {SearchTitleComponent} from './components/search-title/search-title.component';
import {SearchTitleService} from './services/search-title.service';
import {SearchUserBarComponent} from './components/search-user-bar/search-user-bar.component';
import {UserSearchService} from './services/user-search.service';
import {SearchBarService} from './services/search-bar.service';
import {FormControlsModule} from '../forms-controls/form-controls.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    CustomerModule,
    FormsModule,
    NavigationModule,
    ReactiveFormsModule,
    FormControlsModule
  ],
  declarations: [
    SearchAttributeDetailsListComponent,
    SearchAttributeDetailsListItemComponent,
    SearchAttributeListComponent,
    SearchAttributeListItemComponent,
    SearchBarComponent,
    SearchCustomerListComponent,
    SearchCustomerListItemComponent,
    SearchLandingComponent,
    SearchOptionsBarComponent,
    SearchOverlayComponent,
    SearchPageComponent,
    SearchPlanListComponent,
    SearchPlanListItemComponent,
    SearchResultComponent,
    SearchResultListComponent,
    SearchResultListComponent,
    SearchResultTitleComponent,
    SearchSortComponent,
    SearchTitleComponent,
    SearchUserBarComponent
  ],
  exports: [
    SearchAttributeDetailsListComponent,
    SearchAttributeDetailsListItemComponent,
    SearchAttributeListComponent,
    SearchAttributeListItemComponent,
    SearchBarComponent,
    SearchCustomerListComponent,
    SearchCustomerListItemComponent,
    SearchLandingComponent,
    SearchOverlayComponent,
    SearchPageComponent,
    SearchPlanListComponent,
    SearchPlanListItemComponent,
    SearchResultComponent,
    SearchResultListComponent,
    SearchResultTitleComponent,
    SearchTitleComponent,
    SearchUserBarComponent
  ],
  providers: [
    AttributeSearchService,
    CustomerSearchService,
    PlanSearchService,
    SearchBarService,
    SearchChoicesService,
    SearchResultListService,
    SearchResultTitleService,
    SearchService,
    SearchSortService,
    SearchStateService,
    SearchTitleService,
    UserSearchService
  ]
})
export class SearchModule {
}
