import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchRequestSearchComponent } from './research-request-search.component';
import { ResearchRequestSearchRoutingModule } from './research-request-search.routing';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/primeng';

@NgModule({
  declarations: [ResearchRequestSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    ResearchRequestSearchRoutingModule,
    EclTableModule
  ]
})
export class ResearchRequestSearchModule { }
