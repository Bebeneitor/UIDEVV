import { Component, OnInit, Input } from '@angular/core';
import { RuleImpactAnalysisRun } from '../../models/rule-impact-analysis-run';
import { RuleInfoService } from 'src/app/services/rule-info.service';

@Component({
  selector: 'app-type-of-change-marker',
  templateUrl: './type-of-change-marker.component.html',
  styleUrls: ['./type-of-change-marker.component.css']
})
export class TypeOfChangeMarkerComponent implements OnInit {

  @Input() ruleId: string;

  display: boolean = false;

  ruleImpactAnalysisRun : RuleImpactAnalysisRun = null;

  constructor(private ruleInfoService: RuleInfoService) { }

  ngOnInit() {
  }

  /**
   * Load data from service and open modal box
   */
  open() {
    this.ruleInfoService.getRuleImpactAnalysisRun((Number(this.ruleId))).subscribe(obj => {
      this.ruleImpactAnalysisRun = obj.data;
      this.display = true;
    });
  }

}
