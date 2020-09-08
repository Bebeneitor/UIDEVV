import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';

@Injectable({
  providedIn: 'root'
})
export class EllSearchService {

  constructor(private http: HttpClient) { }

  /**
   * Will change in the future with a real value from data base
   */
  loadReleaseLogKey() {
    return this.http.get(environment.restServiceUrl + RoutingConstants.ELL_URL + '/' + RoutingConstants.ELL_DECISION_URL + '/' + RoutingConstants.ELL_LAST_RELEASE_KEY);
  }

  loadPolicies(releaseLogKey: number) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.ELL_URL + '/' + RoutingConstants.ELL_POLICY + '/' + RoutingConstants.ELL_GET_POLICIES + '/' + releaseLogKey);
  }

  loadTopics(policyId: number, releaseLogKey: number) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.ELL_URL + '/' + RoutingConstants.ELL_TOPIC + '/' + RoutingConstants.ELL_GET_TOPICS + '/' + policyId + '/' + releaseLogKey);
  }

  loadDecisions(topicKey: number, releaseLogKey: number) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.ELL_URL + '/' + RoutingConstants.ELL_DECISION_URL + '/' + RoutingConstants.ELL_GET_DECISIONS + '/' + topicKey + '/'  + releaseLogKey);
  }

  loadFilterResult(filterinfo: any){
    return this.http.post(environment.restServiceUrl + RoutingConstants.ELL_URL + '/' + RoutingConstants.ELL_POLICY + '/' + RoutingConstants.ELL_FILTERS,filterinfo);
  }
}
