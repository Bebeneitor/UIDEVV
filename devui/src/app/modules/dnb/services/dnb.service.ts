import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { BaseResponse } from "src/app/shared/models/base-response";
import { Constants } from "src/app/shared/models/constants";
import { FileManagerService } from "src/app/shared/services/file-manager.service";
import { environment } from "src/environments/environment";
import { SectionCode } from "../models/constants/sectioncode.constant";
import {
  AddFeedBack,
  CreateNewDrug,
  DeleteFeedBack,
  DrugVersionsResponse,
  LastDrugVersionResponse,
  ReAssignPayload,
} from "../models/interfaces/drugversion";
import { BaseSectionResponse } from "../models/interfaces/uibase";
import { apiMap, apiPath } from "../models/path/api-path.constant";

const BASE_URL = environment.restServiceDnBUrl;
const CORE_URL = environment.restServiceUrl;

@Injectable({
  providedIn: "root",
})
export class DnbService {
  constructor(
    private http: HttpClient,
    private fileService: FileManagerService
  ) {}

  getSection(
    versionId: string,
    sectionCode: string
  ): Observable<BaseSectionResponse> {
    return this.http
      .get<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${versionId}${apiPath.sections}${sectionCode}`
      )
      .pipe(map((response: any) => response.data));
  }

  getDrugLastVersion(drugCode: string): Observable<LastDrugVersionResponse> {
    return this.http
      .get<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugVersionLatest}${drugCode}`
      )
      .pipe(map((response) => response.data));
  }

  getDrugVersionsList(
    drugCode: string,
    payload: any
  ): Observable<DrugVersionsResponse[]> {
    return this.http
      .post<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugVersionList}${drugCode}`,
        payload
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

  downloadVersion(versionId: string, format: string): Observable<any> {
    const request: Object = {
      params: { format },
      responseType: "blob",
    };
    return this.http.get<BaseResponse>(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.download}${versionId}`,
      request
    );
  }
  getNewDrugVersion(drugCode: string, editType: string, createMajor: boolean) {
    return this.http
      .post<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.addDrugVersion}`,
        { drugCode: drugCode, editType: editType, createMajor: createMajor }
      )
      .pipe(map((response) => response.data));
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

  postSaveSection(section) {
    return this.http
      .post(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${section.drugVersionCode}${apiPath.sections}${apiPath.save}`,
        ""
      )
      .pipe(map((response: any) => response.data));
  }

  postSubmitSection(section) {
    return this.http
      .post(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${section.drugVersionCode}${apiPath.sections}${apiPath.submit}`,
        ""
      )
      .pipe(map((response: any) => response));
  }

  postApproveSection(section) {
    return this.http
      .post(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${section.drugVersionCode}${apiPath.sections}${apiPath.approve}`,
        ""
      )
      .pipe(map((response: any) => response));
  }

  postSubmitForReview(drugCode) {
    return this.http
      .post(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.drugs}/${drugCode}${apiPath.submitReview}`,
        ""
      )
      .pipe(map((response: any) => response));
  }

  postReturnSection(drugCode) {
    return this.http
      .post(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.drugs}/${drugCode}${apiPath.feedBack}`,
        ""
      )
      .pipe(map((response: any) => response));
  }

  postApproveForApprover(drugCode) {
    return this.http
      .post(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${drugCode.versionId}/${apiPath.approve}`,
        ""
      )
      .pipe(map((response: any) => response));
  }

  createNewDrug(name: string): Observable<CreateNewDrug> {
    const request = { name };
    return this.http
      .post(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugs}`,
        request
      )
      .pipe(map((response: any) => response.data));
  }

  reclaimDrugVersion(drugCode: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.drugs}/${drugCode}${apiPath.reclaim}`,
      ""
    );
  }

  claimDrugVersion(drugCode: string) {
    return this.http.put(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.approverClaim}${drugCode}`,
      ""
    );
  }

  getListUsersEditors() {
    return this.http
      .get<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.users}${apiPath.DNBE}`
      )
      .pipe(map((response) => response.data));
  }

  getListUsersApprovers(): Observable<any[]> {
    return this.http
      .get<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.users}${apiPath.DNBA}`
      )
      .pipe(map((response) => response.data));
  }

  reassignApprover(payload: ReAssignPayload) {
    return this.http.patch<BaseResponse>(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBA}${apiPath.reassign}`,
      payload
    );
  }

  reassignEditor(payload: ReAssignPayload) {
    return this.http.patch<BaseResponse>(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBE}${apiPath.reassign}`,
      payload
    );
  }

  reassignAdminToEditor(payload: ReAssignPayload) {
    return this.http.patch<BaseResponse>(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBAdminToEditor}${apiPath.reassign}`,
      payload
    );
  }

  reassignAdminToApprover(payload: ReAssignPayload) {
    return this.http.patch<BaseResponse>(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.approvalProcess}${apiPath.DNBAdminToApprover}${apiPath.reassign}`,
      payload
    );
  }

  addFeedback(payload: AddFeedBack) {
    return this.http
      .post<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.feedBackFlow}`,
        payload
      )
      .pipe(map((response) => response.data));
  }

  deleteFeedback(payload: DeleteFeedBack) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: payload,
    };
    return this.http.delete<BaseResponse>(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.feedBackFlow}`,
      options
    );
  }

  verifyFeedback(versionId: string) {
    return this.http
      .post<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.feedBackFlow}${apiPath.verify}${versionId}`,
        {}
      )
      .pipe(map((response) => response.data));
  }

  listAutopopulateIcd10Code(data: string[]) {
    return this.http.post<BaseResponse>(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.Icd10CodeAutopopulate}`,
      data
    );
  }

  getDnbEditFlags() {
    return this.http.get(`${CORE_URL}${apiPath.dnbTemplate}/`);
  }

  generateDnbTemplate(
    midRules: string[],
    templateCode: string,
    fileName: string
  ) {
    let body = {
      fileName: fileName,
      processCode: Constants.DNB_TEMPLATE_FLAG,

      dnbTemplateRequest: {
        ruleCodes: [],
        midRules: midRules,
        templateCode: templateCode,
      },
    };
    return this.fileService.createAsyncFileRequest(body);
  }

  getIngestionTemplate() {
    return this.http.get(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.manualIngestion}${apiPath.downloadIngest}`,
      { responseType: "blob" }
    );
  }

  uploadIngestTemplate(file) {
    return this.http
      .post<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.documents}${apiPath.ingest}`,
        file
      )
      .pipe(map((response) => response.data));
  }

  getIngestStatus(versionId: string) {
    return this.http
      .get<BaseResponse>(
        `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.manualIngestion}${versionId}`
      )
      .pipe(map((response) => response.data));
  }

  getReportTemplate() {
    return this.http.post(
      `${CORE_URL}${apiPath.dnbTemplate}/${apiPath.getMidRuleDiffTemplate}`,
      {},
      { responseType: "blob" }
    );
  }

  getMidRulesByFile(file) {
    const apiUrl = `${CORE_URL}${apiPath.dnbTemplate}/${apiPath.generateReportByFile}`;
    const formData = new FormData();
    formData.append("file", file, file.name);

    return this.http.post(apiUrl, formData);
  }

  generateReportTemplates(midRules) {
    return this.http.post(
      `${CORE_URL}${apiPath.dnbTemplate}/${apiPath.generateReportByRules}`,
      midRules,
      { responseType: "blob" }
    );
  }

  validateMidRules(midRules) {
    return this.http.post<BaseResponse>(
      `${CORE_URL}${apiPath.dnbTemplate}/${apiPath.validateMidRules}`,
      midRules
    );
  }

  updateDrugName(drug: { code: string; name: string }) {
    return this.http.patch<BaseResponse>(
      `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugs}`,
      drug
    );
  }
}
