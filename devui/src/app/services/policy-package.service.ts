import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PolicyPackage } from '../shared/models/policy-package';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../shared/models/routing-constants';

@Injectable({
  providedIn: 'root'
})
export class PolicyPackageService {

  constructor(private http: HttpClient) { }

  saveNewPolicyPackage(policyPackage: PolicyPackage): Observable<any> {
    return this.http.post<any>(environment.restServiceUrl + RoutingConstants.POLICY_PACKAGE, policyPackage);
}
}
