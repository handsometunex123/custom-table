import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataCellComponent, HeaderCellComponent, PaginationComponent, ResultsComponent, ResultsTableConfiguration } from 'src/app/shared';


describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  const config: ResultsTableConfiguration = {
    defaultSort: {
      name: 'login',
      direction: 'asc',
    },
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
      }
    ],
  }

  const data = [{
    "login": "foo",
    "id": 33384,
    "node_id": "MDQ6VXNlcjMzMzg0",
    "avatar_url": "https://avatars.githubusercontent.com/u/33384?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/foo",
    "html_url": "https://github.com/foo",
    "followers_url": "https://api.github.com/users/foo/followers",
    "following_url": "https://api.github.com/users/foo/following{/other_user}",
    "gists_url": "https://api.github.com/users/foo/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/foo/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/foo/subscriptions",
    "organizations_url": "https://api.github.com/users/foo/orgs",
    "repos_url": "https://api.github.com/users/foo/repos",
    "events_url": "https://api.github.com/users/foo/events{/privacy}",
    "received_events_url": "https://api.github.com/users/foo/received_events",
    "type": "User",
    "site_admin": false,
    "score": 1.0
  },
  {
    "login": "faa",
    "id": 83657,
    "node_id": "MDQ6VXNlcjgzNjU3",
    "avatar_url": "https://avatars.githubusercontent.com/u/83657?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/faa",
    "html_url": "https://github.com/faa",
    "followers_url": "https://api.github.com/users/faa/followers",
    "following_url": "https://api.github.com/users/faa/following{/other_user}",
    "gists_url": "https://api.github.com/users/faa/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/faa/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/faa/subscriptions",
    "organizations_url": "https://api.github.com/users/faa/orgs",
    "repos_url": "https://api.github.com/users/faa/repos",
    "events_url": "https://api.github.com/users/faa/events{/privacy}",
    "received_events_url": "https://api.github.com/users/faa/received_events",
    "type": "User",
    "site_admin": false,
    "score": 1.0
  }
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsComponent, HeaderCellComponent, DataCellComponent, PaginationComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setTableConfig', () => {
    it('should set the table configuration', () => {
      component.config = config;
      expect(component.config).toEqual(config);
    });

    it('should ignore hidden columns', () => {
      component.config = {...config, columns: [
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
          name: 'hidden_column1',
          sort: 'hidden_column1',
          label: 'hidden column1',
          hideColumn: true
        },
        {
          name: 'hidden_column2',
          sort: 'hidden_column2',
          label: 'hidden column2',
          hideColumn: true
        }
      ]}
      fixture.detectChanges();

      expect(component.config.columns?.length).toEqual(2);
      expect(component.config.columns && component.config.columns[0].name).toEqual('login');
      expect(component.config.columns && component.config.columns[1].name).toEqual('type');
    });

    it('should set the default sort to the config default sort', () => {
      component.config = config;
      fixture.detectChanges();

      expect(component.currentSort).toEqual(config.defaultSort);
    });

    it('should sort the data based on the default sort', () => {
      component.config = config;
      component.data = data
      component.processType = 'client';
      component.currentSort = config.defaultSort;
      fixture.detectChanges();

      // sorted with the last time coming first and first coming last based on default sort specified
      expect(component.data[0]).toEqual(data[1]);
      expect(component.data[1]).toEqual(data[0]);

    });

    it('should update the current sort column', () => {
      component.currentSort = config.defaultSort;
      component.config = config;

      expect(component.currentSortColumn).toEqual(config.columns && config.columns[0])
    })
  });

  describe('setData', () => {
    it('should build the config automatically if there is no config passed on to the table', () => {
      component.config = {} as ResultsTableConfiguration;
      component.data = data;

      const defaultColumnWhenConfigIsEmpty = [];

      // extract the keys of the first data item
      for(const dataKey of Object.keys(data[0])){
        defaultColumnWhenConfigIsEmpty.push(
          {
            label: dataKey,
            name: dataKey
          }
        )
      }
      expect(component.config.columns && component.config.columns).toEqual(defaultColumnWhenConfigIsEmpty)
    })
  });

  describe('OnChangePage', () => {
    it('should set the current paginated data for the view', () => {
      component.onChangePage(data);

      expect(component.paginatedData).toEqual(data);
    })
  });

  describe('onHeaderClick', () => {
    it('should update the current sort direction only when the same header column is clicked', () => {
      spyOn(component, 'sortClientData');
      component.config = config;
      component.currentSort = config.defaultSort;
      component.data = data;
      component.processType = 'client';
      fixture.detectChanges();
      component.onHeaderClick(config.columns ? config.columns[0] : {});
      expect(component.currentSort?.direction).toEqual('desc');
      expect(component.currentSortColumn).toEqual(config.columns && config.columns[0]);
      expect(component.sortClientData).toHaveBeenCalled();
    })

    it('should update the current sort name and direction when a different header column is clicked', () => {
      spyOn(component, 'sortClientData');
      component.config = config;
      component.currentSort = config.defaultSort;
      component.data = data;
      component.processType = 'client';
      fixture.detectChanges();
      component.onHeaderClick(config.columns ? config.columns[1] : {});
      expect(component.currentSort).toEqual({
        name: 'type',
        direction: 'asc'
      });
      expect(component.currentSortColumn).toEqual(config.columns && config.columns[1]);
      expect(component.sortClientData).toHaveBeenCalled();
    });
  });

  describe('sortClientData', () => {
    it('should sort the client data by sort criteria in ascending order', () => {
      const sortedAscData = component.sortClientData(data, {name: 'login', direction:'asc'});
      component.data = sortedAscData;

      // sort based on login - ascending: faa comes first then foo comes next
      expect(component.data[0].login).toEqual('faa');
      expect(component.data[1].login).toEqual('foo');
    });

    it('should sort the client data by sort criteria in descending order', () => {
      const sortedDescData = component.sortClientData(data, {name: 'login', direction:'desc'});
      component.data = sortedDescData;
      // sort based on login - descending: foo comes first then faa comes next
      expect(component.data[0].login).toEqual('foo');
      expect(component.data[1].login).toEqual('faa');
    });
  });

  describe('view', () => {
    it('should display the results table', () => {
      component.data = data;
      fixture.detectChanges();
      const scalioTableWrapper: HTMLElement = fixture.debugElement.query(By.css('#scalio-table-wrapper')).nativeElement;
      const scalioTable: HTMLElement = fixture.debugElement.query(By.css('#scalio-table')).nativeElement;
      const scalioTableHead: HTMLElement = fixture.debugElement.query(By.css('#scalio-table-head')).nativeElement;
      const scalioTableHeadRow: HTMLElement = fixture.debugElement.query(By.css('#scalio-table-head-row')).nativeElement;
      const firstScalioHeaderCell: HTMLElement = fixture.debugElement.query(By.css('#scalio-header-cell-0')).nativeElement;
      const secondScalioHeaderCell: HTMLElement = fixture.debugElement.query(By.css('#scalio-header-cell-1')).nativeElement;
      const scalioTableBody: HTMLElement = fixture.debugElement.query(By.css('#scalio-table-body')).nativeElement;
      const firstScalioTableBodyRow: HTMLElement = fixture.debugElement.query(By.css('#scalio-table-body-row-0')).nativeElement;
      const secondScalioTableBodyRow: HTMLElement = fixture.debugElement.query(By.css('#scalio-table-body-row-1')).nativeElement;
      const firstScalioDataCell: HTMLElement = fixture.debugElement.query(By.css('#scalio-data-cell-0')).nativeElement;
      const secondScalioDataCell: HTMLElement = fixture.debugElement.query(By.css('#scalio-data-cell-1')).nativeElement;


      expect(scalioTableWrapper).toBeTruthy();
      expect(scalioTable).toBeTruthy();
      expect(scalioTableHead).toBeTruthy();
      expect(scalioTableHeadRow).toBeTruthy();
      expect(firstScalioHeaderCell).toBeTruthy();
      expect(secondScalioHeaderCell).toBeTruthy();
      expect(scalioTableBody).toBeTruthy();
      expect(firstScalioTableBodyRow).toBeTruthy();
      expect(secondScalioTableBodyRow).toBeTruthy();
      expect(firstScalioDataCell).toBeTruthy();
      expect(secondScalioDataCell).toBeTruthy();
    });
  });

  it('should dispay the pagination component', () => {
    component.data = data;
    fixture.detectChanges();
    const scalioTablePaginator: HTMLElement = fixture.debugElement.query(By.css('#scalio-table-paginator')).nativeElement;

    expect(scalioTablePaginator).toBeTruthy();
  });

  describe('no data', () => {
    it('should dispay the no data component if there is no data and data is currently not loading for the table to render', () => {
      component.data = [];
      component.isLoading = false;
      fixture.detectChanges();

      const noDataWrapper: HTMLElement = fixture.debugElement.query(By.css('#data-message')).nativeElement;

      expect(noDataWrapper).toBeTruthy();
    });

    it('should not dispay the no data component if there is no data and data is currently loading for the table to render', () => {
      component.data = [];
      component.isLoading = true;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#data-message'))).toBeFalsy();
    });

    it('should display the no user found based on search input text if search input is provided', () => {
      component.data = [];
      component.isLoading = false;
      component.searchInput = 'foo';
      fixture.detectChanges();

      const searchNotFound: HTMLElement = fixture.debugElement.query(By.css('#search-not-found')).nativeElement;

      expect(searchNotFound).toBeTruthy();
      expect(searchNotFound.innerText.replace(/[\n\r]/g, "")).toEqual('No user matches the user login "foo". Please change your search term and try again.')
    });

    it('should display the no users text if no searchInput is provided', () => {
      component.data = [];
      component.isLoading = false;
      component.searchInput = '';
      fixture.detectChanges();

      const noUsers: HTMLElement = fixture.debugElement.query(By.css('#no-users')).nativeElement;

      expect(noUsers).toBeTruthy();
      expect(noUsers.innerText.trim()).toEqual('No users');
    });
  })
});
