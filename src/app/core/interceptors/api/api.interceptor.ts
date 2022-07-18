import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private errorHandlingService: ErrorHandlerService) {}

  /**
   * intercepts the Http request and append the api custom url to the base Url
   * intercepts the http responses in a case when there is an error and send to the error handling service
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      url: `${environment.baseApi}/${request.url}`
    })
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => this.errorHandlingService.handleError(error)));
  }
}
