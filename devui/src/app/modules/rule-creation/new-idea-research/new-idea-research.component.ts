import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService, ConfirmationService, MessageService } from 'primeng/api';
import { ReturnDialogComponent } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.component';
import { IdeaService } from 'src/app/services/idea.service';
import { NewIdeaService } from 'src/app/services/new-idea.service';
import { StorageService } from 'src/app/services/storage.service';
import { NewIdeaResearchDuplicateCheckComponent } from './components/nir-duplicate-chk/nir-duplicate-chk.component';
import { NirSearchFormComponent } from './components/nir-search-form.component/nir-search-form.component';
import { NirReferenceDetailComponent } from './components/nir-reference-detail/nir-reference-detail.component';
import { IdeaInfo2 } from 'src/app/shared/models/idea-info';
import { NewIdeaResearchDto } from 'src/app/shared/models/dto/new-idea-research-dto';
import { UtilsService } from 'src/app/services/utils.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin } from 'rxjs';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { Users } from 'src/app/shared/models/users';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { Constants } from 'src/app/shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';


const EXISTING_IDEA = Constants.EXISTING_IDEA;
const INVALID_IDEA = Constants.INVALID_IDEA;
const MEDICARE = Constants.MEDICARE;
const MEDICAID = Constants.MEDICAID;
const ACTIVE_STATUS = 1;
const IDEA_RESEARCH_TAB_ASSIGNED = 'ASSIGNED';
const IDEA_RESEARCH_TAB_RETURNED = 'RETURNED';

@Component({
  selector: 'newIdeaResearch-Root',
  templateUrl: './new-idea-research.component.html',
  styleUrls: ['./new-idea-research.component.css']
})

export class NewIdeaResearchComponent implements OnInit, AfterViewInit {

  @ViewChild(NewIdeaResearchDuplicateCheckComponent) dup;
  @ViewChild(NirSearchFormComponent) search;
  @ViewChild(NirReferenceDetailComponent) refDetail;

  @Input() ideaIdInp: number;
  @Input() readOnlyView: boolean;

  ideaId: number;
  ruleId: number;
  ideaInfo: IdeaInfo2;
  ideaDto: NewIdeaResearchDto;
  userId: number;
  user: Users;
  referenceSourcesArray: any[] = [];

  /** INDEX NUMBER
   *  0 = Duplicate Check
   *  1 = Reference Detail
   */
  index: number = 0;
  provisionalRuleId: number = 0;
  initialDupValue: number;
  initialIdeaValue: number;
  dupCheck: boolean = false;
  ideaCheck: boolean = false;

  // All Booleans
  refresh: boolean = false;
  clear: boolean = true;
  provisionalBtnDisable: boolean = true;
  submitDisabled: boolean = true;
  saveDisabled: boolean = false;
  saveDisplay: boolean = false;
  submitState: boolean = false;
  returnDisabled: boolean = false;
  ruleCreationStatus: boolean;              // @True: idea level @False: provisional rule
  isIdeaReseachAssigned: boolean = false;
  isIdeaReseachReturned: boolean = false;
  isGoodIdea: boolean = false;
  clearDisabled: boolean = true;
  refreshDisabled: boolean = true;

  constructor(private router: Router, private dialogService: DialogService, private ideaService: IdeaService,
    private newIdeaservice: NewIdeaService, private storage: StorageService, private utils: UtilsService,
    public route: ActivatedRoute, private app: AppUtils, private userService: UsersService,
    private confirmationService: ConfirmationService, private ruleService: RuleInfoService,
    private messageService: MessageService, private toast: ToastMessageService) {
    this.ideaInfo = new IdeaInfo2();
    this.ideaDto = new NewIdeaResearchDto();
    this.isIdeaReseachAssigned = this.storage.get('PARENT_NAVIGATION', false) == 'IDEAS_RESEARCH_ASSIGNED';
    this.isIdeaReseachReturned = this.storage.get('PARENT_NAVIGATION', false) == 'IDEAS_RESEARCH_RETURNED';
    this.isGoodIdea = this.storage.get('PARENT_NAVIGATION', false) == 'GOOD_IDEAS';
  }

  ngOnInit() {
    this.returnDisabled = true;
    this.submitDisabled = true;
    this.saveDisabled = true;
    this.refreshDisabled = true;
    this.clearDisabled = true;
    this.provisionalBtnDisable = true;
    if (this.readOnlyView === undefined) {
      this.readOnlyView = false;
    }
    this.route.data.subscribe(params => {
      this.userId = this.app.getLoggedUserId()
    });
    if (this.ideaIdInp > 0) {
      this.ideaId = this.ideaIdInp;
      this.ruleCreationStatus = true;
    }
    this.readOnlyView === true ? this.search.readOnlyViewLob() : this.startIdeaWorkflow(this.ideaIdInp);
    this.checkInputIdeaId();
  }

  ngAfterViewInit() {
    this.retrieveSavedIdeaDetails(this.ideaId);
  }

  /**
   * Function to retrieve and update IdeaInfo
   */
  retrieveSavedIdeaDetails(ideaId: number) {
    this.ideaService.getIdeaInfo(ideaId).subscribe((item: any) => {
      this.ideaInfo = item.data;
      this.dup.selectedDupStatus = this.ideaInfo.dupCheckStatus;
      this.initialDupValue = this.ideaInfo.dupCheckStatus;
      this.dup.inputDupCmt = this.ideaInfo.dupCheckComments;
      this.dup.selectedIdeaStatus = this.ideaInfo.validCheckStatus;
      this.initialIdeaValue = this.ideaInfo.validCheckStatus;
      this.dup.inputIdeaStatusCmt = this.ideaInfo.validCheckComments;
      this.refDetail.refreshReference();
      this.setIdeaInfoLobsStatesJurCat(this.ideaInfo);
      this.dup.updateDupStatus();
      this.dup.updateIdeaStatus();
      //TODO: Have to add condition to see if Ref Details page has been saved
      this.provAndSubmitBtnState(this.ideaInfo);
    })
  }
  /**
   * Check if ideaId value was provided during creation. If this is the case
   * adjust screen values according to saved idea.
   */
  checkInputIdeaId() {
    if (this.ideaIdInp > 0) {
      this.ideaId = this.ideaIdInp;
      let ruleCode: string;
      // Check if provisional Rule has been created.
      this.ruleService.getRulesByParentId(this.ideaIdInp).subscribe((response: any) => {
        if (response && response.data) {
          let provRuleIdFound = 0;
          response.data.forEach((rule: RuleInfo) => {
            if (provRuleIdFound === 0 && this.areIdeaAndParentRuleEquals(rule) && rule.statusId === ACTIVE_STATUS) {
              provRuleIdFound = rule.ruleId;
              ruleCode = rule.ruleCode;
            }
          });
          if (provRuleIdFound > 0) {

            this.ruleId = provRuleIdFound;
            // We will directly go to Provisional Rule & Disable New Idea Research
            if (!this.readOnlyView) {
              this.ruleCreationStatus = false;
              this.search.readOnlyViewLob();
              this.readOnlyView = true;
              this.index = 1;
              this.search.showProvisionalDialog(false, ruleCode);
            }
            this.returnDisabled = true;
            this.refreshDisabled = false;
            this.clearDisabled = false;
          } else {
            // Idea Level
            this.refreshDisabled = false;
            this.clearDisabled = false;
            this.saveDisabled = false;
            this.ruleCreationStatus = true;
            this.returnDisabled = false;
          }
        } else {
          this.ruleCreationStatus = true;
          this.returnDisabled = false;
        }

      });
    }
  }

  areIdeaAndParentRuleEquals(ruleData: any): boolean {
    return (ruleData && ruleData.ideaId === ruleData.parentRuleId);
  }

  startIdeaWorkflow(ideaId: any) {
    if (ideaId !== null && ideaId !== undefined) {
      this.ideaService.startIdea(ideaId).subscribe(response => {
        if (response && response.data) {
          let ideaStarted: boolean = response.data;
          this.storage.set('NEW_IDEA_STARTED', ideaStarted, true);
        }
      });
    }
  }

  /**
   * Function that will check state for Provisional Rule button and Submit button
   * @param idea IdeaInfo Object to check
   */
  provAndSubmitBtnState(idea) {
    if ((idea.dupCheckStatus && idea.dupCheckStatus !== EXISTING_IDEA) && (idea.validCheckStatus && idea.validCheckStatus !== INVALID_IDEA)) {
      this.submitDisabled = true;
      this.provisionalBtnDisable = false;
      this.validateButtons();
    } else if ((idea.dupCheckStatus && idea.dupCheckStatus === EXISTING_IDEA) || (idea.validCheckStatus && idea.validCheckStatus === INVALID_IDEA)) {
      this.submitDisabled = false;
      this.validateButtons();
    } else {
      this.submitDisabled = true;
      this.provisionalBtnDisable = true;
    }
  }
  /**
   * Function to update Line of Business, States, Jurisdiction and Category
   * @param idea Idea Info
   */
  setIdeaInfoLobsStatesJurCat(idea: IdeaInfo2) {
    if (idea.category !== null && idea.category !== undefined) {
      this.search.selectedCat = idea.category.categoryId;
    }
    let lobs: any[] = idea.lobs;
    this.search.selectedLobs = [];
    for (let lob in lobs) {
      let lobObj = lobs[lob]["lob"];
      this.search.selectedLobs.push(lobObj["lobId"]);
    }
    let jurisdictions: any[] = idea["jurisdictions"];
    this.search.selectedJurs = [];
    for (let jurisdiction in jurisdictions) {
      let jurisdictionObj = jurisdictions[jurisdiction]["jurisdiction"];
      this.search.selectedJurs.push(jurisdictionObj["jurisdictionId"]);
    }
    let states: any[] = idea["states"];
    this.search.selectedStates = [];
    for (let state in states) {
      let stateObj = states[state]["state"];
      this.search.selectedStates.push(stateObj["stateId"]);
    }
    this.checkStateJurisdiction();
  }

  checkStateJurisdiction() {
    if (this.search.selectedLobs !== null && this.search.selectedLobs.length !== 0) {
      this.search.selectedLobs.includes(Constants.MEDICAID) ? this.runStateCheck(false) : this.runStateCheck(true);
    }
    if (this.search.selectedLobs !== null && this.search.selectedLobs.length !== 0) {
      this.search.selectedLobs.includes(Constants.MEDICARE) ? this.runJurisCheck(false) : this.runJurisCheck(true);
    }
  }

  runStateCheck(disable: boolean) {
    this.search.disableState = disable;
    this.search.lobInput();
  }

  runJurisCheck(disable: boolean) {
    this.search.disableJurisdiction = disable;
    this.search.lobInput();
  }

  indexShift(e) {
    this.index = e.index;
  }

  findOneIdeaInfo() {
    this.ideaService.findOneIdeaInfo().subscribe(item => {
      let newIdeaId: IdeaInfo2 = item.data.ideaId;
      this.storage.set('NEW_IDEA_ID', newIdeaId, true);
    })
  }

  onClear() {
    this.confirmationService.confirm({
      message: 'All unsaved changes will lost. Are you sure that you want to Clear?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dup.selectedDupStatus = 0;
        this.dup.inputDupCmt = '';
        this.dup.selectedIdeaStatus = 0;
        this.dup.inputIdeaStatusCmt = '';

        this.search.libraryPrmNumber = '';
        this.search.selectedLobs = [];
        this.search.selectedStates = [];
        this.search.selectedJurs = [];
        this.search.selectedCat = null;

      }
    });
    this.saveDisplay = false;
  }

  onRefresh() {
    this.confirmationService.confirm({
      message: 'All unsaved changes will lost. Are you sure that you want to Refresh?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ideaRefresh();
        this.saveDisplay = false;
      }
    });
  }
  ideaRefresh() {
    this.retrieveSavedIdeaDetails(this.ideaId);
  }
  // Read Only Mode, should not have a confirmation but just direct them back to home
  exit() {
    this.confirmationService.confirm({
      message: 'All unsaved changes will lost. Are you sure that you want to Exit?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.isIdeaReseachAssigned) {
          this.navigateIdeasNeedingResearch(IDEA_RESEARCH_TAB_ASSIGNED);
        } else if (this.isIdeaReseachReturned) {
          this.navigateIdeasNeedingResearch(IDEA_RESEARCH_TAB_RETURNED);
        } else if (this.isGoodIdea) {
          this.navigateToGoodIdeas();
        }
        else {
          this.navigateHome();
        }
      }
    });
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  public navigateIdeasNeedingResearch(tabIdeasResearch: string): void {
    this.router.navigate(['/ideas-needing-research'], { queryParams: { tab: tabIdeasResearch } });
  }

  public navigateToGoodIdeas(): void {
    this.router.navigate(['/good-ideas']);
  }

  save(action: string) {
    this.saveDisabled = true;
    this.submitDisabled = true;
    this.provisionalBtnDisable = true;
    this.submitState = false;
    if (!this.validateSaveSubmit()) {
      this.saveDisabled = false;
      this.provAndSubmitBtnState(this.ideaInfo);
    } else {
      /**
       *  IDEA INFO SAVE
       */
      this.ideaDto = this.search.newIdea;
      this.ideaDto.eclReferences = undefined // No need to save this
      this.ideaDto.dupCheckStatus = this.dup.selectedDupStatus;
      this.ideaDto.dupCheckComments = this.dup.inputDupCmt;
      this.ideaDto.validCheckStatus = this.dup.selectedIdeaStatus;
      this.ideaDto.validCheckComments = this.dup.inputIdeaStatusCmt;
      this.ideaDto.lobs = this.search.selectedLobs;
      this.ideaDto.states = this.search.selectedStates;
      this.ideaDto.jurisdictions = this.search.selectedJurs;
      const catId = this.search.selectedCat;
      this.ideaDto.updatedOn = new Date;
      this.ideaDto.action = action;
      this.ideaDto.provisionalRuleId = this.provisionalRuleId;
      this.ideaDto.libraryPrmNumber = this.search.libraryPrmNumber;
      forkJoin(
        this.utils.getOneCategory(catId),
        this.userService.getUserInfo(this.userId))
        .subscribe((([cat, user]) => {
          this.ideaDto.category = cat.data;
          this.ideaDto.updatedBy = user;
          this.newIdeaservice.saveNewIdeaResearch(this.ideaDto).subscribe((result: any) => {
            if (result.data === true) {
              this.saveDisabled = false;
              this.retrieveSavedIdeaDetails(this.ideaDto.ideaId);
              if (action !== 'submit') {
                this.messageService.add({ severity: 'success', summary: 'Info', detail: `Idea ${this.ideaDto.ideaCode} Saved Successfully`, life: 5000, closable: true });
              } else if (action === 'submit') {
                this.toast.messageSuccess('Confirmation', `New Idea Research: Idea ${this.ideaDto.ideaCode} Submitted Successfully`, 5000, true);
                this.storage.remove('NEW_IDEA_STARTED');
                this.router.navigate(['/home']);
              }
            }
          });
        }));
    }
  }

  /**
   * Validation of Save/Submit Function
   * @return It will return boolean to check if validation succeeds or not
   */
  validateSaveSubmit() {
    let resp: boolean = true;
    if (!this.validateCategoryCheck() || 
        !this.validateStateJurisdiction() ||
        !this.validateDupValidCheck() || 
        !this.validateReferenceSources() || 
        !this.validateLineOfBusiness()
       ) {
        resp = false;
    }
    return resp;
  }

  validateLineOfBusiness() {
    let resp: boolean = true;
    if (this.search.selectedLobs.length === 0) {
      resp = false;
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Please Select Line of Business.', life: 3000, closable: true });
    }
    return resp;
  }

  /**
   * Validation of State/Jurisdication
   * Check if Medicaid or Medicare is selected so that
   * User must enter those respective fields.
   */
  validateStateJurisdiction() {
    let resp: boolean = true;
    if (this.search.selectedLobs) {
      if (this.search.selectedLobs.includes(MEDICAID) && (!this.search.selectedStates || this.search.selectedStates.length === 0)) {
        resp = false;
        this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'States must be selected if Medicaid is selected.', life: 3000, closable: true });
      }
      if (this.search.selectedLobs.includes(MEDICARE) && (!this.search.selectedJurs || this.search.selectedJurs.length === 0)) {
        resp = false;
        this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Jurisdicitions must be selected if Medicare is selected.', life: 3000, closable: true });
      }
    }
    return resp;
  }

  /**
   * Validation of Categories
   * Category must be selected to proceed.
   */
  validateCategoryCheck() {
    let res: boolean = true;
    if (this.search.selectedCat === undefined || this.search.selectedCat === null) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Please select a Category', life: 5000, closable: true });
      res = false;
    }
    return res;
  }

  validateReferenceSources() {
    let res: boolean = true;
    this.referenceSourcesArray = this.refDetail.getAllReferences(this.ideaId, Constants.ECL_IDEA_STAGE);
    for (let reference of this.referenceSourcesArray) {
      if (reference.refInfo.refSource.sourceDesc.toUpperCase() == Constants.MANUAL_REF_SOURCE) {
        this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Please correct all Manual reference sources', life: 5000, closable: true });
        this.index = 1;
        res = false;
        break;
      }
    }
    return res;
  }

  /**
   *  Validation of Duplicate and Idea Valid Check.
   */
  validateDupValidCheck() {
    let resp: boolean = true;
    if (this.dup.selectedDupStatus === 0 || this.dup.selectedDupStatus === null) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Duplicate Status needs to be selected', life: 5000, closable: true });
      resp = false;
    } else if (this.dup.selectedDupStatus === EXISTING_IDEA && (this.dup.inputDupCmt === undefined || this.dup.inputDupCmt === null || this.dup.inputDupCmt === '')) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Duplicate Comments are mandatory for Existing Idea.', life: 5000, closable: true });
      resp = false;
    }
    if (this.dup.selectedIdeaStatus === 0 || this.dup.selectedIdeaStatus === null) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Idea Status needs to be selected', life: 5000, closable: true });
      resp = false;
    } else if (this.dup.selectedIdeaStatus === INVALID_IDEA && (this.dup.inputIdeaStatusCmt === undefined || this.dup.inputIdeaStatusCmt === null || this.dup.inputIdeaStatusCmt === '')) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Idea Status Comments are mandatory for Invalid Idea.', life: 5000, closable: true });
      resp = false;
    }
    if (!resp) {
      this.index = 0;
    }
    return resp;
  }

  validateButtons() {
    if (!this.provisionalBtnDisable || !this.submitDisabled) {
      this.clear = false;
      this.refresh = true;
    } else {
      this.clear = true;
      this.refresh = false;
    }
  }

  showReturnDialog() {
    this.dialogService.open(ReturnDialogComponent, {
      data: {
        ideaId: this.ideaId
      },
      header: 'Reassignment return',
      contentStyle: { "max-height": "80%", "overflow": "auto" }
    });
  }

}
