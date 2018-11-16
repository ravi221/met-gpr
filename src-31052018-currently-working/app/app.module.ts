import {APP_INITIALIZER, NgModule} from '@angular/core';
import {ActivityModule} from './activity/activity.module';
import {AdministrationModule} from './administration/administration.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {CookieHelper} from './core/utilities/cookie-helper';
import {CoreModule} from './core/core.module';
import {HistoryModule} from './history/history.module';
import {MainRoutingModule} from './routing/routing.module';
import {NavigationModule} from './navigation/navigation.module';
import {PlanModule} from './plan/plan.module';
import {SearchModule} from './search/search.module';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {CustomerModule} from './customer/customer.module';
import {FormsModule} from '@angular/forms';
import {environment} from 'environments/environment';
import {FormControlsModule} from './forms-controls/form-controls.module';
import { FlagModule } from './flag/flag.module';
import { CommentModule } from './comment/comment.module';


/**
 * Function to resolve user profile prior to bootstrapping application via APP_INITIALIZER function.
 * @param {UserProfileService} userProfileService
 * @returns {() => Promise<UserProfile>}
 */
export function preloadUser(userProfileService: UserProfileService) {
  environment.startup();
  let metnet = CookieHelper.getMetnetId();
  return () => userProfileService.getUserProfile(metnet);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ActivityModule,
    AdministrationModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    FormControlsModule,
    CommonModule,
    CoreModule,
    CustomerModule,
    FormsModule,
    HistoryModule,
    MainRoutingModule,
    NavigationModule,
    PlanModule,
    SearchModule,
    FlagModule,
    CommentModule
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: preloadUser, deps: [UserProfileService], multi: true}
  ],
  bootstrap: [AppComponent]
})
/**
 * Exports class as a ngModule with the above metadata.
 */
export class AppModule {
}
