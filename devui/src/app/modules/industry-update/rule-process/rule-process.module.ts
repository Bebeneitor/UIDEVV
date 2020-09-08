import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { DialogService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../../rule-creation/provisional-rule/provisional-rule.module';
import { LunchBoxComponent } from './components/lunch-box/lunch-box.component';
import { ImpactAnalysisCcaComponent } from './components/rule-manager/impact-analysis-cca/impact-analysis-cca.component';
import { MedicalDirectorApprovalComponent } from './components/rule-manager/medical-director-approval/medical-director-approval.component';
import { MedicalDirectorClaimComponent } from './components/rule-manager/medical-director-claims/medical-director-claims.component';
import { PolicyOwnerComponent } from './components/rule-manager/policy-owner-approval/policy-owner-approval.component';
import { ReassignmentForPolicyOwnerComponent } from './components/rule-manager/reassignment-for-po/reassignment-for-po.component';
import { RuleManagerComponent } from './components/rule-manager/rule-manager.component';
import { RuleProcessRoutingModule } from './rule-process-routing.module';
import { RuleManagerService } from './services/rule-manager.service';
import { ReturnDialogComponent } from "../../rule-creation/new-idea-research/components/return-dialog/return-dialog.component";
import { ReturnDialogModule } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.module';
import { ReassignmentCcaComponent } from './components/rule-manager/reassignment-cca/reassignment-cca.component';
import { ReferenceAnalysisComponent } from '../reference-analysis/reference-analysis.component';
import { SameSimModule } from '../same-sim/same-sim.module';

@NgModule({
  declarations: [
    ImpactAnalysisCcaComponent,
    RuleManagerComponent,
    MedicalDirectorApprovalComponent,
    LunchBoxComponent,
    MedicalDirectorClaimComponent,
    PolicyOwnerComponent,
    ReassignmentForPolicyOwnerComponent,
    ReassignmentCcaComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    TableModule,
    TooltipModule,
    AccordionModule,
    SharedModule,
    FormsModule,
    DropdownModule,
    RuleProcessRoutingModule,
    ProvisionalRuleModule,
    DynamicDialogModule,
    MessageModule,
    ToastModule,
    TabViewModule,
    EclTableModule,
    ReturnDialogModule, 
    SameSimModule
  ],
  providers: [DialogService, RuleManagerService],
  entryComponents: [ProvisionalRuleComponent, LunchBoxComponent, ReturnDialogComponent, ReferenceAnalysisComponent]
})
export class RuleProcessModule { }
