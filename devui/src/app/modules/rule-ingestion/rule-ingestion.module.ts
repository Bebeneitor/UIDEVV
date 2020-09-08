import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule, MultiSelectModule, CalendarModule, TabViewModule, BlockUIModule, ProgressBarModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { IngestionProcessComponent } from './components/ingestion-process/ingestion-process.component';
import { RuleIngestionRoutingModule } from './rule-ingestion-routing.module';
import { IngestedRulesComponent } from './components/ingested-rules/ingested-rules.component';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ReturnDialogModule } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.module';
import { ProvisionalRuleComponent } from '../rule-creation/provisional-rule/provisional-rule.component';
import { ReturnDialogComponent } from '../rule-creation/new-idea-research/components/return-dialog/return-dialog.component';
import { ProvisionalRuleModule } from '../rule-creation/provisional-rule/provisional-rule.module';

@NgModule({
  declarations: [IngestionProcessComponent, IngestedRulesComponent],
  imports: [
    CommonModule,
    FileUploadModule,
    ToastModule,
    TableModule,
    SharedModule,
    FormsModule,
    ConfirmDialogModule,
    DropdownModule,
    BlockUIModule,
    MultiSelectModule,
    CalendarModule,
    StepsModule,
    TabViewModule,
    OverlayPanelModule,
    ProgressBarModule,
    RuleIngestionRoutingModule,
    EclTableModule,
    DynamicDialogModule,
    ReturnDialogModule,
    ProvisionalRuleModule
  ],
  providers: [DialogService, ConfirmationService],
  entryComponents: [ProvisionalRuleComponent, ReturnDialogComponent]
})

export class RuleIngestionModule { }
