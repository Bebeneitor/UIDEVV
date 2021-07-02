import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUtils } from 'src/app/shared/services/utils';
import { IndustryUpdateService } from 'src/app/services/industry-update.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import {ECLConstantsService} from "../../../services/ecl-constants.service";
import {ConfirmationService, MessageService, DynamicDialogRef, DialogService} from "primeng/api";
import { DialogModule } from 'primeng/dialog';
import { PridFormComponent } from 'src/app/shared/components/prid-form/prid-form.component';

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

  showSubmit: boolean;

  createProjectForm: FormGroup;
  templateForm: FormGroup;

  submitBtnDisable = false;
  saveDisplay = false;
  Message: string;
  isSubmit = false;

  filters: any = {
    industryUpdate: '',
    date: '',
    action: '',
    status: ''
  }

  arrayMessage = [];

  cols = [
    { field: 'industryUpdateName', header: 'Industry Update', width: '50%' },
    { field: 'effectiveDate', header: 'Effective Date', width: '15%' },
    { field: 'action', header: 'Action', width: '20%' },
    { field: 'status', header: 'Status', width: '15%' }
  ];

  projectCreationModal;

  constructor(private route: ActivatedRoute, private utils: AppUtils,
              private industryUpdateService: IndustryUpdateService,
              private eclConstantsService: ECLConstantsService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private fb: FormBuilder,
              public ref: DynamicDialogRef,
              private dialogService: DialogService) { }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.pageTitle = params['pageTitle'];
    });
    this.userId = this.utils.getLoggedUserId();
    this.fetchIndustryUpdateDetails();

    // Create the prid project form.
    this.createProjectForm = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      summary: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });
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
      if(iu.action === 'Current' || iu.action === 'Current Update' || iu.action === 'Current Block' || iu.action === 'Current Update Block')
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
                  detail: "ICMS Industry Update for '" + industryUpdate.industryUpdateName + "' is started, after completion you will receive an email.",
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

  /**
   * Open the dialog window which calls the PRID component
   * @param iu 
   */
  public showPridCreationForm(iu: any) {
    const dialogRef: DynamicDialogRef = this.dialogService.open(PridFormComponent, {
      data: iu,
      header: 'PRID Details',
      width: '40%',
      contentStyle: { "max-height": "70%", "overflow": "auto" }
    });
    dialogRef.onClose.subscribe(data=> {
      this.fetchIndustryUpdateDetails();
    });
  }

  saveDialog() {
    this.saveDisplay = false;
    if (this.isSubmit) {
      this.ref.close();
    }
  }

  onHide(event){
    this.arrayMessage = [];
  }

}
