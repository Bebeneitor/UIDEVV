import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from '../shared/models/users';
import { RoutingConstants } from '../shared/models/routing-constants';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {
  }

  public findAllUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/");
  }

  public getUserInfo(id): Observable<Users> {
    let resp = this.http.get<Users>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + id)
    return resp;
  }

  public getAllPolicyOwnerbyTeamsAndCategories(userId: number, categoryId: number): Observable<any> {
    return this.http.get<any>(`${environment.restServiceUrl}${RoutingConstants.USERS_URL}/${RoutingConstants.GET_POLICY_OWNER}/${userId}/${categoryId}`)
  }

  public checkUserPermission(user: any, allowedRoleId: any): boolean {

    let accessAllowed: boolean = false;

    user.roles.forEach(role => {
      if (!accessAllowed && role.role.roleId === allowedRoleId) {
        accessAllowed = true;
      }
    });
    return accessAllowed;
  }

  public getUserTeamCategoryAssignments(functionType: string): Observable<any> {
    return this.http.get<any>(`${environment.restServiceUrl}${RoutingConstants.USERS_URL}/${RoutingConstants.USER_TEAM_CATEGORY_ASSIGNMENTS}/${functionType}`);
  }

  public getPolicyOwnerByCategory(userId: number, categoryId: number): Observable<any> {
    return this.http.get<any>(`${environment.restServiceUrl}${RoutingConstants.USERS_URL}/${userId}/${categoryId}/${RoutingConstants.ECL_RM_REPORTING_TO_USER}`)
  }

}
