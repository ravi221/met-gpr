import {Component, EventEmitter, OnChanges, OnDestroy, Output, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {IPlan} from 'app/plan/plan-shared/interfaces/iPlan';
import {IFormItemConfig} from '../../config/iFormItemConfig';
import {GroupedQuestionConfig} from '../../config/grouped-question-config';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { IComment } from '../../../comment/interfaces/iComment';
import { FlagService } from '../../../flag/services/flag.service';
import { CommentService } from '../../../comment/services/comment.service';
import { ISummaryFlagsResponse } from '../../../flag/interfaces/iSummaryFlagsResponse';
import { IFlagsResponse } from '../../../flag/interfaces/iFlagsResponse';
import { ICommentsResponse } from '../../../comment/interfaces/iCommentsResponse';
import { ISummaryFlagsRequest } from 'app/flag/interfaces/iSummaryFlagsRequest';
import { FlagContextTypes } from 'app/flag/enums/flag-context-types';
import { ICommentsRequest } from '../../../comment/interfaces/iCommentsRequest';
import SectionConfig from 'app/dynamic-form/config/section-config';
import {Form} from '../form';
import { NavigatorService } from 'app/navigation/services/navigator.service';
import { isNil } from 'lodash';

/**
 * The primary entry point for putting a dynamic form on the page.
 */
@Component({
  selector: 'gpr-dynamic-form',
  template: `
    <div>
      <h3>{{activeSectionLabel}}</h3>
      <ul class="control-list">
        <li *ngFor="let formItemConfig of formItems; let i = index;">
          <gpr-dynamic-form-item
            [config]="formItemConfig"
            [index]="startingIndices[i]"
            [model]="model"
            [plan]="plan"
            [customerNumber]="customerNumber"
            [questionFlag]="getFlag(formItemConfig)"
            [questionComments]="getComments(formItemConfig)">
          </gpr-dynamic-form-item>
        </li>
      </ul>
    </div>`,
  styleUrls: []
})
export class DynamicFormComponent extends Form implements OnInit, OnDestroy, OnChanges {

  /**
   * The list of formItems to be displayed
   */
  public formItems: Array<IFormItemConfig> = [];

  /**
   * Id for the current section
   */
  public sectionId: string;

  /**
   * name of the current section
   */
  public sectionName: string;

  /**
   * id of the current category
   */
  public categoryId: string;

  /**
   * active section label
   */
  public activeSectionLabel;

  /**
   * Is there a comment for the selected question array of comments
   */
  public comments: IComment[];

  /**
   * Flags contained on the active section
   */
  public sectionFlags: IFlag[];
  /**
   * comments contained on the active section
   */
  public sectionComments: IComment[];

  /**
   * subscription
   */
  public sectionChangeSubscription: Subscription;

  /**
   * Contains the starting index for each formItem
   */
  public startingIndices: number[];

  /**
   * The number of formItems answered for this section
   * @type {number}
   */
  private _answeredQuestions: number = 0;

  /**
   * Variable used to store navigation context data
   */
  private _navData: any;

  /**'
   * Gets a reference to the tagging service
   * @param _flagService
   * @param _commentService
   */
  constructor(private _flagService: FlagService,
              private _commentService: CommentService,
              private _navigator: NavigatorService) {
                super();
              }
  /**
   * initialize all of the tag data
   */
  ngOnInit() {

    const navState = this._navigator.getNavigationState();
    this._navData = navState.data;
    this.plan = this._navData.plan;
    this.customerNumber = this._navData.customer.customerNumber;

    const flagRequest = <ISummaryFlagsRequest> {
      planId: this.plan.planId,
      categoryId: this.categoryId,
      customerNumber: this.customerNumber
    };
    this.sectionChangeSubscription = this._flagService.getFlags(FlagContextTypes.CATEGORY, flagRequest).subscribe((response: ISummaryFlagsResponse) => {
      if (!isNil(response.flags)) {
        this.sectionFlags = response.flags;
      } else {
        this.sectionFlags = [];
      }
    });
    const commentsRequest = <ICommentsRequest> {
      planId: this.plan.planId,
      categoryId: this.categoryId,
      customerNumber: this.customerNumber,
      sectionId: this.sectionId
    };
    this.sectionChangeSubscription = this._commentService.fetchSectionComments(commentsRequest).subscribe((response: ICommentsResponse) => {
      if (!isNil(response.comments)) {
        this.sectionComments = response.comments;
      } else {
        this.sectionComments = [];
      }
    });
    this._initialize(this.sectionId);
  }

  /**
   * unsubscribe to any subscriptions when destroying the component
   */
  ngOnDestroy() {
    if (this.sectionChangeSubscription) {
      this.sectionChangeSubscription.unsubscribe();
    }
  }

  /**
   * Counts the total number of questions
   * @private
   */
  private _setupStartingIndices(): void {
    let questionCount = 1;
    this.startingIndices = [];
    this.formItems.forEach( (formItem) => {
      this.startingIndices.push(questionCount);
      if (formItem instanceof GroupedQuestionConfig) {
        questionCount += formItem.getQuestionCount();
      } else {
        questionCount += 1;
      }
    });
  }

  /**
   * determines whether a flag exists for a given question
   * @param questionConfig
   * @param sectionFlags
   */
  public getFlag(formItemConfig: IFormItemConfig): IFlag {
    if (!this.sectionFlags) {
      return null;
    }
    let flag: IFlag;
    flag = this.sectionFlags.find(sectionFlag => sectionFlag.questionId === formItemConfig.formItemId);
    return flag;
  }

  /**
   * Checks if comments exist
   * @param {IFormItemConfig} formItemConfig
   * @returns {IContextTag[]}
   */
  public getComments(formItemConfig: IFormItemConfig): IComment[] {
    if (!this.sectionComments) {
      return [];
    }
    let comments: IComment[] = [];
    this.sectionComments.forEach(comment => {
      if (comment.questionId.toString() === formItemConfig.formItemId) {
        comments.push(comment);
      }
    });
    return comments;
  }

  /**
   * sets the number of answered questions and then emits the value
   * @param {SectionConfig} section
   * @private
   */
  protected _initializeSection(section: SectionConfig): void {
    this.activeSectionLabel = section.label;
    this.formItems = section.formItems;
    this._setupStartingIndices();
    this.sectionId = section.sectionId;
    this.sectionName = this.config.getSection(section.sectionId).label;
    this.categoryId = this.config.activeCategoryId;
    if (this.plan) {
      const flagRequest = <ISummaryFlagsRequest> {
        planId: this.plan.planId,
        categoryId: this.categoryId,
        customerNumber: this.customerNumber
      };
      this.sectionChangeSubscription = this._flagService.getFlags(FlagContextTypes.CATEGORY, flagRequest).subscribe((response: ISummaryFlagsResponse) => {
        if (response.flags !== null) {
          this.sectionFlags = response.flags;
        } else {
          this.sectionFlags = [];
        }
      });
      const commentsRequest = <ICommentsRequest> {
        planId: this.plan.planId,
        categoryId: this.categoryId,
        customerNumber: this.customerNumber,
        sectionId: this.sectionId
      };
      this.sectionChangeSubscription = this._commentService.fetchSectionComments(commentsRequest).subscribe((response: ICommentsResponse) => {
        if (response.comments !== null) {
          this.sectionComments = response.comments;
        } else {
          this.sectionComments = [];
        }
      });
    }
  }
}
