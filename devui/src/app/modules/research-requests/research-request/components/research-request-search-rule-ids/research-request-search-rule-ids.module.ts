import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule, ConfirmDialogModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ResearchRequestSearchRuleIdsRoutingModule } from './research-request-search-rule-ids-routing.module';
import { ResearchRequestSearchRuleIdsComponent } from './research-request-search-rule-ids.component';
import {MidRuleBoxModule} from "../../../../Reports/components/mid-rule-box/mid-rule-box.module";


@NgModule({
  declarations: [ResearchRequestSearchRuleIdsComponent],
  imports: [
    CommonModule,
    ResearchRequestSearchRuleIdsRoutingModule,
    DropdownModule,
    FormsModule,
    DynamicDialogModule,
    DialogModule,
    TableModule,
    ConfirmDialogModule,
    MidRuleBoxModule
  ]
})
export class ResearchRequestSearchRuleIdsModule { }
