import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, SortEvent } from 'primeng/api';
import { AppUtils } from 'src/app/shared/services/utils';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProvisionalRuleService } from 'src/app/services/provisional-rule.service';
import { StorageService } from 'src/app/services/storage.service';
import {ExcelService} from "../../../services/excel.service";
import {CrosswalkService} from "../../../services/crosswalk.service";
import {ConfirmationDialogService} from "../../confirmation-dialog/confirmation-dialog.service";
import {ProvisionalRuleComponent} from "../../rule-creation/provisional-rule/provisional-rule.component";
import {OverlayPanel} from "primeng/overlaypanel";
import {ECLConstantsService} from "../../../services/ecl-constants.service";

const ICMS_RULE_ENGINE_SHORT_DESC ="ICMS";

@Component({
  selector: 'app-industry-update-crosswalk',
  templateUrl: './industry-update-crosswalk.component.html',
  styleUrls: ['./industry-update-crosswalk.component.css'],
  providers: [ConfirmationService]
})
export class IndustryUpdateCrosswalkComponent implements OnInit {

  @ViewChild('viewGrid',{static: true}) viewGrid: any;
  cols: any[];
  data: any[] = [];
  selectedData: any[] = [];
  ruleStatus: number;
  pageTitle: string;
  keywordSearch: string;
  userId: number;
  reviewComment: any;
  allRules: any[];
  allRuleStatus: any[];
  displayReviewStatusList: any[];
  filteredRules: RuleInfo[];
  validStatusCode: any[] = [];
  loading: boolean;
  idearequiredVal: boolean = true;
  saveDisplay: boolean = false;
  Message: string;
  customToolTip: string;
  columnsToExport: any[] = [];

  filters : any = {
    mapId : '',
    ruleId : '',
    subRule : '',
    ruleCode : '',
    ruleDesc : '',
    currentStatus : '',
    workOrderNumber : '',
    implementationDate : '',
    createdOn : '',
    updatedOn : ''
  }

  constructor(private util: AppUtils,private excelSrv: ExcelService, public route: ActivatedRoute, private http: HttpClient,
              private dialogService: DialogService, private confirmationDialogService: ConfirmationDialogService, private router: Router,
              private confirmationService: ConfirmationService, private provisionalService: ProvisionalRuleService, private messageService: MessageService,
              private crosswalkService: CrosswalkService,private storageService : StorageService,
              private eclConstantsService: ECLConstantsService) {
    this.validStatusCode = [];
    this.cols = [
      { field: 'mapId', header: 'Map ID', width: '5%' },
      { field: 'ruleId', header: 'Mid Rule', width: '5%' },
      { field: 'subRule', header: 'Sub Rule', width: '5%' },
      { field: 'ruleCode', header: 'ECL ID', width: '8%' },
      { field: 'ruleDesc', header: 'Rule Description', width: '10%' },
      { field: 'currentStatus', header: 'Current Status', width: '8%' },
      { field: 'workOrderNumber', header: 'Work Order Number', width: '8%' },
      { field: 'implementationDate', header: 'Implementation Date', width: '8%' },
      { field: 'createdOn', header: 'Created On', width: '8%' },
      { field: 'updatedOn', header: 'Updated On', width: '8%' }
    ];
  }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.ruleStatus = params['ruleStatus'];
      this.pageTitle = params['pageTitle'];
      this.userId = this.util.getLoggedUserId();
    });
    this.fetchAllRules(ICMS_RULE_ENGINE_SHORT_DESC);
    this.keywordSearch = '';

    this.cols.forEach(value => {
      this.columnsToExport.push(value.field);
    })
  }

  selectCurrentPage(viewGrid): void {
    this.selectedData = this.selectedData.slice(viewGrid.first, viewGrid.first + viewGrid.rows);

  }

  refreshRuleApproval(viewGrid) {
    this.loading = true;
    this.keywordSearch = "";
    viewGrid.selection = [];

    //Clear filters
    this.filters = {
      mapId : '',
      ruleId : '',
      subRule : '',
      ruleCode : '',
      ruleDesc : '',
      currentStatus : '',
      workOrderNumber : '',
      implementationDate : '',
      createdOn : '',
      updatedOn : ''
    };

    this.fetchAllRules(ICMS_RULE_ENGINE_SHORT_DESC);
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  public openConfirmationDialog() {
    this.idearequiredVal = false;
    this.confirmationDialogService.confirm('', 'Do you really want to exit from the screen?')
      .then((confirmed) => {
        if (confirmed) {
          this.idearequiredVal = false;
          this.navigateHome();
        } else {
          this.idearequiredVal = true;
        }
      });
  }

  viewProvisionalModal(ruleId: any) {
    const ref = this.dialogService.open(ProvisionalRuleComponent, {
      data: {
        ruleId: ruleId,
        header: "Library View",
        isSameSim: false,
        fromSameSimMod: false,
        fromMaintenanceProcess: false,
        readOnlyView: true,
        provDialogDisable: true,
        ruleReview: true,
        readWrite: false
      },
      header: 'Library Rule Details',
      width: '80%',
      height: '92%',
      closeOnEscape: false,
      closable: false,
      contentStyle: { 
        'max-height': '92%', 
        'overflow': 'auto',
        'padding-top': '0', 
        'padding-bottom': '0', 
        'border': 'none' }
    });
  }

  showDescription(event, description: string, overLayPanel: OverlayPanel) {
    overLayPanel.toggle(event);
    this.customToolTip = description;
  }

  private fetchAllRules(ruleEngineShortDesc): void {
    this.crosswalkService.getAllEclRuleEngineMapping(ruleEngineShortDesc).subscribe((response: any) => {
      this.allRules = [];
      this.allRuleStatus = [];
      this.displayReviewStatusList = [];

      response.data.forEach(element => {
        this.allRules.push({
          'mapId': element.mappingId,
          'ruleId': element.version1,
          'subRule': element.version2,
          'eclId': element.rule.ruleId,
          'ruleCode': element.rule.ruleCode,
          'ruleDesc': element.ruleDesc,
          'currentStatus': element.statusId,
          'workOrderNumber': element.workOrderNumber,
          'implementationDate': element.implementationDt,
          'createdOn': element.startDt,
          'updatedOn': element.endDt,
        });
      });
      this.filteredRules = this.allRules;
      this.loading = false;

    });
    this.selectedData = null;
  }

  resethDataTable(viewGrid) {
    this.loading = true;
    this.keywordSearch = "";
    this.loading = false;
  }
  /* function to confirm message for exit button*/
  exit() {
    this.confirmationService.confirm({
      message: 'All unsaved changes will be lost. Are you sure you want to Exit?',
      header: 'Exit',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.navigateHome();
        //Actual logic to perform a confirmation
      }
    });
  }

  /**
   * Custom sort to handle numbers and strings in sort functionality
   * @param event
   */
  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if(!isNaN(value1)) {
          value1 = Number(value1);
        }

        if(!isNaN(value2)) {
          value2 = Number(value2);
        }

        if (value1 == null && value2 != null) {
            result = -1;
        } else if (value1 != null && value2 == null) {
            result = 1;
        } else if (value1 == null && value2 == null) {
            result = 0;
        } else if (typeof value1 === 'string' && typeof value2 === 'string') {
            result = value1.localeCompare(value2);
        } else {
            result = (Number(value1) < Number(value2)) ? -1 : (Number(value1) > Number(value2)) ? 1 : 0;
        }

        return (event.order * result);
    });
  }

}
