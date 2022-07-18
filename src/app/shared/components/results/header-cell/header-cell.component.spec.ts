import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColumnConfiguration } from 'src/app/shared';

import { HeaderCellComponent } from './header-cell.component';

describe('HeaderCellComponent', () => {
  let component: HeaderCellComponent;
  let fixture: ComponentFixture<HeaderCellComponent>;

  const config: ColumnConfiguration = {
    name: 'login',
    sort: 'login',
    label: 'login',
    sortable: true,
    width: '35%',
    isHeaderHidden: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderCellComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderCellComponent);
    component = fixture.componentInstance;
    component.config = config;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setFixedWidth', () => {
    it('should set the widthStyling to the value passed on as the fixed width', () => {
      component.fWidth = '10%';

      expect(component.widthStyling).toEqual('10%');
    });

    it('should set the widthStyling for the cells with px appended to it if the provided fixed width is a number', () => {
      component.fWidth = 10;

      expect(component.widthStyling).toEqual('10px');
    });

    it('should set the widthStyling to auto if no value is provided to the fWidth', () => {
      component.fWidth = '';

      expect(component.widthStyling).toEqual('auto');
    });
  });

  describe('setTh', () => {
    it('should set the isThClass to true if value passed on is true', () => {
      component.isTh = true;

      expect(component.isThClass).toEqual(true);
    });

    it('should set the isThClass to false if value passed on is false', () => {
      component.isTh = false;

      expect(component.isThClass).toEqual(false);
    });
  });

  describe('view', () => {
    it('should render the header cell', () => {
      const headerCellWrapper: HTMLElement = fixture.debugElement.query(
        By.css('#cell')
      ).nativeElement;

      expect(headerCellWrapper).toBeTruthy();
    });

    it('should apply the is-first-child class if it is the first cell', () => {
      component.index = 0;
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(
        By.css('#cell')
      ).nativeElement;
      expect(cellWrapper.classList.contains('is-first-child')).toBeTruthy();
    });

    it('should apply the is-last-child class if it is the last cell', () => {
      component.index = 2; // (3 - 1) is used here because arrays by default use 0 based indexing
      component.count = 3; // assumed length of the columns
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(
        By.css('#cell')
      ).nativeElement;

      expect(cellWrapper.classList.contains('is-last-child')).toBeTruthy();
    });

    it('should apply the is-sortable class when the config configuration for sortable is true', () => {
      component.config.sortable = true;
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(
        By.css('#cell')
      ).nativeElement;

      expect(cellWrapper.classList.contains('is-sortable')).toBeTruthy();
    });

    it('should set cell alignment to right if config align is right', () => {
      component.config.align = 'right';
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(
        By.css('#cell')
      ).nativeElement;

      expect(cellWrapper.classList.contains('right')).toBeTruthy();
    });

    it('should set cell alignment to center if config align is center', () => {
      component.config.align = 'center';
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(
        By.css('#cell')
      ).nativeElement;

      expect(cellWrapper.classList.contains('center')).toBeTruthy();
    });

    it('should render the column header label wrapper when isHeaderHidden configuration is false', () => {
      component.config.isHeaderHidden = false;
      fixture.detectChanges();

      const columnHeaderLabelWrapper: HTMLElement = fixture.debugElement.query(By.css('#column-header-label')).nativeElement;

      expect(columnHeaderLabelWrapper).toBeTruthy();
    });

    it('should render the ascending order icon if the column is sortable and the sort direction is ascending order', () => {
      component.config = config;
      component.config.isHeaderHidden = false;
      component.config.sortable = true;
      component.sortDirection = 'asc';
      fixture.detectChanges();

      const ascendingSortIcon: HTMLElement = fixture.debugElement.query(
        By.css('#sort-asc-icon')
      ).nativeElement;

      expect(ascendingSortIcon).toBeTruthy();
      expect(fixture.debugElement.query(By.css('#sort-desc-icon'))).toBeFalsy();
    });

    it('should render the descending order icon if the column is sortable and the sort direction is descending order', () => {
      component.config.isHeaderHidden = false;
      component.config.sortable = true;
      component.sortDirection = 'desc';
      fixture.detectChanges();

      const descendingSortIcon: HTMLElement = fixture.debugElement.query(
        By.css('#sort-desc-icon')
      ).nativeElement;

      expect(descendingSortIcon).toBeTruthy();
      expect(fixture.debugElement.query(By.css('#sort-asc-icon'))).toBeFalsy();
    });

    it('should display an empty span if isHeaderHidden config entry is true', () => {
      component.config.isHeaderHidden = true;
      fixture.detectChanges();

      const emptyColumnHeader: HTMLElement = fixture.debugElement.query(
        By.css('#empty-column-header-label')
      ).nativeElement;

      expect(emptyColumnHeader).toBeTruthy();
      expect(emptyColumnHeader.innerText.trim()).toEqual('');
    });

    it('should not render the column header label wrapper when isHeaderHidden configuration is true', () => {
      component.config.isHeaderHidden = true;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('#column-header-label'))
      ).toBeFalsy();
    });
  });
});
