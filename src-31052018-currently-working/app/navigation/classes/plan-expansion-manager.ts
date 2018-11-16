import {Subject} from 'rxjs/Subject';

/**
 * Maintains the expansion state of a set of plans and categories
 */
export class PlansExpansionManager {
  /**
   * Represent a map of all plans to their expansion state
   * @type {Map<string, ExpansionState>}
   * @private
   */
  private _plansMap: Map<string, ExpansionState> = new Map<string, ExpansionState>();

  /**
   * Represents a map of all categories to their expansion state
   * @type {Map<string, ExpansionState>}
   * @private
   */
  private _categoriesMap: Map<string, ExpansionState> = new Map<string, ExpansionState>();

  /**
   * If a plan is open, it closes it and all of the categories within it.
   * If a plan is closed, it opens it and closes any other open plans.
   */
  public togglePlan(planId: string): void {
    let expansionState = this._plansMap.get(planId);
    if (!expansionState) {
      // No one is subscribed to the state of this plan, so no action is required
      return;
    }
    let wasExpanded = expansionState.isExpanded;
    this._collapseAllCategories();
    this._collapseAllPlans();
    this._plansMap.get(planId).isExpanded = !wasExpanded;
  }

  /**
   * Expands a plan based on Id
   * @param {string} planId Id of the plan to open in the navigation menu
   */
  public openPlan(planId: string): void {
    let expansionState = this._plansMap.get(planId);
    if (!expansionState) {
      // No one is subscribed to the state of this plan, so no action is required
      return;
    }
    this._collapseAllCategories();
    this._collapseAllPlans();
    this._plansMap.get(planId).isExpanded = true;
  }

  /**
   * If a category is open, it closes it.
   * If a category is closed, it opens it and closes any other open categories.
   */
  public toggleCategory(categoryId: string): void {
    let expansionState = this._categoriesMap.get(categoryId);
    if (!expansionState) {
      // No one is subscribed to the state of this category, so no action is required
      return;
    }
    let wasExpanded = expansionState.isExpanded;
    this._collapseAllCategories();
    this._categoriesMap.get(categoryId).isExpanded = !wasExpanded;
  }

  /**
   * Expands a category based on Id
   * @param {string} categoryId Id of the category to open in the navigation menu
   */
  public openCategory(categoryId: string): void {
    let expansionState = this._categoriesMap.get(categoryId);
    if (!expansionState) {
      // No one is subscribed to the state of this category, so no action is required
      return;
    }
    this._collapseAllCategories();
    this._categoriesMap.get(categoryId).isExpanded = true;
  }

  /**
   * Registers the plan with the expansion manager
   * @param {string} planId: The id of the plan to be managed
   * @param {(boolean) => void} onChange: A callback to be executed when the expansion state of the plan changes
   */
  public registerPlan(planId: string, onChange: (boolean) => void): void {
    this._plansMap.set(planId, new ExpansionState(onChange));
  }

  /**
   * Registers the category with the expansion manager
   * @param {string} categoryId: The id of the category to be managed
   * @param {(boolean) => void} onChange: A callback to be executed when the expansion state of the category changes
   */
  public registerCategory(categoryId: string, onChange: (boolean) => void): void {
    this._categoriesMap.set(categoryId, new ExpansionState(onChange));
  }

  /**
   * Collapses all plans
   */
  private _collapseAllPlans(): void {
    Array.from(this._plansMap.keys())
      .forEach(planId => this._collapsePlan(planId));
  }

  /**
   * Collapses all categories
   */
  private _collapseAllCategories(): void {
    Array.from(this._categoriesMap.keys())
      .forEach(categoryId => this._collapseCategory(categoryId));
  }

  /**
   * Collapses a given plan by plan id
   * @param {string} planId
   */
  private _collapsePlan(planId: string): void {
    this._plansMap.get(planId).isExpanded = false;
  }

  /**
   * Collapses a category given a category id
   * @param {string} categoryId
   */
  private _collapseCategory(categoryId: string): void {
    this._categoriesMap.get(categoryId).isExpanded = false;
  }
}

/**
 * Manages the expansion state of a particular plan or category
 */
class ExpansionState {
  /**
   * Indicates if the current plan or category is expanded
   */
  private _isExpanded: boolean;

  /**
   * A subject which watches the isExpanded field, running a callback whenever changed
   */
  private _subject: Subject<boolean>;

  /**
   * Create a new instance
   * @param {(boolean) => void} onChange: a callback to be executed when the expansion state changes
   */
  constructor(onChange: (boolean) => void) {
    this._isExpanded = false;
    this._subject = new Subject();
    this._subject.subscribe(onChange);
  }

  /**
   * Set to true if the item should be expanded, and false otherwise
   */
  set isExpanded(isExpanded: boolean) {
    this._isExpanded = isExpanded;
    this._subject.next(isExpanded);
  }

  /**
   * Returns true if the item is expanded and false otherwise
   */
  get isExpanded(): boolean {
    return this._isExpanded;
  }
}
