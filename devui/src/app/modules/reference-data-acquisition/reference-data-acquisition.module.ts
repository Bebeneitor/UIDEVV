import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import {
  CalendarModule,
  BlockUIModule,
  ProgressBarModule
} from 'primeng/primeng';
import { DropdownModule } from 'primeng/dropdown';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { ToastModule } from 'primeng/toast';
import {ReferenceDataAcquisitionComponent} from './reference-data-acquisition.component';
import {ReferenceDataAcquisitionRoutingModule} from './reference-data-acquisition.routing';
import {ReferenceDataAcquisitionService} from '../../services/reference-data-acquisition.service';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {PaginatorModule} from 'primeng/paginator';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {SharedModule} from '../../shared/shared.module';
import {StorageService} from '../../services/storage.service';
import {ExcelService} from '../../services/excel.service';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [ReferenceDataAcquisitionComponent],
  imports: [
    ReferenceDataAcquisitionRoutingModule,
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    DialogModule,
    DynamicDialogModule,
    PaginatorModule,
    AutoCompleteModule,
    SharedModule,
    ToastModule,
    CalendarModule,
    ProgressBarModule,
    BlockUIModule,

  ],
  providers: [
    StorageService,
    ExcelService,
    ToastMessageService,
    DatePipe,
    ReferenceDataAcquisitionService
  ]
})

export class ReferenceDataAcquisitionModule { }
