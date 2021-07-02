import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../shared/models/routing-constants';
import { BaseResponse } from '../shared/models/base-response';
import { UserTeamCategoryMapRequestDto } from '../shared/models/dto/user-team-category-map-request-dto';
import { TeamDto } from '../shared/models/dto/team-dto';

@Injectable({
  providedIn: 'root'
})

export class FieldSelectionService {

    constructor(private http: HttpClient) { }

    getAllTeams(): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.ECL_USER_TEAM);
    }

    getUsersWithRolesByCategory(): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.ECL_USER_TEAM + "/"
            + RoutingConstants.ECL_USER_GET_CATEGORY_USER_ROLE);
    }

    saveTeam(request: TeamDto) {
        return this.http.post(environment.restServiceUrl + RoutingConstants.ECL_USER_TEAM, request);
    }

    saveUserCategoriesMap(request: UserTeamCategoryMapRequestDto) {
        return this.http.post(environment.restServiceUrl + RoutingConstants.USERS_URL + "/"
            + RoutingConstants.ECL_USER_SAVE_TEAM, request);
    }

}