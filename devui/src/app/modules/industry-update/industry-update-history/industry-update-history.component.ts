import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUtils } from 'src/app/shared/services/utils';
import { IndustryUpdateService } from 'src/app/services/industry-update.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import {ECLConstantsService} from "../../../services/ecl-constants.service";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-industry-update-history',
  templateUrl: './industry-update-history.component.html',
  styleUrls: ['./industry-update-history.component.css']
})
export class IndustryUpdateHistoryComponent implements OnInit {

  pageTitle: string;
  userId: number;
  industryDetails: any[];
  rowGroupMetadata: any = undefined;
  rowLocalGroupMetadata: any = undefined;
  loading: boolean;
  expandedRows: {} = {};
  paginatedData: any = [];
  totalRecords : number = 0;
  keywordSearch: string;

  filters: any = {
    industryUpdate: '',
    date: '',
    action: '',
    status: ''
  }

  cols = [
    { field: 'industryUpdateName', header: 'Industry Update', width: '50%' },
    { field: 'effectiveDate', header: 'Effective Date', width: '15%' },
    { field: 'action', header: 'Action', width: '20%' },
    { field: 'status', header: 'Status', width: '15%' }
  ];


  constructor(private route: ActivatedRoute, private utils: AppUtils,
              private industryUpdateService: IndustryUpdateService,
              private eclConstantsService: ECLConstantsService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.pageTitle = params['pageTitle'];
    });
    this.userId = this.utils.getLoggedUserId();
    this.fetchIndustryUpdateDetails();
  }

  private fetchIndustryUpdateDetails(): void {
    this.loading = true;

    this.industryUpdateService.getIndustryUpdateHistoryDetails().subscribe((response: BaseResponse) => {
      this.industryDetails = response.data;
      this.updateRowGroupMetaData();
      this.loading = false;

    });

  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.industryDetails) {
      for (let i = 0; i < this.industryDetails.length; i++) {
        let rowData = this.industryDetails[i];
        let accordianHeading = rowData.accordianHeading;
        if (i == 0) {
          this.rowGroupMetadata[accordianHeading] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.industryDetails[i - 1];
          let previousRowGroup = previousRowData.accordianHeading;
          if (accordianHeading === previousRowGroup)
            this.rowGroupMetadata[accordianHeading].size++;
          else
            this.rowGroupMetadata[accordianHeading] = { index: i, size: 1 };
        }

        if (!this.rowGroupMetadata[accordianHeading]["internalArray"]) {
          this.rowGroupMetadata[accordianHeading]["internalArray"] = [];
        }

        this.rowGroupMetadata[accordianHeading]["internalArray"].push(rowData);
      }
    }

    this.industryDetails.forEach(iu => {
      if(iu.action === 'Current')
        this.expandedRows[iu.accordianHeading] = true;
    });

    this.expandedRows = Object.assign({}, this.expandedRows);



    let result = [];
    this.paginatedData = [];
    let records = 0;

    for (var i in this.rowGroupMetadata) {
      result.push(this.rowGroupMetadata[i]);
      records++;
    }

    this.totalRecords = records;


    for(let i = 0; i < result.length; i++) {
      this.paginatedData = this.paginatedData.concat(result[i].internalArray);
    }

    this.updateLocalRowGroupMetaData();
  }

  updateLocalRowGroupMetaData() {
    this.rowLocalGroupMetadata = {};
    if (this.paginatedData) {

      let realIndex = 0;

      for (let i = 0; i < this.paginatedData.length; i++) {
        let rowData = this.paginatedData[i];
        let accordianHeading = rowData.accordianHeading;
        if (i == 0) {
          this.rowLocalGroupMetadata[accordianHeading] = { index: realIndex, size: 1 };
          realIndex++;
        }
        else {
          let previousRowData = this.paginatedData[i - 1];
          let previousRowGroup = previousRowData.accordianHeading;
          if (accordianHeading === previousRowGroup)
            this.rowLocalGroupMetadata[accordianHeading].size++;
          else
            this.rowLocalGroupMetadata[accordianHeading] = { index: realIndex, size: 1 };
            realIndex++;
        }

      }
    }
  }

  public initiateIndustryUpdate(industryUpdate: any) {
    this.confirmationService.confirm({
      message: 'This process may take several minutes, would you like to proceed?',
      accept: ()=> {
        industryUpdate.status = 'Processing...';
        this.loading = true;
        let request = {
          "industryUpdateKey": industryUpdate.updateInstanceKey,
          "runId" : industryUpdate.impactSeq,
          "userId": this.userId
        }
        this.industryUpdateService.initiateIndustryUpdate(request).subscribe(response => {
            if (response.data === true) {
              this.industryUpdateService.getIndustryUpdateHistoryDetails().subscribe((response: any) => {
                this.industryDetails = [];
                this.industryDetails = response.data;
                this.updateRowGroupMetaData();

                this.messageService.add({
                  severity: 'success',
                  summary: 'Info',
                  detail: "Initiation of Industry Update for '" + industryUpdate.industryUpdateName + "' successfully completed.",
                  life: 3000,
                  closable: true
                });

                this.loading = false;
              });

            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: "There was an error while initiating Industry Update for '" + industryUpdate.industryUpdateName + "'.",
                life: 3000,
                closable: true
              });

              this.loading = false;
            }

          },
          error => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warning',
              detail: "There was an error while initiating Industry Update for '" + industryUpdate.industryUpdateName + "'.",
              life: 3000,
              closable: true
            });

            this.loading = false;

          }
        );

      },
      reject: ()=>{
        return false;
      }
    })

  }

  resetDataTable(viewGrid) {
    this.loading = true;
    this.keywordSearch = "";
    this.loading = false;
  }

}
