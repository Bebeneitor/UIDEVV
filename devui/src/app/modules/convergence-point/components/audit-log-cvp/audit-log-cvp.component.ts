import { Component, OnInit, ViewChild } from '@angular/core';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';

const MODULE_NAME = 'moduleName';
const PO_CCA = 'poCca';
const ACTION = 'action';
const PERFORMED_BY = 'performedBy';

@Component({
  selector: 'app-audit-log-cvp',
  templateUrl: './audit-log-cvp.component.html',
  styleUrls: ['./audit-log-cvp.component.css']
})
export class AuditLogCvpComponent implements OnInit {

  primaryRequirements: any = [];
  poCcas: any = [];
  actions: any = [];
  performedBys: any = [];

  selectedPrimaryRequirements: string[] = [];
  selectedPoCcas: string[] = [];
  selectedActions: string[] = [];
  selectedPerformedBys: string[] = [];

  startDate: Date;
  endDate: Date;
  minDate: Date = Constants.MIN_VALID_DATE;
  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  displayGrid: boolean = false;
  criteriaFilters: any = {};
  tableConfig: EclTableModel = null;

  @ViewChild('tableResults',{static: true}) tableResults;

  constructor(private convergencePointService: ConvergencePointService, private toastService: ToastMessageService) { }

  ngOnInit() {

    this.loadFilters();
  }

  refresh() {
    this.selectedPrimaryRequirements = [];
    this.selectedPoCcas = [];
    this.selectedActions = [];
    this.selectedPerformedBys = [];
    this.startDate = null;
    this.endDate = null;
    this.displayGrid = false;

    this.tableResults.resetDataTable(false);
  }

  view() {

    this.displayGrid = false;

    if (!this.checkFilters()) {

      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please enter at least one filter to continue.');
      return;
    }

    this.criteriaFilters = {
      "moduleNames": this.selectedPrimaryRequirements,
      "dtFrom": this.startDate,
      "dtTo": this.endDate,
      "poCcaNames": this.selectedPoCcas,
      "actions": this.selectedActions,
      "performedByNames": this.selectedPerformedBys
     
    }
    let tableConfig = new EclTableModel();
    let colManager = new EclTableColumnManager();

    colManager.addTextColumn('moduleName', 'Primary Requirement', '12%', true, EclColumn.TEXT, true, 0, 'left');
    colManager.addTextColumn('subModuleName', 'Section/ Attachment Name', '8%', true, EclColumn.TEXT, true, 0, 'left');
    colManager.addTextColumn('newExisting', 'New/Existing', '10%', true, EclColumn.TEXT, true, 0, 'center');
    colManager.addTextColumn('sectionAttachment', 'Section/Attachment', '9%', true, EclColumn.TEXT, true, 0, 'center');
    colManager.addTextColumn('moduleVersion', 'Primary Requirement Version', '5%', true, EclColumn.TEXT, true, 0, 'center');
    colManager.addTextColumn('subModuleVersion', 'Section/ Attachment Version', '5%', true, EclColumn.TEXT, true, 0, 'center');
    colManager.addDateColumn('creationDt', 'Date', '10%', true, true, 'date', 'dd-MMM-yy', EclColumn.TEXT);
    colManager.addTextColumn('poCca', 'PO/CCA', '9%', true, EclColumn.TEXT, true, 0, 'center');
    colManager.addTextColumn('action', 'Action', '9%', true, EclColumn.TEXT, true, 0, 'center');
    colManager.addTextColumn('performedBy', 'Performed By', '9%', true, EclColumn.TEXT, true, 0, 'center');
    colManager.addTextColumn('comments', 'Comments', '9%', true, EclColumn.TEXT, true, 0, 'center');

    tableConfig.columns = colManager.getColumns();
    tableConfig.url = environment.cvpDocsServiceUrl + RoutingConstants.CVP_AUDIT_LOG + '/' + RoutingConstants.CVP_FILTERS;
    tableConfig.lazy = true;
    tableConfig.export = false;
    tableConfig.isFullURL = true;
    tableConfig.showRecords = true;
    tableConfig.paginationSize = 10;
    tableConfig.criteriaFilters = this.criteriaFilters;
    tableConfig.excelFileName = 'AUDIT LOG REPORT';
    tableConfig.storageFilterKey = 'AUDIT_LOG_REPORT';
    tableConfig.filterGlobal = false;
    tableConfig.checkBoxSelection = false;
    this.tableConfig = tableConfig;


    this.displayGrid = true;
  }

  checkFilters() {

    if (this.selectedActions.length == 0 && this.selectedPoCcas.length == 0 && this.selectedPrimaryRequirements.length == 0
      && this.startDate == null && this.endDate == null && this.selectedPerformedBys.length == 0) {
      return false;
    }

    return true;
  }

  generateReport() {
    this.tableResults.exportData('excel');
  }

  loadFilters() {

    return new Promise(resolve => {

      let pr = JSON.parse(JSON.stringify(this.selectedPrimaryRequirements));
      let pocca = JSON.parse(JSON.stringify(this.selectedPoCcas));
      let actions = JSON.parse(JSON.stringify(this.selectedActions));
      let performedby = JSON.parse(JSON.stringify(this.selectedPerformedBys));

      this.primaryRequirements = [];
      this.convergencePointService.getFilterCatalog(MODULE_NAME).subscribe((response: BaseResponse) => {
        response.data.forEach(item => {
          this.primaryRequirements.push({
            'label': item,
            'value': item
          });
        });
        this.selectedPrimaryRequirements = JSON.parse(JSON.stringify(pr));

        this.poCcas = [];
        this.convergencePointService.getFilterCatalog(PO_CCA).subscribe((response: BaseResponse) => {
          response.data.forEach(item => {
            this.poCcas.push({
              'label': item,
              'value': item
            });
          });
          this.selectedPoCcas = JSON.parse(JSON.stringify(pocca));

          this.actions = [];
          this.convergencePointService.getFilterCatalog(ACTION).subscribe((response: BaseResponse) => {
            response.data.forEach(item => {
              this.actions.push({
                'label': item,
                'value': item
              });
            });
            this.selectedActions = JSON.parse(JSON.stringify(actions));

            this.performedBys = [];
            this.convergencePointService.getFilterCatalog(PERFORMED_BY).subscribe((response: BaseResponse) => {
              response.data.forEach(item => {
                this.performedBys.push({
                  'label': item,
                  'value': item
                });
              });
              this.selectedPerformedBys = JSON.parse(JSON.stringify(performedby));

              resolve();
            });
          });
        });
      });
    });
  }

}
