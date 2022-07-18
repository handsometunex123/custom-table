import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private layoutService: LayoutService) {}

  /**
   * intercepts the Http request and sets the loader to true to show loader when a request is currently ongoing
   * sets the loader state back to false when the request has been completed or failed - we dont want the app to keep loading when the api call fails
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.method === 'HEAD' || request.method === 'OPTIONS'){
      return next.handle(request);
    } else {
      // sets the loader state to true  - loader appears at this point
      this.layoutService.updateLoaderRequest(true);
      return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // if request completes, sets the loader state back to false - loader dissapears at this point
          this.layoutService.updateLoaderRequest(false);
        }
      },
      (err: any) => {
        // if request failed, sets the loader state back to false - loader dissapears at this point
        this.layoutService.updateLoaderRequest(false);
      })
      );
    }
  }
}
