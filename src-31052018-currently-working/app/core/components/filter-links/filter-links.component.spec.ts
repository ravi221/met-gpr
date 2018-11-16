import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component} from '@angular/core';
import {FilterLinksComponent} from './filter-links.component';
import {IFilterLink} from '../../interfaces/iFilterLink';

describe('FilterLinksComponent', () => {
  let component: TestFilterLinksComponent;
  let fixture: ComponentFixture<TestFilterLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFilterLinksComponent, FilterLinksComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestFilterLinksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should call event emitter when the filter link is clicked', () => {
    const spy = spyOn(component, 'onFilterLinkChange').and.stub();
    const filterLink = fixture.debugElement.query(By.css('.filter-link a'));
    click(filterLink);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      filter: {
        data: 1
      },
      label: 'Test',
      subLinks: [],
      active: true
    });
  });

  it('should set the link to active when clicked', () => {
    expect(component.filterLinks[0].active).toBeFalsy();
    const filterLink = fixture.debugElement.query(By.css('.filter-link a'));
    click(filterLink, fixture);
    expect(component.filterLinks[0].active).toBeTruthy();
  });

  @Component({
    template: `
      <gpr-filter-links [filterLinks]="filterLinks"
                        (filterLinkChange)="onFilterLinkChange($event)"></gpr-filter-links>`
  })
  class TestFilterLinksComponent {
    public filterLinks: IFilterLink[] = [{
      filter: {
        data: 1
      },
      label: 'Test',
      subLinks: [],
      active: false
    }];

    public onFilterLinkChange(e) {
    }
  }
});
