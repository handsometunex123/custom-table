import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { NotificationModel } from 'src/app/services/models/notification.model';

@Component({
  selector: 'scalio-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  public result!: NotificationModel;

  constructor(private layoutService: LayoutService) { }

  notification$ = this.layoutService.notification$.pipe(tap(res => {
    this.result = res;
    if(res.message){
      // close notification by default after specified duration.
      setTimeout(() => {
        this.closeNotification()
      }, (res.duration * 1000));
    }
  }));

  public closeNotification(): void {
    this.layoutService.updateAlertNotification({} as NotificationModel)
  }

}
