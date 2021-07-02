import { Component, OnInit, ViewChild } from '@angular/core';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';

@Component({
  selector: 'app-materialized-view-log',
  templateUrl: './materialized-view-log.component.html'
})
export class MaterializedViewLogComponent implements OnInit {

  @ViewChild('mViewLogTableConfig',{static: true}) mViewLogTableConfig: EclTableComponent;
  mViewLogTable : EclTableModel ;

  cnstructor() { }

  ngOnInit() {
    this.initializeTableConfig();
  }

  /**
   * This Method is for config the ecl-table for payer catalog data. 
   * @param ellSearchDto 
   */
  private initializeTableConfig(){   
        
    let eclTableParameters = this.getTableParameters();
    let uri = `${RoutingConstants.ELL_MVIEW_LOG}/`;        
  
    this.mViewLogTable = new EclTableModel();    
    this.mViewLogTable.filterGlobal = true;
    this.mViewLogTable.export = true;
    this.mViewLogTable.lazy = true;
    this.mViewLogTable.url = uri;
    this.mViewLogTable.columns = eclTableParameters.getColumns();
    this.mViewLogTable.excelFileName = "Materialized View Log";  
    this.mViewLogTable.scrollable = true;
    this.mViewLogTable.verticalScrollable = false;
    this.mViewLogTable.horizontalScrollable = false;
  } 
  
  /**
   * This methos is for config the columns in table for Payer catalog.
   */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();    
    manager.addTextColumn('mViewLogId',     'ID',       null, true, EclColumn.TEXT, true,0,alignment);
    manager.addTextColumn('mViewName',      'View Name',     null, true, EclColumn.TEXT, true,0,alignment);
    manager.addTextColumn('refreshStatus',  'Refresh Status', null, true, EclColumn.TEXT, true,0,alignment);
    manager.addTextColumn('errorMsg',       'Error Message',  null, true, EclColumn.TEXT, true,0,alignment); 
    manager.addDateColumn('creationDt',     'Created On',null, true, true,  EclColumn.DATE, 'MM/dd/yyyy HH:mm:ss.S');
    manager.addDateColumn('updatedOn',      'Updated On',null, true, true,  EclColumn.DATE, 'MM/dd/yyyy HH:mm:ss.S');
    return manager;
  }  

}
