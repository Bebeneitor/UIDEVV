import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../shared/models/routing-constants';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private http: HttpClient) { }

  getPermissions(userId) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + userId + "/" + RoutingConstants.PERMISSIONS_URL, {
    });
  }
}
