import {SearchResultTitleService} from './search-result-title.service';

describe('SearchResultTitleService', () => {
  let service: SearchResultTitleService = new SearchResultTitleService();

  describe('No highlighting', () => {
    it ('should not have highlighting when search field is null', () => {
      service.setSearchField(null);
      const highlight = service.highlight('Test');
      expect(highlight.preText).toBe('Test');
      expect(highlight.text).toBe('');
      expect(highlight.postText).toBe('');
    });

    it ('should not have highlighting when search field is undefined', () => {
      service.setSearchField(undefined);
      const highlight = service.highlight('Test');
      expect(highlight.preText).toBe('Test');
      expect(highlight.text).toBe('');
      expect(highlight.postText).toBe('');
    });

    it ('should not have highlighting when search field has 0 characters', () => {
      service.setSearchField('');
      const highlight = service.highlight('Test');
      expect(highlight.preText).toBe('Test');
      expect(highlight.text).toBe('');
      expect(highlight.postText).toBe('');
    });

    it ('should not have highlighting when title is null', () => {
      service.setSearchField('Test');
      const highlight = service.highlight(null);
      expect(highlight.preText).toBe('');
      expect(highlight.text).toBe('');
      expect(highlight.postText).toBe('');
    });

    it ('should not have highlighting when title is undefined', () => {
      service.setSearchField('Test');
      const highlight = service.highlight(undefined);
      expect(highlight.preText).toBe('');
      expect(highlight.text).toBe('');
      expect(highlight.postText).toBe('');
    });

    it ('should not have highlighting when title has 0 characters', () => {
      service.setSearchField('Test');
      const highlight = service.highlight('');
      expect(highlight.preText).toBe('');
      expect(highlight.text).toBe('');
      expect(highlight.postText).toBe('');
    });
  });

  describe('Highlighting', () => {
    it ('should highlight beginning of the title', () => {
      service.setSearchField('Tes');
      const highlight = service.highlight('Test');
      expect(highlight.preText).toBe('');
      expect(highlight.text).toBe('Tes');
      expect(highlight.postText).toBe('t');
    });

    it ('should highlight the middle of the title', () => {
      service.setSearchField('es');
      const highlight = service.highlight('Test');
      expect(highlight.preText).toBe('T');
      expect(highlight.text).toBe('es');
      expect(highlight.postText).toBe('t');
    });

    it ('should highlight the end of the title', () => {
      service.setSearchField('st');
      const highlight = service.highlight('Test');
      expect(highlight.preText).toBe('Te');
      expect(highlight.text).toBe('st');
      expect(highlight.postText).toBe('');
    });
  });

});
