import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService, MessageService } from "primeng/api";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule, CheckboxModule, BlockUIModule, ChipsModule } from 'primeng/primeng';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagfilterManagementRoutingModule } from './tagfilter-management-routing.module';
import { TagfilterManagementComponent } from './tagfilter-management.component';
import { StorageService } from 'src/app/services/storage.service';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EmailReport } from '../ecl-rules-catalogue/email-report/email-report.component';

@NgModule({
  declarations: [TagfilterManagementComponent, EmailReport],
  imports: [
    CommonModule,
    AutoCompleteModule,
    DialogModule,
    DropdownModule,
    DynamicDialogModule,
    FormsModule,
    MessagesModule,
    OverlayPanelModule,
    PaginatorModule,
    SharedModule,
    TableModule,
    TabViewModule,
    TooltipModule,
    EclTableModule,
    RadioButtonModule,
    CheckboxModule,
    PanelModule,
    BlockUIModule,
    ConfirmDialogModule,
    TagfilterManagementRoutingModule,
    ChipsModule
  ],
  providers: [
    DialogService,
    StorageService,
    MessageService
  ],
  entryComponents: [
    EmailReport
  ]
})
export class TagfilterManagementModule { }
