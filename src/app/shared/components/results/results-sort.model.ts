export type SortDirection = 'asc' | 'desc';

export interface ResultsTableSort {
  name?: string | undefined;
  direction: SortDirection;
}
