import {AutoSearchComponent} from './components/auto-search/auto-search.component';
import {CardComponent} from './components/card/card.component';
import {CommentCreateTooltipComponent} from 'app/ui-controls/components/comment-create-tooltip/comment-create-tooltip.component';
import {CommonModule, DatePipe} from '@angular/common';
import {DatePickerComponent} from './components/date-picker/date-picker.component';
import {DatePickerDefaults} from 'app/ui-controls/services/date-picker-defaults.service';
import {DetailCardComponent} from './components/detail-card/detail-card.component';
import {EmailLinkComponent} from './components/email-link/email-link.component';
import {FlagCreateTooltipComponent} from 'app/ui-controls/components/flag-create-tooltip/flag-create-tooltip.component';
import {FormsModule} from '@angular/forms';
import {HelpDataService} from '../plan/services/help-data.service';
import {HelpTextEditorComponent} from './components/help-text-editor/help-text-editor.component';
import {HelpTooltipComponent} from './components/help-tooltip/help-tooltip.component';
import {IconComponent} from './components/icon/icon.component';
import {LoadingIconComponent} from './components/loading-icon/loading-icon.component';
import {ModalBackdropComponent} from './components/modal/modal-backdrop/modal-backdrop.component';
import {ModalContainerComponent} from './components/modal/modal-container/modal-container.component';
import {ModalDefaultComponent} from './components/modal/modal-default/modal-default.component';
import {ModalService} from './services/modal.service';
import {NgModule} from '@angular/core';
import {NotificationBannerComponent} from './components/notification-banner/notification-banner.component';
import {OutsideClickDirective} from './directives/outside-click.directive';
import {PagingService} from 'app/ui-controls/services/paging.service';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {ProgressService} from './services/progress.service';
import {RouterModule} from '@angular/router';
import {ScrollDirective} from './directives/scroll.directive';
import {ScrollService} from './services/scroll.service';
import {ScrollToTopComponent} from './components/scroll-to-top/scroll-to-top.component';
import {SelectMenuComponent} from './components/select-menu/select-menu.component';
import {SlideMenuComponent} from './components/slide-menu/slide-menu.component';
import {SnackBarComponent} from './components/snack-bar/snack-bar.component';
import {ToggleComponent} from './components/toggle/toggle.component';
import {TooltipContentComponent} from './components/tooltip/tooltip-content.component';
import {TooltipDirective} from './components/tooltip/tooltip.directive';
import {TooltipHoverDirective} from './components/tooltip/tooltip-hover.directive';
import {TooltipPositionService} from './services/tooltip-position.service';
import {TooltipService} from './services/tooltip.service';
import {ValueAsDateDirective} from 'app/ui-controls/components/date-picker/date-picker.directive';
import {ExpandCollapseIconComponent} from './components/expand-collapse-icon/expand-collapse-icon.component';
import {DynamicQuestionActionsComponent} from './components/dynamic-question-actions/dynamic-question-actions.component';
import {EscapeKeyDirective} from 'app/ui-controls/directives/escape-key.directive';
import {LoadingSpinnerComponent} from './components/loading-spinner/loading-spinner.component';
import {LoadingSpinnerService} from './services/loading-spinner.service';
import {ConfirmDialogComponent} from './components/modal/confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    AutoSearchComponent,
    CardComponent,
    CommentCreateTooltipComponent,
    DatePickerComponent,
    DetailCardComponent,
    EmailLinkComponent,
    ExpandCollapseIconComponent,
    FlagCreateTooltipComponent,
    HelpTextEditorComponent,
    HelpTooltipComponent,
    IconComponent,
    LoadingIconComponent,
    LoadingSpinnerComponent,
    ModalDefaultComponent,
    NotificationBannerComponent,
    OutsideClickDirective,
    ProgressBarComponent,
    ScrollDirective,
    ScrollToTopComponent,
    SelectMenuComponent,
    SlideMenuComponent,
    SnackBarComponent,
    ToggleComponent,
    TooltipContentComponent,
    TooltipDirective,
    TooltipHoverDirective,
    ValueAsDateDirective,
    DynamicQuestionActionsComponent,
    EscapeKeyDirective,
    ConfirmDialogComponent
  ],
  declarations: [
    AutoSearchComponent,
    CardComponent,
    CommentCreateTooltipComponent,
    DatePickerComponent,
    DetailCardComponent,
    EmailLinkComponent,
    ExpandCollapseIconComponent,
    FlagCreateTooltipComponent,
    HelpTextEditorComponent,
    HelpTooltipComponent,
    IconComponent,
    LoadingIconComponent,
    LoadingSpinnerComponent,
    ModalBackdropComponent,
    ModalContainerComponent,
    ModalDefaultComponent,
    NotificationBannerComponent,
    OutsideClickDirective,
    ProgressBarComponent,
    ScrollDirective,
    ScrollToTopComponent,
    SelectMenuComponent,
    SlideMenuComponent,
    SnackBarComponent,
    ToggleComponent,
    TooltipContentComponent,
    TooltipDirective,
    TooltipHoverDirective,
    ValueAsDateDirective,
    DynamicQuestionActionsComponent,
    EscapeKeyDirective,
    ConfirmDialogComponent
  ],
  providers: [
    DatePickerDefaults,
    HelpDataService,
    LoadingSpinnerService,
    ModalService,
    PagingService,
    ProgressService,
    ScrollService,
    TooltipPositionService,
    TooltipService,
    DatePipe
  ],
  entryComponents: [
    HelpTextEditorComponent,
    ModalBackdropComponent,
    ModalContainerComponent,
    ModalDefaultComponent,
    ConfirmDialogComponent
  ]
})
export class UIControlsModule {
}
