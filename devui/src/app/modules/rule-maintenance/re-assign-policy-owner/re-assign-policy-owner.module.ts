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
import { TooltipModule } from 'primeng/tooltip';

import { ReAssignPolicyOwnerRoutingModule } from './re-assign-policy-owner-routing.module';
import { ReAssignPolicyOwnerComponent } from './re-assign-policy-owner.component';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../../rule-creation/provisional-rule/provisional-rule.module';
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { TabViewModule } from 'primeng/tabview';
import { SharedModule } from 'src/app/shared/shared.module';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';

@NgModule({
  declarations: [ReAssignPolicyOwnerComponent],
  imports: [
    CommonModule,
    AutoCompleteModule,
    DialogModule,
    DropdownModule,
    DynamicDialogModule,
    FormsModule,
    MessageModule,
    PaginatorModule,
    ProvisionalRuleModule,
    ReAssignPolicyOwnerRoutingModule,
    SharedModule,
    TableModule,
    TabViewModule,
    ToastModule,
    TooltipModule,
    EclTableModule
  ],
  providers: [
    DialogService,
    ExcelService,
    MessageService
  ],
  entryComponents: [
    ProvisionalRuleComponent
  ]
})
export class ReAssignPolicyOwnerModule { }
