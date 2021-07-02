import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfirmationService, DialogService, SelectItem } from 'primeng/api';
import { Observable, Subscription, zip } from 'rxjs';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { StorageService } from 'src/app/services/storage.service';
import { TeamsService } from 'src/app/services/teams.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { UsersService } from 'src/app/services/users.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Constants } from 'src/app/shared/models/constants';
import { ResearchRequestDto } from 'src/app/shared/models/dto/research-request-dto';
import { ResearchRequestSearchedRuleDto } from 'src/app/shared/models/dto/research-request-searched-rule-dto';
import { AppUtils } from 'src/app/shared/services/utils';
import * as _ from 'underscore';
import { ECLConstantsService } from "../../../services/ecl-constants.service";
import { PageTitleConstants as ptc } from 'src/app/shared/models/page-title-constants';
import { Users } from "../../../shared/models/users";
import { NewIdeaComponent } from '../../rule-creation/new-idea/newIdea.component';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ResearchRequestCommentsDialogComponent } from './components/research-request-comments-dialog/research-request-comments-dialog.component';
import { ResearchRequestCommentsComponent } from './components/research-request-comments/research-request-comments.component';
import { ResearchRequestSearchRuleIdsComponent } from './components/research-request-search-rule-ids/research-request-search-rule-ids.component';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { flatMap, map, mergeMap } from 'rxjs/operators';
import { EclAttachmentDto } from 'src/app/shared/models/dto/ecl-attachment-dto';
import { ResearchRequestValidation } from '../research-request-validation';
import { IssueLinkResearchRequest } from 'src/app/modules/research-requests/models/interface/issue-link-interface';
import { ResearchRequestHistoryComponent } from './components/research-request-history/research-request-history.component';
import { RrUtils } from '../services/rr-utils.component';
import { OktaAuthService } from '@okta/okta-angular';
import { IssueComponent } from '../shared/issue/issue.component';
import { RequestConstants } from '../models/request.constants';
import { RequestRoutingConst } from '../models/request-routing.constants';

const ACTION_DELETE = 0;
const ACTION_UPDATE = 1;
const ACTION_INITIATE = 2;
const ACTION_ASSIGN = 3;

@Component({
  selector: 'app-research-request',
  templateUrl: './research-request.component.html',
  styleUrls: ['./research-request.component.css', '../shared/shared-request-style.css']
})
export class ResearchRequestComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('rrFileInput', { static: true }) rrFileInput: ElementRef;
  @ViewChild('rrComments', { static: true }) rrComments: ResearchRequestCommentsComponent;
  @ViewChild('researchRequestForm', { static: true }) ngForm: NgForm;
  @ViewChild('saveButton', { static: true }) saveButton: ElementRef;
  @ViewChild('sendBackReason', { static: true }) sendBackReason;
  @ViewChild('rrHistory', { static: true }) rrHistory: ResearchRequestHistoryComponent;
  @ViewChild(IssueComponent, { static: true }) issue: IssueComponent;

  //Option & selected Lists
  issueTypeList: any[] = [{ label: "Choose", value: null }];
  teamsList: any[] = [{ label: "Choose", value: null }];
  policyTypeList: any[] = [{ label: "Choose", value: null }];
  attachmentCategoryList: any[] = [{ label: "Choose", value: null }];
  assigneeList: any[] = [{ label: "Choose", value: null }];
  teamAssigneeList: any[] = [{ label: "Choose", value: null }];
  SDPriorityList: any[] = [{ label: "Choose", value: null }];
  eLLCommitteeList: any[] = [{ label: "Choose", value: null }];
  QAReasonList: any[] = [{ label: "Choose", value: null }];
  requestClassificationList: any[] = [{ label: "Choose", value: null }];
  sendBackReasonList: any[] = [{ label: "Choose", value: null }];
  routeToList: any[] = [{ label: "Choose", value: null }];
  prBtnDisableSelect: any[] = [];
  clientsList: any[] = [];
  payerList: any[] = [];
  payerStatusList: any[] = [];
  superPayerList: any[] = [];
  lineOfBusinessList: any[] = [];
  rrPayersList: any[] = []; //original payers list data with client info
  clientPayerList: any[] = [];
  typeChangeList: any[] = [];
  changeTypesCodes: SelectItem[] = [{ label: 'Select', value: null }];
  ideaChangeTypesCodes: SelectItem[] = [{ label: 'Select', value: null }];
  ruleResponseStatus: SelectItem[] = [{ label: 'Select', value: null }];
  ruleEngineList: any[] = [{ label: 'Choose', value: null }];
  selectedCCUsersList: any[] = [];
  removedCCUsersList: any[] = [];
  userSearchList: any[] = [];
  activeUsersList: any[] = [];
  userSearchWatcherList: any[] = [];
  selectedWatcherUsersList: any[] = [];
  removedWatcherUsersList: any[] = [];
  teamSupervisors: any[] = [];
  selectedPayers: any[] = [];
  cols: any[] = [];
  rrStatusList: SelectItem[] = [];
  oldVersionSavedRuleResponse: ResearchRequestSearchedRuleDto[] = [];

  dropDownStyles: any = { 'width': '100%', 'max-width': '100%', 'border': '1px solid #31006F' };
  dropDownStylesBlue: any = { 'width': '100%', 'max-width': '100%', 'border': '1.5px solid #4c9aff', 'box-shadow': '0 0 4px #4c9aff' };

  // Selected Items & Objects
  rrId: number;
  rrCode: string;
  navPageTitle: string;
  navPagePath: string;
  ccaClaimLabel = 'Claim';
  rrTabIndex: number;
  researchRequestObj: ResearchRequestDto;
  currentDate = '';
  rrReporter: string; // rr created person as the reporter
  searchRules: string;
  searchUser: string;
  searchWatcherUser: string;
  ruleResponses: ResearchRequestSearchedRuleDto[];
  oldRuleResponses: ResearchRequestSearchedRuleDto[];
  rowData: any;
  userId: number;
  loggedInUser: Users;
  tempSummary: string;
  pageSetup: number = RequestConstants.REQUEST_PAGE;

  // Switches & Booleans
  saved: boolean;
  enableComment: boolean = false;
  enableReason: boolean = false;
  startRrDisable: boolean = false;
  response: boolean = false;
  saveAction = Constants.SAVE_ACTION;
  submitAction = Constants.SUBMIT_ACTION;
  cloneAttachBool: boolean = false;
  cloneRuleRespBool: boolean = false;
  cloneVisability: boolean = false;

  // fields used to disable the entire screen for readonly.
  rrButtonsDisable: boolean = true; // set true to disable the buttons and action items in the UI layout.
  rrReadOnly: boolean = true; // set true to disable the required fields in the UI layout.
  submitBtnDisable: boolean = true;
  searchDisable: boolean = true;
  labelStyle: any = '';
  loading: boolean;
  disableAssigneeList: boolean = false; // This variable will be used to disable the assignee list when RR about to be resolved or completed
  currentUserObj: any;

  fileObs = [];
  originalFilesNumber = 0;
  jiraId: string;
  activeLink: string;
  deleteIconStyle: string;
  navPageFrom: string;
  hoverEdit: boolean;
  readOnlyFromMail: boolean = false;
  rejectedRuleResponse: any[] = [];
  rejectedIdeaResponse: any[] = [];
  acceptedRuleResponse: any[] = [];
  acceptedIdeaResponse: any[] = [];
  issueList: IssueLinkResearchRequest[] = [];
  routeSub: Subscription;

  //labels
  clientToolTip: string = '';
  superPayerSelToolTip: string = '';
  selPayListToolTip: string = '';
  lineOfBusinessTooltip: string = '';

  rrFileSelectionStyle = 'span-rr-file-selection-readonly';
  teamStyle = this.dropDownStyles;
  rrRowRuleCommentEdit = true;

  isAuthenticated: boolean;
  rrDueDateEnable: boolean = true;
  teamDisable: boolean = true;
  isClient: boolean = false;

  constructor(
    private utils: AppUtils,
    public route: ActivatedRoute,
    private teamService: TeamsService,
    private toastService: ToastMessageService,
    private researchRequestService: ResearchRequestService,
    private router: Router,
    private dialogService: DialogService,
    private eclConstants: ECLConstantsService,
    private utilsService: UtilsService,
    private userService: UsersService,
    private confirmationService: ConfirmationService,
    private storageService: StorageService,
    private fileManagerService: FileManagerService,
    private researchRequestValidation: ResearchRequestValidation,
    private rrUtils: RrUtils,
    private oktaAuth: OktaAuthService
  ) {
    this.searchCCUsers = _.debounce(this.searchCCUsers, 1000);
    this.searchWatcherUsers = _.debounce(this.searchWatcherUsers, 1000);
    this.populateResearchRequestDetails = _.debounce(this.populateResearchRequestDetails, 2000);
    this.researchRequestObj = new ResearchRequestDto();
  }

  ngOnInit() {

    this.getAllLobs();
    this.getAllRuleEngines();
    this.getAllCIJiraTeams();
    this.getAllIssueTypes();
    this.getAllRequestPolicyTypes();
    this.getAllAttachmentCategories();
    this.getAllSDPriority();
    this.getAllEllCommitteeReview();
    this.getAllEllQaResultReason();
    this.getResearchRequestClients();
    this.getAllActiveUsers();
    this.getAllRequestClassifications();
    this.getAllRouteToOptionsList();
    this.getRuleResponseStatusLookUps();
    this.getRuleResponseTypeChangeLookUps();
    this.populateRuleStatusResponseHeaders();
    this.getAllPayerStatus();
    this.getAllSendBackReasons();
    this.utils.getAllLookUps(Constants.RR_WORKFLOW_STATUS, this.rrStatusList, false);
    this.utils.getAllLookUps(Constants.PROJECT_REQUEST_BUTTON_DISABLED, this.prBtnDisableSelect, false);

    this.ruleResponses = [];
    this.oldRuleResponses = [];
    this.minimumDate();
    this.rrTabIndex = 0;
    this.userId = this.utils.getLoggedUserId();
    this.route.queryParams.subscribe(params => {
      if (params['rrPathParams']) {
        let requestObj = JSON.parse(atob(params['rrPathParams']));
        this.rrCode = requestObj['rrCode'];
        this.navPagePath = requestObj['navPagePath'];
        this.navPageTitle = requestObj['navPageTitle'];
        this.rrReadOnly = requestObj['rrReadOnly'];
        this.rrButtonsDisable = requestObj['rrButtonsDisable'];
        this.navPageFrom = requestObj['navPageFrom'];
        this.searchDisable = requestObj['searchDisable'];
      }
    });

    this.routeSub = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.getRuleResponses();
        this.issue.getResearchCloneIssueLinks(this.rrId);
        this.getResearchRequestDetails();
      }
    })

    if (this.rrCode) {
      this.rrId = Number(this.rrCode.split("-")[1].trim());
      this.issue.getResearchCloneIssueLinks(this.rrId);
    }
    this.getRuleResponses();
    if (this.storageService.exists('userSession')) {
      this.currentUserObj = this.storageService.get('userSession', true);
    } else {
      this.currentUserObj = null;
    }
    this.activeLink = 'active-link';
  }

  ngAfterViewInit() {
    this.getResearchRequestDetails();
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
  /* Method to set the min date to current today date */
  private minimumDate() {
    this.currentDate = new Date().toString();
  }

  private getAllRuleEngines() {
    this.utils.getAllEngines(this.ruleEngineList, this.response).then(() => {
      let ruleEngineListTemp = [{ label: 'Choose', value: null }];
      let ruleEngineTemp = this.ruleEngineList.find(ele => ele.label === Constants.ECL_NAME_VALUE);
      ruleEngineListTemp = [...ruleEngineListTemp, ruleEngineTemp];
      ruleEngineTemp = this.ruleEngineList.find(ele => ele.label === Constants.ICMS_NAME_VALUE);
      ruleEngineListTemp = [...ruleEngineListTemp, ruleEngineTemp];
      ruleEngineTemp = this.ruleEngineList.find(ele => ele.label === Constants.CVP_NAME_VALUE);
      (ruleEngineTemp.label === Constants.CVP_NAME_VALUE) ? ruleEngineTemp.value = Constants.CVP_ECL_STAGE_VALUE : ruleEngineTemp.value = '';
      ruleEngineListTemp = [...ruleEngineListTemp, ruleEngineTemp];
      ruleEngineTemp = this.ruleEngineList.find(ele => ele.label === Constants.CPE_NAME_VALUE);
      ruleEngineListTemp = [...ruleEngineListTemp, ruleEngineTemp];
      this.ruleEngineList = [...ruleEngineListTemp];
    });
  }

  /* Callback methods to fetch all the dropdown values*/
  private getAllLobs() {
    this.utils.getAllLobsValue(this.lineOfBusinessList, this.response);
  }
  private getAllCIJiraTeams() {
    this.utils.getAllCIJiraTeams(this.teamsList, this.response);
  }
  private getAllIssueTypes() {
    this.utils.getAllLookUps(Constants.RR_ISSUE_TYPE, this.issueTypeList, this.response);
  }
  private getAllRequestPolicyTypes() {
    this.utils.getAllLookUps(Constants.RR_POLICY_TYPE, this.policyTypeList, this.response);
  }
  private getAllAttachmentCategories() {
    this.utils.getAllLookUps(Constants.RR_ATTACHMENT_CATEGORIES, this.attachmentCategoryList, this.response);
  }
  private getAllSDPriority() {
    this.utils.getAllLookUps(Constants.RR_SD_PRIORITY, this.SDPriorityList, this.response);
  }
  private getAllEllCommitteeReview() {
    this.utils.getAllLookUps(Constants.RR_ELL_COMMITTEE_REVIEW, this.eLLCommitteeList, this.response);
  }
  private getAllEllQaResultReason() {
    this.utils.getAllLookUps(Constants.RR_ELL_QA_RESULT_REASON, this.QAReasonList, this.response);
  }
  private getAllRequestClassifications() {
    this.utils.getAllLookUps(Constants.RR_REQUEST_CLASSIFICATION, this.requestClassificationList, this.response);
  }
  private getAllActiveUsers() {
    this.utils.getAllActiveUsers(this.activeUsersList);
  }
  private getAllPayerStatus() {
    this.utils.getAllLookUps(Constants.RR_PAYER_STATUS, this.payerStatusList, this.response);
  }
  private getAllSendBackReasons() {
    this.utils.getAllLookUps(Constants.RR_SEND_BACK_REASON, this.sendBackReasonList, this.response);
  }

  /** Method to fetch the route to options based on the status */
  private getAllRouteToOptionsList() {
    this.routeToList = [{ label: "Choose", value: null }];
    this.utilsService.getAllLookUps(Constants.RR_ROUTE_TO_TYPE).subscribe(response => {
      if (response !== null && response !== undefined) {
        response.forEach((lookup: any) => {
          if (this.researchRequestObj.rrStatus) {
            if (this.researchRequestObj.rrStatus === Constants.RR_WORKFLOW_STATUS_ASSITANCE_COMPLETED) {
              if (lookup.lookupCode === Constants.RR_ROUTE_TO_VALUE_NEED_ADDITIONAL_RESEARCH ||
                lookup.lookupCode === Constants.RR_ROUTE_TO_VALUE_REQUESTOR_REVIEW_CODE) {
                this.routeToList.push({ label: lookup.lookupDesc, value: lookup.lookupId });
              }
            } else if (this.checkRRStatusInProgOrCompletedOrNotStarted(this.researchRequestObj.rrStatus)) {
              if ((lookup.lookupCode === Constants.RR_ROUTE_TO_VALUE_SUBMIT_ASSISTANCE_CODE) ||
                (lookup.lookupCode === Constants.RR_ROUTE_TO_VALUE_REQUESTOR_REVIEW_CODE)) {
                this.routeToList.push({ label: lookup.lookupDesc, value: lookup.lookupId });
              }
            } else if ((this.researchRequestObj.rrStatus === Constants.RR_WORKFLOW_STATUS_PENDING_ASSISTANCE) &&
              (lookup.lookupCode === Constants.RR_ROUTE_TO_VALUE_ASSISTANCE_COMPLETED_CODE ||
                lookup.lookupCode === Constants.RR_ROUTE_TO_VALUE_SUBMIT_ASSISTANCE_CODE)) {
              this.routeToList.push({ label: lookup.lookupDesc, value: lookup.lookupId });
            } else if (this.researchRequestObj.rrStatus === Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW &&
              (lookup.lookupCode === Constants.RR_ROUTE_TO_VALUE_CODE_SBFR || lookup.lookupCode === Constants.RR_ROUTE_TO_VALUE_CODE_RC)) {
              this.routeToList.push({ label: lookup.lookupDesc, value: lookup.lookupId });
            }
          }
        });
        this.showAssigneeList();
      }
    });
    this.researchRequestObj.rrRouteTo = null;
  }

  /** Method to show the assignee list based on the rrstatus and the route to options selected */
  showAssigneeList() {
    this.enableComment = false;
    this.enableReason = false;
    let selectedRouteTo: any = this.researchRequestObj.rrRouteTo;
    this.assigneeList = [{ label: "Choose", value: null }];
    this.removeRedOutline('txtComments');
    if (selectedRouteTo !== null && selectedRouteTo !== undefined && selectedRouteTo !== 'null' && this.routeToList &&
      this.routeToList.length > 0) {
      this.researchRequestObj.assignee = null;
      const routeTo = Number(this.researchRequestObj.rrRouteTo);
      const routeToObj = this.routeToList.find(element => element.value === routeTo);
      this.checkForCommentandClassification(routeToObj, this.researchRequestObj.rrResolutionComments, this.researchRequestObj.rrReqClassificationId);
      if (this.researchRequestObj.rrStatus === Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW) {
        if (routeToObj !== undefined && routeToObj !== null && Constants.RR_WORKFLOW_STATUS_SEND_BACK_FOR_RESEARCH === routeToObj.label) {
          this.assigneeList = [{ label: "Choose", value: null }];
          this.getPOAssigneeUser();
          this.disableAssigneeList = false;
        } else {
          this.disableAssigneeList = true;
        }
      } else if (this.researchRequestObj.rrStatus === Constants.RR_WORKFLOW_STATUS_PENDING_ASSISTANCE) {
        this.assigneeList = [{ label: "Choose", value: null }];
        if (Constants.RR_WORKFLOW_STATUS_SUBMIT_FOR_ASSISTANCE === routeToObj.label) {
          this.getECLPOList();
        } else {
          this.getPOAssigneeUser();
        }
        this.disableAssigneeList = false;
      } else if (this.researchRequestObj.rrStatus === Constants.RR_WORKFLOW_STATUS_RESEARCH_COMPLETED) {
        this.disableAssigneeList = true;
      } else if (this.checkRRStatusInProgOrCompletedOrNotStarted(this.researchRequestObj.rrStatus)) {
        this.assigneeList = [{ label: "Choose", value: null }];
        const teamDropDown = document.getElementById('teamName');
        if (Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW === routeToObj.label) {
          this.updateAssigneeList(this.researchRequestObj.rrCreatedBy);
          this.teamStyle = this.dropDownStyles;
          this.teamDisable = true;
        } else if (Constants.RR_WORKFLOW_STATUS_NEED_ADDITIONAL_RESEARCH === routeToObj.label) {
          this.teamDisable = false;
          teamDropDown.scrollIntoView();
          teamDropDown.focus();
          this.teamStyle = this.dropDownStylesBlue;
          if (this.researchRequestObj.teamAssignee) {
            this.populateAssigneeList(this.activeUsersList, this.researchRequestObj.teamAssignee);
            this.researchRequestObj.assignee = this.researchRequestObj.teamAssignee;
          }
        } else {
          this.getECLPOList();
        }
        this.disableAssigneeList = false;
      } else {
        this.disableAssigneeList = false;
      }
    } else {
      this.populateAssigneeList(this.activeUsersList, this.researchRequestObj.assignee);
    }
  }
  checkStatusforRequestorReview() {
    const routeTo = Number(this.researchRequestObj.rrRouteTo);
    const routeToObj = this.routeToList.find(element => element.value === routeTo);
    return (routeToObj && routeToObj.label === Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW);

  }

  checkForCommentandClassification(routeToObj: any, comments: string, classification: number) {
    let commentBox = document.getElementById('rrResoComments');
    if (routeToObj.label === Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW && (!comments || !classification)) {
      if (!comments) {
        commentBox.className = 'form-control input-textarea focus-glow';
      }
      commentBox.focus();
      return false;
    } else {
      commentBox.className = 'form-control input-textarea';
    }
  }

  /** Method to fetch the user for PO returning the research request */
  getPOAssigneeUser() {
    this.researchRequestService.getAssignedToByLastSubmittedRR(this.rrId).subscribe(response => {
      this.updatePOAssignedList(response.data);
    });
  }

  /** Method to update the assignee list for the Policy owner */
  updatePOAssignedList(userId: number) {
    if (this.activeUsersList.length > 0) {
      this.populateAssigneeList(this.activeUsersList, userId);
    } else {
      this.utilsService.getAllActiveUsers().subscribe(response => {
        if (response.data !== null && response.data !== undefined) {
          this.activeUsersList = response.data;
          this.populateAssigneeList(this.activeUsersList, userId);
        }
      });
    }
  }

  /** Method to retrieve ECL PO List */
  getECLPOList() {
    let PORole = this.eclConstants.USERS_POLICY_OWNER_ROLE;
    this.utilsService.getUsersByRole(PORole).subscribe(response => {
      if (response !== undefined && response !== null && response.length > 0) {
        this.assigneeList = [{ label: "Choose", value: null }];
        response.forEach(user => {
          this.assigneeList.push({
            label: `${user.firstName} ${user.lastName}`,
            value: user.userId
          });
        });
      }
    });
  }

  /** Method to populate the assignee list for the Policy owner */
  populateAssigneeList(usersList: any[], userId: number) {
    if (userId) {
      this.assigneeList = [];
      usersList.forEach(user => {
        if (user.userId === userId) {
          this.assigneeList.push({
            label: `${user.firstName} ${user.lastName}`,
            value: user.userId
          });
        }
      });
    }
  }

  /** Method to fetch the rule responses added for the research request */
  private getRuleResponses() {
    this.researchRequestService.getRuleResponses(this.rrId).subscribe(response => {
      if (response.data) {
        this.ruleResponses = [];
        this.oldRuleResponses = [];
        this.ruleResponses = this.combineOldVersions(response.data);
        this.ruleResponses = this.updateEngineLabel(this.ruleResponses);
        this.oldRuleResponses = response.data;
        this.updateApprovalStatus(this.ruleResponses);
        this.disableRequestClassifiactionOptions(null);
      }
    });
  }

  /**
   * Method combines similiar Rule Codes Together if previousVersionLibraryRulePresent is true. Otherwise,
   * continue as regular rule.
   * @param ruleList Response Rule List Data
   * @return ruleList back to ruleResponses to update
   */
  private combineOldVersions(ruleList: ResearchRequestSearchedRuleDto[]): ResearchRequestSearchedRuleDto[] {
    const filterOutList: string[] = [];
    if (ruleList && ruleList.length > 0) {
      const updatedRuleList = ruleList.map(rule => {
        if (rule.previousVersionLibraryRulePresent) {
          const { ruleCode } = this.locateSameRuleWithDiffVersion(ruleList, rule.ruleCode.split('.'));
          if (ruleCode) { filterOutList.push(ruleCode) }
          // Stack the old and new version together with space between to split again
          rule.ruleCode += (' ' + ruleCode);
          return rule;
        } else {
          return rule;
        }
      })

      // If FilterOutList contains filters then remove old version rows else individual rule.
      if (filterOutList.length > 0) {
        return updatedRuleList.filter(rule => {
          if (rule && rule.ruleCode) {
            this.oldVersionSavedRuleResponse.push(rule);
            return !filterOutList.includes(rule.ruleCode);
          }
        });
      } else {
        return updatedRuleList;
      }
    } else {
      return [];
    }
  }

  /**
   * Method to locate Same Rule Code with different versions
   * @param ruleList Array of rules to search
   * @param idVersion Compare againist the rule's version ids.
   * @returns Match has been found, return the rule to be combined
   */
  private locateSameRuleWithDiffVersion(ruleList: ResearchRequestSearchedRuleDto[], idVers: string[]) {
    return ruleList.find(rule => {
      const subIdVers = rule.ruleCode.split('.');
      if (idVers[0] === subIdVers[0] && idVers[1] !== subIdVers[1]) {
        return rule.ruleCode;
      }
    })
  }

  private cleanCombinedVersions(ruleList: ResearchRequestSearchedRuleDto[]) {
    return ruleList.map(rule => {
      const multiCode = rule.ruleCode.split(' ');
      if (multiCode && multiCode.length > 1) {
        rule.ruleCode = multiCode[1]; // Old Version
      }
      return rule;
    })
   }

  private updateEngineLabel(ruleResponses: any, type: boolean = true) {
    if (type) {
      return ruleResponses.map(rule => {
        return this.engineConvert(rule);
      })
    } else {
      const rule = { eclRuleEngineId: ruleResponses, engine: null }
      return this.engineConvert(rule).engine;
    }
  }
  private engineConvert(rule) {
    const engine = this.ruleEngineList.find(ele => ele.value === rule.eclRuleEngineId);
    if (engine !== null && engine !== undefined) {
      rule.engine = engine.label;
      return rule;
    } else {
      rule.engine = 'ECL'
      return rule
    }
  }

  private getChangeTypeValues(rowData: any) {
    let updatedChangeTypeValues;
    if (rowData !== null && rowData !== undefined
      && (rowData.ruleStatus === Constants.IDEA_STATUS || rowData.ruleStatus === Constants.PROVISIONAL_RULE)) {
      updatedChangeTypeValues = this.ideaChangeTypesCodes;
    } else {
      updatedChangeTypeValues = this.changeTypesCodes;
    }
    return updatedChangeTypeValues;
  }

  private getRuleResponseStatusLookUps() {
    this.utils.getAllLookUps(Constants.RR_RULE_RESPONSE_STATUS, this.ruleResponseStatus, this.response);
  }

  private getRuleResponseTypeChangeLookUps() {
    this.utils.getAllLookUps(Constants.RR_RULE_RESP_TYPE_CHNG, this.changeTypesCodes, this.response);
    this.utils.getAllLookUps(Constants.RR_RULE_RESP_TYPE_CHNG_IDEA, this.ideaChangeTypesCodes, this.response);
  }
  viewRuleModal(rowInfo) {
    if (rowInfo.ruleStatus === 'Idea') {
      this.dialogService.open(NewIdeaComponent, {
        data: {
          ideaId: rowInfo.ruleId,
          readOnly: true
        },
        header: 'Idea Details',
        width: '80%',
        height: '95%',
        contentStyle: { "max-height": "95%", "overflow": "auto" }
      });
    } else if (rowInfo.ruleStatus === 'Draft') {
      this.createNewIdeaRR(rowInfo.ruleId);
    } else {
      this.dialogService.open(ProvisionalRuleComponent, {
        data: {
          ruleId: rowInfo.ruleId,
          header: Constants.LIBRARY_VIEW,
          reviewStatus: this.getReviewStatus(rowInfo),
          ruleReview: true,
          provisionalRuleCreation: false,
          fromMaintenanceProcess: true,
          readWrite: false,
          readOnlyView: true
        },
        header: Constants.LIBRARY_RULE_DETAILS,
        width: '80%',
        height: '92%',
        closeOnEscape: false,
        closable: false,
        contentStyle: {
          'max-height': '92%',
          'overflow': 'auto',
          'padding-top': '0',
          'padding-bottom': '0',
          'border': 'none'
        }
      });
    }
  }

  getReviewStatus(rowInfo: any): any {
    let ret = [{ label: '', value: null }];
    if (rowInfo.impactType != '') {
      ret.push({ label: Constants.APPROVED, value: Constants.APPROVED });
      ret.push({ label: Constants.SUBMIT_FOR_APPROVAL, value: Constants.SUBMIT_FOR_APPROVAL });
      ret.push({ label: Constants.NOT_APPROVED, value: Constants.NOT_APPROVED });
    }
    return ret;
  }

  /* Method to fetch the Research Request  details based on the RRId */
  async getResearchRequestDetails() {
    if (this.rrId) {
      this.researchRequestService.getResearchRequestDetails(this.rrId).subscribe(response => {
        if (response.data !== null && response.data !== undefined) {
          this.researchRequestObj = response.data;
          if (this.researchRequestObj.rrStatus !== Constants.NOT_STARTED) {
            this.startRrDisable = true;
          }
          if (this.issueTypeList != null && this.issueTypeList.length > 0) {
            this.issueTypeList = this.issueTypeList.filter(item => item.label === 'Policy Research Request')
          }
          this.populateResearchRequestDetails();
        }
      });
    } else {
      this.navigateBack();
    }
  }

  /* Method to populate the data of the selected research request */
  populateResearchRequestDetails() {
    this.setLineOfBusinessToolTip();
    this.setClientToolTip();
    this.getTeamMembersList();
    this.populateReporter();
    this.populateClientAndPayers();
    this.getAllRouteToOptionsList();
    this.disableRequestClassifiactionOptions(null);
    this.showAssigneeList();
    this.fileObs = [];
    this.originalFilesNumber = this.researchRequestObj.requestAttachments.length;
    this.jiraId = (this.researchRequestObj.jiraId) ? this.researchRequestObj.jiraId : '';
    this.populateSelectedNotifyUsers();
    this.editableAllFields();
  }



  /* Callback method to populate payers list and the selected payers from the research request Dto object */
  populateClientAndPayers() {
    if (this.researchRequestObj.clientSelected.length > 0) {
      this.isClient = false;
      this.researchRequestService.getRRSuperPayersByClient(this.researchRequestObj.clientSelected).subscribe((response: any) => {
        if (response.data !== null && response.data !== undefined) {
          this.superPayerList = [];
          response.data.forEach(superPayer => {
            this.superPayerList.push({ label: superPayer.description, value: superPayer.rrPayerId })
          });
          this.setSuperPayersToolTip();
        }
      });
      this.populatePayersByPayerStatus();
    } else {
      this.isClient = true;
      this.payerList = [];
      this.superPayerList = [];
      this.clientToolTip = '';
      this.superPayerSelToolTip = '';
      this.selPayListToolTip = '';
      this.researchRequestObj.clientSelected = [];
      this.researchRequestObj.superPayersSelected = [];
      this.researchRequestObj.selectedPayerList = [];
    }
  }

  /**
  * The method to filter payers based on
  * Payer status
  */
  populatePayersByPayerStatus() {
    let selPayerOpts: number[] = [];
    const { value: showAllPayers } = this.payerStatusList.find(vl => vl.label === 'Show All Payers');
    const { value: showActivePayers } = this.payerStatusList.find(vl => vl.label === 'Show Active Payers');

    if (this.researchRequestObj.selectedPayerStatus === showActivePayers) {
      selPayerOpts.push(showActivePayers);
    } else {
      selPayerOpts.push(showActivePayers);
      selPayerOpts.push(showAllPayers);
    }
    this.researchRequestService.getRRPayersByClientAndStatus(
      this.researchRequestObj.clientSelected, selPayerOpts).subscribe((response: any) => {
        if (response.data !== null && response.data !== undefined) {
          this.payerList = [];
          response.data.forEach(payer => {
            this.payerList.push({ label: payer.description, value: payer.rrPayerId })
          });
          this.setPayersToolTip();
        }
      });
  }

  /* Callback method to fetch all the available Research Request client payer values */
  private getResearchRequestClients() {
    this.researchRequestService.getResearchRequestClients().subscribe(response => {
      if (response.data !== null && response.data !== undefined) {
        response.data.forEach(client => {
          this.clientsList.push({ label: client.clientName, value: client.clientId })
        });
      }
    });
  }

  /* Callback method to update the unique clients dropdown list based on the payers list object */
  updateClientsList(payer: any) {
    if (!this.clientsList.some(clientObj => clientObj.value === payer.clientId)) {
      this.clientsList.push({ label: payer.clientName, value: payer.clientId });
    }
  }

  /* Method to fetch all the users of the team selected .
 @update teamAssigneeList(all the users in the team with PO,CCA and MD role).
 @update teamSupervisorsList(all the users in the team with PO role).
 */
  getTeamMembersList(clearTeamAssignee?: boolean) {
    if (this.researchRequestObj.team) {
      if (clearTeamAssignee) {
        this.researchRequestObj.assignee = null;
        this.researchRequestObj.teamAssignee = null;
      }

      this.teamService.getUsersFromTeam(this.researchRequestObj.team).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          if (response.data.users) {
            this.teamSupervisors = [];
            this.teamAssigneeList = [];
            response.data.users.forEach(user => {
              this.teamAssigneeList.push({ label: user.firstName, value: user.userId });
              if (user.roles) {
                user.roles.forEach(role => {
                  if (role.roleName === Constants.PO_ROLE) {
                    this.teamSupervisors.push({ label: user.firstName, value: user.userId });
                  }
                });
              }
            });
          }
        }
      });
    }
  }

  /* Method to fetch the active users based on the keyword search.
  @update the userSearchList (all the active users matching the keyword search)
  @update the selectedCCUsersList(all the unique users selected from the userSearchList)
  */
  searchCCUsers() {
    this.ngForm.form.markAsDirty();
    if (this.searchUser && this.activeUsersList) {
      this.userSearchList = [];
      this.updateUserSearchList(this.userSearchList, this.searchUser);
      this.userSearchList.forEach(searchUser => {
        if (this.searchUser === searchUser.firstName) {
          if (!this.selectedCCUsersList.some(selectedUserObj => selectedUserObj.firstName === this.searchUser)) {
            this.selectedCCUsersList = [...this.selectedCCUsersList, ...this.userSearchList.filter(user => user.firstName === this.searchUser)];
            this.searchUser = "";
            this.userSearchList = [];
          } else {
            this.searchUser = "";
            this.userSearchList = [];
          }
        }
      });
      this.selectedCCUsersList = this.removedDuplicateEntry(this.selectedCCUsersList);
    } else {
      this.userSearchList = [];
    }
  }

  searchWatcherUsers() {
    this.ngForm.form.markAsDirty();
    if (this.searchWatcherUser && this.activeUsersList) {
      this.userSearchWatcherList = [];
      this.updateWatcherUserSearchList(this.userSearchWatcherList, this.searchWatcherUser);
      this.userSearchWatcherList.forEach(searchWatcherUser => {
        if (this.searchWatcherUser === searchWatcherUser.firstName) {
          if (!this.selectedWatcherUsersList.some(selectedUserObj => selectedUserObj.firstName === this.searchWatcherUser)) {
            this.selectedWatcherUsersList = [...this.selectedWatcherUsersList, ...this.userSearchWatcherList.filter(user => user.firstName === this.searchWatcherUser)];
            this.searchWatcherUser = "";
            this.userSearchWatcherList = [];
          } else {
            this.searchWatcherUser = "";
            this.userSearchWatcherList = [];
          }
        }
      });
      this.selectedWatcherUsersList = this.removedDuplicateEntry(this.selectedWatcherUsersList);
    } else {
      this.userSearchWatcherList = [];
    }
  }
  /* callback Method to fetch the active users based on the keyword search from active users list*/
  updateUserSearchList(userSearchList: any[], searchUser: string) {
    this.activeUsersList.forEach(user => {
      if (user.firstName && user.email) {
        if (!this.selectedCCUsersList.some(userObj => userObj.userId === user.userId)) {
          if (user.firstName.toLowerCase().includes(searchUser.toLowerCase()) || user.email.toLowerCase().includes(this.searchUser.toLowerCase())) {
            userSearchList.push(user);
          }
        }
      }
    });
  }
  /* callback Method to fetch the active users based on the keyword search from active users list*/
  updateWatcherUserSearchList(userSearchWatcherList: any[], searchWatcherUser: string) {
    this.activeUsersList.forEach(user => {
      if (user.firstName && user.email) {
        if (!this.selectedWatcherUsersList.some(userObj => userObj.userId === user.userId)) {
          if (user.firstName.toLowerCase().includes(searchWatcherUser.toLowerCase()) || user.email.toLowerCase().includes(this.searchWatcherUser.toLowerCase())) {
            userSearchWatcherList.push(user);
          }
        }
      }
    });
  }

  /* Method to to remove from the selectedCCUsersList
  @input:selectedUser Object
  */
  removeSelectedCCUser(user: any) {
    this.removedCCUsersList = this.selectedCCUsersList.filter(userObj => userObj.email === user.email);
    this.selectedCCUsersList = this.selectedCCUsersList.filter(userObj => userObj.email !== user.email);
    if (this.selectedCCUsersList.length < 1) {
      this.searchUser = '';
      this.userSearchList = [];
    }
  }

  /* Method to to remove from the selectedWatcherUsersList
  @input:selectedUser Object
  */
  removeSelectedWatcherUser(user: any) {
    this.removedWatcherUsersList = this.selectedWatcherUsersList.filter(userObj => userObj.email === user.email);
    this.selectedWatcherUsersList = this.selectedWatcherUsersList.filter(userObj => userObj.email !== user.email);
    if (this.selectedWatcherUsersList.length < 1) {
      this.searchWatcherUser = "";
      this.userSearchWatcherList = [];
    }
  }

  /* Method to click the file input by using the id of the input*/
  clickFileUpload() {
    if (!this.searchDisable) {
      let activeAttachments: any[] = (this.researchRequestObj.requestAttachments.length > 0) ? this.researchRequestObj.requestAttachments.filter(attachment => attachment.deleted === false) : [];
      let attachmentListSize = activeAttachments.length + this.fileObs.length; // size variable to upload only 5 file attachments
      if (attachmentListSize < 5) {
        this.rrFileInput.nativeElement.click();
      } else {
        this.maxFilesWarning();
      }
    }
  }

  /* Method to add files into the */
  addFiles(event: any) {
    this.ngForm.form.markAsDirty();
    let fileList: FileList = event.target.files;
    this.updateFilesList(fileList);
    this.rrFileInput.nativeElement.value = '';
  }

  /* Method to show a warning message for the maximum files */
  maxFilesWarning() {
    let warnMessage: string = `maximum five files can be uploaded`;
    this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 4000, true);
  }

  /* Method to update selected files into filelist
  @input : html event object
  add unique files less than 10mb to fileslist object
  show warn messages for duplicate files and large files
  */
  updateFilesList(fileList: any) {
    let activeAttachments: any[] =
      (this.researchRequestObj.requestAttachments.length > 0) ?
        this.researchRequestObj.requestAttachments.filter(attachment => attachment.deleted === false) : [];
    for (let i = 0; i < fileList.length; i++) {
      let size = fileList[i].size / 1024 / 1024; // size conversion to MB.
      if (size < Constants.MAX_FILE_SIZE) {
        let attachmentListSize = activeAttachments.length + this.fileObs.length; // size variable to upload only 5 file attachments
        if (attachmentListSize < 5) {
          if (!this.fileObs.some(file => file.name === fileList[i].name) && !activeAttachments.some(fileObj => fileObj.attachmentFileName === fileList[i].name)) {
            this.fileObs.push({
              observable: this.fileManagerService.uploadFile(
                fileList[i], Constants.RESEARCH_REQUEST_PROCESS_FILE),
              name: fileList[i].name
            });
            let attachmentDto = new EclAttachmentDto;
            attachmentDto.fileName = fileList[i].name;
            attachmentDto.eclRrAttachmentsId = Math.floor(Math.random() * 100) * -1;
            attachmentDto.added = true;
            this.researchRequestObj.requestAttachments.push(attachmentDto);
          } else {
            let warnMessage: string = `File '${fileList[i].name}' already Exists, please upload a new file`;
            this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 4000, true);
          }
        } else {
          this.maxFilesWarning();
          break;
        }
      } else {
        let warnMessage: string = `File ${fileList[i].name} has ${Math.round(size)}MB of size, max file size uploaded 10MB`;
        this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 4000, true);
      }
    }
  }

  /* Method to remove the selected file from the selected files list based on the name of the file
 @input : file object
 reseting the file input if the length of the files list if empty
 */
  removeSelectedFile(fileObj: any) {
    this.fileObs = this.fileObs.filter(file => file.name !== fileObj.name);
    if (this.fileObs.length < 1) {
      this.rrFileInput.nativeElement.value = '';
    }
  }

  /* Method to delete a file attached to research request Object
  setting the deletedstatus value of the list index object to true,
  to pass the entire update list when the save or submit event occurs.
  */
  removeSavedFile(attachmentId: number, fileName: string) {
    if (attachmentId < 0) {
      this.researchRequestObj.requestAttachments =
        this.researchRequestObj.requestAttachments.filter(fileObj => fileObj.eclRrAttachmentsId !== attachmentId);
      this.fileObs = this.fileObs.filter(obs => obs.name !== fileName);
    } else {
      this.researchRequestObj.requestAttachments.forEach(fileObj => {
        if (fileObj.eclRrAttachmentsId === attachmentId) {
          fileObj.deleted = true;
        }
      });
    }
  }

  /* Method to download the selected file
    */
  downloadSavedFile(fileId: number, fileName: string) {
    this.fileManagerService.downloadFile(fileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, fileName);
    });
  }

  /**
   * method to navigate back to the requested page.
   */
  navigateBack() {
    if (this.showExitButton()) {
      this.router.navigate([this.navPagePath], { queryParams: { view: true } });
    } else {
      this.router.navigate([this.navPagePath]);
    }
  }

  /**
   * Validate for submit button to enable or disable based on Research Request(rr) rrStatus
   * Progress, Pending Assistance, Requestor Review. False to enable.
   */
  validateSubmitBtn(): boolean {
    let res: boolean = true;
    const { assignee, rrResolutionComments, rrReqClassificationId, rrStatus } = this.researchRequestObj;
    const rrRouteTo = Number(this.researchRequestObj.rrRouteTo);
    const routeToObj = this.routeToList.find(element => element.value === rrRouteTo);

    if (this.validateProgress(rrRouteTo, assignee, routeToObj, rrResolutionComments, rrReqClassificationId, rrStatus) ||
      this.validatePendingAssistance(rrRouteTo, assignee, rrStatus) ||
      this.validateRequestorReview(rrRouteTo, assignee, rrStatus)) {
      res = false;
    }
    return res;
  }

  /**
   * Validation for rrStatus in Progress, Completed, Not Started, Send Back to Research flow.
   * @param rrRouteTo check if rrRouteTo exist
   * @param assignee check if assignee exist
   * @param routeToObj check if routeTo object exist
   * @param rrResolutionComments  when rrStatus is RequestorReview to check
   * @param rrReqClassificationId when rrStatus is RequestorReview to check
   * @param rrStatus Check which status we're going in
   */
  private validateProgress(rrRouteTo: number, assignee: number, routeToObj, rrResolutionComments: string, rrReqClassificationId: number, rrStatus: string): boolean {
    if (this.checkRRStatusInProgOrCompletedOrNotStarted(rrStatus) && !this.validateRuleResponseType('changeType') && rrRouteTo && assignee && routeToObj) {
      if (Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW === routeToObj.label && this.validateRuleStatus()) {
        if (rrResolutionComments && rrReqClassificationId) {
          return true
        }
      } else {
        return true;
      }
    }
  }

  /**
   * Validation for rrStatus in Pending Assistance flow.
   */
  private validatePendingAssistance(rrRouteTo: number, assignee: number, rrStatus: string): boolean {
    if (rrStatus === Constants.RR_WORKFLOW_STATUS_PENDING_ASSISTANCE && !this.validateRuleResponseType('rrRuleStatus') && rrRouteTo && assignee) {
      return true
    }
  }

  /**
   * Validation for rrStatus in Pending Assistance flow.
   */
  private validateRequestorReview(rrRouteTo: number, assignee: number, rrStatus: string): boolean {
    if (rrStatus === Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW && (this.isRouteToResearchCompleted() || assignee) && rrRouteTo) {
      return true
    }
  }

  /**
  * method to validate the rule responses based on the rr status for CCA role and PO role.
  */
  validateRuleResponseType(param: string): boolean {
    let res: boolean = true;
    if (this.ruleResponses && this.ruleResponses.length > 0) {
      const type = this.ruleResponses.find(row => row[param] === null);
      if (!type) {
        res = false;
      }
    } else {
      res = false;
    }
    return res;
  }

  /**
   * validateRuleStatus check for Reject and Accept. If ruleReponse array rrRuleStatus contains 'Reject' label, then
   * enable submit button. However if 'Accept' label is detected then don't enable it. (Continue with flow)
   */
  validateRuleStatus(): boolean {
    let res: boolean = true;
    const { value: rejValue } = this.ruleResponseStatus.find(v => v.label === "Reject");
    const { value: accValue } = this.ruleResponseStatus.find(v => v.label === "Accept");
    if (this.ruleResponses && this.ruleResponses.length > 0) {
      if (this.ruleResponses.find(({ rrRuleStatus }) => rrRuleStatus === rejValue) &&
        !this.ruleResponses.find(({ rrRuleStatus }) => rrRuleStatus === accValue)) {
        res = false
      }
    } else {
      res = false;
    }
    return res;
  }


  /* Method to save the new research request with all the required fields */
  updateResearchRequest(action: string) {
    this.loading = true;
    this.rrButtonsDisable = true;
    this.rrDueDateEnable = true;
    let saveTemplateObservable: Observable<any>;
    const routeTo = Number(this.researchRequestObj.rrRouteTo);
    const routeToObj = this.routeToList.find(element => element.value === routeTo);

    if (this.researchRequestValidation.validateFields(this.researchRequestObj, this.enableComment,
      this.enableReason, routeToObj, this.ruleResponses, this.ruleResponseStatus, !this.teamDisable)) {
      this.updateRequestFormData(action);
      if (this.ruleResponses) {  
        this.ruleResponses = this.cleanCombinedVersions(this.ruleResponses);
        this.ruleResponses.concat(this.oldVersionSavedRuleResponse);
      };
      if (this.fileObs && this.fileObs.length > 0) {
        let fileObservables = [];
        this.fileObs.forEach(element => fileObservables.push(element.observable));
        saveTemplateObservable = this.createFileRequestObservable(fileObservables)
          .pipe(mergeMap(() => this.researchRequestService.saveResearchRequest(this.researchRequestObj)));
      } else {
        saveTemplateObservable = this.researchRequestService.saveResearchRequest(this.researchRequestObj);
      }

      saveTemplateObservable.subscribe(response => {
        this.saved = true;
        this.showResponse(response, action);
      }, error => {
        this.loading = false;
        this.rrButtonsDisable = false;
        this.saved = false;
      });
    } else {
      this.loading = false;
      if ((this.navPageTitle === (Constants.RR_NAVIGATE_TITLE_SEARCH)) && this.researchRequestObj.rrCreatedBy === this.userId) {
        this.rrDueDateEnable = false;
      } else if (this.navPageTitle === (Constants.RR_NAVIGATE_TITLE_SEARCH)) {
        this.rrButtonsDisable = true;
      } else {
        this.rrButtonsDisable = false;
      }
    }

  }

  /* Method to create and update the new research request form data Object*/
  updateRequestFormData(action: string) {
    this.populateNotifyUserList();
    this.populateRejectedRuleList();
    if (this.ruleResponses.length > 0) {
      this.researchRequestObj.searchedRules = [];
      this.researchRequestObj.searchedRules = this.ruleResponses;
    }
    this.researchRequestObj.action = action;
    this.researchRequestObj.rrCreatedBy = this.utils.getLoggedUserId();
    this.researchRequestObj.screenName = this.navPageTitle;

    //set userid and encryptPass in rr obj
    let encryptUserData = JSON.parse(localStorage.getItem('ENCRYPT_USER_DATA'));
    this.researchRequestObj.userId = encryptUserData.username;
    this.researchRequestObj.encryptPass = encryptUserData.password;
  }

  /**
   * method to show the dialog message when delete a rule response added.
   */
  deleteRule(rowData: any) {
    if (!this.rrButtonsDisable) {
      if (this.checkRRStatusInProgOrCompletedOrNotStarted(this.researchRequestObj.rrStatus) &&
        (this.ruleResponseStatus.find(status => status.label === Constants.RR_RULE_STATUS_REJECT).label === rowData.rrRuleStatus)) {
        this.rowData = rowData;
        this.showDeleteRuleAttachment();
      } else {
        this.rowData = rowData;
        this.showDeleteRuleAttachment();
      }
    }
  }

  /**
   * method to cancel the dialog.
   */
  showDeleteRuleAttachment() {
    this.confirmationService.confirm({
      message: 'Are you sure you would like to remove this rule line item?',
      header: 'Confirmation',
      key: 'confirmAttachmentDialog',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delete();
      },
      reject: () => {
      }
    });
  }

  /**
   * method to disable the change type based on rr status.
   */
  disableChangeType(rowData: any) {
    let res: boolean = false;
    if (rowData.ruleStatus === Constants.RULE_POTENTIALLY_IMPACT_STATUS &&
      rowData.ruleResponseIndicator !== Constants.YES_IND) {
      rowData.changeType = this.changeTypesCodes.find(ele => ele.label === Constants.RR_NO_CHANGE).value;
      res = true;
    } else if (rowData.ruleStatus === Constants.RR_WORKFLOW_STATUS_DRAFT) {
      res = true;
    } else if (this.researchRequestObj.rrStatus === Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW) {
      res = true;
    }
    return res;
  }

  /**
   * method to disable the rr rule status column.
   */
  disableRRRuleStatus(rowData: any) {
    let res: boolean = false;
    if (rowData.ruleStatus === Constants.RR_WORKFLOW_STATUS_DRAFT) {
      res = true;
    } else if (this.checkRRStatusInProgOrCompletedOrNotStarted(this.researchRequestObj.rrStatus)) {
      if (this.validatePoOrMdUser()) {
        res = false;
      } else {
        res = true;
      }
    } else if (this.researchRequestObj.rrStatus === Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW) {
      res = true;
    } else if (this.researchRequestObj.rrStatus === Constants.RR_WORKFLOW_STATUS_PENDING_ASSISTANCE) {
      res = false;
    } else {
      res = false;
    }
    return res;
  }

  delete() {
    let code = this.rowData.ruleCode;
    let mappingId = this.rowData.rrRuleMappingId;
    let successMessage = '';

    if (mappingId != undefined) {
      this.deleteFromArray(code);
      this.researchRequestService.deleteRuleResponse(mappingId, code).subscribe(response => {
        if (response.data !== null && response.data !== undefined) {
          successMessage = `Research rule reponse has been removed successfully`;
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_WARN, successMessage, 3000, true);
          this.rrHistory.loadHistoryAuditLog();
        } else {
          let warnMessage: string = `Please try again or reach administrator`;
          this.toastService.messageError(Constants.TOAST_SUMMARY_WARN, warnMessage, 3000, true);
        }

      });
    } else {
      this.deleteFromArray(code)
      successMessage = `Research reponse has  removed successfully`;
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_WARN, successMessage, 3000, true);
    }

  }

  deleteFromArray(code: any) {
    for (let i = 0; i < this.ruleResponses.length; i++) {
      if (this.ruleResponses[i].ruleCode === code) {
        this.ruleResponses.splice(i--, 1);
      }
    }

  }

  searchRuleIds() {
    const ref = this.dialogService.open(ResearchRequestSearchRuleIdsComponent, {
      header: 'Rule Search',
      width: '70%'
    });
    ref.onClose.subscribe((addData: any) => {

      if (addData !== null && addData !== undefined) {
        addData.forEach(element => {
          const rrDto = new ResearchRequestSearchedRuleDto;
          rrDto.ruleCode = element.ruleCode;
          rrDto.ruleId = element.ruleId;
          rrDto.ruleName = element.ruleName;
          rrDto.ruleStatus = element.ruleStatus;
          rrDto.approvalStatus = this.getApprovalStatus(element.approvalStatus, element.ruleStatus);
          rrDto.icmsId = element.icmsId;
          rrDto.engine = this.updateEngineLabel(element.ruleEngineId, false);
          rrDto.idIndicator = element.idIndicator;
          rrDto.eclStageId = this.getEclStageIdForCvpCpeRule(element.ruleEngineId);
          rrDto.changeType = element.changeType;
          rrDto.cvpCpeRuleLink = this.checkCvpCpeRuleLink(element.ruleEngineId);
          rrDto.createdBy = this.userId;
          rrDto.eclRuleEngineId = element.ruleEngineId;

          if (this.rrUtils.duplicateCheck(this.ruleResponses, rrDto, false)) {
            this.ruleResponses.push(rrDto);
          } else {
            this.toastService.messageWarning('Duplicate', `You already have ${rrDto.ruleCode} validated`, 4000, true);
          }

        });
        this.saved = false;
      }
    });
  }
  /* Method to show the respose after creating or saving the research request*/
  showResponse(response: any, action: string) {
    if (response.data !== null && response.data !== undefined) {
      if (action === Constants.SAVE_ACTION) {
        this.getResearchRequestDetails().then(() => {
          this.getRuleResponses();
          this.onCommentsDialogClosed(null);
          this.saveMessage(response.data);
          this.rrHistory.loadHistoryAuditLog();
          this.loading = false;
        });
      } else {
        this.submitMessage(response.data);
        this.loading = false;
      }
    } else {
      this.rrButtonsDisable = (this.navPageTitle === (Constants.RR_NAVIGATE_TITLE_SEARCH)) ? true : false;
      this.errorMessage();
      this.loading = false;
    }
  }

  /* Method to show Save message*/
  saveMessage(researchRequestObj: any) {
    let successMessage = `Research Request '${researchRequestObj.researchRequestCode}' saved successfully.`;
    this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, successMessage, 3000, true);
  }

  /* Method to show Submit message*/
  submitMessage(researchRequestObj: any) {
    let successMessage = `Research Request '${researchRequestObj.researchRequestCode}' submitted successfully.`;
    if (this.isRouteToResearchCompleted()) {
      successMessage = `Research Completed '${researchRequestObj.researchRequestCode}' successfully.`;
    }
    this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, successMessage, 3000, true);
    this.router.navigate(['/home']);
  }

  /* Method to show Warn message*/
  warnMessage() {
    let warnMessage: string = `Please try again or reach administrator`;
    this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 3000, true);
  }

  /* Method to show Error message*/
  errorMessage() {
    this.toastService.message(Constants.TOAST_SEVERITY_INFO, Constants.RR_CUSTOM_SERVICE_ERROR_MSG, null,
      Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
  }

  /** Method to set the rule response table column headers based on rr status */
  populateRuleStatusResponseHeaders() {
    this.cols = [
      { field: 'engine', header: 'Engine', width: '5%' },
      { field: 'ruleCode', header: 'ID', width: '9%' },
      { field: 'ruleName', header: 'Name', width: '15%' },
      { field: 'icmsId', header: 'ICMS ID', width: '6%' },
      { field: 'changeType', header: 'Type of Change', width: '11%' },
      { field: 'ruleStatus', header: 'Type', width: '8%' },
      { field: 'approvalStatus', header: 'Status', width: '10%' },
      { field: 'rrRuleStatus', header: 'PO Decision', width: '12%' },
      { field: 'reviewComments', header: 'Comments', width: '16%' }
    ];
  }

  /**  Method to call and initiate the impact analysis for the selected rule based on the rr status */
  updateRule(rowData: ResearchRequestSearchedRuleDto) {
    if (!this.rrButtonsDisable) {
      if ((rowData.ruleResponseIndicator === Constants.YES_IND)) {
        if (this.validatePoOrMdUser() && !this.validateCCARole() && !rowData.assignedTo) {
          this.loading = true;
          this.assignRule(rowData);
          this.loading = false;
        } else if (this.validateCCARole() && (rowData.ruleStatus === Constants.RULE_POTENTIALLY_IMPACT_STATUS) &&
          (this.getEclRuleApprovalStatus(rowData.approvalStatus)) &&
          (this.ruleResponseStatus.find(status => status.label === Constants.RR_RULE_STATUS_ACCEPT).value === rowData.rrRuleStatus) &&
          (this.changeTypesCodes.find(typeCode => typeCode.label === Constants.RR_UPDATE).value === rowData.changeType)) {
          this.loading = true;
          this.router.navigate(['/ruleForImpactAnalysis']);
          this.loading = false;
        } else if ((rowData.ruleStatus === Constants.IDEA_STATUS) &&
          (this.ruleResponseStatus.find(status => status.label === Constants.RR_RULE_STATUS_ACCEPT).value === rowData.rrRuleStatus) &&
          (this.ideaChangeTypesCodes.find(typeCode => typeCode.label === Constants.RR_IDEA_CREATE_NEW).value === rowData.changeType)) {
          this.loading = true;
          this.assignAndNavigateToNewIdeaResearch(rowData);
          this.loading = false;
        } else {
          this.loading = false;
        }
      } else {
        if ((rowData.ruleStatus === Constants.LIBRARY_RULE) &&
          (this.ruleResponseStatus.find(status => status.label === Constants.RR_RULE_STATUS_ACCEPT).value === rowData.rrRuleStatus) &&
          (this.changeTypesCodes.find(typeCode => typeCode.label === Constants.RR_UPDATE).value === rowData.changeType)) {
          this.loading = true;
          this.initiateRuleImpact(rowData);
        } else if ((rowData.ruleStatus === Constants.IDEA_STATUS) &&
          (this.ruleResponseStatus.find(status => status.label === Constants.RR_RULE_STATUS_ACCEPT).value === rowData.rrRuleStatus) &&
          (this.ideaChangeTypesCodes.find(typeCode => typeCode.label === Constants.RR_IDEA_CREATE_NEW).value === rowData.changeType)) {
          this.loading = true;
          this.assignAndNavigateToNewIdeaResearch(rowData);
          this.loading = false;
        } else {
          this.loading = false;
        }
      }
    }
  }

  /** Method to validate if the user logged has a CCA role */
  validateCCARole() {
    if (this.currentUserObj !== null && this.currentUserObj.roles) {
      let roles: string[] = [];
      roles = this.currentUserObj.roles.map(element => { return element.roleName });
      if (roles && roles.includes(Constants.CCA_ROLE)) {
        return true;
      } else {
        return false;
      }
    }
  }

  getEclRuleApprovalStatus(approvalStatus: string): boolean {
    return (approvalStatus === Constants.RETURN_TO_RA ||
      approvalStatus === Constants.RETIRE_RULE_PENDING_SUBMISSION ||
      approvalStatus === Constants.RETIRE_RULE_PENDING_APPROVAL ||
      approvalStatus === Constants.NEW_VERSION_PENDING_SUBMISSION ||
      approvalStatus === Constants.EXISTING_VERSION_PENDING_SUBMISSION ||
      approvalStatus === Constants.APPROVED_PENDING_SUBMISSION);
  }


  /** Assign idea to current CCA and navigate to New Idea Research */
  assignAndNavigateToNewIdeaResearch(rowData) {
    let requestBody: any;
    let selectedIdeaIdsNotAssigned: any[] = [];
    selectedIdeaIdsNotAssigned = [...selectedIdeaIdsNotAssigned, rowData.ruleId];
    requestBody = { "userId": this.userId, "recordIds": selectedIdeaIdsNotAssigned, "stageId": rowData.eclStageId };
    const reqBody = { 'rrId': this.rrId, 'ruleId': rowData.ruleId, 'indicator': Constants.YES_IND };

    if (this.validatePoOrMdUser() && !this.validateCCARole()) {
      this.researchRequestService.setResponseIndicator(reqBody).subscribe((resp: any) => {
        if (resp.code === Constants.HTTP_OK) {
          this.assignRule(rowData);
        }
      });
    } else {
      this.researchRequestService.saveAssignedResearchRequestIdea(requestBody).subscribe((response: any) => {
        if (response.code === Constants.HTTP_OK) {
          const reqBody = { 'rrId': this.rrId, 'ruleId': rowData.ruleId, 'indicator': Constants.YES_IND };
          this.researchRequestService.setResponseIndicator(reqBody).subscribe((resp: any) => {
            if (resp.code === Constants.HTTP_OK) {
              this.navigateToNewIdeaResearch(rowData);
            }
          });
        }
      });
    }
  }

  /**Navigate to New Idea Research */
  navigateToNewIdeaResearch(rowData: any) {
    this.router.navigate(["/ideas-needing-research"], { queryParams: { filter: rowData.ruleCode, tab: Constants.ASSIGNED_TAB } });
  }

  /**  Method to initiate the impact analysisand assign the rule to CCA */
  initiateRuleImpact(rowData: any) {
    let ruleIds: number[] = [];
    ruleIds.push(rowData.ruleId);
    let impactObj = {
      ruleIds: ruleIds,
      userId: this.userId,
      rrId: this.researchRequestObj.researchRequestId
    };
    this.researchRequestService.initiateRrRuleImpactAnalysis(impactObj).subscribe(response => {
      if (response.data !== null && response.data !== undefined && response.data) {
        this.loading = false;
        if (!this.validatePoOrMdUser()) {
          this.router.navigate(['/ruleForImpactAnalysis'], { queryParams: { filter: rowData.ruleCode, tab: 'assigned' } });
        } else {
          let message = `Rule ${rowData.ruleCode} has been assigned to a CCA successfully.`;
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, message, 3000, true);
          this.getRuleResponses();
        }
      } else {
        this.loading = false;
        this.warnMessage();
      }
    }, error => {
      this.loading = false;
      this.warnMessage();
    });
  }

  /**
   * Method to validate if rule is eligible to update based upon rrStatus and rrRuleResponseStatus
   * @param rowData RuleResponse that hold mapId, rrRuleStatus and changeType for validation
   */
  validateUpdate(rowData) {
    const { rrRuleMappingId, rrRuleStatus, changeType, poSubmitAction, createdBy } = rowData;
    let res: boolean = false;

    //PO role logic
    if (this.checkRRStatusPendingAssist(this.researchRequestObj.rrStatus) && this.hideDeleteIcon(createdBy, poSubmitAction)) {
      this.deleteIconStyle = '';
      //CCA Role logic
    } else if (this.checkRRStatusInProgOrCompletedOrNotStarted(this.researchRequestObj.rrStatus)) {
      const createNewObj = this.ideaChangeTypesCodes.find(typeCode => typeCode.label === Constants.RR_IDEA_CREATE_NEW);
      const acceptObj = this.ruleResponseStatus.find(status => status.label === Constants.RR_RULE_STATUS_ACCEPT);
      const updateObj = this.changeTypesCodes.find(typeCode => typeCode.label === Constants.RR_UPDATE);
      let oldRowDataObj = null;
      if (rowData.rrRuleMappingId) {
        oldRowDataObj = this.oldRuleResponses.find(rowObj => rowObj.rrRuleMappingId === rrRuleMappingId);
      }
      if (rrRuleMappingId && this.checkAcceptObject(acceptObj, rrRuleStatus) &&
        this.checkUpdateAndCreateNewObect(updateObj, createNewObj, changeType) &&
        this.checkOldRowDataObject(oldRowDataObj)) {
        res = true;
      } else if (this.hideDeleteIcon(createdBy, poSubmitAction)) {
        this.deleteIconStyle = '';
      } else {
        this.deleteIconStyle = this.removeDeleteIconFromRuleResponse(createdBy);
      }
    }
    return res;
  }

  /**
  * Method to enable delete icon for rule response
  * @param rowData RuleResponse that hold createdBy and poSubmitAction for validation
  */
  private validateDelete(rowData): boolean {
    const { createdBy, poSubmitAction } = rowData;
    let disableDelIcon: boolean = true;
    this.deleteIconStyle = 'fa fa-trash span-centered';
    if (this.validatePoOrMdUser() || poSubmitAction) {
      return this.validateUpdate(rowData);
    } else if (poSubmitAction === null || poSubmitAction === undefined) {
      disableDelIcon = false;
      this.deleteIconStyle = (createdBy && createdBy === this.userId) ? this.removeDeleteIconFromRuleResponse(createdBy) : '';
    }
    return disableDelIcon;
  }
  private checkOldRowDataObject(oldRowDataObj: any) {
    return (oldRowDataObj !== null && oldRowDataObj !== undefined && oldRowDataObj.changeType !== null && oldRowDataObj.rrRuleStatus !== null);
  }
  private checkUpdateAndCreateNewObect(updateObj: SelectItem, createNewObj: SelectItem, changeType: number) {
    return ((updateObj && updateObj.value === changeType) || (createNewObj && createNewObj.value === changeType));
  }
  private checkAcceptObject(acceptObj: SelectItem, rrRuleStatus: number) {
    return ((acceptObj && acceptObj.value === rrRuleStatus));
  }
  private checkRRStatusInProgOrCompletedOrNotStarted(rrStatus: string) {
    return (rrStatus === Constants.RR_WORKFLOW_STATUS_ASSITANCE_COMPLETED ||
      rrStatus === Constants.RR_WORKFLOW_STATUS_SEND_BACK_FOR_RESEARCH ||
      rrStatus === Constants.RR_WORKFLOW_STATUS_IN_PROGRESS ||
      rrStatus === Constants.RR_WORKFLOW_STATUS_NOT_STARTED);
  }

  private checkRRStatusPendingAssist(rrStatus: string) {
    return (rrStatus === Constants.RR_WORKFLOW_STATUS_PENDING_ASSISTANCE);
  }

  private hideDeleteIcon(createdBy: number, poSubmitAction: string) {
    return ((createdBy && createdBy !== this.userId) || poSubmitAction);
  }

  /** Method to validate and show the initiate link text if the user is
     * PO or MD and the rule is not yet impacted due to current selected RR */
  validateInitiate(rowData) {
    let res: boolean = false;
    const { assignedTo, rrRuleMappingId, ruleStatus } = rowData;
    if (this.checkRRStatusInProgOrCompletedOrNotStarted(this.researchRequestObj.rrStatus) && rrRuleMappingId) {
      if (this.validatePoOrMdUser()) {
        res = this.validatePoOrMdUser();
        this.activeLink = 'inactive-link';
      } else if (ruleStatus === Constants.RULE_POTENTIALLY_IMPACT_STATUS) {
        this.ccaClaimLabel = (assignedTo && assignedTo === this.userId) ? 'Claimed' : '';
        this.activeLink = 'inactive-link';
      } else if (ruleStatus === Constants.PROVISIONAL_RULE) {
        this.ccaClaimLabel = 'Claimed';
        this.activeLink = 'inactive-link';
      } else {
        this.ccaClaimLabel = (assignedTo && assignedTo === this.userId) ? 'Claimed' : 'Claim';
        this.activeLink = (assignedTo && assignedTo === this.userId) ? 'inactive-link' : 'active-link';
      }
    }
    return res;
  }

  /** Method to check if the user is PO or MD from the available session*/
  validatePoOrMdUser() {
    if (this.currentUserObj !== null && this.currentUserObj.roles) {
      let roles: string[] = [];
      roles = this.currentUserObj.roles.map(element => { return element.roleName });
      if (roles && roles.includes(Constants.PO_ROLE || Constants.MD_ROLE)) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * method to enable and disable the resolution fields
   */
  disableResolution(): boolean {
    let res: boolean = true;
    if (this.researchRequestObj.rrCreatedBy !== null && this.researchRequestObj.rrCreatedBy === this.userId) {
      res = false;
    } else {
      if (this.researchRequestObj.rrRouteTo !== null && this.researchRequestObj.rrRouteTo !== undefined) {
        let selectedRoutTo: string = String(this.researchRequestObj.rrRouteTo);
        if (selectedRoutTo !== null && selectedRoutTo !== 'null') {
          let routeTo = Number(this.researchRequestObj.rrRouteTo);
          let routeToObj = this.routeToList.find(element => element.value === routeTo);
          if (routeToObj !== null && routeToObj !== undefined) {
            if (Constants.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW === routeToObj.label) {
              res = false;
            }
          }
        }
      }
    }
    return res;
  }
  /**
  * method to enable and disable the request classification options
  * when the cca is about to submit the rr back to requestor
  */
  disableRequestClassifiactionOptions(noneOption: string) {
    if (this.requestClassificationList.length > 0) {
      if (noneOption) {
        this.requestClassificationList.forEach(option => {
          if (option.label === Constants.CHOOSE_LABEL) {
            option["disabled"] = false;
          } else if (option.label !== noneOption) {
            option["disabled"] = true;
          } else {
            option["disabled"] = false;
          }
        });
      } else {
        this.requestClassificationList.forEach(option => {
          if (option.label === Constants.NONE) {
            option["disabled"] = true;
          } else {
            option["disabled"] = false;
          }
        });
      }
    }
  }

  /**
  * method to update the assignee list with the rr creator
  * when the rr status is assistance completed
  */
  updateAssigneeList(userId: number) {
    if (userId) {
      this.userService.getUserInfo(userId).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.researchRequestObj.assignee = userId;
          this.assigneeList = [];
          this.assigneeList.push({ label: response.firstName, value: response.userId });
        }
      });
    }
  }

  validateRouteToOptions(routeToOption: string) {
    let res: boolean = false;
    if (this.ruleResponses && this.ruleResponses.length > 0) {
      const accValue = this.ruleResponseStatus.find(v => v.label === "Accept");
      if (accValue) {
        this.ruleResponses.forEach(row => {
          if (row.ruleStatus !== Constants.LIBRARY_RULE && row.rrRuleStatus === accValue.value && routeToOption === Constants.RR_WORKFLOW_STATUS_RESEARCH_COMPLETED) {
            this.labelStyle = "color: red";
            res = true;
          }
        })
      }
    }
    return res;
  }

  showConfirmationForRCDialog(action: string) {
    if (this.isRouteToResearchCompleted()) {
      this.confirmationService.confirm({
        message: 'Are you sure you would like to select research completed?',
        header: 'Confirmation',
        key: 'confirmRCDialog',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.updateResearchRequest(action);
        },
        reject: () => {
        }
      });
    } else {
      this.updateResearchRequest(action);
    }
  }


  isRouteToResearchCompleted(): boolean {
    if (this.routeToList && this.routeToList.length > 0) {
      const routeTo = Number(this.researchRequestObj.rrRouteTo);
      const selectedRouteTo = this.routeToList.find(element => element.value === routeTo);
      if (selectedRouteTo && selectedRouteTo.label === Constants.RR_WORKFLOW_STATUS_RESEARCH_COMPLETED) {
        return true;
      }
    }
    return false;
  }

  openWindow(rowData: any, event: any) {
    this.rowData = rowData;
    let orginalComments = rowData.reviewComments;
    if (!this.ruleCommentReadOnly()) {
      const ref = this.dialogService.open(ResearchRequestCommentsDialogComponent, {
        data: {
          comments: rowData.reviewComments,
          researchRequestId: this.researchRequestObj.researchRequestId,
          user: this.userId,
          typeId: rowData.ruleId,
          stageId: rowData.eclStageId
        },

        width: '60%',
        height: '50%',
      });

      ref.onClose.subscribe((comments: any) => {
        if (comments != undefined) {
          this.rowData.reviewComments = comments;
        } else {
          this.rowData.reviewComments = orginalComments;
        }
        this.rrComments.checkTable.loadData(null);
      });
      event.preventDefault();
    }
  }

  onCommentsDialogClosed(comments: string) {
    if (comments && comments.length > 0) {
      this.ngForm.form.markAsDirty();
    }
    this.rrComments.checkTable.loadData(null);
  }

  /**
   * Creation of New Idea Research Request
   */
  async createNewIdeaRR(ruleId?: number) {
    let link = 'newIdea';
    if (this.canDeactivate()) {
      if (ruleId) {
        this.router.navigate([
          link,
          this.utils.encodeString(ruleId.toString()),
          this.utils.encodeString(this.rrId.toString()),
          this.rrCode]);
      } else {
        this.router.navigate([
          link,
          "",
          this.utils.encodeString(this.rrId.toString()),
          this.rrCode]);
      }
    }
  }

  /**
   * Refresh RR request to Jira Request
   */

  refreshRequest() {
    // TODO: Manish/Shifine has an assigned story to collect the User credentials once entering to any of the RR views (not anymore from the Login page)
    let encryptUserData = JSON.parse(localStorage.getItem('ENCRYPT_USER_DATA'));
    this.loading = true;
    this.researchRequestService.getJiraRefresh(this.researchRequestObj.jiraId, {
      userId: encryptUserData.username,
      encryptPass: encryptUserData.password
    }).subscribe(response => {
      if (response.code !== Constants.HTTP_OK && response.message === Constants.SERVICE_FAILURE) {
        this.toastService.message(Constants.TOAST_SEVERITY_INFO, Constants.RR_CUSTOM_SERVICE_ERROR_MSG, null, Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
      } else if (response.code === Constants.HTTP_OK) {
        this.loading = false;
        let successMessage = `Research Request '${this.researchRequestObj.researchRequestCode}' Refresh successfully.`;
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, successMessage, 3000, true);
        this.ngOnInit();
        this.getResearchRequestDetails();
        this.onCommentsDialogClosed(null);
        this.rrHistory.loadHistoryAuditLog();
      } else {
        this.loading = false;
        this.warnMessage();
      }
    });
  }

  /**
   * Start Research for RR
   */
  startResearch() {
    let encryptUserData = JSON.parse(localStorage.getItem('ENCRYPT_USER_DATA'));
    this.loading = true;
    this.researchRequestService.startResearch({
      rrId: this.researchRequestObj.researchRequestId,
      loggedInUserNm: encryptUserData.username,
      encryptPass: encryptUserData.password
    }).subscribe(response => {
      if (response.code === Constants.HTTP_OK && response.message === Constants.SERVICE_FAILURE) {
        this.toastService.message(Constants.TOAST_SEVERITY_INFO, Constants.RR_CUSTOM_SERVICE_ERROR_MSG, null, Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
      } else if (response.code === Constants.HTTP_OK) {
        this.loading = false;
        let successMessage = `Research Request '${this.researchRequestObj.researchRequestCode}' Started successfully.`;
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, successMessage, 3000, true);
        this.ngOnInit();
        this.getResearchRequestDetails();
        this.onCommentsDialogClosed(null);
        this.rrHistory.loadHistoryAuditLog();
      } else {
        this.loading = false;
        this.warnMessage();
      }
    });
  }

  /**
   * Update RR request to Jira Request
   */

  updateRequest() {
    let encryptUserData = JSON.parse(localStorage.getItem('ENCRYPT_USER_DATA'));
    this.researchRequestService.updateJira(this.researchRequestObj.jiraId, {
      userId: encryptUserData.username,
      encryptPass: encryptUserData.password
    }).subscribe(response => {
      if (response.code === Constants.HTTP_OK && response.message === Constants.SERVICE_FAILURE) {
        this.toastService.message(Constants.TOAST_SEVERITY_INFO, Constants.RR_CUSTOM_SERVICE_ERROR_MSG, null, Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
      } else if (response.code === Constants.HTTP_OK) {
        let successMessage = `Research Request '${this.researchRequestObj.researchRequestCode}' Updated successfully.`;
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, successMessage, 3000, true);
        this.ngOnInit();
        this.getResearchRequestDetails();
      } else {
        this.warnMessage();
      }
    });
  }

  getApprovalStatus(approvalStatus: string, ruleStatus: string): string {
    if (approvalStatus && approvalStatus === Constants.RR_WORKFLOW_STATUS_DRAFT && ruleStatus === Constants.LIBRARY_RULE) {
      return '';
    }
    return approvalStatus;
  }

  updateApprovalStatus(researchReqArr: ResearchRequestSearchedRuleDto[]) {
    if (researchReqArr !== null) {
      researchReqArr.forEach(rowData => {
        if (rowData !== null && rowData !== undefined && rowData.approvalStatus !== undefined && rowData.approvalStatus === Constants.RR_WORKFLOW_STATUS_DRAFT) {
          if (rowData.ruleStatus === Constants.LIBRARY_RULE) {
            rowData.approvalStatus = '';
          }
        }
      });
    }
  }

  /**
   * One that controls the NgSwitch?
   */
  validateAction(rowData: ResearchRequestSearchedRuleDto) {
    if (!this.validateDelete(rowData)) {
      return ACTION_DELETE;
    } else if (!this.validateInitiate(rowData)) {
      return ACTION_UPDATE;
    } else if (!this.validateAssign(rowData)) {
      return ACTION_INITIATE;
    } else if (!this.checkRRIndicator(rowData)) {
      return ACTION_ASSIGN;
    } else {
      return null;
    }
  }

  /** Method to validate and show the assign link text if the user is PO or MD and not CCA */
  validateAssign(rowData: any) {
    if ((rowData.eclStageId === Constants.ECL_IDEA_STAGE || rowData.eclStageId === Constants.ECL_PROVISIONAL_STAGE) && this.validatePoOrMdUser()) {
      return true;
    } else if ((rowData.rrRuleMappingId) && (rowData.eclStageId === Constants.ECL_LIBRARY_STAGE) &&
      (rowData.ruleResponseIndicator === Constants.YES_IND) && this.validatePoOrMdUser()) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checking Rule Response Indicator as True/False & assignTo
   * @param RowData ResearchRequestSearchedRuleDto model
   */
  checkRRIndicator(rowData: ResearchRequestSearchedRuleDto) {
    if (rowData.assignedTo) {
      return true;
    } else {
      return false;
    }
  }

  /** Method to navigate to the reassignment screens when the user clicks on assign link */
  assignRule(rowData: ResearchRequestSearchedRuleDto) {
    if (rowData.eclStageId === this.eclConstants.RULE_STAGE_LIBRARY_RULE) {
      this.router.navigate(['/reAssignImpactAnalysis']);
    } else {
      this.router.navigate(['/assignmentNewIdea'], { queryParams: { filter: rowData.ruleCode } });
    }
  }


  /**
   * Check if there are changes on the form if that is the case we ask the user for leave confirmation.
   * @return true/false
   */
  canDeactivate(): Observable<boolean> | boolean | Promise<boolean> {
    if (this.saved !== true && (this.ngForm.dirty || this.saved === false)) {
      return new Promise((resolve, reject) => {
        this.confirmationService.confirm({
          message: 'You are navigating away from this screen, all non-saved work will be lost',
          header: 'Confirmation',
          key: 'confirmRCDialog',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            resolve(true);
          },
          reject: () => {
            this.scrollToSaveButton();
            resolve(false);
          }
        });
      });
    } else {
      this.saved = null;
      return new Promise((resolve, reject) => resolve(true));
    }
  }

  /**
   * Scrolls the screen to the save button.
   */
  scrollToSaveButton() {
    const saveButtonElement: HTMLElement = this.saveButton.nativeElement as HTMLElement;
    saveButtonElement.scrollIntoView();
    saveButtonElement.focus();
  }

  createFileRequestObservable(obs: any[]) {
    return zip(...obs).pipe(map(testCasesResponse => testCasesResponse.sort((a: any, b: any) => (a.data > b.data) ? 1 : -1)), map(response => {
      response.forEach((element: any, index) => {
        this.researchRequestObj.requestAttachments[this.originalFilesNumber + index].fileId = element.data;
        this.fileObs.splice(0, 1);
      });
    }));
  }

  /**
   * This method used to make all research request fields editable
   * based on rr reported user/creater user are same with logged user
   */
  editableAllFields() {
    if (this.researchRequestObj.rrCreatedBy === this.userId
      && this.researchRequestObj.rrStatus !== Constants.RR_WORKFLOW_STATUS_RESEARCH_COMPLETED
      && this.navPageTitle !== (Constants.RR_NAVIGATE_TITLE_UNASSIGNED)
      && this.navPageTitle !== (Constants.RR_NAVIGATE_TITLE_SEARCH)
      && this.navPageFrom !== (Constants.RR_NAVIGATE_PAGE_FROM)) {
      this.rrReadOnly = false;
      this.rrFileSelectionStyle = 'span-rr-file-selection';
      this.rrRowRuleCommentEdit = true;
    }
  }

  /**
   * This method is used to populate the internal CC and watcher User List
   * Backend return the selected CC and watcher user Ids and checking this user id in Active user list
   * and get the selected user object and save in selectedCCUserList and selectedWatcherUserList
   */
  populateSelectedNotifyUsers() {
    this.selectedCCUsersList = [];
    this.selectedWatcherUsersList = [];
    if (this.researchRequestObj.selectedCCUsers && this.researchRequestObj.selectedCCUsers.length > 0) {
      this.researchRequestObj.selectedCCUsers.forEach(selectedUserId => {
        this.utils.getUserNameByUserId(selectedUserId).then(user => {
          this.selectedCCUsersList.push(user);
        });
      });
      this.selectedCCUsersList = this.removedDuplicateEntry(this.selectedCCUsersList);
    }
    if (this.researchRequestObj.selectedWatcherUsers && this.researchRequestObj.selectedWatcherUsers.length > 0) {
      this.researchRequestObj.selectedWatcherUsers.forEach(selectedUserId => {
        this.utils.getUserNameByUserId(selectedUserId).then(user => {
          this.selectedWatcherUsersList.push(user);
        });
      });
      this.selectedWatcherUsersList = this.removedDuplicateEntry(this.selectedWatcherUsersList);
    }
  }

  checkRrCommentsAreMandatory() {
    this.enableComment = false;
    this.enableReason = false;
    let selectedRouteTo: any = this.researchRequestObj.rrRouteTo;
    if (selectedRouteTo !== null &&
      selectedRouteTo !== undefined &&
      selectedRouteTo !== 'null') {
      let routeTo = Number(this.researchRequestObj.rrRouteTo);
      let routedToSelObj = this.routeToList.find(element => element.value === routeTo);
      if (routedToSelObj !== null && routedToSelObj !== undefined
        && (Constants.RR_WORKFLOW_STATUS_SUBMIT_FOR_ASSISTANCE === routedToSelObj.label
          || Constants.RR_WORKFLOW_STATUS_ASSITANCE_COMPLETED === routedToSelObj.label
          || Constants.RR_WORKFLOW_STATUS_SEND_BACK_FOR_RESEARCH === routedToSelObj.label)) {
        this.enableComment = true;
        if (Constants.RR_WORKFLOW_STATUS_SEND_BACK_FOR_RESEARCH === routedToSelObj.label) {
          this.enableReason = true;
          this.sendBackReason.focus();
        } else {
          const txtComments = document.getElementById('txtComments');
          if (!this.researchRequestObj.rrComments) {
            txtComments.scrollIntoView();
            txtComments.focus();
            txtComments.className = 'form-control input-textarea focus-glow'
          }
        }
      }
    }
  }

  /**
   * This method is used to populate internal CC and watcher users list in researchRequestObj
   * And send it to backend service to save it
   */
  populateNotifyUserList() {
    if (this.selectedCCUsersList) {
      this.researchRequestObj.selectedCCUsers = [];
      this.selectedCCUsersList.forEach(user => {
        this.researchRequestObj.selectedCCUsers.push(user.userId);
      });
    }
    if (this.removedCCUsersList) {
      this.researchRequestObj.removedCCUsers = [];
      this.removedCCUsersList.forEach(user => {
        this.researchRequestObj.removedCCUsers.push(user.userId);
      });
    }
    if (this.selectedWatcherUsersList) {
      this.researchRequestObj.selectedWatcherUsers = [];
      this.selectedWatcherUsersList.forEach(user => {
        this.researchRequestObj.selectedWatcherUsers.push(user.userId);
      });
    }
    if (this.removedWatcherUsersList) {
      this.researchRequestObj.removedWatcherUsers = [];
      this.removedWatcherUsersList.forEach(user => {
        this.researchRequestObj.removedWatcherUsers.push(user.userId);
      });
    }
    this.removedCCUsersList = [];
    this.removedWatcherUsersList = [];
  }

  /**
   * This is used for to open external url for added link
   * @param externalUrl
   */
  redirectToUrl(externalUrl: string): void {
    if (externalUrl) {
      window.open(externalUrl, '_blank');
    }
  }

  /**
   * This hoverIn is used to provide link field as editable
   */
  linkHoverIn() {
    this.hoverEdit = true;
  }

  /**
   * This hoverIn is used to provide link field as disabled
   */
  linkHoverOut() {
    this.hoverEdit = false;
  }


  private getSelectedRejectRule(rowData: ResearchRequestSearchedRuleDto) {
    const { value: rejValue } = this.ruleResponseStatus.find(val => val.label === 'Reject');
    if (rowData && rowData.rrRuleStatus === rejValue) {
      if (rowData.ruleStatus === Constants.IDEA_STATUS || rowData.ruleStatus === Constants.PROVISIONAL_RULE) {
        if (!this.rejectedIdeaResponse.some(val => val.rrId === rowData.rrId)) {
          this.rejectedIdeaResponse.push(rowData);
        }
      } else if (rowData.ruleStatus === Constants.LIBRARY_RULE) {
        if (!this.rejectedRuleResponse.some(val => val.rrId === rowData.rrId)) {
          this.rejectedRuleResponse.push(rowData);
        }
      }
    } else {
      rowData.reviewComments = "";
    }
  }

  private populateRejectedRuleList() {
    if (this.rejectedIdeaResponse && this.rejectedIdeaResponse.length > 0) {
      this.researchRequestObj.rejectedIdeas = [];
      this.researchRequestObj.rejectedIdeas = this.rejectedIdeaResponse;
    }
    if (this.rejectedRuleResponse && this.rejectedRuleResponse.length > 0) {
      this.researchRequestObj.rejectedRules = [];
      this.researchRequestObj.rejectedRules = this.rejectedRuleResponse;
    }
  }

  removeRedOutline(id: string) {
    let commentBox = document.getElementById(id);
    commentBox.className = 'form-control input-textarea';
  }

  setClientToolTip() {
    this.clientToolTip = this.setToolTip(this.researchRequestObj.clientSelected, this.clientsList);
  }

  setSuperPayersToolTip() {
    this.superPayerSelToolTip = this.setToolTip(this.researchRequestObj.superPayersSelected, this.superPayerList);
  }

  setPayersToolTip() {
    this.selPayListToolTip = this.setToolTip(this.researchRequestObj.selectedPayerList, this.payerList);
  }

  setLineOfBusinessToolTip() {
    this.lineOfBusinessTooltip = this.setToolTip(this.researchRequestObj.lineOfBusiness, this.lineOfBusinessList);
  }

  setToolTip(rrList: any[], optionList: any[]) {
    let setArray: string[] = [];
    optionList.forEach(p => {
      rrList.forEach(ps => {
        if (p.value === ps) {
          setArray.push(p.label);
        }
      });
    });
    return setArray.join();
  }

  /**
   * This method is used to set the eclStageId based on rule engine
   * for CPE and CVS
   * @param ruleEngine
   * @returns {number}
   */
  getEclStageIdForCvpCpeRule(ruleEngine: number) {
    if (ruleEngine === Constants.CPE_ECL_STAGE_VALUE) {
      return Constants.CPE_ECL_STAGE_VALUE;
    } else if (ruleEngine === Constants.CVP_ECL_STAGE_VALUE) {
      return Constants.CVP_ECL_STAGE_VALUE;
    } else {
      return Constants.ECL_LIBRARY_STAGE;
    }
  }

  /**
   * This method provide disable link for CVP and CPE Rules
   * in rule response section
   * @param ruleEngine
   * @returns {boolean}
   */
  checkCvpCpeRuleLink(ruleEngine: number) {
    if (ruleEngine === Constants.CPE_ECL_STAGE_VALUE || ruleEngine === Constants.CVP_ECL_STAGE_VALUE) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * This method is used to remove delete icon
   * for unassigned and re-assignment screen
   * @returns {string}
   */
  removeDeleteIconFromRuleResponse(createdBy: number) {
    if (this.rrReadOnly === true) {
      return '';
    } else if (createdBy === this.userId) {
      return 'fa fa-trash span-centered';
    } else {
      return '';
    }
  }

  /**
   * rejectCommentEnable is boolean check
   * @param rowData - rr dto
   * @returns booleans true/false. disable/enable
   */
  rejectCommentEnable(rowData: ResearchRequestSearchedRuleDto) {
    const reject = this.ruleResponseStatus.find(val => val.label === 'Reject');
    if (rowData && reject && rowData.rrRuleStatus === reject.value) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Opening of the Clone Dialog & check for attachment and rule response to see if both are active.
   */
  showCloneDialog(bool: boolean) {
    this.cloneVisability = bool;
    if (bool === true) {
      this.cloneAttachBool = false;
      this.cloneRuleRespBool = false;
      this.tempSummary = `CLONE - ${this.researchRequestObj.requestSummary}`;
    }
  }

  /**
   * start Clone Process will send the existing DTO with the updated Summary or not, towards
   * the backend to start the procedure.
   */
  startCloneProcess() {
    this.loading = true;
    let rrDto = this.researchRequestObj;
    let userSession = JSON.parse(localStorage.getItem("userSession"));
    rrDto.rrCreatedBy = userSession.userId;
    rrDto.rrUpdatedBy = userSession.userId;
    rrDto.requestSummary = this.tempSummary;
    rrDto.action = this.saveAction;
    this.showCloneDialog(false);
    if (!this.cloneRuleRespBool) {
      rrDto.searchedRules = [];
    } else {
      rrDto.searchedRules = this.ruleResponses;
    }
    if (!this.cloneAttachBool) {
      rrDto.requestAttachments = [];
    }

    this.researchRequestService.cloneResearch(rrDto).subscribe(resp => {
      if (resp && resp.data) {
        const rrPathParams = btoa(JSON.stringify({
          'rrCode': `RR-${resp.data}`
        }));
        this.loading = false;
        this.router.navigate([Constants.NEW_RESEARCH_REQUEST_ROUTE], {
          queryParams: { rrPathParams: rrPathParams }
        });
      }
    },
      error => {
        this.loading = false;
      })
  }
  checkTextAreaMaxLength(e?: ClipboardEvent) {
    const msg = this.utils.checkPasteLength(e, 'Summary', 2000, this.tempSummary);
    this.toastService.messageWarning(msg.summary, msg.detail, 3000, false);
  }

  /**
   * Checking the File Length of Attachments. (requestAttachments/FileObs)
   * @returns true/false
   */
  checkFileLength() {
    return ((this.researchRequestObj && this.researchRequestObj.requestAttachments.length > 0) || (this.fileObs &&
      this.fileObs.length > 0));
  }

  /**
   * Checking Rule Response length to determine if there are rules or not
   * @returns true/false
   */
  checkRuleResponseLength() {
    return (this.ruleResponses && this.ruleResponses.length > 0);
  }

  /**
   * navigation
   * @param rrCode Used to reload the page
   * @param rrId used to reload the page
   * @param status Determine if it New RR or Just RR
   */
  navigation(rrCode: string, rrId: number, status: string) {
    if (status !== 'Draft') {
      const rrPathParams = btoa(JSON.stringify({
        'rrCode': rrCode,
        'navPageTitle': 'My Requests',
        'navPagePath': Constants.MY_RESEARCH_REQUEST_ROUTE,
        'rrReadOnly': true,
        'searchDisable': false,
        'rrButtonsDisable': true
      }));
      this.rrId = rrId;
      this.rrCode = rrCode;
      this.router.navigated = false;
      this.router.navigate([Constants.RESEARCH_REQUEST_ROUTE], {
        queryParams: { rrPathParams: rrPathParams }
      });
    } else {
      const rrPathParams = btoa(JSON.stringify({
        'rrCode': rrCode
      }));
      this.router.navigate([Constants.NEW_RESEARCH_REQUEST_ROUTE], {
        queryParams: { rrPathParams: rrPathParams }
      });
    }
  }


  /**
   * This method is used to removed duplicate entry from the list
   * @param selectedList
   * @returns {any[]}
   */
  removedDuplicateEntry(selectedList: any[]): any[] {
    selectedList = selectedList.filter((selectedVal, index, array) =>
      index === array.findIndex((findVal) =>
        findVal.userName === selectedVal.userName
      )
    );
    return selectedList.sort();
  }

  showExitButton() {
    return this.navPageTitle === ptc.RESEARCH_REQUEST_SEARCH_TITLE;
  }

  ruleCommentReadOnly() {
    return (this.navPageTitle === ptc.MY_REQUEST) ? this.rrReadOnly : !this.rrReadOnly;
  }

  populateReporter() {
    this.utils.getUserNameByUserId(this.researchRequestObj.rrCreatedBy).then(user => {
      this.rrReporter = user.firstName;
    });

  }

  changeAssigneeField() {
    const routeTo = Number(this.researchRequestObj.rrRouteTo);
    const routeToObj = this.routeToList.find(element => element.value === routeTo);
    if (Constants.RR_WORKFLOW_STATUS_NEED_ADDITIONAL_RESEARCH === routeToObj.label && this.researchRequestObj.teamAssignee) {
      this.researchRequestObj.assignee = this.researchRequestObj.teamAssignee;
      this.populateAssigneeList(this.activeUsersList, this.researchRequestObj.assignee);
    }
  }

  openProjectRequest() {
    const rrPathParams = btoa(JSON.stringify({
      'rrCode': this.researchRequestObj.researchRequestCode,
      'rrId': this.researchRequestObj.researchRequestId,
      'baseTitle': this.navPageTitle,
      'secondaryTitle': 'New Project Request',
      'basePath': this.navPagePath,
      'secondaryPath': Constants.RESEARCH_REQUEST_ROUTE,
      'readOnly': true,
      'rrButtonsDisable': false
    }));
    this.router.navigate([RequestRoutingConst.RR_PROJECT_REQUEST], {
      queryParams: { rrPathParams: rrPathParams }
    });
  }

  checkProjectRequestBtnDisabled(): boolean {
    let isDisabled = false;
    if (this.prBtnDisableSelect) {
      this.prBtnDisableSelect.forEach((lookup: any) => {
        if (lookup.label && lookup.label === Constants.YES_IND)
          isDisabled = true;
      });
    }
    return isDisabled;
  }

  /**
   * Method to split the ruleCode that were combined into separate span
   * @param data rule code to splut
   * @param num Which version is it going to. (0, old) (1, current)
   * @returns Rule code that been splited.
   */
  updateRuleCode(data: string, num: number) {
    return data.split(' ')[num];
  }

}
