import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { RuleReference } from 'src/app/shared/models/rule-reference';
import { RuleReferenceUpdates } from 'src/app/shared/models/rule-reference-updates';
import { environment } from '../../../../../environments/environment';
import { RuleInfoService } from '../../../../services/rule-info.service';
import { AppUtils } from '../../../../shared/services/utils';
import {RuleImpactAnalysisRun} from "../../../../shared/models/rule-impact-analysis-run";
import {RuleInfo} from "../../../../shared/models/rule-info";
import {ProvisionalRuleService} from "../../../../services/provisional-rule.service";
import {ECLConstantsService} from "../../../../services/ecl-constants.service";
import { ReferenceInfo } from 'src/app/shared/models/reference-info';
import { ReferenceService } from 'src/app/services/reference.service';
import { EclReferenceDto } from 'src/app/shared/models/dto/ecl-reference-dto';

@Component({
  selector: 'app-reference-review-impact',
  templateUrl: './reference-review-impact.component.html',
  styleUrls: ['./reference-review-impact.component.css']
})
export class ReferenceReviewImpactComponent implements OnInit {

  rule: RuleInfo;
  ruleReferences: any[];
  originalReferences:any = [];   
  copyReference:any = [];
  ruleRefUpdates: RuleReferenceUpdates[];
  ruleImpactAnalysisRun: RuleImpactAnalysisRun;
  loading: boolean = false;
  showConfirmationMsg: boolean = false;
  confirmationHeaderMsg: string = "";
  saveMessage:any = "";
  emptyStatus: boolean;

  docChangedStatus: any[] = [
    {label: 'Select', value: null},
    {label: 'No Change', value: 0},
    {label: 'Change', value: 1}
  ];

  impactInd: any[] = [
    {label: 'Select', value: null},
    {label: 'No', value: 0},
    {label: 'Yes', value: 1}
  ];

  impactType: any[] = [
    {label: 'Select', value: null},
    {label: 'Editorial', value: this.eclConstants.RULE_IMPACT_TYPE_EDITORIAL},
    {label: 'Logical', value: this.eclConstants.RULE_IMPACT_TYPE_LOGICAL}
  ];

  selectedReference: RuleReference;
  objLoaded : boolean = false;
  cols: any[] = [
    {field: 'source', header: 'Source', width: '8%'},
    {field: 'name', header: 'Name', width: '14%'},
    {field: 'chapter', header: 'Chapter', width: '14%'},
    {field: 'page', header: 'Page', width: '14%'},
    {field: 'section', header: 'Section', width: '14%'},
    {field: 'edition', header: 'Edition', width: '14%'},
    {field: 'url', header: 'URL', width: '15%'},
    {field: 'changedStatus', header: 'Change Status', width: '10%'},
    {field: 'changedDetails', header: 'Change Details', width: '20%'}
  ];

  constructor(public ref: DynamicDialogRef,private http: HttpClient, private util: AppUtils, public config: DynamicDialogConfig,private provRuleService: ProvisionalRuleService, private ruleInfoService: RuleInfoService, private confirmationService: ConfirmationService, private eclConstants: ECLConstantsService,private references:ReferenceService) {
    this.ruleImpactAnalysisRun = new RuleImpactAnalysisRun();
    this.rule = new RuleInfo();
  }

  disableImpactType(event: any)
  {
    this.objLoaded = false;

    if(event.value < 1) {
      this.ruleImpactAnalysisRun.ruleImpactTypeId = null;
    }

    this.objLoaded = true;
  }

  hideConfirmationMsg()
  {
    this.showConfirmationMsg = false;
  }

  refreshImpactAnalysis(){
    this.loading=true;
    this.ngOnInit();
    this.loading=false;
  }

  exitImpactAnalysis() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ref.close();
      },
      reject: () => {
      }
    });


  }

  saveImpactAnalysis() {
    this.ruleRefUpdates = [];
    let refReviewDone: boolean = true;
    this.ruleReferences.forEach(ruleRef => {
      let ruleReferenceUpdates = new RuleReferenceUpdates();
      ruleReferenceUpdates.referenceId = ruleRef.referenceId;
      ruleReferenceUpdates.refChangeDetails = ruleRef.changedDetail;
      ruleReferenceUpdates.refChangeStatusId = ruleRef.changedStatus;
      if(ruleRef.changedStatus == null)
        refReviewDone = false;
      let referenceInfo = new ReferenceInfo();
      referenceInfo.referenceId = ruleRef.referenceId;
      referenceInfo.refurlEdition = ruleRef.edition;
      ruleReferenceUpdates.referenceInfo = referenceInfo;
      this.ruleRefUpdates.push(ruleReferenceUpdates);
    });

    if(!refReviewDone)
    {
      this.showConfirmationMsg = true;
      this.confirmationHeaderMsg = "Warning";
      this.saveMessage = "Please complete review of all the References.";
      return;
    }


    let impactdeRule = new RuleImpactAnalysisRun();
    impactdeRule = this.ruleImpactAnalysisRun;    

    let impactAnalysisObj = {            
      'references' : this.ruleReferences,
      'impactdeRule': impactdeRule,
      'ruleRefUpdates':this.ruleRefUpdates,
      'createdBy': 1     
    };

    this.ruleInfoService.saveImpactAnalysis(impactAnalysisObj).subscribe(response => {
      //this.ref.close();
      this.showConfirmationMsg = true;
      this.confirmationHeaderMsg = "Confirmation";
      this.saveMessage = "Reference Impact Analysis has been saved successfully";
    });

    this.saveToCopy();//saving info in reference copy

  }

  ngOnInit() {
    this.loading = true;
    this.objLoaded = false;

    this.ruleInfoService.getRuleInfo(this.config.data.ruleId).subscribe(response => {
      this.rule = response.data;      
    });

    this.ruleInfoService.getRuleImpactAnalysisRun(this.config.data.ruleId).subscribe(obj => {
      this.ruleImpactAnalysisRun = obj.data;

      this.objLoaded = true;
  
      this.references.getReferencesByRule(this.config.data.ruleId).subscribe((response: any)=>{
        
        this.ruleReferences = [];
        this.originalReferences = [];
        this.copyReference =[];

        this.originalReferences =  response.data.originalRuleReference;
        this.copyReference = response.data.copyRuleReferences;

        for (let i = 0; i < this.originalReferences.length; i++) {      

          this.ruleReferences.push({
            'eclReferenceId' : this.originalReferences[i].eclReferenceId,
            'eclId' : this.originalReferences[i].eclId,            
            'source': this.originalReferences[i].refInfo.referenceSource.sourceDesc,
            'name': this.originalReferences[i].refInfo.referenceName,
            'chapter': this.originalReferences[i].chapter,
            'page': this.originalReferences[i].page,
            'section': this.originalReferences[i].section,
            'edition': this.originalReferences[i].edition,
            'url': this.originalReferences[i].refInfo.referenceURL,
            'changedDetail': this.getChangedDetail(this.originalReferences[i].refInfo.referenceId),
            'changedStatus': this.getChangedStatus(this.originalReferences[i].refInfo.referenceId),
            'referenceId': this.originalReferences[i].refInfo.referenceId,
            
            'chapterCopy': this.copyReference[i].chapter,  
            'pageCopy': this.copyReference[i].page,
            'sectionCopy': this.copyReference[i].section,
            'editionCopy': this.copyReference[i].edition

          });           
        }        

      });

    });    
    
    this.loading = false;
  }

  saveToCopy(){
    //updating to new values.
    for (let i = 0; i < this.copyReference.length; i++) {
      
      this.copyReference[i].chapter = this.ruleReferences[i].chapterCopy;
      this.copyReference[i].page = this.ruleReferences[i].pageCopy;
      this.copyReference[i].section = this.ruleReferences[i].sectionCopy;
      this.copyReference[i].refInfo.refurlEdition = this.ruleReferences[i].editionCopy;
      
      
      let eclReference = new EclReferenceDto();

      eclReference.eclReferenceId = this.copyReference[i].eclReferenceId;
      eclReference.chapter = this.copyReference[i].chapter;
      eclReference.page = this.copyReference[i].page;
      eclReference.section = this.copyReference[i].section;
      eclReference.edition = this.copyReference[i].refInfo.refurlEdition     
      
      this.references.updateEclReference(eclReference).subscribe();

    }


  }

  public getChangedDetail(refId: any)
  {
    let changeDetails: any ="";

    if(this.ruleImpactAnalysisRun.ruleRefUpdates) {
      this.ruleImpactAnalysisRun.ruleRefUpdates.forEach(ruleRefUpd => {
        if (ruleRefUpd.referenceId == refId) {
          changeDetails = ruleRefUpd.refChangeDetails;
        }
      });
    }
    return changeDetails;
  }

  public getChangedStatus(refId: any)
  {
    let changeDetails: any ="";

    if(this.ruleImpactAnalysisRun.ruleRefUpdates) {
      this.ruleImpactAnalysisRun.ruleRefUpdates.forEach(ruleRefUpd => {
        if (ruleRefUpd.referenceId == refId) {
          changeDetails = ruleRefUpd.refChangeStatusId;
        }
      });
    }
    return changeDetails;
  }

  public isSaveDisabled()
  {
    if(this.ruleImpactAnalysisRun.ruleImpactedInd)
    {
      if(!this.ruleImpactAnalysisRun.ruleImpactAnalysis)
        return true;
      else if(!this.ruleImpactAnalysisRun.ruleImpactTypeId)
        return true;
      else if(this.ruleImpactAnalysisRun.ruleImpactTypeId === this.eclConstants.RULE_IMPACT_TYPE_EDITORIAL)
        return false;
       else if(this.ruleImpactAnalysisRun.typeOfChanges &&
        this.ruleImpactAnalysisRun.typeOfChanges.hcps.ruleChangeAddNotes ||
        this.ruleImpactAnalysisRun.typeOfChanges.hcps.ruleChangeModNotes ||
        this.ruleImpactAnalysisRun.typeOfChanges.hcps.ruleChangeDelNotes ||
        
        this.ruleImpactAnalysisRun.typeOfChanges.icd.ruleChangeAddNotes ||
        this.ruleImpactAnalysisRun.typeOfChanges.icd.ruleChangeModNotes ||
        this.ruleImpactAnalysisRun.typeOfChanges.icd.ruleChangeDelNotes ||
        
        this.ruleImpactAnalysisRun.typeOfChanges.modifiers.ruleChangeAddNotes ||
        this.ruleImpactAnalysisRun.typeOfChanges.modifiers.ruleChangeModNotes ||
        this.ruleImpactAnalysisRun.typeOfChanges.modifiers.ruleChangeDelNotes ||
        
        this.ruleImpactAnalysisRun.typeOfChanges.placeServices.ruleChangeAddNotes ||
        this.ruleImpactAnalysisRun.typeOfChanges.placeServices.ruleChangeModNotes ||
        this.ruleImpactAnalysisRun.typeOfChanges.placeServices.ruleChangeDelNotes)
        return false;
      else{
        return true;
      }
    }
  }

  public defaultImpactType() {
    if (this.ruleImpactAnalysisRun.ruleImpactedInd == null || this.ruleImpactAnalysisRun.ruleImpactedInd == this.eclConstants.RULE_IMPACT_TYPE_EDITORIAL) {

      let isRefChanged: boolean = false;
      this.ruleReferences.forEach(ref => {

        if (ref.changedStatus > 0 && !isRefChanged) {
          this.ruleImpactAnalysisRun.ruleImpactTypeId = 0;
          isRefChanged = true;
        }
      });
      if(!isRefChanged)
        this.ruleImpactAnalysisRun.ruleImpactTypeId = null;

    }
  }

  public enableChangesNotes() {
    this.emptyStatus = this.isRuleTypeChangeEmpty();
    if (this.ruleImpactAnalysisRun.ruleImpactedInd != null && this.ruleImpactAnalysisRun.ruleImpactTypeId == this.eclConstants.RULE_IMPACT_TYPE_LOGICAL && (this.emptyStatus==true||this.emptyStatus==undefined))
      return true;
    else
      return false;
   }

checkTypeOfChanges(event, type) {    
   if(this.ruleImpactAnalysisRun && this.ruleImpactAnalysisRun.typeOfChanges) {
      this.ruleImpactAnalysisRun.typeOfChanges[type] = event;
    }
  }

  public isRuleTypeChangeEmpty(){
    if(this.ruleImpactAnalysisRun.typeOfChanges &&
     !this.ruleImpactAnalysisRun.typeOfChanges.hcps.ruleChangeAddNotes &&
     !this.ruleImpactAnalysisRun.typeOfChanges.hcps.ruleChangeModNotes &&
     !this.ruleImpactAnalysisRun.typeOfChanges.hcps.ruleChangeDelNotes &&
     
     !this.ruleImpactAnalysisRun.typeOfChanges.icd.ruleChangeAddNotes &&
     !this.ruleImpactAnalysisRun.typeOfChanges.icd.ruleChangeModNotes &&
     !this.ruleImpactAnalysisRun.typeOfChanges.icd.ruleChangeDelNotes &&
     
     !this.ruleImpactAnalysisRun.typeOfChanges.modifiers.ruleChangeAddNotes &&
     !this.ruleImpactAnalysisRun.typeOfChanges.modifiers.ruleChangeModNotes &&
     !this.ruleImpactAnalysisRun.typeOfChanges.modifiers.ruleChangeDelNotes &&
     
     !this.ruleImpactAnalysisRun.typeOfChanges.placeServices.ruleChangeAddNotes &&
     !this.ruleImpactAnalysisRun.typeOfChanges.placeServices.ruleChangeModNotes &&
     !this.ruleImpactAnalysisRun.typeOfChanges.placeServices.ruleChangeDelNotes)
      this.emptyStatus = true;
     else
      this.emptyStatus = false; 
     return this.emptyStatus;
  }

  checkChangeDetail(reference : any, saveBtn: any){
    if(reference.changedStatus == 1 && (reference.changedDetail == null || reference.changedDetail == "") || this.isSaveDisabled())
      saveBtn.disabled = true;
    else
      saveBtn.disabled = false;
  }

}
