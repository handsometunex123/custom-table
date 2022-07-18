import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataCellComponent, ResultsComponent, HeaderCellComponent, SearchComponent, PaginationComponent, NotificationComponent, LoaderComponent } from './components';
import { FormsModule } from '@angular/forms';

const sharedComponents = [
  DataCellComponent,
  HeaderCellComponent,
  ResultsComponent,
  SearchComponent,
  PaginationComponent,
  NotificationComponent,
  LoaderComponent
]

@NgModule({
  declarations: sharedComponents,
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: sharedComponents
})
export class SharedModule { }
