import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GoodIdeasComponent} from './good-ideas.component';
import {TableModule} from 'primeng/table';
import { FormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/primeng';

@NgModule({
  exports: [GoodIdeasComponent],
  declarations: [GoodIdeasComponent],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    CalendarModule
  ]
})
export class GoodIdeasModule { }
