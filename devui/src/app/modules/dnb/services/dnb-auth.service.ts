import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { apiMap, apiPath } from "../models/path/api-path.constant";
import { map } from "rxjs/operators";
const BASE_URL = environment.restServiceDnBUrl;

@Injectable({
  providedIn: "root",
})
export class DnbAuthService {
  constructor(private http: HttpClient) {}

  getDnbAuthToken(username, password) {
    const headers = new HttpHeaders().set(
      "Authorization",
      "Basic " + btoa(username + ":" + password)
    );

    return this.http.post<any>(
      `${BASE_URL}${apiMap.restServiceDnbAuth}${apiPath.authToken}`,
      {},
      { headers: headers }
    );
  }

  getRolePermissions(roleCode: string) {
    return this.http
      .get<any>(
        `${BASE_URL}${apiMap.restServiceDnbAuth}${apiPath.roles}${roleCode}${apiPath.permissions}`
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getDnbPermissions(userName: string) {
    return this.http
      .get<any>(
        `${BASE_URL}${apiMap.restServiceDnbAuth}${apiPath.authUsers}${userName}${apiPath.permissions}`
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
