import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService } from "primeng/api";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ExcelService } from '../../../services/excel.service';
import { AssignmentNewIdeaRoutingModule } from './assignment-new-idea-routing.module';
import { AssignmentNewIdeaComponent } from './assignment-new-idea.component';
import { MessagesModule } from 'primeng/primeng';
import { SharedModule } from 'src/app/shared/shared.module';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';


@NgModule({
  declarations: [AssignmentNewIdeaComponent],
  imports: [
    CommonModule,
    AssignmentNewIdeaRoutingModule,
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
    EclTableModule    
  ],
  providers: [
    ExcelService,
    DialogService
  ]
})
export class AssignmentNewIdeaModule { }
