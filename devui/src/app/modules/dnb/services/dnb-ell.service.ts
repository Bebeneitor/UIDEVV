import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { apiMap, apiPath } from "../models/path/api-path.constant";
import { environment } from "src/environments/environment";
import { map } from "rxjs/internal/operators/map";
const BASE_URL = environment.restServiceDnBUrl;
@Injectable({
  providedIn: "root",
})
export class DnbEllService {
  private ellPath: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}`;
  constructor(private http: HttpClient) {}

  updateEllTopic(ellTopic) {
    const servicePath: string = `${this.ellPath}${apiPath.drugs}/${apiPath.ellMappings}/${ellTopic.drugCode}`;
    return this.http
      .patch(servicePath, {
        drugCode: ellTopic.drugCode,
        topicName: ellTopic.topicName,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  createEllTopic(ellTopic) {
    const servicePath: string = `${this.ellPath}${apiPath.drugs}/${apiPath.ellMappings}`;
    return this.http
      .post(servicePath, {
        drugCode: ellTopic.drugCode,
        topicName: ellTopic.topicName,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteEllTopic(ellTopic) {
    const servicePath: string = `${this.ellPath}${apiPath.drugs}/${apiPath.ellMappings}/${ellTopic}`;
    return this.http.delete(servicePath).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
