import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SearchResultTitleComponent} from './search-result-title.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {SearchResultTitleService} from '../../../services/search-result-title.service';

describe('SearchResultTitleComponent', () => {
  let component: TestSearchResultTitleComponent;
  let fixture: ComponentFixture<TestSearchResultTitleComponent>;
  let searchTitle: DebugElement;
  let searchResultTitleService: SearchResultTitleService;

  function setTitleAndSearchField(title: string, searchField: string): void {
    searchResultTitleService.setSearchField(searchField);
    component.title = title;
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestSearchResultTitleComponent, SearchResultTitleComponent],
      providers: [SearchResultTitleService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchResultTitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        searchResultTitleService = TestBed.get(SearchResultTitleService);
        searchTitle = fixture.debugElement.query(By.css('.search-result-title'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should not highlight text when the search field is not in the title', () => {
    setTitleAndSearchField('word', 'test');

    const pre = searchTitle.query(By.css('span:first-child')).nativeElement.innerHTML;
    const highlight = searchTitle.query(By.css('span:nth-child(2)')).nativeElement.innerHTML;
    const post = searchTitle.query(By.css('span:last-child')).nativeElement.innerHTML;

    expect(pre).toBe('word');
    expect(highlight).toBe('');
    expect(post).toBe('');
  });

  it('should highlight the beginning of the string', () => {
    setTitleAndSearchField('beginning', 'beg');

    const pre = searchTitle.query(By.css('span:first-child')).nativeElement.innerHTML;
    const highlight = searchTitle.query(By.css('span:nth-child(2)')).nativeElement.innerHTML;
    const post = searchTitle.query(By.css('span:last-child')).nativeElement.innerHTML;

    expect(pre).toBe('');
    expect(highlight).toBe('beg');
    expect(post).toBe('inning');
  });

  it('should highlight the middle of the string', () => {
    setTitleAndSearchField('middle', 'ddl');

    const pre = searchTitle.query(By.css('span:first-child')).nativeElement.innerHTML;
    const highlight = searchTitle.query(By.css('span:nth-child(2)')).nativeElement.innerHTML;
    const post = searchTitle.query(By.css('span:last-child')).nativeElement.innerHTML;

    expect(pre).toBe('mi');
    expect(highlight).toBe('ddl');
    expect(post).toBe('e');
  });

  it('should highlight the end of the string', () => {
    setTitleAndSearchField('ending', 'ing');

    const pre = searchTitle.query(By.css('span:first-child')).nativeElement.innerHTML;
    const highlight = searchTitle.query(By.css('span:nth-child(2)')).nativeElement.innerHTML;
    const post = searchTitle.query(By.css('span:last-child')).nativeElement.innerHTML;

    expect(pre).toBe('end');
    expect(highlight).toBe('ing');
    expect(post).toBe('');
  });

  it('should correctly keep capitalization while highlighting', () => {
    setTitleAndSearchField('TeSt', 'test');

    const pre = searchTitle.query(By.css('span:first-child')).nativeElement.innerHTML;
    const highlight = searchTitle.query(By.css('span:nth-child(2)')).nativeElement.innerHTML;
    const post = searchTitle.query(By.css('span:last-child')).nativeElement.innerHTML;

    expect(pre).toBe('');
    expect(highlight).toBe('TeSt');
    expect(post).toBe('');
  });

  @Component({
    template: `
      <gpr-search-result-title [title]="title"></gpr-search-result-title> `
  })
  class TestSearchResultTitleComponent {
    @ViewChild(SearchResultTitleComponent) searchResultTitle;
    title: string = 'Test';
  }
});
