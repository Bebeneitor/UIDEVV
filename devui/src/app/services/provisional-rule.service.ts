import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RuleInfo } from '../shared/models/rule-info';
import { ProvisionalRuleDto } from '../shared/models/dto/provisional-rule-dto';
import { FileUpload } from 'primeng/primeng';
import { RoutingConstants } from '../shared/models/routing-constants';
import { BaseResponse } from '../shared/models/base-response';

const LIBRARY_RULE = 'Library Rule';
const SHELVED = 'Shelved';
const NEED_MORE_INFO = 'Need More Information';
const NEED_MD_APPROVAL = 'Need Peer Reviewer Approval';

@Injectable({
    providedIn: 'root'
})
export class ProvisionalRuleService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
        })
    };

    constructor(private http: HttpClient) {
    }

    /**
     * Get the valid Status codes for Approval Screen.
     */
    getStatusCodeForApprovalScreen(): any[] {
        return [{
            label: 'Select',
            value: ''
        },
        {
            label: LIBRARY_RULE,
            value: 9
        },
        {
            label: SHELVED,
            value: 6
        },
        {
            label: NEED_MORE_INFO,
            value: 12
        },
        {
            label: NEED_MD_APPROVAL,
            value: 7
        }
        ];
    }

    getAllProvisionalRules(): Observable<any[]> {
        return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.ALL_RULES_URL);
    }

    public findRuleById(ruleId: any): Observable<any> {
        return this.http.get<AnalyserOptions>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + ruleId);
    }

    public findIdeaById(ruleId: any): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + '/' + ruleId);
    }

    public findSpecialityTypesById(ruleId: any): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + ruleId + "/" + RoutingConstants.SPECIALITY_TYPES_URL);
    }

    public findSubspecialityTypesById(ruleId: any): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + ruleId + "/" + RoutingConstants.SUBSPECIALITY_TYPES_URL);
    }

    public findClaimPlacesOfServiceById(ruleId: any): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + ruleId + "/" + RoutingConstants.CLAIM_TYPE_URL);
    }

    public saveProvRule(noteAttachment : File[], provisionalRuleDto: ProvisionalRuleDto): Observable<any> {
        
        const formData = new FormData();
        for (let index = 0; index < noteAttachment.length; index++) {
            const element = noteAttachment[index];
            formData.append('noteAttachments', element, element.name);
        }
        formData.append('provRuleDto',new Blob([JSON.stringify(provisionalRuleDto)],{type: "application/json"
        }));
        return this.http.post<any>(`${environment.restServiceUrl}${RoutingConstants.PROVISIONAL_RULE_URL}/`, formData, this.httpOptions);
    }

    public saveProvisionalRules(noteAttachment : File[], provisionalRuleDtos: ProvisionalRuleDto[]): Observable<any> {
        const formData = new FormData();
        for (let index = 0; index < noteAttachment.length; index++) {
            const element = noteAttachment[index];
            formData.append('noteAttachments', element, element.name);
        }
        formData.append('provRuleDtos',new Blob([JSON.stringify(provisionalRuleDtos)],{type: "application/json" }));
        return this.http.post<any>(`${environment.restServiceUrl}${RoutingConstants.PROVISIONAL_RULE_URL}/${RoutingConstants.MULTI_PROVISIONAL_RULES_URL}/`, formData, this.httpOptions);
    }
    public savePdgTemplateAuditLogs(changeType: any, provisionalRuleDtos: ProvisionalRuleDto[]): Observable<any> {
        const formData = new FormData();
        formData.append('changeType', changeType);
        formData.append('provRuleDtos',new Blob([JSON.stringify(provisionalRuleDtos)],{type: "application/json" }));
        return this.http.post<any>(`${environment.restServiceUrl}${RoutingConstants.AUDIT_URL}/${RoutingConstants.PDG_AUDIT_URL}/`, formData, this.httpOptions);
    }


    public findRuleByParentId(parentId: any): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.PROVISIONAL_RULE_URL + "/" + parentId);
    }

    // Please use ProvisionalRuleDto model instead of a Object Literal.
    public submitProvRule(submit: any, user: any, ruleInfo: RuleInfo, lobs: any[], states: any[], jurisdictions: any[], includedSpecialityTypes: any[], excludedSpecialityTypes: any[],
        includedClaims: any[], excludedClaims: any[], includedBills: any[], excludedBills: any[], fromMainProc: boolean = false): Observable<any> {
        let provisionalRuleDto = {
            "ruleInfo": ruleInfo,
            "lobs": lobs,
            "states": states,
            "jurisdictions": jurisdictions,
            "includedSpecialityTypes": includedSpecialityTypes,
            "excludedSpecialityTypes": excludedSpecialityTypes,
            "includedClaims": includedClaims,
            "excludedClaims": excludedClaims,
            "includedBills": includedBills,
            "excludedBills": excludedBills,
            "user": user,
            "action": submit,
            "fromMaintenanceProcess": fromMainProc
        }
        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.PROVISIONAL_RULE_URL + "/", provisionalRuleDto, this.httpOptions);
    }

    public saveRuleStatusAndComments(user: any, ruleId: any, status: any, comments: any, stageId: any) {
        let requestBody: any;
        let ruleStatusObj = {
            "ruleId": ruleId,
            "status": status,
            "stageId": stageId,
            "comments": comments
        }

        let selectedData = [];
        selectedData.push(ruleStatusObj);
        requestBody = {
            "selectedRules": selectedData,
            "action": 'save',
            "userId": user
        };
        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.SAVE_RULE_APPROVAL_URL, requestBody, this.httpOptions);
    }

    public submitRuleStatusAndComments(user: any, ruleId: any, status: any, comments: any, stageId: any) {
        let requestBody: any;
        let ruleStatusObj = {
            "ruleId": ruleId,
            "status": status,
            "comments": comments,
            "stageId": stageId
        }

        let selectedData = [];
        selectedData.push(ruleStatusObj);
        requestBody = {
            "selectedRules": selectedData,
            "action": 'submit',
            "userId": user
        };
        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.SUBMIT_RULE_APPROVAL_URL, requestBody, this.httpOptions);
    }

    public getEclReferences(ruleId: any): Observable<any[]> {

        return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.PROVISIONAL_RULE_URL + "/" + ruleId + "/" + RoutingConstants.ECL_REFERENCES_URL);
    }

    /**
       * Uploads a file to the given url service and returns an observable, also we retur the different
       * Upload events such as Progress upload or the response itself.
       * @param file to be uploaded
       */
    public uploadFile(file: { files: File[] }, cvpTemplate: any, ruleId): Observable<any> {
        const apiUrl = environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/' + RoutingConstants.SAVE_CVP_TEMPLATE_URL + '/'

        let fileUploadDetailsObj = {
            "ruleId": ruleId
        }
        let fileUploadDetailsString = JSON.stringify(fileUploadDetailsObj);
        const formData = new FormData();
        formData.append('cvpFileUpload', file.files[0], 'cvpFileUpload');
        formData.append('fileUploadDetailsObj', fileUploadDetailsString);

        return this.http.post<any>(apiUrl, formData);

    }
    /**
     * The upload control clear method does not clear the file count if the 
     * file count is not set to 0 then the choose button is not enabled again.
     * @param fileUploader FileUploader we want to clear
     */
    clearFileUploadSelection(fileUploader: FileUpload) {
        fileUploader.uploadedFileCount = 0;
        fileUploader.clear();
    }
    /**
     * Uploads a file to the given url service and returns an observable, also we retur the different
     * Upload events such as Progress upload or the response itself.
     * @param file to be uploaded
     */
    public rpeUploadFile(file: { files: File[] }, rpeTemplate: any, ruleId): Observable<any> {
        const apiUrl = environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/' + RoutingConstants.RPE_UPLOAD_URL + '/'

        let fileUploadDetailsObj = {
            "ruleId": ruleId
        }
        let fileUploadDetailsString = JSON.stringify(fileUploadDetailsObj);
        const formData = new FormData();
        formData.append('rpeFileUpload', file.files[0], 'rpeFileUpload');
        formData.append('fileUploadDetailsObj', fileUploadDetailsString);

        return this.http.post<any>(apiUrl, formData);

    }
    downloadCvpFiles(): Observable<any> {

        return this.http.get(environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/' + RoutingConstants.CVP_FILE_DOWNLOAD_URL + '/', { responseType: 'blob' });

    }
    downloadCvpFilesById(ruleId: any): Observable<any> {

        return this.http.get(environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/' + RoutingConstants.CVP_FILE_DOWNLOAD_URL + '/' + ruleId, { responseType: 'blob' });

    }

    downloadRpeFiles(): Observable<any> {

        return this.http.get(environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/' + RoutingConstants.RPE_FILE_DOWNLOAD_URL + '/', { responseType: 'blob' });

    }
    downloadRpeFilesById(ruleId: any): Observable<any> {

        return this.http.get(environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/' + RoutingConstants.RPE_FILE_DOWNLOAD_URL + '/' + ruleId, { responseType: 'blob' });

    }

    /**
     * Get all the changes a rule suffers
     * @param ruleId 
     */
    getRuleDeltas(ruleId: number): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.RULE_DELTAS}/${ruleId}`);
    }
    
    /**
     * Get history logs details to fill audit log screen
     * @param ruleId 
     * @param type 
     */
    getAuditLogDetails(ruleId: number, type: string) {
        return this.http.get<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.AUDIT_URL}/${RoutingConstants.HISTORY_LOGS}?ruleId=${ruleId}&type=${type}`);
    }
}
