import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants as rc } from 'src/app/shared/models/routing-constants';
import { ResearchRequestDto } from 'src/app/shared/models/dto/research-request-dto';
import { TeamsService } from 'src/app/services/teams.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import * as _ from 'underscore';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ResearchRequestSearchedRuleDto } from 'src/app/shared/models/dto/research-request-searched-rule-dto';
import { Observable, of, Subject, Subscription, zip } from 'rxjs';
import { debounceTime, delay, flatMap, map, mergeMap } from 'rxjs/operators';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { EclAttachmentDto } from 'src/app/shared/models/dto/ecl-attachment-dto';
import { ResearchRequestValidation } from '../research-request-validation';
import { MidRuleBoxComponent } from '../../Reports/components/mid-rule-box/mid-rule-box.component';
import { RrUtils } from '../services/rr-utils.component';
import { SearchTable } from '../models/interface/search-table-interface';
import { NgForm } from '@angular/forms';
import { RequestConstants as reqCon} from '../models/request.constants';

@Component({
  selector: 'app-new-research-request',
  templateUrl: './new-research-request.component.html',
  styleUrls: ['./new-research-request.component.css']
})
export class NewResearchRequestComponent implements OnInit, OnDestroy {

  @ViewChild('rrFileInput',{static: true}) rrFileInput: ElementRef;
  @ViewChild(MidRuleBoxComponent,{static: true}) midBox: MidRuleBoxComponent;
  @ViewChild('newResearchRequestForm',{static: true}) ngForm: NgForm;

  dropDownStyles: any = { width: '100%', border: '1px solid #31006F' };
  projectsList: any[] = [];
  payerStatusList: any[] = [{ label: 'Choose', value: null }];
  issueTypeList: any[] = [{ label: 'Choose', value: null }];
  teamsList: any[] = [{ label: 'Choose', value: null }];
  policyTypeList: any[] = [{ label: 'Choose', value: null }];
  attachmentCategoryList: any[] = [{ label: 'Choose', value: null }];
  teamAssigneeList: any[] = [{ label: 'Choose', value: null }];
  SDPriorityList: any[] = [{ label: 'Choose', value: null }];
  eLLCommitteeList: any[] = [{ label: 'Choose', value: null }];
  QAReasonList: any[] = [{ label: 'Choose', value: null }];
  lineOfBusinessList: any[] = [];
  clientsList: any[] = [];
  superPayerList: any[] = [];
  ruleEngineList: any[] = [{ label: 'Choose', value: null }];

  researchRequestObj: ResearchRequestDto;

  rrPayersList: any[] = []; // original payers list data with client info
  payerList: any[] = [];

  selectedCCUsersList: any[] = [];
  removedCCUsersList: any[] = [];
  userSearchList: any[] = [];
  activeUsersList: any[] = [];
  searchRules: string;
  searchUser: string;
  teamSupervisors: any[] = [];
  rrId: number;
  rrCode: string;
  response = false;
  fieldDisable = false; // boolean value to disable the fields on submit
  currentDate = '';
  searchedDisplayData: SearchTable[] = [];
  cols: any[] = [];
  searchRuleIdSub: Subject<KeyboardEvent> = new Subject();
  subscription: Subscription;

  /**For rules after save response section */
  rulesAdded: any[] = [];
  saveAction = Constants.SAVE_ACTION;
  submitAction = Constants.SUBMIT_ACTION;
  loadMidBox: boolean;
  saved: boolean = true;

  /**Duplication and Check tab */
  loading: boolean;
  superPayerDisabled = true;
  payerDisabled = true;

  invalidRuleLength = 0;

  originalFilesNumber = 0;
  filesObs = [];
  showInvalid = 'invalid-hide';

  constructor(private utils: AppUtils,
    private toastService: ToastMessageService,
    private teamService: TeamsService,
    private researchRequestService: ResearchRequestService,
    private router: Router,
    public route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private fileManagerService: FileManagerService,
    private researchRequestValidation: ResearchRequestValidation,
    private rrUtils: RrUtils) {

    this.subscription = this.searchRuleIdSub.pipe(
      debounceTime(500),
      mergeMap(search => of(search).pipe(
        delay(500),
      ))
    ).subscribe(value => {
      this.onKeyUpSearch(value);
    });

    this.searchCCUsers = _.debounce(this.searchCCUsers, 1000);
    this.populateResearchRequestDetails = _.debounce(this.populateResearchRequestDetails, 2000);
    this.researchRequestObj = new ResearchRequestDto();
    this.teamSupervisors = [];
    this.getAllLobs();
    this.getAllRuleEngines();
    this.getAllCIJiraTeams();
    this.getAllIssueTypes();
    this.getAllRequestPolicyTypes();
    this.getAllAttachmentCategories();
    this.getAllSDPriority();
    this.getAllEllCommitteeReview();
    this.getAllEllQaResultReason();
    this.getResearchRequestClientProjects();
    this.getAllPayerStatus();

  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('SHOW_JIRA_LOGIN_FLAG'))) {
      this.trackJiraLoggedInUser();
    }
    this.getAllActiveUsers();
    this.getResearchRequestClients();
    this.minimumDate();
    this.route.queryParams.subscribe(params => {
      if (params.rrPathParams) {
        const requestObj = JSON.parse(atob(params.rrPathParams));
        this.rrCode = requestObj.rrCode;
      }
    });
    this.cols = [
      { field: 'engine', header: 'Engine', width: '5%' },
      { field: 'id', header: 'ID', width: '15%' },
      { field: 'name', header: 'Rule/Idea Name', width: '30%' },
      { field: 'icmsId', header: 'ICMS ID', width: '15%' },
      { field: 'decisionPoint', header: 'ECL Name/Mid Rule Decision Point', width: '25%' },
      { field: 'del', header: '', width: '5%' }
    ];
    if (this.rrCode) {
      this.rrId = Number(this.rrCode.split('-')[1].trim());
    }
    this.searchedDisplayData = [];
    this.researchRequestObj.searchedRules = [];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.getResearchRequestDetails();
  }

  /* Method to set the min date to current today date */
  private minimumDate() {
    this.currentDate = new Date().toString();
  }

  /* Callback methods to fetch all the dropdown values*/
  private getAllLobs() {
    this.utils.getAllLobsValue(this.lineOfBusinessList, this.response);
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

  private getAllPayerStatus() {
    this.utils.getAllLookUps(Constants.RR_PAYER_STATUS, this.payerStatusList, this.response);
  }

  private getAllCIJiraTeams() {
    this.utils.getAllCIJiraTeams(this.teamsList, this.response);
  }

  private getAllIssueTypes() {
    this.utils.getAllLookUps(Constants.RR_ISSUE_TYPE, this.issueTypeList, this.response, [reqCon.PROJECT_REQ]);
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

  private getAllActiveUsers() {
    this.utils.getAllActiveUsers(this.activeUsersList);
  }

  /* Callback method to fetch all the available Research Request projects */
  private getResearchRequestClientProjects() {
    this.researchRequestService.getResearchRequestClientProjects().subscribe(response => {
      if (response.data !== null && response.data !== undefined) {
        this.projectsList = [{ label: 'Choose', value: null }];
        response.data.forEach(project => {
          if (project.projectDescription != reqCon.PROJECT_REQ) {
            this.projectsList.push({ label: project.projectDescription, value: project.projectId });
          }
        });
      }
    });
  }

  /* Method to fetch the Research Request  details based on the RRId */
  async getResearchRequestDetails() {
    if (this.rrId) {
      this.fieldDisable = true;
      this.researchRequestService.getResearchRequestDetails(this.rrId).subscribe(response => {
        if (response.data !== null && response.data !== undefined) {
          this.researchRequestObj = response.data;
          this.populateResearchRequestDetails();
        }
      }, error => {
        this.loading = false;
        this.fieldDisable = false;
        this.warnMessage();
      });
    }
  }

  /** Method to validate input for rule search */
  onKeyUpSearch(event) {
    if (event.key === 'Enter') {
      if (this.searchRules && this.searchRules.length > 0) {
        let regexValidList: string[] = [];
        this.loadMidBox = true;
        const regexp: RegExp = /^\d+.?\d/;
        const searchRuleList = this.searchRules.split(',').map(ele => ele.trim());
        searchRuleList.forEach(ele => {
          if (this.researchRequestObj.ruleEngine === Constants.CPE_ECL_STAGE_VALUE) {
            regexValidList.push(ele);
          } else {
            if (regexp.test(ele)) {
              regexValidList.push(ele);
            }
          }
        });
        if (this.researchRequestObj.ruleEngine) {
          const param = {
            ruleEngineId: this.researchRequestObj.ruleEngine,
            ruleIds: regexValidList,
            newRequest: true
          };
          this.researchRequestService.getRuleDetails(param).subscribe((response: any) => {
            if (response.data) {
              const data = response.data;
              this.callMidBoxHighlight(data, searchRuleList, regexValidList);

              const filterSearchRuleDto = data.filter(ele => (ele !== null && ele.ruleId !== null))
                .map(ele => {
                  const rule: ResearchRequestSearchedRuleDto = new ResearchRequestSearchedRuleDto();
                  rule.ruleId = ele.ruleId;
                  rule.eclStageId = this.getEclStageIdForCvpCpeRule(this.researchRequestObj.ruleEngine);
                  rule.eclRuleEngineId = this.researchRequestObj.ruleEngine;
                  return rule;
                });
              if (filterSearchRuleDto && filterSearchRuleDto.length > 0) {
                if (this.researchRequestObj.searchedRules === undefined) { this.researchRequestObj.searchedRules = [] };
                this.researchRequestObj.searchedRules.push(...filterSearchRuleDto);
              }
              this.loadMidBox = false;
              this.displayRuleSearchData(data, this.researchRequestObj.ruleEngine);
            } else {
              this.loadMidBox = false;
            }
          }, error => {
            this.loadMidBox = false;
            this.callMidBoxHighlight([], searchRuleList, regexValidList);
          });
        } else {
          this.loadMidBox = false;
        }
      } else {
        this.researchRequestObj.searchedRules = [];
      }
    }
  }

  callMidBoxHighlight(validData, searchRuleList, regexValidList) {
    const stripRawData = this.rrUtils.stripRuleEngine(this.researchRequestObj.ruleEngine, validData);
    const invalidRules = this.rrUtils.fillHighlights(searchRuleList, stripRawData, regexValidList).filter(e => e);
    this.midBox.checkMidRuleIds(invalidRules, invalidRules, true);
  }

  /**
   * Method will display the searched rule data by adding onto the exisiting rule table.
   * Duplication Check so same rule ID won't be added twice.
   * @param data value list that will be added onto decision point table
   * @param reset reset the list. true / false(default)
   */
  private displayRuleSearchData(data: any[], engineId: number, reset: boolean = false) {
    this.ngForm.form.markAsDirty();
    if (reset) { this.searchedDisplayData = []; }
    data.forEach(rule => {
      if (rule && rule.eclId) {
        const tableFormat: SearchTable = {
          ruleId: rule.ruleId,
          engine: this.displayRuleEngine(engineId || rule.engineId),
          id: rule.eclId,
          name: rule.ruleName,
          icmsId: rule.icmsId,
          decisionPoint: (rule.decisionPoint) ? rule.decisionPoint : ''
        };
        if (this.rrUtils.duplicateCheck(this.searchedDisplayData, tableFormat)) {
          this.searchedDisplayData.push(tableFormat);
        } else {
          this.toastService.messageWarning('Duplicate', `You already have ${tableFormat.id} validated`, 4000, true);
        }
      }
    });
  }

  /* Callback method to fetch all the available Research Request client payer values */
  private getResearchRequestClients() {
    this.researchRequestService.getResearchRequestClients().subscribe(response => {
      if (response.data !== null && response.data !== undefined) {
        this.clientsList = [];
        response.data.forEach(client =>
          this.clientsList.push({ label: client.clientName, value: client.clientId }));
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
  getTeamMembersList() {
    if (this.researchRequestObj.team) {
      this.teamService.getUsersFromTeam(this.researchRequestObj.team).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          if (response.data.users) {
            this.teamSupervisors = [];
            this.teamAssigneeList = [{ label: 'Choose', value: null }];
            response.data.users.forEach(user => {
              this.teamAssigneeList.push({ label: user.firstName, value: user.userId });
              if (this.researchRequestObj.teamAssignee && this.researchRequestObj.teamAssignee === user.userId) {
                this.researchRequestObj.teamAssignee = user.userId;
              }
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
    if (this.searchUser && this.activeUsersList) {
      this.ngForm.form.markAsDirty();
      this.userSearchList = [];
      this.updateUserSearcList(this.userSearchList, this.searchUser);
      this.userSearchList.forEach(searchUser => {
        if (this.searchUser === searchUser.firstName) {
          if (!this.selectedCCUsersList.some(selectedUserObj => selectedUserObj.firstName === this.searchUser)) {
            this.selectedCCUsersList = [...this.selectedCCUsersList, ...this.userSearchList.filter(user => user.firstName === this.searchUser)];
            this.searchUser = '';
            this.userSearchList = [];
          } else {
            this.searchUser = '';
            this.userSearchList = [];
          }
        }
      });
    } else {
      this.userSearchList = [];
    }
  }

  /* callback Method to fetch the active users based on the keyword search from active users list*/
  updateUserSearcList(userSearchList: any[], searchUser: string) {
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

  /* Method to refresh the research request form on confirmation */
  refreshNewResearchRequestForm() {
    this.researchRequestObj = new ResearchRequestDto();
    this.selectedCCUsersList = [];
    this.userSearchList = [];
    this.filesObs = [];
    this.teamSupervisors = [];
    this.teamAssigneeList = [{ label: 'Choose', value: null }];
    this.rrFileInput.nativeElement.value = '';
    this.searchUser = '';
    this.searchRules = '';
    this.searchedDisplayData = [];
  }

  /* Method to save or submit the new research request with all the validations for the required fields */
  createResearchRequest(action: string) {
    this.loading = true;
    this.fieldDisable = true;
    let saveTemplateObservable: Observable<any>;
    if (this.researchRequestValidation.validateFields(this.researchRequestObj)) {
      this.updateRequestFormData(action);
      if (this.filesObs && this.filesObs.length > 0) {
        const fileObservables = [];
        this.filesObs.forEach(element => fileObservables.push(element.observable));
        saveTemplateObservable = this.createFileRequestObservable(fileObservables)
          .pipe(flatMap(() => this.researchRequestService.saveResearchRequest(this.researchRequestObj)));
      } else {
        saveTemplateObservable = this.researchRequestService.saveResearchRequest(this.researchRequestObj);
      }

      saveTemplateObservable.subscribe(response => {
        this.showResponse(response, action);
      }, error => {
        this.loading = false;
        this.fieldDisable = false;
      });
    } else {
      this.fieldDisable = false;
      this.loading = false;
    }
  }

  createFileRequestObservable(obs: any[]) {
    return zip(...obs).pipe(map(obsResponse => obsResponse.sort((a: any, b: any) => (a.data > b.data) ? 1 : -1)), map(response => {
      response.forEach((element: any, index) => {
        this.researchRequestObj.requestAttachments[this.originalFilesNumber + index].fileId = element.data;
        this.filesObs.splice(0, 1);
      });
    }));
  }

  /* Method to show the respose after creating or saving the research request*/
  showResponse(response: any, action: string) {
    if (response.data !== null && response.data !== undefined) {
      if (action === Constants.SAVE_ACTION) {
        this.rrId = response.data.researchRequestId;
        this.getResearchRequestDetails().then(() => {
          this.saved = true;
          this.loading = false;
          this.saveMessage(response.data);
          this.fieldDisable = false;
        });
      } else {
        this.loading = false;
        this.fieldDisable = false;
        this.submitMessage(response.data);
      }
    } else {
      this.loading = false;
      this.fieldDisable = false;
      this.errorMessage();
    }
  }

  /* Method to show Save message*/
  saveMessage(researchRequestObj: any) {
    const successMessage = `Research Request '${researchRequestObj.researchRequestCode}' has been saved successfully.`;
    this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, successMessage, 3000, true);
    this.router.navigate([rc.NAV_MY_RESEARCH_REQUEST_PAGE]);
  }

  /* Method to show Submit message*/
  submitMessage(researchRequestObj: any) {
    const successMessage = `New Research Request '${researchRequestObj.researchRequestCode}' - '${researchRequestObj.jiraId}' has been created successfully.`;
    this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, successMessage, 3000, true);
    if (researchRequestObj.teamAssignee) {
      this.router.navigate([rc.NAV_MY_RESEARCH_REQUEST_PAGE]);
    } else {
      this.router.navigate(['/unassigned-research-request']);
    }
  }

  /* Method to show Warn message*/
  warnMessage() {
    const warnMessage = `Please try again or reach administrator`;
    this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 3000, true);
  }

  /* Method to show Error message*/
  errorMessage() {
    this.toastService.message(Constants.TOAST_SEVERITY_INFO, Constants.RR_CUSTOM_SERVICE_ERROR_MSG, null,
      Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
  }

  /* Method to create and update the new research request form data*/
  updateRequestFormData(action: string) {
    this.populateNotifyUserList();
    this.researchRequestObj.action = action;
    this.researchRequestObj.rrCreatedBy = this.utils.getLoggedUserId();
    // set userid and encryptPass in rr obj
    const encryptUserData = JSON.parse(localStorage.getItem('ENCRYPT_USER_DATA'));
    this.researchRequestObj.userId = encryptUserData.username;
    this.researchRequestObj.encryptPass = encryptUserData.password;
  }

  /* Method to select the files when drag and drop*/
  addDropFiles(event: any) {
    let filesList: any = [];
    event.preventDefault();
    event.stopPropagation();
    const activeAttachments: number = (this.researchRequestObj.requestAttachments.length > 0) ?
      this.researchRequestObj.requestAttachments.filter(attachment => attachment.deleted === false).length : 0;
    const attachmentListSize = activeAttachments + this.filesObs.length; // size variable to upload only 5 file attachments
    if (attachmentListSize < 5) {
      if (event.dataTransfer.items) {
        const eventItems = event.dataTransfer.items;
        for (let i = 0; i < eventItems.length; i++) {
          if (eventItems[i].kind === 'file') {
            filesList.push(eventItems[i].getAsFile());
          }
        }
        this.updateFilesList(filesList);
      } else {
        filesList = event.dataTransfer.files;
        this.updateFilesList(filesList);
      }
    } else {
      this.maxFilesWarning();
    }
  }

  /** Method to update selected files into filelist
   * @input : html event object
   * add unique files less than 10mb to fileslist object
   * show warn messages for duplicate files and large files
   */
  updateFilesList(fileList: any) {
    const activeAttachments: number =
      (this.researchRequestObj.requestAttachments.length > 0) ?
        this.researchRequestObj.requestAttachments.filter(attachment => attachment.deleted === false).length : 0;
    for (let i = 0; i < fileList.length; i++) {
      const size = fileList[i].size / 1024 / 1024; // size conversion to MB.
      if (size < Constants.MAX_FILE_SIZE) {
        const attachmentListSize = activeAttachments + this.filesObs.length; // size variable to upload only 5 file attachments
        if (attachmentListSize < 5) {
          if (!this.filesObs.some(file => file.name === fileList[i].name) &&
            !this.researchRequestObj.requestAttachments.some(fileObj => fileObj.eclRrAttachmentsId === fileList[i].name)) {
            this.filesObs.push({
              observable: this.fileManagerService.uploadFile(
                fileList[i], Constants.RESEARCH_REQUEST_PROCESS_FILE),
              name: fileList[i].name
            });
            const attachmentDto = new EclAttachmentDto;
            attachmentDto.fileName = fileList[i].name;
            attachmentDto.eclRrAttachmentsId = Math.floor(Math.random() * 100) * -1;
            this.researchRequestObj.requestAttachments.push(attachmentDto);
          } else {
            const warnMessage = `File '${fileList[i].name}' already Exists, please upload a new file`;
            this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 4000, true);
          }
        } else {
          this.maxFilesWarning();
          break;
        }
      } else {
        const warnMessage = `File ${fileList[i].name} has ${Math.round(size)}MB of size, max file size uploaded 10MB`;
        this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 4000, true);
      }
    }
  }

  /** Event handler to prevent the files from opening when the files are drag and dropped into the column*/
  preventDropFilesOpen(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  /** Method to click the file input by using the id of the input*/
  clickFileUpload() {
    const attachmentListSize = this.researchRequestObj.requestAttachments.length + this.filesObs.length; // size variable to upload only 5 file attachments
    if (attachmentListSize < 5) {
      this.rrFileInput.nativeElement.click();
    } else {
      this.maxFilesWarning();
    }
  }

  /** Method to show a warning message for the maximum files */
  maxFilesWarning() {
    const warnMessage = 'Maximum five files can be uploaded';
    this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 4000, true);
  }

  /** Method to add files into the */
  addFiles(event: any) {
    this.ngForm.form.markAsDirty();
    const fileList: FileList = event.target.files;
    this.updateFilesList(fileList);
    this.rrFileInput.nativeElement.value = '';
  }

  /* Method to remove the selected file from the selected files list based on the name of the file
  @input : file object
  reseting the file input if the length of the files list if empty
  */
  removeSelectedFile(fileObj: any) {
    this.filesObs = this.filesObs.filter(file => file.name !== fileObj.name);
    if (this.filesObs.length < 1) {
      this.rrFileInput.nativeElement.value = '';
    }
  }

  /* Method to populate the data of the selected research request */
  populateResearchRequestDetails() {
    this.getTeamMembersList();
    this.populateSelectedCCUsers();
    this.getRuleResponses().then(() => {
      this.populateDecisionPoints();
    });
    this.onClientSelection();
    this.fieldDisable = false;
    this.originalFilesNumber = this.researchRequestObj.requestAttachments.length;
    this.filesObs = [];
  }


  /** Method to fetch the already added rule responses after save*/
  private getRuleResponses() {
    return new Promise<void>((resolve) => {
      this.researchRequestService.getRuleResponses(this.rrId).subscribe(response => {
        if (response.data) {
          this.rulesAdded = [];
          this.rulesAdded = response.data.map(rule => {
            return {
              engineId: rule.eclRuleEngineId,
              eclId: rule.ruleCode,
              ruleName: rule.ruleName,
              icmsId: rule.icmsId,
              decisionPoint: (rule.decisionPoint) ? rule.decisionPoint : ''
            };
          });
          resolve();
        }
      });
    });
  }

  /**
   * Method to fetch the decision points once the added rule id's are available
   * */
  populateDecisionPoints() {
    this.searchRules = '';
    if (this.rulesAdded.length > 0) {
      this.rulesAdded.forEach(rule => {
        this.searchRules += `${rule.ruleCodeNumber},`;
      });
      this.displayRuleSearchData(this.rulesAdded, null, true);
    }
  }

  /** Method to return the rulecode without ECL prefix*/
  getRuleCodeNumber(ele: any) {
    if (this.researchRequestObj.ruleEngine) {
      if (this.researchRequestObj.ruleEngine === 2) {
        return ele.icmsId;
      } else if (this.researchRequestObj.ruleEngine === 1) {
        return ele.ruleCode.split('-')[1].trim();
      } else {
        return ele.ruleCode;
      }
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
      this.filesObs = this.filesObs.filter(obs => obs.name !== fileName);
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

  onClientSelection() {
    const superPayersSelected = this.researchRequestObj.superPayersSelected;
    if (this.researchRequestObj.clientSelected.length > 0) {
      this.researchRequestService.getRRSuperPayersByClient(this.researchRequestObj.clientSelected).subscribe((response: any) => {
        if (response.data !== null && response.data !== undefined) {
          this.superPayerList = [];
          this.researchRequestObj.superPayersSelected = [];
          response.data.forEach(superPayer => {
            this.superPayerList.push({ label: superPayer.description, value: superPayer.rrPayerId });
            this.researchRequestObj.superPayersSelected.push(...superPayersSelected.filter(superPayerId => superPayerId === superPayer.rrPayerId));
          });
          this.superPayerDisabled = this.superPayerList.length === 0;
        } else {
          this.superPayerList = [{ label: 'Choose', value: null }];
          this.superPayerDisabled = true;
        }
      });
      this.updatePayerList();
    } else {
      this.payerList = [];
      this.payerDisabled = true;
      this.researchRequestObj.selectedPayerList = [];
      this.researchRequestObj.superPayersSelected = [];
      this.superPayerList = [{ label: 'Choose', value: null }];
      this.superPayerDisabled = true;
    }
  }

  updatePayerList() {
    const payerSelected = this.researchRequestObj.selectedPayerList;
    if (this.researchRequestObj.clientSelected.length > 0) {
      const selPayerOpts: number[] = [];
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
            this.researchRequestObj.selectedPayerList = [];
            response.data.forEach(payer => {
              this.payerList.push({ label: payer.description, value: payer.rrPayerId });
              this.researchRequestObj.selectedPayerList.push(...payerSelected.filter(payerId => payerId === payer.rrPayerId));
            });
            this.payerDisabled = this.payerList.length === 0;
          } else {
            this.payerList = [{ label: 'Choose', value: null }];
            this.payerDisabled = true;
          }
        });
    }
  }

  /**
   * This method is used to populate the internal CC User List
   * Backend return the selected CC user Ids, we check this user id in Active user list
   * and get the selected user object
   */
  populateSelectedCCUsers() {
    this.selectedCCUsersList = [];
    if (this.researchRequestObj.selectedCCUsers && this.researchRequestObj.selectedCCUsers.length > 0) {
      this.researchRequestObj.selectedCCUsers.forEach(selectedUserId => {
        if (this.activeUsersList.length > 0) {
          this.activeUsersList.forEach(user => {
            if (user.userId === selectedUserId) {
              this.selectedCCUsersList.push(user);
            }
          });
        }
      });
    }
  }

  updateSearchRules(e: string[]) {
    this.searchRules = e.toString();
  }

  showInvalidLength(e) {
    this.invalidRuleLength = e;
    this.showInvalid = e > 0 ? 'invalid-show' : 'invalid-hide';
  }

  /**
   * This method is used to populate internal CC users list in researchRequestObj
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
    this.removedCCUsersList = [];
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

  displayRuleEngine(ruleEngineId: number) {
    let engineObj = this.ruleEngineList.find(ele => ele.value === ruleEngineId);
    if (engineObj !== null && engineObj !== undefined) {
      return engineObj.label;
    } else {
      return 'Idea';
    }
  }

  removeSearchRuleItem(rowData: SearchTable) {
    this.searchedDisplayData = this.searchedDisplayData.filter(item => item.id !== rowData.id);
    this.researchRequestObj.searchedRules = this.researchRequestObj.searchedRules.filter(item => item.ruleId !== rowData.ruleId);
  }

  checkDisplayTable() {
    return this.searchedDisplayData.length > 0;
  }

  private trackJiraLoggedInUser() {
    let jiraUserLoggedIn = JSON.parse(localStorage.getItem('TRACK_JIRA_USER_LOGIN'));
    if (!jiraUserLoggedIn) {
      this.router.navigate(['/app-research-request-login']);
    }
  }

  /**
   * Confirmation message to check if form is dirty or saved is false.
   */
  exitBack() {
    if (this.ngForm.dirty || this.saved === false) {
      this.confirmationService.confirm({
        message: 'You are navigating away from this screen, all non-saved work will be lost',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.router.navigate([rc.NAV_MY_RESEARCH_REQUEST_PAGE]);
        },
        reject: () => { }
      });
    }
  }

}
