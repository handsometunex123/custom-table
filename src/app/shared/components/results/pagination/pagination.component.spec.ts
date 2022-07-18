import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  const data = {
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
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should sets the current page when the items to be paginated changes', () => {
      component.pager = {
        currentPage: 1
      };
      spyOn(component, 'setPage');
      const items: SimpleChange = {
        currentValue: data,
        firstChange: true,
        previousValue: {...data, login: 'ftr' },
        isFirstChange(){
          return true
        }
      }
      const pageSize: SimpleChange = {
        currentValue: 9,
        firstChange: true,
        previousValue: undefined,
        isFirstChange(){
          return true
        }
      }
      const changes: SimpleChanges = {
        items: items,
        pageSize: pageSize
      }
      component.ngOnChanges(changes);

      expect(component.setPage).toHaveBeenCalledWith(1);
    });
  });

  describe('setPage', () => {
    it('should set the page data', () => {
      spyOn(component, 'paginate');
      spyOn(component.changePage, 'emit');
      component.items = [data];
      component.pageSize = 9;
      component.maxPages = 10;

      fixture.detectChanges();

      component.setPage(1);

      expect(component.paginate).toHaveBeenCalledWith(1, 1, 9, 10);
      expect(component.changePage.emit).toHaveBeenCalled();
    });
  });

  describe('paginate', () => {
    it('should paginate the data', () => {
      const paginate = component.paginate(10, 1, 10, 10);
      expect(paginate).toEqual({
        totalItems: 10,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        startPage: 1,
        endPage: 1,
        startIndex: 0,
        endIndex: 9,
        pages: [1]
      });
    })
  });


  describe('view', () => {
    it('should render the paginator component', () => {
      component.pageSize = 9;
      fixture.detectChanges();
      const paginator = fixture.debugElement.query(By.css('#pagination')).nativeElement;
      const firstPageButton = fixture.debugElement.query(By.css('#first-page-button')).nativeElement;
      const lastPageButton = fixture.debugElement.query(By.css('#last-page-button')).nativeElement;

      const previousButton = fixture.debugElement.query(By.css('#previous-button')).nativeElement;
      const nextButton = fixture.debugElement.query(By.css('#next-button')).nativeElement;

      expect(paginator).toBeTruthy();
      expect(firstPageButton).toBeTruthy();
      expect(previousButton).toBeTruthy();
      expect(previousButton.innerText.trim()).toEqual('PREVIOUS 9 USERS');
      expect(nextButton.innerText.trim()).toEqual('NEXT 9 USERS');
      expect(lastPageButton.innerText.trim()).toEqual('LAST PAGE');
      expect(firstPageButton.innerText.trim()).toEqual('FIRST PAGE');
    })
  });
});
