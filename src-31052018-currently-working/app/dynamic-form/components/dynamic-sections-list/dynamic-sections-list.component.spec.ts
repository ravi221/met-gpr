import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import * as data from '../../../../assets/test/dynamic-form/data-manager.mock.json';

import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import FormConfig from '../../config/form-config';
import {By} from '@angular/platform-browser';
import {DebugElement, SimpleChange} from '@angular/core';

import {DynamicSectionsListComponent} from './dynamic-sections-list.component';
import CategoryConfig from '../../config/category-config';
import SectionConfig from '../../config/section-config';
import {UIControlsModule} from '../../../ui-controls/ui-controls.module';
import {click} from '../../../../assets/test/TestHelper';
import {DynamicSectionsListItemStubComponent} from '../dynamic-sections-list-item/dynamic-sections-list-item.component.stub';
import DataManager from '../../classes/data-manager';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../assets/test/NavStateHelper';

describe('DynamicSectionsListComponent', () => {
  let component: DynamicSectionsListComponent;
  let fixture: ComponentFixture<DynamicSectionsListComponent>;
  let formConfig: FormConfig;
  let model: DataManager;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UIControlsModule],
      declarations: [DynamicSectionsListComponent, DynamicSectionsListItemStubComponent],
    }).compileComponents();
    formConfig = new FormConfig(configuration);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicSectionsListComponent);
    component = fixture.componentInstance;
    component.config = formConfig;
    let navState: INavState = getNavStateForDataManager(data);
    formConfig.activateCategoryById('mockCategory');
    model = formConfig.initializeModel(navState);
    component.model = model;
    const category: CategoryConfig = formConfig.categories[0];
    component.config.activateCategoryById(category.categoryId);
    const section: SectionConfig = category.sections[0];
    component.config.activateSectionById(section.sectionId);
    fixture.detectChanges();
  });

  it('should render the correct number of sections', () => {
    const expected = formConfig.categories[0].sections.length;

    component.ngOnChanges({config: new SimpleChange(null, component.config, false)});
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css('li'));
    expect(elements).toBeTruthy();
    expect(elements.length).toEqual(expected);
  });

  it('should render the correct section labels', () => {
    component.ngOnChanges({config: new SimpleChange(null, component.config, false)});
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css('li'));
    elements.forEach((el, index) => {
      const sectionName = component.config.categories[0].sections[index].label;
      expect(el.nativeElement.textContent.trim()).toContain(sectionName);
    });
  });

  it('should apply the active class to active section', () => {
    const expected = formConfig.getSection('mockSection');
    component.ngOnChanges({config: new SimpleChange(null, component.config, false)});
    fixture.detectChanges();
    const activeElement = fixture.debugElement.query(By.css('li.active'));
    expect(activeElement).toBeTruthy();
    expect(activeElement.nativeElement.textContent.trim()).toContain(expected.label);
  });

  it('should activate a section on click', fakeAsync(() => {
    const expected = formConfig.getSection('mockSection2');
    component.ngOnChanges({config: new SimpleChange(null, component.config, false)});
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css('a'));
    const linkElement: DebugElement = elements[1];
    click(linkElement);
    tick();
    fixture.detectChanges();

    expect(component.activeSectionId).toEqual(expected.sectionId);
    expect(linkElement.parent.parent.nativeElement.classList.contains('active')).toBeTruthy();
    expect(linkElement.nativeElement.textContent.trim()).toEqual(expected.label);
  }));

  it('should not activate a disabled section on click', fakeAsync(() => {
    const expected = formConfig.getSection('mockSection2');
    expected.state.isDisabled = true;
    component.ngOnChanges({config: new SimpleChange(null, component.config, false)});
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css('a'));
    const linkElement: DebugElement = elements[1];
    click(linkElement);
    tick();
    fixture.detectChanges();

    expect(component.activeSectionId).not.toEqual(expected.sectionId);
    expect(linkElement.parent.nativeElement.classList.contains('active')).toBeFalsy();
  }));


});
