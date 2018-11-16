import {AuthenticatedUserGuard} from '../core/guards/authenticated-user.guard';
import {AuthorizationService} from '../core/services/authorization.service';
import {CanDeactivateGuard} from './guards/can-deactivate-guard.service';
import {CustomerPlansResolverService} from './resolvers/customer-plans-resolver.service';
import {CustomerResolverService} from './resolvers/customer-resolver.service';
import {CustomersResolverService} from './resolvers/customers-resolver.service';
import {FormConfigResolverService} from './resolvers/form-config-resolver.service';
import {NgModule} from '@angular/core';
import {PlanAccessResolverService} from './resolvers/plan-access-resolver.service';
import {PlanCategoryDataResolverService} from './resolvers/plan-category-data-resolver.service';
import {PlanResolverService} from './resolvers/plan-resolver.service';
import {PPCValidationResolverService} from './resolvers/ppc-validation-resolver.service';
import {ProductResolverService} from './resolvers/product-resolver.service';
import {RouterModule} from '@angular/router';
import {routes} from './routes';
import {UserProfileResolverService} from 'app/routing/resolvers/user-profile-resolver.service';
import {UserProfileService} from '../core/services/user-profile.service';

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthenticatedUserGuard,
    AuthorizationService,
    CustomerPlansResolverService,
    CustomerResolverService,
    CustomersResolverService,
    FormConfigResolverService,
    PlanAccessResolverService,
    PlanCategoryDataResolverService,
    PlanResolverService,
    PPCValidationResolverService,
    ProductResolverService,
    UserProfileResolverService,
    CustomerPlansResolverService,
    PlanAccessResolverService,
    CanDeactivateGuard,
    UserProfileService,
  ]
})
export class MainRoutingModule {
}
