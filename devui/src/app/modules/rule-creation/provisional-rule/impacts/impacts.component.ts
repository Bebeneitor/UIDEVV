import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { ProcedureCodeDto } from 'src/app/shared/models/dto/procedure-code-dto';

const GENDER_BOTH = 3;
const ECL_RULE_ENGINE_SHORT_DESC ="ECL";

@Component({
  selector: 'app-impacts',
  templateUrl: './impacts.component.html',
  styleUrls: ['./impacts.component.css']
})
export class ImpactsComponent implements OnInit {
  _ruleInfo: RuleInfo = new RuleInfo();
  parentRuleInfo: RuleInfo = new RuleInfo();

  eclRule:boolean = true;
  
  @Input() set ruleInfo(value: RuleInfo) {
    if (value) {
      if (!value.procedureCodeDto) {
        value.procedureCodeDto = new ProcedureCodeDto();
      }
      if (value.ruleEngine && ECL_RULE_ENGINE_SHORT_DESC !== value.ruleEngine.shortDesc) {
        this.eclRule = false;
      }
      this._ruleInfo = value;
    }
  }
  @Input() set ruleInfoOriginal(value: RuleInfo) {
    if (value && value.ruleId && value.procedureCodeDto) {
      this.parentRuleInfo = value;
    }
  }

  get ruleInfo(): RuleInfo {
    return this._ruleInfo;
  }
  @Input() provDialogDisable: boolean;

  @Input() fromMaintenanceProcess:boolean;
  @ViewChild('markpupEd') markupEd;
  constructor() { }

  ngOnInit() {
    if(this.ruleInfo) {
      if(this.ruleInfo.claimImpactInd === undefined) {
        this.ruleInfo.claimImpactInd = 0;
      }
      if(this.ruleInfo.dosageImpactInd === undefined) {
        this.ruleInfo.dosageImpactInd = 0;
      }
      if(this.ruleInfo.genderInd === undefined) {
        this.ruleInfo.genderInd = GENDER_BOTH;
      }
      if(this.ruleInfo.ageLimitInd === undefined) {
        this.ruleInfo.ageLimitInd = 0;
      }
      if(this.ruleInfo.mileLimitInd === undefined) {
        this.ruleInfo.mileLimitInd = 0;
      }
      if(this.ruleInfo.dosageLimitInd === undefined) {
        this.ruleInfo.dosageLimitInd = 0;
      }
    }
  }

}
