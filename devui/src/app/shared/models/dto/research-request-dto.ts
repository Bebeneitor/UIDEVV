import { ResearchRequestSearchedRuleDto } from './research-request-searched-rule-dto';
import { EclAttachmentDto } from './ecl-attachment-dto';

export class ResearchRequestDto {

  researchRequestId: number;
  researchRequestCode: string;
  project: number;
  issueType: number;
  selectedPayerList: number[];
  selectedPayerStatus: number;
  superPayersSelected: number[];
  clientSelected: any[];
  team: number;
  policyType: number;
  attachmentCategory: number;
  assignee: number;
  labels: string;
  sdPriority: number;
  eLLCommittee: number;
  qaReason: number;
  projectCategoryId: number;
  lineOfBusiness: number[];
  selectedCCUsers: number[];
  removedCCUsers: number[];
  selectedWatcherUsers: number[];
  removedWatcherUsers: number[];
  ruleEngine: number;
  searchedRules: ResearchRequestSearchedRuleDto[];
  requestSummary: string;
  requestDescription: string;
  requestDueDate: string;
  requestLink: string;
  requestDecisionPoint: string;
  rrCreatedBy: number;
  requestAttachments: EclAttachmentDto[];
  rrCreatedDate: string;
  rrUpdatedBy: number;
  rrUpdatedDate: string;
  action: string;
  rrStatus: string;
  rrRouteTo: number;
  rrReqClassificationId: number;
  rrResolutionComments: string;
  jiraId: string;
  teamAssignee: number;
  rrComments: string;
  sendBackReasonId: number;
  userId: string;
  encryptPass: string;
  screenName: string;
  rejectedRules: ResearchRequestSearchedRuleDto[];
  rejectedIdeas: ResearchRequestSearchedRuleDto[];
  previousVersionLibraryRulePresent: boolean;

  constructor() {
    this.requestAttachments = [];
    this.selectedPayerList = [];
    this.lineOfBusiness = [];
    this.selectedCCUsers = [];
    this.searchedRules = [];
    this.superPayersSelected = [];
    this.clientSelected = [];
    this.removedCCUsers = [];
    this.selectedWatcherUsers = [];
    this.removedWatcherUsers = [];
    this.rejectedRules = [];
    this.rejectedIdeas = [];
    this.issueType = null;
  }
}
