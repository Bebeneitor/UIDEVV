import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PdgTemplateService } from 'src/app/services/pdg-template.service';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { PdgConstants } from '../pdg-constants';
import {PdgTemplateDownloadDto} from "src/app/shared/models/dto/pdg-preview-dto";
import { HttpResponse } from '@angular/common/http';

const PDG_DOC_NAME = 'PDG_Medicaid_Template';

@Component({
  selector: 'app-pdg-preview-info',
  templateUrl: './pdg-preview-info.component.html',
  styleUrls: ['./pdg-preview-info.component.css']
})


export class PdgPreviewInfoComponent implements OnInit {
  loading :boolean = false;
  heading : string = '';
  isRefExist : boolean= false;
  headingLabels : any = PdgConstants;
  _previewRuleInfo : PdgTemplateDownloadDto;
  cptFilesLoaded : boolean;  
  ituFilesLoaded : boolean;  
  claimFilesLoaded : boolean;  
  otherFilesLoaded : boolean;  
  dosFilesLoaded : boolean;  
  cgridFilesLoaded : boolean;  
  codeFilesLoaded : boolean;

  @Input() ruleId;
  @Input() set previewRuleInfo(data: PdgTemplateDownloadDto) {
    this._previewRuleInfo = data;
    this.loading = true;
    this.cdr.detectChanges();
    if (this._previewRuleInfo) {
      this.cptFilesLoaded = !this._previewRuleInfo.cptFiles;
      this.ituFilesLoaded = !this._previewRuleInfo.ituFiles;
      this.claimFilesLoaded = !this._previewRuleInfo.claimTypeFiles;
      this.otherFilesLoaded = !this._previewRuleInfo.otherInfoFiles;
      this.dosFilesLoaded = !this._previewRuleInfo.subRuleDosFiles;
      this.cgridFilesLoaded = !this._previewRuleInfo.clientGridFiles;
      this.codeFilesLoaded = !this._previewRuleInfo.codeCoverageFiles;
      if (this._previewRuleInfo.pdgReferences) {
        let references = this._previewRuleInfo.pdgReferences;
        if (references.length > 0) {
          this.isRefExist = true;
        } else {
          this.isRefExist = false;
        }
      }
    }
    this.isLoadingDone();
  }

  isHpp : boolean = false;
  _pdgType : string;
  @Input() set pdgType (data:string) { 
    this._pdgType = data;
    if (data == 'HPP') {
      this.isHpp = true;
      this.heading = 'MSSP ';
    } else {
      this.isHpp = false;
      this.heading = '';
    }

  }

  constructor(private sanitizer: DomSanitizer, private cdr : ChangeDetectorRef,
    private pdgService : PdgTemplateService, private fileManagerService : FileManagerService) {  
  }

  ngOnInit() {
    this.loading = false;
  }

  isLoadingDone() {
    if (this.loading == true &&
      this.cgridFilesLoaded ==  true &&
      this.codeFilesLoaded == true &&
      this.claimFilesLoaded == true &&
      this.ituFilesLoaded == true &&
      this.dosFilesLoaded == true &&
      this.otherFilesLoaded == true &&
      this.cptFilesLoaded == true) {
      this.loading = false;
      if (this._previewRuleInfo) {
        document.getElementById("ellTeamNote").innerHTML = this._previewRuleInfo.ellTeamNote;
        document.getElementById("ruleRelationships").innerHTML = this._previewRuleInfo.ruleRelationships;
        document.getElementById("codeCoverage").innerHTML = this._previewRuleInfo.codeCoverage;
        document.getElementById("claimTypeInfo").innerHTML = this._previewRuleInfo.claimTypeInfo;
        document.getElementById("dosFromInfo").innerHTML = this._previewRuleInfo.dosFromInfo;
        document.getElementById("otherInfo").innerHTML = this._previewRuleInfo.otherInfo;
        document.getElementById("ituReview").innerHTML = this._previewRuleInfo.ituReviewInfo;
      }
      this.cdr.detectChanges();
    } 
    

  }

  /**
* Gets the file from the service.
* @param file that we want to download.
*/
  downloadTemplate() {
    this.loading = true;
    this.pdgService.downloadPdgTemplate(this.ruleId).subscribe((response : HttpResponse<Blob>) => {  
      let fileName ;
      let headerValue = response.headers.get('Content-Disposition'); 
      if(headerValue != null && headerValue != undefined) {
         let templateName = headerValue.split('=')[1];
         if(templateName != null && templateName != undefined) {
          fileName = templateName.trim();
         }
      } 
      
      this.fileManagerService.createDownloadFileElement(response.body, fileName);
      this.loading = false;
    });
  }


}
