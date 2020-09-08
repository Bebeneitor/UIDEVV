import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { SameSimService } from 'src/app/services/same-sim.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { Constants } from 'src/app/shared/models/constants';
import { PageTitleConstants } from "src/app/shared/models/page-title-constants";
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { EclAsyncFileDetails } from 'src/app/shared/components/ecl-table/model/ecl-async-file-details';


@Component({
  selector: 'app-same-sim-list',
  templateUrl: './same-sim-list.component.html',
  styleUrls: ['./same-sim-list.component.css']
})
export class SameSimListComponent implements OnInit {

  @ViewChild('analysesTable') analysesTable: EclTableComponent;
  @ViewChild('myAnalysesTable') myAnalysesTable: EclTableComponent;

  cols: any[] = [];
  data: any[] = [];

  tabIndex: number = 0;

  totalRecords: number;
  first: number = 0;
  last: number = 5;

  tableAnalyses: EclTableModel;
  tableMyAnalyses: EclTableModel;
  sameSimTitle: string = PageTitleConstants.SAME_SIM_INDUSTRY_UPDATE_PROCESS;
  serviceUrl: string = "";
  selectedRules: any[];

  selectedDate: Date = null;

  filters: any = {
    id: '',
    name: '',
    createdBy: '',
    date: ''
  };

  constructor(private simService: SameSimService, private toastService: ToastMessageService,
    private dashboardService: DashboardService, private router: Router, private fileManagerService: FileManagerService,
    private eclConstantsService : ECLConstantsService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    

    this.tableAnalyses = new EclTableModel();
    this.tableMyAnalyses = new EclTableModel();
    

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['tab'] === Constants.TAB_ANALYSES) {
          this.tabIndex = 0;
      } else if (params['tab'] === Constants.TAB_MYANALYSES) {
          this.tabIndex = 1;
      }
  });
  this.initializeTableConfig(this.tableAnalyses, RoutingConstants.SAME_SIM_INDUSTRY_UPDATES_PARAM_YES);
  this.initializeTableConfig(this.tableMyAnalyses, RoutingConstants.SAME_SIM_INDUSTRY_UPDATES_PARAM_NO);

  }

  /**
    * event executed when a user clicks on the link column
    * @param event 
    */
   redirect(event: any) {
    const row = event.row;
    let urlArray = ['/same-sim-setup', row.sameSimId];
    
    this.router.navigate(urlArray);

    if(this.tabIndex == 0){
      this.refreshEclTable(this.analysesTable);
    }else if(this.tabIndex == 1){
      this.refreshEclTable(this.myAnalysesTable);
    }
}

/**
   * Assign the tab index to the selected tab.                                                                                                                                                                                                                                                                        
   * @param event tab event
   */
  handleTabViewChange(event: any) {
    this.tabIndex = event.index;
  }

  /**
   * Resets the table properties
   */
  refreshEclTable(table: EclTableComponent) {
    table.refreshTable();
  }

  /**
    * This method is for initialize EclTableModel
    * @param table
    * @param tabStatus
    */
   initializeTableConfig(table: EclTableModel, tabStatus: string) {
    table.url = RoutingConstants.SAME_SIM + '/' + tabStatus;
    table.columns = this.initializeTableColumns();
    table.lazy = true;
    table.sortOrder = 1; 
    
    switch (tabStatus) {
      case RoutingConstants.SAME_SIM_INDUSTRY_UPDATES_PARAM_YES:
          table.excelFileName = Constants.TAB_ANALYSES + ' ' + PageTitleConstants.SAME_SIM_INDUSTRY_UPDATE_PROCESS;
          break;
      case RoutingConstants.SAME_SIM_INDUSTRY_UPDATES_PARAM_NO:
          table.excelFileName = Constants.TAB_MYANALYSES + ' ' + PageTitleConstants.SAME_SIM_INDUSTRY_UPDATE_PROCESS;
          break;
    }
   
   table.checkBoxSelection = false;
}


/**
* This method is for initialize table colums in EclTableColumnManager
*/
initializeTableColumns(): EclColumn[] {
  let manager = new EclTableColumnManager();

  manager.addTextColumn('instanceName', 'Execution Name', null, true, EclColumn.TEXT, true);
  manager.addTextColumn('createdBy', 'Created By', null, true, EclColumn.TEXT, true);
  manager.addDateColumn('creationDt', 'Date', null, true, true, 'date', 'MM/dd/yyyy');
  manager.addTextColumn('processStatusDesc', 'Status', null, true, EclColumn.TEXT, true);
  manager.addIconColumn('excelReport', 'Actions', '5%', 'fa fa-th');

  return manager.getColumns();
}


  /**
  * Gets the file from the service.
  * @param file that we want to download.
  */
  downloadFile() {
    this.fileManagerService.downloadSameSimTemplateFile().subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, Constants.SAME_SIM_CPT_TEMPLATE);
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'File downloaded');
    });
  }

}