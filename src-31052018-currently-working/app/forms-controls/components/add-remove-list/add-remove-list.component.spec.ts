import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AddRemoveListComponent} from './add-remove-list.component';
import ChoiceConfig from '../../config/choice-config';
import StateConfig from '../../config/state-config';
import {By} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {click} from '../../../../assets/test/TestHelper';

describe('AddRemoveListComponent', () => {
  let component: TestAddRemoveListComponent;
  let fixture: ComponentFixture<TestAddRemoveListComponent>;
  let unselectedList: DebugElement[];
  let selectedList: DebugElement[];
  let addButton: DebugElement;
  let removeButton: DebugElement;

  function setFilterField(newFilterField: string): void {
    component.addRemoveList.unselectedFilterControl.setValue(newFilterField);
  }

  function updateFixture(): void {
    fixture.detectChanges();
    unselectedList = fixture.debugElement.queryAll(By.css('.unselected-list-container .selectable-list-item'));
    selectedList = fixture.debugElement.queryAll(By.css('.selected-list-container .selectable-list-item'));
    addButton = fixture.debugElement.query(By.css('.add-button'));
    removeButton = fixture.debugElement.query(By.css('.remove-button'));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TestAddRemoveListComponent, AddRemoveListComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestAddRemoveListComponent);
        component = fixture.componentInstance;
        updateFixture();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Rendering', () => {
    it('should render three items for the unselected list', () => {
      expect(unselectedList.length).toBe(3);
    });

    it('should properly render the value and label for a selectable item', () => {
      const unselectedListItem = unselectedList[0];
      expect(unselectedListItem.nativeElement.innerText).toContain('A - Test 1');
    });

    it('should render two items for the selected list', () => {
      expect(selectedList.length).toBe(2);
    });
  });

  describe('Filtering unselected choices', () => {
    it('should filter by value', fakeAsync(() => {
      setFilterField('A');
      tick(300);
      updateFixture();

      expect(unselectedList.length).toBe(1);
    }));

    it('should ignore case when filtering by value', fakeAsync(() => {
      setFilterField('a');
      tick(300);
      updateFixture();

      expect(unselectedList.length).toBe(1);
    }));

    it('should filter by label', fakeAsync(() => {
      setFilterField('Test 3');
      tick(300);
      updateFixture();

      expect(unselectedList.length).toBe(1);
    }));

    it('should ignore case when filtering by label', fakeAsync(() => {
      setFilterField('tESt 3');
      tick(300);
      updateFixture();

      expect(unselectedList.length).toBe(1);
    }));
  });

  describe('Disabling/Enabling Add and Remove buttons', () => {
    it('should enable the add button when clicking an unselected item', () => {
      click(unselectedList[0], fixture);
      expect(addButton.nativeElement.disabled).toBeFalsy();
    });

    it('should disable the remove button when clicking an unselected item', () => {
      click(unselectedList[0], fixture);
      expect(removeButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable the remove button when clicking a selected item', () => {
      click(selectedList[0], fixture);
      expect(removeButton.nativeElement.disabled).toBeFalsy();
    });

    it('should disable the add button when clicking a selected item', () => {
      click(selectedList[0], fixture);
      expect(addButton.nativeElement.disabled).toBeTruthy();
    });
  });

  describe('Adding choices', () => {
    it('should add choice to selected list', () => {
      click(unselectedList[0], fixture);
      click(addButton, fixture);
      updateFixture();

      expect(selectedList.length).toBe(3);
    });

    it('should remove choice from unselected list', () => {
      click(unselectedList[0], fixture);
      click(addButton, fixture);
      updateFixture();

      expect(unselectedList.length).toBe(2);
    });

    it('should emit the new values when a choice is added to the list', () => {
      const spy = spyOn(component, 'onValuesChange').and.stub();
      click(unselectedList[0], fixture);
      click(addButton, fixture);
      updateFixture();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(['A', 'B', 'D']);
    });
  });

  describe('Removing choices', () => {
    it('should add choice to unselected list', () => {
      click(selectedList[0], fixture);
      click(removeButton, fixture);
      updateFixture();

      expect(unselectedList.length).toBe(4);
    });

    it('should remove choice from selected list', () => {
      click(selectedList[0], fixture);
      click(removeButton, fixture);
      updateFixture();

      expect(selectedList.length).toBe(1);
    });

    it('should emit the new values when a choice is removed from the list', () => {
      const spy = spyOn(component, 'onValuesChange').and.stub();
      click(selectedList[0], fixture);
      click(removeButton, fixture);
      updateFixture();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(['D']);
    });
  });

  @Component({
    template: `
      <gpr-add-remove-list [selectedListLabel]="selectedListLabel"
                           [unselectedListLabel]="unselectedListLabel"
                           [selectedValues]="selectedValues"
                           [selectableChoices]="selectableChoices"
                           (selectedValuesChange)="onValuesChange($event)"></gpr-add-remove-list>`
  })
  class TestAddRemoveListComponent {
    @ViewChild(AddRemoveListComponent) addRemoveList;

    public selectedListLabel: string = 'Selected';
    public unselectedListLabel: string = 'Unselected';
    public selectedValues = [
      'B', 'D'
    ];
    public selectableChoices = [
      new ChoiceConfig({label: 'Test 1', value: 'A', state: new StateConfig({isDisabled: false})}),
      new ChoiceConfig({label: 'Test 2', value: 'B', state: new StateConfig({isDisabled: false})}),
      new ChoiceConfig({label: 'Test 3', value: 'C', state: new StateConfig({isDisabled: false})}),
      new ChoiceConfig({label: 'Test 4', value: 'D', state: new StateConfig({isDisabled: false})}),
      new ChoiceConfig({label: 'Test 5', value: 'E', state: new StateConfig({isDisabled: false})})
    ];
    public onValuesChange(e) {

    }
  }
});
