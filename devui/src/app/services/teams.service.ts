import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../shared/models/routing-constants';
import { BaseResponse } from '../shared/models/base-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private baseURL = `${environment.restServiceUrl}${RoutingConstants.TEAMS_URL}`

  constructor(private http: HttpClient) { }

  getTeamsFromUser(userId: number) {
    return this.http.get<BaseResponse>(`${this.baseURL}/${RoutingConstants.USER_TEAMS_URL}?userId=${userId}`);
  }

  /**
   * getUsersFromteam
   * @param teamId 
   * @returns 
   */
  getUsersFromTeam(teamId: number) {
    return this.http.get<BaseResponse>(`${this.baseURL}/${RoutingConstants.TEAM_MEMBERS_URL}?teamId=${teamId}`);
  }

  /**
   * getUsersFromMulitpleteam 
   * @param teamList list of teamIds to send towards the backend
   * @returns Lists of assignees
   */
  getUsersFromMulitpleTeam(teamList: number[]) {
    const param = this.buildTeamUrlParam(teamList);
    return this.http.get<BaseResponse>(`${this.baseURL}/${RoutingConstants.TEAM_MEMBERS_URL}?teamId=${param}`);
  }

  getTeamCounters(teamId: number, userId: number) {
    return this.http.get<BaseResponse>(`${this.baseURL}/${RoutingConstants.TEAM_COUNTERS_URL}?teamId=${teamId}&userId=${userId}`);
  }


  buildTeamUrlParam(teamList: number[]) {
    let params = '';
    if (teamList && teamList.length > 1) {
      params += teamList.shift();
      teamList.forEach(value => { params += `&teamId=${value}` });
    }
    return params;
  }
}
