import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants } from 'src/app/shared/models/constants';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { ConfirmationService, DynamicDialogRef } from 'primeng/api';
import { MidRuleBoxComponent } from "../../../../Reports/components/mid-rule-box/mid-rule-box.component";
import { RrUtils } from '../../../services/rr-utils.component';

const ECL_ENGINE_ID = 1;
const ICMS_ENGINE_ID = 2;
const CVP_ENGINE_ID = 6;
const CPE_ENGINE_ID = 7;

@Component({
  selector: 'app-research-request-search-rule-ids',
  templateUrl: './research-request-search-rule-ids.component.html',
  styleUrls: ['./research-request-search-rule-ids.component.css']
})
export class ResearchRequestSearchRuleIdsComponent implements OnInit {

  @ViewChild(MidRuleBoxComponent,{static: true}) midBox: MidRuleBoxComponent;

  dropDownStyles: any = { 'width': '100%', 'border': '1px solid #31006F' };
  ruleEngineList: any[] = [];
  searchRules: string;
  cols: any[] = [];
  filteredData: any[] = [];
  selectedData: any[] = [];
  descriptionDisplayText: string = '';
  selectedRuleEngine: number;
  cancelDisplay: boolean = false;
  message: string;
  showInvalid: string = 'invalid-hide';
  invalidRuleLength: number = 0;
  midTextRrBoxCss: string = 'mid-rr-text-box';
  loadMidBox: boolean;

  constructor(private researchRequestService: ResearchRequestService,
    public ref: DynamicDialogRef,
    private rrUtils: RrUtils,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getAllRuleEngines();
    this.cols = [
      { field: 'ruleCode', header: 'ECL ID', width: '10%' },
      { field: 'icmsId', header: 'ICMS ID', width: '10%' },
      { field: 'ruleName', header: 'Rule Name', width: '55%' },
      { field: 'status', header: 'Status', width: '15%' },
      { field: 'assignedTo', header: 'Assigned To', width: '10%' }
    ];
    this.clearDescriptionText();
  }

  /**
   * Method to clear description content
   */
  clearDescriptionText() {
    this.descriptionDisplayText = '';
  }

  /**
   * Method to populate Rule Engines to dropbox
   */
  getAllRuleEngines() {
    this.ruleEngineList = [
      { label: 'Choose', value: null },
      { label: 'ECL', value: ECL_ENGINE_ID },
      { label: 'ICMS', value: ICMS_ENGINE_ID },
      { label: 'CVP', value: CVP_ENGINE_ID },
      { label: 'CPE', value: CPE_ENGINE_ID }
    ]
  }

  /**
   * Method to display rule description when user clicks on a row (not on a checkbox)
   * @param rule
   */
  clickRow(rule) {
    this.filteredData.forEach(ele => ele.displayDescription = false);
    rule.displayDescription = true;
    this.descriptionDisplayText = rule.description;
  }

  /**
   * Method to validate input and rule search
   * @param event
   */
  onKeyUpSearch(event) {
    if (event.key === 'Enter') {
      this.loadMidBox = true;
      this.clearDescriptionText();
      if (this.searchRules && this.searchRules.length > 0) {
        let regexValidList: string[] = [];
        let searchRuleList = this.searchRules.split(',').map(ele => ele.trim());
        if (this.selectedRuleEngine === ECL_ENGINE_ID || this.selectedRuleEngine === ICMS_ENGINE_ID) {
          const regexp: RegExp = /^\d+.?\d/;
          searchRuleList.forEach(ele => {
            if (regexp.test(ele)) {
              regexValidList.push(ele);
            }
          });
        } else {
          this.loadMidBox = false;
          regexValidList = searchRuleList;
        }

        if (this.selectedRuleEngine) {
          const param = {
            ruleEngineId: this.selectedRuleEngine,
            ruleIds: regexValidList,
            newRequest: false
          };
          this.researchRequestService.getRuleDetails(param).subscribe((response: any) => {
            if (response.data) {
              //Rule Validation
              this.callMidBoxHighlight(this.selectedRuleEngine, response.data, searchRuleList, regexValidList);
              this.filteredData = response.data.map(ele => {
                return {
                  ruleRuleMappingId: '',
                  ruleId: ele.ruleId,
                  ruleCode: ele.eclId,
                  icmsId: ele.icmsId,
                  ruleName: ele.ruleName,
                  status: ele.status,
                  assignedTo: ele.assignedTo,
                  description: ele.description,
                  displayDescription: false,
                  approvalStatus: this.getApprovalStatus(ele.approvalStatus, ele.status),
                  eclRuleEngineId: ele.eclRuleEngineId
                };
              });
              this.loadMidBox = false;
            } else {
              this.loadMidBox = false;
            }
          });
        } else {
          this.loadMidBox = false;
        }
      } else {
        this.loadMidBox = false;
      }
    }
  }

  callMidBoxHighlight(ruleEngineId: number, validData, searchRuleList, regexValidList) {
    const stripRawData = this.rrUtils.stripRuleEngine(ruleEngineId, validData);
    const invalidRules = this.rrUtils.fillHighlights(searchRuleList, stripRawData, regexValidList).filter(e => e);
    this.midBox.checkMidRuleIds(invalidRules, invalidRules, true);
  }

  updateSearchRules(e: string[]) {
    this.searchRules = e.toString();
  }

  showInvalidLength(e) {
    this.invalidRuleLength = e;
    this.showInvalid = e > 0 ? 'invalid-show' : 'invalid-hide';
  }

  /**
   * Method to add searched rules to Research Request Rule Responses
   */
  onAdd() {
    if (this.selectedData.length > 0) {

      const addData = this.selectedData.map(ele => {
        if (ele.approvalStatus == Constants.APPROVED) {
          ele.Status = Constants.LIBRARY_RULE;
        }
        return {

          ruleRuleMappingId: '',
          ruleId: ele.ruleId,
          ruleCode: ele.ruleCode,
          ruleName: ele.ruleName,
          icmsId: ele.icmsId,
          changeType: null,
          reviewComments: '',
          ruleStatus: ele.status,
          approvalStatus: ele.approvalStatus,
          rrRuleStatus: null,
          ruleEngineId: this.selectedRuleEngine
        };
      });
      this.ref.close(addData);

    } else {
      this.ref.close();
    }

  }

  /**
   * Method to show the cancel dialog and close the dialog based on the user actions yes or no
   */
  onCancel() {
    this.confirmationService.confirm({
      message: 'Are you sure you would like to cancel?',
      header: 'Cancel Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.ref.close();
      },
      reject: () => {
      }
    });
  }

  /**
   * Method to enable and disable the submit button based on the selected records
   */
  validateButton() {
    let res: boolean = true;
    if (this.selectedData && this.selectedData.length > 0) {
      res = false;
    } else {
      res = true;
    }
    return res;
  }

  getApprovalStatus(approvalStatus: string, status: string): string {
    if (approvalStatus && approvalStatus === Constants.RR_WORKFLOW_STATUS_DRAFT && status === Constants.LIBRARY_RULE) {
      return '';
    }
    return approvalStatus;
  }


}


