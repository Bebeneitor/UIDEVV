import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { RuleReference } from 'src/app/shared/models/rule-reference';
import { IdeaService } from 'src/app/services/idea.service';
import { ReferenceService } from 'src/app/services/reference.service';
import { RuleInfoService } from 'src/app/services/rule-info.service';

@Component({
  selector: 'app-idea-detail',
  templateUrl: './idea-detail.component.html',
  styleUrls: ['./idea-detail.component.css']
})
export class IdeaDetailComponent implements OnInit {
  rule: RuleInfo = new RuleInfo();
  ruleReferences: any[];
  refInfoArray: any[] = [];
  refObj: any;
  selectedReference: RuleReference;
  loading: boolean;
  cols: any[] = [
    { field: 'source', header: 'Source', width: '9%' },
    { field: 'name', header: 'Name', width: '25%' },
    { field: 'title', header: 'Title', width: '9%' },
    { field: 'details', header: 'View Details', width: '11%' }
  ];

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef, private ruleService: RuleInfoService, private referenceService: ReferenceService) { }

  showReferenceInfo(refId: any) {
    for (let obj in this.refInfoArray) {
      let reference = this.refInfoArray[obj];
      if (refId == reference.refInfo.referenceId) {
        let byte = reference.refInfo.refUrlFile;
        new Blob([byte], {type: "application/pdf"});
        this.refObj = reference;
      }
    }
  }

  ngOnInit() {
    this.ruleService.getRuleInfo(this.config.data.ruleId).subscribe(rule => {
      this.rule = rule;
    });

    this.referenceService.getRuleReferences(this.config.data.ruleId).subscribe((response: any[]) => {
      this.ruleReferences  = [];
      response.forEach(reference => {
        this.refInfoArray.push(reference);
        this.ruleReferences.push({
          "source": reference.refInfo.referenceSource.sourceDesc,
          "name": reference.refInfo.referenceName,
          "title": reference.refInfo.referenceTitle,
          "refId": reference.refInfo.referenceId
        });
      });
    });
  }

  getFile(refId:any, fileInfo:String) {
    for (let obj in this.refInfoArray) {
      let reference = this.refInfoArray[obj];
      if (refId == reference.refInfo.referenceId) {
        let byte = this.getBytesOfAttchment(fileInfo, reference);
        let fileName = reference.refInfo.referenceURL;
        let a = document.createElement("a");
        document.body.appendChild(a);
        let ext = fileName.substr(fileName.lastIndexOf('.') + 1);
       
        let file = new Blob([byte], {type: "application/"+ext});
        let fileURL = window.URL.createObjectURL(file);
        a.href = fileURL;
        a.download = fileName;
        a.click();
      }
    }
  }

  getBytesOfAttchment(fileInfo:String, reference:any){
    let attr:any;
    switch(fileInfo){
      case "refUrl":
          attr = reference.refInfo.refUrlFile;
      case "additional1":
          attr   = reference.refInfo.refDocFile1;
      case "additional2":
          attr  = reference.refInfo.refDocFile2;
    }
    return attr;
  }
}