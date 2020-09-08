import { Component, Input, OnInit, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProvisionalRuleService } from 'src/app/services/provisional-rule.service';
import { UtilsService } from 'src/app/services/utils.service';
import { RuleImpactAnalysisRun } from "../../../../shared/models/rule-impact-analysis-run";


@Component({
  selector: 'app-type-rule-change',
  templateUrl: './type-rule-change.component.html',
  styleUrls: ['./type-rule-change.component.css']
})
export class TypeRuleChangeComponent implements OnInit, AfterViewChecked {

  @Input() typeOfChange: string;
  @Input() data : any;
  @Input() readOnly : boolean;

  @Output() output = new EventEmitter<any>();

  ruleImpactAnalysisRun: RuleImpactAnalysisRun;

  constructor(private util: UtilsService, private ruleService: RuleInfoService, private provisionalRuleService: ProvisionalRuleService,
    public route: ActivatedRoute, private router: Router) {

    this.ruleImpactAnalysisRun = new RuleImpactAnalysisRun();
  }

  ngOnInit() {

    if(this.readOnly == undefined) {
      this.readOnly = false;
    }

    this.ruleImpactAnalysisRun.typeOfChanges[this.typeOfChange] = this.data;
  }

  ngAfterViewChecked() {
    this.outData();
  }

  outData() {
    this.output.emit(this.ruleImpactAnalysisRun.typeOfChanges[this.typeOfChange]);
  }
}
