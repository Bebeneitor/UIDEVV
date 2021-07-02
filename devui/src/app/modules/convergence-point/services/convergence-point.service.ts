import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { map } from 'rxjs/operators';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';

@Injectable({
  providedIn: 'root'
})
export class ConvergencePointService {

  constructor(private http: HttpClient) { }

  getModules(sectionCode: string, lockedFiles: boolean = false, tableObject: any = null) {
    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.LOAD_CONVERGENCE_POINT + '/' + RoutingConstants.CVP_FILTERS + '?sectionCode=' + sectionCode + '&lockedModules=' + lockedFiles, tableObject);
  }

  getModulesByScreen(parentPage: string) {
    return this.http.get(environment.cvpDocsServiceUrl + RoutingConstants.CONVERGENCE_SECTIONS + '/' + parentPage + '/' + RoutingConstants.LOAD_CONVERGENCE_POINT_MODULE + '?sectionOption=' + parentPage);
  }

  getSubModules(parentId: number, lockedFiles: boolean = false, independent: boolean) {    
    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.LOAD_CONVERGENCE_POINT + '/' + parentId + '/' + RoutingConstants.LOAD_SUBMODULES_CONVERGENCE_POINT + '/' + RoutingConstants.CVP_FILTERS + '?lockedModules=' + lockedFiles + (independent != null ? '&independent=' + independent : ''), {});
  }

  getSubModulesBySection(sectionCode: string) {
    return this.http.get(environment.cvpDocsServiceUrl + RoutingConstants.CONVERGENCE_SECTIONS + '/' + sectionCode + '/' + RoutingConstants.LOAD_CONVERGENCE_POINT_SUBMODULE + '?sectionCode=' + sectionCode);
  }

  getTabs(sectionOption: string) {
    return this.http.get(environment.cvpDocsServiceUrl + RoutingConstants.CONVERGENCE_SECTIONS + '/' + RoutingConstants.GET_TABS_BY_SECTION + '?sectionOption=' + sectionOption).pipe(map((response: any) => {
      let result = response.data;
      let data = [];

      result.forEach(item => {

        let selectedValue = '';
        let radioButtons = [];

        item.radios.forEach(radio => {
          radioButtons.push({
            id: radio.radioId,
            name: radio.radioName,
            key: radio.radioCode
          });
        });

        if (radioButtons.length > 0) {
          selectedValue = radioButtons[0].key;
        }

        data.push({
          tab: item.tabName,
          tabCode: item.tabCode,
          selectedValue: selectedValue,
          radioButtons: radioButtons
        });
      });

      return data;
    }));
  }

  existsTemplate(keyWord: string) {
    return new Promise(resolve => {

      const params = new HttpParams().set('keyword', keyWord);

      this.http.get(environment.cvpDocsServiceUrl + RoutingConstants.CVP_TEMPLATES + '/' + RoutingConstants.GET_FILE_BY_KEYWORD, { params }).subscribe((response: BaseResponse) => {

        let info = null;

        if(response.data.length > 0) {
          info = response.data[response.data.length - 1];
        }

        resolve(info);
      });
    });
  }

  uploadModuleTemplate(keyWord: string, file) {
    return new Promise(resolve => {

      const formData = new FormData();

      formData.append('file', file);
      formData.append('templateName', 'TEMPLATE ' + keyWord);
      formData.append('templateUse', keyWord);

      this.existsTemplate(keyWord).then((exists: any) => {

        if (exists != null) {
          //Update file

          let templateId = exists.templateId;

          formData.append('templateId', templateId.toString());

          this.http.put(environment.cvpDocsServiceUrl + RoutingConstants.CVP_TEMPLATES + '/' + templateId, formData).subscribe(responseUpdate => {
            resolve();
          });
        } else {
          //Create file
          this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.CVP_TEMPLATES + '/', formData).subscribe(responseCreate => {
            resolve();
          });
        }
      });
    });
  }

  downloadModuleTemplate(keyWord: string) {
    return new Promise(resolve => {
      this.existsTemplate(keyWord).then((exists: any) => {
        resolve(exists);
      });
    });
  }

  getModuleVersion(moduleId: number, version: string) {
    return this.http.get(environment.cvpDocsServiceUrl + RoutingConstants.LOAD_CONVERGENCE_POINT + '/' + RoutingConstants.GET_MODULE_VERSION + '?moduleId=' + moduleId + '&version=' + version);
  }

  saveModule(file: File, moduleName: string, sectionCode: string, overwrite: boolean) {

    const formData = new FormData();

    formData.append('file', file);
    formData.append('moduleName', moduleName);
    formData.append('sectionCode', sectionCode);
    formData.append('overwriteIfExists', overwrite.toString());

    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.LOAD_CONVERGENCE_POINT + '/', formData);
  }

  saveSubModule(parentId: number, file: File, moduleName: string, isIndependent: boolean, overwrite: boolean, sectionCode: string = null) {

    const formData = new FormData();

    formData.append('file', file);
    formData.append('moduleName', moduleName);
    formData.append('isIndependent', isIndependent.toString());
    formData.append('overwriteIfExists', overwrite.toString());

    if(sectionCode != null) {
      formData.append('sectionCode', sectionCode);
    }

    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.LOAD_CONVERGENCE_POINT + '/' + parentId + '/' + RoutingConstants.LOAD_SUBMODULES_CONVERGENCE_POINT, formData);
  }

  submitToReview(moduleId) {
    return this.http.put(environment.cvpDocsServiceUrl + RoutingConstants.WORKFLOW_CVP + '/' + RoutingConstants.SUBMIT_REVIEW_CVP + '/' + moduleId, {});
  }

  lockFiles(cvpInstancesId: number[]) {
    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.LOCK_CVP + '/' + RoutingConstants.LOCK_INSTANCES + '?cvpInstancesId='+ cvpInstancesId.join(','), {
      cvpInstancesId: cvpInstancesId
    });
  }

  approveModule(moduleId: number) {
    return this.http.put(environment.cvpDocsServiceUrl + RoutingConstants.WORKFLOW_CVP + '/' + RoutingConstants.APPROVE_CVP + '/' + moduleId, {});
  }

  returnModule(moduleId: number, comments: string) {
    return this.http.put(environment.cvpDocsServiceUrl + RoutingConstants.WORKFLOW_CVP + '/' + RoutingConstants.RETURN_CVP + '/' + moduleId, {
      comments: comments
    });
  }

  addApprover(cvpModuleInstanceId: number, userId: number) {
    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.MODULE_INSTANCE_USER, {
      cvpModuleInstanceId: cvpModuleInstanceId,
      userId: userId
    });
  }

  removeApprover(cvpModuleInstanceId: number, userId: number) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        cvpModuleInstanceId: cvpModuleInstanceId,
        userId: userId
      }
    };

    return this.http.delete(environment.cvpDocsServiceUrl + RoutingConstants.MODULE_INSTANCE_USER, options);
  }

  unlockModule(cvpLockId: number) {
    return this.http.delete(environment.cvpDocsServiceUrl + RoutingConstants.LOCK_CVP + '/' + cvpLockId);
  }

  exportModuleSubmoduleToPDF(moduleId: number) {
    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.LOAD_CONVERGENCE_POINT_MODULE + "/" + RoutingConstants.EXPORT_TO_PDF + "?moduleId=" + moduleId, {}, { responseType: 'blob' });
  }

  associateSubModule(primaryModuleId: string, subModuleId: string) {
    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.LOAD_CONVERGENCE_POINT + '/' + RoutingConstants.ASSOCIATE_SUBMODULE + '?parentModuleId=' + primaryModuleId + '&childModuleId=' + subModuleId, {
    });
  }

  deleteModule(moduleId: number, version: string, parentModuleId: number, parentVersion: string) {
    let chain = '';

    if(parentModuleId != null && parentVersion != null) {
      chain = '&parentModuleId=' + parentModuleId + '&parentVersion=' + parentVersion;
    }

    return this.http.delete(environment.cvpDocsServiceUrl + RoutingConstants.LOAD_CONVERGENCE_POINT + '/?moduleId=' + moduleId + '&version=' + version + chain);
  }

  cancelDeletionModule(moduleInstanceId: number, comments: string, parentInstanceId:number=null) {
    if (parentInstanceId) {
      return this.http.put(environment.cvpDocsServiceUrl + RoutingConstants.WORKFLOW_CVP + '/' + RoutingConstants.CVP_RECOVER + 
      '/' + moduleInstanceId  + '?parentInstanceId=' + parentInstanceId, {
        comments: comments
      })
    }
    return this.http.put(environment.cvpDocsServiceUrl + RoutingConstants.WORKFLOW_CVP + '/' + RoutingConstants.CVP_RECOVER + '/' + moduleInstanceId, {
      comments: comments
    });
  }

  submitForDeletionReview(moduleInstanceId: number, parentInstanceId:number = null) {
    if (parentInstanceId) {
      return this.http.put(environment.cvpDocsServiceUrl + RoutingConstants.WORKFLOW_CVP + '/' + RoutingConstants.CVP_REVIEW_DELETION + '/' + 
        moduleInstanceId + '?parentInstanceId=' + parentInstanceId, {});
    }
    return this.http.put(environment.cvpDocsServiceUrl + RoutingConstants.WORKFLOW_CVP + '/' + RoutingConstants.CVP_REVIEW_DELETION + '/' + 
      moduleInstanceId, {});
}

  approveDeletion(moduleInstanceId: number, parentInstanceId: number) {
    if (parentInstanceId) {
      return this.http.put(environment.cvpDocsServiceUrl + RoutingConstants.WORKFLOW_CVP + '/' + RoutingConstants.CVP_APPROVE_DELETION + '/' + moduleInstanceId + '?parentInstanceId=' + parentInstanceId, {});
    }
    return this.http.put(environment.cvpDocsServiceUrl + RoutingConstants.WORKFLOW_CVP + '/' + RoutingConstants.CVP_APPROVE_DELETION + '/' + moduleInstanceId, {});
  }

  cloneModules(moduleId: number, cloneItems: any, parentId: number) {
    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.LOAD_CONVERGENCE_POINT_MODULE + '?sourceId=' + moduleId, {
      parentId: parentId,
      namesMapping: cloneItems
    });
  }

  getDocumentType(object, page) {

    if(page == Constants.ANCILLARY_INFORMATION_SCREEN) {
      return 'Section';
    }

    if(object.parent) {
      return 'Primary requirement';
    } else {
      if(object.independent) {
        return 'Section';
      } else {
        return 'Attachment';
      }
    }  
  }

  getFilterCatalog(fileId: string) {
    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.CVP_AUDIT_LOG + '/' + RoutingConstants.CVP_AUDIT_LOG_FILTERS + '/' + fileId, {

    });
  }

  addCVPComment(moduleId: number, comment: string) {
    return this.http.post(environment.cvpDocsServiceUrl + RoutingConstants.LOAD_CONVERGENCE_POINT_MODULE + '/' + moduleId + '/' + RoutingConstants.CVP_COMMENTS, {
      'cvpCommnent': comment
    });
  }

  removeCVPComment(commentId) {
    return this.http.delete(environment.cvpDocsServiceUrl + RoutingConstants.CVP_DELETE_COMMENTS + '/' + commentId);
  }
}
