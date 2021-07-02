import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileUpload } from 'primeng/primeng';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppUtils } from 'src/app/shared/services/utils';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class RuleIngestionService {
  public invalidFileTypeMessageSummary: string = 'File does not contain the required format, please verify and try again'
  public fileTypeMessageDetail: string = '';
  public colsWithOnlyInputs = ['ruleCode', 'ruleId', 'identifier', 'subIdentifier', 'ruleHeaderDescription', 'libraryCustomInternal', 'logic'];

  // Dropdown elements
  public lobs: any[] = [{ label: "ALL", value: null }];
  public categories: any[] = [{ label: "ALL", value: null }];
  public states: any[] = [{ label: "ALL", value: null }];
  public comments: any[] = [{ label: "Select Comment", value: null }];
  public users: any[] = [{ label: "Search for User", value: null }];
  public jurisdictions: any[] = [{ label: "ALL", value: null }];
  public types: any = [] = [{ label: "Custom", value: 'Custom' }, { label: "Library", value: 'Library' }];
  public ingestedLobs: any[] = [];
  public ingestedCategories: any[] = [];
  public ingestedStates: any[] = [];


  // Grid Columns
  public cols = [
    { field: 'ruleCode', header: 'ECL ID' },
    { field: 'identifier', header: 'Mid Rule' },
    { field: 'subIdentifier', header: 'Version' },
    { field: 'implementationDate', header: 'Implementation Date' },
    { field: 'logic', header: 'Logic', width: '50ch' },
    { field: 'ruleHeaderDescription', header: 'Rule Header Description' },
    { field: 'libraryCustomInternal', header: 'Type' }
  ];

  // Stepper elements
  public stepsItems = [
    { label: 'Select Rules' },
    { label: 'Approve Rules' }
  ];

  /**
   * Service contructor.
   * @param http angular http core module.
   * @param messageService to show the massage upload.
   */
  constructor(private http: HttpClient, private utils: AppUtils) {
    this.utils.getAllStates(this.states);
    this.utils.getAllStates(this.ingestedStates);
    this.utils.getAllLobs(this.lobs);
    this.utils.getAllLobs(this.ingestedLobs);
    this.utils.getAllCategories(this.categories).then((categories: any[]) => this.categories = categories);
    this.utils.getAllCategories(this.ingestedCategories).then((categories: any[]) => this.ingestedCategories = categories);
    this.utils.getAllJurisdictions(this.jurisdictions);
    this.utils.getAllUsers(this.users);
  }

  /**
   * Uploads a file to the given url service and returns an observable, also we retur the different
   * Upload events such as Progress upload or the response itself.
   * @param file to be uploaded
   */
  uploadFile(file: { files: File[] }, userId: number, ruleEngine: number): Observable<any> {
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.RULE_INGESTION_URL}/upload`;
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('ruleEngine', ruleEngine.toString());
    formData.append('ruleIngestion', file.files[0], file.files[0].name);

    return this.http.post<any>(apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress };
        case HttpEventType.Response:
          return event.body;
        default:
          return event.type;
      }
    })
    );
  }

  /**
   * Send the selected rules to the Rest API.
   * @param rules the selected elements that the user wants to save
   */
  saveRules(rules) {
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.RULE_INGESTION_URL}/approve`;
    return this.http.post(apiUrl, rules);
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
   * Returns the filtered ingested rules by the provided filters.
   * @param filters to apply in the search
   */
  getIngestedRules(filters): Observable<any> {
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.RULE_INGESTION_URL}/ingested-rules`;
    return this.http.post(apiUrl, filters);
  }

  /**
   * Processes the cvp file template for the cvp ingestion process.
   * @param fileId to be processed.
   */
  processCvpIngestionFile(fileId: number): Observable<BaseResponse> {
    const requestBody = { eclFileId: fileId }
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.CVP_INGESTION}/${RoutingConstants.PROCESS_CVP_INGESTION_FILE}`;
    const requestParams = new HttpParams().append('eclFileId', fileId.toString());
    return this.http.post<BaseResponse>(apiUrl, requestBody, { params: requestParams });
  }

  /**
   * Processes the cpe file template for the cpe ingestion process.
   * @param fileId to be processed.
   */
  processCpeIngestionFile(fileId: number): Observable<BaseResponse> {
    const requestBody = { eclFileId: fileId }
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.CPE_INGESTION_URL}/${RoutingConstants.PROCESS_CPE_INGESTION_FILE}`;
    const requestParams = new HttpParams().append('eclFileId', fileId.toString());
    return this.http.post<BaseResponse>(apiUrl, requestBody, { params: requestParams });
  }
}
