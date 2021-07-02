import { Component, OnInit, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { Router } from '@angular/router';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';

const GOOD_IDEA_TYPE = "GOODIDEA";

@Component({
  selector: 'app-good-ideas',
  templateUrl: './good-ideas.component.html',
  styleUrls: ['./good-ideas.component.css']
})
export class GoodIdeasComponent implements OnInit {
  
  @ViewChild('goodIdeasTable',{static: true}) goodIdeasTable: EclTableComponent;
  enabledEclTable: boolean;
  tableConfig: EclTableModel;

  constructor(private util: AppUtils, private router: Router) {
  }

  ngOnInit() {
    this.enabledEclTable = false;
    this.initializeTableConfig();
  }

  /**
   * This method is to initialize table config.
   * 
   */
  private initializeTableConfig() {
    let eclTableParameters = this.getTableParameters();
    let uri = `${RoutingConstants.GOOD_IDEA_URL}/${RoutingConstants.NOT_REVIEWED_GOOD_IDEA_URL}`;
    this.tableConfig = new EclTableModel();
    this.tableConfig.lazy = true;
    this.tableConfig.url = uri;
    this.tableConfig.columns = eclTableParameters.getColumns();
    this.tableConfig.excelFileName = "Good Ideas";
    this.enabledEclTable = true;
  }

  /**
   * This method is to get the table parameters.
   */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('ruleCode'       ,'Provisional Rule ID'          ,'15%', true, EclColumn.TEXT, true,    alignment);
    manager.addTextColumn('ruleName'       ,'Provisional Rule Name'        ,'20%', true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('ruleDescription','Provisional Rule Description' ,'20%', true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('categoryDesc'   ,'Category'                     ,'20%', true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('goodIdeaAuthor' ,'Good Idea Author'             ,'15%', true, EclColumn.TEXT, true, 0, alignment);
    manager.addDateColumn('creationDate'   ,'Date'                         ,'10%', true, true, 'date', Constants.DATE_FORMAT_IN_ECL_TABLE);
    return manager;
  }

  /**
   * Redirect to new idea research and uncheck from good ideas.
   * @param row
   */
  redirect(row : any) {
    this.router.navigate(['item-detail', this.util.encodeString(row.ruleId), GOOD_IDEA_TYPE, 'r']);
  }

  /**
   * Refresh ecl-table. 
   */
  refreshEclTable() {
    if (this.goodIdeasTable) {
      this.goodIdeasTable.resetDataTable();
      this.goodIdeasTable.refreshTable();
      this.goodIdeasTable.selectedRecords = [];
      this.goodIdeasTable.savedSelRecords = [];
    }
  }

}
