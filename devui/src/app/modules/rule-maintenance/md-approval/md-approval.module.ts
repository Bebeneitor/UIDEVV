import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {DialogService, MessageService} from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../../rule-creation/provisional-rule/provisional-rule.module';
import { MdApprovalRoutingModule } from './md-approval-routing.module';
import {MdApprovalComponent} from "./md-approval.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {MessageModule} from "primeng/message";
import {ToastModule} from "primeng/toast";
import { ReturnDialogModule } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.module';
import { ReturnDialogComponent } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.component';
import {CalendarModule} from 'primeng/calendar';
import { GoodIdeasModule } from     '../../../shared/components/good-ideas/good-ideas.module';
import { EclTableModule } from '../../../shared/components/ecl-table/ecl-table.module';



@NgModule({
    declarations: [MdApprovalComponent],
    imports: [
        DialogModule,
        DynamicDialogModule,
        FormsModule,
        TableModule,
        DropdownModule,
        PaginatorModule,
        AutoCompleteModule,
        CommonModule,
        EclTableModule,
		MdApprovalRoutingModule,
    SharedModule,
    ProvisionalRuleModule,
    ConfirmDialogModule,
      MessageModule,
      ToastModule,
      ReturnDialogModule,
      CalendarModule,
      GoodIdeasModule
    ],
    providers: [DialogService,
    MessageService],
    entryComponents: [
      MdApprovalComponent,
      ProvisionalRuleComponent,
      ReturnDialogComponent
    ]
    
})


export class MdApprovalModule {

}
