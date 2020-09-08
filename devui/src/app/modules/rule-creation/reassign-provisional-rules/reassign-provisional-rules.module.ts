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
import { SharedModule } from 'src/app/shared/shared.module';
import { ExcelService } from '../../../services/excel.service';
import { ProvisionalRuleComponent } from '../provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../provisional-rule/provisional-rule.module';
import { ReassignProvisionalRulesRoutingModule } from './reassign-provisional-rules-routing.module';
import { ReassignProvisionalRulesComponent } from './reassign-provisional-rules.component';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [ReassignProvisionalRulesComponent],
  imports: [
    CommonModule,
    ReassignProvisionalRulesRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    DialogModule,
    PaginatorModule,
    DynamicDialogModule,
    TooltipModule,
    TabViewModule,
    SharedModule,
    ProvisionalRuleModule,
    EclTableModule,
    ToastModule
  ],
  providers: [
    ExcelService,
    DialogService
  ],
  entryComponents: [
    ProvisionalRuleComponent
  ]
})
export class ReassignProvisionalRulesModule { }
