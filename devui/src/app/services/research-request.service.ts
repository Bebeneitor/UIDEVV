import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectRequestDto } from '../modules/research-requests/models/dto/project-request-dto';
import { BaseResponse } from '../shared/models/base-response';
import { ResearchRequestDto } from '../shared/models/dto/research-request-dto';
import { ResearchRequestSearchedRuleDto } from '../shared/models/dto/research-request-searched-rule-dto';
import { RoutingConstants } from '../shared/models/routing-constants';

const requestURL = `${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}`;
const projectURL = `${environment.researchRequestServiceUrl}${RoutingConstants.PROJECT_REQUEST}`;

@Injectable({
  providedIn: 'root'
})
export class ResearchRequestService {

  constructor(private http: HttpClient) {
  }
  public saveResearchRequest(rrFormData: ResearchRequestDto): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}`, rrFormData);
  }

  public getResearchRequestDetails(rrId: number): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}/${rrId}`);
  }

  public getResearchRequestClients(): Observable<any> {
    return this.http.get<any>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RESEARCH_REQUEST_CLIENTS_URL}`);
  }

  public getRRSuperPayersByClient(clientIds): Observable<any> {
    const requestParams = new HttpParams().append('clientIds', clientIds);
    return this.http.get(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RESEARCH_REQUEST_CLIENTS_URL}${RoutingConstants.RESEARCH_REQUEST_SUPER_PAYERS_URL}`,
      { params: requestParams })
  }

  public getRRPayersByClientAndStatus(clientIds, payerStatusIds): Observable<any> {
    const requestParams = new HttpParams()
      .append('clientIds', clientIds)
      .append('payerStatusIds', payerStatusIds);

    return this.http.get(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RESEARCH_REQUEST_CLIENTS_URL}${RoutingConstants.RESEARCH_REQUEST_PAYERS_URL}`,
      { params: requestParams })
  }

  public getResearchRequestClientProjects(): Observable<any> {
    return this.http.get<any>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RESEARCH_REQUEST_CLIENT_PROJECT_URL}`);
  }
  public getAllResearchRequestsUnassigned(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.UNASSIGNED_LIST}`);
  }
  public getMyResearchRequests(userId: number, requestInd: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RR_BY_USER}${userId}/${requestInd}`);
  }
  public claimResearchRequestUnassigned(researchRequestBody: any): Observable<any> {
    return this.http.post(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.CLAIM_UNASSIGNED}`, researchRequestBody);
  }
  public getRuleSearch(searchParam): Observable<any[]> {
    return this.http.get<any[]>(`${environment.restCrossWalkServiceUrl}${RoutingConstants.CROSSWALK_URL}${RoutingConstants.RR_RULES_URL}${RoutingConstants.RR_RULE_DETAILS_URL}`,
      { params: new HttpParams().set('ruleEngineId', searchParam.ruleEngineId).set('ruleIds', searchParam.ruleIds) });
  }

  public getRuleResponses(rrId: number): Observable<any> {
    return this.http.get<any>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}/${rrId}${RoutingConstants.RULE_RESPONSE_URL}`);
  }

  public deleteRuleResponse(ruleResponseMapID: number, ruleCode?: string): Observable<any> {

    return this.http.delete<any>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}/${ruleResponseMapID}`,
      { params: new HttpParams().set('ruleCode', ruleCode) });
  }
  public getRuleDetails(searchParam): Observable<any[]> {
    return this.http.get<any[]>(`${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.SEARCH_RESEARCH_REQUEST}`,
      { params: new HttpParams().set('ruleEngineId', searchParam.ruleEngineId).set('ruleIds', searchParam.ruleIds).set('newRequest', searchParam.newRequest) });
  }

  public getAssignedToByLastSubmittedRR(rrId: number): Observable<any> {
    return this.http.get<BaseResponse>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RR_ASSIGNEE_TO}/${rrId}`);
  }
  public initiateRrRuleImpactAnalysis(researchRequestBody: any): Observable<any> {
    return this.http.post(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RR_INITIATE_IMPACT_ANALYSIS}`, researchRequestBody);
  }

  public getRuleResponseIndicator(ruleId: number): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RR_RULE_RESPONSE_INDICATOR}/${ruleId}`);
  }

  public saveComments(commentsDto: ResearchRequestSearchedRuleDto): Observable<any> {
    return this.http.post<any>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RR_SAVE_COMMENTS}`, commentsDto);
  }
  public saveRrMapping(researchRequestBody: any): Observable<any> {
    return this.http.post(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.SAVE_RR_MAPPING}`, researchRequestBody);
  }

  public saveProvRrMapping(researchRequestBody: any): Observable<any> {
    return this.http.post(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.SAVE_PROV_RR_MAPPING}`, researchRequestBody);
  }

  public getJiraRefresh(rrId: string, researchRequestBody: any): Observable<any> {
    return this.http.post(`${environment.researchRequestServiceUrl}${RoutingConstants.JIRA_REQUEST_URL}${RoutingConstants.JIRA_ISSUE}/${rrId}`, researchRequestBody);
  }

  public updateJira(jiraId: string, researchRequestBody: any): Observable<any> {
    return this.http.post(`${environment.researchRequestServiceUrl}${RoutingConstants.JIRA_REQUEST_URL}${RoutingConstants.JIRA_ISSUE}/${jiraId}`, researchRequestBody);
  }

  public saveAssignedResearchRequestIdea(requestBody: any) {
    return this.http.post(`${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.REASSIGN_URL}`, requestBody);
  }

  public setResponseIndicator(requestBody: any) {
    return this.http.post(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.SAVE_RESPONSE_INDICATOR_URL}`, requestBody);
  }

  public reasignResearchRequest(researchRequestBody: any): Observable<any> {
    return this.http.post(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.REASSIGN_RR}`, researchRequestBody);
  }

  public getReassignementResearchRequests(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.REASSIGN_RR_LIST}`);
  }

  public isRuleCreatedFromRR(ruleId: number): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RR_RULE_RR_CODE}/${ruleId}`);
  }

  public getRRAttachments(rrId): Observable<any> {
    return this.http.get(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RESEARCH_REQUEST_ATTACHMENTS}/${rrId}`);
  }

  public startResearch(researchRequestBody: any): Observable<any> {
    return this.http.post(`${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RR_START_RESEARCH}`, researchRequestBody);
  }

  public cloneResearch(rrDto: ResearchRequestDto): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${requestURL}${RoutingConstants.RR_CLONE_RESEARCH}`, rrDto)
  }

  public getResearchCloneIssueLink(rrId: number): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${requestURL}${RoutingConstants.RR_ISSUE_LINK}/${rrId}`)
  }

  public getProjectCloneIssueLink(prId: number): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${projectURL}${RoutingConstants.RR_ISSUE_LINK}${RoutingConstants.GET_PROJECT_REQUEST}/${prId}`)
  }

  public getAuditLog(rrId: number): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${requestURL}${RoutingConstants.RR_AUDIT_DETAILS}/${rrId}`)
  }

  public getProjectRequest(prId: number): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${projectURL}${RoutingConstants.GET_PROJECT_REQUEST}/${prId}`);
  }

  public saveProjectRequest(projectDto: ProjectRequestDto): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${projectURL}`, projectDto);
  }

  public pushOrPullProjectRequestFromJira(jiraId: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${projectURL}${RoutingConstants.PROJECT_REQUEST_ISSUE}/${jiraId}`, {});
  }
}
