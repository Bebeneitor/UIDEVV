import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EclTableModule } from '../../../shared/components/ecl-table/ecl-table.module';
import { BlockUIModule } from 'primeng/blockui';
import { RvaPdgReportComponent } from './rva-pdg-report.component';
import { RvaPdgReportRoutingModule } from './rva-pdg-report.routing';

@NgModule({
  declarations: [RvaPdgReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    EclTableModule,
    BlockUIModule,
    RvaPdgReportRoutingModule
  ]
})
export class RvaPdgReportModule { }