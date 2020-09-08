import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {DialogService, MessageService} from "primeng/api";
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ExcelService } from '../../../services/excel.service';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../../rule-creation/provisional-rule/provisional-rule.module';
import { AssignmentMdApprovalRoutingModule } from './assignment-md-approval-routing.module';
import {AssignmentMdApprovalComponent} from "./assignment-md-approval.component";
import {MessageModule} from "primeng/message";
import { TabViewModule } from 'primeng/tabview';
import {ToastModule} from "primeng/toast";
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';



@NgModule({
  declarations: [AssignmentMdApprovalComponent],
  imports: [
    CommonModule,
    FormsModule,
    AssignmentMdApprovalRoutingModule,
    TableModule,
    DropdownModule,
    ProvisionalRuleModule,
    MessageModule,
    SharedModule,
    TabViewModule,
    ToastModule,
    TooltipModule,
    EclTableModule
  ],
  providers:[
    ExcelService,
    DialogService,
    MessageService
  ],
  entryComponents: [
    ProvisionalRuleComponent
  ]
})
export class AssignmentMdApprovalModule { }
