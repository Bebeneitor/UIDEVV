import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { RoutingConstants } from '../shared/models/routing-constants';
const SEARCH_BY_NAME = "search-by-name";

@Injectable({
    providedIn: 'root'
})
export class RoleSetupService {

    constructor(private http: HttpClient){}

    getAllRoleFunctionalities(): Observable<any> {
        return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.ROLE_FUNCTIONALITIES_URL + "/");
    }

    getUserRoleFunctionalityElements(roleIds: any[]): Observable<any> {
        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.ROLE_FUNCTIONALITIES_URL + "/" + "elements", roleIds);
    }

	// Search on AD (LDAP) through ECL services
    searchUserByName(searchName: any): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + SEARCH_BY_NAME + "/" + searchName);
    }

    setUserAccess(userAccessObj: any): Observable<any> {
        if (userAccessObj.userId) {
            let userId = userAccessObj.userId;
            return this.http.put<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.USER_ACCESS_SETUP_URL + "/" + userId, userAccessObj);
        } else {
            return this.http.post<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.USER_ACCESS_SETUP_URL, userAccessObj);
        }

    }

    updateUserStatus(userId: number, status: string) {
        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.USER_ACCESS_SETUP_URL + "/" + userId + "?status=" + status, null);
    }

    getUserAccess(userId: any): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.USER_ACCESS_SETUP_URL + "/" + userId);
    }

    fetchAllUserSetUpCategoriesRC(): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.USER_SETUP_CATEGORIES_RC + "/");
    }

    fetchAllUserSetUpCategoriesRM(): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.USER_SETUP_CATEGORIES_RM + "/");
    }
    
    // Search on ECL DB through ECL services by username
    searchECLUserByUsername(username: string): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.USER_ACCESS_SETUP_URL + "/" + RoutingConstants.USER_SEARCH_BY_USERNAME + "/" + username);
    }

}

