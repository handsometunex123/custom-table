import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private layoutService: LayoutService,
  ) { }

  // method handles the application error
  handleError(error?: Error | HttpErrorResponse): Observable<never> {
    console.log(JSON.stringify(error));
    let errormessage: string;
    if (!navigator.onLine) {
      errormessage =
        'No Internet Connection. Please check your internet provider';
    } else if (error instanceof HttpErrorResponse) {
      errormessage = this.getServerErrorMessage(error);
    } else {
      errormessage = error?.message ? error.message : error?.toString() ?? 'An error occurred';
    }
    this.showErrorNotification(errormessage);
    return throwError(errormessage);
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    let message = 'No Internet Connection. Please check your internet provider';
    if (!navigator.onLine) {
      return message;
    } else {
      message = this.processErrorMessage(error);
      return message;
    }
  }

  processErrorMessage(error: HttpErrorResponse): string {
    const apiErrorResponse = error.error;
    const message =
      apiErrorResponse?.message ||
      'An unknown error occurred and we are unable to handle your request. Please try again';
    return message
  }

  // method triggers the notification subject
  public showErrorNotification(message: string): void {
    this.layoutService.updateAlertNotification({
      type: 'warning',
      message,
      duration: 5
    })
  }
}
