import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ExcelService } from '../../../services/excel.service';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService, MessageService } from "primeng/api";
import { ReAssignImpactAnalysisRoutingModule } from './re-assign-impact-analysis-routing.module';
import { ReAssignImpactAnalysisComponent } from './re-assign-impact-analysis.component';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../../rule-creation/provisional-rule/provisional-rule.module';
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { SharedModule } from 'src/app/shared/shared.module';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';

@NgModule({
  declarations: [ReAssignImpactAnalysisComponent],
  imports: [
    CommonModule,
    ReAssignImpactAnalysisRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    DialogModule,
    PaginatorModule,
    DynamicDialogModule,
    ProvisionalRuleModule,
    SharedModule,
    MessageModule,
    ToastModule,
    EclTableModule
  ],
  providers: [
    ExcelService,
    DialogService,
    MessageService
  ],
  entryComponents: [
    ProvisionalRuleComponent
  ]
})

export class ReAssignImpactAnalysisModule { }
