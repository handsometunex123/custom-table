import { Component, HostBinding, Input } from '@angular/core';
import { ColumnConfiguration } from '../results-configuration.model';
import { SortDirection } from '../results-sort.model';

@Component({
  selector: 'scalio-header-cell',
  templateUrl: './header-cell.component.html',
  styleUrls: ['./header-cell.component.scss']
})
export class HeaderCellComponent {

  constructor() { }

  /**
   * Binding to the is-th class
   */
  @HostBinding('class.is-th') public isThClass: boolean = false;

  /**
   * Binding to style width
   */
  @HostBinding('style.width') public widthStyling: string = 'auto';

  /**
   * The index of the column in the datatable
   */
  @Input() public index!: number;

  /**
   * The number of columns in the datatable
   */
  @Input() public count!: number;

  /**
   * Forces the width of the column to the specified value
   */
  @Input() public set fWidth(value: number | string | undefined) {
    if(value) {
      this.widthStyling = typeof value === 'string'
        && (value.indexOf('px') > 0 || value.indexOf('%') > 0) ? value : `${value}px`;
    } else {
      this.widthStyling = 'auto';
    }
  }

  /**
   * The column configuration
   */
  @Input() public config!: ColumnConfiguration;


  /**
   * Determines if the table header class should be set
   */
  @Input() public set isTh (value: boolean) {
    this.isThClass = value;
  }

  /**
   * the sort direction
   */
  @Input() public sortDirection?: SortDirection;

}
