import {CompletionPercentage} from 'app/plan/enums/completion-percentage';
import {SectionValidationStatus} from 'app/plan/enums/section-validation-status';
import {PlanCategoryLabelStyleService} from './plan-category-label-style.service';
import {CategoryIconState} from 'app/plan/enums/category-icon-state';
import {CategoryActionStyle} from 'app/plan/enums/category-action-style';

describe('PlanCategoryLabelStyleService', () => {
  let service: PlanCategoryLabelStyleService = new PlanCategoryLabelStyleService();

  describe('Icon State', () => {
    it('getIconState function should be defined ', () => {
      const state = service.getIconState(CompletionPercentage.COMPLETE, SectionValidationStatus.VALIDATED);
      expect(state).toBeDefined();
    });

    it('getIconState should be on', () => {
      const state = service.getIconState(CompletionPercentage.COMPLETE, SectionValidationStatus.VALIDATED);
      expect(state).toBe(CategoryIconState.ON);
    });

    it('getIconState should be off ', () => {
      const state = service.getIconState(CompletionPercentage.COMPLETE, SectionValidationStatus.NOT_VALIDATED);
      expect(state).toBe(CategoryIconState.OFF);
    });
  });

  describe('Action Style', () => {
    it('getActionStyle should be Tertiary for Edit ', () => {
      const style = service.getActionStyle(CompletionPercentage.COMPLETE);
      expect(style).toBe(CategoryActionStyle.TERTIARY);
    });
  });
});
