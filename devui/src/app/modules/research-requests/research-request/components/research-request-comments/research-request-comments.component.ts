import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { Constants } from 'src/app/shared/models/constants';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { environment } from "src/environments/environment";
import { AppUtils } from 'src/app/shared/services/utils';

import { ResearchRequestCommentsDialogComponent } from '../research-request-comments-dialog/research-request-comments-dialog.component';
@Component({
  selector: 'app-research-request-comments',
  templateUrl: './research-request-comments.component.html',
  styleUrls: ['./research-request-comments.component.css']
})
export class ResearchRequestCommentsComponent implements OnInit {
  @Input("rrId") rrIdInput: number;
  @ViewChild('checkTable',{static: true}) checkTable: EclTableComponent;
  checkTabModel: EclTableModel;
  userId: number;
  constructor(private utils: AppUtils) { }

  ngOnInit() {
    this.userId = this.utils.getLoggedUserId();
    this.checkTabModel = new EclTableModel();
    this.initTableConfig(this.checkTabModel);
    // this.checkTable.loading = false;
  }
  initTableConfig(tableModel: EclTableModel) {
    tableModel.url = `${environment.researchRequestServiceUrl}${RoutingConstants.RESEARCH_REQUEST_URL}${RoutingConstants.RR_GET_COMMENTS}`
    tableModel.lazy = true;
    tableModel.sortOrder = Constants.ECL_TABLE_ASC_ORDER;
    tableModel.export = false;
    tableModel.filterGlobal = false;
    tableModel.isFullURL = true;
    tableModel.criteriaFilters = {rrId: this.rrIdInput};
    tableModel.columns = this.initTableColumns();
  }

  initTableColumns() {
    let manager = new EclTableColumnManager();
    manager.addTextColumn('commentedDate', 'Date and Time', '20%', false, EclColumn.TEXT, false);
    manager.addTextColumn('commentedBy', 'Comment By', '20%', false, EclColumn.TEXT, false);
    manager.addTextColumn('ruleCode', 'Id', '10%', false, EclColumn.TEXT, false);
    manager.addTextColumn('reviewComments', 'Comments', '50%', false, EclColumn.TEXT, false);
    return manager.getColumns();

  }

}
