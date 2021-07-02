import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodIdeasRoutingModule } from './good-ideas.routing';
import { GoodIdeasComponent } from './good-ideas.component';
import { CalendarModule } from 'primeng/primeng';
import { EclTableModule } from '../../../shared/components/ecl-table/ecl-table.module';

@NgModule({
  declarations: [
      GoodIdeasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GoodIdeasRoutingModule,
    TableModule,
    DropdownModule,
    SharedModule,
    CalendarModule,
    EclTableModule
  ],
  providers : []
})
export class GoodIdeasModule { }
