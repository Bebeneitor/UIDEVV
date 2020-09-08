import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepoConsultingService {
  constructor(private http: HttpClient, private fb: FormBuilder) { }

  /**
   * Returns an observable with the table list names.
   */
  getTablesSource(): Observable<SelectItem[]> {
    return this.http.get(`${environment.restServiceUrl}${RoutingConstants.REPO_URL}/${RoutingConstants.REPO_TABLES}`).pipe(map((response: any) => {
      return response.data.map(element => {
        const item: SelectItem = {
          value: element,
          label: element.displayTableName
        }
        return item;
      });
    }));
  }

  /**
   * Returns the observable with the table details.
   * @param tableId of that record
   */
  getTableById(tableId): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.REPO_URL}/${RoutingConstants.REPO_TABLES.slice(0, -1)}${tableId}`);
  }

  /**
   * Returns the list of dataset based on the table source id.
   * @param dataSourceId to search its data set list.
   */
  getTableDetails(dataSourceId: number): Observable<BaseResponse> {

    return this.http.get<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.REPO_URL}/${RoutingConstants.REPO_TABLES.slice(0, -1)}/${dataSourceId}`)
      .pipe(map(response => {
        const attributes = [];

        const elements: any[] = response.data.repoAttributes;
        const dropDownElements: any[] = elements.filter(element => element.uiDataType === 'dropdown');

        // Put dropdown elements in the begining of the array. 
        if (dropDownElements.length > 0) {
          dropDownElements.forEach(element => {
            const indexToRemove = elements.indexOf(element);
            if (indexToRemove > -1) {
              elements.splice(indexToRemove);
              elements.unshift(element);
            }
          });
        }

        // add two elements when its a range control.
        elements.forEach(element => {
          if (element.uiDataType === 'range_text' || element.uiDataType === 'range_date') {
            const toElement = { ...element, attributeName: element.attributeName + ' To' };
            element = { ...element, attributeName: element.attributeName + ' From' };

            attributes.push(element, toElement);
          } else {
            attributes.push(element);
          }
        });

        // add the dataset list.
        const datasets: SelectItem[] = response.data.datasets.map(set => {
          return {
            label: set,
            value: set
          }
        });

        return { ...response, data: { ...response.data, repoAttributes: attributes, datasets: datasets } };
      }));
  }

  /**
   * Creates the form group control.
   */
  createRepoConsultancyForm() {
    return this.fb.group({
      tableSource: this.fb.control(null, Validators.required),
      activeMatch: this.fb.control(null),
      exactMatch: this.fb.control(null),
      searchCriteria: this.fb.array([])
    });
  }

  /**
   * Creates the table.
   * @param requestObject that contains the search criteria.
   */
  crateTableConfiguration(requestObject: any, tableColumns: any[]): EclTableModel {
    const notRangedAttributes = [];
    const rangedAttributes = [];
    let criteriaRequestObj: { repoTableId: number, exactMatch: boolean, activeMatch: boolean, queryTemplate: { name: string, value: any }[] } = {
      repoTableId: requestObject.tableSource.repoTableId,
      exactMatch: requestObject.exactMatch ? requestObject.exactMatch : false,
      activeMatch: requestObject.activeMatch ? requestObject.activeMatch : false,
      queryTemplate: []
    };

    requestObject.searchCriteria.forEach((control, index) => {
      const column = tableColumns[index];
      if (column.uiDataType === 'range_date' || column.uiDataType === 'range_text') {
        rangedAttributes.push({ index: index, control })
      } else {
        notRangedAttributes.push({ index: index, control });
      }
    });

    criteriaRequestObj.queryTemplate = [
      ...this.generateRangedAttributes(rangedAttributes, requestObject, tableColumns),
      ...this.generateNotRangedAttributes(notRangedAttributes, requestObject, tableColumns)
    ];

    let manager = new EclTableColumnManager();
    const dataTableConfiguration = new EclTableModel();

    // Filter the range columns.
    tableColumns = tableColumns.filter((element, index, self) => index === self.findIndex((innerElement) => (innerElement.columnName === element.columnName)));

    tableColumns.forEach(column => {
      let attrName: string = this.getAttributeName(column);

      switch (column.uiDataType) {
        case 'date':
        case 'range_date':
          manager.addDateColumn(column.columnName, attrName, null, false, true);
          break;
        default:
          manager.addTextColumn(column.columnName, attrName, null, false, EclColumn.TEXT, true);
          break;
      }
    });

    dataTableConfiguration.columns = manager.getColumns();

    dataTableConfiguration.lazy = true;
    dataTableConfiguration.url = `${RoutingConstants.REPO_URL}/${RoutingConstants.REPO_TABLES.slice(0, -1)}/query`;
    dataTableConfiguration.checkBoxSelection = false;

    dataTableConfiguration.asyncDownload = true;
    dataTableConfiguration.asyncFileDetails = {
      fileName: `REPO_${requestObject.tableSource.displayTableName}`,
      processCode: 'REPO_QUERY'
    };
    dataTableConfiguration.criteriaFilters = criteriaRequestObj;

    return dataTableConfiguration;
  }

  /**
   * Creates an array with all not ranged elements and returns it.
   * @param notRangedAttributes Not ranged element list.
   * @param requestObject original form body
   * @param tableColumns list of columns.
   */
  generateNotRangedAttributes(notRangedAttributes: any[], requestObject: any, tableColumns: any[]) {
    let notRangedValue;
    let name;
    let obj = {};

    const finalRangedAttr = [];
    notRangedAttributes.forEach((control) => {
      const value = requestObject.searchCriteria[control.index];
      const column = tableColumns[control.index];
      name = column.columnName;
      obj['name'] = name;

      if (value) {
        if (typeof value.getMonth === 'function') {
          notRangedValue = this.parseDate(value);
          obj['value'] = `${notRangedValue}`;
        } else if (column.uiDataType === 'dropdown') {
          notRangedValue = value.join(`', '`);
          obj['value'] = `('${notRangedValue}')`;
        } else {
          notRangedValue = value;
          obj['value'] = `${notRangedValue}`;
        }
      }

      if (obj['value']) {
        finalRangedAttr.push(obj);
      }
      obj = {};
      notRangedValue = null;
    });

    return finalRangedAttr;
  }

  /**
   * Creates an array with all ranged elements and returns it.
   * @param notRangedAttributes Not ranged element list.
   * @param requestObject original form body
   * @param tableColumns list of columns.
   */
  generateRangedAttributes(rangedAttributes: any[], requestObject: any, tableColumns: any[]) {
    let obj = {};
    let name;
    let rangeTwo;
    let rangeOne;
    let counter = 0;

    const finalRangedAttr = [];
    rangedAttributes.forEach((range) => {

      const value = requestObject.searchCriteria[range.index];
      const column = tableColumns[range.index];
      name = column.columnName;

      if (counter > 0) {
        rangeTwo = value;
        obj['name'] = name;

        if (rangeOne && rangeTwo) {
          if (typeof rangeOne.getMonth === 'function') {
            rangeOne = this.parseDate(rangeOne);
            rangeTwo = this.parseDate(rangeTwo);
          }
          obj['value'] = `'${rangeOne}' AND '${rangeTwo}'`;
        } else if (rangeOne && !rangeTwo) {
          if (typeof rangeOne.getMonth === 'function') {
            rangeOne = this.parseDate(rangeOne);
          }
          obj['value'] = `'${rangeOne}'`;
          obj['point'] = 'FROM';
        } else if (!rangeOne && rangeTwo) {
          if (typeof rangeTwo.getMonth === 'function') {
            rangeTwo = this.parseDate(rangeTwo);
          }
          obj['value'] = `'${rangeTwo}'`;
          obj['point'] = 'TO';
        }

        if (obj['value']) {
          finalRangedAttr.push(obj);
        }

        name = null;
        rangeOne = null;
        rangeTwo = null;
        obj = {};
        counter = -1;
      } else {
        rangeOne = value;
      }

      counter++;
    });

    return finalRangedAttr;
  }

  /**
   * 
   * @param column 
   */
  getAttributeName(column: any): string {
    let attrName: string = column.attributeName;
    if (column.uiDataType === 'range_text' || column.uiDataType === 'range_date') {
      attrName = attrName.substring(0, attrName.length - 5);
    }
    return attrName;
  }

  /**
   * Parse date to traditional format
   * @param date 
   */
  parseDate(date) {
    if (date == null) { return null; }
    if (typeof date === 'string') {
      date = new Date(date);
    }
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let strMonth = "";

    switch (month) {
      case 0:
        strMonth = "JAN";
        break;
      case 1:
        strMonth = "FEB";
        break;
      case 2:
        strMonth = "MAR";
        break;
      case 3:
        strMonth = "APR";
        break;
      case 4:
        strMonth = "MAY";
        break;
      case 5:
        strMonth = "JUN";
        break;
      case 6:
        strMonth = "JUL";
        break;
      case 7:
        strMonth = "AUG";
        break;
      case 8:
        strMonth = "SEP";
        break;
      case 9:
        strMonth = "OCT";
        break;
      case 10:
        strMonth = "NOV";
        break;
      case 11:
        strMonth = "DEC";
        break;
    }

    return day + "-" + strMonth + "-" + year;
  }
}
