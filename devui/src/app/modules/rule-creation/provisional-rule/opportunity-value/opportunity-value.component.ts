import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { ActivatedRoute } from '@angular/router';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { OpportunityValueDto } from 'src/app/shared/models/opportunity-value';
import { Constants } from 'src/app/shared/models/constants';
import { AppUtils } from 'src/app/shared/services/utils';

const CPE_NOTES_ID = 'taCpeNotes';
const ICMS_NOTES_ID = 'taIcmsNotes';
const CVP_NOTES_ID = 'taCvpNotes';

@Component({
  selector: 'app-opportunity-value',
  templateUrl: './opportunity-value.component.html',
  styleUrls: ['./opportunity-value.component.css']
})
export class OpportunityValueComponent implements OnInit {

  _ruleInfo: RuleInfo;
  @Input() ruleId: number;
  @Input() set ruleInfo(rule: RuleInfo) {
    if (rule) {
      this._ruleInfo = rule;
      if (rule.ruleId) {
        this.getOppValues(rule.ruleId, rule.parentRuleId);
      }
    }
  }
  @Input() fromMaintenanceProcess: boolean;
  @Input() provDialogDisable: boolean;
  @Output() messageSend = new EventEmitter<any>();
  opportunityValue: OpportunityValueDto;
  originalOppValue: OpportunityValueDto;
  cvpFormat: number = 0;
  icmsFormat: number = 0;
  rpeFormat: number = 0;
  originalCvpFormat: number = 0;
  originalIcmsFormat: number = 0;
  originalRpeFormat: number = 0;
  maxLength: number = 1000;

  constructor(private ruleService: RuleInfoService, public route: ActivatedRoute, private utils: AppUtils) { }

  ngOnInit() {
    if (!this.fromMaintenanceProcess) {
      this.opportunityValue = new OpportunityValueDto();
    }
  }

  /* Method to fetch the Opp values based on the ruleId */
  getOppValues(ruleId: number, parentRuleId?: number) {
    this.ruleService.getOppValues(ruleId).subscribe(resp => {
      if (resp && resp.data) {
        this.opportunityValue = resp.data;
        this.checkValueIfNullOrUndefined(this.opportunityValue, true);
        this.cvpFormat = this.opportunityValue.cvpOppValue;
        this.icmsFormat = this.opportunityValue.icmsOppValue;
        this.rpeFormat = this.opportunityValue.rpeOppValue;
      } else {
        this.opportunityValue = new OpportunityValueDto();
      }
    });
    if (this.fromMaintenanceProcess) {
      this.ruleService.getOppValues(parentRuleId).subscribe(resp => {
        if (resp && resp.data) {
          this.originalOppValue = resp.data;
          this.checkValueIfNullOrUndefined(this.originalOppValue, false);
          this.originalCvpFormat = this.originalOppValue.cvpOppValue;
          this.originalIcmsFormat = this.originalOppValue.icmsOppValue;
          this.originalRpeFormat = this.originalOppValue.rpeOppValue;
        } else {
          this.originalOppValue = new OpportunityValueDto();
        }
      })
    }
  }

  /* Method to Redirect to a new address*/
  routeToJira() {
    window.open(Constants.JIRA_URL);
  }

  /**
   * checkvalueifFalse
   * @param oppValues - Values to get checked against
   * @param original - Cloned or original rule
   */
  checkValueIfNullOrUndefined(oppValues: OpportunityValueDto, original?: boolean) {
    let { cvpOppValue, icmsOppValue, rpeOppValue } = oppValues;
    if (original) {
      if (!cvpOppValue) { this.opportunityValue.cvpOppValue = 0; }
      if (!icmsOppValue) { this.opportunityValue.icmsOppValue = 0; }
      if (!rpeOppValue) { this.opportunityValue.rpeOppValue = 0; }
    } else {
      if (!cvpOppValue) { this.originalOppValue.cvpOppValue = 0; }
      if (!icmsOppValue) { this.originalOppValue.icmsOppValue = 0; }
      if (!rpeOppValue) { this.originalOppValue.rpeOppValue = 0; }
    }
  }

  checkMultiValidation(setup: number, textAreaId, e?: ClipboardEvent, note?: string) {
    if (setup === Constants.INPUT) {
      if (textAreaId === CPE_NOTES_ID) {
        this.opportunityValue.rpeComments = this.utils.checkInputLengthTextArea(this.opportunityValue.rpeComments, this.maxLength);
      } else if (textAreaId === ICMS_NOTES_ID) {
        this.opportunityValue.icmsComments = this.utils.checkInputLengthTextArea(this.opportunityValue.icmsComments, this.maxLength);
      } else {
        this.opportunityValue.cvpComments = this.utils.checkInputLengthTextArea(this.opportunityValue.cvpComments, this.maxLength);
      }
    } else if (setup === Constants.KEYPRESS) {
      if (textAreaId === CPE_NOTES_ID) {
        this.utils.checkMultiLineMaxLength(e, this.opportunityValue.rpeComments, document.getElementById(textAreaId), this.maxLength);
      } else if (textAreaId === ICMS_NOTES_ID) {
        this.utils.checkMultiLineMaxLength(e, this.opportunityValue.icmsComments, document.getElementById(textAreaId), this.maxLength);
      } else {
        this.utils.checkMultiLineMaxLength(e, this.opportunityValue.cvpComments, document.getElementById(textAreaId), this.maxLength);
      }
    } else {
      this.messageSend.emit(this.utils.checkPasteLength(e, 'Estimate', this.maxLength, note));
    }
  }

}