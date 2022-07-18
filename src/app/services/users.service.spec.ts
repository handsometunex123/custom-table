import { getTestBed, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { UsersService } from 'src/app/services/users.service';
import { UserSearchResponseModel } from 'src/app/models/api/users/user-search-response.model';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { take } from 'rxjs';
import { ApiInterceptor } from 'src/app/core/interceptors/api/api.interceptor';

describe('UsersService', () => {
  let service: UsersService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const fakeData: UserSearchResponseModel = {
    total_count: 14956,
    incomplete_results: false,
    items: [
      {
        login: 'foo',
        id: 33384,
        node_id: 'MDQ6VXNlcjMzMzg0',
        avatar_url: 'https://avatars.githubusercontent.com/u/33384?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/foo',
        html_url: 'https://github.com/foo',
        followers_url: 'https://api.github.com/users/foo/followers',
        following_url:
          'https://api.github.com/users/foo/following{/other_user}',
        gists_url: 'https://api.github.com/users/foo/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/foo/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/foo/subscriptions',
        organizations_url: 'https://api.github.com/users/foo/orgs',
        repos_url: 'https://api.github.com/users/foo/repos',
        events_url: 'https://api.github.com/users/foo/events{/privacy}',
        received_events_url: 'https://api.github.com/users/foo/received_events',
        type: 'User',
        site_admin: false,
        score: 1.0,
      },
      {
        login: 'foosel',
        id: 83657,
        node_id: 'MDQ6VXNlcjgzNjU3',
        avatar_url: 'https://avatars.githubusercontent.com/u/83657?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/foosel',
        html_url: 'https://github.com/foosel',
        followers_url: 'https://api.github.com/users/foosel/followers',
        following_url:
          'https://api.github.com/users/foosel/following{/other_user}',
        gists_url: 'https://api.github.com/users/foosel/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/foosel/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/foosel/subscriptions',
        organizations_url: 'https://api.github.com/users/foosel/orgs',
        repos_url: 'https://api.github.com/users/foosel/repos',
        events_url: 'https://api.github.com/users/foosel/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/foosel/received_events',
        type: 'User',
        site_admin: false,
        score: 1.0,
      },
      {
        login: 'foone',
        id: 171369,
        node_id: 'MDQ6VXNlcjE3MTM2OQ==',
        avatar_url: 'https://avatars.githubusercontent.com/u/171369?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/foone',
        html_url: 'https://github.com/foone',
        followers_url: 'https://api.github.com/users/foone/followers',
        following_url:
          'https://api.github.com/users/foone/following{/other_user}',
        gists_url: 'https://api.github.com/users/foone/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/foone/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/foone/subscriptions',
        organizations_url: 'https://api.github.com/users/foone/orgs',
        repos_url: 'https://api.github.com/users/foone/repos',
        events_url: 'https://api.github.com/users/foone/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/foone/received_events',
        type: 'User',
        site_admin: false,
        score: 1.0,
      },
    ],
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true
        },
        UsersService
      ],
    });
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    service = TestBed.inject(UsersService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUsers', () => {
    it('getUsers should return data', () => {
      service.getUsers('foo').pipe(take(1)).subscribe((res) => {
        expect(res).toEqual(fakeData);
      });
      const reqMock = httpMock.expectOne(
        (req) =>
          req.method === 'GET' &&
          req.url ==='https://api.github.com/search/users'
      );
      expect(reqMock.request.method).toBe('GET');
      reqMock.flush(fakeData);
    });
  });
});
