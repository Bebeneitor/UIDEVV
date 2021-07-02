import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../shared/models/base-response';
import { ReturnRules } from '../shared/models/dto/return-rules';
import { SameSimInstanceDto } from '../shared/models/dto/same-sim-instance-dto';
import { RoutingConstants } from '../shared/models/routing-constants';
import { DashboardService } from './dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class SameSimService {

  constructor(private http: HttpClient, private dashboardService: DashboardService) { }

  getColumns() {
    return [
      { field: 'id', header: 'ID', width: '10%' },
      { field: 'name', header: 'Execution Name', width: '35%' },
      { field: 'createdBy', header: 'Created By', width: '25%' },
      { field: 'date', header: 'Date', width: '20%' },
      { field: 'options', header: 'Actions', width: '10%' }
    ];
  }


  ruleCodeColumn = { field: 'ruleCode', header: 'ID', width: '10%' };
  ruleNameColumn = { field: 'ruleName', header: 'Rule Name', width: '20%' };
  ruleLogicColumn = { field: 'ruleLogic', header: 'Rule Logic', width: '20%' };
  instanceNameColumn = { field: 'instanceName', header: 'Update Instance Name', width: '16%' };

  optionsColumn = { field: 'options', header: 'Codes Actions', width: '10%' };

  standardColumns = [this.ruleCodeColumn, this.ruleNameColumn, this.ruleLogicColumn, this.instanceNameColumn];

  

  getDetail(sameSimId, lookups) {
    let url = environment.restServiceUrl + RoutingConstants.SAME_SIM + '/' + RoutingConstants.SAME_SIM_DETAIL + '/' + sameSimId;

    return this.http.get(url).pipe(map((event: BaseResponse) => {

      event.data.sameSimInstanceDetailList = this.parseDetail(event.data.sameSimInstanceDetailList, lookups);

      return event;
    }));
  }

  getInstancesByUser(userId: number): Observable<any> {
    return this.http.get<any>(environment.restServiceUrl + RoutingConstants.SAME_SIM + '/' + RoutingConstants.SAME_SIM_INTANCES_USER + '/' + userId);
  }

  getInstanceById(instanceId:string) {
    return this.http.get<any>(`${environment.restServiceUrl}${RoutingConstants.SAME_SIM}/${instanceId}`);
  }

  getCountsSameSimWidget(userId: number, instanceId: number): Observable<any> {
    return this.http.get<any>(environment.restServiceUrl + RoutingConstants.WIDGETS_URL + '/' + RoutingConstants.SAME_SIM_COUTNS + '/' + userId + '/' + instanceId);
  }

  uploadXLSX(file) {

    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.FILE_MANAGER_URL + '/'}upload-file`;
    const formData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post<any>(apiUrl, formData, {});
  }

  processFile(eclFileId, name) {
    let url = environment.restServiceUrl + RoutingConstants.SAME_SIM + '/' + RoutingConstants.SAME_SIM_PROCESS_FILE;

    return this.http.post(url, {
      eclFileId: eclFileId,
      instanceName: name
    });
  }

  processIcdFile(eclFileId, name) {
    let url = environment.restServiceUrl + RoutingConstants.SAME_SIM + '/' + RoutingConstants.SAME_SIM_PROCESS_ICD_FILE;

    return this.http.post(url, {
      eclFileId: eclFileId,
      instanceName: name
    });
  }

  reassignRules(userId: number, rules: number[], role: string) {
    let params: HttpParams = new HttpParams();
    params = params.set("userId", userId.toString());
    params = params.set("rules", rules.toString());
    params = params.set("role", role);
    return this.http.post(environment.restServiceUrl + RoutingConstants.SAME_SIM + '/'
      + RoutingConstants.REASSIGNMENT_RULES, null, { params });
  }

  reassignRulesComments(userId: number, rules: number[], role: string, reassignDto: any, returned: boolean) {
    const url = `${environment.restServiceUrl}${RoutingConstants.SAME_SIM}/${RoutingConstants.REASSIGNMENT_RULES}`;
    return this.http.post(url, {
        userId: userId,
        rules: rules,
        role: role,
        eclLookupDto: reassignDto, 
        returned: returned
    });
  }

  parseDetail(detail, lookups) {

    let response = [];
    let keyDetails = [];

    for (var key in detail) {
      if (detail.hasOwnProperty(key)) {

        detail[key].forEach(item => {
          item.key = key;
          keyDetails.push(item);
        });

      }
    }

    keyDetails.forEach(item => {
      let json = {
        ruleId: item.rule.ruleId,
        ruleCode: item.rule.ruleCode,
        ruleName: item.rule.ruleName,
        ruleLogic: item.rule.ruleLogicOriginal,
        logicEffectiveDate: item.rule.ruleLogicEffDt,
      };

      if (json.ruleLogic == null) {
        json.ruleLogic = '-';
      }

      if (json.logicEffectiveDate == null) {
        json.logicEffectiveDate = '-';
      } else {
        json.logicEffectiveDate = this.dashboardService.parseDate(new Date(json.logicEffectiveDate));
      }

      lookups.forEach(l => {
        json[l.lookupDesc] = '-';
      });

      json[item.key] = item.procedureCodes;

      response.push(json);
    });

    let uniqueMap = {};

    response.forEach((item, index) => {
      if (uniqueMap[item.ruleCode] == undefined) {
        uniqueMap[item.ruleCode] = item;
      } else {
        lookups.forEach(l => {
          if (response[index][l.lookupDesc] != '-') {
            uniqueMap[item.ruleCode][l.lookupDesc] = item[l.lookupDesc];
          }
        });
      }
    });

    let uniqueResponse = [];

    for (var key in uniqueMap) {
      if (uniqueMap.hasOwnProperty(key)) {
        uniqueResponse.push(uniqueMap[key]);
      }
    }

    return uniqueResponse;
  }

  parseData(data) {

    let response = [];

    data.forEach(item => {

      let sameSim = new SameSimInstanceDto();

      sameSim.id = item.sameSimId;
      sameSim.name = item.name;
      sameSim.createdBy = item.createdBy.firstName + ' ' + item.createdBy.lastName;
      sameSim.date = this.dashboardService.parseDate(new Date(item.createdDt + "T00:00:00"));

      response.push(sameSim);
    });

    return response
  }


  public policyReturnedRules(returnRules: ReturnRules): Observable<any> {
    return this.http.post<any>(environment.restServiceUrl + RoutingConstants.SAME_SIM + "/" + RoutingConstants.SAME_SIM_RETURN_RULES_POLICY_OWNER_URL,
      returnRules);
  }
}
