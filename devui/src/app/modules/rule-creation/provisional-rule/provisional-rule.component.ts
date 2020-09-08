import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, DialogService, DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/primeng';
import { claimService } from 'src/app/services/claim-service';
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { IdeaService } from 'src/app/services/idea.service';
import { ProvisionalRuleService } from 'src/app/services/provisional-rule.service';
import { ReferenceService } from 'src/app/services/reference.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { UsersService } from 'src/app/services/users.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Categories } from 'src/app/shared/models/categories';
import { Constants } from 'src/app/shared/models/constants';
import { EclReferenceDto } from 'src/app/shared/models/dto/ecl-reference-dto';
import { GoodIdeasDto } from 'src/app/shared/models/dto/good-ideas-dto';
import { ProcedureCodeDto } from 'src/app/shared/models/dto/procedure-code-dto';
import { ProvisionalRuleDto } from 'src/app/shared/models/dto/provisional-rule-dto';
import { ReferenceInfoDto } from 'src/app/shared/models/dto/reference-info-dto';
import { RuleRevenueCodeDto } from 'src/app/shared/models/dto/rule-revenue-code-dto';
import { EclReference } from 'src/app/shared/models/ecl-reference';
import { OpportunityValueDto } from 'src/app/shared/models/opportunity-value';
import { PageTitleConstants as ptc } from "src/app/shared/models/page-title-constants";
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { RuleImpactAnalysisRun } from "src/app/shared/models/rule-impact-analysis-run";
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { RuleReferenceUpdates } from 'src/app/shared/models/rule-reference-updates';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { AppUtils, sqlDateConversion } from 'src/app/shared/services/utils';
import { environment } from 'src/environments/environment';
import { RuleInfoService } from "../../../services/rule-info.service";
import { ClaimsComponent } from './claims/claims.component';
import { IcmsTemplateChangeComponent } from './icms-template-change/icms-template-change.component';
import { IcmsTemplateComponent } from './icms-template/icms-template.component';
import { OpportunityValueComponent } from './opportunity-value/opportunity-value.component';
import { ProvisionalReferencesComponent } from './provisional-references/provisional-references.component';
import { ProvisionalRuleProvidersComponent } from './provisional-rule-providers/provisional-rule-providers.component';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DatePipe } from '@angular/common';
import { MessageSend } from 'src/app/shared/models/messageSend';

const PROVISIONAL_RULE_CREATION = 'Provisional Rule Creation';
const LIBRARY_VIEW = 'Library View';
const PROVISIONAL_DETAILS = 'Provisional Details';
const NEED_MORE_INFO = 64;
const LIST_OF_RULES_FOR_IMPACT_ANALYSIS = 'List of Rules for Impact Analysis';

const RESPONSE_SUCCESS = "success";

@Component({
  selector: 'provisionalRule-Root',
  templateUrl: './provisional-rule.component.html',
  styleUrls: ['./provisional-rule.component.css']
})

export class ProvisionalRuleComponent implements OnInit {

  @Input() selectorConfig: any;
  @ViewChild(ClaimsComponent) claims;
  @ViewChildren(ProvisionalRuleProvidersComponent) providerChildren: QueryList<ProvisionalRuleProvidersComponent>;
  @ViewChild(OpportunityValueComponent) oppValue: OpportunityValueComponent;
  @ViewChild(ProvisionalReferencesComponent) provisionalReferences: ProvisionalReferencesComponent;

  //to set the stage of idea(like idea, provisional or libray)
  ruleStage: any;
  opportunityValue: OpportunityValueDto;
  header: any;
  ruleInfo: RuleInfo;
  originalRuleInfo: RuleInfo;
  ruleInfoOriginal: RuleInfo;
  lobs: any[] = [];
  categories: any[] = [{ label: "Choose", value: null }];
  policyOwners: any[] = [{ label: "Select", value: null }];
  states: any[] = [];
  jurisdictions: any[] = [];
  ruleReferences: any[];
  ruleReferencesArray: any[] = [];
  eclReferenceArray: EclReference[] = [];
  eclReference: EclReference;
  ruleCreationStatus: any;
  reference: ReferenceInfoDto = new ReferenceInfoDto();
  eclRef: EclReferenceDto = new EclReferenceDto();
  selectedReference: any = null;
  isReferenceDisableObject: any = {};
  isRemovableObject: any = {};
  isSavableObject: any = {};
  isAddingObject: any = {};

  ruleImpactAnalysisRun: RuleImpactAnalysisRun = new RuleImpactAnalysisRun();
  ruleRefUpdates: RuleReferenceUpdates[];
  provisionalRuleDto: ProvisionalRuleDto = new ProvisionalRuleDto;

  userId: number;
  action: string;
  reviewStatus: any[] = [{ value: 1, label: 'Approved' }, { value: 2, label: 'Not Approved' }];
  tabCheck: boolean = false;
  saveState: boolean = false;
  reassignmentFlag: boolean = false;

  /* Form Variables for two way Binding  */
  ruleStatus: any;
  selectedReviewStatus: any;
  stageId: any;
  ruleReviewComments: any;
  ruleLogicEffDt: Date;

  selectedLobs: any[] = [];
  selectedCategory: any;
  selectedStates: any[] = [];
  selectedJurisdictions: any[] = [];
  selectedReferences: any[] = [];

  ruleClaimImpactInd: boolean = false;
  ruleClaimImpactDetails: any;
  ruleDosageImpactInd: boolean = false;
  ruleDosageImpactDetails: any;

  /* Claim Component two way binding */
  includedClaimServices: any[] = [];
  excludedClaimServices: any[] = [];
  includedBillClaims: any[] = [];
  excludedBillClaims: any[] = [];

  /* Provider Component Tyoe way binding */
  includedSpecialityTypes: any[] = [];
  excludedSpecialityTypes: any[] = [];
  includedSubspecialityTypes: any[] = [];
  excludedSubspecialityTypes: any[] = [];


  ruleRevenueCodesList: RuleRevenueCodeDto[] = [];

  /* Boolean values to handle the fileds in different components */

  provDialogDisable: boolean = false;
  logicalCodesFlag: boolean = true;
  submitBtnDisable: boolean = true;
  saveBtnDisable: boolean = false;
  disableState: boolean = true;
  disableJurisdiction: boolean = true;
  disableTopFields: boolean;
  approvalCommentsFlag: boolean = true;
  response: boolean = false;
  provisionalRuleCreation: boolean;
  ruleReview: boolean;
  fromMaintenanceProcess: boolean = false;
  ruleProvisionalReview: boolean = false;//from  po approval screen to access provisional rule dialog
  saveDisplay: boolean = false;
  Message: string;
  indexVal: number = 0;
  isValidForSave: boolean = true;
  wasNeedMoreInfo: boolean = false;
  impactTypeNo: boolean = false;
  dialogMode: boolean = true;

  claimsClicked: boolean = false;
  providersClicked: boolean = false;
  codesClicked: boolean = false;
  impactsClicked: boolean = false;
  referencesClicked: boolean = false;

  ErrorIDR: boolean;
  ErrorMessageIDR: string = '';

  minDate: Date;

  ruleId: number;
  templateActivate: boolean = false;
  cvpTemplate: any;
  rpeTemplate: any;
  cvpDownLoadLink: any = environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/' + RoutingConstants.CVP_FILE_DOWNLOAD_URL + '/';
  downLoadCvpById: any = environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/' + RoutingConstants.CVP_FILE_DOWNLOAD_URL + '/';
  rpeDownLoadLink: any = environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/' + RoutingConstants.RPE_FILE_DOWNLOAD_URL + '/';
  downLoadRpeById: any = environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/' + RoutingConstants.RPE_FILE_DOWNLOAD_URL + '/';
  @ViewChild('uploadControl') uploadControl: FileUpload;
  @ViewChild('rpeUploadControl') rpeUploadControl: FileUpload;
  showIcon: boolean = false;
  showRpeIcon: boolean = false;
  readOnlyView: boolean = false;
  isSubmitValidation: boolean = true;

  latestVersionMeg: any = "";
  isGoodIdea: boolean = false;
  isRuleCatalogue: boolean = false;
  /** SameSim module flags */
  isSameSim: boolean = false;
  fromSameSimMod: boolean = false;
  selectedPO: number;
  originialAssignToCategory: number;
  previousAssignedTo: number;

  libraryPrmNumber: string;
  markUpEnabled: boolean = false;

  cols = [
    { field: 'ruleCode', header: 'Provisional Rule ID', width: '20%' },
    { field: 'name', header: 'Provisional Rule Name', width: '70%' },
    { field: 'delete', header: 'Delete', width: '10%' },
  ];
  filteredRules: any[] = [];
  loading: boolean = false;

  /* variables to select current and previous rows in the list of provisional rules table */
  selectedRule: any;
  previousSelectedRule: any;

  //flag to identify a provisional rule needs more info(if 'true' not rule creation and needs more info)
  provRuleNeedsMoreInfo: boolean = false;
  isProvisionalRuleCreation: boolean = false;
  provisionalRuleDtos: ProvisionalRuleDto[] = [];
  addButtonDisable: boolean = false;
  provisionalRuleId: number;
  lastRuleId: number;
  selectDisplay: boolean = false;
  deleteDisplay: boolean = false;
  isIdea: boolean = false;
  ruleReadOnly: boolean = false;
  maintenanceOnly: boolean = false;

  showChangeRmr: boolean = false;
  showELLLink: boolean = false;
  applications;


  selectedShelved: GoodIdeasDto[] = [];
  saveGoodIdeas: boolean = false;
  isCandidateGoodIdea: boolean = false;

  deltas;

  yearValidRange = `${Constants.MIN_VALID_YEAR}:${Constants.MAX_VALID_YEAR}`;

  retireStatusChild: boolean = false;

  selectedLobsTooltip: string = '';
  selectedStatesTooltip: string = '';
  selectedJurisdictionsTooltip: string = '';
  selectedLobsLabels: string[] = [];
  selectedStatesLabels: string[] = [];

  loadingELLDetail: boolean = false;

  constructor(private utils: AppUtils, private router: Router,
    public config: DynamicDialogConfig, public ref: DynamicDialogRef, private provisionalRuleService: ProvisionalRuleService,
    private sqldateConvert: sqlDateConversion, private messageService: MessageService,
    private dialogService: DialogService, private ruleService: RuleInfoService,
    private storage: StorageService, private ideaService: IdeaService,
    private fileManagerService: FileManagerService,
    private eclConstants: ECLConstantsService, private userService: UsersService,
    private eclReferenceService: ReferenceService, private toastService: ToastMessageService,
    private claimsService: claimService, private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService,
    private procedureCodesService: ProcedureCodesService,
    private datepipe: DatePipe) {

    this.ruleInfo = new RuleInfo();
    this.originalRuleInfo = new RuleInfo();
    this.opportunityValue = new OpportunityValueDto();
    this.isGoodIdea = this.storage.get(Constants.PARENT_NAVIGATION, false) == 'GOOD_IDEAS';
    this.isRuleCatalogue = this.storage.get(Constants.PARENT_NAVIGATION, false) == Constants.PARENT_NAVIGATION_RULE_CATALOGUE;

  }

  /* Function which executes on the page load to initalize the required values  */

  ngOnInit() {
    if (this.config.data == undefined) {
      this.config.data = {};
    }
    this.markUpEnabled = false;
    let creationStatus = this.config.data.creationStatus;
    //flag to identify a provisional rule needs more info(if 'true' not rule creation and needs more info)
    this.provRuleNeedsMoreInfo = this.config.data.provRuleNeedsMoreInfo;
    this.isSameSim = this.config.data.isSameSim;
    this.fromSameSimMod = this.config.data.fromSameSimMod;
    this.ruleCreationStatus = creationStatus;

    this.utils.getAllLobsValue(this.lobs, this.response);
    this.utils.getAllStatesValue(this.states, this.response);
    this.utils.getAllJurisdictionsValue(this.jurisdictions, this.response);
    this.utils.getAllCategoriesValue(this.categories, this.response);

    this.userId = this.utils.getLoggedUserId();

    this.header = this.config.data.header;

    this.minDate = new Date();
    this.minDate.setDate(1);
    this.minDate.setMonth(0);
    this.minDate.setFullYear(1990);

    this.checkSelectorConfigInfo();
    this.readOnlyView = this.config.data.readOnlyView;
    this.fromMaintenanceProcess = this.config.data.fromMaintenanceProcess;
    this.reassignmentFlag = this.config.data.reassignmentFlag;
    if (this.config.data.ruleReview) {
      this.loadSelectedRule();
    }
    if (this.fromMaintenanceProcess) {
      this.disableTopFields = true;
    }
    else if (this.header === PROVISIONAL_DETAILS) {
      this.loading = true;
      this.provisionalRuleService.findRuleById(this.ruleId).subscribe(response => {
        let rule = response.data;
        this.getLibraryPrmNumber(rule.ideaId);
        this.ruleInfo = rule;
        this.ruleStatus = 'Provisional Rule';
        this.provDialogDisable = true;
        this.disableJurisdiction = true;
        this.disableState = true;

        if (this.ruleInfo.ruleLogicEffDt !== null && this.ruleInfo.ruleLogicEffDt !== undefined) {
          this.ruleInfo.ruleLogicEffDt = new Date(this.ruleInfo.ruleLogicEffDtStr);
        }
        this.saveBtnDisable = true;
        this.refreshReferences(this.ruleInfo.ruleId);
        this.setRuleInfoLobsStatesJurCat(this.ruleInfo);
        //setting the stage to provisional to fetch and save all the references at the provisional stage
        this.ruleStage = Constants.ECL_PROVISIONAL_STAGE;
        this.provisionalReferences.ruleStage = Constants.ECL_PROVISIONAL_STAGE;

        this.loading = false;
      });
    }
    else if (this.header === PROVISIONAL_RULE_CREATION) {
      this.loading = true;
      this.isProvisionalRuleCreation = true;
      if (this.ruleId !== 0 || this.ruleId !== undefined) {
        //condition to validate if a provisional rule needs more info or not('true' value needs more info)
        if (!this.provRuleNeedsMoreInfo) {
          this.getLibraryPrmNumber(this.ruleId);
        }
        if (creationStatus) {
          this.isIdea = true;
          this.provisionalRuleService.findIdeaById(this.ruleId).subscribe(response => {
            let rule = response.data;
            this.provDialogDisable = false;
            this.selectedLobs = [];
            this.ruleStatus = 'New Idea';
            this.ruleInfo.ruleName = rule["ideaName"];
            this.ruleInfo.ruleCode = rule["ideaCode"];
            this.ruleInfo.ruleId = null;
            this.ruleInfo.parentRuleId = this.ruleId;
            this.ruleInfo.ideaId = this.ruleId;
            this.ruleInfo.ruleDescription = rule["ideaDescription"];

            let references: any[] = rule.eclReferences;
            if ((references != null) && (references != [])) {
              //setting the stage to idea to fetch all the references at the in provisional rule creation
              this.provisionalReferences.getAllReferences(this.ruleId, Constants.ECL_IDEA_STAGE);
            }
            // this flag is set to true a new provisional rule which is not saved and created yet
            this.provisionalRuleDto.newProvRule = true;
            this.setRuleInfoLobsStatesJurCat(rule);
            this.checkStateJurisdiction();
            this.getNewProvisionalRuleId();
            this.addButtonDisable = true;
            //setting the stage to provisional to fetch and save all the references at the provisional stage
            this.provisionalReferences.ruleStage = Constants.ECL_PROVISIONAL_STAGE;

            this.loading = false;
          });
        }
        //condition to validate and show a provisional rule needs more info('not rule creation and needs more info)
        else if (!creationStatus && this.provRuleNeedsMoreInfo) {
          this.provisionalRuleId = this.config.data.ruleId;
          //disabling the rule creation flag it is not provisional rule creation anymore
          this.isProvisionalRuleCreation = false;
          this.ruleStage = Constants.ECL_PROVISIONAL_STAGE;
          this.provisionalReferences.ruleStage = Constants.ECL_PROVISIONAL_STAGE;
          this.populateByExistingProvisionalRuleId();

          this.loading = false;
        } else {
          this.getExistingProvisionalRulesByIdeaId();

          this.loading = false;
        }
      }
    }
    else if (this.header === LIBRARY_VIEW) {
      this.loading = true;
      if (this.ruleId !== 0 || this.ruleId !== undefined) {
        this.provisionalRuleService.findRuleById(this.ruleId).subscribe(response => {
          let rule = response.data;
          this.getLibraryPrmNumber(rule.ideaId);
          this.ruleInfo = rule;
          this.ruleStatus = 'Rule';
          if (this.ruleInfo.ruleLogicEffDt !== null && this.ruleInfo.ruleLogicEffDt !== undefined) {
            this.ruleInfo.ruleLogicEffDt = new Date(this.ruleInfo.ruleLogicEffDtStr);
          }
          this.provDialogDisable = true;
          this.disableJurisdiction = true;
          this.disableState = true;
          this.saveBtnDisable = true;
          this.refreshReferences(this.ruleInfo.ruleId);
          this.setRuleInfoLobsStatesJurCat(this.ruleInfo);
          this.loading = false;
        });
      }
    }
    else if (this.header == 'Rule Provisional Details') {
      this.loading = true;
      this.selectedReviewStatus = this.config.data.ruleReviewStatus;
      this.ruleReviewComments = this.config.data.ruleReviewComments;
      this.stageId = this.config.data.stageId;

      this.provisionalRuleService.findRuleById(this.ruleId).subscribe(response => {
        let rule = response.data;
        this.getLibraryPrmNumber(rule.ideaId);
        this.ruleInfo = rule;
        this.provisionalRuleCreation = false;
        this.ruleProvisionalReview = true;
        this.ruleStatus = 'Provisional Rule';
        if (this.ruleInfo.ruleLogicEffDt !== null && this.ruleInfo.ruleLogicEffDt !== undefined) {
          this.ruleInfo.ruleLogicEffDt = new Date(this.ruleInfo.ruleLogicEffDtStr);
        }

        this.provDialogDisable = false;
        this.disableJurisdiction = false;
        this.disableState = false;
        this.submitBtnDisable = false;
        this.saveBtnDisable = false;
        this.refreshReferences(this.ruleInfo.ruleId);
        this.setRuleInfoLobsStatesJurCat(this.ruleInfo);
        this.checkStateJurisdiction();
        this.loading = false;
      });
    }

    this.provisionalRuleCreation = this.config.data.provisionalRuleCreation;

    if (this.provisionalRuleCreation == null) {
      this.provisionalRuleCreation = true;

    }
    if (this.ruleProvisionalReview) {
      this.provisionalRuleCreation = false;
    }
    if (this.config.data.reviewStatus != null) {
      this.reviewStatus = this.config.data.reviewStatus;
    }
    this.ruleReview = this.config.data.ruleReview;
    this.includedSpecialityTypes = [];
    this.excludedSpecialityTypes = [];

    if (this.selectorConfig != undefined && (this.selectorConfig.templateActivate)) {
      this.templateActivate = true;
    }

    this.downLoadCvpById = this.downLoadCvpById + this.ruleId;
    this.downLoadRpeById = this.downLoadRpeById + this.ruleId;

    this.showLatestVersionMsg();

    // Gets the deltas bty rule.
    this.provisionalRuleService.getRuleDeltas(this.ruleId).subscribe((response: BaseResponse) => {
      if (response.data) {
        this.deltas = response.data.auditDetails;
      }
    });

    //Show ELL Link
    const source = this.activatedRoute.snapshot.queryParams ? this.activatedRoute.snapshot.queryParams.source : null;
    this.showELLLink = (source === Constants.RULE_CATALOG_SCREEN);

    //select tab
    if (this.config.data == undefined || this.config.data.tabSelected == undefined) {
      this.indexVal = 0;
    } else {
      this.indexVal = this.config.data.tabSelected;
    }
    if (this.config.data.pageTitle === LIST_OF_RULES_FOR_IMPACT_ANALYSIS ||
      (this.isSameSim && this.indexVal === 0)) {
      this.indexVal = 5;
    }

  }

  onLoadingELLDetail(event: any) {
    this.loadingELLDetail = event.loading;
  }

  /**
   * This reload getAllPolicyOwnerByteamsAndCategories;
   */
  reloadAssignTo() {
    let catId = this.ruleInfo.category.categoryId;
    if (this.isProvisionalRuleCreation || this.provRuleNeedsMoreInfo) {
      if (catId !== null && catId !== undefined) {
        this.userService.getAllPolicyOwnerbyTeamsAndCategories(this.userId, this.ruleInfo.category.categoryId).subscribe(resp => {
          if (resp && resp.data) {
            let listPO = resp.data;
            if (listPO !== undefined && listPO !== null && listPO.length > 0) {
              this.policyOwners = [{ label: "Select", value: null }];
              listPO.forEach(user => {
                this.policyOwners.push({ label: user.firstName, value: user.userId });
              });
              if (this.originialAssignToCategory !== catId) {
                this.ruleInfo.assignedTo = null;
              } else {
                this.ruleInfo.assignedTo = this.selectedPO;
              }
            } else {
              this.policyOwners = [{ label: "Select", value: null }];
              this.ruleInfo.assignedTo = null;
              this.submitBtnDisable = true;
            }
          }
        });
      }
    }
  }
  /**
   * Check if the screen was called from Navigation Widget, if so
   * replace current ruleInfo by parent Rule
   */
  checkSelectorConfigInfo() {
    this.ruleId = this.config.data.ruleId;
    this.readOnlyView = false;
    if (this.selectorConfig == undefined) {
      return;
    }
    this.config.data.tabSelected = this.selectorConfig.tabSelected;
    this.dialogMode = this.config.data.dialogMode;
    this.config.data.isSameSim = this.selectorConfig.isSameSim;
    this.isSameSim = this.config.data.isSameSim;
    if (this.isSameSim) {
      this.config.data.reviewStatus = this.selectorConfig.reviewStatus;
    }
    this.config.data.ruleReview = true;
    this.config.data.provisionalRuleCreation = false;
    this.readOnlyView = this.selectorConfig.readOnlyView;
    this.config.data.readOnlyView = this.readOnlyView;
    this.config.data.readWrite = !this.readOnlyView;
    this.provDialogDisable = this.readOnlyView;
    this.ruleId = this.selectorConfig.ruleId;
    if (this.selectorConfig.stageId === Constants.ECL_PROVISIONAL_STAGE) {
      this.header = PROVISIONAL_DETAILS;
      this.config.data.fromMaintenanceProcess = false;
      this.config.data.reviewStatus = this.provisionalRuleService.getStatusCodeForApprovalScreen();
      this.saveBtnDisable = !this.readOnlyView;
      return;
    } else {
      this.header = "Library Rule Details";
      if (this.readOnlyView && !this.isSameSim) {
        return;
      }
    }
    if (this.selectorConfig.impactedRuleId <= 0) {
      // find Impacted rule value.
      this.ruleService.getRulesByParentId(this.selectorConfig.ruleId).subscribe((response: any) => {
        response.data.forEach(rule => {
          this.ruleId = rule.ruleId;
        });
      });
    }
    // find review status
    this.config.data.reviewStatus = [];
    this.ruleService.getValidApprovalStatus(this.selectorConfig.libRuleId, this.userId).subscribe((resp: any) => {
      let appStat: any[] = resp.data;
      appStat.forEach(stat => {
        this.config.data.reviewStatus.push({ label: stat.description, value: stat.id });
      });
    })
  }

  /* Function to get all the references while initiating the Oninit function  */
  getReferences(eclReferences) {

    let references = eclReferences;
    if ((references != null) && (references != [])) {
      this.ruleReferences = references;
      this.ruleReferencesArray = [];
      this.ruleReferences.forEach(reference => {
        if (reference.statusId != Constants.STATUS_CODE_INACTIVE) {
          this.eclReference = new EclReference;
          this.eclReference.refInfo.referenceId = reference.refInfo.referenceId;
          this.eclReference.chapter = reference.chapter;
          this.eclReference.page = reference.page;
          this.eclReference.section = reference.section;
          this.eclReference.comments = reference.comments;
          this.eclReference.eclStage = Constants.ECL_PROVISIONAL_STAGE;

          this.eclReferenceArray.push(this.eclReference);

          this.ruleReferencesArray.push({
            "source": reference.refInfo.referenceSource.sourceDesc,
            "name": reference.refInfo.referenceName,
            "title": reference.refInfo.referenceTitle,
            "refId": reference.refInfo.referenceId,
            "eclReferenceId": reference.eclReferenceId,
            "refSourceId": reference.refInfo.referenceSource.refSourceId
          });
        }
      });
    } else {
      this.ruleReferences = [];
      this.ruleReferencesArray = [];
    }
  }

  /* Function to enable Submit button once user clicks all tabs */

  onTabChange(e) {
    var index = e.index;

    if (index == 1) {
      this.claimsClicked = true;
    }
    else if (index == 2) {
      this.providersClicked = true;
    }
    else if (index == 3) {
      this.codesClicked = true;
    }
    else if (index == 4) {
      this.impactsClicked = true;
    }
    else if (index == 5) {
      this.referencesClicked = true;
    }

    if (this.claimsClicked && this.providersClicked && this.codesClicked && this.impactsClicked && this.referencesClicked) {
      if (this.header === PROVISIONAL_DETAILS || this.header === LIBRARY_VIEW) {
        this.tabCheck = false;
        this.submitBtnDisable = true;
      } else if (this.isProvisionalRuleCreation) {
        if (!this.ruleInfo.assignedTo || this.ruleInfo.assignedTo === 0) {
          this.tabCheck = true;
          this.submitBtnDisable = true;
        } else {
          this.tabCheck = true;
          this.submitBtnDisable = false;
        }
      } else {
        this.tabCheck = true;
        this.submitBtnDisable = false;
      }
    }
  }

  validateImpactsTab() {
    let res: boolean = true;
    if ((this.ruleInfo.claimImpactInd === 1) && !(this.ruleInfo.claimImpactDetails)) {
      this.Message = "Modifiers Impact on claim process is mandatory when Modifiers Impact on claim process indicator is 'Yes'";
      this.saveDisplay = true;
      res = false;
    } else {
      this.isValidForSave = true
    }

    if ((this.ruleInfo.dosageImpactInd === 1) && (!this.ruleInfo.procedureCodeDto ||
      !this.ruleInfo.procedureCodeDto.diagnosisCodes)) {
      this.Message = "Diagnosis codes Impact on claim process is mandatory when Diagnosis codes Impact on claim process indicator is 'Yes'";
      this.saveDisplay = true;
      res = false;
    } else {
      this.isValidForSave = true
    }

    if ((this.ruleInfo.ageLimitInd === 1) && !(this.ruleInfo.ageLimitDetails)) {
      this.Message = "Age Limit Details is mandatory when age limit indicator is 'Yes'";
      this.saveDisplay = true;
      res = false;
    } else {
      this.isValidForSave = true
    }

    if ((this.ruleInfo.mileLimitInd === 1) && !(this.ruleInfo.mileLimitDetails)) {
      this.Message = "Mile Limit Details is mandatory when mile limit indicator is 'Yes'";
      this.saveDisplay = true;
      res = false;
    } else {
      this.isValidForSave = true
    }

    if ((this.ruleInfo.dosageLimitInd === 1) && !(this.ruleInfo.dosageLimitDetails)) {
      this.Message = "Dosage Limit Details is mandatory when dosage limit indicator is 'Yes'";
      this.saveDisplay = true;
      res = false;
    } else {
      this.isValidForSave = true
    }

    return res;
  }

  /* Function to save the provisional rule details */
  saveProvisional() {
    this.saveBtnDisable = true;
    this.isValidForSave = true;
    this.approvalCommentsFlag = this.disableTopFields;
    this.validateImpactType();
    if (this.isValidForSave === true) {

      if (!this.validateCategory()) {
        this.isValidForSave = false;
      } else if (!this.validateRuleLogic()) {
        this.isValidForSave = false;
      } else if (!this.checkRuleEffectiveDateYear(this.ruleInfo.ruleLogicEffDt)) {
        this.isValidForSave = false;
      }
      if (this.isValidForSave) {
        this.action = 'save';

        if (this.header === PROVISIONAL_RULE_CREATION) {
          this.selectedReviewStatus = '';
        }

        this.ProvisionalRuleDtoSet();
        if (this.isProvisionalRuleCreation) {
          this.provisionalRuleDtos = [this.provisionalRuleDto];
          this.provisionalRuleService.saveProvisionalRules(this.provisionalRuleDtos).subscribe(resp => {
            let rule = resp.data;
            if (rule) {
              this.saveState = true;
              this.Message = 'Provisional Rule Details Saved Successfully.';
              this.ruleStatus = 'Provisional Rule';
              this.ruleCreationStatus = false;
              this.saveDisplay = true;
              this.addButtonDisable = false;
              // condition to refresh the provisional rule after saving if the rule needs more info
              if (this.provRuleNeedsMoreInfo) {
                this.populateByExistingProvisionalRuleId();
              } else {
                this.getExistingProvisionalRulesByIdeaId();
              }
            } else {
              this.ruleInfo = new RuleInfo();
              this.saveBtnDisable = false;
            }
            this.fileManagerService.uploadFileSub();
          });
        } else {
          if (this.validateReviewStatus()) {
            this.provisionalRuleService.saveProvRule(this.provisionalRuleDto).subscribe(response => {
              let rule = response.data;
              if ((rule !== null) && (rule !== [])) {
                let ruleId = rule.ruleInfoObj;
                this.refreshProvisionalRule(ruleId);
                this.saveDisplay = true;
                if (this.fromMaintenanceProcess) {
                  this.Message = 'Library Rule Details Saved Successfully.';
                  this.disableTopFields = false;
                  if (this.retireStatusChild === true) {
                    this.provDialogDisable = true;
                  } else {
                    this.provDialogDisable = false;
                  }
                  this.resetApprovalValues();
                } else {
                  this.saveState = true;
                  this.Message = 'Provisional Rule Details Saved Successfully.';
                  this.ruleStatus = 'Provisional Rule';
                }
              } else {
                this.ruleInfo = new RuleInfo();
                this.saveBtnDisable = false;
              }
            });
            this.fileManagerService.uploadFileSub();
          }
        }

      } else {
        this.saveBtnDisable = false;
      }
    }
  }

  private validateImpactType() {
    if (this.fromMaintenanceProcess && !this.retireStatusChild) {
      if (this.ruleImpactAnalysisRun.ruleImpactedInd === null) {
        this.indexVal = 5;
        this.Message = 'Please select Value for Rule Impacted field';
        this.saveDisplay = true;
        this.isValidForSave = false;
      }
      else if (this.ruleImpactAnalysisRun.ruleImpactedInd === 1 && this.ruleImpactAnalysisRun.ruleImpactTypeId === null) {
        this.indexVal = 5;
        this.Message = 'Please select Rule Impact type';
        this.saveDisplay = true;
        this.isValidForSave = false;
      }
      else if (this.ruleImpactAnalysisRun.ruleImpactedInd === 1 && (this.ruleImpactAnalysisRun.ruleImpactAnalysis === null || this.ruleImpactAnalysisRun.ruleImpactAnalysis.trim() === "")) {
        this.indexVal = 5;
        this.Message = 'Please enter Value for Rule Impact Description';
        this.saveDisplay = true;
        this.isValidForSave = false;
      }
      else {
        this.provisionalReferences.ruleReferencesArray.forEach(ruleRef => {
          if (ruleRef.changeDetailsDisplayFlag === true && (ruleRef.changedStatus == null || (ruleRef.changedStatus === 1 && (ruleRef.changedDetail === null || ruleRef.changedDetail.trim() === "")))) {
            this.indexVal = 5;
            this.Message = 'Please complete review of all the References';
            this.saveDisplay = true;
            this.isValidForSave = false;
          }
        });
      }
    }
  }

  /* Function to refresh the provisional rule reference details */
  refreshReferences(ruleId: any) {
    this.provisionalRuleService.getEclReferences(ruleId).subscribe(response => {
      let references: any[] = [];
      references = response["data"];
      if ((references != null) && (references != [])) {
        this.getReferences(references);
      }
    });
  }

  /* Function to refresh the provisional rule details */
  refreshProvisionalRule(ruleId) {
    this.provisionalRuleService.findRuleById(ruleId).subscribe(response => {
      let rule = response.data;
      this.ruleInfo = rule;
      if (this.ruleInfo.ruleLogicEffDt !== null && this.ruleInfo.ruleLogicEffDt !== undefined) {
        this.ruleInfo.ruleLogicEffDt = new Date(this.ruleInfo.ruleLogicEffDtStr);
      }
      if (this.fromMaintenanceProcess) {
        this.ruleStage = Constants.ECL_LIBRARY_STAGE
      } else {
        this.ruleStage = Constants.ECL_PROVISIONAL_STAGE;
      }
      this.provisionalReferences.getAllReferences(this.ruleInfo.ruleId, this.ruleStage);
      let estOpportunity = String(this.ruleInfo.estOppurtunityVal);
      this.ruleInfo.estOppurtunityVal = estOpportunity;
      this.setRuleInfoLobsStatesJurCat(this.ruleInfo);
    });
  }

  submitProvisionalRules() {
    this.ProvisionalRuleDtoSet();
    if (this.isProvisionalRuleCreation) {
      this.previousAssignedTo = this.ruleInfo.assignedTo;
      this.isValidForSave = true;
      let isPolicyExist: boolean = true;
      //adding valiation to save a provisional rule before submitting, if their are multiple provisional rules
      if ((this.addButtonDisable) && (this.filteredRules.length < 2) && (this.provisionalRuleDtos.length < 1)) {
        this.provisionalRuleDto.action = 'submit';
        this.provisionalRuleDtos = [...this.provisionalRuleDtos, this.provisionalRuleDto];
      } else if ((this.addButtonDisable) && (this.filteredRules.length > 1)) {
        if (this.provisionalRuleDto.newProvRule) {
          this.isValidForSave = false;
          let warnMessage: string = `Please Save Provisional Rule ${this.provisionalRuleDto.ruleInfo.ruleCode} before Submitting`;
          this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 3000, true);
        }
      } else if (!this.addButtonDisable) {
        this.provisionalRuleDto.action = 'submit';
        this.provisionalRuleDtos = this.provisionalRuleDtos.filter(provRule => provRule.ruleInfo.ruleId !== this.provisionalRuleDto.ruleInfo.ruleId);
        this.provisionalRuleDtos = [...this.provisionalRuleDtos, this.provisionalRuleDto];
      }
      this.provisionalRuleDtos.forEach(ele => {
        if (this.isValidForSave) {
          this.ruleInfo = ele.ruleInfo;
          this.ruleInfo.procedureCodeDto = ele.procedureCodeDto;
          this.validateForm();
        }
        if (isPolicyExist) {
          isPolicyExist = this.validatePolicyOwner();
        }
      });
      if (this.isValidForSave && isPolicyExist) {
        this.action = 'submit';
        //call service to submit to backend
        this.provisionalRuleService.saveProvisionalRules(this.provisionalRuleDtos).subscribe(response => {
          if (response !== null) {
            this.ruleStatus = 'Provisional Rule';
            this.saveDisplay = true;
            this.Message = 'Provisional Rule Details Submitted Successfully.';
          } else {
            this.submitBtnDisable = false;
          }
        });
      } else {
        this.submitBtnDisable = false;
        this.ruleInfo.assignedTo = this.previousAssignedTo;
      }
    } else {
      if (this.ruleProvisionalReview && this.selectedReviewStatus === Constants.SHELVED_VALUE) {
        if (this.validateForm()) {
          if (this.isValidForSave) {
            if (this.validateReviewStatus()) {
              this.fillselectedShelved();
              this.saveGoodIdeas = true;
              this.readOnlyView = true;
            }
          }
        } else {
          this.submitBtnDisable = false;
        }
      } else {
        this.submitProvisional();
      }
    }
  }

  /* Function to Submit the provisional rule details */
  submitProvisional() {
    this.submitBtnDisable = true;
    this.action = 'submit';
    this.isSubmitValidation = this.validateReviewStatus();
    if (this.validateForm() && this.isSubmitValidation && this.validatePolicyOwner()) {
      this.ProvisionalRuleDtoSet();
      this.provisionalRuleService.saveProvRule(this.provisionalRuleDto).subscribe(response => {
        if ((response !== null)) {
          const msg = this.getDisplayedMessageAfterSubmission(response.data.ruleInfoObj);
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, msg, 3000, true);
          this.closeRuleApprovalDialog();
        } else {
          this.submitBtnDisable = false;
        }
      });
      this.fileManagerService.uploadFileSub();
    } else {
      this.submitBtnDisable = false;
    }
  }

  /**
   * return display message to show after submit operation.
   * @param data Submit operation return value.
   */
  private getDisplayedMessageAfterSubmission(data: string): string {
    switch (this.selectedReviewStatus) {
      case Constants.LIBRARY_RULE_VALUE:
        return `Rule ${data} has been created successfully.`;
      case Constants.PR_APPROVAL_VALUE:
        return 'Rule has been submitted for Peer Review Approval.';
    }
    return 'Rule has been submitted successfully.';
  }

  /* Function to navigate to home page after provisional rule submit */

  navigateHome() {
    this.router.navigate(['/home']);
  }

  public navigateIdeasNeedingResearch(): void {
    this.router.navigate(['/ideas-needing-research']);
  }

  public navigateGoodIdeas(): void {
    this.router.navigate(['/good-ideas']);
  }

  public navigateRuleCatalogue(): void {
    this.router.navigate(['/' + RoutingConstants.RULES_CATALOG_URL], { queryParams: { view: Constants.RULES_CATALOG_PARAMETER_VIEW_LAST_REQUEST } });
  }

  public navigateSameSim(navigateTo: string): void {
    this.router.navigate(['/industry-updates', 'rule-process', navigateTo]);
  }

  closeRuleApprovalDialog() {
    this.ref.close();
  }
  checkStateJurisdiction() {
    if (this.selectedLobs) {
      if (this.selectedLobs.includes(1)) {
        this.disableState = false;

      } else {
        this.selectedStates = undefined;
        this.disableState = true;
      }
    }
    if (this.selectedLobs) {
      if (this.selectedLobs.includes(2)) {
        this.disableJurisdiction = false;
      } else {
        this.selectedJurisdictions = undefined;
        this.disableJurisdiction = true;
      }
    }
  }
  ProvisionalRuleDtoSet() {
    let ruleEffectDate = this.datepipe.transform(this.ruleInfo.ruleLogicEffDt, 'dd-MM-yyyy');
    if (!this.fromMaintenanceProcess) {
      this.ruleInfo.providerTypeInd = this.providerChildren.first.currRuleInfo.providerTypeInd;
      this.ruleInfo.specialityInd = this.providerChildren.first.currRuleInfo.specialityInd;
    } else {
      this.ruleInfo.providerTypeInd = this.providerChildren.last.currRuleInfo.providerTypeInd;
      this.ruleInfo.specialityInd = this.providerChildren.last.currRuleInfo.specialityInd;
    }
    this.ruleInfo.ruleLogicEffDtStr = ruleEffectDate;
    this.sqldateConvert.JSDateToSQLDate(this.ruleInfo.ruleLogicEffDt);
    this.provisionalRuleDto.action = this.action;
    this.provisionalRuleDto.user = this.userId;
    this.provisionalRuleDto.ruleInfo = this.ruleInfo;
    if (this.provisionalRuleDto.ruleInfo.ruleLogicEffDt !== null
      && this.provisionalRuleDto.ruleInfo.ruleLogicEffDt !== undefined) {
      this.ruleInfo.ruleLogicEffDt.setHours(0);
      this.ruleInfo.ruleLogicEffDt.setMinutes(0);
      this.ruleInfo.ruleLogicEffDt.setSeconds(0);
    }
    this.provisionalRuleDto.lobs = this.selectedLobs;
    this.provisionalRuleDto.states = this.selectedStates;
    this.provisionalRuleDto.jurisdictions = this.selectedJurisdictions;
    this.provisionalRuleDto.procedureCodeDto = this.ruleInfo.procedureCodeDto;

    if (!this.fromMaintenanceProcess) {
      this.provisionalRuleDto.includedSpecialityTypes = this.providerChildren.first.includedSpecialityTypes;
      this.provisionalRuleDto.excludedSpecialityTypes = this.providerChildren.first.excludedSpecialityTypes;
      this.provisionalRuleDto.includedSubspecialityTypes = this.providerChildren.first.includedSubspecialityTypes;
      this.provisionalRuleDto.excludedSubspecialityTypes = this.providerChildren.first.excludedSubspecialityTypes;
    } else {
      this.provisionalRuleDto.includedSpecialityTypes = this.providerChildren.last.includedSpecialityTypes;
      this.provisionalRuleDto.excludedSpecialityTypes = this.providerChildren.last.excludedSpecialityTypes;
      this.provisionalRuleDto.includedSubspecialityTypes = this.providerChildren.last.includedSubspecialityTypes;
      this.provisionalRuleDto.excludedSubspecialityTypes = this.providerChildren.last.excludedSubspecialityTypes;
    }

    this.provisionalRuleDto.includedClaims = this.claims.includedClaimServices;
    this.provisionalRuleDto.excludedClaims = this.claims.excludedClaimServices;
    this.provisionalRuleDto.includedBills = this.claims.includedBillClaims;
    this.provisionalRuleDto.excludedBills = this.claims.excludedBillClaims;
    this.provisionalRuleDto.fromMaintenanceProcess = this.fromMaintenanceProcess;
    this.provisionalRuleDto.selectedReviewStatus = this.selectedReviewStatus;
    this.provisionalRuleDto.ruleReviewComments = this.ruleReviewComments;
    this.provisionalRuleDto.oppValueDto = this.oppValue.opportunityValue;
    this.provisionalRuleDto.ruleRevenueCodesList = this.claims.ruleRevenueCodesList;
    if (this.ruleInfo.assignedTo) {
      if (this.ruleInfo.assignedTo.userId) {
        this.provisionalRuleDto.assignedTo = this.ruleInfo.assignedTo.userId;
      } else {
        this.provisionalRuleDto.assignedTo = this.ruleInfo.assignedTo;
      }
    }
    if (this.fromMaintenanceProcess) {
      this.provisionalRuleDto.ruleImpactAnalysisDetails = this.provisionalReferences.ruleImpactAnalysisRun;
      this.ruleRefUpdates = [];
      this.provisionalReferences.ruleReferencesArray.forEach(ruleRef => {
        let ruleReferenceUpdates = new RuleReferenceUpdates();
        ruleReferenceUpdates.referenceId = ruleRef.refId;
        ruleReferenceUpdates.refChangeDetails = ruleRef.changedDetail;
        ruleReferenceUpdates.refChangeStatusId = ruleRef.changedStatus;
        this.ruleRefUpdates.push(ruleReferenceUpdates);
      });
      this.provisionalRuleDto.ruleRefUpdates = this.ruleRefUpdates;
    }
  }

  saveDialog() {
    this.saveDisplay = false;
    this.saveBtnDisable = false;
    if (this.action === "submit") {
      if (this.ruleProvisionalReview || this.wasNeedMoreInfo) {
        if (this.isSubmitValidation) {
          this.submitBtnDisable = false;
          if (this.isValidForSave) {
            this.ref.close();
            this.navigateHome();
          }
        }
      }
      else {
        if (this.isValidForSave) {
          this.ref.close();
          this.navigateHome();
        }
      }
    }
  }
  confirmExit() {
    if (this.saveGoodIdeas) {
      this.saveGoodIdeas = false;
      this.isCandidateGoodIdea = true;
    }
    let message = 'Are you sure, you want to exit the dialog?';
    let acceptVisible = true;
    let rejectLabel = Constants.NO;
    if (this.markUpEnabled && (!this.readOnlyView || this.isSameSim) && !this.retireStatusChild) {
      let codesValidation = this.procedureCodesService.validate('exit');
      if (!codesValidation.result) {
        message = codesValidation.message;
        if (codesValidation.notValidated) {
          acceptVisible = false;
          rejectLabel = 'Ok';
        }
      }
    }
    this.confirmationService.confirm({
      key: 'codesTab',
      header: 'Confirmation',
      message: message,
      acceptVisible: acceptVisible,
      rejectLabel: rejectLabel,
      accept: () => {
        if(this.showELLLink) {
          this.router.navigate(['/library-search']);
        } else {
          this.cancelProvisional();
        }
      },
      reject: () => {
        if (this.isCandidateGoodIdea) {
          this.saveGoodIdeas = true;
          this.isCandidateGoodIdea = false;
        }
      }
    })
  }

  cancelProvisional() {
    if (this.header === PROVISIONAL_RULE_CREATION) {
      let provRuleId = this.ruleInfo.ruleId;
      this.ref.close(provRuleId);
      this.navigateIdeasNeedingResearch();
    }
    else {
      if (this.selectorConfig != undefined) {
        if (this.isGoodIdea) {
          this.navigateGoodIdeas();
        } else if (this.isRuleCatalogue) {
          this.navigateRuleCatalogue();
        } else if (this.isSameSim && this.selectorConfig.closeNavigateTo) {
          this.navigateSameSim(this.selectorConfig.closeNavigateTo);
        } else {
          const source = this.activatedRoute.snapshot.queryParams ? this.activatedRoute.snapshot.queryParams.source : null;
          if (source) {
            this.router.navigate([source]);
          } else {
            this.navigateHome();
          }
        }
        return;
      }
      let selectedStatusDesc = "";
      this.reviewStatus.forEach((opt: any) => {
        if (opt.value == this.selectedReviewStatus) {
          selectedStatusDesc = opt.label;
        }
      })
      this.ref.close({
        "selectedReviewStatus": this.selectedReviewStatus,
        "selectedStatusDesc": selectedStatusDesc,
        "reviewComments": this.ruleReviewComments
      });
    }
  }

  /**
   * Validation Form
   */

  validateForm() {
    let resp = true;
    if (!this.validateImpactsTab()) {
      this.indexVal = 4;
      this.isValidForSave = false;
      resp = false;
    } else if (!this.validateCategory() || !this.validateRuleLogic() || !this.validateRuleLogicEffectiveDate(this.ruleInfo.ruleLogicEffDt)) {
      this.isValidForSave = false;
      resp = false;
    } else {
      this.isValidForSave = true;
      resp = true;
    }
    return resp;
  }
  validateCategory() {
    let resp = true;
    let cat = this.ruleInfo.category.categoryId;
    if (cat === null || cat === undefined || isNaN(cat)) {
      this.Message = 'Please select a Category';
      this.saveDisplay = true;
      resp = false;
    }
    return resp;
  }

  validSelectedPo() {
    if (this.ruleInfo.assignedTo || this.ruleInfo.assignedTo !== 0) {
      if (this.tabCheck) {
        this.submitBtnDisable = false;
      } else {
        this.submitBtnDisable = true;
      }
    } else {
      this.submitBtnDisable = true;
    }
  }

  validatePolicyOwner() {
    let resp = true;
    if (this.isProvisionalRuleCreation) {
      if (!this.ruleInfo.assignedTo || this.ruleInfo.assignedTo === null) {
        this.Message = `${this.ruleInfo.ruleCode} Doesn't contain Assigned Policy Owner!`
        this.saveDisplay = true;
        resp = false;
      }
    }
    return resp;
  }

  validateRuleLogic() {
    let resp = true;
    let RLO = this.ruleInfo.ruleLogicOriginal;
    if (RLO === null || RLO === undefined || RLO === '') {
      this.Message = 'Please enter data in Rule Logic field';
      this.saveDisplay = true;
      resp = false;
    }
    return resp;
  }

  reviewCommentsMissing(): boolean {
    if (this.fromMaintenanceProcess && this.ruleImpactAnalysisRun.ruleImpactedInd === 1 && this.approvalCommentsFlag === false) {
      return (this.ruleReviewComments === undefined || this.ruleReviewComments === '' || this.ruleReviewComments === null);
    }
    if (this.wasNeedMoreInfo) {
      return (this.ruleReviewComments === undefined || this.ruleReviewComments === '');
    }
    if (this.selectedReviewStatus == Constants.SHELVED_VALUE || this.selectedReviewStatus == Constants.NEED_MORE_INFO_VALUE) {
      return (this.ruleReviewComments == "" || this.ruleReviewComments == undefined);
    }
    return false;
  }

  validateReviewStatus() {
    if (Constants.SUBMIT_ACTION !== this.action) {
      return true;
    }
    let response: boolean = true;
    if (this.fromMaintenanceProcess) {
      if (this.reviewCommentsMissing()) {
        this.Message = "A comment should be provided for status.";
        this.saveDisplay = true;
        response = false
      }
    } else if (this.ruleProvisionalReview || this.wasNeedMoreInfo) {
      if (this.reviewCommentsMissing()) {
        if (this.wasNeedMoreInfo) {
          this.Message = "For 'Need More Info' status a comment should be provided.";
        } else {
          this.Message = "For 'Shelved' or 'Need More Info' status a comment should be provided.";
        }

        this.saveDisplay = true;
        response = false
      }
    }
    if (this.reviewStatus && !this.provRuleNeedsMoreInfo) {
      let selReview = this.reviewStatus.find(rs => this.selectedReviewStatus === rs.value);
      if (this.fromMaintenanceProcess && this.ruleImpactAnalysisRun.ruleImpactedInd === 0) {
        response = true;
      } else if (!this.selectedReviewStatus || !selReview) {
        this.Message = "Please select a valid Review Status";
        this.saveDisplay = true;
        response = false;
      }
    }
    return response;
  }

  validateRuleLogicEffectiveDate(date: Date) {
    let resp = true;
    if (date !== undefined && date !== null) {
      resp = this.checkRuleEffectiveDateYear(date);

    } else {
      this.Message = 'Please enter or select a Logic Effective Date';
      this.saveDisplay = true;
      this.isValidForSave = false;
      resp = false;
    }
    return resp;
  }

  checkRuleEffectiveDateYear(date: Date) {
    let resp = true;
    if (date !== undefined && date !== null) {
      let year = date.getUTCFullYear();

      if (year < Constants.MIN_VALID_YEAR) {
        this.Message = `Date cannot be older than January 1st, ${Constants.MIN_VALID_YEAR}.`;
        this.saveDisplay = true;
        this.isValidForSave = false;
        resp = false;
      }
    }
    return resp;
  }

  setRuleInfoLobsStatesJurCat(rule) {
    let date: Date;
    if (rule.ruleLogicEffDt !== null && rule.ruleLogicEffDt !== undefined) {
      date = new Date(rule.ruleLogicEffDt);
    }
    let year: number = Constants.MIN_VALID_YEAR;
    if ((rule["category"] != null) && (rule["category"] != undefined)) {
      this.ruleInfo.category.categoryId = rule["category"].categoryId;
      this.originialAssignToCategory = this.ruleInfo.category.categoryId;
      this.reloadAssignTo();
    } else {
      this.ruleInfo.category = new Categories;
    }

    let lobs: any[] = rule["lobs"];
    this.selectedLobs = [];
    for (let lob in lobs) {
      let lobObj = lobs[lob]["lob"];
      this.selectedLobs.push(lobObj["lobId"]);
      this.selectedLobsLabels = [...this.selectedLobsLabels, lobObj.lobDesc];
    }
    this.selectedLobsLabels.sort();
    for (let i = 0; i < this.selectedLobsLabels.length; i++) {
      this.selectedLobsTooltip += this.selectedLobsLabels[i];
      this.selectedLobsTooltip += (i === this.selectedLobsLabels.length - 1) ? '' : ',\n';
    }
    let jurisdictions: any[] = rule["jurisdictions"];
    this.selectedJurisdictions = [];
    for (let jurisdiction in jurisdictions) {
      let jurisdictionObj = jurisdictions[jurisdiction]["jurisdiction"];
      this.selectedJurisdictions.push(jurisdictionObj["jurisdictionId"]);
    }
    jurisdictions.sort((a, b) => (a.jurisdiction.jurisdictionId > b.jurisdiction.jurisdictionId) ? 1 : -1);
    for (let i = 0; i < jurisdictions.length; i++) {
      this.selectedJurisdictionsTooltip += jurisdictions[i].jurisdiction.jurisdictionCode;
      this.selectedJurisdictionsTooltip += (i === jurisdictions.length - 1) ? '' : ',\n';
    }
    let states: any[] = rule["states"];
    this.selectedStates = [];
    for (let state in states) {
      let stateObj = states[state]["state"];
      this.selectedStates.push(stateObj["stateId"]);
      this.selectedStatesLabels = [...this.selectedStatesLabels, stateObj.stateDesc];
    }
    this.selectedStatesLabels.sort();
    for (let i = 0; i < this.selectedStatesLabels.length; i++) {
      this.selectedStatesTooltip += this.selectedStatesLabels[i];
      this.selectedStatesTooltip += (i === this.selectedStatesLabels.length - 1) ? '' : ',\n';
    }
    if (date !== undefined && date !== null) {
      year = date.getUTCFullYear();
    }
    if (date === null || date === undefined) {
      rule.ruleLogicEffDt = undefined;
    } else if (year < Constants.MIN_VALID_YEAR) {
      rule.ruleLogicEffDt = undefined;
    } else {
      if (rule.ruleLogicEffDt !== null && rule.ruleLogicEffDt !== undefined) {
        rule.ruleLogicEffDt = new Date(rule.ruleLogicEffDt);
      }
    }
    if (this.header === PROVISIONAL_RULE_CREATION) {
      this.checkStateJurisdiction();
    }
  }

  loadSelectedRule(): void {
    this.loading = true;
    this.provisionalRuleService.findRuleById(this.ruleId).subscribe(response => {
      let rule = response.data;
      this.ruleInfo = rule;
      this.provisionalRuleCreation = false;
      this.ruleReview = true;
      this.maintenanceOnly = true;
      this.provDialogDisable = false;
      this.submitBtnDisable = true;
      let references: any[] = rule.eclReferences;
      let statusId = this.ruleInfo.ruleStatusId;
      this.setRuleInfoLobsStatesJurCat(this.ruleInfo);
      this.checkStateJurisdiction();
      this.saveBtnDisable = !this.config.data.readWrite;
      this.getLibraryPrmNumber(this.ruleInfo.ideaId);
      
      if (this.ruleInfo.ruleLogicEffDt !== null && this.ruleInfo.ruleLogicEffDt !== undefined) {
        this.ruleInfo.ruleLogicEffDt = new Date(this.ruleInfo.ruleLogicEffDtStr);
      }
      if (!this.fromMaintenanceProcess) {
        this.ruleStatus = 'Provisional Rule';
      } else {
        if (!this.ruleInfo.ruleLogicModified) {
          this.ruleInfo.ruleLogicModified = this.ruleInfo.ruleLogicOriginal;
        }
        this.selectedReviewStatus = this.config.data.workFlowStatusId;
        this.ruleReviewComments = this.config.data.reviewComments;
      }

      if (this.ruleInfo.ruleStatusId.ruleStatusId === Constants.SHELVED_VALUE) {
        this.selectedReviewStatus = Constants.SHELVED_VALUE;//this.config.data.workFlowStatusId;
      }
      if (this.fromMaintenanceProcess && rule.parentRuleId != null) {
        let tempRuleInfo = this.tempRuleInfo();
        this.populateByExistingProvisionalRuleIdFromParent(this.ruleInfo.parentRuleId, tempRuleInfo);
        this.refreshReferences(rule.ruleId);
        if (this.readOnlyView) {
          this.provisionalReferences.getAllReferences(rule.ruleId, Constants.ECL_LIBRARY_STAGE);
          if (this.config.data.pageTitle === ptc.RM_PR_REASSIGNMENT_PAGE_TITLE
            || this.config.data.pageTitle === ptc.RM_PO_REASSIGNMENT_PAGE_TITLE) {
            this.getImpactType(rule.parentRuleId, rule.ruleId);
          } else {
            if (this.fromSameSimMod) {
              this.getImpactTypeForSameSim();
            }
          }
        } else {
          this.getImpactType(rule.parentRuleId, rule.ruleId);
        }
      } else if ((references != null) && (references != [])) {
        this.getReferences(references);
      }

      if (statusId && statusId.ruleStatusId == Constants.RULE_IMPACTED_VALUE) {
        this.markUpEnabled = true;
      }
      this.loading = false;
    });
  }

  private tempRuleInfo() {
    let tempRuleInfo = {
      reasonsForDev: this.ruleInfo.reasonsForDev,
      scriptRationale: this.ruleInfo.scriptRationale,
      clientRationale: this.ruleInfo.clientRationale,
      estOpportunity: String(this.ruleInfo.estOppurtunityVal),
      claimImpactInd: this.ruleInfo.claimImpactInd,
      claimImpactDetails: this.ruleInfo.claimImpactDetails,
      dosageImpactInd: this.ruleInfo.dosageImpactInd,
      dosageImpactDetails: this.ruleInfo.dosageImpactDetails,
      genderInd: this.ruleInfo.genderInd,
      ageLimitInd: this.ruleInfo.ageLimitInd,
      mileLimitInd: this.ruleInfo.mileLimitInd,
      dosageLimitInd: this.ruleInfo.dosageLimitInd,
      ageLimitDetails: this.ruleInfo.ageLimitDetails,
      mileLimitDetails: this.ruleInfo.mileLimitDetails,
      dosageLimitDetails: this.ruleInfo.dosageLimitDetails,
    }
    this.ruleInfo.reasonsForDev = " ";
    this.ruleInfo.scriptRationale = " ";
    this.ruleInfo.clientRationale = " ";
    this.ruleInfo.estOppurtunityVal = " ";
    this.ruleInfo.claimImpactInd = 0;
    this.ruleInfo.claimImpactDetails = " ";
    this.ruleInfo.dosageImpactInd = 0;
    this.ruleInfo.dosageImpactDetails = " ";
    this.ruleInfo.genderInd = 0;
    this.ruleInfo.ageLimitInd = 0;
    this.ruleInfo.mileLimitInd = 0;
    this.ruleInfo.dosageLimitInd = 0;
    this.ruleInfo.ageLimitDetails = " ";
    this.ruleInfo.mileLimitDetails = " ";
    this.ruleInfo.dosageLimitDetails = " ";
    return tempRuleInfo;
  }

  populateByExistingProvisionalRuleIdFromParent(parentRuleId, tempRuleInfo: any) {
    this.loading = true;
    this.provisionalRuleService.findRuleById(parentRuleId).subscribe(responseOrg => {
      let ruleOriginal = responseOrg.data;
      this.ruleInfoOriginal = ruleOriginal;
      this.ruleInfo.ruleReasonOriginal = this.ruleInfoOriginal.reasonsForDev;
      this.ruleInfo.scriptRationaleOriginal = this.ruleInfoOriginal.scriptRationale;
      this.ruleInfo.clientRationaleOriginal = this.ruleInfoOriginal.clientRationale;
      let originalVal = String(this.ruleInfoOriginal.estOppurtunityVal);
      if (originalVal !== null && originalVal !== "null") {
        this.ruleInfo.estOppurtunityValOriginal = originalVal;
      }
      this.ruleInfo.claimImpactIndOriginal = this.ruleInfoOriginal.claimImpactInd;
      this.ruleInfo.claimImpactDetailsOriginal = this.ruleInfoOriginal.claimImpactDetails;
      this.ruleInfo.dosageImpactIndOriginal = this.ruleInfoOriginal.dosageImpactInd;
      this.ruleInfo.dosageImpactDetailsOriginal = this.ruleInfoOriginal.dosageImpactDetails;
      this.ruleInfo.genderIndOriginal = this.ruleInfoOriginal.genderInd;
      this.ruleInfo.ageLimitIndOriginal = this.ruleInfoOriginal.ageLimitInd;
      this.ruleInfo.mileLimitIndOriginal = this.ruleInfoOriginal.mileLimitInd;
      this.ruleInfo.dosageLimitIndOriginal = this.ruleInfoOriginal.dosageLimitInd;
      this.ruleInfo.ageLimitDetailsOriginal = this.ruleInfoOriginal.ageLimitDetails;
      this.ruleInfo.mileLimitDetailsOriginal = this.ruleInfoOriginal.mileLimitDetails;
      this.ruleInfo.dosageLimitDetailsOriginal = this.ruleInfoOriginal.dosageLimitDetails;
      this.ruleInfo.reasonsForDev = tempRuleInfo.reasonsForDev;
      this.ruleInfo.scriptRationale = tempRuleInfo.scriptRationale;
      this.ruleInfo.clientRationale = tempRuleInfo.clientRationale;
      if (tempRuleInfo.estOpportunity !== null && tempRuleInfo.estOpportunity !== "null") {
        this.ruleInfo.estOppurtunityVal = tempRuleInfo.estOpportunity;
      }
      this.ruleInfo.claimImpactInd = tempRuleInfo.claimImpactInd;
      this.ruleInfo.claimImpactDetails = tempRuleInfo.claimImpactDetails;
      this.ruleInfo.dosageImpactInd = tempRuleInfo.dosageImpactInd;
      this.ruleInfo.dosageImpactDetails = tempRuleInfo.dosageImpactDetails;
      this.ruleInfo.genderInd = tempRuleInfo.genderInd;
      this.ruleInfo.ageLimitInd = tempRuleInfo.ageLimitInd;
      this.ruleInfo.mileLimitInd = tempRuleInfo.mileLimitInd;
      this.ruleInfo.dosageLimitInd = tempRuleInfo.dosageLimitInd;
      this.ruleInfo.ageLimitDetails = tempRuleInfo.ageLimitDetails;
      this.ruleInfo.mileLimitDetails = tempRuleInfo.mileLimitDetails;
      this.ruleInfo.dosageLimitDetails = tempRuleInfo.dosageLimitDetails;

      if (this.fromSameSimMod && this.ruleInfoOriginal.activeWorkflow &&
        this.ruleInfoOriginal.activeWorkflow.workflowStatus) {
        this.selectedReviewStatus = this.ruleInfoOriginal.activeWorkflow.workflowStatus.lookupCode;
        this.ruleReviewComments = this.ruleInfoOriginal.activeWorkflow.reviewComments;
      }


    });

    this.loading = false;
  }

  validateChangeInfoFromDb(ruleReferencesArray: any[]) {
    let response = true;

    if (ruleReferencesArray != undefined && ruleReferencesArray != null) {
      ruleReferencesArray.forEach(ruleRef => {
        if (ruleRef.changeDetailsDisplayFlag === true && ruleRef.changedStatus === null) {
          response = false;
          return response;
        }
      });
    }
    return response;
  }

  setRetireStatusValue(retireStatus: boolean) {
    this.retireStatusChild = retireStatus;
  }
  populateApprovalDropdownValues() {
    if (this.config.data.pageTitle === LIST_OF_RULES_FOR_IMPACT_ANALYSIS || this.isSameSim) {
      this.logicalCodesFlag = true;
      if (this.ruleImpactAnalysisRun.ruleImpactTypeId != null && this.eclConstants.RULE_IMPACT_TYPE_EDITORIAL === this.ruleImpactAnalysisRun.ruleImpactTypeId) {
        this.reviewStatus.forEach(itemLookup => {
          if (itemLookup.label == Constants.LOGICAL_SUBMIT_APPROVAL || itemLookup.label == Constants.RETIRE_SUBMIT_APPROVAL) {
            itemLookup["disabled"] = true;
          } else {
            itemLookup["disabled"] = false;
          }
        });
      } else if (this.ruleImpactAnalysisRun.ruleImpactTypeId != null && this.eclConstants.RULE_IMPACT_TYPE_LOGICAL === this.ruleImpactAnalysisRun.ruleImpactTypeId) {
        this.logicalCodesFlag = false;
        this.reviewStatus.forEach(itemLookup => {
          if (itemLookup.label == Constants.EDITORIAL_APPROVED || itemLookup.label == Constants.EDITORIAL_SUBMIT_APPROVAL || itemLookup.label == Constants.RETIRE_SUBMIT_APPROVAL) {
            itemLookup["disabled"] = true;
          } else {
            itemLookup["disabled"] = false;
          }
        });
      } else if (this.retireStatusChild) {
        this.reviewStatus.forEach(itemLookup => {
          if (itemLookup.label == Constants.EDITORIAL_APPROVED || itemLookup.label == Constants.EDITORIAL_SUBMIT_APPROVAL || itemLookup.label == Constants.LOGICAL_SUBMIT_APPROVAL) {
            itemLookup["disabled"] = true;
          } else {
            itemLookup["disabled"] = false;
          }
        });
      }
    }
    if (this.fromMaintenanceProcess && this.retireStatusChild) {
      this.provDialogDisable = true;
      this.disableTopFields = false;
    }
    if (this.fromSameSimMod) {
      this.selectedReviewStatus = null;
    }
  }

  retireRuleTabStatus() {
    if (this.fromMaintenanceProcess && !this.retireStatusChild) {
      this.provDialogDisable = false;
    }
  }

  setDefaultValueForImpactTypeChange() {
    let title = this.config.data.pageTitle;
    if (this.titleCheck(title)) {
      this.selectedReviewStatus = Constants.DEFAULT_STATUS_LIST_OF_RULES_FOR_IMPACT_ANALYSIS;
    } else if (this.fromSameSimMod) {
      // In case of SameSim, if this is CCA screen, set to EIAI status.
      let appEdOp = this.reviewStatus.map(rs => rs.label).filter(s => s === Constants.EDITORIAL_APPROVED);
      if (appEdOp && appEdOp.length > 0) {
        // This is CCA screen:
        this.selectedReviewStatus = Constants.INDUSTRY_UPDATE_ANALYSIS_INITIATED;
      }
    }
  }
  titleCheck(title: string): boolean {
    return (title === LIST_OF_RULES_FOR_IMPACT_ANALYSIS || title === ptc.POLICY_OWNER_APPROVAL_TITLE || title === ptc.PEER_REVIEWER_APPROVAL_TITLE)
  }
  validateRuleImpactIndicator(ruleImpactAnalysisRun: RuleImpactAnalysisRun): boolean {
    let response = false;
    if (this.ruleImpactAnalysisRun.ruleImpactedInd !== null &&
      (this.ruleImpactAnalysisRun.ruleImpactedInd === 0 ||
        (this.ruleImpactAnalysisRun.ruleImpactedInd === 1 && this.ruleImpactAnalysisRun.ruleImpactTypeId !== null &&
          this.ruleImpactAnalysisRun.ruleImpactAnalysis !== null && this.ruleImpactAnalysisRun.ruleImpactAnalysis.length > 0))) {
      response = true;
    }

    return response;
  }

  validateRuleChangeLogic(ruleImpactAnalysisRun: RuleImpactAnalysisRun) {
    if (this.fromMaintenanceProcess === true) {
      // For sameSim process, References are not changed
      if ((this.validateRuleImpactIndicator(ruleImpactAnalysisRun) && (!this.isSameSim ||
        this.validateChangeInfoFromDb(this.provisionalReferences.ruleReferencesArray)))) {
        this.disableTopFields = false;
        this.provDialogDisable = false;
        this.resetApprovalValues();
      } else {
        this.provDialogDisable = true;
      }
    }

  }

  resetApprovalValues() {
    if (this.ruleImpactAnalysisRun &&
      this.ruleImpactAnalysisRun.ruleImpactedInd === 0 && this.retireStatusChild === false) {
      this.impactTypeNo = true;
      this.selectedReviewStatus = "";
      this.ruleReviewComments = "";
    }
  }

  enableApprovalDetails() {
    if (this.disableTopFields === false && this.ruleImpactAnalysisRun.ruleImpactedInd === 1) {
      this.impactTypeNo = false;
    }
  }

  getImpactTypeForSameSim() {
    this.ruleService.getRuleImpactAnalysis(this.ruleInfo.parentRuleId, Constants.SAMESIM_FLOW)
      .subscribe(obj => {
        if (obj.data) {
          this.ruleImpactAnalysisRun = obj.data;
          this.validateRuleChangeLogic(this.ruleImpactAnalysisRun);
          this.populateApprovalDropdownValues();
          this.resetApprovalValues();
        }
      })
  }

  getImpactType(parentRuleId: number, currentRuleId: number): void {
    this.ruleService.getRuleImpactAnalysisRun(parentRuleId).subscribe(obj => {
      let impactAnalysisrun = obj.data;
      this.ruleImpactAnalysisRun = impactAnalysisrun;
      this.provisionalReferences.getAllReferences(currentRuleId, Constants.ECL_LIBRARY_STAGE).then(
        () => this.validateRuleChangeLogic(this.ruleImpactAnalysisRun));
      this.populateApprovalDropdownValues();
      if (this.config.data.pageTitle === LIST_OF_RULES_FOR_IMPACT_ANALYSIS) {
        this.selectedReviewStatus = this.config.data.workFlowStatusId;
      }
      this.resetApprovalValues();
    });
  }

  clearData(): void {
    this.loadSelectedRule();
  }

  // temp ICMS-link
  showIcmsTemplate(rowInfo) {
    if (this.selectorConfig.templateActivate) {
      this.dialogService.open(IcmsTemplateComponent, {
        data: {
          prm: this.libraryPrmNumber,
          lobs: this.selectedLobs,
          rule: rowInfo
        },
        header: 'ICMS Rule Adoption Template',
        width: '70%',
        contentStyle: { "max-height": "80%" }
      });
    }
  }

  showIcmsTemplateChange(ruleInfo): void {
    if (this.selectorConfig.templateActivate) {
      this.dialogService.open(IcmsTemplateChangeComponent, {
        data: { ruleInfo, subVersion: this.applications.icms[0].subRule, deltas: this.deltas, prm: this.libraryPrmNumber }, // this.applications.icms[0].subRule
        header: Constants.ICMS_RMR_CHANGE_TITLE
      });
    }
  }

  /**
   * It fires when we click on upload button and send the file to the service.
   * @param file to be uploaded to the rest api service.
   */
  onFileUpload(file) {
    let ruleId = this.ruleInfo.ruleId;
    this.provisionalRuleService.uploadFile(file, this.cvpTemplate, ruleId).subscribe(
      (res) => {
        if (res && res.data) {
          if (res.code === 200) {
            this.messageService.add({ severity: 'success', summary: 'CVP Templete', detail: res.message });

            this.cvpTemplate = res.data.cvpNotifiedRuleId;
          }
        }
        this.provisionalRuleService.clearFileUploadSelection(this.uploadControl);
      });
  }
  showIconsForCVP() {
    if (!this.showIcon)
      this.showIcon = true;
    else
      this.showIcon = false;

  }
  showIconsForRPE() {
    if (!this.showRpeIcon)
      this.showRpeIcon = true;
    else
      this.showRpeIcon = false;
  }
  /**
   * It fires when we click on upload button and send the file to the service.
   * @param file to be uploaded to the rest api service.
   */
  rpeFileUpload(file) {
    let ruleId = this.ruleInfo.ruleId;
    this.provisionalRuleService.rpeUploadFile(file, this.rpeTemplate, ruleId).subscribe(
      (res) => {
        if (res && res.data) {
          if (res.code === 200) {
            this.messageService.add({ severity: 'success', summary: 'CPE Templete', detail: res.message });

            this.rpeTemplate = res.data.rpeNotifiedRuleId;
          }
        }
        this.provisionalRuleService.clearFileUploadSelection(this.rpeUploadControl);
      });
  }

  showLatestVersionMsg() {
    this.latestVersionMeg = "";
    this.ruleService.getRuleLatestVersion(this.ruleId).subscribe(response => {
      if (response.data != "" && response.data != this.ruleInfo.ruleCode) {
        this.latestVersionMeg = "The latest version of this rule is " + response.data;
        return true;
      }
      else
        return false;
    })
  }
  // a controller function which actually downloads the file
  downloadFileData(data, fileName) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    //a.style = "display: none";
    let blob = new Blob([data], { type: "application/msword" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // a controller function to be called on requesting a download for cvp
  downloadCvpFiles() {
    this.provisionalRuleService.downloadCvpFiles().subscribe(data => this.downloadFileData(data, "cvpTemplate.doc"), error => console.log("Error downloading the file."),
      () => console.info("OK"));
  }

  // a controller function to be called on requesting a download based on rule id
  downloadCvpFilesById() {
    this.provisionalRuleService.downloadCvpFilesById(this.ruleId).subscribe(data => this.downloadFileData(data, "cvpTemplate.doc"), error => console.log("Error downloading the file."),
      () => console.info("OK"));
  }
  // a controller function to be called on requesting a download for rpe
  downloadRpeFiles() {
    this.provisionalRuleService.downloadRpeFiles().subscribe(data => this.downloadFileData(data, "cpeTemplate.doc"), error => console.log("Error downloading the file."),
      () => console.info("OK"));
  }

  // a controller function to be called on requesting a download based on rule id
  downloadRpeFilesById() {
    this.provisionalRuleService.downloadRpeFilesById(this.ruleId).subscribe(data => this.downloadFileData(data, "cpeTemplate.doc"), error => console.log("Error downloading the file."),
      () => console.info("OK"));
  }


  addRule() {
    this.getNewProvisionalRuleId();
    this.provisionalReferences.clearScreenReference();
    this.getAllReferences(this.ruleInfo.ideaId, Constants.ECL_IDEA_STAGE);
    this.addButtonDisable = true;
    this.resetTabChange();
  }

  ///resetProcedureCodesId() {
  //   this.ruleCodes.ruleProcedureCodes.forEach(pc => pc.ruleProcedureCodeId = null);
  // }

  getAllReferences(ruleId: number, stage: any) {
    this.eclReferenceService.getAllEclReferences(ruleId, stage).subscribe((response: any) => {
      if (response !== null) {
        if (response.data != null) {
          let eclReferenceArray = response.data;
          this.ruleReferencesArray =
            eclReferenceArray.map(ele => {
              return {
                "source": ele.refInfo.refSource.sourceDesc,
                "name": ele.refInfo.referenceName,
                "title": ele.refInfo.referenceTitle,
                "refId": ele.refInfo.referenceId,
                "refSourceId": ele.refInfo.refSource.refSourceId,
                "eclReferenceId": ele.eclReferenceId
              };
            });
          this.ruleReferencesArray = [...this.ruleReferencesArray];
        }
      }
    });
  }

  onRowSelect(event) {
    if (this.deleteDisplay === false) {
      //if there is only one new row, then do nothing
      if (this.filteredRules.length > 1) {
        this.Message = 'You will lose data if switching row selection without saving.'
        this.selectDisplay = true;
      }
    }
  }

  deleteRule(rule) {
    //Call service delete(rule.ruleCode)
    this.provisionalRuleId = rule.ruleId;
    this.lastRuleId = this.filteredRules[this.filteredRules.length - 1].ruleId;
    if (this.addButtonDisable && this.filteredRules.length < 2) {
      return;
    } else {
      this.Message = 'Are you sure you want to delete this Provisional Rule?'
      this.deleteDisplay = true;
    }

  }

  deleteDialogYes() {
    this.procedureCodesService.removeRuleInfoData(this.ruleInfo.ruleId);
    if (this.addButtonDisable && this.lastRuleId === this.provisionalRuleId) {
      this.filteredRules.pop();
      this.filteredRules = [...this.filteredRules];
      this.deleteDisplay = false;
      this.addButtonDisable = false;
      this.provisionalRuleId = this.filteredRules[this.filteredRules.length - 1].ruleId;
      this.selectedRule = this.filteredRules[this.filteredRules.length - 1];
      this.populateByExistingProvisionalRuleId();
      this.resetTabChange();
    } else {
      this.deleteDisplay = false;
      this.ideaService.deleteProvisionalRule(this.provisionalRuleId).subscribe((resp: any) => {

      }, error => console.log('error = ' + error),
        () => this.getExistingProvisionalRulesByIdeaId()
      );
    }
  }

  deleteDialogNo() {
    this.deleteDisplay = false;
    this.selectedRule = this.filteredRules[this.filteredRules.length - 1];
  }

  getNewProvisionalRuleId() {
    //Call service to get new ECL-#
    this.ideaService.getNextProvisionalRuleId().subscribe(resp => {
      this.ruleInfo.ruleCode = resp.data;
      this.ruleInfo.ruleId = +this.ruleInfo.ruleCode.substring(4);
      this.ruleInfo.ruleCode = 'ECL-' + this.ruleInfo.ruleId;
      this.filteredRules = [...this.filteredRules, { ruleCode: this.ruleInfo.ruleCode, name: this.ruleInfo.ruleName, ruleId: this.ruleInfo.ruleId }];
      this.procedureCodesService.setActiveRuleInfo(this.ruleInfo);
    }, error => console.log('error = ' + error),
      () => {
        this.selectedRule = this.filteredRules[this.filteredRules.length - 1];
        this.provisionalRuleDto.newProvRule = true;
      }
    );

  }

  populateByExistingProvisionalRuleId() {
    this.loading = true;
    this.provisionalRuleService.findRuleById(this.provisionalRuleId).subscribe(response => {
      let rule = response.data;
      this.ruleInfo = rule;
      this.ruleInfo.assignedTo = this.selectedPO;
      this.getLibraryPrmNumber(rule.ideaId);
      this.ruleStatus = 'Provisional Rule';
      if (this.ruleInfo.ruleLogicEffDt !== null && this.ruleInfo.ruleLogicEffDt !== undefined) {
        this.ruleInfo.ruleLogicEffDt = new Date(this.ruleInfo.ruleLogicEffDtStr);
      }

      this.provDialogDisable = false;
      this.provisionalReferences.getAllReferences(this.ruleInfo.ruleId, this.ruleStage);
      this.setRuleInfoLobsStatesJurCat(this.ruleInfo);
      this.checkStateJurisdiction();
      if (this.ruleInfo.activeWorkflow) {
        this.wasNeedMoreInfo = (this.ruleInfo.activeWorkflow.workflowStatusId === NEED_MORE_INFO);
        this.ruleReviewComments = this.ruleInfo.activeWorkflow.reviewComments;
      }
      // this flag set to the false parameter since it is
      // already a provisional rule(if it is a new provisional rule which is not saved this flag willbe true)
      this.provisionalRuleDto.newProvRule = false;

      this.loading = false;
    });
  }

  getExistingProvisionalRulesByIdeaId() {
    //Call service to get existing Provisional Rules associated with an IdeaId
    this.loading = true;
    this.ideaService.getExistProvisionalRulesByIdeaId(this.ruleId).subscribe((resp: BaseResponse) => {
      if (resp.data.length > 0) {
        this.filteredRules = resp.data.map(rule => {
          let setId: number;
          if (!rule.assignedTo) {
            setId = null;
          } else {
            setId = rule.assignedTo.userId;
          }
          return { ruleCode: rule.ruleCode, name: rule.ruleName, ruleId: rule.ruleId, assignedTo: setId };
        });
        this.procedureCodesService.registerRules(resp.data);
        this.filteredRules.sort((a, b) => (a.ruleCode > b.ruleCode) ? 1 : -1);
        this.provisionalRuleId = this.filteredRules[this.filteredRules.length - 1].ruleId;
        this.selectedRule = this.filteredRules[this.filteredRules.length - 1];
        this.previousSelectedRule = this.filteredRules[this.filteredRules.length - 1];
        this.selectedPO = this.filteredRules[this.filteredRules.length - 1].assignedTo;
        this.clearScreenData();
        //setting the stage to provisional to fetch and save all the references at the provisional stage
        this.provisionalReferences.ruleStage = Constants.ECL_PROVISIONAL_STAGE;
        this.ruleStage = Constants.ECL_PROVISIONAL_STAGE;
        this.populateByExistingProvisionalRuleId();
        this.settingNewProvisionalDto(resp).then((prov: any) => {
          if (prov !== null || prov !== undefined) {
            this.provisionalRuleDtos = prov;
          }
          this.setRuleRevenueCodesList();
          this.setProcedureCodesList();
        });
        // call to set the rulerevenue codes list in provisionalruledto
      } else {
        this.filteredRules = [];
        this.ruleInfo = new RuleInfo();
        this.clearScreenData();
      }

      this.loading = false;
    });
  }

  private settingNewProvisionalDto(resp: BaseResponse) {
    return Promise.all(resp.data.map((ele) => {
      let ruleInfo = ele;
      let user = this.userId;
      let assignedId: number;
      !ele.assignedTo ? assignedId = null : assignedId = ruleInfo.assignedTo.userId;
      if (ele.ruleLogicEffDt !== null && ele.ruleLogicEffDt !== undefined) {
        ruleInfo.ruleLogicEffDt = new Date(ele.ruleLogicEffDt);
      }
      this.sqldateConvert.JSDateToSQLDate(ruleInfo.ruleLogicEffDt);
      let excludedClaimServices: any[] = [];
      let includedClaimServices: any[] = [];
      let excludedBillClaims: any[] = [];
      let includedBillClaims: any[] = [];
      let excludedSpecialityTypes: any[] = [];
      let includedSpecialityTypes: any[] = [];
      let excludedSubspecialityTypes: any[] = [];
      let includedSubspecialityTypes: any[] = [];
      let selectedReviewStatus = '';
      let opportunityValue: OpportunityValueDto = new OpportunityValueDto();
      let ruleRevenueCodesList: any[] = [];
      let procedureCodeDto: ProcedureCodeDto = new ProcedureCodeDto();

      return new Promise((resolve, reject) => {
        forkJoin(
          this.provisionalRuleService.findClaimPlacesOfServiceById(ruleInfo.ruleId),
          this.provisionalRuleService.findSpecialityTypesById(ruleInfo.ruleId),
          this.provisionalRuleService.findSubspecialityTypesById(ruleInfo.ruleId),
          this.ruleService.getOppValues(ruleInfo.ruleId).pipe(tap((innerResp) => { opportunityValue = innerResp.data || new OpportunityValueDto() }))
        ).subscribe(([claim, specialty, subSpecialty]) => {
          if (claim && claim.data) {
            claim.data.forEach(element => {
              if (element != null) {
                if (element.claimSubtypeIdVal === 27) {
                  if (element.inclusionStatus === 0) {
                    excludedClaimServices.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
                  } else {
                    includedClaimServices.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
                  }
                }
                else if (element.claimSubtypeIdVal === 28) {
                  if (element.inclusionStatus === 0) {
                    excludedBillClaims.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
                  } else {
                    includedBillClaims.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
                  }
                }
              }
            });
          }
          if (specialty && specialty.data) {
            specialty.data.forEach(element => {
              if (element != null) {
                if (element.inclusionStatus === 0) {
                  excludedSpecialityTypes.push({ "label": element.specialityTypeDesc, "value": element.specialityTypeCode });
                } else {
                  includedSpecialityTypes.push({ "label": element.specialityTypeDesc, "value": element.specialityTypeCode });
                }
              }
            });
          }
          if (subSpecialty && subSpecialty.data) {
            subSpecialty.data.forEach(element => {
              if (element != null) {
                if (element.inclusionStatus === 0) {
                  excludedSubspecialityTypes.push({ "label": element.subspecialityTypeDesc, "value": element.subspecialityTypeCode, 'type': element.subspecialityTypeType });
                } else {
                  includedSubspecialityTypes.push({ "label": element.subspecialityTypeDesc, "value": element.subspecialityTypeCode, 'type': element.subspecialityTypeType });
                }
              }
            });
          }
          let provDto = {
            action: 'submit',
            assignedTo: assignedId,
            user: user,
            ruleInfo: ruleInfo,
            lobs: ele.lobs.map(el => el.lob.lobId),
            states: ele.states.map(el => el.state.stateId),
            jurisdictions: ele.jurisdictions.map(el => el.jurisdiction.jurisdictionId),
            procedureCodes: ele.procedureCodes,
            includedSpecialityTypes: includedSpecialityTypes,
            excludedSpecialityTypes: excludedSpecialityTypes,
            includedSubspecialityTypes: includedSubspecialityTypes,
            excludedSubspecialityTypes: excludedSubspecialityTypes,
            includedClaims: includedClaimServices,
            excludedClaims: excludedClaimServices,
            includedBills: includedBillClaims,
            excludedBills: excludedBillClaims,
            selectedReviewStatus: selectedReviewStatus,
            oppValueDto: opportunityValue,
            newProvRule: false,
            procedureCodeDto: procedureCodeDto,
            ruleRevenueCodesList: ruleRevenueCodesList
          };
          resolve(provDto);
        });
      });
    }));
  }

  setProcedureCodesList() {
    if (this.provisionalRuleDtos.length > 0) {
      this.provisionalRuleDtos.forEach(provRuleDto => {
        this.ruleService.getAllRuleProcedureCodes(provRuleDto.ruleInfo.ruleId).subscribe(response => {
          if (response !== null && response !== undefined) {
            provRuleDto.procedureCodeDto = response.data || new ProcedureCodeDto();
          }
        });
      });
    }

  }


  /* Method to set the RuleRevenueCodesList in provisionalRuleDtoList */
  setRuleRevenueCodesList() {
    if (this.provisionalRuleDtos.length > 0) {
      this.provisionalRuleDtos.forEach(provRuleDto => {
        let ruleRevenueCodesList: any[] = [];
        this.claimsService.getAllRuleRevenueCodes(provRuleDto.ruleInfo.ruleId).subscribe((response: any) => {
          if (response !== null && response !== undefined) {
            if (response.data !== null) {
              ruleRevenueCodesList = response.data;
              provRuleDto.ruleRevenueCodesList = ruleRevenueCodesList;
            }
          }
        });
      });
    }
  }

  getLibraryPrmNumber(ideaId: number) {
    this.ideaService.getIdeaInfo(ideaId).subscribe((resp: any) => {
      this.libraryPrmNumber = resp.data.libraryPrmNumber;
    });

  }

  selectDisplayYes() {
    if (this.addButtonDisable) {
      this.filteredRules.pop();
      this.filteredRules = [...this.filteredRules];
      this.selectDisplay = false;
      this.addButtonDisable = false;
    } else {
      this.previousSelectedRule = this.selectedRule;
      this.selectedPO = this.selectedRule.assignedTo;
      this.selectDisplay = false;
    }

    this.provisionalRuleId = this.selectedRule.ruleId;
    this.clearScreenData();
    this.populateByExistingProvisionalRuleId();
    // to reset the tabchange event and disable the submit button on change of row selection.
    this.resetTabChange();
    //reset References tab inputs to blank and reset buttons
    this.reference = { ...this.reference };
    this.eclRef = { ...this.eclRef };
    this.selectedReference = { ...this.selectedReference };
    this.isReferenceDisableObject = { ...this.isReferenceDisableObject };
    this.isRemovableObject = { ...this.isRemovableObject };
    this.isSavableObject = { ...this.isSavableObject };
    this.isAddingObject = { ...this.isAddingObject };
    this.provisionalReferences.resetReferenceSource();
  }

  selectDisplayNo() {
    this.selectDisplay = false;
    if (this.addButtonDisable) {
      this.selectedRule = this.filteredRules[this.filteredRules.length - 1];
    } else {
      this.selectedRule = this.previousSelectedRule;
    }
  }

  /* method to reset the tab change parameters to original values */

  resetTabChange() {
    this.submitBtnDisable = true;
    this.claimsClicked = false;
    this.providersClicked = false;
    this.codesClicked = false;
    this.impactsClicked = false;
    this.referencesClicked = false;
  }

  clearScreenData() {

    this.selectedLobs = [];
    this.selectedStates = [];
    this.selectedJurisdictions = [];
    this.selectedReferences = [];

    this.includedClaimServices = [];
    this.excludedClaimServices = [];
    this.includedBillClaims = [];
    this.excludedBillClaims = [];

    this.includedSpecialityTypes = [];
    this.excludedSpecialityTypes = [];

    this.includedSubspecialityTypes = [];
    this.excludedSubspecialityTypes = [];
    this.ruleRevenueCodesList = [];
  }

  onProvisionalRuleRefresh(event) {
    this.refreshReferences(+event);
  }

  onRuleApplicationsLoad(applications) {
    this.showChangeRmr = applications.icms.length > 0;
    this.applications = applications;
  }
  /**
   * Continue to execute action.
   * @param action Action.
   */
  continueAction(action: string) {
    if (action === Constants.SUBMIT_ACTION) {
      this.submitProvisionalRules();
    } else if (action === Constants.SAVE_ACTION) {
      this.saveProvisional();
    }
  }
  /**
   * Response to check if an action (save or submit) can continue.
   * This is to allow some child components to do extra validations / actions.
   * @param contRes Check verification response.
   */
  canContinueAction(contRes: any) {
    if (contRes) {
      if (contRes.result) {
        this.continueAction(contRes.action);
      } else {
        let acceptVisible = true;
        let rejectLabel = Constants.NO;
        if (contRes.notValidated) {
          acceptVisible = false;
          rejectLabel = 'Ok';
        }

        this.confirmationService.confirm({
          key: 'codesTab',
          header: 'Confirmation',
          message: contRes.message,
          acceptVisible: acceptVisible,
          rejectLabel: rejectLabel,
          accept: () => {
            this.continueAction(contRes.action);
          }
        })
      }
    }
  }

  /**
   * Check some child components if it is ok to continue some action
   * (this is to give child elements to do extra actions / validations)
   * @param action detail of requestd action.
   */
  checkToContinueAction(action: string) {
    this.action = action;
    if (action === Constants.SUBMIT_ACTION) {
      let ret = this.procedureCodesService.validate(action);
      this.canContinueAction(ret);
    } else if (action === Constants.SAVE_ACTION) {
      this.saveProvisional();
    }
  }

  goodIdeasEvent(status: string): void {
    if (status === RESPONSE_SUCCESS) {
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Good Ideas Saved Successfully', 3000, true);
    }
    this.submitProvisional()
    this.saveGoodIdeas = false;
    this.readOnlyView = false;
  }

  fillselectedShelved(): void {
    this.selectedShelved = [];
    this.selectedShelved.push(
      {
        ruleId: this.ruleInfo.ruleId,
        code: this.ruleInfo.ruleCode,
        name: this.ruleInfo.ruleName,
        category: this.ruleInfo.category.categoryDesc,
        daysold: this.ruleInfo.daysOld,
        creator: this.ruleInfo.createdBy.firstName,
        reviewComment: this.ruleReviewComments,
        goodIdeaDt: undefined
      }
    );
  }

  /**
   * Return if audit log tab should be displayed to user
   */
  enableAuditLogTab() {
    return this.ruleInfo.ruleId != undefined &&
      this.ruleInfo.ruleStatusId != undefined &&
      this.ruleInfo.ruleStatusId.ruleStatusId == Constants.LIBRARY_RULE_VALUE &&
      this.ruleInfo.parentRuleId != this.ruleInfo.ideaId;
  }

  /**
   * MessageRecieve - will recieve messages from childs to trigger service.
   * @param e - Object that contains require value to trigger event.
   */
  messageRecieve(e: MessageSend) {
    if (e.type = 'warn') {
      this.toastService.messageWarning(e.summary, e.detail, e.time, false);
    }
  }
}
