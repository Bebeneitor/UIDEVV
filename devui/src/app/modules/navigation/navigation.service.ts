
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private http: HttpClient) { }

  /**
   * Get rule status
   * @param ruleId 
   */
  getRuleStage(ruleId) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + ruleId + "/" + RoutingConstants.STAGE_STATUS_ID_URL, {});
  }

  /**
   * Get idea status
   * @param ideaId 
   */
  getIdeaStage(ideaId) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.IDEAS_URL + "/" + ideaId + "/" + RoutingConstants.STAGE_STATUS_ID_URL, {});
  }
}
