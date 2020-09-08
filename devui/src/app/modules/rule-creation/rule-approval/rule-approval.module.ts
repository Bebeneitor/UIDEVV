import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { IdeaService } from '../../../services/idea.service';
import { StorageService } from '../../../services/storage.service';
import { ExcelService } from '../../../services/excel.service';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';
import {DialogService, MessageService} from 'primeng/api';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {IdeaDetailModule} from '../../assign-idea/idea-detail/idea-detail.module';
import {IdeaDetailComponent} from '../../assign-idea/idea-detail/idea-detail.component';
import {RuleApprovalComponent} from './rule-approval.component';
import {RuleApprovalRoutingModule} from './rule-approval.routing';
import { ProvisionalRuleComponent } from '../provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../provisional-rule/provisional-rule.module';
import {DialogModule} from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SharedModule } from 'src/app/shared/shared.module';
import {MessageModule} from "primeng/message";
import {ToastModule} from "primeng/toast";
import { ReturnDialogModule } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.module';
import { ReturnDialogComponent } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.component';
import { GoodIdeasModule } from     '../../../shared/components/good-ideas/good-ideas.module';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';


@NgModule({
  declarations: [RuleApprovalComponent
  ],
  imports: [
    CommonModule,
    RuleApprovalRoutingModule,
    TableModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    DynamicDialogModule,
    IdeaDetailModule,
    ProvisionalRuleModule,
    DialogModule,
    ConfirmDialogModule,
    DialogModule,
    DynamicDialogModule,
    FormsModule,
    TableModule,
    DropdownModule,
    PaginatorModule,
    AutoCompleteModule,
    SharedModule,
    ProvisionalRuleModule,
    ConfirmDialogModule,
    MessageModule,
    ToastModule,
    ReturnDialogModule,
    GoodIdeasModule,
    EclTableModule
  ],
  providers: [
    IdeaService,
    StorageService,
    ExcelService,
    DialogService,
    MessageService
  ],
  entryComponents: [
    IdeaDetailComponent,
    ProvisionalRuleComponent,
    ReturnDialogComponent
  ]
})
export class RuleApprovalModule { }