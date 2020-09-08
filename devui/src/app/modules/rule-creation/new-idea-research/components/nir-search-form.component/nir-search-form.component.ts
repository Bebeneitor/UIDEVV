import { Component, Input, OnInit, Output } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/api';
import { AppUtils } from 'src/app/shared/services/utils';
import { ProvisionalRuleComponent } from 'src/app/modules/rule-creation/provisional-rule/provisional-rule.component';
import { IdeaInfo2 } from 'src/app/shared/models/idea-info';
import { IdeaService } from 'src/app/services/idea.service';
import { Constants } from 'src/app/shared/models/constants';

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

  business: any[];
  categories: any[];
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

  toggleSH: boolean = true;
  response: boolean = false;
  disableState: boolean = true;
  disableJurisdiction: boolean = true;

  displayIdea = {
    ideaCode: '',
    ideaName: '',
    ideaDescription: '',
    ideaId: 0,
    fullName: '',
    status: ''
  }

  constructor(public dialogService: DialogService,
    public config: DynamicDialogConfig,
    private appUtil: AppUtils,
    private ideaService: IdeaService) {
  }

  ngOnInit() {
    this.enabledBackground = '#ffffff';
    this.disabledBackground = '#f7f7f7';
    this.business = [];
    this.categories = [];
    this.states = [];
    this.jurisdictions = [];

    this.appUtil.getAllLobsValue(this.business, this.response);
    this.appUtil.getAllCategoriesValue(this.categories, this.response);
    this.appUtil.getAllJurisdictionsValue(this.jurisdictions, this.response);
    this.appUtil.getAllStatesValue(this.states, this.response);

    this.getIdeaInfo();
    this.lobInput();
  }

  getIdeaInfo() {
    this.ideaService.getIdeaInfo(this.ideaId).subscribe((subIdea: any) => {
      this.newIdea = subIdea.data;

      let newUser: createdBy = this.newIdea.createdBy;
      this.displayIdea.ideaCode = this.newIdea.ideaCode
      this.displayIdea.ideaName = this.newIdea.ideaName
      this.displayIdea.ideaDescription = this.newIdea.ideaDescription
      this.displayIdea.ideaId = this.newIdea.ideaId
      this.displayIdea.fullName = newUser.firstName + " " + newUser.lastName
      this.libraryPrmNumber = this.newIdea.libraryPrmNumber;

      if (this.newIdea.statusId === 1) {
        this.displayIdea.status = 'Active'
      } else {
        this.displayIdea.status = 'In-Active'
      }

    });
  }

  displayInfo() {
    if (this.toggleSH === false) {
      document.getElementById('toggleAdvSH').style.display = 'none';
      document.getElementById('toggleAdvLabel').textContent = "More Details";
      this.checkboxPlus = 'assets/img/check-box-icons/plus.png';
      this.toggleSH = true;

    } else if (this.toggleSH === true) {
      document.getElementById('toggleAdvSH').style.display = 'flex';
      document.getElementById('toggleAdvLabel').textContent = "Less Details";
      this.checkboxPlus = 'assets/img/check-box-icons/minus.png';
      this.toggleSH = false;
    }
  };

  /* Function to show provisional rule creation dialog when the provisional rule button is enabled and clicked */
  showProvisionalDialog(creationStatus: boolean, ruleCode?: string) {
    // Open the provisional rule dialog if it is a new provisional rule creation 
    if (creationStatus) {
      const ref = this.dialogService.open(ProvisionalRuleComponent, {
        data: {
          ruleId: this.ideaId,
          header: PROVISIONAL_RULE_CREATION,
          creationStatus: creationStatus
        },
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
          creationStatus: creationStatus
        },
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

}
