import { Component, OnInit, ViewChild } from '@angular/core';
import { DrugService } from '../../services/drug.service';
import { Log } from '../../models/interfaces/log';
import { LCDFiles } from '../../models/interfaces/lcdfiles';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { RoutingConstants } from "src/app/shared/models/routing-constants";
import { Constants } from '../../../../shared/models/constants';
import { concatMap, tap } from 'rxjs/operators';
import { CompareFile } from '../../models/interfaces/filecompare';
import { sqlDateConversion } from 'src/app/shared/services/utils';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './drug-search.component.html',
  styleUrls: ['./drug-search.component.css'],
  providers: [ConfirmationService]
})

export class HomepageComponent implements OnInit {
  @ViewChild(Table,{static: true}) searchtable: Table;
  currentUser : any;
  addNewDrugUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.addNewDrug;
  compareResultsUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.comparedResults;
  listDrugsUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.listDrugs;
  addBiosimilarUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.addNewBiosimilar;
  drugSearchUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.drugSearch;
  drug: any;
  comments: any;
  filteredDrugs: any[];
  drugs: any[] = [];
  cols: any[];
  cols2: any[];
  fileOptions: LCDFiles[] = [];
  containers = [];
  commentsDialog: boolean = false;
  compareDialog: boolean = false;
  drugDataResponse: any;
  rowGroupMetadata: any;
  hideTable: boolean = true;
  ischecked: boolean = false;
  displayDialog: boolean;
  resultObj = {};
  bioSimilarCols = [];
  status: any = '';
  log: Log;
  fileSelect: boolean;
  fileCount: any;
  compareDrug: any;
  subProcess: any;
  nccnFlag: boolean = false;
  biosimilars = [{}];
  requestFiles: CompareFile;
  revisionDate: any;
  previousRevisionDate: any;
  fileByteStream: any;
  showComments: any = '';
  parameterValue: string;
  constructor(private drugService: DrugService, private router: Router,
    private confirmationService: ConfirmationService,
    private sqlDateConversion: sqlDateConversion,
    private messageService: MessageService, private activatedRoute: ActivatedRoute,
    private storageService: StorageService) { }

  ngOnInit() {
    this.currentUser = this.storageService.get("userSession", true).userName;
    this.cols = this.drugService.drugDataCols;
    this.bioSimilarCols = this.drugService.bioSimilarCols;
    this.activatedRoute.params.subscribe(routeParams => {
      this.parameterValue = routeParams.drug;
    });
    if (this.drugService.searchedDrugCode || this.parameterValue) {
      this.drug = this.drugService.searchedDrugCode ? this.drugService.searchedDrugCode : this.parameterValue;
      this.searchdrug(this.drug);
    }
  }

  filterDrugs(event) {
    let query = event.query;
    this.drugService.drugList().subscribe((res: BaseResponse) => {
      let result = res.response;
      this.filteredDrugs = this.drugfilter(query, result);
    });
  }

  /**
   * 
  Method to show autocomplete for drug search
  */
  drugfilter(query, drugs: any[]): any[] {
    let filtered: any[] = [];
    let druglist: any[] = [];
    drugs.forEach(element => {
      druglist.push(element.drugName, element.alternateName, element.drugCode);
    });
    for (let i = 0; i < druglist.length; i++) {
      let drug = druglist[i];
      if (drug != null) {
        if (drug.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(drug);
        }
      }
    }
    return filtered;
  }

  /**
   * 
  Method to show results of drug being searched
  */
  searchdrug(drug) {
    this.router.navigate([this.drugSearchUrl, drug]);
    this.drugDataResponse = [];
    this.drugs = [];
    this.status = '';
    if (drug != '') {
      this.drugService.drugSearch(drug).pipe(
        tap(confirmationResult => {
          if (confirmationResult.status == 200 && confirmationResult.message === 'Drug not found')
            this.status = "Sorry! No data available.";

          else if (!!confirmationResult.response) {
            this.log = {
              userName: this.currentUser,
              date: new Date(),
              activity: 'searched for drug ' + drug,
              comments: ''
            };
            this.drugDataResponse = confirmationResult.response;
            this.ischecked = this.drugDataResponse.runStatus == Constants.SWITCH_ON ? true : false;
            this.resultObj = {
              runDrug: this.drugDataResponse.runStatus,
              drugName: '',
              portal: '',
              clinicalpharma: '',
              druglabel: '',
              biosimRunStatus: '',
              micromedex: '',
              nccn: '',
              lexidrug: '',
              ahfsdi: '',
              lcdlca: '',
              lastRun: this.drugDataResponse.lastRun
            };
            if (!!this.drugDataResponse.bioSimilars && this.drugDataResponse.bioSimilars.length > 0) {
              this.drugDataResponse.bioSimilars.forEach(element => {
                let lastRunDate = this.drugDataResponse.lastRun ? this.sqlDateConversion.JSDateToSQLDate(this.drugDataResponse.lastRun) : null;
                lastRunDate = lastRunDate ? this.drugService.getDrugLastRunDateFormat(lastRunDate) : null; //to convert date from yyyy-mm-dd to mm yyyy
                let biosimilarLastRunDate = element.lastRun ? this.sqlDateConversion.JSDateToSQLDate(element.lastRun) : null;
                biosimilarLastRunDate = biosimilarLastRunDate ? this.drugService.getDrugLastRunDateFormat(biosimilarLastRunDate) : null;
                this.resultObj = {
                  runDrug: this.drugDataResponse.runStatus,
                  lastRun: lastRunDate
                };
                this.resultObj['drugName'] = element.drugName;
                this.resultObj['portal'] = element.portal;
                this.resultObj['hasError'] = element.hasError;
                this.resultObj['errorCode'] = element.errorCode;
                this.resultObj['druglabel'] = biosimilarLastRunDate;
                this.resultObj['biosimId'] = element.id;
                this.resultObj['actionProcess'] = element.actionProcess;
                this.resultObj['runStatus'] = element.runStatus;
                this.resultObj['biosimilarNccnName'] = element.nccnName;
                this.resultObj['biosimRunStatus'] = element.runStatus == Constants.SWITCH_ON ? true : false;
                if (!!this.drugDataResponse.comparisons) {
                  this.getBiosimilarFileComparisonData(element); //to get comparison data of biosimilar/brand files being compared                
                }
                this.getCompendiaDetails(); //to populate compendia details for the drug
                this.drugs.push(this.resultObj);
                this.nccnFlag = this.drugs.find(res => res.biosimilarNccnName != null) ? true : false;
                this.updateRowGroupMetaData();
              });
            }
            else {
              this.drugs.push(this.resultObj);
              this.updateRowGroupMetaData();
            }
            this.drugService.saveAuditLog(this.log).subscribe();
          }
          else {
            this.status = "Sorry! No data available.";
          }
        })).subscribe();
      this.hideTable = false;
    }
    else {
      this.status = "Please enter a drug to be searched";
    }
  }


  getStylesButton(columnName: string) {
    let defaultCss = "buttonDisable disabled";
    if (this.drugDataResponse.comparisons.length > 0) {
      for (let i = 0; i < this.drugDataResponse.comparisons.length; i++) {       
        if (this.drugDataResponse.comparisons[i].subProcess === columnName) {
          if (this.drugDataResponse.comparisons[i].updateLevel === 0)
            defaultCss = "buttonDisable disabled";
          if (this.drugDataResponse.comparisons[i].updateLevel === 2)
            defaultCss = "buttonStyle";
          if (this.drugDataResponse.comparisons[i].updateLevel === 1)
            defaultCss = "buttonFor1Style";
        }
      }
      return defaultCss;
    }
	return defaultCss;
  }

  /**
   * 
  Method to populate compendia details for the drug
  */
  getCompendiaDetails() {
    this.cols.forEach(item => {
      let compendiaObj: any;
      compendiaObj = this.drugDataResponse.compendias.find(res => res.portal.toLowerCase() === item.header.toLowerCase());
      if (!!compendiaObj) {
        this.fileOptions = [];
        let lastRunDate = compendiaObj.lastRun ? this.sqlDateConversion.JSDateToSQLDate(compendiaObj.lastRun) : null;
        lastRunDate = lastRunDate ? this.drugService.getDrugLastRunDateFormat(lastRunDate) : null; //to convert date from yyyy-mm-dd format to mm yyyy
        if (compendiaObj.portal === Constants.LCDLCA) {
          let fileList = JSON.parse(compendiaObj.fileList);
          if (fileList != null) {
            this.fileCount = fileList.COUNT ? fileList.COUNT : null;
            fileList.DOCS.LCA.forEach(element => {
              this.fileOptions.push({ label: element['FILE'], value: element['FILE'], condition: element['STATUS'] });
            });
            fileList.DOCS.LCD.forEach(element => {
              this.fileOptions.push({ label: element['FILE'], value: element['FILE'], condition: element['STATUS'] });
            });
          }
        }
        this.resultObj[item.field + 'SearchName'] = compendiaObj.searchNames;
        this.resultObj[item.field] = lastRunDate;
        if (compendiaObj.hasError == Constants.DATA_ENABLED)
          this.resultObj[item.field + 'Error'] = compendiaObj.errorCode;
        if (!!this.drugDataResponse.comparisons && this.drugDataResponse.comparisons.length > 0) {
          let compareFilesObj = this.drugDataResponse.comparisons.find(res => res.subProcess === compendiaObj.portal);
          if (compareFilesObj) {
            const pDownloadDate = compareFilesObj.oldFileDate ? this.drugService.getRevisionDateFormat(compareFilesObj.oldFileDate) : null; // to convert date from yyyymm to mm yyyy format
            this.resultObj[item.field + 'Flag'] = compareFilesObj.flag == "YES" ? true : false;
            this.resultObj[item.field + 'PDDate'] = pDownloadDate;
          }
          else {
            this.resultObj[item.field + 'Flag'] = false;
          }
        }
      }
    });
  }

  /**
   * 
  Method to get comparison data of biosimilar files being compared
  */
  getBiosimilarFileComparisonData(biosimilarDrug) {
    let comparisonData = this.drugDataResponse.comparisons.find(res => res.bioSimilar === biosimilarDrug.drugName);
    if (!comparisonData) {
      comparisonData = this.drugDataResponse.comparisons.find(res => res.drugName === biosimilarDrug.drugName);
    }
    if (comparisonData) {
     const  oldDownloadDate = comparisonData.oldFileDate ? this.drugService.getRevisionDateFormat(comparisonData.oldFileDate) : null;  // to convert date from yyyymm to mm yyyy format
      this.resultObj['showCompare'] = comparisonData.flag == Constants.DATA_ENABLED ? true : false;
      this.resultObj['oldDownloadDate'] = oldDownloadDate;
    }
    else {
      this.resultObj['showCompare'] = false;
    }
    let nccnComparisonData = this.drugDataResponse.comparisons.find(res => res.bioSimilar === biosimilarDrug.nccnName);
    if (nccnComparisonData) {
      const nccnOldDowloadDate = nccnComparisonData.oldFileDate ? this.drugService.getRevisionDateFormat(nccnComparisonData.oldFileDate) : null;  // to convert date from yyyymm to mm yyyy format
      this.resultObj['nccnShowCompare'] = nccnComparisonData.flag == Constants.DATA_ENABLED ? true : false;
      this.resultObj['nccnOldDownloadDate'] = nccnOldDowloadDate;
    }
    else
      this.resultObj['nccnShowCompare'] = false;
  }

  cleardrug() {
    this.drug = '';
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.drugs) {
      for (let i = 0; i < this.drugs.length; i++) {
        let rowData = this.drugs[i];
        let runDrug = rowData.runDrug;
        if (i == 0) {
          this.rowGroupMetadata[runDrug] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.drugs[i - 1];
          let previousRowGroup = previousRowData.runDrug;
          if (runDrug === previousRowGroup)
            this.rowGroupMetadata[runDrug].size++;
          else
            this.rowGroupMetadata[runDrug] = { index: i, size: 1 };
        }
      }
    }
  }

  /**
   * 
  Method to update RunStatus of drug
  */
  handleChange(value, ischecked) {
    this.drugDataResponse.runStatus = ischecked ? Constants.SWITCH_ON : Constants.SWITCH_OFF;
    this.drugService.updateRunStatus(this.drugDataResponse).pipe(
      tap(confirmationResult => {
        if (confirmationResult.status == 200) {
          this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: 'Run Status  for drug ' + this.drugDataResponse.drugName + ' switched ' + this.drugDataResponse.runStatus });
          this.log = {
            userName: this.currentUser,
            date: new Date(),
            activity: 'Updated Run Status for the drug ' + this.drugDataResponse.drugName + ' to ' + this.drugDataResponse.runStatus,
            comments: ''
          };
          return confirmationResult;
        }
        else {
          this.messageService.add({
            severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO,
            detail: confirmationResult.message
          });
        }
      }),
      concatMap(confirmationResult => this.drugService.saveAuditLog(this.log)))
      .subscribe();
  }

  /**
   * 
  Method to update RunStatus of Biosimilars
  */
  handleBioSimilarChange(data, value) {
    let bioSimilarObject = this.drugDataResponse.bioSimilars.find(res => res.id == data.biosimId);
    if (!!bioSimilarObject) {
      bioSimilarObject.runStatus = value == true ? Constants.SWITCH_ON : Constants.SWITCH_OFF;
      let requestbody = bioSimilarObject;
      this.drugService.updateBiosimilars(requestbody).pipe(
        tap(confirmationResult => {
          if (confirmationResult.status == 200) {
            this.messageService.add({
              severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO,
              detail: 'Run Status for ' + bioSimilarObject.drugName + ' switched ' + bioSimilarObject.runStatus
            }); this.log = {
              userName: this.currentUser,
              date: new Date(),
              activity: 'Updated Run Status for the drug ' + bioSimilarObject.drugName + ' to ' + bioSimilarObject.runStatus,
              comments: ''
            };
            return confirmationResult;
          }
          else {
            this.messageService.add({
              severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO,
              detail: confirmationResult.message
            });
          }
        }),
        concatMap(confirmationResult => this.drugService.saveAuditLog(this.log)))
        .subscribe();
    }
  }

  /**
   * 
  Method to delete Biosimilar
  */
  deleteBiosimilar(BioSimObject) {
    if(this.drugDataResponse.bioSimilars.length<=1){                                                          //deleting the entire drug when there is only one biosimilar left     
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete ' + BioSimObject.drugName + ' and all the details associated with it'+' ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.drugService.deleteDrug(this.drugDataResponse.drugCode).pipe(                       
            tap(confirmationResult => {
              if (confirmationResult.status == 200) {          
                this.log = {
                  userName: this.currentUser,
                  date: new Date(),
                  activity: 'Deleted the drug ' + this.drugDataResponse.drugName,
                  comments: ''
                };
                this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: 'Drug deleted: ' + BioSimObject.drugName });
                this.searchdrug(this.drug);
                return confirmationResult;
              }
              else {
                this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
              }
            }),
            concatMap(confirmationResult => this.drugService.saveAuditLog(this.log))).subscribe();
        },
        reject: () => {
        }
      });
    }
    else{                                                                                                 //deleting a particular biosimilar chosen
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + BioSimObject.drugName + ' ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.drugService.deleteBiosimilarDrug(BioSimObject.drugName).pipe(
          tap(confirmationResult => {
            if (confirmationResult.status == 200) {          
              this.drugs = this.drugs.filter(val => val.drugName !== BioSimObject.drugName);
              this.searchdrug(this.drug);
              this.log = {
                userName: this.currentUser,
                date: new Date(),
                activity: 'Deleted the drug ' + BioSimObject.drugName,
                comments: ''
              };
              this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: 'Drug deleted: ' + BioSimObject.drugName });
              return confirmationResult;
            }
            else {
              this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
            }
          }),
          concatMap(confirmationResult => this.drugService.saveAuditLog(this.log))).subscribe();
      },
      reject: () => {
      }
    });
  }
  }

  /**
   * 
  Method to show edit Biosimilar Dialog
  */
  showDialogToAdd(rowData) {
    this.containers = [];
    let bioSimilarObject = this.drugDataResponse.bioSimilars.find(res => res.id == rowData.biosimId);
    this.containers.push({
      id: rowData.biosimId,
      drugName: rowData.drugName,
      portal: rowData.portal,
      runStatus: rowData.runStatus,
      actionProcess: rowData.actionProcess,
      drugId: this.drugDataResponse.drugCode,
      revisionDate: bioSimilarObject.revisionDate,
      previousRevisionDate: bioSimilarObject.previousRevisionDate,
      lastRun: bioSimilarObject.lastRun,
      hasError: bioSimilarObject.hasError,
      errorCode: bioSimilarObject.errorCode,
      dailymedAvailability: bioSimilarObject.dailyMed == Constants.DATA_ENABLED ? true : false,
      drugfdaAvailability: bioSimilarObject.drugFda == Constants.DATA_ENABLED ? true : false,
      nccnName: bioSimilarObject.nccnName,
      nccnDownloadDate: bioSimilarObject.nccnDownloadDate
    });
    this.displayDialog = true;
  }

  addBiosimilarDrug() {
    this.drugService.drug = this.drug;
    this.router.navigate([this.addBiosimilarUrl]);
  }

  addComments() {
    this.displayDialog = false;
    this.commentsDialog = true;
    this.comments = '';
  }

  /**
   * 
  Method to save changes to Existing Biosimilar
  */
  save() {
    this.commentsDialog = false;
    let updateBiosimObj = this.containers[0];
    updateBiosimObj['drugFda'] = this.containers[0].drugfdaAvailability ? Constants.DATA_ENABLED : Constants.DATA_DISABLED;
    updateBiosimObj['dailyMed'] = this.containers[0].dailymedAvailability ? Constants.DATA_ENABLED : Constants.DATA_DISABLED;
    this.drugService.updateBiosimilars(updateBiosimObj).pipe(
      tap(confirmationResult => {
        if (confirmationResult.status == 200) {
          this.log = {
            userName: this.currentUser,
            date: new Date(),
            activity: 'Updated the drug details for' + this.containers[0].drugName,
            comments: this.comments
          };
          this.searchdrug(this.drug);
          this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
          return confirmationResult;
        }
        else {
          this.messageService.add({
            severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO,
            detail: confirmationResult.message
          });
        }
      }),
      concatMap(confirmationResult => this.drugService.saveAuditLog(this.log)))
      .subscribe();
  }

  cancel() {
    this.displayDialog = false;
    this.searchtable.reset();
  }

  lcdlcafile(lcdlcafileSelected) {
    this.fileSelect = this.fileOptions.find(res => res.label === lcdlcafileSelected).condition;
  }

  filesToCompareDialog(drugName, subProcess, revisionDate, PRDate) {
    this.compareDialog = true;
    this.compareDrug = drugName;
    this.subProcess = subProcess;
    this.revisionDate = revisionDate;
    this.previousRevisionDate = PRDate;
    this.getCompareResults(drugName, subProcess);
  }

  /**
   * 
  Method to get compared documents result
  */
  getCompareResults(drugName, subProcess) {
    this.showComments = '';
    this.fileByteStream = '';
    if (subProcess == Constants.SUBPROCESS_DRUGLABEL) {
      this.requestFiles = {
        drugCode: this.drugDataResponse.drugCode,
        drugName: this.drugDataResponse.drugName,
        subProcess: subProcess,
        biosimilar: drugName,
        comments: null,
        byteStreamFileData: null
      };
    }
    else if (subProcess == Constants.SUBPROCESS_NCCN && this.nccnFlag) {
      let biosimilar = this.drugDataResponse.bioSimilars.find(res => res.drugName == drugName);
      if (!!biosimilar) {
        let nccnName = biosimilar.nccnName;
        this.requestFiles = {
          drugCode: this.drugDataResponse.drugCode,
          drugName: this.drugDataResponse.drugName,
          subProcess: subProcess,
          biosimilar: nccnName,
          comments: null,
          byteStreamFileData: null
        };
      }
    }
    else {
      this.requestFiles = {
        drugCode: this.drugDataResponse.drugCode,
        drugName: this.drugDataResponse.drugName,
        subProcess: subProcess,
        biosimilar: null,
        comments: null,
        byteStreamFileData: null
      };
    }
    this.drugService.getDocumentCompareData(this.requestFiles).pipe(  
      tap(confirmationResult => {
        if (confirmationResult.status == 200) {
          this.log = {
            userName: this.currentUser,
            date: new Date(),
            activity: 'checked comparison results for ' + drugName + ' for ' + subProcess,
            comments: ''
          };
          this.fileByteStream = confirmationResult.response.byteStreamFileData;
          this.showComments = confirmationResult.response.message;
          if (!this.fileByteStream && !this.showComments) {
            this.showComments = confirmationResult.response.comments;
          }
          return confirmationResult;
        }
        else {
          this.messageService.add({
            severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO,
            detail: confirmationResult.message
          });
        }
      }),
      concatMap(confirmationResult => this.drugService.saveAuditLog(this.log)))
      .subscribe();
  }

  showComparedFiles() {
    let binary = atob(this.fileByteStream.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    let file = new Blob([view], { type: 'text/html' });
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }

  closeComparison() {
    this.compareDialog = false;
  }
}
