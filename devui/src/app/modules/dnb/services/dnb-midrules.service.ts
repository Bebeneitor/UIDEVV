import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BaseResponse } from "src/app/shared/models/base-response";
import { environment } from "src/environments/environment";
import { ELLMidRulesResponse, MidRule } from "../models/interfaces/midRule";
import { apiMap, apiPath } from "../models/path/api-path.constant";
const BASE_URL = environment.restServiceDnBUrl;
@Injectable({
  providedIn: "root",
})
export class DnBMidrulesService {
  private midRulesUrl: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.midRulesTemplates}`;
  constructor(private http: HttpClient) {}

  getMidRules() {
    return this.http
      .get<BaseResponse>(this.midRulesUrl)
      .pipe(map((response) => response.data));
  }

  getMidRulesAdmin() {
    const midRulesUrl: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.midRulesAdmin}`;
    return this.http
      .get<BaseResponse>(midRulesUrl)
      .pipe(map((response) => response.data));
  }

  addMidRules(midRule: MidRule) {
    const midRulesUrl: string = `${this.midRulesUrl}`;
    return this.http
      .post<BaseResponse>(midRulesUrl, {
        midRuleTemplateId: midRule.midRuleTemplateId,
        reasonCode: midRule.reasonCode,
        template: midRule.template,
        templateInformation: midRule.templateInformation,
        isActive: midRule.isActive,
      })
      .pipe(map((response) => response.data));
  }

  updateMidRules(midRule: MidRule) {
    const midRulesUrl: string = `${this.midRulesUrl}/${midRule.midRuleTemplateId}`;
    return this.http
      .put<BaseResponse>(midRulesUrl, {
        midRuleTemplateId: midRule.midRuleTemplateId,
        reasonCode: midRule.reasonCode,
        template: midRule.template,
        templateInformation: midRule.templateInformation,
        isActive: midRule.isActive,
      })
      .pipe(map((response) => response.data));
  }

  updateStatusMidRules(midRule: MidRule) {
    const midRulesUrl: string = `${this.midRulesUrl}/${midRule.midRuleTemplateId}`;
    return this.http
      .patch<BaseResponse>(midRulesUrl, { isActive: midRule.isActive })
      .pipe(map((response) => response.data));
  }

  lockMidRule(midRuleId: number) {
    const midRulesUrl: string = `${this.midRulesUrl}/${midRuleId}/lock`;
    return this.http.post(midRulesUrl, {});
  }

  unlockMidRule(midRuleId: number) {
    const midRulesUrl: string = `${this.midRulesUrl}/${midRuleId}/unlock`;
    return this.http.delete(midRulesUrl);
  }

  searchMidRuleExisting(midRule) {
    const midRulesUrlSearch: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.midRulesSearch}`;
    return this.http
      .post(midRulesUrlSearch, {
        midRuleFilter: midRule.midRuleFilter,
        ruleLogicFilter: midRule.ruleLogicFilter,
      })
      .pipe(
        map((response: any) => {
          return response.data.dtoList;
        })
      );
  }

  getRulesDrugCode(drugCode: string): Observable<ELLMidRulesResponse[]> {
    return this.http
      .get(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.getELLRules}${apiPath.ellRulesDrugCode}${drugCode}`
      )
      .pipe(map((response: any) => response.data));
  }

  getRulesTopicName(topicName: string): Observable<ELLMidRulesResponse[]> {
    return this.http
      .get(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.getELLRules}${apiPath.ellRulesTopicName}${topicName}`
      )
      .pipe(map((response: any) => response.data));
  }
}
