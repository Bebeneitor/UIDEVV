import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { environment } from 'src/environments/environment';
import { SelectItem } from 'primeng/api';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Injectable()
export class RepoTableAdminService {
  private urlService = `${environment.restServiceUrl}${RoutingConstants.REPO_URL}/${RoutingConstants.REPO_TABLES.slice(0, -1)}`;

  constructor(private http: HttpClient, private fb: FormBuilder) { }
  private setPageTitleSub = new Subject<string>();

  getTableById(moduleId: number) {
    return this.http.get(
      `${this.urlService}/${moduleId}/config`
    );
  }

  /**
   * This method is used to switch the status (inactive or active). 
   * 
   * @param repoTableIds - Repo table ids.
   * @returns Observable.
   */
  switchStatus(repoTableIds : number[]){
    return this.http.post(
      `${this.urlService}/switch-status`,
      repoTableIds
    );
  }

  saveRepoTable(table: any) {
    return this.http.post(this.urlService, table);
  }

  setPageTitleObs() {
    return this.setPageTitleSub.asObservable();
  }

  setPageTitle(title: string) {
    this.setPageTitleSub.next(title);
  }

  validateRepoTableCall(tableName: string, tableOwner: string){
    const requestParams = new HttpParams().append('tableName', tableName).append('tableOwner', tableOwner);
    return this.http.get(`${this.urlService}/validate`, {params: requestParams });
  }

  createAttributeFormGroup(radioButtonsToCreate: any = 0, dropDownOptionsToCreate: any): FormGroup {
    const form = this.fb.group({
      attributeLabel: this.fb.control(null, Validators.required),
      databaseColumnLinked: this.fb.control(null, Validators.required),
      isReportColumn: this.fb.control(null),
      mandatory: this.fb.control(null, Validators.required),
      uiDataTypes: this.fb.control(null, Validators.required),
      radioButtons: this.fb.array([]),
      dropDownOptions: this.fb.array([])
    });

    const radioButosControl = form.get('radioButtons') as FormArray;
    if (radioButtonsToCreate > 2) {
      for (let index = 0; index < radioButtonsToCreate; index++) {
        radioButosControl.push(this.fb.control(null));
      }
    } else {
      radioButosControl.push(this.fb.control(null));
      radioButosControl.push(this.fb.control(null));
    }

    const dropDownOptionsControl = form.get('dropDownOptions') as FormArray;
    if (dropDownOptionsToCreate > 0) {
      for (let index = 0; index < dropDownOptionsToCreate; index++) {
        dropDownOptionsControl.push(this.fb.control(null));
      }
    }

    return form;
  }

  getUiDataTypes() {
    return [
      { label: 'Text Box', value: 'text' },
      { label: 'Number', value: 'number'},
      { label: 'Calendar', value: 'date' },
      { label: 'Range Text', value: 'range_text' },
      { label: 'Range Date', value: 'range_date' },
      { label: 'Radio Button', value: 'radio_button' },
      { label: 'Drop Down', value: 'dropdown' },
      { label: 'Check box', value: 'checkbox' },
    ];
  }

  getTableOwners(){
    return [
      {label: 'REPOSITORY', value: 'REPOSITORY'},
      {label: 'HCIUSER', value: 'HCIUSER'}
    ];
  }

  /**
   * This method is used to get the table names in the DB, this by means of the scheme name.
   * 
   * @param schemeName - Scheme Name.
   * @returns Promise<SelectItem[]>.
   */
  getTableNamesDb(schemeName: string) {
    return new Promise<SelectItem[]>((resolve, reject) => {
      let uri = `${environment.restServiceUrl}${RoutingConstants.REPO_URL}/table-name/scheme/${schemeName}`;
      this.http.get(uri).subscribe((baseReponse: BaseResponse) => {
        let selectItem: SelectItem[] = [];
        baseReponse.data.forEach((tableNames: any) => {
          selectItem.push(
            {
              label: tableNames,
              value: tableNames
            });
        });
        resolve(selectItem);
      });
    });
  }
}
