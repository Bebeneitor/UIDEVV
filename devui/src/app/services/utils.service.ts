import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { RoutingConstants } from '../shared/models/routing-constants';
import { EclLookups } from '../shared/models/ecl-lookups';
import { BaseResponse } from '../shared/models/base-response';
import { Constants } from '../shared/models/constants';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private http: HttpClient) { }

  getAllLOBs(): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.LOBS_URL);
  }

  getAllStates(): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.STATES_URL);
  }

  getAllModifiers(): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.MODIFIERS_URL);
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.CATEGORIES_URL);
  }

  getAllCategoriesFromCache(): Observable<any[]> {
    return this.http.get<any[]>(Constants.redisCacheUrl + RoutingConstants.CATEGORIES_URL);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.USERS_URL);
  }

  getUsersByRole(roleId: any): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.ROLES_URL + "/" + roleId);
  }

  getUsersByRoleName(roleName: String): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.ROLES_URL+ "?roleName=" + roleName );
  }

  getUserNameByUserId(userId: any): Observable<any> {
    return this.http.get<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + userId);
  }

  findAllCCAsOfPO(policyOwnerUserId: any): Observable<any> {
    return this.http.get<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + policyOwnerUserId + "/" + RoutingConstants.ASSIGNED_CCAS_URL);
  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.ROLES_URL);
  }

  getAllRuleEngines(): Observable<any> {
    return this.http.get<any>(environment.restServiceUrl + RoutingConstants.RULE_ENGINES_URL + "/");
  }

  getAllTeams() : Observable<any>{
    return this.http.get<any>(environment.restServiceUrl + RoutingConstants.TEAMS_URL + "/");
  }

  getAllCIJiraTeams() : Observable<any>{
    return this.http.get<any>(environment.restServiceUrl + RoutingConstants.TEAMS_CI_JIRA_URL);
  }

  getCacheUrl(): Observable<any> {
    return this.http.get<any>(environment.restServiceUrl + RoutingConstants.CACHE_ENV_URL);
  }

  getAllFunctionalityAccess(): Observable<any> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.FUNCTIONALITIES_URL + "/");
  }

  getAllJurisdictions() {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.JURISDICTIONS_URL);
  }

  getAllReferences() {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.REF_SOURCES_URL);
  }

  getAllFrequencies() {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.FREQUENCIES_URL);
  }

  getAllSpecialityTypes() {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.SPECIALITY_TYPES_URL);
  }

  getLookupsByTypeAndCodeList(type: string, codes: string[]): Observable<EclLookups[]> {
    return this.http.get<EclLookups[]>(environment.restServiceUrl + RoutingConstants.LOOKUPS_URL + "/"
      + RoutingConstants.LOOKUPS_TYPE_AND_CODES_URL + "?type=" + type + "&codes=" + codes.toString());
  }

  getLookupsByTypeAndDescription(type: string, description: string): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.LOOKUPS_URL + "/"
      + RoutingConstants.LOOKUPS_TYPE_AND_DESCRIPTION + "?type=" + type + "&description=" + description);
  }

  getAllICMSLibraryReasoncodes(): Observable<any> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.PDG_TEMPLATE + "/"
      + RoutingConstants.ICMS_REASON_CODES);
  }

  getAllLookUps(lookupType): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.LOOKUPS_URL + '?type=' + lookupType);
  }

  getIcmsCatalog(): Observable<any> {
    return this.http.get<any>(environment.restServiceUrl + RoutingConstants.ICMS_CATALOG_URL);
  }

  getAllLookUpsSubspeciality(claimType): Observable<any[]> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.LOOKUPS_URL + '/' + RoutingConstants.TYPE_LINK_URL + '?type=' + claimType);
  }

  getOneState(stateId): Observable<any> {
    let resp = this.http.get<any>(environment.restServiceUrl + RoutingConstants.STATES_URL + "/" + stateId);
    return resp;
  }

  getOneJurisdiction(jurisdictionId): Observable<any> {
    let resp = this.http.get<any>(environment.restServiceUrl + RoutingConstants.JURISDICTIONS_URL + "/" + jurisdictionId);
    return resp;
  }

  getOneLineOfBusiness(lobId): Observable<any> {
    let resp = this.http.get<any>(environment.restServiceUrl + RoutingConstants.LOBS_URL + "/" + lobId);
    return resp;
  }

  getOneCategory(catId): Observable<any> {
    let resp = this.http.get<any>(environment.restServiceUrl + RoutingConstants.CATEGORIES_URL + "/" + catId)
    return resp;
  }

  getAllRevenueCodes(): Observable<BaseResponse>{
    return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.REVENUE_CODE_URL + "/");
  }

  getAllActiveUsers(): Observable<BaseResponse>{
    return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.ACTIVE_USERS_SUMMARY);
  }

  getAllCCAsPOs(): Observable<BaseResponse>{
    return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.FIND_ALL_CCAS_PO_URL);
  }

  getAllPOs(): Observable<BaseResponse>{
    return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.FIND_ALL_PO_URL);
  }

  getAllPolicyPackage(): Observable<BaseResponse>{
    return this.http.get<BaseResponse>(environment.restServiceUrl + "policy-package");
  }
}
