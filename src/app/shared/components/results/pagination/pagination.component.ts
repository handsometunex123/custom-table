import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Pagination } from './pagination.model';

@Component({
  selector: 'scalio-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {

  // The items to be paginated;
  private _items!: any[];

  // The list of paged item currently shown in view;
  pageOfItems!: any[];

  // This is the pageSize;
  @Input() pageSize = 9;

  // sets the items to be paginated
  @Input() public set items(value: any[]){
    this._items = value;
  };

  // gets the items to be paginated
  public get items(): any[] {
    return this._items;
  }

  // maximum numbers of pages to be shown
  maxPages = 10;

  // this the triggered when the pagination actions are clicked
  @Output() changePage = new EventEmitter<any[]>();

  // this is the pager object
  public pager: any = {};

  // this is the initial page
  private _initialPage = 1;

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    // sets the current page when the items to be paginated changes
    if (changes['items'].currentValue !== changes['items'].previousValue) {
      this.setPage(this.pager.currentPage ?? this._initialPage);
    }
  }

  public setPage(page: number): void {
    // get new pager object for specified page
    this.pager = this.paginate(this._items.length, page, this.pageSize, this.maxPages);

    // get new page of items from items array
    this.pageOfItems = this._items.slice(this.pager?.startIndex, this.pager?.endIndex + 1);

    // call change page function in parent component
    this.changePage.emit(this.pageOfItems);
  }

  public paginate(
    totalItems: number,
    currentPage: number = 1,
    pageSize: number = 10,
    maxPages: number = 10
  ): Pagination  {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);
    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= maxPages) {
      // total pages less than max so show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // total pages more than max so calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = maxPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // current page near the end
        startPage = totalPages - maxPages + 1;
        endPage = totalPages;
      } else {
        // current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to repeat in the pager control
    const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

}
