import { NgModule } from '@angular/core';
import { Routes, RouterModule/*, PreloadAllModules*/ } from '@angular/router';

import { SessionFilter } from './shared/guards/session.guard';
import { ECLConstantsService } from "./services/ecl-constants.service";
import { RoutingConstants as rc } from "./shared/models/routing-constants";
import { PageTitleConstants as ptc } from "./shared/models/page-title-constants";

let constants = new ECLConstantsService();

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'access-denied',
    loadChildren: () => import('./modules/access-denied/access-denied.module').then(m => m.AccessDeniedModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'newIdea',
    loadChildren: () => import('./modules/rule-creation/new-idea/newIdea.module').then(m => m.NewIdeaModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'newIdea/:id',
    loadChildren: () => import('./modules/rule-creation/new-idea/newIdea.module').then(m => m.NewIdeaModule),
    canActivate: [SessionFilter],
    data:
    {
      'readOnlyView': true,
    }
  },
  {
    path: 'newIdea/:id/:rrid/:code',
    loadChildren: () => import('./modules/rule-creation/new-idea/newIdea.module').then(m => m.NewIdeaModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'initiateImpact',
    loadChildren: () => import('./modules/rule-maintenance/initiate-impact/initiate-impact.modules').then(m => m.InitiateImpactModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'libraryView',
    loadChildren: () => import('./modules/library-view/library-view.module').then(m => m.LibraryViewModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'setupNotification',
    loadChildren: () => import('./modules/rule-maintenance/setup-notification/setup-notification.module').then(m => m.SetupNotificationModule),
    canActivate: [SessionFilter]

  },
  {
    path: 'savingClientAdoptedRule',
    loadChildren: () => import('./modules/saving-client-adopted-rule/saving-client-adopted-rule.module').then(m => m.SavingClientAdoptedRuleModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'newIdeaResearch',
    loadChildren: () => import('./modules/rule-creation/new-idea-research/new-idea-research.module').then(m => m.NewIdeaResearchModule),
    canActivate: [SessionFilter],
  },
  {
    path: 'mdApprovalPR',
    loadChildren: () => import('./modules/rule-maintenance/md-approval/md-approval.module').then(m => m.MdApprovalModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STAGE_PROVISIONAL_RULE,
      'pageTitle': ptc.PEER_REVIEWER_APPROVAL_TITLE
    }
  },
  {
    path: 'mdApprovalRM',
    loadChildren: () => import('./modules/rule-maintenance/md-approval/md-approval.module').then(m => m.MdApprovalModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STAGE_LIBRARY_RULE,
      'pageTitle': ptc.PEER_REVIEWER_APPROVAL_TITLE
    }
  },
  {
    path: 'reAssignForRuleApproval',
    loadChildren: () => import('./modules/assign-idea/assign-idea.module').then(m => m.AssignIdeaModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STAGE_PROVISIONAL_RULE,
      'pageTitle': 'Reassignment for Policy Owner Approval'
    }
  },
  {
    path: 'reAssignForRuleApprovalReturned',
    loadChildren: () => import('./modules/assign-idea/assign-idea.module').then(m => m.AssignIdeaModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STAGE_PROVISIONAL_RULE,
      'pageTitle': 'Reassignment for Policy Owner Approval',
      'tabName' : 'returned'
    }
  },
  {
    path: 'industryUpdateHistory',
    loadChildren: () => import('./modules/industry-update/industry-update-history/industry-update-history.module').then(m => m.IndustryUpdateHistoryModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': 'ICMS Industry Update Integration',
    }
  },
  {
    path: 'reAssignForRuleUpdateApproval',
    loadChildren: () => import('./modules/rule-maintenance/re-assign-policy-owner/re-assign-policy-owner.module').then(m => m.ReAssignPolicyOwnerModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': 'Reassignment for Policy Owner'
    }
  },
  {
    path: 'ruleForImpactAnalysis',
    loadChildren: () => import('./modules/rule-maintenance/rule-for-impact-analysis/rule-for-impact-analysis.module').then(m => m.RuleForImpactAnalysisModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STAGE_LIBRARY_RULE,
      'pageTitle': 'List of Rules for Impact Analysis'
    }
  },
  {
    path: 'reAssignImpactAnalysis',
    loadChildren: () => import('./modules/rule-maintenance/re-assign-impact-analysis/re-assign-impact-analysis.module').then(m => m.ReAssignImpactAnalysisModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': 'Reassignment for Impact Analysis'
    }
  },
  {
    path: 'assignmentNewIdea',
    loadChildren: () => import('./modules/rule-creation/assignment-new-idea/assignment-new-idea.module').then(m => m.AssignmentNewIdeaModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STATUS_NEW_IDEA,
      'pageTitle': 'Assignment for New Idea'
    }
  },
  {
    path: 'assignmentNewIdea/returnedTab',
    loadChildren: () => import('./modules/rule-creation/assignment-new-idea/assignment-new-idea.module').then(m => m.AssignmentNewIdeaModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STATUS_NEW_IDEA,
      'pageTitle': 'Assignment for New Idea',
      'tabName': 'returned'
    }
  },
  {
    path: 'ideas-needing-research',
    loadChildren: () => import('./modules/rule-creation/idea-research/idea-research.module').then(m => m.IdeaResearchModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'ruleApproval',
    loadChildren: () => import('./modules/rule-creation/rule-approval/rule-approval.module').then(m => m.RuleApprovalModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STAGE_PROVISIONAL_RULE,
      'pageTitle': ptc.POLICY_OWNER_APPROVAL_TITLE,
      'userId': 6
    }
  },
  {
    path: 'assignForMDApprovalRM',
    loadChildren: () => import('./modules/rule-maintenance/assignment-md-approval/assignment-md-approval.module').then(m => m.AssignmentMdApprovalModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STAGE_LIBRARY_RULE,
      'pageTitle': 'Assign for Peer Reviewer Approval'
    }
  },
  {
    path: 'assignForMDApprovalNR',
    loadChildren: () => import('./modules/rule-maintenance/assignment-md-approval/assignment-md-approval.module').then(m => m.AssignmentMdApprovalModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STAGE_PROVISIONAL_RULE,
      'pageTitle': 'Assign for Peer Reviewer Approval'
    }
  },
  {
    path: 'eclRuleCatalogue',
    loadChildren: () => import('./modules/ecl-rules-catalogue/ecl-rules-catalogue.module').then(m => m.EclRulesCatalogueModule),
    canActivate: [SessionFilter]
  },
  {
    path: rc.ECL_USER_AUTHORITY_SETUP,
    loadChildren: () => import('./modules/ecl-administration/role-setup/role-setup.module').then(m => m.RoleSetupModule),
    canActivate: [SessionFilter],
    data: {
      'newUser': true
    }
  },
  {
    path: 'rule-ingestion',
    loadChildren: () => import('./modules/rule-ingestion/rule-ingestion.module').then(m => m.RuleIngestionModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STAGE_LIBRARY_RULE,
      'pageTitle': 'Rule Ingestion'
    }
  },
  {
    path: 'ruleForPOApproval',
    loadChildren: () => import('./modules/rule-maintenance/rule-for-impact-analysis/rule-for-impact-analysis.module').then(m => m.RuleForImpactAnalysisModule),
    canActivate: [SessionFilter],
    data:
    {
      'ruleStatus': constants.RULE_STAGE_LIBRARY_RULE,
      'pageTitle': 'Policy Owner Approval'
    }
  },
  {
    path: rc.ECL_USER_DIRECTORY,
    loadChildren: () => import('./modules/ecl-administration/ecl-user-directory/ecl-user-directory.module').then(m => m.EclUserDirectoryModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': ptc.ECL_USER_SETUP_TITLE
    }
  },
  {
    path: 'white-paper/:type',
    loadChildren: () => import('./modules/white-paper/white-paper.module').then(m => m.WhitePaperModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'item-detail/:id/:type',
    loadChildren: () => import('./modules/navigation/navigation.module').then(m => m.NavigationModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'item-detail/:id/:type/:tabSelected',
    loadChildren: () => import('./modules/navigation/navigation.module').then(m => m.NavigationModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'item-detail/:id/:type/:mode',
    loadChildren: () => import('./modules/navigation/navigation.module').then(m => m.NavigationModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'item-detail/:id/:type/:mode/:parentParam',
    loadChildren: () => import('./modules/navigation/navigation.module').then(m => m.NavigationModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'library-search',
    loadChildren: () => import('./modules/library-search/library-search.module').then(m => m.LibrarySearchModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'savings-for-rule',
    loadChildren: () => import('./modules/Reports/savings-for-rules/savings-for-rules.module').then(m => m.SavingsForRulesModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'good-ideas',
    loadChildren: () => import('./modules/rule-creation/good-ideas/good-ideas.module').then(m => m.GoodIdeasModule),
    canActivate: [SessionFilter]

  },
  {
    path: 'jobManager',
    loadChildren: () => import('./modules/job-manager/job-manager.module').then(m => m.JobManagerModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': 'Job Manager'
    }
  },
  {
    path: 're-ssign-for-provisional-rules',
    loadChildren: () => import('./modules/rule-creation/reassign-provisional-rules/reassign-provisional-rules.module').then(m => m.ReassignProvisionalRulesModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': 'Reassignment for Provisional Rule '
    }
  },
  {
    path: 'ecl-lookups',
    loadChildren: () => import('./modules/ecl-administration/ecl-lookups/ecl-lookups.module').then(m => m.EclLookupsModule),
    canActivate: [SessionFilter]

  },
  {
    path: 'crosswalk',
    loadChildren: () => import('./modules/industry-update/industry-update-crosswalk/industry-update-crosswalk.module').then(m => m.IndustryUpdateCrosswalkModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': 'ICMS to ECL Rules CrossWalk/Mapping'
    }
  },
  {
    path: 'email-notification',
    loadChildren: () => import('./modules/ecl-administration/email-notification-list/email-notification-list.module').then(m => m.EmailNotificationListModule),
    canActivate: [SessionFilter]

  },
  {
    path: 'email-notification-setup',
    loadChildren: () => import('./modules/ecl-administration/email-notification/email-notification.module').then(m => m.EmailNotificationModule),
    canActivate: [SessionFilter]

  },
  {
    path: 'same-sim-setup/:id',
    loadChildren: () => import('./modules/industry-update/same-sim/same-sim.module').then(m => m.SameSimModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'same-sim',
    loadChildren: () => import('./modules/industry-update/same-sim-list/same-sim-list.module').then(m => m.SameSimListModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'cure-and-repo',
    loadChildren: () => import('./modules/cure-repo/cure-repo.module').then(m => m.CureAndRepoModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'industry-updates',
    loadChildren: () => import('./modules/industry-update/rule-process/rule-process.module').then(m => m.RuleProcessModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'field-selection-updates',
    loadChildren: () => import('./modules/ecl-administration/field-selection-updates/field-selection-updates.module').then(m => m.FieldSelectionUpdatesModule),
    canActivate: [SessionFilter]

  },
  {
    path: 'team-updates-report',
    loadChildren: () => import('./modules/Reports/team-updates-report/team-updates-report.module').then(m => m.TeamUpdatesReportModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'rda',
    loadChildren: () => import('./modules/reference-data-acquisition/reference-data-acquisition.module').then(m => m.ReferenceDataAcquisitionModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': ptc.REFERENCE_DATA_ACQUISITION_PAGE_TITLE
    }
  },
  {
    path: rc.FILE_INBOX,
    loadChildren: () => import('./modules/file-download-inbox/file-download-inbox.module').then(m => m.FileDownloadInboxModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'ell-search',
    loadChildren: () => import('./modules/ell/ell-search/ell-search.module').then(m => m.EllSearchModule),
    canActivate: [SessionFilter]

  },
  {
    path: 'mviews-log',
    loadChildren: () => import('./modules/ell/materialized-view-log/materialized-view-log.module').then(m => m.MaterializedViewLogModule),
    canActivate: [SessionFilter]

  },
  {
    path: 'topic-detail/:releaseLogKey/:topicKey',
    loadChildren: () => import('./modules/ell/topic-detail/topic-detail.module').then(m => m.TopicDetailModule),
    canActivate: [SessionFilter]

  },
  {
    path: 'decision-point/:releaseLogKey/:decisionKey',
    loadChildren: () => import('./modules/ell/decision-point/decision-point.module').then(m => m.DecisionPointModule),
    canActivate: [SessionFilter]
  },

  // Research Request Paths(any new paths related to RR Add below)

  {
    path: 'new-research-request',
    loadChildren: () => import('./modules/research-requests/new-research-request/new-research-request.module').then(m => m.NewResearchRequestModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'research-request',
    loadChildren: () => import('./modules/research-requests/research-request/research-request.module').then(m => m.ResearchRequestModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'my-research-request',
    loadChildren: () => import('./modules/research-requests/my-research-request/my-research-request.module').then(m => m.MyResearchRequestModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': ptc.MY_RESEARCH_REQUEST
    }
  },
  {
    path: 'unassigned-research-request',
    loadChildren: () => import('./modules/research-requests/unassigned-research-request/unassigned-research-request.module').then(m => m.UnassignedResearchRequestModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': 'Unassigned Research Requests'
    }
  },
  {
    path: 'reassignment-research-request',
    loadChildren: () => import('./modules/research-requests/reassignment-research-request/reassignment-research-request.module').then(m => m.ReassignmentResearchRequestModule),
    canActivate: [SessionFilter],
    data:
    {
      'pageTitle': 'Reassignment for Research Requests'
    }
  },
  {
    path: rc.SEARCH_RESEARCH_REQUEST,
    loadChildren: () => import('./modules/research-requests/research-request-search/research-request-search.module').then(m => m.ResearchRequestSearchModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'research-request-po-approval',
    loadChildren: () => import('./modules/research-requests/research-request-po-approval/research-request-po-approval.module').then(m => m.ResearchRequestPoApprovalModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'research-request-peer-approval',
    loadChildren: () => import('./modules/research-requests/research-request-peer-approval/research-request-peer-approval.module').then(m => m.ResearchRequestPeerApprovalModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'research-request-advisory-approval',
    loadChildren: () => import('./modules/research-requests/research-request-advisory-approval/research-request-advisory-approval.module').then(m => m.ResearchRequestAdvisoryApprovalModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'rr',
    loadChildren: () => import('./modules/research-requests/rr-modules').then(m => m.RRModules),
    canActivate: [SessionFilter]
  },
  {
  	path: 'dnb',
    loadChildren: () => import('./modules/dnb/dnb.module').then(m => m.DnBModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'rule-long-detail-ell/:releaseLogKey/:midRuleKey',
    loadChildren: () => import('./modules/ell/rule-detail-decision-point/rule-detail-decision-point.module').then(m => m.RuleDetailDecisionPointModule),
    canActivate: [SessionFilter],
    data:
    {
        'type': constants.LONG_VERSION
    }
  },
  {
    path: 'sub-rule-search',
    loadChildren: () => import('./modules/ell/sub-rule-search/sub-rule-search.module').then(m => m.SubRuleSearchModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'tagfilter-management',
    loadChildren: () => import('./modules/tagfilter-management/tagfilter-management.module').then(m => m.TagfilterManagementModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'clinical-rules-requirements',
    loadChildren: () => import('./modules/convergence-point/components/main-screen/main-screen.module').then(m => m.MainScreenModule),
    canActivate: [SessionFilter],
    data: {
      'key': 'CRC',
      'pageTitle': ptc.CLINICAL_RULES_REQUIREMENTS
    }
  },
  {
    path: 'ancillary-information',
    loadChildren: () => import('./modules/convergence-point/components/main-screen/main-screen.module').then(m => m.MainScreenModule),
    canActivate: [SessionFilter],
    data: {
      'key': 'AI',
      'pageTitle': ptc.ANCILLARY_INFORMATION
    }
  },
  {
    path: 'audit-log',
    loadChildren: () => import('./modules/convergence-point/components/audit-log-cvp/audit-log-cvp.module').then(m => m.AuditLogCvpModule),
    canActivate: [SessionFilter]
  },
  {
    path: rc.MEDCAID_RECOMMEND_REPORT_RUL,
    loadChildren: () => import('./modules/Reports/medicaid-rec-report/medicaid-rec-report.module').then(m => m.MedicaidRecReportModule),
    canActivate: [SessionFilter]
  },
  {
  	path: 'dnb/web-crawling',
    loadChildren: () => import('./modules/web-crawling/webcrawling.module').then(m => m.WebCrawlingModule),
    canActivate: [SessionFilter]
  },
  {
    path: 'rva-pdg-report',
    loadChildren: () => import('./modules/Reports/rva-pdg-report/rva-pdg-report.module').then(m => m.RvaPdgReportModule),
    canActivate: [SessionFilter]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
