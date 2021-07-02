import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { Constants } from '../shared/models/constants';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string, columns: any[], columnsToExport?: any[]): void {
    let headerCheck: string[] = [];
    let fieldCheck: string[] = [];
    if (columnsToExport !== undefined && columnsToExport !== null && columnsToExport.length > 0) {
      columnsToExport.forEach(col => {
        fieldCheck.push(col.field);
        headerCheck.push(col.header);
      })
    } else {
      columns.forEach(col => {
        fieldCheck.push(col.field);
        headerCheck.push(col.header);
      })
    }

    if (fieldCheck && fieldCheck.length > 0) {
      json = json.map(value => {
        let currentValue = {};
        fieldCheck.forEach(header => {
          if (this.resolveNestedObjects(value, header) !== undefined) {
            currentValue[header] = this.resolveNestedObjects(value, header);
          }
        });
        return currentValue
      });
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    if (headerCheck !== null) {
      for (let i = 0; i < headerCheck.length; i++) {
        worksheet[Constants.LETTERS[i].toUpperCase() + "1"]["v"] = headerCheck[i].toUpperCase();
      }
    }

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  private resolveNestedObjects(o: any, s: string) {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }
}