import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { BaseResponse } from "src/app/shared/models/base-response";
import { environment } from "src/environments/environment";
import { SectionCode } from "../models/constants/sectioncode.constant";
import {
  DrugVersionsResponse,
  LastDrugVersionResponse,
} from "../models/interfaces/drugversion";
import { BaseSectionResponse } from "../models/interfaces/uibase";
import { apiMap, apiPath } from "../models/path/api-path.constant";

const BASE_URL = environment.restServiceDnBUrl;
@Injectable({
  providedIn: "root",
})
export class DnbService {
  constructor(private http: HttpClient) {}

  getSection(
    versionId: string,
    sectionCode: string
  ): Observable<BaseSectionResponse> {
    return this.http
      .get<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${versionId}${apiPath.sections}${sectionCode}`
      )
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }

  getDrugLastVersion(drugCode: string): Observable<LastDrugVersionResponse> {
    return this.http
      .get<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugVersionLatest}${drugCode}`
      )
      .pipe(map((response) => response.data));
  }

  getDrugVersionsList(drugCode: string): Observable<DrugVersionsResponse[]> {
    return this.http
      .get<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugVersionList}${drugCode}`
      )
      .pipe(map((response) => response.data));
  }

  getAggregator(versionId: string): Observable<BaseSectionResponse[]> {
    // Remove when aggregator is ready
    const aggregatorData = forkJoin(
      this.getSection(versionId, SectionCode.GeneralInformation),
      this.getSection(versionId, SectionCode.References),
      this.getSection(versionId, SectionCode.DailyMaxUnits),
      this.getSection(versionId, SectionCode.LCD),
      this.getSection(versionId, SectionCode.MedicalJournal),
      this.getSection(versionId, SectionCode.Notes),
      this.getSection(versionId, SectionCode.Indications),
      this.getSection(versionId, SectionCode.DiagnosisCodes),
      this.getSection(versionId, SectionCode.DiagnosticCodeSummary),
      this.getSection(versionId, SectionCode.ManifestationCodes),
      this.getSection(versionId, SectionCode.DosingPatterns),
      this.getSection(versionId, SectionCode.DailyMaximumDose),
      this.getSection(versionId, SectionCode.MaximumFrequency),
      this.getSection(versionId, SectionCode.Age),
      this.getSection(versionId, SectionCode.Gender),
      this.getSection(versionId, SectionCode.UnitsOverTime),
      this.getSection(versionId, SectionCode.VisitOverTime),
      this.getSection(versionId, SectionCode.DiagnosisCodeOverlaps),
      this.getSection(versionId, SectionCode.SecondaryMalignancy),
      this.getSection(versionId, SectionCode.CombinationTherapy),
      this.getSection(versionId, SectionCode.GlobalReviewIndications),
      this.getSection(versionId, SectionCode.GlobalReviewCodes),
      this.getSection(versionId, SectionCode.Rules)
    );
    return aggregatorData;
  }

  // TODO - Will be removed when all the sections be added in aggregator (Only to QA test)
  getAPISection(versionId: string, sectionCode: string) {
    return this.http
      .get<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAPI}${apiPath.document}${versionId}${apiPath.section}${sectionCode}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  downloadVersion(versionId: string, format: string): Observable<any> {
    const request: Object = {
      params: { format },
      responseType: "blob",
    };
    return this.http.get<BaseResponse>(
      `${BASE_URL}${apiMap.restServiceDnbAPI}${apiPath.download}${versionId}`,
      request
    );
  }
  getNewDrugVersion(
    drugCode: string,
    editType: string,
    createMajor: boolean = false
  ) {
    return this.http
      .post<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAPI}${apiPath.drugVersion}`,
        { drugCode: drugCode, editType: editType, createMajor: createMajor }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  postSection(section) {
    return this.http
      .post(
        `${BASE_URL}${apiMap.restServiceDnbAPI}${apiPath.document}${section.drugVersionCode}${apiPath.section}${section.section.code}`,
        section
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  postAggregatorSection(section): Observable<DrugVersionsResponse[]> {
    return this.http
      .post(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${section.drugVersionCode}${apiPath.sections}`,
        section
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  postCommitSection(section) {
    return this.http
      .post(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${section.drugVersionCode}${apiPath.sections}${apiPath.commit}`,
        ""
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
