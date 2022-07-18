import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import {
  User,
  UserSearchResponseModel,
} from 'src/app/models/api/users/user-search-response.model';
import { ResultsTableConfiguration } from 'src/app/shared';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'scalio-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * List of users
   */
  public users: User[] = [];

  /**
   * subject to be updated on component destroy in order to stop the stream from continuously emitting
   */
  private _destroy$ = new Subject();

  /**
   * Data table configuration
   */
  public config!: ResultsTableConfiguration;

  /**
   * This is the search string supplied by the user
   */
  public searchString!: string;

  /**
   * This determines if the loader should show or not
   */
  public showLoadingScreen!: boolean;

  /**
   * This determines if the data is currently been retrieved from the API
   */
  public isLoading!: boolean;

  /**
   *
   * @param userService The user service is injected to be able to retrieve the list of users via an HTTP request
   * @param layoutService The layout service is injected in order to access the loader or the notification serrvice
   */
  constructor(
    private userService: UsersService,
    private layoutService: LayoutService
  ) {}

  /**
   * Triggered on component init
   */
  public ngOnInit(): void {
    /**
     * retrieves the current state of the loader and updates the showLoadingScreen variable
     */
    this.layoutService.loadingRequest$
      .pipe(takeUntil(this._destroy$))
      .subscribe((isLoadingScreenVisible) => {
        this.showLoadingScreen = isLoadingScreenVisible;
      });
  }

  /**
   * Method sets up the users table configuration
   */
  private _setTableConfiguration(): void {
    /* this is the data table config. if commented out, the table automatically
    gets build up based on the api response object key
    */
    this.config = {
      // This specifies the column to be sorted by default as well as the sort direction
      defaultSort: {
        name: 'login',
        direction: 'asc',
      },
      /* This are the columns the user wants displayed. User can proceed to add as much column
         provided the name is exact with the key name on the API.
         name: name of the key to be displayed from the response,
         sort: name of the key to be sorted from the API.
         label: this the custom label that the user wants displayed on the header of the column
         sortable: specifies if the column is sortable or not.
         width: custom width of the column as specified by the user.
         ... There are other customizations possible like hiding of the column header or the actual column
      */
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
    };
  }

  /**
   * method gets the lists of users.
   * @param userString the provided search param in the search input
   */
  private _getUsers(userString: string): void {
    this.isLoading = true;
    this.userService
      .getUsers(userString)
      .pipe(takeUntil(this._destroy$))
      .subscribe((users: UserSearchResponseModel) => {
        this.users = users.items;
        this.isLoading = false;
        this._setTableConfiguration();
      });
  }

  /**
   * gets the search string typed in by the user
   */
  public getSearchString(userString: string): void {
    if (userString) {
      this.searchString = userString;
      this._getUsers(userString);
    } else {
      this.layoutService.updateAlertNotification({
        type: 'info',
        message: 'Kindly provide a search value for the login input',
        duration: 5,
      });
    }
  }

  /**
   * called on componenent destroy
   * updates the destroy$ subject to stop the user stream from continuously emmitting
   */
  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
