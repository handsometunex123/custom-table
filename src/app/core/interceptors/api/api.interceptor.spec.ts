import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UsersService } from 'src/app/services/users.service';
import { ApiInterceptor } from './api.interceptor';

describe('ApiInterceptor', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  let errorHandlingService: ErrorHandlerService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true,
        },
        ApiInterceptor,
      ],
    });
    errorHandlingService = TestBed.inject(ErrorHandlerService);
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UsersService);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should confirm that the interceptor is available', () => {
    const interceptor: ApiInterceptor = TestBed.inject(ApiInterceptor);
    expect(interceptor).toBeTruthy();
  });

  describe('baseUrlAppended', () => {
    it('should append the baseUrl to the request', () => {
      service.getUsers('foo').subscribe();
      const reqMock = httpMock.expectOne(
        (req) =>
          req.method === 'GET' &&
          req.url ==='https://api.github.com/search/users'
      );
      expect(reqMock.request.url).toBe('https://api.github.com/search/users');
    });
  });

  describe('errorHandling', () => {
    it('should call errorHandling service with the appropriate error', () => {
      spyOn(errorHandlingService, 'handleError').and.returnValue(of());

      const errorResponse = new HttpErrorResponse({
        "status":404,
        "statusText":"OK",
        "url":"https://api.github.com/search/users?q=ff%20in:login",
        "error":{"message":"Not Found","documentation_url":"https://docs.github.com/rest"}
      });

      service.getUsers('foo').subscribe();
      const request = httpMock.expectOne("https://api.github.com/search/users?q=foo%20in:login");
      const mockError = new ProgressEvent('error');
      request.error(mockError, errorResponse);
      expect(errorHandlingService.handleError).toHaveBeenCalled();
    });
  })
});
