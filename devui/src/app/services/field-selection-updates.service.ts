import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {RoutingConstants} from "../shared/models/routing-constants";
import {HttpClient} from "@angular/common/http";
import {Users} from "../shared/models/users";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FieldSelectionUpdatesService {

  constructor(private http: HttpClient) { }

  public getAllUsersForRM(): Observable<Users[]> {
    return this.http.get<Users[]>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.TEAM_USERS_RM);
  }

  public getAllTeamUsersForRC(): Observable<Users[]> {
    return this.http.get<Users[]>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.TEAM_USERS_RC);
  }

  public saveSelectedCategory(data): Observable<any> {
    let resp = this.http.post(environment.restServiceUrl + RoutingConstants.USERS_URL + '/' + RoutingConstants.SAVE_USER_CATEGORIES_MAP, data);
    return resp;
  }
}
