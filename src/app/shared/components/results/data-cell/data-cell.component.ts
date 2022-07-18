import { Component, HostBinding, Input } from '@angular/core';
import { ColumnConfiguration } from 'src/app/shared';

@Component({
  selector: 'scalio-data-cell',
  templateUrl: './data-cell.component.html',
  styleUrls: ['./data-cell.component.scss']
})
export class DataCellComponent {
  // the data table configuration
  @Input() public config!: ColumnConfiguration;

  // the current index/postion of the cell
  @Input() public index!: number;

  // the number/length of a cells in the row
  @Input() public count!: number;

  // the default width styling
  @HostBinding('style.width') public widthStyling = 'auto';

  // the cell data
  private _data: any;

  // the original value of the data passed down
  public originalData: any;

  // evaluate if the config width is in percent
  public isPercent!: boolean;

  /**
   * Gets the formatted data value.
   */
  public get data() {
    return this._data;
  }
  constructor() { }

  /**
   * Sets the cell width.
   *
   * @param value
   */
  @Input() public set fWidth(value: number | string | undefined) {
    if(value) {
      this.widthStyling = typeof value === 'string'
          && (value.indexOf('px') > 0 || value.indexOf('%') > 0) ? value : `${value}px`;
      this.isPercent = this.widthStyling.indexOf('%') > 0;
    } else {
      this.widthStyling = 'auto';
    }
  }

  /**
   * Sets the raw value and formats it according to the configuration.
   *
   * @param value The raw value.
   */
  @Input() public set data(value: any) {
    this.originalData = value;

    if(this.config.name){
      this._data = this._checkPathToValue(this.originalData, this.config.name);
    }
  }

  /**
   * Checks the path to a value.
   *
   * @param obj The object.
   * @param path The oath to check.
   */
  private _checkPathToValue(obj: any, path: string): string {
    const valueObject = {} as any;
    valueObject[path] = obj[path];
    return obj[path];
  }

}
