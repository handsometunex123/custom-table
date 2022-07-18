import {
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import {
  ColumnConfiguration,
  ResultsTableConfiguration,
} from 'src/app/shared/components/results/results-configuration.model';
import { ResultsTableSort } from 'src/app/shared';

@Component({
  selector: 'scalio-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  private readonly DEFAULT_PAGESIZE = 9;

  /**
   * This is the process type input property
   *
   * client is passed on whenever client side sorting or pagination is needed
   * server is passed on whenever server side sorting or pagination is needed // TO DO on request
   */
  @Input() public processType: 'client' | 'server' = 'client';

  /**
   * Indicates if the data is being loaded.
   */
  @Input() public isLoading = false;

  /**
   * This is the pagination size
   */
  @Input() pageSize = this.DEFAULT_PAGESIZE;

  /**
   * The user search input
   */
  @Input() searchInput!: string;

  /**
   * The column configuration matching the current sort column.
   */
  public currentSortColumn?: ColumnConfiguration | null;

  /**
   * table configuration data
   */
  private _config!: ResultsTableConfiguration;

  /**
   * The current page shown
   */
  public paginatedData: any[] = [];

  /**
   * Gets the datatable configuration.
   */
  public get config(): ResultsTableConfiguration {
    return this._config;
  }

  /**
   * Determines the current sort on the table
   */
  private _currentSort?: ResultsTableSort;

  /**
   * the data passed on to the table
   */
  private _data: any[] = [];

  /**
   * Sets the results table configuration.
   */
  @Input()
  public set config(value: ResultsTableConfiguration) {
    if (!value) {
      return;
    }
    this._config = value;
    if (this._config.columns) {
      // filter out the hidden columns
      this._config.columns = [
        ...this._config.columns.filter((x) => !x.hideColumn),
      ];
    }

    // retrieve the default sort param and set it as the current sort
    this.currentSort = this._config?.defaultSort;

    // sort the data on the client if the process type is client, if there is data and if there is a current sort
    if (this.processType === 'client' && this._data && this.currentSort) {
      this._sortData();
    }

    this._updateCurrentSortColumn();
  }

  /**
   * Sets the row data.
   */
  @Input()
  public set data(data: any[]) {
    this._data = data;
    // cases where there is no config provided, the app automatically builds up config from the api response key
    if ((!this._config || !this._config.columns || this._config.columns.length === 0) && data && data.length > 0) {
      this._buildConfig(data);
    }

    if (this.processType === 'client' && this.currentSort) {
      this._sortData();
    }
  }

  /**
   * Builds the column config off the data properties if there is no config.
   *
   * @param data The data to use.
   */
  private _buildConfig(data: any): void {
    this._config = !this._config ? {} : this._config;
    this._config.columns = Object.keys(data[0]).map(
      (key) => ({ label: key, name: key } as ColumnConfiguration)
    );
  }

  /**
   * Gets the row data.
   */
  public get data() {
    return this._data;
  }

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Sets the current sort.
   */
  public set currentSort(value: ResultsTableSort | undefined) {
    this._currentSort = value;
    this._updateCurrentSortColumn();
  }

  /**
   * Gets the current sort.
   */
  public get currentSort(): ResultsTableSort | undefined {
    return this._currentSort;
  }

  /**
   * Update the current sort column.
   */
  private _updateCurrentSortColumn(): void {
    // checks if the column is the currently sorted one
    if (!this.currentSort) {
      this.currentSortColumn = null;
      return;
    }

    if (this.config?.columns) {
      this.currentSortColumn = this.config.columns.find((column) =>
        this._sameColumnNames(
          this.currentSort?.name,
          column.sort ?? column.name
        )
      );
    }
  }

  /**
   * Determines if two column names are the same.
   *
   * @param a The first column names.
   * @param b The second column names.
   */
  private _sameColumnNames(
    a: string | undefined,
    b: string | undefined
  ): boolean {
    if (typeof a === 'string' && typeof b === 'string') {
      return a === b;
    }

    return false;
  }

  /**
   * Sorts the row data.
   */
  private _sortData() {
    this._data = this.sortClientData(this._data, this.currentSort);
  }

  /**
   * Method is called when the paginate buttons are clicked
   * It sets the currently displayed paginated data
   * @param pageOfItems the paginated items currently in view
   */
  onChangePage(pageOfItems: any[]): void {
    // update current page of items
    this.paginatedData = pageOfItems;
    this.cdr.detectChanges();
  }

  /**
   * Handles table header clicks.
   */
  public onHeaderClick(column: ColumnConfiguration): void {
    if (column.sortable) {
      if (this._sameColumnNames(this.currentSort?.name, column.sort ?? column.name)) {
        this.currentSort = {
          ...this.currentSort,
          direction: this.currentSort?.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        this.currentSort = {
          name: column.sort ?? column.name,
          direction: 'asc',
        };
      }

      this._updateCurrentSortColumn();

      switch (this.processType) {
        case 'client':
          this._sortData();
          break;
      }
    }
  }


  /**
   * Sorts the data provided by the users endpoint.
   *
   * @param data This is the data to be sorted.
   * @param sort This is how to the data is to be sorted.
   */
  public sortClientData(data: any[], sort: ResultsTableSort | undefined): any[] {
    if (sort == null || data == null) {
      return [];
    }
    // console.log('unsorted', data);
    data = [...data];
    const sortDirectionNumber = sort.direction === 'asc' ? 1 : -1;
    const name = sort.name as string;
    data.sort((a: any, b: any) => {
      if(a[name] > b[name]){
        return sortDirectionNumber
      }
      if (a[name] < b[name]) {
        return -sortDirectionNumber
      }
      return 0;
    });
    return data;
  }
}
