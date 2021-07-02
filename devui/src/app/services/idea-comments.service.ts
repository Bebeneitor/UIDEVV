import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../shared/models/base-response';
import { RoutingConstants } from '../shared/models/routing-constants';

export interface IdeaComment {
    commentId: number;
    comments: string;
    createdBy: number
    createdUser: string;
    creationDate: Date;
    eclId: number;
    eclStageId: number
    statusId: number;
}

@Injectable({
    providedIn: 'root'
})
export class IdeaCommentsService {

    constructor(private http: HttpClient) { }

    public getIdeaComments(ideaId: number): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.IDEAS_URL}/${ideaId}/comments`);
    }
}