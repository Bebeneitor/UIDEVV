import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FileDownloadInboxService {

    constructor(private http:HttpClient){ }

    markAsDeleted(fileInboxId){
        return this.http.post(`${environment.restServiceUrl}${RoutingConstants.FILE_MANAGER_URL}/${RoutingConstants.MARK_FOR_DELETION}`,
            fileInboxId
        );
    }

}