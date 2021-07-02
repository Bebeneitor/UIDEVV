import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RuleInfo } from '../shared/models/rule-info';
import { RuleReference } from '../shared/models/rule-reference';
import { ReferenceInfo } from '../shared/models/reference-info';
import { IdeaInfo, IdeaInfo2 } from '../shared/models/idea-info';

import { AppUtils } from 'src/app/shared/services/utils';
import { NewIdeaResearchDto } from '../shared/models/dto/new-idea-research-dto';
import { RoutingConstants } from '../shared/models/routing-constants';
import { EclComments } from '../shared/models/ecl-comments';

@Injectable({
    providedIn: 'root'
})
export class NewIdeaService {

    constructor(private http: HttpClient, private utils: AppUtils) {

    }

    public searchRefByName(refName: any, refSource: any): Observable<ReferenceInfo[]> {
        let url = "/" + refName + "/" + refSource;
        return this.http.get<ReferenceInfo[]>(environment.restServiceUrl + RoutingConstants.GET_REF_INFO_URL + url);
    }

    public saveNewIdea(requestData: IdeaInfo, policyPackages: number[], referenceData: ReferenceInfo[], ruleRefInfoData: RuleReference[], user: any,
        referenceFile: File[], referenceFile1: File[], referenceFile2: File[], rrId?: number, newCommentsDto?: EclComments): Observable<any> {
        let rrIdString: string = '';
        if (rrId) { rrIdString = rrId.toString() }
        let newIdeaDetailsObj = {
            "ideaInfo": requestData,
            "policyPackages": policyPackages,
            "referenceData": referenceData,
            "ideaRefData": ruleRefInfoData,
            "actionValue": 'save',
            "user": user,
            "IdeaComments": newCommentsDto
        }

        let newIdeaDetailsString = JSON.stringify(newIdeaDetailsObj);
        const formData = new FormData();
        if (referenceFile.length > 0)
            formData.append("referenceFileUploads1", referenceFile[0], referenceFile[0].name);
        if (referenceFile.length > 1)
            formData.append('referenceFileUploads1', referenceFile[1], referenceFile[1].name);

        //setting references for refererences2
        if (referenceFile1.length > 0) {
            formData.append('referenceFileUploads2', referenceFile1[0], referenceFile1[0].name);
            if (referenceFile1.length > 1)
                formData.append('referenceFileUploads2', referenceFile1[1], referenceFile1[1].name);
        }

        //setting references for refererences3
        if (referenceFile2.length > 0) {
            formData.append('referenceFileUploads3', referenceFile2[0], referenceFile2[0].name);
            if (referenceFile2.length > 1)
                formData.append('referenceFileUploads3', referenceFile2[1], referenceFile2[1].name);
        }

        formData.append('newIdeaDetailsObj', newIdeaDetailsString);
        // formData.append('rrId', rrIdString);

        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + '/', formData);
    }

    public saveNewIdeaResearch(idea: NewIdeaResearchDto): Observable<any> {
        return this.http.post(`${environment.restServiceUrl}${RoutingConstants.IDEAS_URL}/${RoutingConstants.NEW_IDEA_RESEARCH_URL}`, idea);
    }

    public returnIdea(ideaId: number, returnComments: String) {
        let resp = this.http.post<Boolean>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + "/" + ideaId + "/" + RoutingConstants.RETURN_IDEA_URL, returnComments);
        return resp;
    }

    public saveNewIdeaApproval(requestData: RuleInfo, referenceData: ReferenceInfo[], ruleRefInfoData: RuleReference[]): Observable<any> {
        let newIdeaDetailsObj = {
            "ruleInfo": requestData,
            "referenceData": referenceData,
            "ruleRefData": ruleRefInfoData
        }

        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + '/', newIdeaDetailsObj);
    }


    public onRefresh(ideaId: any): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + '/' + ideaId);
    }
    public submitNewIdea(requestData: any,  policyPackages: number[] ,referenceData: ReferenceInfo[], ruleRefInfoData: RuleReference[], user: any, referenceFile: File[], referenceFile1: File[], referenceFile2: File[], rrId: number, newCommentsDto?: EclComments): Observable<any> {
        let newIdeaDetailsObj = {
            "ideaInfo": requestData,
            "policyPackages": policyPackages,
            "referenceData": referenceData,
            "ideaRefData": ruleRefInfoData,
            "actionValue": 'submit',
            "user": user ,
            "IdeaComments": newCommentsDto
        }
        let rrIdString: string = '';
        if (rrId) {rrIdString = rrId.toString() };
        let newIdeaDetailsString = JSON.stringify(newIdeaDetailsObj);
        const formData = new FormData();
        if (referenceFile.length > 0)
            formData.append("referenceFileUploads1", referenceFile[0], referenceFile[0].name);
        if (referenceFile.length > 1)
            formData.append('referenceFileUploads1', referenceFile[1], referenceFile[1].name);

        //setting references for refererences2
        if (referenceFile1.length > 0)
            formData.append('referenceFileUploads2', referenceFile1[0], referenceFile1[0].name);
        if (referenceFile1.length > 1)
            formData.append('referenceFileUploads2', referenceFile1[1], referenceFile1[1].name);

        //setting references for refererences3
        if (referenceFile2.length > 0)
            formData.append('referenceFileUploads3', referenceFile2[0], referenceFile2[0].name);
        if (referenceFile2.length > 1)
            formData.append('referenceFileUploads3', referenceFile2[1], referenceFile2[1].name);

        formData.append('newIdeaDetailsObj', newIdeaDetailsString);
        // formData.append('rrId', rrIdString);

        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + '/', formData);

    }

    public getIdeaComments(ideaId: number): Observable<any> {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + '/' + ideaId + '/' +RoutingConstants.IDEA_COMMENTS);
    }
}