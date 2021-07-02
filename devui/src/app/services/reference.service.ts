import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EclReferenceDto } from '../shared/models/dto/ecl-reference-dto';
import { RoutingConstants } from '../shared/models/routing-constants';
import { BaseResponse } from '../shared/models/base-response';
const SEARCH_REFERENCE = "search-reference";

@Injectable({
    providedIn: 'root'
})
export class ReferenceService {

    constructor(private http: HttpClient){}

    public getAllEclReferences(ruleId: any, stage: any): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + ruleId + "/" + stage);
    }

    public getEclReference(eclRefId: any): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + eclRefId);
    }

    public deleteEclReference(eclRefId: any): Observable<any> {
        return this.http.delete<any>(environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/" + eclRefId);
    }

    public getRuleReferences(ruleId: number): Observable<any> {
        return this.http.get(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + ruleId + "/" + RoutingConstants.REFERENCES_URL);
    }

    public saveEclReference(eclReferenceDto: EclReferenceDto, refDocFile:File[], refDocFile1:File[], refDocFile2:File[], commentDocFile1:File[], commentDocFile2:File[]): Observable<any> {
        const formData = new FormData();
        if(eclReferenceDto !== null && eclReferenceDto !== undefined){
            formData.append("eclReferenceDto", JSON.stringify(eclReferenceDto));
        }
        if(refDocFile && refDocFile.length > 0){
            formData.append("refDocFile", refDocFile[0]);
        }
        if(refDocFile1 && refDocFile1.length > 0){
            formData.append("refDocFile1", refDocFile1[0]);
        }
        if(refDocFile2 && refDocFile2.length > 0){
            formData.append("refDocFile2", refDocFile2[0]);
        }
        if(commentDocFile1 && commentDocFile1.length > 0){
            formData.append("commentDocFile1", commentDocFile1[0]);
        }
        if(commentDocFile2 && commentDocFile2.length > 0){
            formData.append("commentDocFile2", commentDocFile2[0]);
        }
            return this.http.post<any>(environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + "/", formData);
    }

    public updateEclReference(eclReferenceDto: EclReferenceDto){
        return this.http.put<BaseResponse>(environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL +"/"+RoutingConstants.UPDATE_REFERENCE, eclReferenceDto);
    }

    public searchRefByName(refName: any, refSourceId: any): Observable<any> {
        let url = SEARCH_REFERENCE + "/" + refName + "/" + refSourceId;
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + url);
    }

    public refFileDownload1(fileUrl : any) : Observable<any>{
        return this.http.get(fileUrl,{responseType: 'blob'});
    }
    public refFileDownload2(fileUrl : any) : Observable<any>{
        return this.http.get(fileUrl,{responseType: 'blob'});
    }
    public refFileDownload3(fileUrl : any) : Observable<any>{
        return this.http.get(fileUrl,{responseType: 'blob'});
    }

    public refcommentsFileDownload1(fileUrl : any) : Observable<any>{
        return this.http.get(fileUrl,{responseType: 'blob'});
    }

    public refcommentsFileDownload2(fileUrl : any) : Observable<any>{
        return this.http.get(fileUrl,{responseType: 'blob'});
    }

    public getReferencesByRule(ruleId: number){
        return this.http.get(environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL +"/" +RoutingConstants.GET_REFERENCES_BY_RULE + "/" +ruleId);
    }
    
    //Method to call http to delete a reference file attachment related to url
    public deleteReferenceAttachment(referenceId: number, fileNumber: number) : Observable<any> {
        return this.http.delete(environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + '/' + RoutingConstants.REFERENCE_ATTACHMENT_DELETE_URL + '/' + referenceId + '/' + fileNumber);
    }

    //Method to call http to delete a reference file attachment related to Comments
    public deleteCommentsAttachment(eclAttachmentId: number) : Observable<any> {
        return this.http.delete(environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + '/' + RoutingConstants.ATTACHMENT_DELETE_URL + '/' + eclAttachmentId);
    }

    public downloadRefFile(fileUrl : any) : Observable<any>{
        return this.http.get(fileUrl,{responseType: 'blob'});
    }

    public deletePdgRefAttachment(fileId: number) : Observable<any> {
        return this.http.delete(environment.restServiceUrl + RoutingConstants.ECL_REFERENCES_URL + '/' + RoutingConstants.PDG_REF_ATTACHMENT_DELETE + '/' + fileId);
    }

}