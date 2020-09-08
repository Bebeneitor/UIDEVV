import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { apiMap, apiPath } from "../models/path/api-path.constant";
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
}
