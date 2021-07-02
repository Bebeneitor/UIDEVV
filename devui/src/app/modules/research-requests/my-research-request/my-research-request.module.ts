import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyResearchRequestComponent } from './my-research-request.component';
import { MyResearchRequestRoutingModule } from './my-research-request.routing';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import {
  BlockUIModule,
  ProgressBarModule
} from 'primeng/primeng';
import { DropdownModule } from 'primeng/dropdown';
import {PaginatorModule} from 'primeng/paginator';
import {SharedModule} from '../../../shared/shared.module';
import {ExcelService} from '../../../services/excel.service';

@NgModule({
  declarations: [MyResearchRequestComponent],
  exports: [MyResearchRequestComponent],
imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    PaginatorModule,
    SharedModule,
    ProgressBarModule,
    BlockUIModule,
    MyResearchRequestRoutingModule
  ],
  providers: [
    ExcelService
  ]
})
export class MyResearchRequestModule { }
