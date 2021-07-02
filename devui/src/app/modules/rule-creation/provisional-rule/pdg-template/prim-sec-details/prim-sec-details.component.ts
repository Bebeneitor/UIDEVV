import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PdgTemplateService } from 'src/app/services/pdg-template.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { AppUtils } from 'src/app/shared/services/utils';
import * as _ from 'underscore';

@Component({
  selector: 'app-prim-sec-details',
  templateUrl: './prim-sec-details.component.html',
  styleUrls: ['./prim-sec-details.component.css']
})
export class PrimSecDetailsComponent implements OnInit {

  disabled: boolean = true;
  primSelected: string = '';
  secSelected: string = '';

  @Input("pdgOption") pdgOption: any;
  @Input() provDialogDisable: boolean;
  _ruleInfo: any = null;
  @Input() set ruleInfo(data: any) {
    if (data) {
      this._ruleInfo = data;
      this.primSelected = this._ruleInfo.pdgTemplateDto.primaryReferenceTitle;
      this.secSelected = this._ruleInfo.pdgTemplateDto.secondaryReferenceTitle;
      this.enableSecondaryIfValueExists();
    }
  }

  _optionsObj: any;
  @Input() set optionsObj(options: any){
    if(options){
      this._optionsObj = options;
      this.enableSecondaryIfValueExists();
    }
  }

  refTitleOpts: any[] = []
  constructor(private toastService: ToastMessageService) { }

  ngOnInit() {
  }

  enableSecondaryIfValueExists() {
    if (this._ruleInfo.pdgTemplateDto && this._optionsObj && this._optionsObj.secondaryTitleOpts.length > 1 
      && this._ruleInfo.pdgTemplateDto.pdgId && this.disabled === true) {
      this.enableSecondary();
    }
  }

  enableSecondary() {
    this.disabled = false;
    if (this.primSelected && this.secSelected && this.primSelected === this.secSelected) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Primary & Secondary Title should not be same!');
      this.secSelected = '';
      this.secondaryChange();
    }
    this._optionsObj.secondaryTitleOpts.forEach(elem => {
      if (elem.value === this.primSelected && elem.value != '') {
        elem.disabled = true;
      } else {
        elem.disabled = false;
      }
    });
    this._ruleInfo.pdgTemplateDto.primaryReferenceTitle = this.primSelected;
  }

  secondaryChange() {
    this._ruleInfo.pdgTemplateDto.secondaryReferenceTitle = this.secSelected;
  }
}
