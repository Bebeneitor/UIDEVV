import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReassignmentResearchRequestComponent } from './reassignment-research-request.component';
import { ReassignmentResearchRequestRoutingModule } from './reassignment-research-request.routing';
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
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {PaginatorModule} from 'primeng/paginator';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { DatePipe } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {StorageService} from '../../../services/storage.service';
import {ExcelService} from '../../../services/excel.service';

@NgModule({
  declarations: [ReassignmentResearchRequestComponent],
  imports: [
    CommonModule,
    ReassignmentResearchRequestRoutingModule,
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
    DatePipe
  ]
})
export class  ReassignmentResearchRequestModule { }