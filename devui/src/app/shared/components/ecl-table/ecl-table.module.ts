
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlockUIModule, CalendarModule, DropdownModule, TooltipModule, ConfirmationService, CheckboxModule, InputSwitchModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { ExcelService } from 'src/app/services/excel.service';
import { EclTableComponent } from './ecl-table.component';
import { EclTableService } from './service/ecl-table.service';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [EclTableComponent],
  exports: [EclTableComponent],
  imports: [
    FormsModule,
    CommonModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    BlockUIModule,
    TooltipModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    CheckboxModule,
    InputSwitchModule
  ],
  providers: [
    EclTableService,
    ExcelService,
    DatePipe,
    ConfirmationService, 
    SlicePipe
  ]
})
export class EclTableModule { }