import { Component, OnInit, ViewChild } from '@angular/core';
import { DrugService } from '../../services/drug.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { RoutingConstants } from "src/app/shared/models/routing-constants";
import { Log } from '../../models/interfaces/log';
import { Constants } from '../../../../shared/models/constants';
import { concatMap, tap } from 'rxjs/operators';
import { sqlDateConversion } from 'src/app/shared/services/utils';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-drug-list',
    templateUrl: './drug-list.component.html',
    styleUrls: ['./drug-list.component.css'],
    providers: [ConfirmationService]
})
export class DruglistComponent implements OnInit {
    @ViewChild(Table,{static: true}) dt: Table;
    baseUrl: string = RoutingConstants.baseUrl;
    updateDrugUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.updateDrug;
    addNewDrugUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.addNewDrug;
    auditLogs: string = RoutingConstants.baseUrl + '/' + RoutingConstants.auditLogs;
    currentUser: any;
    drugs = [];
    cols: any[];
    selectedDrug: any;
    updateSelectedDrug: any;
    drugDataResponse: any;
    code: any;
    drug_name: any;
    first = 0;
    rows = 10;
    log: Log;
    showDrugName: string;
    confirmationStatus: number;


    constructor(private drugService: DrugService,
        private router: Router, private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private sqlDateConversion:sqlDateConversion,
        private storageService:StorageService) { }

    ngOnInit() {
        this.currentUser = this.storageService.get("userSession", true).userName;
        //Populating drug list table
        this.cols = this.drugService.drugListColumns;
        this.drugService.drugList().pipe(
            tap(drugResponse => {
                if (!!drugResponse.response) {
                    this.log = {
                        userName: this.currentUser,
                        date: new Date(),
                        activity: 'Viewed the drug list page',
                        comments: ''
                    };
                    this.drugDataResponse = drugResponse.response;
                    this.drugDataResponse.forEach(element => {
                        let lastRunDate;
                        if (element.lastRun) {
                            lastRunDate = element.lastRun? this.sqlDateConversion.JSDateToSQLDate(element.lastRun):null;
                            lastRunDate = lastRunDate ? this.drugService.getDrugLastRunDateFormat(lastRunDate) : null; //to convert date from yyyy-mm-dd to mm yyyy
                        }
                        const drugDetails = {
                            id: element.id,
                            drugName: element.drugName, drugCode: element.drugCode,
                            clinicalpharma: '', micromedex: '', nccn: '',
                            lexidrug: '', ahfsdi: '',
                             lastrun: lastRunDate, 
                             status: '',
                            alternateName: element.alternateName
                        };
                        this.cols.forEach(item => {
                            let drugData: any;
                            drugData = element.compendias.find(res => res.portal.toLowerCase() === item.header.toLowerCase());
                            if (!!drugData) {
                                drugDetails[item.field + 'Availability'] = drugData.status;
                                drugDetails.status = drugData.status;
                                drugDetails[item.field + 'searchName'] = drugData.searchNames ? drugData.searchNames : null;
                                if (drugData.status === Constants.DATA_ENABLED) {
                                    if (drugData.runStatus === Constants.SWITCH_ON) {
                                        drugDetails[item.field] = true;
                                    }
                                    else if (drugData.runStatus === Constants.SWITCH_OFF) {
                                        drugDetails[item.field] = false;
                                    }
                                    else {
                                        drugDetails[item.field] = drugData.runStatus;
                                    }
                                }
                                else {
                                    drugDetails[item.field] = drugData.status;
                                }
                            }
                        });
                        this.drugs.push(drugDetails);
                        this.dt.reset();
                    });
                }
                else {
                    this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: drugResponse.message });
                }
            }),
            concatMap(confirmationResult => this.drugService.saveAuditLog(this.log)))
            .subscribe();

    }

    clearCode() {
        this.code = '';
        this.dt.reset();
    }

    clearName() {
        this.showDrugName = '';
        this.dt.reset();
    }

    /**
     * 
      Method to update changes to input switches controlling compendia sites
    */
    handleinputSwitchChange(field, rowData) {
        const drugObj = this.drugDataResponse.find(res => res.drugName.toLowerCase() === rowData.drugName.toLowerCase());
        if (!!drugObj) {
            let compendiaObj: any;
            switch (field) {
                case Constants.CLINICAL_PHARMA:
                    compendiaObj = drugObj.compendias.find(result => result.portal.toLowerCase() === Constants.COMPARE_CLINICAL_PHARMA);
                    break;
                case Constants.AHFS_DI:
                    compendiaObj = drugObj.compendias.find(result => result.portal.toLowerCase() === Constants.COMPARE_AHFS_DI);
                    break;
                case Constants.LCD_LCA:
                    compendiaObj = drugObj.compendias.find(result => result.portal.toLowerCase() === Constants.COMPARE_LCD_LCA);
                    break;
                case Constants.LEXI_PN:
                    compendiaObj = drugObj.compendias.find(result => result.portal === Constants.COMPARE_LEXI_PN);
                    break;
                default:
                    compendiaObj = drugObj.compendias.find(result => result.portal.toLowerCase() === field.toLowerCase());
                    break;
            }
            if (!!compendiaObj) {
                compendiaObj.runStatus = rowData[field] == false ? Constants.SWITCH_OFF : Constants.SWITCH_ON;
            }

            this.drugService.updateRunStatus(drugObj).pipe(
                tap(confirmationResult => {
                    if (confirmationResult.status == 200) {
                        this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: compendiaObj.portal + ' Run Status  for drug ' + rowData.drugName + ' switched  ' + compendiaObj.runStatus });
                        this.log = {
                            userName: this.currentUser,
                            date: new Date(),
                            activity: 'Switched Run Status ' + compendiaObj.runStatus + ' for ' + compendiaObj.portal + ' for the drug ' + rowData.drugName,
                            comments: ''
                        };
                        return confirmationResult;
                    }
                    else {
                        this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
                    }
                }),
                concatMap(confirmationResult => this.drugService.saveAuditLog(this.log)))
                .subscribe();
        }
    }

    /**
    * 
    Method to delete drug
    */
    deleteDrug(drug) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete ' + drug.drugName + ' ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.drugService.deleteDrug(drug.drugCode).pipe(
                    tap(confirmationResult => {
                        if (confirmationResult.status == 200) {
                            this.drugs = this.drugs.filter(val => val.drugCode !== drug.drugCode);
                            this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: 'Drug deleted: ' + drug.drugName });
                            this.log = {
                                userName: this.currentUser,
                                date: new Date(),
                                activity: 'Deleted the drug ' + drug.drugName,
                                comments: ''
                            };
                            this.dt.reset();
                            return confirmationResult;
                        }
                        else {
                            this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
                        }
                    }),
                    concatMap(confirmationResult => this.drugService.saveAuditLog(this.log))

                ).subscribe();
            },
            reject: () => {
            }
        });
    }

    updateDrug(rowData) {
        this.drugService.drug = rowData;
        this.router.navigate([this.updateDrugUrl]);
    }

    navigateToDrugSearch() {
        this.drugService.searchedDrugCode = '';
        this.router.navigate([this.baseUrl]);
    }
}
