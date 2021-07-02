import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, SelectItem } from 'primeng/api';
import { ProvisionalRuleComponent } from 'src/app/modules/rule-creation/provisional-rule/provisional-rule.component';
import { IdeaComment, IdeaCommentsService } from 'src/app/services/idea-comments.service';
import { IdeaService } from 'src/app/services/idea.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { IdeaInfo2 } from 'src/app/shared/models/idea-info';
import { AppUtils } from 'src/app/shared/services/utils';
import { ResearchRequestService } from "../../../../../services/research-request.service";
import { ResearchRequestSearchedRuleDto } from "../../../../../shared/models/dto/research-request-searched-rule-dto";
import { PolicyPackage } from 'src/app/shared/models/policy-package';


const PROVISIONAL_RULE_CREATION = 'Provisional Rule Creation';
const IDEA_STATUS = 'Status - Idea';
const PROVISIONAL_STATUS = 'Status - Provisional Rule';
const ACTIVE_STATUS = 1;

class createdBy {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'NirSearchForm',
  templateUrl: './nir-search-form.component.html',
  styleUrls: ['./nir-search-form.component.css'],
  providers: []
})

export class NirSearchFormComponent implements OnInit {
  @Input() ideaId: number;
  @Input() ruleId: number;
  @Input() provisionalBtnDisable: boolean;
  @Input() ruleCreationStatus: boolean;
  @Input() readOnlyView: boolean;
  @Input() isPdgMedicaidRule: boolean;

  business: any[];
  categories: SelectItem[];
  states: any[];
  jurisdictions: any[];
  newIdea: IdeaInfo2;
  checkboxPlus = 'assets/img/check-box-icons/plus.png';
  enabledBackground: string;
  disabledBackground: string;
  libraryPrmNumber: string;

  selectedCat: any;
  selectedLobs: any[] = [];
  selectedStates: any[] = [];
  selectedJurs: any[] = [];
  policyPackageValues: any = [];
  policyPackageSelected: any[] = []; 

  toggleSH: boolean = false;
  response: boolean = false;
  disableState: boolean = true;
  disableJurisdiction: boolean = true;
  // Research Request
  rrId: number;
  rrCode: string;
  navPageTitle: string = 'My Requests';
  ruleResponseSearchDto: ResearchRequestSearchedRuleDto;
  ruleResponseIndicator: boolean = false;

  displayIdea = {
    ideaCode: '',
    ideaName: '',
    ideaDescription: '',
    ideaId: 0,
    fullName: '',
    status: ''
  }
  detailsText: string = 'More Details';
  ideaComments: IdeaComment[] = [];

  constructor(public dialogService: DialogService,
    public config: DynamicDialogConfig,
    private appUtil: AppUtils,
    private ideaService: IdeaService,
    private rrService: ResearchRequestService,
    private ideaCommentsService: IdeaCommentsService,
    private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.enabledBackground = '#ffffff';
    this.disabledBackground = '#f7f7f7';
    this.business = [];
    this.categories = [];
    this.states = [];
    this.jurisdictions = [];
    this.appUtil.getAllLobsValue(this.business, this.response);
    this.appUtil.getAllJurisdictionsValue(this.jurisdictions, this.response);
    this.appUtil.getAllStatesValue(this.states, this.response);
    if (this.isPdgMedicaidRule) {
      this.appUtil.getPdgCategoriesValue(this.categories, this.response);
    } else {
      this.appUtil.getAllCategoriesValue(this.categories, this.response);
    }
    this.appUtil.getAllPolicyPackageValue(this.policyPackageValues);
    
    this.getIdeaInfo();
    this.lobInput();
    this.ideaCommentsService.getIdeaComments(this.ideaId).subscribe((response: BaseResponse) => {
      this.ideaComments = response.data;
    });
  }

  getIdeaInfo() {
    this.getRuleResponseIndicatorAndRuleCode(this.ideaId).then((res: any) => {
      if (res && res.ruleResponseIndicator && res.ruleResponseIndicator !== undefined) {
        this.ruleResponseIndicator = (res.ruleResponseIndicator === 'Y') ? true : false;
        this.rrCode = res.ruleCode;
      }
    });

    this.ideaService.getIdeaInfo(this.ideaId).subscribe((subIdea: any) => {
      this.newIdea = subIdea.data;

      let newUser: createdBy = this.newIdea.createdBy;
      this.displayIdea.ideaCode = this.newIdea.ideaCode
      this.displayIdea.ideaName = this.newIdea.ideaName
      this.displayIdea.ideaDescription = this.newIdea.ideaDescription
      this.displayIdea.ideaId = this.newIdea.ideaId
      this.displayIdea.fullName = newUser.firstName + " " + newUser.lastName
      this.libraryPrmNumber = this.newIdea.libraryPrmNumber;

      this.policyPackageSelected = this.newIdea.eclPolicyPackages
            .map(eclPolicyPackage => eclPolicyPackage.policyPackage)
            .map(policyPackage => policyPackage.policyPackageTypeId);

      if (this.newIdea.statusId === 1) {
        this.displayIdea.status = 'Active'
      } else {
        this.displayIdea.status = 'In-Active'
      }

    });
  }

  displayInfo() {
    if (!this.toggleSH) {
      this.checkboxPlus = 'assets/img/check-box-icons/minus.png';
      this.detailsText = 'Less Details';
    } else {
      this.checkboxPlus = 'assets/img/check-box-icons/plus.png';
      this.detailsText = 'More Details';
    }
    this.toggleSH = !this.toggleSH;
  };

  /* Function to show provisional rule creation dialog when the provisional rule button is enabled and clicked */
  showProvisionalDialog(creationStatus: boolean, ruleCode?: string) {
    // Open the provisional rule dialog if it is a new provisional rule creation
    if (creationStatus) {
      const ref = this.dialogService.open(ProvisionalRuleComponent, {
        data: {
          ruleId: this.ideaId,
          header: PROVISIONAL_RULE_CREATION,
          creationStatus: creationStatus,
          ruleResponseInd: this.ruleResponseIndicator,
          researchRequestId: this.rrCode,
          ideaIndicator: true,
          rrNewHeader: 'ID-' + this.ideaId + ' ' + this.displayIdea.ideaName + ' [' + IDEA_STATUS + ']',
          comesFromIdeaResearch : true
        },
        showHeader: !this.ruleResponseIndicator,
        header: PROVISIONAL_RULE_CREATION + ': ID-' + this.ideaId + ' ' + this.displayIdea.ideaName + ' [' + IDEA_STATUS + ']',
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

      ref.onClose.subscribe((provRuleId: any) => {
        if (provRuleId !== null) {
          // Disable everything reminder
        }
      });
    } else { // Open the provisional rule dialog if it is an existing provisional rule created
      const ref = this.dialogService.open(ProvisionalRuleComponent, {
        data: {
          ruleId: this.ideaId,
          header: PROVISIONAL_RULE_CREATION,
          creationStatus: creationStatus,
          ruleResponseInd: this.ruleResponseIndicator,
          researchRequestId: this.rrCode,
          ideaIndicator: false,
          rrNewHeader: 'ID-' + this.ideaId + ' ' + this.displayIdea.ideaName + ' [' + PROVISIONAL_STATUS + ']'
        },
        showHeader: !this.ruleResponseIndicator,
        header: `${PROVISIONAL_RULE_CREATION} : ID-${this.ideaId}  ${this.displayIdea.ideaName} [ ${PROVISIONAL_STATUS} ]`,
        width: '80%',
        closeOnEscape: false,
        closable: false,
        height: '92%',
        contentStyle: {
          'max-height': '92%',
          'overflow': 'auto',
          'padding-top': '0',
          'padding-bottom': '0',
          'border': 'none'
        }
      });

      ref.onClose.subscribe((provRuleId: any) => {
        if (provRuleId !== null) {
          // Disable everything reminder
        }
      });
    }
  }

  readOnlyViewLob() {
    document.getElementById("selectLobID").style.backgroundColor = '#f7f7f7';
    document.getElementById("groupItem").style.borderColor = "#A6A6A6";
    document.getElementById("selectStateID").style.backgroundColor = this.disabledBackground
    document.getElementById("selectJurisdictionID").style.backgroundColor = this.disabledBackground;
  }

  lobInput() {
    // Clean this up. Reminder set default background to disabled.
    if (!this.readOnlyView) {
      if (this.selectedLobs !== null && this.selectedLobs.length !== 0) {
        this.selectedLobs.includes(Constants.MEDICAID) ? this.disableStateBg(false, this.enabledBackground) : this.disableStateBg(true, this.disabledBackground);
      } else {
        this.selectedStates = [];
        this.disableStateBg(true, this.disabledBackground);
      }
      if (this.selectedLobs !== null && this.selectedLobs.length !== 0) {
        this.selectedLobs.includes(Constants.MEDICARE) ? this.disableJurisBg(false, this.enabledBackground) : this.disableJurisBg(true, this.disabledBackground);
      } else {
        this.selectedJurs = [];
        this.disableJurisBg(true, this.disabledBackground);
      }
    } else {
      this.disableStateBg(true, this.disabledBackground);
      this.disableJurisBg(true, this.disabledBackground);
    }

  }

  disableStateBg(disableValue: boolean, disableBackground: string) {
    this.disableState = disableValue;
    document.getElementById("selectStateID").style.backgroundColor = disableBackground;
  }

  disableJurisBg(disableValue: boolean, disableBackground: string) {
    this.disableJurisdiction = disableValue;
    document.getElementById("selectJurisdictionID").style.backgroundColor = disableBackground;
  }

  // Source Link for Research Request
  async getRuleResponseIndicatorAndRuleCode(ruleId: number) {
    this.ruleResponseSearchDto = new ResearchRequestSearchedRuleDto();
    return new Promise((resolve, reject) => {
      this.rrService.getRuleResponseIndicator(ruleId).subscribe((resp: any) => {
        if (resp.data !== null && resp.data !== undefined && resp.data !== {}) {
          this.ruleResponseSearchDto = resp.data;
        }
        resolve(this.ruleResponseSearchDto);
      });
    });
  }

  catInput() {
    if (!this.readOnlyView && this.isPdgMedicaidRule) {
      let states = this.appUtil.getStateFromCategory(this.selectedCat, this.categories, this.selectedStates, this.states)
      this.selectedStates = [...states];
    }
  }

  stateInput() {
    if (!this.readOnlyView && this.isPdgMedicaidRule) {
      let cat = this.appUtil.getCategoryFromState(this.selectedCat, this.categories, this.selectedStates, this.states)
      this.selectedCat = cat;
    }

  }

  getCommentHeader(comment: IdeaComment) {
    const datePipeString = this.datePipe.transform(comment.creationDate, 'MM/dd/yyyy hh:mm a');
    return (`${comment.createdUser} added a comment - ${datePipeString} `);
  }
}
