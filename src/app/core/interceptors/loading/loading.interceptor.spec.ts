import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LayoutService } from 'src/app/services/layout.service';
import { UsersService } from 'src/app/services/users.service';
import { ApiInterceptor } from 'src/app/core/interceptors/api/api.interceptor';
import { LoadingInterceptor } from './loading.interceptor';

describe('LoadingInterceptor', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  let layoutService: LayoutService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true,
        },
        LoadingInterceptor,
      ],
    });
    layoutService = TestBed.inject(LayoutService);
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UsersService);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should confirm that the interceptor is available', () => {
    const interceptor: LoadingInterceptor = TestBed.inject(LoadingInterceptor);
    expect(interceptor).toBeTruthy();
  });

  describe('baseUrlAppended', () => {
    it('update the loader request to trigger the loading component', () => {
      spyOn(layoutService, 'updateLoaderRequest');
      service.getUsers('foo').subscribe(res => {
      });
      const reqMock = httpMock.expectOne(
        (req) =>
          req.method === 'GET' &&
          req.url === 'https://api.github.com/search/users'
      );
      expect(reqMock.request.url).toBe('https://api.github.com/search/users');
      expect(layoutService.updateLoaderRequest).toHaveBeenCalled();
    });
  });
});
