import { Component, Input, OnInit,ViewChild} from '@angular/core';
import { RuleInfo } from 'src/app/shared/models/rule-info';

@Component({
  selector: 'app-rationale',
  templateUrl: './rationale.component.html',
  styleUrls: ['./rationale.component.css']
})
export class RationaleComponent implements OnInit {

  @Input() ruleInfo:RuleInfo;
  @Input() provDialogDisable:boolean;
  @Input() fromMaintenanceProcess:boolean;
  @ViewChild('markpupEd',{static: true}) markupEd;
  constructor() { }

  ngOnInit() {
  }

}
