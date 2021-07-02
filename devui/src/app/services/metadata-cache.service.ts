import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../shared/models/routing-constants';
import { TagDto } from '../shared/models/dto/tag-dto';
import { FilterDto } from '../shared/models/dto/filter-dto';
import { Constants } from 'src/app/shared/models/constants';
import { MetaTagDto } from '../shared/models/dto/metaTag-dto';
import { MailTagReportDto } from '../shared/models/dto/mail-tag-report-dto';
import { BaseResponse } from '../shared/models/base-response';

@Injectable({
    providedIn: 'root'
})

export class MetadataCacheService {

    constructor(private http: HttpClient) { }

    getAllTags(): Observable<TagDto[]> {
        return this.http.get<TagDto[]>(Constants.redisCacheUrl + RoutingConstants.METADATA_URL
            + "/" + RoutingConstants.METADATA_GET_TAGS);
    }

    getFiltersAndRules(selectedTag: number): Observable<TagDto> {
        return this.http.get<TagDto>(Constants.redisCacheUrl + RoutingConstants.METADATA_URL
            + "/" + RoutingConstants.METADATA_GET_TAGS + "/" + selectedTag + "/" + RoutingConstants.METADATA_GET_FILTERS);
    }


    saveTags(request: any) {
        return this.http.post(Constants.redisCacheUrl + RoutingConstants.METADATA_URL
            + "/" + RoutingConstants.METADATA_TAG, request);
    }

    saveFilter(request: FilterDto) {
        return this.http.post(Constants.redisCacheUrl + RoutingConstants.METADATA_URL + '/'
            + RoutingConstants.METADATA_GET_FILTER, request);
    }

    getSavedFilters(): Observable<FilterDto[]> {
        return this.http.get<FilterDto[]>(Constants.redisCacheUrl + RoutingConstants.METADATA_URL
            + "/" + RoutingConstants.METADATA_SAVED_FILTERS);
    }

    getTagsbyUserId(user: any): Observable<MetaTagDto[]> {
        let uri = `${Constants.redisCacheUrl}${RoutingConstants.METADATA_URL}/${RoutingConstants.METADATA_TAG}/${user}`;
        return this.http.get<MetaTagDto[]>(uri);
    }

    getFiltersbyUserId(user: any): Observable<FilterDto[]> {
        let uri = `${Constants.redisCacheUrl}${RoutingConstants.METADATA_URL}/${RoutingConstants.METADATA_GET_FILTER}/${user}`;
        return this.http.get<FilterDto[]>(uri);
    }

    getFilterTagseqbyTag(tagid: number): Observable<FilterDto[]> {
        let uri = `${Constants.redisCacheUrl}${RoutingConstants.METADATA_URL}/${RoutingConstants.METADATA_TAG}/${tagid}/${RoutingConstants.METADATA_GET_FILTERS}`;
        return this.http.get<FilterDto[]>(uri);
    }

    getTagExpExtend(tagid: number) {
        let uri = `${Constants.redisCacheUrl}${RoutingConstants.METADATA_URL}/${RoutingConstants.METADATA_TAG}/${RoutingConstants.METADATA_EXPIRY}/${tagid}`;
        return this.http.put<MetaTagDto>(uri, undefined);
    }

    generateTagReport(tagid: number) {
        let uri = `${Constants.redisCacheUrl}${RoutingConstants.METADATA_URL}/${RoutingConstants.METADATA_TAG}/${RoutingConstants.METADATA_GENERATE_REPORT}?tagId=${tagid}`;
        return this.http.post(uri, null, { responseType: 'blob' });
    }

    deleteTagFilter(deleteInfo: TagDto) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: deleteInfo
        }
        return this.http.delete(Constants.redisCacheUrl + RoutingConstants.METADATA_URL, options);
    }

    updateFilterTag(request: any) {
        let filterId = 0;
        let tagId = 0;
        if(request.filter !== null){
            filterId = request.filter.filterId;
        }
        if(request.tag !== null){
            tagId = request.tag.tagId;
        }
        let uri = `${Constants.redisCacheUrl}${RoutingConstants.METADATA_URL}/${RoutingConstants.METADATA_GET_FILTER}/${filterId}/${RoutingConstants.METADATA_TAG}/${tagId}`;
        return this.http.post(uri, request);
    }

    sendTagReportEmail(mailTagReportDto: MailTagReportDto): Observable<BaseResponse> {
        let uri = `${environment.restServiceUrl}${RoutingConstants.METADATA_URL}/${RoutingConstants.METADATA_TAG}/${RoutingConstants.METADATA_SEND_TAG_REPORT}`;
        return this.http.post<BaseResponse>(uri, mailTagReportDto);
    }

}