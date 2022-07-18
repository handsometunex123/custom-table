import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DataCellComponent } from './data-cell.component';

describe('DataCellComponent', () => {
  let component: DataCellComponent;
  let fixture: ComponentFixture<DataCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataCellComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCellComponent);
    component = fixture.componentInstance;
    component.config = {
      hideOverflow: true,
    }
    component.data = 'Testname'
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test for setting the fixed width of a data cell
  describe('setFixedWidth', () => {
    it('should set the widthStyling for the cells to the string value specified as the fixed width', () => {
      component.fWidth = '10%'

      expect(component.widthStyling).toEqual('10%');
    });

    it('should set the widthStyling for the cells with px appended to it if the provided fixed width is a number', () => {
      component.fWidth = 10

      expect(component.widthStyling).toEqual('10px');
    });

    it('should set the widthStyling to auto if no value is provided to the fWidth', () => {
      component.fWidth = ''

      expect(component.widthStyling).toEqual('auto');
    });

    it('should determine if the widthStyling is in percent in order to evaluate the proper style to apply to the child cell', () => {
      component.fWidth = '10%'

      expect(component.isPercent).toBeTrue();
    });
  });

  // test for setting the data for a data cell
  describe('setData', () => {
    it('should set the original value passed down from the data and map the data to the correct config key', () => {
      component.config.name = 'avatar_url';
      component.data = {
        "login": "foo",
        "id": 33384,
        "node_id": "MDQ6VXNlcjMzMzg0",
        "avatar_url": "https://avatars.githubusercontent.com/u/33384?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/foo",
        "html_url": "https://github.com/foo",
        "followers_url": "https://api.github.com/users/foo/followers",
        "following_url": "https://api.github.com/users/foo/following{/other_user}",
        "gists_url": "https://api.github.com/users/foo/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/foo/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/foo/subscriptions",
        "organizations_url": "https://api.github.com/users/foo/orgs",
        "repos_url": "https://api.github.com/users/foo/repos",
        "events_url": "https://api.github.com/users/foo/events{/privacy}",
        "received_events_url": "https://api.github.com/users/foo/received_events",
        "type": "User",
        "site_admin": false,
        "score": 1.0
      }

      fixture.detectChanges();

      expect(component.data).toEqual('https://avatars.githubusercontent.com/u/33384?v=4');
    });

    it('should set the widthStyling for the cells with px appended to it if the provided fixed width is a number', () => {
      component.fWidth = 10

      expect(component.widthStyling).toEqual('10px');
    });

    it('should set the widthStyling to auto if no value is provided to the fWidth', () => {
      component.fWidth = ''

      expect(component.widthStyling).toEqual('auto');
    });

    it('should determine if the widthStyling is in percent in order to evaluate the proper style to apply to the child cell', () => {
      component.fWidth = '10%'

      expect(component.isPercent).toBeTrue();
    });
  });

  // test for ensuring the view renders as expected
  describe('view', () => {
    it('should render the cell', () => {
      const cellWrapper: HTMLElement = fixture.debugElement.query(By.css('#cell')).nativeElement;

      expect(cellWrapper).toBeTruthy();
    });

    it('should apply the is-first-child class if it is the first cell', () => {
      component.index = 0;
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(By.css('#cell')).nativeElement;
      expect(cellWrapper.classList.contains('is-first-child')).toBeTruthy();
    });

    it('should apply the is-last-child class if it is the last cell', () => {
      component.index = 2; // (3 - 1) is used here because arrays by default use 0 based indexing
      component.count = 3; // assumed length of the columns
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(By.css('#cell')).nativeElement;

      expect(cellWrapper.classList.contains('is-last-child')).toBeTruthy();
    });

    it('should hide overflow if hideOverflow is true', () => {
      component.config.hideOverflow = true;
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(By.css('#cell')).nativeElement;

      expect(cellWrapper.classList.contains('hide-overflow')).toBeTruthy();
    });

    it('should set cell alignment to right if config align is right', () => {
      component.config.align = 'right';
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(By.css('#cell')).nativeElement;

      expect(cellWrapper.classList.contains('right')).toBeTruthy();
    });

    it('should set cell alignment to center if config align is center', () => {
      component.config.align = 'center';
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(By.css('#cell')).nativeElement;

      expect(cellWrapper.classList.contains('center')).toBeTruthy();
    });

    it('should set cell width to auto if config width is in percent', () => {
      component.isPercent = true;
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(By.css('#cell')).nativeElement;

      expect(cellWrapper.style.width).toEqual('auto');
    });

    it('should set cell width to the specified widthStyling if not in %', () => {
      component.isPercent = false;
      component.widthStyling = '10px';
      fixture.detectChanges();

      const cellWrapper: HTMLElement = fixture.debugElement.query(By.css('#cell')).nativeElement;

      expect(cellWrapper.style.width).toEqual('10px');
    });

    it('should render the appropriate cell value', () => {
      component.config.name = 'avatar_url';
      component.data = {
        "login": "foo",
        "id": 33384,
        "node_id": "MDQ6VXNlcjMzMzg0",
        "avatar_url": "https://avatars.githubusercontent.com/u/33384?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/foo",
        "html_url": "https://github.com/foo",
        "followers_url": "https://api.github.com/users/foo/followers",
        "following_url": "https://api.github.com/users/foo/following{/other_user}",
        "gists_url": "https://api.github.com/users/foo/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/foo/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/foo/subscriptions",
        "organizations_url": "https://api.github.com/users/foo/orgs",
        "repos_url": "https://api.github.com/users/foo/repos",
        "events_url": "https://api.github.com/users/foo/events{/privacy}",
        "received_events_url": "https://api.github.com/users/foo/received_events",
        "type": "User",
        "site_admin": false,
        "score": 1.0
      }
      fixture.detectChanges();

      expect().nothing();

      const cellValue: HTMLElement = fixture.debugElement.query(By.css('#value')).nativeElement;

      expect(cellValue.innerText.trim()).toEqual('https://avatars.githubusercontent.com/u/33384?v=4');
    });
  });
});
