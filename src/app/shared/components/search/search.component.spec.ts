import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockModule } from 'ng-mocks';
import { SearchComponent } from 'src/app/shared/components/search/search.component';


describe('SearchInputComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MockModule(FormsModule)
      ],
      declarations: [ SearchComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setInitValue', () => {
    it('should set the initial value of currentTextValue and initialValue to the value provided for the initial value', () => {
      component.initValue = 'foo';

      expect(component.currentTextValue).toEqual('foo');
      expect(component.initialValue).toEqual('foo');
    });
  });

  describe('submitSearch', () => {
    it('should emit the search strring to the parent component', () => {
      spyOn(component.searchStringEvent, 'emit');

      component.currentTextValue = 'foo';
      component.submitSearch();

      expect(component.searchStringEvent.emit).toHaveBeenCalledWith('foo');
    });
  });

  describe('clearEvent', () => {
    it('should clear the main values for the input, reseting it to the original state', () => {
      component.initialValue = 'test text';
      component.currentTextValue = 'test text';
      fixture.detectChanges();

      component.clearEvent();

      expect(component.initialValue).toBe('');
      expect(component.currentTextValue).toBe('');
    });
  });

  describe('view', () => {
    it('should show the search input and submit button', () => {
      const searchInputWrapper: HTMLElement = fixture.debugElement.query(By.css('#search')).nativeElement;
      const searchInputTextField: HTMLElement = fixture.debugElement.query(By.css('#search-input')).nativeElement;
      const submitButton: HTMLElement = fixture.debugElement.query(By.css('#submit-button')).nativeElement;

      expect(searchInputWrapper).toBeTruthy();
      expect(searchInputTextField).toBeTruthy();
      expect(submitButton).toBeTruthy();
      expect(submitButton.innerText.trim()).toEqual('SUBMIT');
    });
  });


});
