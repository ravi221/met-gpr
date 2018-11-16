import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component} from '@angular/core';
import {FilterChipsComponent} from './filter-chips.component';
import {IFilterChip} from '../../interfaces/iFilterChip';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';

describe('FilterChipsComponent', () => {
  let component: TestFilterChipsComponent;
  let fixture: ComponentFixture<TestFilterChipsComponent>;
  const filterChips: IFilterChip[] = [
    {
      property: 'prop1',
      value: 'Test Value - 1'
    },
    {
      property: 'prop2',
      value: 'Test Value - 2'
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFilterChipsComponent, FilterChipsComponent, IconComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestFilterChipsComponent);
        component = fixture.componentInstance;
        component.filterChips = [...filterChips];
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should call event emitter when the filter chip is remove is clicked', () => {
    const spy = spyOn(component, 'onFilterChipRemove').and.stub();
    const filterChipRemove = fixture.debugElement.query(By.css('.filter-chip:first-child .filter-chip-remove'));
    click(filterChipRemove);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(filterChips[0]);
  });

  it('should remove the filter chip from the list when clicking the remove icon', () => {
    let allFilterChips = fixture.debugElement.queryAll(By.css('.filter-chip'));
    expect(allFilterChips.length).toBe(2);

    const filterChipRemove = fixture.debugElement.query(By.css('.filter-chip:first-child .filter-chip-remove'));
    click(filterChipRemove, fixture);

    allFilterChips = fixture.debugElement.queryAll(By.css('.filter-chip'));
    expect(allFilterChips.length).toBe(1);
  });

  @Component({
    template: `
      <gpr-filter-chips [filterChips]="filterChips" (remove)="onFilterChipRemove($event)"></gpr-filter-chips>`
  })
  class TestFilterChipsComponent {
    public filterChips: IFilterChip[] = [
      {
        property: 'prop1',
        value: 'Test Value - 1'
      },
      {
        property: 'prop2',
        value: 'Test Value - 2'
      }
    ];

    public onFilterChipRemove(e) {
    }
  }
});
