import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IdeaInfo, IdeaInfo2 } from '../shared/models/idea-info';
import { NewIdeaResearchDto } from '../shared/models/dto/new-idea-research-dto';
import { RoutingConstants } from '../shared/models/routing-constants';


@Injectable({
  providedIn: 'root'
})
export class IdeaService {

  private requestBody: any;

  constructor(private http: HttpClient) { }

  getAllIdeaUsr(ruleStatus, userId): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.IDEAS_URL +
      "?userId=" + userId + "&statusId=" + ruleStatus);
  }

  getAllIdea(ruleStatus): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.IDEAS_URL +
      "?userId=1&statusId=" + ruleStatus);
  }

  getAllIdeaDupReview(): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.IDEAS_URL);
  }

  getIdeaAssignedReturned(statusId: number): Observable<any[]> {
    let resp = this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + "/" + RoutingConstants.IDEAS_BY_ASSIGNED_RETURNED_URL + "/" + statusId);
    return resp;
  }

  getIdeaInfo(ideaId: number): Observable<NewIdeaResearchDto> {
    let resp = this.http.get<NewIdeaResearchDto>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + "/" + ideaId);
    return resp;
  }

  findOneIdeaInfo(): Observable<any> {
    return this.http.get(environment.restServiceUrl + RoutingConstants.IDEAS_URL + "/" + RoutingConstants.IDEA_ID_TOP_URL);
  }

  /**
   * Find ideas and rules by search criteria and reserved words.
   * @param keyword that we need to search by.
   */
  findByNewIdeaSearch(keyword: String): Observable<any[]> {
    return this.http.get<IdeaInfo2[]>(`${environment.restServiceUrl}${RoutingConstants.IDEAS_URL}/${RoutingConstants.NEW_IDEA_RESEARCH_SEARCH_URL}/${keyword}`);
  }

  startIdea(ideaId: number): Observable<any> {
    return this.http.post(environment.restServiceUrl + RoutingConstants.IDEAS_URL + "/" + ideaId + "/" + RoutingConstants.START_IDEA_URL, '');
  }

  getNextProvisionalRuleId(): Observable<any> {
    return this.http.get(environment.restServiceUrl + RoutingConstants.PROVISIONAL_RULE_URL + '/' + RoutingConstants.PROVISIONAL_RULE_SEQUENCE_URL);
  }

  getExistProvisionalRulesByIdeaId(ideaId) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.PROVISIONAL_RULE_URL + '/' + RoutingConstants.PROVISIONAL_URL + '/' + ideaId);
  }

  deleteProvisionalRule(provisionalRuleId: any): Observable<any> {
    return this.http.delete<any>(environment.restServiceUrl + RoutingConstants.PROVISIONAL_RULE_URL + "/" + provisionalRuleId);
  }

  getAllReferenceInfo(ideaId: any): Observable<any[]> {
    let resp = this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + "/" + RoutingConstants.REFERENCE_INFO + "/" + ideaId);
    return resp;
  }

}
