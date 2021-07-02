import { HttpClient, HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RuleReferenceUpdates } from '../shared/models/rule-reference-updates';
import { RuleInfo } from '../shared/models/rule-info';
import { ImpactDto } from '../shared/models/dto/impact-dto';
import { ReturnRules } from '../shared/models/dto/return-rules';
import { RoutingConstants } from '../shared/models/routing-constants';
import { BaseResponse } from '../shared/models/base-response';
import { Constants } from '../shared/models/constants';

const KEYWORD = "keyword=";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RuleInfoService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST'
    })
  };

  constructor(private http: HttpClient) {
  }

  getProvisionalRulesForPOApproval(status: string, first: number, last: number, keyword: string): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/"
      + RoutingConstants.PROVISIONAL_RULES_FOR_PO_URL + "/" + status + "?first=" + first + "&last=" + last
      + "&keyword=" + keyword);
  }

  getRuleInfo(ruleId: number): Observable<any> {
    let resp = this.http.get(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + ruleId);
    return resp;
  }

  getRuleReferenceUpdate(ruleId: number): Observable<any> {
    return this.http.get(environment.restServiceUrl + RoutingConstants.RULE_REFERENCE_UPDATES_URL + '/' + ruleId);
  }

  saveRuleReferenceUpdate(ruleReferenceUpdate: RuleReferenceUpdates): Observable<RuleReferenceUpdates> {
    return this.http.post<any>(environment.restServiceUrl + RoutingConstants.RULE_REFERENCE_UPDATES_URL, ruleReferenceUpdate);
  }

  getLibViewSearch(data): Observable<any[]> {
    let params = new HttpParams();

    Object.keys(data).forEach(function (key) {
      params = params.append(key, data[key]);
    });

    return this.http.get<RuleInfo[]>(environment.restServiceUrl + RoutingConstants.LIBRARY_VIEW_URL, { params: params });
  }
  /**
   *
   * @param impactDto
   *  Sending Values of Line of business, Categories and States.
   */
  saveInitiateImpact(impactDto: ImpactDto): Observable<any> {
    return this.http.post<any>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.IMPACTED_URL + "/" + RoutingConstants.INITIATE_URL, impactDto, this.httpOptions);
  }

  getImpactAnalysisRunDetails(runId: number): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.IMPACTED_URL}/${RoutingConstants.RUN_DETAIL_URL}/${runId}`);
  }

  mdReturnedRules(returnRules: ReturnRules): Observable<any> {
    return this.http.post<any>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.RETURN_RULES_URL, returnRules, this.httpOptions);
  }

  getRuleImpactAnalysisRun(ruleId: number): Observable<any> {
    return this.http.get(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.IMPACTED_URL + '/' + ruleId);
  }

  getRuleImpactAnalysis(ruleId: number, flowType: string): Observable<any> {
    if (Constants.SAMESIM_FLOW === flowType) {
      return this.http.get(`${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${ruleId}/${RoutingConstants.IMPACT_ANALYSIS}`);
    } else {
      return this.getRuleImpactAnalysisRun(ruleId);
    }

  }

  saveImpactRuleApproval(request: any): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.SAVE_IMPACT_RULE_APPROVAL_URL}`, request);
  }

  public getImpactedRulesForUsers(userId: any, pageName: string): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.IMPACTED_URL + '/' + RoutingConstants.BY_USERS_URL + '/' + userId + '?pageName=' + pageName);
  }

  public getImpactedRules(pageName: string): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.IMPACTED_URL + '?pageName=' + pageName);
  }

  public getImpactedRulesReturned(returnFromScreen): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.IMPACTED_URL + "?status=" + returnFromScreen);
  }

  public saveMdApproval(ruleId: number, comments: string, review_tatus: string): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.SAVE_RULE_APPROVAL_URL);
    /*  public getRuleRefUpdates(ruleImpactId: number): Observable<any>{
        return this.http.get(environment.restServiceUrl + RoutingConstants.RULES_URL + '/ruleRefUpdates/' + ruleImpactId);
      }*/

  }

  public getRulesReAssignedImpactAnalysis() {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.IMPACTED_URL);
  }
  public saveImpactAnalysis(impactAnalysisObj: any): Observable<any> {
    return this.http.put(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.IMPACTED_URL + '/' + RoutingConstants.REF_IMPACT_ANALYSIS_URL, impactAnalysisObj)
  }

  /**
   * Save Approval Status
   * @param lstAprrStatus Object containing:
   *   userId: Current User.
   *   stageId: Stage Id
   *   selectedIdeas: Array of objects:
   *      ruleId
   *      status: Approval Status desc.
   *      comments: Approval Status Comments.
   */
  public ruleMaintSaveApprovalStatus(lstAprrStatus: any): Observable<any> {
    return this.http.post(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.SAVE_IMPACT_RULE_APPROVAL_URL, lstAprrStatus);
  }

  public getValidApprovalStatus(ruleId, userId): Observable<any> {
    return this.http.get(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + ruleId + "/" + RoutingConstants.VALID_APPROVAL_STATUS_URL + "?userId=" + userId);
  }

  public getRulesByStatusAndUser(status: number, userId: any): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.STAGE_STATUS_ID_URL + "/" + status + "/" + userId);
  }

  submitMDApproval(data): Observable<any> {
    let resp = this.http.post(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.SUBMIT_RULE_APPROVAL_URL, data);
    return resp;
  }

  saveProvRuleApproval(data): Observable<any> {
    return this.http.post(`${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.SAVE_RULE_APPROVAL_URL}`, data)
  }

  public getRulesByParentId(parentRuleId: number): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.PARENT_RULE_URL + "/" + parentRuleId);
  }

  public getRuleHistory(ruleId: number, stageId: number): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.RULE_HISTORY_URL + "/" + ruleId + "/" + stageId);
  }

  public getRuleLatestVersion(ruleId: number): Observable<any> {
    return this.http.get<any>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.LATEST_VERSION_URL + '/' + ruleId);
  }

  public getOppValues(ruleId: number): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.OPP_VALUE_URL + "/" + ruleId);
  }
  public policyReturnedRules(returnRules: ReturnRules): Observable<any> {
    return this.http.post<any>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.RETURN_RULES_POLICY_OWNER_URL, returnRules, this.httpOptions);
  }

  public getProvisionalRulesForReassignmentAllUsers(pageNumber: number, elementsAmount: number, keyword: string = ''): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.ALL_RULES_RESEARCH_URL +
      '?' + RoutingConstants.PAGENUMBER + pageNumber + '&' + RoutingConstants.ELEMENTSAMOUNT + elementsAmount + '&' + KEYWORD + keyword);
  }

  public claimRules(requestBody: any): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/'
      + RoutingConstants.ASSIGN_RECORDS_URL, requestBody);
  }

  public reassignRules(requestBody: any): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/'
      + RoutingConstants.ASSIGN_RECORDS_URL, requestBody)
  }

  public reAssignRules(requestBody: any): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/"
      + RoutingConstants.REASSIGN_URL, requestBody)
  }

  public reAssignImpactAnalysis(requestBody: any): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/"
      + RoutingConstants.REASSIGN_IMPACT_ANALYSIS_URL, requestBody);
  }

  public getAllRuleProcedureCodes(ruleId: number): Observable<any> {
    return this.http.get(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + ruleId + "/" + "ruleProcedureCodes");
  }

  public getAllRuleProcedureCodesForRule(ruleId: number): Observable<any> {
    return this.http.get(environment.restServiceUrl + RoutingConstants.PROC_CODES_URL + "?ruleId=" + ruleId);
  }

  public getAllRuleProcedureDiagnosisCodesForRule(ruleId: number): Observable<any> {
    return this.http.get(environment.restServiceUrl + RoutingConstants.PROC_CODES_URL + '/' + RoutingConstants.PROC_CODES_URL_DIAGNOSIS + '?ruleId=' + ruleId);
  }

  /**
   *
   * @param impactDto
   *  Sending Values of Line of business, Categories and place of service and references selected.
   */
  public viewImpactedRules(impactDto: ImpactDto): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.VIEW_IMPACTED_RULES}`, impactDto, this.httpOptions);
  }

  public getMidRuleDescription(midRule: number): Observable<any>  {
    return this.http.get(`${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.MID_RULE_URL}?midRuleVersion=${midRule}`);
  }

  public getFirstCCAFromLibraryRule(ruleId: number, stageId: number, lookupCodes: any[]): Observable<any>{
    return this.http.get(`${environment.restServiceUrl}${RoutingConstants.RULES_URL}/workflow-status-list?ruleId=${ruleId}&stageId=${stageId}&lookupCodes=${lookupCodes}`);
  }

}
