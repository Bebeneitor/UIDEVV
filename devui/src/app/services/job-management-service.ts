import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { JobInfo } from '../shared/models/job-info';
import { BaseResponse } from '../shared/models/base-response';
import { RoutingConstants } from '../shared/models/routing-constants';

const RETURNED = "returned";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST'
  })
};

@Injectable({
    providedIn: 'root'
})
export class JobManagementService {
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST'
      })
    };
  
    constructor(private http: HttpClient) { }
  
    createJob(job: string, cronExpression: string, jobData: string): Observable<BaseResponse> {

      const parameters = {
        params: new HttpParams()
          .set("job", job)
          .set("cronExpression", cronExpression)
      }

      return this.http.post<BaseResponse>(environment.restServiceUrl + RoutingConstants.JOB_MANAGEMENT_URL + "/" + 
          RoutingConstants.CREATE_JOB_URL, {
            jobData: jobData
          }, parameters);
    }

    getAllJobs(): Observable<BaseResponse> {
      return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.JOB_MANAGEMENT_URL + "/" + 
      RoutingConstants.GET_ALL_JOBS_URL);
    }

    getAllScheduledJobs(): Observable<BaseResponse> {
      return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.JOB_MANAGEMENT_URL + "/" + 
      RoutingConstants.GET_ALL_SCHEDULED_JOBS_URL);
    }

    executeScheduledJob(jobs : JobInfo[]):Observable<BaseResponse> {
      return this.http.post<BaseResponse>(environment.restServiceUrl + RoutingConstants.JOB_MANAGEMENT_URL + "/" + 
      RoutingConstants.EXECUTE_JOB_URL, jobs);
    }

    updateScheduledJob(jobs : JobInfo[]): Observable<BaseResponse> {
      return this.http.post<BaseResponse>(environment.restServiceUrl + RoutingConstants.JOB_MANAGEMENT_URL  + "/"
        + RoutingConstants.RESCHEDULE_JOB_URL, jobs);
    }

    removeScheduledJob(jobs : JobInfo[]): Observable<BaseResponse> {
      return this.http.post<BaseResponse>(environment.restServiceUrl + RoutingConstants.JOB_MANAGEMENT_URL + "/" + 
      RoutingConstants.DELETE_JOB_URL, jobs);
    }

}