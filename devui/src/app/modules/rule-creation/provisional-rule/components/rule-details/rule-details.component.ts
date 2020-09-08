import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-rule-details',
  templateUrl: './rule-details.component.html',
  styleUrls: ['./rule-details.component.css']
})
export class RuleDetailsComponent implements OnInit {
  @Input() ruleInfo:any;
  @Input() provDialogDisable : boolean;

  @ViewChild('markpupEd') markupEd;

  
  constructor() { }

  origTxt = "";


  ngOnInit() {
  }
  
  getUpdatedDescription() {
    this.ruleInfo.ruleLogicFinal = this.markupEd.updatedText;
  }

}
