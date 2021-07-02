import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProcedureCodeBoxComponent } from '../modules/rule-creation/provisional-rule/components/procedure-code-box/procedure-code-box.component';
import { BaseResponse } from '../shared/models/base-response';
import { RoutingConstants } from '../shared/models/routing-constants';
import { ProcCodesUtils } from '../modules/rule-creation/provisional-rule/components/procedure-code-box/proc-box-helper/proc-codes-utils';
import { ProvisionalRuleDto } from '../shared/models/dto/provisional-rule-dto';
import { Constants } from 'src/app/shared/models/constants';

@Injectable({
    providedIn: 'root'
  })
export class ProcedureCodesService {
    /** Validation result for each procedureCodeBox. */
    codeBoxValRes:any = {};
    /** Rule creation we can have many rules. this is the validation results per rule. */
    rulesCodeBoxValRes = {};
    /** procCodeDto attr vs box Title */
    relTitleProperty = {
      'Deny': 'denyCodes',
      'Deny(Or)': 'denyOrCodes' ,
      'Billed With(Or)': 'billedWithOR' ,
      'Billed With(And)': 'billeWithAnd' ,
      'Billed Without(Or)': 'billedWithOutOr' ,
      'Billed Without(And)': 'billedWithOutAnd' ,
      'Pending Procedure Codes': 'pendingProcedureCodes' ,
      'Include Codes': 'includeCodes',
      'Diagnosis Codes': 'diagnosisCodes' 
    };

    httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST'
      })
  };

    procCodeBoxes: ProcedureCodeBoxComponent[] = [];
    constructor(private http: HttpClient) { }

  validateCodes(codesList: string[], codeType:string):Observable<BaseResponse> {
      return this.http.post<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/${RoutingConstants.PROC_CODES_VALIDATE}/${codeType}`,
        codesList);
  }

  validateProcedureCodes(request: any, codeType:string):Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/${RoutingConstants.VALIDATE_PROC_CODES}/${codeType}`,
    request);
  }

  /**
   * Register a procedure code box.
   * @param codeBox ProcedureCodeBox to register.
   */
  registerCodeBox(codeBox: ProcedureCodeBoxComponent) {
    if (!codeBox) {
      return;
    }
    let found = this.procCodeBoxes.find(cb => cb.boxTitle === codeBox.boxTitle);
    if (found) {
      this.procCodeBoxes = this.procCodeBoxes.filter(cb => cb.boxTitle !== codeBox.boxTitle);
    }
    this.procCodeBoxes.push(codeBox);
    this.codeBoxValRes[codeBox.boxTitle] = {
      name: codeBox.boxTitle,
      codeType: codeBox._procCodeType,
      validated: false,
      isDirty: false,
      validCodes: [],
      invalidCodes: [], 
      codesString: ''
    };
    codeBox.onValidationResult.subscribe( ev => this.processCodeBoxValidationResult(ev));
  }
  /**
   * Unregister a procedure code box.
   * @param codeBox ProcedureCodeBox to unregister.
   */
  unregisterCodeBox(codeBox: ProcedureCodeBoxComponent) {
    this.procCodeBoxes = this.procCodeBoxes.filter(cb => cb !== codeBox);
    codeBox.onValidationResult.unsubscribe();
  }

  /**
   * Tell all code boxes to validate codes.
   */
  validateAllCodeBoxes() {
    this.procCodeBoxes.forEach(cb => cb.validateProcedureCodes());
  }

  /**
   * Response to a Validation Result notification from code boxes.
   * @param valRes {name: String, validated: boolean, 
   *  validCodes: string[], invalidCodes:]} Validation result.
   */
  processCodeBoxValidationResult(valRes: any) {
    if (valRes) {
      if (!this.codeBoxValRes[valRes.name]) {
        this.codeBoxValRes[valRes.name] = valRes;
      }
      if (valRes.validated) {
        this.codeBoxValRes[valRes.name] = valRes;
      } else {
        this.codeBoxValRes[valRes.name].validated = false;
        this.codeBoxValRes[valRes.name].isDirty = valRes.isDirty;
      }
    }
  }
  /**
   * Get procedure code boxes names (comma separated) thas have not been validated.
   * (iterates over each registered rule)
   */
  getCodeBoxesNotValidated(): string {
    let notValidated = [];
    for (let rId in this.rulesCodeBoxValRes) {
      let codeBoxValRes = this.rulesCodeBoxValRes[rId];
      if (!codeBoxValRes) {
        continue;
      }
      for (let bn in this.relTitleProperty) {
        if (codeBoxValRes[bn] && codeBoxValRes[bn].isDirty && !codeBoxValRes[bn].validated &&
          codeBoxValRes.ruleDto && codeBoxValRes.ruleDto.procedureCodeDto &&
          codeBoxValRes.ruleDto.procedureCodeDto[this.relTitleProperty[bn]]) {
          notValidated.push(bn);
        }
      }
    }
    let setNotVal = new Set(notValidated);
    return [...setNotVal].join(', ');
  }
  /**
   * Check if one codeBox has invalid codes.
   * (iterates over all registered rules)
   */
  hasInvalidCodes(): string {
    let hasInvalid = [];
    for (let rId in this.rulesCodeBoxValRes) {
      let codeBoxValRes = this.rulesCodeBoxValRes[rId];
      if (!codeBoxValRes) {
        continue;
      }
      for (let bn in this.relTitleProperty) {
        if (codeBoxValRes[bn]
            && codeBoxValRes[bn].invalidCodes
            && codeBoxValRes[bn].invalidCodes.length > 0) {
          hasInvalid.push(bn);
        }
      }
    }
    let setHasInv = new Set(hasInvalid);
    return [...setHasInv].join(', ');
  }
  /**
   * Determine if one code box has changed at least one code
   * (to be used in Rule Maintenance Process)
   */
  hasCodesChanges() {
    return this.procCodeBoxes.filter(cb => cb.hasCodesChanges()).length > 0;
  }
  /**
   * Remove invalid codes fron all procedure codes boxes 
   * for all provisional rules Dtos.
   */
  removeAllInvalidCodes(provRuleDtos: ProvisionalRuleDto[]) {
    if (!provRuleDtos) {
      return;
    }
    provRuleDtos.forEach(provRule => {
      if (provRule.ruleInfo && provRule.ruleInfo.ruleId) {
        // for each provRule, determine validation result:
        let codeBoxValRes = this.rulesCodeBoxValRes[provRule.ruleInfo.ruleId];
        for (let bn in codeBoxValRes) {
          // and remove invalid codes for each code category:
          if (codeBoxValRes[bn]
              && codeBoxValRes[bn].invalidCodes
              && codeBoxValRes[bn].invalidCodes.length > 0) {
              let newCodesString = this.removeInvalidCodes(codeBoxValRes[bn]);
             // provRule.procedureCodeDto[this.relTitleProperty[bn]] = newCodesString;
             // provRule.ruleInfo.procedureCodeDto = provRule.procedureCodeDto;
          }
        }
      }
    });
  }
  /**
   * Remove invalid codes according to Valudation Codes result.
   * @param valStatRes Validation status result.
   * @returns string representing only valid codes.
   */
  private removeInvalidCodes(valStatRes: any):string {
    if (!valStatRes || !valStatRes.codesString || !valStatRes.invalidCodes) {
      return valStatRes.codesString;
    }
    let invalidCodes:string[] = valStatRes.invalidCodes.map(c => c.codeName);
    // A list of procedure codes.
    let codes:string[] = valStatRes.codesString.split(ProcCodesUtils.CODE_LIST_SEP)
      .map(c => c.trim());
    let validCodes:string[] = [];
    codes.forEach(cd => {
      if (cd) {
        // for each code, determine if it is a range codes.
        let parts:string[] = cd.split(ProcCodesUtils.CODE_RANGE_SEP)
          .map(p => p.trim());
        let startValid = parts[0] && invalidCodes.indexOf(parts[0]) < 0;
        let endValid =  parts[1] && invalidCodes.indexOf(parts[1]) < 0;
        if (startValid) {
          if (endValid) {
            // a valid range code.
            validCodes.push(parts[0] + ProcCodesUtils.CODE_RANGE_SEP) + parts[1];
          } else {
            // only start part is valid code.
            validCodes.push(parts[0]);
          }
        } else if (endValid) {
          // only end part is valid
          validCodes.push(parts[1]);
        }
      }
    });
    return validCodes.join(ProcCodesUtils.CODE_LIST_SEP);
  }

  /**
   * Validate.
   * @param action action to validete ('submit' | 'save')
   */
  validate(action: string):any {
    let message = '';
    let result = true;
    let reqValidation = false;
    let removeInvalid = false;
    let notValidated = this.getCodeBoxesNotValidated();
    if (notValidated.length > 0) {
        message = `Not validated codes: ${notValidated}.\nPlease, validate all codes`;
        reqValidation = true;
        result = false;
    } else {
      let invCodes = this.hasInvalidCodes();
      if (invCodes) {
          message = `You have invalid codes in ${invCodes} and will be removed.\nDo you want to proceed?`;
          removeInvalid = true;
          result = false;
      }
    }
    return {action: action, result: result, 
      message: message, removeInvalid: removeInvalid, notValidated: reqValidation};
  }
  /**
   * Get latest validataion result.
   * @param boxName Procedure codes box name.
   */
  getLatestValidationResult(boxName: string): any[] {
    if (!this.codeBoxValRes[boxName]) {
      // no validation Generate one default.
      this.codeBoxValRes[boxName] = {
        name: boxName,
        validated: false,
        isDirty: false,
        validCodes: [],
        invalidCodes: []
      };
      return [];
    }
    if (!this.codeBoxValRes[boxName].validCodes) {
      this.codeBoxValRes[boxName].validCodes = [];
    }
    if (!this.codeBoxValRes[boxName].invalidCodes) {
      this.codeBoxValRes[boxName].invalidCodes = [];
    } 
    return this.codeBoxValRes[boxName].validCodes
      .concat(this.codeBoxValRes[boxName].invalidCodes);
  }
  /**
   * Select current ruleId (used by ProvRule Screen when multiple provRues can be created)
   * @param ruleId current ruleId value.
   */
  setActiveRuleInfo(rule: any) {
    if (!rule || !rule.ruleId) {
      return;
    }
    this.registerRule(rule);
    this.codeBoxValRes = this.rulesCodeBoxValRes[rule.ruleId];
    this.procCodeBoxes.forEach(pcb => {
      let valRes = this.codeBoxValRes[pcb.boxTitle];
      if (!valRes || !valRes.validated) {
        pcb.resetValidationStatus();
      } else {
        pcb.processValidationResult(this.getLatestValidationResult(pcb.boxTitle));
      }
    })  
  }
  /**
   * Remove a rule Id from registered rules.
   * @param ruleId ruleId to remove.
   */
  removeRuleInfoData(ruleId: number) {
    this.rulesCodeBoxValRes[ruleId] = null;
  }
  /**
   * Remove all rule related data.
   */
  removeAllRuleInfoData() {
    this.rulesCodeBoxValRes = {};
    this.codeBoxValRes = {};
  }

  /**
   * Register rules.
   * @param rulesData Rules to register.
   */
  registerRules(rulesData: any[]) {
    if (!rulesData) {
      return;
    }
    rulesData.forEach(rd => {
      this.registerRule(rd);
    });
  }
  /**
   * Register a rule to track validation resuls.
   * @param ruleId rule id.
   */
  private registerRule(rule: any) {
    if (!rule || !rule.ruleId) {
      return;
    }
    if (!this.rulesCodeBoxValRes[rule.ruleId]) {
      let codeBoxValRes = { ruleDto: rule};
      this.procCodeBoxes.forEach(cb => {
        codeBoxValRes[cb.boxTitle] = {
          name: cb.boxTitle,
          validated: false,
          isDirty: false,
          validCodes: [],
          invalidCodes: [],
          codesString: ''
        }
      });
      this.rulesCodeBoxValRes[rule.ruleId] = codeBoxValRes;
    }
  }

  public validateUploadedProcCodes(procCodeFile: File, uploadRuleCodeRequest: any): Observable<any> {
    const formData = new FormData();
    let existingCodeListString = "";
    if(uploadRuleCodeRequest != null) {
      existingCodeListString = JSON.stringify(uploadRuleCodeRequest);
    }
    
    formData.append('existingHcpcsCptCodeData', new Blob([existingCodeListString],{type: "application/json"}));

    formData.append('hcpcsCptCodeFile', procCodeFile, procCodeFile.name);

    return this.http.post<any>(`${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/validate-procedurecodes-file`,
    formData, this.httpOptions);
  }

  
  downloadCodeTemplate(templateType : string) {
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.TEMPLATE_FILE_MANAGER_URL}/${RoutingConstants.DOWNLOAD_TEMPLATE}`;
    return this.http.get(apiUrl, { responseType: 'blob', params: new HttpParams().append('ruleCodeType', templateType) });
  }

  /** Service method to delete selected rule code */
  deleteRuleCode(request: any): Observable<BaseResponse> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: request
    };
    return this.http.delete<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/${RoutingConstants.DELETE_RULE_CODE_URL}`,
      options);
  }

  /** Service method to delete the unsaved draft status type codes */
  deleteDraftRuleCodes(codeType: string, ruleId: number): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/${codeType}/${ruleId}`);
  }

  /** Service method to clone the procedure codes when the rule is cloned */
  cloneRuleCodes(newRuleId: number, oldRuleId: number, codeType: string): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/${RoutingConstants.CLONE_RULE_CODE_URL}/${newRuleId}/${oldRuleId}/${codeType}`);
  }


  deleteProcedureRule(codesId: number[]){

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: codesId
    };

    return new Promise((resolve, reject) => {
      if (!codesId.some(isNaN)) {
        let uri = `${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/proc-code`;
        this.http.delete(uri, options).subscribe((baseReponse: BaseResponse) => {
            resolve(baseReponse.data);
        });
    } else {
        reject(Constants.INVALID_ARGUMENTS_ONLY_NUMERIC);
    }
    });
  }

  /**
   * Recovers the selected code.
   * @param codes to be recovered.
   */
  recoverCodes(codesId: number[]){
    let uri = `${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/recover-codes`;
    return this.http.post(uri, codesId, this.httpOptions);
  }

  /**
   * Recovers the selected code.
   * @param codes to be recovered.
   */
  recoverICDCodes(request){
    let uri = `${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/recover-icd-codes`;
    return this.http.post(uri, request, this.httpOptions);
  }

}