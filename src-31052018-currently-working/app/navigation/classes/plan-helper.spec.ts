import {CategoryActionLabel} from 'app/plan/enums/category-action-label';
import {CompletionStatus} from 'app/plan/enums/completion-status';
import {PlanHelper} from 'app/navigation/classes/plan-helper';
import {PlanStatus} from '../../plan/enums/plan-status';

describe('PlanHelper', () => {
  describe('Get Color by CompletionStatus', () => {
    it('should return \'green\' when \'Complete\'', () => {
      const status = PlanHelper.getDisplayColorByStatus(CompletionStatus.COMPLETE);
      expect(status).toBe('green');
    });
    it('should return \'yellow\' when \'In-Progress\'', () => {
      const status = PlanHelper.getDisplayColorByStatus(CompletionStatus.IN_PROGRESS);
      expect(status).toBe('yellow');
    });
    it('should return \'red\' when \'Not Started\'', () => {
      const status = PlanHelper.getDisplayColorByStatus(CompletionStatus.NOT_STARTED);
      expect(status).toBe('red');
    });
    it('should return \'yellow\' when \'In-ProgreSS\'', () => {
      const status = PlanHelper.getDisplayColorByStatus('In-ProgreSS');
      expect(status).toBe('yellow');
    });
    it('should return \'yellow\' when \'IN-PROGRESS', () => {
      const status = PlanHelper.getDisplayColorByStatus('IN-PROGRESS');
      expect(status).toBe('yellow');
    });
  });

  describe('Get Completion Status By Completion Percentage', () => {
    it('should return \'Not Started\' for null percentage', () => {
      const status = PlanHelper.getCompletionStatusByCompletionPercentage(null);
      expect(status).toBe(CompletionStatus.NOT_STARTED);
    });
    it('should return \'Not Started\' for undefined percentage', () => {
      const status = PlanHelper.getCompletionStatusByCompletionPercentage(undefined);
      expect(status).toBe(CompletionStatus.NOT_STARTED);
    });
    it('should return \'Not Started\' for -1 percentage', () => {
      const status = PlanHelper.getCompletionStatusByCompletionPercentage(-1);
      expect(status).toBe(CompletionStatus.NOT_STARTED);
    });
    it('should return \'Not Started\' for 0 percentage', () => {
      const status = PlanHelper.getCompletionStatusByCompletionPercentage(0);
      expect(status).toBe(CompletionStatus.NOT_STARTED);
    });
    it('should return \'Not Started\' for 150 percentage', () => {
      const status = PlanHelper.getCompletionStatusByCompletionPercentage(150);
      expect(status).toBe(CompletionStatus.NOT_STARTED);
    });
    it('should return \'In-Progress\' for 5 percentage', () => {
      const status = PlanHelper.getCompletionStatusByCompletionPercentage(5);
      expect(status).toBe(CompletionStatus.IN_PROGRESS);
    });
    it('should return \'Complete\' for 100 percentage', () => {
      const status = PlanHelper.getCompletionStatusByCompletionPercentage(100);
      expect(status).toBe(CompletionStatus.COMPLETE);
    });
  });

  describe('Get Action Label By Completion Percentage', () => {
    it('should return \'Start\' for null percentage', () => {
      const status = PlanHelper.getActionButtonLabelByCompletionPercentage(null);
      expect(status).toBe(CategoryActionLabel.START);
    });
    it('should return \'Start\' for undefined percentage', () => {
      const status = PlanHelper.getActionButtonLabelByCompletionPercentage(undefined);
      expect(status).toBe(CategoryActionLabel.START);
    });
    it('should return \'Start\' for -1 percentage', () => {
      const status = PlanHelper.getActionButtonLabelByCompletionPercentage(-1);
      expect(status).toBe(CategoryActionLabel.START);
    });
    it('should return \'Start\' for 0 percentage', () => {
      const status = PlanHelper.getActionButtonLabelByCompletionPercentage(0);
      expect(status).toBe(CategoryActionLabel.START);
    });
    it('should return \'Start\' for 150 percentage', () => {
      const status = PlanHelper.getActionButtonLabelByCompletionPercentage(150);
      expect(status).toBe(CategoryActionLabel.START);
    });
    it('should return \'Resume\' for 5 percentage', () => {
      const status = PlanHelper.getActionButtonLabelByCompletionPercentage(5);
      expect(status).toBe(CategoryActionLabel.RESUME);
    });
    it('should return \'Edit\' for 100 percentage', () => {
      const status = PlanHelper.getActionButtonLabelByCompletionPercentage(100);
      expect(status).toBe(CategoryActionLabel.EDIT);
    });
    it('should return \'VIEW\' when plan status is Readonly', () => {
      const status = PlanHelper.getActionButtonLabelByCompletionPercentage(100, PlanStatus.CANCELLED);
      expect(status).toBe(CategoryActionLabel.VIEW);
    });
  });
  describe('Is Plan Readonly By Plan Status', () => {
    it('should return false for null plan status', () => {
      expect(PlanHelper.isPlanReadOnly(null)).toBeFalsy();
    });
    it('should return false for Active plan status', () => {
      expect(PlanHelper.isPlanReadOnly(PlanStatus.ACTIVE)).toBeFalsy();
    });
    it('should return true for Cancelled plan status', () => {
      expect(PlanHelper.isPlanReadOnly(PlanStatus.CANCELLED)).toBeTruthy();
    });
  });
});
