import {AuthenticatedUserGuard} from '../core/guards/authenticated-user.guard';
import {CustomerInformationEntryComponent} from '../customer/components/customer-information-entry/customer-information-entry.component';
import {CustomerInformationLandingComponent} from '../customer/components/customer-information-landing/customer-information-landing.component';
import {CustomerLandingComponent} from '../customer/components/customer-landing/customer-landing.component';
import {CustomerPlansResolverService} from './resolvers/customer-plans-resolver.service';
import {CustomerResolverService} from './resolvers/customer-resolver.service';
import {HistoryLandingComponent} from '../history/components/history-landing/history-landing.component';
import {MainLandingComponent} from '../customer/components/main-landing/main-landing.component';
import {MassUpdateEntryComponent} from '../plan/mass-update/components/mass-update-entry/mass-update-entry.component';
import {MassUpdateLandingComponent} from '../plan/mass-update/components/mass-update-landing/mass-update-landing.component';
import {NavContextType} from '../navigation/enums/nav-context';
import {PlanAccessResolverService} from './resolvers/plan-access-resolver.service';
import {PlanCategoryDataResolverService} from './resolvers/plan-category-data-resolver.service';
import {PlanDataEntryComponent} from '../plan/plan-data-entry/components/plan-data-entry/plan-data-entry.component';
import {PlanLandingComponent} from '../plan/components/plan-landing/plan-landing.component';
import {PlanResolverService} from './resolvers/plan-resolver.service';
import {ProductResolverService} from './resolvers/product-resolver.service';
import {Routes} from '@angular/router';
import {SearchLandingComponent} from '../search/components/search-landing/search-landing.component';
import {UserProfileResolverService} from './resolvers/user-profile-resolver.service';
import {CanDeactivateGuard} from './guards/can-deactivate-guard.service';

import {ValidationErrorReportComponent} from '../plan/plan-shared/components/validation-error-report/validation-error-report.component';
import {PPCValidationResolverService} from './resolvers/ppc-validation-resolver.service';
import { FlagLandingComponent } from 'app/flag/components/flag-landing/flag-landing.component';
import {FormConfigResolverService} from './resolvers/form-config-resolver.service';
import { CustomersResolverService } from 'app/routing/resolvers/customers-resolver.service';

export const routes: Routes = [
  {
    path: 'home',
    component: MainLandingComponent,
    canActivate: [AuthenticatedUserGuard],
    resolve: {
      customers: CustomersResolverService,
      currentUser: UserProfileResolverService
    },
    data: {
      allowedRoles: [],
      checkAllRoles: false,
      context: NavContextType.DEFAULT
    }
  },
  {
    path: 'customers/:customerNumber',
    component: CustomerLandingComponent,
    canActivate: [AuthenticatedUserGuard],
    resolve: {
      customer: CustomerResolverService,
      customerPlans: CustomerPlansResolverService,
      currentUser: UserProfileResolverService,
      products: ProductResolverService,
      pageAccessType: PlanAccessResolverService
    },
    data: {
      context: NavContextType.CUSTOMER
    }
  },
  {
    path: 'customers/:customerNumber/plans/:planId',
    component: PlanLandingComponent,
    canActivate: [AuthenticatedUserGuard],
    resolve: {
      customer: CustomerResolverService,
      plan: PlanResolverService,
      currentUser: UserProfileResolverService
    },
    data: {
      context: NavContextType.CUSTOMER
    }
  },
  {
    path: 'customers/:customerNumber/plans/:planId/validations',
    component: ValidationErrorReportComponent,
    canActivate: [AuthenticatedUserGuard],
    resolve: {
      customer: CustomerResolverService,
      ppcResponse: PPCValidationResolverService
    },
    data: {
      context: NavContextType.CUSTOMER
    }
  },
  {
    path: 'customers/:customerNumber/plans/:planId/categories/:categoryId',
    component: PlanDataEntryComponent,
    canActivate: [AuthenticatedUserGuard],
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      customer: CustomerResolverService,
      plan: PlanResolverService,
      planCategoryData: PlanCategoryDataResolverService,
      currentUser: UserProfileResolverService,
      pageAccessType: PlanAccessResolverService,
      formConfig: FormConfigResolverService
    },
    data: {
      context: NavContextType.CUSTOMER
    }
  },
  {
    path: 'customers/:customerNumber/plans/:planId/categories/:categoryId/validations',
    component: ValidationErrorReportComponent,
    canActivate: [AuthenticatedUserGuard],
    resolve: {
      customer: CustomerResolverService,
      ppcResponse: PPCValidationResolverService
    },
    data: {
      context: NavContextType.CUSTOMER
    }
  },
  {
    path: 'customers/:customerNumber/mass-update',
    component: MassUpdateLandingComponent,
    canActivate: [AuthenticatedUserGuard],
    data: {
      context: NavContextType.CUSTOMER
    },
    resolve: {
      customer: CustomerResolverService,
      currentUser: UserProfileResolverService
    }
  },
  {
    path: 'customers/:customerNumber/mass-update/categories/:categoryId',
    component: MassUpdateEntryComponent,
    canActivate: [AuthenticatedUserGuard],
    data: {
      label: 'Mass Update Tool',
      context: NavContextType.CUSTOMER
    },
    resolve: {
      customer: CustomerResolverService,
      currentUser: UserProfileResolverService,
      pageAccessType: PlanAccessResolverService
    }
  },
  {
    path: 'customers/:customerNumber/information',
    component: CustomerInformationLandingComponent,
    canActivate: [AuthenticatedUserGuard],
    data: {
      context: NavContextType.CUSTOMER
    },
    resolve: {
      customer: CustomerResolverService,
      currentUser: UserProfileResolverService
    }
  },
  {
    path: 'customers/:customerNumber/information/categories/:categoryId',
    component: CustomerInformationEntryComponent,
    canActivate: [AuthenticatedUserGuard],
    data: {
      label: 'Customer Information',
      context: NavContextType.CUSTOMER
    },
    resolve: {
      customer: CustomerResolverService,
      currentUser: UserProfileResolverService
    }
  },
  {
    path: 'flags',
    component: FlagLandingComponent,
    canActivate: [AuthenticatedUserGuard],
    data: {
      context: NavContextType.FLAGS
    },
    resolve: {
      customer: CustomerResolverService,
      currentUser: UserProfileResolverService
    }
  },
  {
    path: 'customers/:customerNumber/flags',
    component: FlagLandingComponent,
    canActivate: [AuthenticatedUserGuard],
    data: {
      context: NavContextType.FLAGS
    },
    resolve: {
      customer: CustomerResolverService,
      currentUser: UserProfileResolverService
    }
  },
  {
    path: 'customers/:customerNumber/plans/:planId/flags',
    component: FlagLandingComponent,
    canActivate: [AuthenticatedUserGuard],
    data: {
      context: NavContextType.FLAGS
    },
    resolve: {
      customer: CustomerResolverService,
      plan: PlanResolverService,
      currentUser: UserProfileResolverService
    }
  },
  {
    path: 'customers/:customerNumber/history',
    component: HistoryLandingComponent,
    canActivate: [AuthenticatedUserGuard],
    data: {
      context: NavContextType.HISTORY
    },
    resolve: {
      customer: CustomerResolverService,
      currentUser: UserProfileResolverService,
      products: ProductResolverService
    }
  },
  {
    path: 'search',
    component: SearchLandingComponent,
    canActivate: [AuthenticatedUserGuard],
    data: {
      context: NavContextType.SEARCH
    },
    resolve: {
      currentUser: UserProfileResolverService
    }
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
