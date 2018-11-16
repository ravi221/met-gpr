import {PlansExpansionManager} from './plan-expansion-manager';

describe('PlansExpansionManager', () => {
  let expansionManager: PlansExpansionManager;

  beforeEach(() => {
    expansionManager = new PlansExpansionManager();
  });

  function getPlansMap() {
    return expansionManager['_plansMap'];
  }

  function getCategoriesMap() {
    return expansionManager['_categoriesMap'];
  }

  describe('Registering Plans', () => {
    it('should register a new plan', () => {
      const planId = '21';
      expansionManager.registerPlan(planId, () => {});
      const map = getPlansMap();
      expect(map.size).toBe(1);
    });
  });

  describe('Toggling Plans', () => {
    it('should default set expanded to false', () => {
      const planId = '21';
      expansionManager.registerPlan(planId, () => {});
      const map = getPlansMap();
      const plan = map.get(planId);
      expect(plan.isExpanded).toBeFalsy();
    });

    it('should set expanded to true when toggling a plan', () => {
      const planId = '21';
      expansionManager.registerPlan(planId, () => {});
      expansionManager.togglePlan(planId);
      const map = getPlansMap();
      const plan = map.get(planId);
      expect(plan.isExpanded).toBeTruthy();
    });

    it('should collapse other plans when toggling a plan id', () => {
      const planId = '21';
      expansionManager.registerPlan(planId, () => {});
      expansionManager.togglePlan(planId);
      let map = getPlansMap();
      let plan = map.get(planId);
      expect(plan.isExpanded).toBeTruthy();

      const newPlanId = '22';
      expansionManager.registerPlan(newPlanId, () => {});
      expansionManager.togglePlan(newPlanId);
      map = getPlansMap();
      plan = map.get(planId);
      const newPlan = map.get(newPlanId);
      expect(plan.isExpanded).toBeFalsy();
      expect(newPlan.isExpanded).toBeTruthy();
    });

    it('should not collapse other plans with an invalid plan id', () => {
      const planId = '21';
      expansionManager.registerPlan(planId, () => {});
      expansionManager.togglePlan(planId);
      let map = getPlansMap();
      let plan = map.get(planId);
      expect(plan.isExpanded).toBeTruthy();

      expansionManager.togglePlan('invalid-id');
      map = getPlansMap();
      plan = map.get(planId);
      expect(plan.isExpanded).toBeTruthy();
    });

    it('should collapse all categories when toggling a plan', () => {
      const planId = '21';
      expansionManager.registerPlan(planId, () => {});

      const categoryId = '42';
      expansionManager.registerCategory(categoryId, () => {});
      expansionManager.toggleCategory(categoryId);

      let categoriesMap = getCategoriesMap();
      let category = categoriesMap.get(categoryId);
      expect(category.isExpanded).toBeTruthy();

      expansionManager.togglePlan(planId);
      let map = getPlansMap();
      let plan = map.get(planId);
      expect(plan.isExpanded).toBeTruthy();

      categoriesMap = getCategoriesMap();
      category = categoriesMap.get(categoryId);
      expect(category.isExpanded).toBeFalsy();
    });

    it('should call onChange event', () => {
      const planId = '21';
      const spy = jasmine.createSpy('test');
      expansionManager.registerPlan(planId, spy);
      expansionManager.togglePlan(planId);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Toggling Categories', () => {
    it('should default set expanded to false', () => {
      const categoryId = '42';
      expansionManager.registerCategory(categoryId, () => {});
      const map = getCategoriesMap();
      const category = map.get(categoryId);
      expect(category.isExpanded).toBeFalsy();
    });

    it('should set expanded to true when toggling a category', () => {
      const categoryId = '42';
      expansionManager.registerCategory(categoryId, () => {});
      expansionManager.toggleCategory(categoryId);
      const map = getCategoriesMap();
      const category = map.get(categoryId);
      expect(category.isExpanded).toBeTruthy();
    });

    it('should collapse other categories when toggling a category id', () => {
      const categoryId = '42';
      expansionManager.registerCategory(categoryId, () => {});
      expansionManager.toggleCategory(categoryId);
      let map = getCategoriesMap();
      let category = map.get(categoryId);
      expect(category.isExpanded).toBeTruthy();

      const newCategoryId = '43';
      expansionManager.registerCategory(newCategoryId, () => {});
      expansionManager.toggleCategory(newCategoryId);
      map = getCategoriesMap();
      category = map.get(categoryId);
      const newCategory = map.get(newCategoryId);
      expect(category.isExpanded).toBeFalsy();
      expect(newCategory.isExpanded).toBeTruthy();
    });

    it('should not collapse other categories with an invalid category id', () => {
      const categoryId = '42';
      expansionManager.registerCategory(categoryId, () => {});
      expansionManager.toggleCategory(categoryId);
      let map = getCategoriesMap();
      let category = map.get(categoryId);
      expect(category.isExpanded).toBeTruthy();

      expansionManager.toggleCategory('invalid-id');
      map = getCategoriesMap();
      category = map.get(categoryId);
      expect(category.isExpanded).toBeTruthy();
    });

    it('should call onChange event', () => {
      const categoryId = '42';
      const spy = jasmine.createSpy('test');
      expansionManager.registerCategory(categoryId, spy);
      expansionManager.toggleCategory(categoryId);
      expect(spy).toHaveBeenCalled();
    });
  });
});
