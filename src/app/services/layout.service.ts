import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationModel } from './models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  /**
   * Behaviour subject for the loading state
   */
  private loadingRequestSource = new BehaviorSubject(false);

  /**
   * Observable that return the state of the loading view.
   */
  public loadingRequest$ = this.loadingRequestSource.asObservable();

  /**
   * Behaviour subject for the notification state
   */
  private notificationSubject =  new BehaviorSubject({} as NotificationModel);

  /**
   * Observable that returns the state of the notfication.
   */
  public notification$ = this.notificationSubject.asObservable();

  /**
   * method updates the loading state of the application
   */
  public updateLoaderRequest(showLoader: boolean): void {
    this.loadingRequestSource.next(showLoader);
  }

  /**
   * method updates the notification state of the application.
   */
  public updateAlertNotification(notification: NotificationModel): void {
    this.notificationSubject.next(notification);
  }

  constructor() { }
}
