import { ResultsTableSort } from "src/app/shared";


export interface ColumnConfiguration {
  isHeaderHidden?: boolean;
  name?: string;
  sort?: string;
  label?: string;
  align?: CellAlign;
  padding?: CellPadding;
  width?: number | string;
  hideColumn?: boolean;
  preserveWhitespace?: boolean;
  sortable?: boolean;
  hideOverflow?: boolean;
}

export type CellAlign = 'left' | 'center' | 'right';
export type CellPadding = 'padding-1rem';

export interface ResultsTableConfiguration {
  columns?: Array<ColumnConfiguration>;
  defaultSort?: ResultsTableSort;
}
