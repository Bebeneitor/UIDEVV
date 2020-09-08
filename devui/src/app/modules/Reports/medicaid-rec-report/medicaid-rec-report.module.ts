import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule} from 'primeng/multiselect';
import { MedicaidRecReportRoutingModule } from './medicaid-rec-report.routing';
import { MedicaidRecReportComponent } from './medicaid-rec-report.component';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule, DropdownModule, PickListModule, BlockUIModule, DialogModule, PaginatorModule, AutoCompleteModule, SharedModule, ProgressBarModule } from 'primeng/primeng';
import { TextEditableDirective } from 'src/app/shared/directives/text-editable.directive';
import { MidRuleBoxComponent } from '../components/mid-rule-box/mid-rule-box.component';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { TableModule } from 'primeng/table';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';



@NgModule({
  declarations: [MedicaidRecReportComponent, TextEditableDirective, MidRuleBoxComponent],
  imports: [
    CommonModule,
    FormsModule,
    MedicaidRecReportRoutingModule,
    ListboxModule,
    CalendarModule,
    DropdownModule,
    PickListModule,
    MultiSelectModule,
    EclTableModule,
    BlockUIModule,  
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    DialogModule,
    DynamicDialogModule,
    PaginatorModule,
    AutoCompleteModule,
    SharedModule,
    CalendarModule,
    ProgressBarModule,
    BlockUIModule, 
    ToastModule
  ]
})
export class MedicaidRecReportModule { }
