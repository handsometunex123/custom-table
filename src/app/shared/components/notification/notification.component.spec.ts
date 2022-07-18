import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LayoutService } from 'src/app/services/layout.service';
import { IMock, It, Mock, Times } from 'typemoq';
import { NotificationComponent } from 'src/app/shared';
import { of, take } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let layoutService: IMock<LayoutService>;


  beforeEach(async () => {
    layoutService = Mock.ofType<LayoutService>();

    layoutService.setup((service: LayoutService) => service.notification$).returns(() => of({
      type: 'warning',
      message: 'Error loading data',
      duration: 5
    }));

    layoutService.setup((service: LayoutService) => service.updateAlertNotification(It.isAny()))

    await TestBed.configureTestingModule({
      declarations: [ NotificationComponent ],
      providers: [
        {
          provide: LayoutService,
          useFactory: () => layoutService.object
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('notification$', () => {
    it('should trigger notification', fakeAsync(async() => {
      spyOn(component, 'closeNotification');
      component.notification$.pipe(take(1)).subscribe();

      layoutService.verify((service: LayoutService) => service.notification$, Times.once());

      // tick mimicks the set time out behavior
      tick(5 * 1000);
      fixture.detectChanges();
      expect(component.closeNotification).toHaveBeenCalled();
    }));
  });

  describe('closeNotification', () => {
    it('should close the notification component', () => {
      component.closeNotification();
      fixture.detectChanges();
      layoutService.verify((service: LayoutService) => service.updateAlertNotification(It.isAny()), Times.once());
      layoutService.verify((service: LayoutService) => service.notification$, Times.once());
      expect().nothing();
    });
  });

  describe('view', () => {
    it('should display the notification component', () => {
      fixture.detectChanges()
      const notificationContainer: HTMLElement = fixture.debugElement.query(By.css('#notification-container')).nativeElement;
      const notificationIcon: HTMLElement = fixture.debugElement.query(By.css('#fa-bell')).nativeElement;
      const notification: HTMLElement = fixture.debugElement.query(By.css('#notification')).nativeElement;

      const notificationContainerContent: HTMLElement = fixture.debugElement.query(By.css('#notification-container-content')).nativeElement;
      const notificationMessage: HTMLElement = fixture.debugElement.query(By.css('#notification-content')).nativeElement;

      const closeIcon: HTMLElement = fixture.debugElement.query(By.css('#close-icon')).nativeElement;

      expect(notificationContainer).toBeTruthy();
      expect(notificationIcon).toBeTruthy();
      expect(notification).toBeTruthy();
      expect(notificationContainerContent).toBeTruthy();
      expect(notificationMessage).toBeTruthy();
      expect(closeIcon).toBeTruthy();
    });
  })


});
