import {Component, Input, OnInit, ViewChild} from '@angular/core';
import DataManager from '../../../dynamic-form/classes/data-manager';
import QuestionConfig from '../../../dynamic-form/config/question-config';
import {HelpTooltipComponent} from '../help-tooltip/help-tooltip.component';
import {IHelpText} from '../../../plan/interfaces/iHelpText';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { ICommentsRequest } from '../../../comment/interfaces/iCommentsRequest';
import { CommentService } from 'app/comment/services/comment.service';
import { FlagService } from '../../../flag/services/flag.service';
import { HelpDataService } from '../../../plan/services/help-data.service';
import { NavigatorService } from 'app/navigation/services/navigator.service';
import { IComment } from 'app/comment/interfaces/iComment';

/**
 * A container for the tooltips and help text
 */
@Component({
  selector: `gpr-dynamic-question-actions`,
  template: `<gpr-flag-create-tooltip [questionFlag] = "questionFlag" [tagData] = "tagData"   position="left"></gpr-flag-create-tooltip>
  <gpr-comment-create-tooltip [existingComments] = "questionComments" [tagData] = "tagData" position="left"></gpr-comment-create-tooltip>
  <gpr-help-tooltip [editable]="!config.control.state.isDisabled" [maxWidth]="350" [theme]="'default'" [position]="'left'" [displayCloseIcon]="true">
    <ng-container ngProjectAs="tooltip-editor">
      <gpr-help-text-editor #helpTextEditor
                            [config]="config" (saveHelpText)="onSaveHelpText()" (cancelHelpText)="onCancelHelpText()"></gpr-help-text-editor>
    </ng-container>
    <div>{{config.help.helpText}}</div>
    <div class="url-link"> <a id='more-help' (click)="onMoreHelp(config.help.helpUrl)">Get more help</a></div>
  </gpr-help-tooltip>`
})
export class DynamicQuestionActionsComponent implements OnInit {
  /**
   * The configuration for the question
   * @override
   */
  @Input() config: QuestionConfig;

  /**
   * An {@link DataManager} wrapping the model object to be edited through the form
   */
  @Input() model: DataManager;

  /**
   * Contains flag if one exists for this question
   */
  @Input() questionFlag: IFlag;

  /**
   * contains comments if they already exist for this question
   */
  @Input() questionComments: IComment;

  /**
   * Plan object, used for information to create flags and comments
   */
  public plan: IPlan;

  /**
   * Customer id used for information to create flags and comments
   */
  public customerNumber: number;

  /**
   * Data used to create a flag or comment, passed into the corresponding tooltip
   */
  public tagData: ICommentsRequest = <ICommentsRequest>{};

  /**
   *  Reference to the updated help and url text for this question.
   * @type {IHelpText}
   */
  public helpData: IHelpText = <IHelpText>{};

  /**
   * Variable used to store navigation context data
   */
  private _navData: any;

  /**
   * View of the help tooltip Component.
   */
  @ViewChild(HelpTooltipComponent) helpTooltip: HelpTooltipComponent;

  /**
   * The default constructor.
   */
  constructor(private _commentService: CommentService,
              private _navigator: NavigatorService,
              private _flagService: FlagService,
              private _helpDataService: HelpDataService) {
          }

  /**
   * initialize all of the tag data
   */
  ngOnInit() {

    const navState = this._navigator.getNavigationState();
    this._navData = navState.data;
    this.plan = this._navData.plan;
    this.customerNumber = this._navData.customer.customerNumber;

    const activeCategoryId = this.model.getActiveCategory();
    const activeSectionId = this.model.getActiveSection();
    const activeCategory = this.plan.categories.find( (category) => category.categoryId === activeCategoryId);
    const activeSection = activeCategory.sections.find( (section) => section.sectionId === activeSectionId);
    this.tagData.sectionId = activeSectionId;
    this.tagData.categoryId = activeCategoryId;
    this.tagData.customerNumber = this.customerNumber;
    this.tagData.questionId = this.config.formItemId;
    this.tagData.planId = this.plan.planId;

    // update Help data
    this._setHelpData();
  }

  /**
   *
   *  Reset any dirty edit and close the text editor.
   */
  public onCancelHelpText(): void {
    this._resetHelpData();
    this.helpTooltip.closeHelpTextEditor();
  }


  /**
   * updates the help data form teh component.
   */
  public onSaveHelpText(): void {
    this._setHelpData();
    this.helpTooltip.saveHelpTextEditor(this.helpData);
  }

  /**
   *
   * @param url {String}
   */
  public onMoreHelp(url: string): void {
    window.open(url, 'GPR Help');
  }

  /**
   * Updates helpdata opbject with current model data.
   */
  private _setHelpData(): void {
    this.helpData.questionId = this.config.formItemId;
    this.helpData.ppcModelName = this.plan.ppcModelName;
    this.helpData.ppcVersion = this.plan.ppcModelVersion;
    this.helpData.helpText = this.config.help.helpText;
    this.helpData.urlText = this.config.help.helpUrl;
  }

  /**
   *
   * set Previous Help Data
   */
  private _resetHelpData(): void {
    this.config.help.helpText = this.helpData.helpText;
    this.config.help.helpUrl = this.helpData.urlText;
  }
}
