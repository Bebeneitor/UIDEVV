import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ImpactsService } from '../modules/rule-creation/provisional-rule/impacts/impacts.service';
import { Constants } from '../shared/models/constants';
import { RoutingConstants } from '../shared/models/routing-constants';
import { AppUtils } from '../shared/services/utils';
import { claimService } from './claim-service';
import { RuleInfoService } from './rule-info.service';
import { take } from 'rxjs/operators'
import { SelectItem } from 'primeng/api';
import { UtilsService } from './utils.service';
import { ReferenceSource } from '../shared/models/reference-source';
import { ReferenceService } from './reference.service';
import { BaseResponse } from '../shared/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class PdgTemplateService {

  constructor(private http: HttpClient, private utils: AppUtils, private impactsService: ImpactsService,
    private claimService: claimService, private ruleService: RuleInfoService, private utilsService: UtilsService, 
    private eclReferenceService: ReferenceService) { }

  getRefSourceOptions(optionsObj: any[]) {
    return new Promise(resolve => {
      this.utilsService.getAllReferences().subscribe((refs: []) => {
        refs.filter((ref: ReferenceSource) => {
          return ref.sourceDesc.toLowerCase().startsWith('state ');
        }).forEach((ref: ReferenceSource) => {
          optionsObj.push({ label: ref.sourceDesc, value: { id: ref.refSourceId, name: ref.sourceDesc } });
        })
        resolve(optionsObj);
      })
    });

  }

  getClaimTypeOptions(claimTypeOpts: any[]) {
    return new Promise(resolve => {
      this.claimService.getClaimTypes().subscribe(claimTypes => {
        claimTypes.forEach(claimType => {
          claimTypeOpts.push({ label: claimType.label, value: claimType.value });
        });
        resolve(claimTypeOpts);
      });
    });
  }

  getReasonCodeOptions(reasonCodeOpts) {
    return this.utils.getAllICMSLibraryReasoncodes(reasonCodeOpts);
  }

  getIndustryUpdateOptions(industryUpdateOpts: any[]) {
    return this.utils.getAllLookUpsByTypeAndDescription(Constants.ICMS_INDUSTRY_UPDATE, Constants.MCAID, industryUpdateOpts);
  }

  getCvCodeOptions(cvCodeOpts) {
    return new Promise(resolve => {
      this.impactsService.getCvCodes().subscribe(codes => {
        codes.forEach(cvCode => {
          cvCodeOpts.push({ label: cvCode.description, value: cvCode.id });
        });
        resolve(cvCodeOpts);
      });
    })
  }

  getRefTitleOptions(refTitleOpts) {
    let temp: SelectItem[] = [{ label: "Select...", value: '' }];
    refTitleOpts.primaryTitleOpts = temp;
    return this.utils.getAllLookUpsByTypeAndDescription(Constants.ICMS_REF_TITLE, Constants.STATE, refTitleOpts.primaryTitleOpts);
  }

  getMidRuleDescription(hppMr: number) {
    return this.ruleService.getMidRuleDescription(hppMr).pipe(take(1)).toPromise();
  }

  getUserId() {
    return this.utils.getLoggedUserId();
  }

  deleteReference(eclReferenceId: number) {
    return new Promise<void>(resolve=>{
      this.eclReferenceService.deleteEclReference(eclReferenceId).subscribe(response => {
        if (response.data !== null) {
          resolve();
        }
      });
    });
  }

  getPdgPreviewInfo(ruleId : any){
    const requestParams = new HttpParams().append('ruleId', ruleId);
    return this.http.get<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.PDG_TEMPLATE}/${RoutingConstants.PDG_PREVIEW}`, {params: requestParams });
  }

  downloadPdgTemplate(ruleId){
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.PDG_TEMPLATE}/${RoutingConstants.PDG_DOWNLOAD_TEMPLATE}`;
    return this.http.get(apiUrl, { responseType: 'blob' , observe: 'response', params: new HttpParams().append('ruleId', ruleId) });
  }

}
