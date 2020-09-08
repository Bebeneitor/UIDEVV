import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Constants } from 'src/app/shared/models/constants';
import { ImpactAnalysisCcaComponent } from './components/rule-manager/impact-analysis-cca/impact-analysis-cca.component';
import { MedicalDirectorApprovalComponent } from './components/rule-manager/medical-director-approval/medical-director-approval.component';
import { MedicalDirectorClaimComponent } from './components/rule-manager/medical-director-claims/medical-director-claims.component';
import { PolicyOwnerComponent } from './components/rule-manager/policy-owner-approval/policy-owner-approval.component';
import { RuleManagerComponent } from './components/rule-manager/rule-manager.component';
import { ReassignmentForPolicyOwnerComponent } from './components/rule-manager/reassignment-for-po/reassignment-for-po.component';
import { ReassignmentCcaComponent } from './components/rule-manager/reassignment-cca/reassignment-cca.component';
import { LunchBoxComponent } from './components/lunch-box/lunch-box.component';


const routes: Routes = [
  {
    path: 'rule-process',
    component: RuleManagerComponent,
    children: [
      { path: Constants.SAMESIM_NAV_REASSIGNMENT_CCA, component: ReassignmentCcaComponent, data: { pageTitle: 'ECL Industry Updates Reassignment for CCA Analysis' } },
      { path: Constants.SAME_SIM_NAV_INITIATE_ANALYSIS, component: ImpactAnalysisCcaComponent, data: { pageTitle: 'ECL Industry Updates CCA Analysis' } },
      { path: Constants.SAME_SIM_NAV_POLICY_OWNER_APPROVAL, component: PolicyOwnerComponent, data: { pageTitle: 'ECL Industry Updates Policy Owner Approval' } },
      { path: Constants.SAME_SIM_NAV_FOR_MEDICAL_DIRECTOR_APPROVAL, component: MedicalDirectorClaimComponent, data: { pageTitle: 'ECL Industry Updates Assign for Peer Reviewer Approval' } },
      { path: Constants.SAME_SIM_NAV_MEDICAL_DIRECTOR_APPROVAL, component: MedicalDirectorApprovalComponent, data: { pageTitle: 'ECL Industry Updates Peer Reviewer approval' } },
      { path: Constants.SAME_SIM_NAV_REASSIGNMENT_PO, component: ReassignmentForPolicyOwnerComponent, data: { pageTitle: 'ECL Industry Updates Reassignment for Policy Owner' } },
      { path: Constants.SAME_SIM_NAV_CODES, component: LunchBoxComponent, data: { pageTitle: 'ECL Industry Updates Codes Group' } }
    ]
  },
  {
    path: '**',
    redirectTo: '/industry-updates/rule-process/initiate-analysis'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleProcessRoutingModule { }
