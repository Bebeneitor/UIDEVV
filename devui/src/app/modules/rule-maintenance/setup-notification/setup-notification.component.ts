import { Component, OnInit, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReferenceSourceService } from 'src/app/services/reference-source.service';
import { MessageService } from 'primeng/api';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';

const DAILY = 'Daily';
const WEEKLY = 'Weekly';
const FORTNIGHTLY = 'Fortnightly';
const MONTHLY = 'Monthly';
const BIMONTHLY = 'Bi-Monthly';
const QUARTERLY = 'Quarterly';
const ANNUAL = 'Annual';
const SETUP_TITLE = 'Setup Notifications';

@Component({
  selector: 'app-setup-notification',
  templateUrl: './setup-notification.component.html',
  styleUrls: ['./setup-notification.component.css']
})
export class SetupNotificationComponent implements OnInit {

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  constructor(private util: AppUtils, public route: ActivatedRoute, private http: HttpClient,
    private messageService: MessageService, private refSourceService: ReferenceSourceService) { }

  @ViewChild('setupNotif',{static: true}) setupNotifTable: EclTableComponent;

  showDuplicateMessage: boolean = false;
  duplicateMessage: any = '';
  validFrequencies: any[];
  userId: number;
  loading: boolean;
  minDate: Date = new Date();
  pageTitle = SETUP_TITLE;
  setupNotifTableConfig: EclTableModel = new EclTableModel();

  ngOnInit() {
    this.validFrequencies = [
      { label: '', value: '' },
      { label: DAILY, value: DAILY },
      { label: WEEKLY, value: WEEKLY },
      { label: FORTNIGHTLY, value: FORTNIGHTLY },
      { label: MONTHLY, value: MONTHLY },
      { label: BIMONTHLY, value: BIMONTHLY },
      { label: QUARTERLY, value: QUARTERLY },
      { label: ANNUAL, value: ANNUAL }
    ];

    this.userId = this.util.getLoggedUserId();

    this.initializeTableConfig();
  }
  private initializeTableConfig() {
    let manager = new EclTableColumnManager();
    manager.addInputColumn('sourceDesc', 'Reference Source', '15%', true, EclColumn.TEXT, true );
    manager.addInputColumn('url', 'URL/Link', '40%', true, EclColumn.TEXT, true );
    manager.addDropDownColumn('frequency', 'Frequency','12%', true, EclColumn.DROPDOWN, this.validFrequencies, null, true);
    manager.addCalendarColumn('startDt', 'Start Date', '20%', true, true);
    this.setupNotifTableConfig.columns = manager.getColumns();
    this.setupNotifTable.customFilterOptions = this.validFrequencies;
    this.setupNotifTableConfig.lazy = true;
    this.setupNotifTableConfig.sortOrder = 1;
    this.setupNotifTableConfig.checkBoxSelection = true;
    this.setupNotifTableConfig.excelFileName = this.pageTitle;
    this.setupNotifTableConfig.sortBy
    this.setupNotifTableConfig.url = `${RoutingConstants.REFERENCE_SOURCE_URL}/${RoutingConstants.FILTERED}`;
  }

  validateSelectedRows(action) {
    let res: boolean = true;
    let selectedData = this.setupNotifTable.selectedRecords;
    if (selectedData.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'No data Selected', life: 3000, closable: false });
      res = false;
    }

    if (action === 'save') {
      selectedData.forEach(data => {
        if (!data.startDt) {
          this.messageService.add({ severity: 'warn', summary: 'Info', detail: `${data.refSource}: Start date is mandatory`, life: 3000, closable: false });
          res = false;
        }
      });
    }
    return res;
  }

  add() {
    this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'New blank row inserted. please edit and save', life: 3000, closable: false });
    let refSource = { refSource: '', link: '', frequency: '', startDt: '' };
    this.setupNotifTable.value.push(refSource);
    this.setupNotifTable.selectedRecords.push(refSource);
  }

  remove(): void {
    if (this.validateSelectedRows('remove')) {
      let selectedData = this.setupNotifTable.selectedRecords;
      selectedData.forEach(rowData => {
        if (rowData.refSourceId) {
          this.http.delete(environment.restServiceUrl + RoutingConstants.REF_SOURCES_URL + '/' + rowData.refSourceId).subscribe(response => {
            this.loading = false;
          });
        }
      });
      this.messageService.add({ severity: 'success', summary: 'Info', detail: 'Selected referenced have been successfully removed!', life: 3000, closable: false });
      setTimeout(() => this.setupNotifTable.resetDataTable(), 1000);
      this.setupNotifTable.selectedRecords = [];
    }
  }

  save(): void {
    if (this.validateSelectedRows('save')) {
      let selectedData = this.setupNotifTable.selectedRecords;
      let allDupValidation = selectedData.map(rowData => this.checkForDuplicateRefSource(rowData)); 
      Promise.all(allDupValidation)
      .then(result => {
        let dups = result.filter(r => r !== null);
        if (dups.length > 0) {
          this.messageService.add({ severity: 'warn', summary: 'Info', detail: `Reference source with name ${dups.join(', ')} already exists.`, life: 3000, closable: false });
        } else {
          this.refSourceService.saveReferenceSource(selectedData).subscribe(response => {
            this.messageService.add({ severity: 'success', summary: 'Info', detail: 'Selected referenced have been successfully saved!', life: 3000, closable: false });
            this.loading = false;
            this.setupNotifTable.resetDataTable();
            this.setupNotifTable.selectedRecords = [];
          });
        }
      })
    }
  }

  checkForDuplicateRefSource(rowData: any): Promise<string> {
    return new Promise<string> ((resolve) => {
      let found = this.setupNotifTable.value.find(refSrc => refSrc.refSourceId !== rowData.refSourceId 
          && refSrc.sourceDesc === rowData.sourceDesc);
      if (found) {
        resolve(found.sourceDesc);
      } else {
        // search in backend for dup name
        this.refSourceService.findAllReferenceSource(rowData.sourceDesc).subscribe((resp:any) => {
          let data = resp.data;
          if (data) {
            let found = data.find(refSrc => refSrc.refSourceId !== rowData.refSourceId 
              && refSrc.sourceDesc === rowData.sourceDesc);
            if (found) {
              resolve(found.sourceDesc);
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        })
      }
    })
    }
}
