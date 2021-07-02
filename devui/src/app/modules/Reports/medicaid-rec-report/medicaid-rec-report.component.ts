import { Component, OnInit, ViewChild } from '@angular/core';
import { PageTitleConstants as ptc } from 'src/app/shared/models/page-title-constants';
import { SelectItem } from 'primeng/api';
import { MedicaidReportService } from 'src/app/services/medicaid-report.service';
import { Constants } from 'src/app/shared/models/constants';
import { MidRuleBoxComponent } from '../components/mid-rule-box/mid-rule-box.component';
import { MwfReportRequestDto } from 'src/app/shared/models/dto/mwf-report-request-dto';
import { MwfClientDto } from 'src/app/shared/models/dto/mwf-client-dto';
import { MwfReportResponseDto } from 'src/app/shared/models/dto/mwf-report-response-dto';
import { ToastMessageService } from 'src/app/services/toast-message.service';


@Component({
  selector: 'app-medicaid-rec-report',
  templateUrl: './medicaid-rec-report.component.html',
  styleUrls: ['./medicaid-rec-report.component.css']
})
export class MedicaidRecReportComponent implements OnInit {

  @ViewChild(MidRuleBoxComponent,{static: true}) midBox: MidRuleBoxComponent
  pageTitle: string = ptc.MEDICAID_REPORT_TITLE;
  listBoxStyle = { 'width': '100%', 'overflow': 'auto', 'height': '360px' };

  resultFields: SelectItem[] = [];

  selectedResultFields: any[] = [{ label: 'Client Name', value: 0 }, { label: 'Medical Policy Title', value: 1 }, { label: 'Topic Title', value: 2 },
  { label: 'Decision Point Key', value: 3 }, { label: 'Decision Point Desc', value: 4 }
  ];

  updateInstanceNames: SelectItem[];
  selectedUpdateInstanceName: string[];

  clients: SelectItem[];
  selectedClient: string;

  payers: SelectItem[];
  selectedPayer: string[];

  clientsPayers: SelectItem[];
  selectedClientPayers: string;

  selectedStartDate: Date;
  maxDate: Date;

  selectedEndDate: Date;

  yearValidRangeEft: string;

  clientExist: boolean;
  payerExist: boolean;
  midRuleExist: boolean;
  midText: string[];
  midTextLength: number = 0;
  midTextErrorText = 'hidden';

  currentDate: string = "";

  filteredData: MwfReportResponseDto[];

  loading: boolean;

  mwfReportRequestDto: MwfReportRequestDto = new MwfReportRequestDto();

  cols: any[];
  filteredCols: any[];
  mwfReportResponceDto: MwfReportResponseDto[];
  isViewBtnDisabled: boolean;
  isMwfTableDisplay: boolean;

  fromDateNotEntered: boolean;

  constructor(private medicaidReportService: MedicaidReportService, private toastService: ToastMessageService) {
    this.yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

    this.cols = [
      { field: 'midRuleDotVersion', header: 'Mid Rule Dot Version', width: '5%' },
      { field: 'subRuleKey', header: 'Sub Rule Key', width: '5%' },
      { field: 'instanceName', header: 'Update Instance Name', width: '5%' },
      { field: 'state', header: 'State', width: '5%' },
      { field: 'clients', header: 'Client Name', width: '5%' },
      { field: 'payers', header: 'Payer Shorts', width: '5%' },
      { field: 'medicalPolicy', header: 'Medical Policy Title', width: '5%' },
      { field: 'topic', header: 'Topic Title', width: '5%' },
      { field: 'decisionPointKey', header: 'Decision Point Key', width: '5%' },
      { field: 'decisionPointDesc', header: 'Decision Point Desc', width: '5%' },
      { field: 'subRuleDesc', header: 'Sub Rule Desc', width: '5%' },
      { field: 'subRuleNotes', header: 'Sub Rule Notes', width: '5%' },
      { field: 'raRecommendationComments', header: 'RA Comments', width: '5%' },
      { field: 'raReviewDetails', header: 'RA Review Details', width: '5%' },
      { field: 'raRecommendationDesc', header: 'RA Recommendation', width: '5%' },
      { field: 'raLink1', header: 'RA Link I', width: '5%' },
      { field: 'raLink2', header: 'RA Link II', width: '5%' },
      { field: 'raLink3', header: 'RA Link III', width: '5%' },
      { field: 'instanceCompletionDt', header: 'Instance Completion Date', width: '5%' }
    ];
  }

  ngOnInit() {
    //this.getUpdateInstanceNames();
    this.initializeResultFields();
    this.initializeSelectedItems();
    this.clientExist = false;
    this.payerExist = false;
    this.midRuleExist = false;
    let todayDate = new Date();
    let dateLongFormat = (todayDate.getMonth() + 1).toString() + ' ' + todayDate.getDate().toString()
      + ' ' + todayDate.getFullYear().toString();
    this.currentDate = new Date(dateLongFormat).toString().substring(0, 15);
    this.fromDateNotEntered = true;
    this.mwfReportRequestDto = new MwfReportRequestDto();
  }

  initializeResultFields() {
    this.resultFields = [
      { label: 'Mid Rule Dot Version', value: 1 }, { label: 'Sub Rule Key', value: 2 }, { label: 'Update Instance Name', value: 3 },
      { label: 'State', value: 4 }, { label: 'Payer Shorts', value: 6 }, { label: 'Sub Rule Desc', value: 11 },
      { label: 'Sub Rule Notes', value: 12 }, { label: 'RA Comments', value: 13 }, { label: 'RA Review Details', value: 14 },
      { label: 'RA Recommendation', value: 15 }, { label: 'RA Link I', value: 16 }, { label: 'RA Link II', value: 17 },
      { label: 'RA Link III', value: 18 }, { label: 'Instance Completion Date', value: 19 }];
  }

  initializeSelectedItems() {
    this.selectedResultFields = [
      { label: 'Client Name', value: 5 }, { label: 'Medical Policy Title', value: 7 }, { label: 'Topic Title', value: 8 },
      { label: 'Decision Point Key', value: 9 }, { label: 'Decision Point Desc', value: 10 }
    ];
  }

  private getUpdateInstanceNames(): void {
    this.medicaidReportService.getAllUpdateInstanceNames(this.selectedStartDate, this.selectedEndDate).then((response: SelectItem[]) => {
      this.updateInstanceNames = response;
    });
  }

  getClients() {
    if (this.selectedUpdateInstanceName.length > 0) {
      let requestBody: any;
      requestBody = {
        fromDate: this.selectedStartDate,
        toDate: this.selectedEndDate,
        updateInstanceNames: this.selectedUpdateInstanceName
      };
      this.medicaidReportService.getClientsByUpdateInstanceKey(requestBody).then((response: SelectItem[]) => {
        if (response && response.length > 0) {
          this.clients = response;
        }
      });
    } else {
      this.clients = [];
      this.payers = [];
    }
  }

  /**
   * getPayers is getting payers by ClientName and updateInstanceNames
   */
  getPayers() {
    let requestBody: any;
    requestBody = {
      clientName: this.selectedClient,
      updateInstanceNames: this.selectedUpdateInstanceName
    };
    this.medicaidReportService.getPayersByClient(requestBody).then((response: SelectItem[]) => {
      if (response && response.length > 0) {
        this.payers = response;
        this.selectedPayer = undefined;
        this.isExistingPayersForClient();
      }
    });
    this.setClientPayers();
  }

  setClientPayers(): void {
    if (this.clientsPayers != null && this.clientsPayers != undefined && this.clientsPayers.length > 0) {
      if (!this.isExistingClient()) {
        let clientPayerLen = this.clientsPayers.length;
        this.clientsPayers[clientPayerLen] = { label: this.selectedClient, value: clientPayerLen };
      }
    } else {
      this.clientsPayers = [{ label: this.selectedClient, value: 0 }];
    }

  }

  /**
   * isExistingPayersForClient Checking if Client already has Payer assigned.
   */
  isExistingPayersForClient() {
    this.clientsPayers.forEach(ele => {
      const clientPayers = ele.label.split('(');
      const client = clientPayers[0].trim();
      if (clientPayers[1]) {
        const payers = this.removePayerParatheses(clientPayers[1]).split(',');
        if (client === this.selectedClient) {
          if (payers.length > 0) {
            this.selectedPayer = [...payers];
          }
        }
      }
    });
  }

  isExistingClient(): boolean {
    let resp: boolean = false;
    this.clientsPayers.forEach(ele => {
      let client = ele.label.split('(')[0].trim();
      if (client === this.selectedClient) {
        resp = true;
      }
    });
    return resp;
  }

  runValidation() {
    this.midBox.validCheck();
  }

  viewResults() {
    if (!this.validateMwfForm()) {
      return;
    }
    let filterFields = [];
    this.mwfReportRequestDto.fromDate = this.selectedStartDate;
    if (this.selectedEndDate == undefined) {
      this.selectedEndDate = new Date();
    }
    this.mwfReportRequestDto.toDate = this.selectedEndDate;

    this.mwfReportRequestDto.updateInstanceName = this.selectedUpdateInstanceName;
    this.selectedResultFields.forEach(item => {
      filterFields.push(item.label);
    });
    this.mwfReportRequestDto.selectedFields = filterFields;
    this.extractClientPayers();
    if (this.midText !== undefined && this.midText !== null && (this.midText[0].length !== 0 || this.midText[0] !== '')) {
      this.mwfReportRequestDto.midRuleIdList = this.midText;
      this.midRuleExist = true;
    } else {
      this.mwfReportRequestDto.midRuleIdList = [];
      this.midRuleExist = false;
    }
    this.mwfReportRequestDto.fieldParam = this.populateFieldParam();
    this.loading = true;
    this.medicaidReportService.getMwfReport(this.mwfReportRequestDto).subscribe((response: any) => {
      if (response.data) {
        this.mwfReportResponceDto = response.data;
        this.filteredData = this.mwfReportResponceDto;
        this.loading = false;
      }

      if (this.filteredData !== null && this.filteredData.length > 0) {
        this.isMwfTableDisplay = true;
      }
    });

    this.arrangeColumns();


  }

  arrangeColumns() {
    this.filteredCols = [];
    for (var i = 0; i < this.cols.length; i++) {
      for (var j = 0; j < this.selectedResultFields.length; j++) {
        if (this.cols[i].header === this.selectedResultFields[j].label) {
          this.filteredCols.push(this.cols[i]);
        }
      }
    }
  }

  refresh() {
    this.initializeResultFields();
    this.initializeSelectedItems();
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.selectedUpdateInstanceName = [];
    this.selectedClient = null;
    this.selectedPayer = null;
    this.mwfReportRequestDto.clientList = [];
    this.clientExist = false;
    this.payerExist = false;
    this.clientsPayers = [];
    this.midBox.midText = '';
    this.midText = null;
    this.midBox.updatedMidText = '';
    this.isMwfTableDisplay = false;
    this.initializeResultFields();
    this.runValidation();
    this.updateInstanceNames = [];
    this.fromDateNotEntered = true;
    this.clients = [];
    this.payers = [];
  }

  removeSelectedClient(e) {
    this.clientsPayers = this.clientsPayers.filter(client => client.value !== e);
  }

  sendUpdateMidText(e: string[]) {
    this.midText = e;
  }

  showMidTextLength(e: number) {
    this.midTextLength = e;
    e > 0 ? this.midTextErrorText = 'visible' : this.midTextErrorText = 'hidden';
  }

  /**
   * AppendToClient Attaching Payers on Client. (Mulitple way this can happen)
   * @param e value from primeng where value is the list and itemValue is current selection.
   */
  appendToClient(e) {
    let valueList: string[] = e.value;
    let currValue: string = e.itemValue;

    if (valueList.includes(currValue)) {
      for (let i = 0; i < this.clientsPayers.length; i++) {
        let client = this.clientsPayers[i].label.split('(');
        if (client[0].trim() === this.selectedClient) {
          if (!this.clientsPayers[i].label.includes('(')) {
            this.clientsPayers[i].label += ` (${currValue}`
            if (i === this.clientsPayers.length - 1) {
              this.clientsPayers[i].label += ')';
            }
          } else if (i === this.clientsPayers.length - 1) {
            this.clientsPayers[i].label = this.removePayerParatheses(this.clientsPayers[i].label);
            this.clientsPayers[i].label += `,${currValue})`
          } else {
            this.clientsPayers[i].label += `,${currValue}`
          }
          break;
        }
      }
    } else {
      if (currValue) {
        for (let i = 0; i < this.clientsPayers.length; i++) {
          let clientPayers = this.clientsPayers[i].label.split('(');
          clientPayers[1] = this.removePayerParatheses(clientPayers[1]);
          let client = clientPayers[0].trim();
          let payers = clientPayers[1].split(',');
          if (client === this.selectedClient) {
            let indexRemove = payers.findIndex(value => value === currValue);
            payers.splice(indexRemove, 1);
            if (payers[0] && payers[0].trim() !== '') {
              this.clientsPayers[i].label = `${client} (${payers.join(',')})`
            } else {
              this.clientsPayers[i].label = client;
            }
          }
        }
      } else if (valueList !== undefined && valueList !== null && valueList.length > 0 && currValue === undefined) {
        for (let i = 0; i < this.clientsPayers.length; i++) {
          let clientPayers = this.clientsPayers[i].label.split('(');
          let client = clientPayers[0].trim();
          if (client === this.selectedClient) {
            this.clientsPayers[i].label = `${client} (`;
            valueList.forEach((item, index) => {
              if (index === 0) {
                this.clientsPayers[i].label += `${item}`;
              } else if (index === valueList.length - 1) {
                this.clientsPayers[i].label += `,${item})`;
              } else {
                this.clientsPayers[i].label += `,${item}`;
              }
            });
          }
        }
      } else if (valueList.length <= 0 && currValue === undefined) {
        for (let i = 0; i < this.clientsPayers.length; i++) {
          let clientPayers = this.clientsPayers[i].label.split('(');
          let client = clientPayers[0].trim();
          if (client === this.selectedClient) {
            this.clientsPayers[i].label = client;
          }
        }
      }
    }
  }

  /**
   * removePayerParatheses Task to remove right Paratheses ) in Payers
   * @param label clientPayers[1].Label to be removed. (Used after it splits)
   */
  removePayerParatheses(label): string {
    return label.replace(/[)]/g, '');
  }

  extractClientPayers() {
    if (this.clientsPayers !== undefined && this.clientsPayers !== null && this.clientsPayers.length > 0) {
      this.mwfReportRequestDto.clientList = [];
      for (let index = 0; index < this.clientsPayers.length; index++) {
        let mwfClientDto: MwfClientDto = new MwfClientDto();
        let clientPayersArray = this.clientsPayers[index].label.split(',');
        for (let i = 0; i < clientPayersArray.length; i++) {
          if (i == 0) {
            mwfClientDto.clientName = clientPayersArray[i];
            this.clientExist = true;
          } else {
            mwfClientDto.payers[i - 1] = clientPayersArray[i];
            this.payerExist = true;
          }
        }
        this.mwfReportRequestDto.clientList.push(mwfClientDto);
      }
    }
  }

  populateFieldParam(): any {
    if (this.selectedStartDate !== null && this.selectedEndDate !== null && this.selectedUpdateInstanceName.length > 0
      && this.clientExist === false && this.payerExist === false && this.midRuleExist === false) {
      return Constants.MWF_INSTANCE_NUMBER;
    } else if (this.selectedStartDate !== null && this.selectedEndDate !== null && this.selectedUpdateInstanceName.length > 0
      && this.clientExist === false && this.payerExist === false && this.midRuleExist) {
      return Constants.MWF_MID_RULE_INSTANCE_NUMBER;
    } else if (this.selectedStartDate !== null && this.selectedEndDate !== null && this.selectedUpdateInstanceName.length > 0
      && this.clientExist && this.payerExist === false && this.midRuleExist === false) {
      return Constants.MWF_CLIENT_NUMBER;
    } else if (this.selectedStartDate !== null && this.selectedEndDate !== null && this.selectedUpdateInstanceName.length > 0
      && this.clientExist && this.payerExist && this.midRuleExist === false) {
      return Constants.MWF_PAYER_NUMBER;
    } else {
      return Constants.MWF_DEFAULT_NUMBER;
    }
  }

  generateReport() {
    this.loading = true;
    this.medicaidReportService.getGenerateReport(this.mwfReportRequestDto).subscribe((response: any) => {
      this.createDownloadFileElement(response);
      this.loading = false;
    });
  }
  createDownloadFileElement(response: any) {
    var a = document.createElement('a');
    document.body.appendChild(a);
    let blob = new Blob([response]), url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'Medicade_Report_' + this.currentDate + '.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  validateMwfForm(): boolean {
    if (this.selectedResultFields.length == 0) {
      this.toastService.message(Constants.TOAST_SEVERITY_WARN, "please add Result Field", null, Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
      return false;
    } else if (this.selectedStartDate == undefined && this.selectedEndDate != undefined || this.selectedStartDate == undefined) {
      this.toastService.message(Constants.TOAST_SEVERITY_WARN, "Please Enter From Date", null, Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
      return false;
    } else if (this.selectedUpdateInstanceName === undefined || this.selectedUpdateInstanceName.length <= 0) {
      this.toastService.message(Constants.TOAST_SEVERITY_WARN, "Please Enter Update Instance Name", null, Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
      return false;
    } else {
      return true;
    }
  }
  changeOrderAndMoveButtons(action: string, items: any[]): void { }
  onSelectItem(action: string, items: any[]): void {
    if (this.selectedResultFields.length == 0) {
      this.isViewBtnDisabled = true;
    }
  }
  onSelectItemchangeOrderAndMoveButtons(action: string, items: any[]): void {
  }
  changeOrderAndMoveButtonschangeOrderAndMoveButtons(action: string, items: any[]): void {
  }
  enableDisableOrderButtonschangeOrderAndMoveButtons(action: string, items: any[]): void {
  }

  setEnteredDate() {
    if (this.selectedStartDate != undefined) {
      this.fromDateNotEntered = false;
      this.getUpdateInstanceNames();
    }
  }
  populateClients() {

  }



}
