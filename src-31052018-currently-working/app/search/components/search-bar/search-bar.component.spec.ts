import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchBarComponent} from './search-bar.component';
import {SearchBarService} from '../../services/search-bar.service';

describe('SearchBarComponent', () => {
  let component: TestSearchBarComponent;
  let fixture: ComponentFixture<TestSearchBarComponent>;
  let searchField: DebugElement;
  let searchButton: DebugElement;

  function setSearchField(newSearchField: string) {
    component.searchBar.searchFieldControl.setValue(newSearchField);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TestSearchBarComponent, SearchBarComponent, IconComponent],
      providers: [SearchBarService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        searchField = fixture.debugElement.query(By.css('.search-field'));
        searchButton = fixture.debugElement.query(By.css('.search-btn'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should emit search typed event when typing a letter', () => {
    const newSearchField = 'a';
    const spy = spyOn(component, 'onSearchTyped').and.stub();
    setSearchField(newSearchField);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(newSearchField);
  });

  it('should not emit search trigger event when the search is less than two characters', fakeAsync(() => {
    const spy = spyOn(component, 'onSearchTriggered').and.stub();
    setSearchField('');
    tick(5000);
    expect(spy).not.toHaveBeenCalled();

    setSearchField('a');
    tick(5000);
    expect(spy).not.toHaveBeenCalled();
  }));

  it('should emit search trigger event when the search is greater than or equal to two characters', fakeAsync(() => {
    const spy = spyOn(component, 'onSearchTriggered').and.stub();
    setSearchField('ab');
    tick(5000);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('ab');

    setSearchField('abc');
    tick(5000);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('abc');
  }));

  it('should emit search trigger event when the search button is clicked', () => {
    const newSearchField = 'ab';
    setSearchField(newSearchField);

    const spy = spyOn(component, 'onSearchTriggered').and.stub();
    click(searchButton, fixture);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(newSearchField);
  });

  it('should focus the search bar', () => {
    const searchBarService = TestBed.get(SearchBarService);
    searchBarService.focus();
    const activeElement = window.document.activeElement;
    expect(activeElement.classList).toContain('search-field');
  });

  it('should correctly set the placeholder', () => {
    const placeholder = 'Test';
    component.placeholder = placeholder;
    fixture.detectChanges();

    searchField = fixture.debugElement.query(By.css('.search-field'));
    expect(searchField.nativeElement.placeholder).toBe(placeholder);
  });

  @Component({
    template: `
      <gpr-search-bar [delayMs]="2000"
                      [minSearchLength]="2"
                      [placeholder]="placeholder"
                      (searchTriggered)="onSearchTriggered($event)"
                      (searchTyped)="onSearchTyped($event)"
                      (searchQueued)="onSearchQueued($event)"></gpr-search-bar>
    `
  })
  class TestSearchBarComponent {
    @ViewChild(SearchBarComponent) searchBar;
    placeholder: string = '';

    onSearchTriggered(e): void {
    }

    onSearchTyped(e): void {
    }

    onSearchQueued(e): void {
    }
  }
});
