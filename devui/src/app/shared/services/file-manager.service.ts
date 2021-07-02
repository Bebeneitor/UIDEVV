import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { RoutingConstants } from '../models/routing-constants';
import { EclFileDto } from '../models/ecl-file';


@Injectable({ providedIn: 'root' })
export class FileManagerService {
    private uploadFileSubject = new Subject<void>();

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
        })
    };

    /**
     * Sends the next event to the subscribers.
     */
    uploadFileSub() {
        this.uploadFileSubject.next();
    }

    /**
     * Returns the subject as observable to the subscibers.
     */
    uploadFileObs() {
        return this.uploadFileSubject.asObservable();
    }

    constructor(private http: HttpClient, private authService: AuthService) { }

    /**
     * Upload the selected files to the nfs server.
     * @param files that we want to store in the server.
     * @param fileCategory the lookup type for the files.
     * @param ruleId related to the file
     */
    uploadRuleFile(files, fileCategory, ruleId, allowedExtensions:string = "txt|xls|xlsx|doc|docx") {
        const apiUrl = `${environment.restServiceUrl}${RoutingConstants.RULES_URL + '/'}upload-file`;
        const formData = new FormData();
        const user = this.authService.getLoggedUser();

        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            formData.append('file', element, element.name);
        } 

        formData.append('ruleId', ruleId.toString());
        formData.append('userId', user.userId.toString());
        formData.append('fileCategory', fileCategory);
        formData.append('allowedExtensions', allowedExtensions);
        formData.append('processName', 'ECL_PROCESS');


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
     * We get the file list by category.
     * @param ruleId that we want to evaluate.
     * @param fileCategory that we need to filter.
     */
    getFilesByCategory(ruleId, fileCategory,fileStatus) {
        const apiUrl = `${environment.restServiceUrl}${RoutingConstants.RULES_URL + '/'}get-files-by-category`;
        return this.http.get(apiUrl, { params: new HttpParams().append('ruleId', ruleId).append('fileCategory', fileCategory).append('fileStatus',fileStatus) });
    }

    /**
     * Downloads the selected file by ecl file id.
     * @param fileId that we use to get the file from nfs server.
     */
    downloadFile(fileId) {
        const apiUrl = `${environment.restServiceUrl}${RoutingConstants.FILE_MANAGER_URL}/${RoutingConstants.DOWNLOAD_FILE}`;
        return this.http.get<Blob>(apiUrl, { responseType: 'blob' as 'json', params: new HttpParams().append('eclFileId', fileId) });
    }

    /**
     * Downloads the Same-Sim template
     *
     */
    downloadSameSimTemplateFile(){
        const apiUrl = `${environment.restServiceUrl}${RoutingConstants.SAME_SIM + '/'}download-template`;
        return this.http.get(apiUrl, { responseType: 'blob' });
    }

    downloadSameSimIcdTemplateFile(){
        const apiUrl = `${environment.restServiceUrl}${RoutingConstants.SAME_SIM + '/'}download-icd-template`;
        return this.http.get(apiUrl, { responseType: 'blob' });
    }

    /**
     * It only changes the rule file status.
     * @param fileId that we want to remove
     */
    removeFile(fileId: string) {
        const apiUrl = `${environment.restServiceUrl}${RoutingConstants.RULES_URL + '/'}remove-rule-file`;
        return this.http.delete(apiUrl, { params: new HttpParams().append('eclFileId', fileId) });
    }

    /**
     * It only changes the rule file status for the given ecl file ids.
     * @param deletedFilesSelection list of ecl files ids.
     */
    removeFiles(deletedFilesSelection: number[]) {
        const apiUrl = `${environment.restServiceUrl}${RoutingConstants.RULES_URL + '/'}remove-rule-files`;
        return this.http.post(apiUrl, deletedFilesSelection);
    }

    /**
   * Creates the element in the web browser and downloads the file.
   * @param fileObject to download.
   * @param fileName for the file.
   */
  createDownloadFileElement(fileObject, fileName) {

    let blob = new Blob([fileObject], { type: fileObject.type }), url = window.URL.createObjectURL(blob);

    //detect whether the browser is IE/Edge or another browser
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //To IE or Edge browser, using msSaveorOpenBlob method to download file.
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  /**
   * Uploads the selected file
   * @param file to be uploaded.
   */
  uploadFile(file, processName = undefined) {
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.FILE_MANAGER_URL + '/'}upload-file`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    if(processName) formData.append('processName', processName);

    return this.http.post<any>(apiUrl, formData);
  }

  /**
   * Get text content from blob file
   * @param blob 
   */
  getTextFromBlob(blob) {
    return new Promise(resolve => {
        var reader = new FileReader();
        reader.onload = function() {
            resolve(reader.result);
        }
        reader.readAsText(blob);
    });
  }

  createAsyncFileRequest(body: any){
    return this.http.post(`${environment.restServiceUrl}${RoutingConstants.FILE_MANAGER_URL}/${RoutingConstants.CREATE_ASYNC_FILE}`,
        body);
  }

  uploadPdgFiles(files : EclFileDto[], _fileCategory, _ruleId)
  {
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.PDG_TEMPLATE + '/'}${RoutingConstants.UPLOAD_PDG_FILES}`;

    const formData = new FormData();
    let pdgAttachmentsDto = {
        ruleId : _ruleId, 
        fileCategory: _fileCategory 
      };

    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        formData.append('file', element.newFile, element.newFile.name);
    } 
    formData.append('pdgAttachmentsDto',new Blob([JSON.stringify(pdgAttachmentsDto)],{type: "application/json" }));
    return this.http.post<any>(apiUrl, formData, this.httpOptions);
  }

  /**
   * We get the file list by category.
   * @param ruleId that we want to evaluate.
   * @param fileCategory that we need to filter.
   */
 getPdgFilesByType(ruleId, fileCategory) : Observable<any> {
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.PDG_TEMPLATE}/${RoutingConstants.PDG_FILES}`;
    return this.http.get(apiUrl, { params: new HttpParams().append('ruleId', ruleId).append('fileCategory', fileCategory) });
 }

   /**
   * We get the file list by category.
   * @param ruleId that we want to evaluate.
   */
  getAllPdgFiles(ruleId) : Observable<any> {
    const apiUrl = `${environment.restServiceUrl}${RoutingConstants.PDG_TEMPLATE}/${RoutingConstants.ALL_PDG_FILES}`;
    return this.http.get(apiUrl, { params: new HttpParams().append('ruleId', ruleId)});
 }


  
}
