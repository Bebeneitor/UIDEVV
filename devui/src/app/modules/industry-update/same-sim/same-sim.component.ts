import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DashboardService } from 'src/app/services/dashboard.service';
import { EclLookupsService } from 'src/app/services/ecl-lookups.service';
import { SameSimService } from 'src/app/services/same-sim.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { RuleManagerService } from '../rule-process/services/rule-manager.service';


let XLSX = require('xlsx');

@Component({
  selector: 'app-same-sim',
  templateUrl: './same-sim.component.html',
  styleUrls: ['./same-sim.component.css']
})
export class SameSimComponent implements OnInit {
@ViewChild('fileInput') fileInputElement: ElementRef;
  id: number = 0;
  nameReport: string = '';
  dateReport: string = '';
  file: any = null;
  readingFile: boolean = true;

  cols: any = [];
  selectedColumns: any = [];
  frozenCols: any = [];
  tabData: any = [];

  editMode: boolean = false;

  lookups: any = [];

  eclFileId: number = 0;
  fileName: string = '';

  disabledGenerate: boolean = false;
  preview: boolean = false;
  arrayPreview: any = [];
  confirmationIcon: string = 'pi pi-exclamation-triangle';

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute,
    private sameSimService: SameSimService, private toastService: ToastMessageService,
    private lookupService: EclLookupsService, private fileManagerService: FileManagerService,
    private ruleManagerService: RuleManagerService, private router: Router,
    private confirmationService: ConfirmationService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.lookupService.search(Constants.SAME_SIM_LOOKUP_TYPE, '', '', 0, 100, true).then((response: BaseResponse) => {

      this.lookups = response.data.lookups;

      this.cols = [];

      this.lookups.forEach(item => {
        this.cols.push({ field: item.lookupDesc, header: item.lookupDesc + ' Codes Implemented' });
      });

      this.frozenCols = [
        { field: 'ruleCode', header: 'Rule ID' },
        { field: 'ruleName', header: 'Rule Name' },
        { field: 'ruleLogic', header: 'Rule Logic' },
        { field: 'logicEffectiveDate', header: 'Effective Date' }
      ];

      this.selectedColumns = this.cols;

      if (this.id > 0) {
        this.editMode = true;
        this.loadReport();
      }
    });

  }

  /**
   * Load report data from backend
   */
  loadReport() {
    this.sameSimService.getDetail(this.id, this.lookups).subscribe((response: BaseResponse) => {
      this.tabData = response.data.sameSimInstanceDetailList;

      this.eclFileId = response.data.sameSimInstance.fileId;
      this.fileName = response.data.sameSimInstance.fileName;
      this.nameReport = response.data.sameSimInstance.name;
      this.dateReport = this.dashboardService.parseDate(new Date(response.data.sameSimInstance.createdDt + 'T00:00:00'));
    });
  }

  /**
   * Create report in database and upload file, then show report in table
   */
  generateReport() {
    if (this.nameReport.trim() == '') {
      this.toastService.messageWarning(`${Constants.TOAST_SUMMARY_WARN}!`, 'Please enter a name report to continue.');
      return;
    }

    if (this.file !== null) {
      this.confirmationService.confirm({
        message: Constants.SAME_SIM_FILE_PROCESS_CONFIRMATION_MSG,
        header: Constants.CONFIRMATION_WORD,
        icon: this.confirmationIcon,
        accept: this.processFile
      });
    } else {
      this.toastService.messageWarning('Warning!', 'Please enter a valid file to continue.');
      this.readingFile = true;
    }
  }
  // sameSimInstanceDetailList
  /**
   * Gets the errorn and changes the flag to true.
   */
  catchError = (error) => {
    this.readingFile = true;
  }

  // sameSimInstanceDetailList
  /**
   * Short name to tabs (cleaner names to json object)
   * @param str 
   * @param index 
   */
  setShortName(str, index) {
    let matches = str.match(/\b(\w)/g);
    let shortName = matches.join('');

    return shortName + "-" + index;
  }

  /**
   * Clear screen inputs
   */
  clear() {
    this.nameReport = '';
    this.file = null;
    this.readingFile = true;
    this.eclFileId = 0;
    this.fileName = '';
    this.preview = false;
    this.disabledGenerate = false;

    const file: any = document.querySelector('#file');
    file.value = '';

    this.arrayPreview = [];
  }

  /**
   * Catch file object when changes in input file
   * @param newFile 
   */
  fileChange(newFile) {
    this.file = newFile[0];
    this.fileName = this.file.name;
    this.preview = false;

    let fileExtension = this.fileName.split('.').pop();
    let allowedExtensions = ['xlsx', 'xls'];

    if (!(allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1)) {
      this.file = null;
      this.fileName = '';

      const file: any = document.querySelector('#file');
      file.value = '';

      this.arrayPreview = [];

      this.toastService.messageError('Error', 'The file format must be .xls or .xlsx');
    } else {
      this.readFile();
    }
  }

  /**
   * Read file and enable preview button to show file records
   */
  readFile() {

    let sheetsListRequired = ['New', 'Deleted', 'Revised', 'Reinstated', 'Resequenced'];
    this.disabledGenerate = false;
    this.arrayPreview = [];
    let sheetexists = 0;
    let rowSheetValueEmpty = 0;
    this.toBase64(this.file).then(base64 => {

      let workbook = XLSX.read(base64.toString().split('base64,')[1], { type: 'base64' });
      let sheet_name_list = workbook.SheetNames;

      sheet_name_list.forEach((sheet, index) => {
        
        sheetsListRequired.forEach(sheetReq => {
          if(sheet == sheetReq){
            sheetexists++;
          }
        });
      });

      sheet_name_list.forEach((sheet, index) => {
        let rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        if (rows.length > 0) {
          let values = rows[1];

          if (index < sheetsListRequired.length){
            if (sheetexists <= sheetsListRequired.length && (values != null || values != undefined)){
              rowSheetValueEmpty++;
            }
          }
        }

        rows.shift();
        
      });

      if(rowSheetValueEmpty == 0 ){
        this.toastService.messageWarning(`${Constants.TOAST_SUMMARY_WARN}!`, Constants.EMPTY_FILE_SELECTED);
        this.disabledGenerate = true;
        this.fileInputElement.nativeElement.value = '';
      }
      if (sheetexists < sheetsListRequired.length){
        this.toastService.messageWarning(`${Constants.TOAST_SUMMARY_WARN}!`, Constants.INVALID_FILE_SELECTED);
        this.disabledGenerate = true;
        this.fileInputElement.nativeElement.value = '';
      }
      sheet_name_list.forEach((sheet, index) => {

        let headers = [];
        let rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        if (rows.length > 0) {
          let firstRow = rows[0];

          for (let key in firstRow) {
            headers.push({ field: key, header: firstRow[key] });
          }
        }

        rows.shift();

        this.arrayPreview.push({
          'tab': sheet,
          'selected': index == 0,
          'cols': headers,
          'rows': rows
        });
      });

    })
  }

  /**
   * Show records and tabs from loaded file 
   */
  showPreview() {
    this.dateReport = this.dashboardService.parseDate(new Date());
    this.preview = true;
  }

  /**
   * Hide records and tabs from loaded file 
   */
  hidePreview() {
    this.preview = false;
  }

  /**
   * Parse file to base64 string
   * @param file 
   */
  toBase64(file) {
    return new Promise((resolve) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        resolve(null);
      };
    });
  }

  /**
   * Download same sim file (xlsx)
   * @param eclFileId 
   */
  download() {
    this.fileManagerService.downloadFile(this.eclFileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, this.fileName);
    });
  }

  /**
   * Redirect to detail page
   * @param ruleId 
   * @param type 
   */
  redirect(ruleId, type) {
    this.ruleManagerService.showRuleDetailsScreen(ruleId, true);
  }

  /**
   * Arrow functions which fires when we accept the confirmation process start.
   */
  processFile = () => {
    this.readingFile = false;

    this.dateReport = this.dashboardService.parseDate(new Date());
    this.preview = false;

    this.sameSimService.uploadXLSX(this.file).subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        this.eclFileId = Number(response.data);
        this.sameSimService.processFile(this.eclFileId, this.nameReport).subscribe((processResponse: BaseResponse) => {
          if (processResponse.code == 200) {
            this.editMode = true;
            this.readingFile = true;
            this.id = Number(processResponse.data.sameSimId);
            this.loadReport();
          } else {
            this.toastService.messageError('Error', 'Error processing XLSX file, please try again.');
            this.readingFile = true;
          }
        }, this.catchError);
      } else {
        this.toastService.messageError('Error', 'Error uploading XLSX file, please try again.');
        this.readingFile = true;
      }
    }, this.catchError);

    this.router.navigate(['same-sim']);
  };
}
