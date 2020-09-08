import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { BlockUIModule, DialogService, MultiSelectModule, TooltipModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { SameSimService } from 'src/app/services/same-sim.service';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../../rule-creation/provisional-rule/provisional-rule.module';
import { ReferenceAnalysisComponent } from '../reference-analysis/reference-analysis.component';
import { RuleManagerService } from '../rule-process/services/rule-manager.service';
import { SameSimComponent } from './same-sim.component';
import { SameSimRoutingModule } from './same-sim.routing';

@NgModule({
  declarations: [SameSimComponent, ReferenceAnalysisComponent],
  imports: [
    CommonModule,
    FormsModule,
    SameSimRoutingModule,
    TableModule,
    MultiSelectModule,
    TooltipModule,
    TabViewModule,
    BlockUIModule,
    DynamicDialogModule,
    ProvisionalRuleModule,
    ConfirmDialogModule
  ],
  providers: [SameSimService, DialogService, RuleManagerService, ConfirmationService, DynamicDialogConfig, DynamicDialogRef],
  entryComponents: [ProvisionalRuleComponent, ReferenceAnalysisComponent],
  exports: [
    ReferenceAnalysisComponent
  ]
})
export class SameSimModule { }
