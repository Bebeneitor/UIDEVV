import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {DialogModule} from 'primeng/dialog';
import {PaginatorModule} from 'primeng/paginator';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import { RuleForImpactAnalysisComponent } from './rule-for-impact-analysis.component';
import { RuleForImpactAnalysisRoutingModule } from './rule-for-impact-analysis.routing';
import {DialogService, MessageService} from 'primeng/api';
import { ProvisionalRuleModule } from '../../rule-creation/provisional-rule/provisional-rule.module';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { SharedModule } from "../../../shared/shared.module";
import {ReferenceReviewImpactComponent} from './reference-review-impact/reference-review-impact.component';
import {ReferenceReviewImpactModule} from './reference-review-impact/reference-review-impact.module';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {MessageModule} from "primeng/message";
import {ToastModule} from "primeng/toast";
import { TypeOfChangeMarkerModule } from 'src/app/shared/components/type-of-change-marker/type-of-change-marker.module';
import { ReturnDialogModule } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.module';
import { ReturnDialogComponent } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.component';
import { TabViewModule } from 'primeng/tabview';
import { EclTableModule } from '../../../shared/components/ecl-table/ecl-table.module';

@NgModule({
  declarations: [RuleForImpactAnalysisComponent],
  imports: [
    FormsModule,
    CommonModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    AutoCompleteModule,
    PaginatorModule,
    DynamicDialogModule,
    RuleForImpactAnalysisRoutingModule,
    ReferenceReviewImpactModule,
    ProvisionalRuleModule,
    SharedModule,
    TooltipModule,
    ReturnDialogModule,
    MessageModule,
    ToastModule,
    TypeOfChangeMarkerModule,
    TabViewModule,
    EclTableModule
  ],
 providers: [
   DialogService, MessageService
  ],
  entryComponents:[
    ReferenceReviewImpactComponent,
    ProvisionalRuleComponent,
    ReturnDialogComponent
  ]
})
export class RuleForImpactAnalysisModule { }
