import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { IMock, It, Mock, Times } from 'typemoq';
import { AppComponent } from 'src/app/app.component';
import { UsersService } from 'src/app/services/users.service';
import { LoaderComponent, NotificationComponent, ResultsComponent, ResultsTableConfiguration, SearchComponent } from './shared';
import { of } from 'rxjs';
import { UserSearchResponseModel } from 'src/app/models/api/users/user-search-response.model';
import { By } from '@angular/platform-browser';
import { LayoutService } from './services/layout.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockUserService: IMock<UsersService>;
  let layoutService: IMock<LayoutService>;

  const config: ResultsTableConfiguration = {
    defaultSort: {
      name: 'login',
      direction: 'asc',
    },
    columns: [
      {
        name: 'login',
        sort: 'login',
        label: 'login',
        sortable: true,
        width: '35%',
      },
      {
        name: 'type',
        sort: 'type',
        label: 'type',
        sortable: true,
        width: '25%',
      },
      {
        name: 'avatar_url',
        sort: 'avatar_url',
        label: 'avatar url',
        sortable: true,
      },
    ],
  }
  beforeEach(async () => {
    mockUserService = Mock.ofType<UsersService>();
    layoutService = Mock.ofType<LayoutService>();

    const fakeData: UserSearchResponseModel = {
      "total_count": 14956,
      "incomplete_results": false,
      "items": [
        {
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
        },
        {
          "login": "foosel",
          "id": 83657,
          "node_id": "MDQ6VXNlcjgzNjU3",
          "avatar_url": "https://avatars.githubusercontent.com/u/83657?v=4",
          "gravatar_id": "",
          "url": "https://api.github.com/users/foosel",
          "html_url": "https://github.com/foosel",
          "followers_url": "https://api.github.com/users/foosel/followers",
          "following_url": "https://api.github.com/users/foosel/following{/other_user}",
          "gists_url": "https://api.github.com/users/foosel/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/foosel/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/foosel/subscriptions",
          "organizations_url": "https://api.github.com/users/foosel/orgs",
          "repos_url": "https://api.github.com/users/foosel/repos",
          "events_url": "https://api.github.com/users/foosel/events{/privacy}",
          "received_events_url": "https://api.github.com/users/foosel/received_events",
          "type": "User",
          "site_admin": false,
          "score": 1.0
        },
        {
          "login": "foone",
          "id": 171369,
          "node_id": "MDQ6VXNlcjE3MTM2OQ==",
          "avatar_url": "https://avatars.githubusercontent.com/u/171369?v=4",
          "gravatar_id": "",
          "url": "https://api.github.com/users/foone",
          "html_url": "https://github.com/foone",
          "followers_url": "https://api.github.com/users/foone/followers",
          "following_url": "https://api.github.com/users/foone/following{/other_user}",
          "gists_url": "https://api.github.com/users/foone/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/foone/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/foone/subscriptions",
          "organizations_url": "https://api.github.com/users/foone/orgs",
          "repos_url": "https://api.github.com/users/foone/repos",
          "events_url": "https://api.github.com/users/foone/events{/privacy}",
          "received_events_url": "https://api.github.com/users/foone/received_events",
          "type": "User",
          "site_admin": false,
          "score": 1.0
        },
      ]
    }

    mockUserService.setup((service: UsersService) => service.getUsers(It.isAny()))
      .returns(() => of(fakeData));

    layoutService.setup((service: LayoutService) => service.notification$).returns(() => of({
      type: 'info',
      message: 'Kindly provide a search value for the login input',
      duration: 5
    }));

    layoutService.setup((service: LayoutService) => service.loadingRequest$).returns(() => of(true));
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MockModule(HttpClientModule)
      ],
      declarations: [
        AppComponent,
        MockComponent(SearchComponent),
        MockComponent(ResultsComponent),
        MockComponent(LoaderComponent),
        MockComponent(NotificationComponent)
      ],
      providers: [
        {
          provide: UsersService,
          useFactory: () => mockUserService.object
        },
        {
          provide: LayoutService,
          useFactory: () => layoutService.object
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


  describe('ngOnInit', () => {
    it('should show the loader when the loader state is true', () => {
      component.ngOnInit();
      expect(component.showLoadingScreen).toBeTrue();
    })
  })

  describe('getSearchString', () => {
    it('should get users from the getUsersEndpoint if there is a search string', () => {
      component.getSearchString('foo');

      mockUserService.verify((service: UsersService) => service.getUsers(It.isAny()), Times.once());
      expect(component.users.length).toEqual(3);
      expect(component.searchString).toEqual('foo');
      layoutService.verify((service: LayoutService) => service.updateAlertNotification(It.isAny()), Times.never());
    })

    it('should not call the getUsersEndpoint if there is a search string however, the notification service should be called', () => {
      component.getSearchString('');
      mockUserService.verify((service: UsersService) => service.getUsers(It.isAny()), Times.never());
      layoutService.verify((service: LayoutService) => service.updateAlertNotification(It.isAny()), Times.once());
      expect().nothing();
    })

    it('should set the table configuration and also set loading to false', () => {
      component.getSearchString('foo');

      expect(component.isLoading).toBeFalsy();
      expect(component.config).toEqual(config);
    })
  })

  describe('view', () => {
    it('should render the scalio search component', () => {
      const searchComponent: HTMLElement = fixture.debugElement.query(By.css('#scalio-search')).nativeElement;
      expect(searchComponent).toBeTruthy();
    });

    it('should render the loader component if the showLoaderScreen is true', () => {
      component.showLoadingScreen = true;
      fixture.detectChanges();

      const loadingScreen: HTMLElement = fixture.debugElement.query(By.css('#loading')).nativeElement;
      expect(loadingScreen).toBeTruthy();
    });

    it('should not render the loader component if the showLoaderScreen is false', () => {
      component.showLoadingScreen = false;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#loading'))).toBeFalsy();
    });

  })


});
