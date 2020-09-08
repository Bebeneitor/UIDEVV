import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { ActivatedRoute } from '@angular/router';
import { AppUtils } from 'src/app/shared/services/utils';

@Component({
  selector: 'app-lunch-box',
  templateUrl: './lunch-box.component.html',
  styleUrls: ['./lunch-box.component.css']
})
export class LunchBoxComponent implements OnInit {
  codesTablesConfig;
  public config;
  constructor(private activatedRoute: ActivatedRoute, private appUtils: AppUtils) { }

  /**
   * When the component initialize we crate the tables configuration object.
   */
  ngOnInit() {
    // Get the ruleId and instanceId from url.
    const ruleId = this.appUtils.decodeString(this.activatedRoute.snapshot.queryParams.ruleId);
    const instanceId = this.appUtils.decodeString(this.activatedRoute.snapshot.queryParams.instanceId);

    const tableModels = [];
    let manager = new EclTableColumnManager();
    let tableConfig = new EclTableModel();
    let url = `${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_CODES_BY_RULE}/${ruleId}?sameSimInstanceId=${instanceId}&type=`;

    manager.addTextColumn('code', 'HCPCS Code', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('longDescription', 'Long Description', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('shortDescription', 'Short Description', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('effectiveDate', 'Effective Date', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('sameCode', 'Same Code', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('sameCodeDescription', 'Same Code Description', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('similarCode', 'Similar Code', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('similarCodeDescription', 'Similar Code Description', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('mdComments', 'Peer Reviewer Comments', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('url1', 'URL 1', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('url2', 'URL 2', '10%', true, EclColumn.TEXT, false, 100);

    tableConfig.columns = manager.getColumns();
    tableConfig.paginationSize = 5;
    tableConfig.excelFileName = 'New Codes';
    tableConfig.url = `${url}SSIM_TYPE_NEW`;
    tableConfig.lazy = true;

    tableModels.push({
      model: tableConfig,
      tabHeader: 'New',
      selected: true
    });


    tableConfig = new EclTableModel();
    manager = new EclTableColumnManager();
    manager.addTextColumn('code', 'HCPCS Code', null, true, EclColumn.TEXT, false, 150);
    manager.addTextColumn('longDescription', 'Long Description', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('terminationDate', 'Termination Date', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('replacementCode', 'Replacement Code', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('replacementCodeDescription', 'Replacement Code Description', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('mdComments', 'Peer Reviewer Comments', '10%', true, EclColumn.TEXT, false, 100);

    tableConfig.columns = manager.getColumns();
    tableConfig.paginationSize = 5;
    tableConfig.excelFileName = 'Deleted Codes';
    tableConfig.url = `${url}SSIM_TYPE_DELETED`;
    tableConfig.lazy = true;

    tableModels.push({
      model: tableConfig,
      tabHeader: 'Deleted',
      selected: false
    });


    tableConfig = new EclTableModel();
    manager = new EclTableColumnManager();
    manager.addTextColumn('code', 'HCPCS Code', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('previousLongDescription', 'Previous Long Description', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('revisedLongDescription', 'Revised Long Description', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('coverage', 'HCPCS Coverage', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('statusCode', 'MPFS Status Code', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('mdComments', 'Peer Reviewer Comments', '10%', true, EclColumn.TEXT, false, 100);

    tableConfig.columns = manager.getColumns();
    tableConfig.paginationSize = 5;
    tableConfig.excelFileName = 'Revised Codes';
    tableConfig.url = `${url}SSIM_TYPE_REVISED`;
    tableConfig.lazy = true;

    tableModels.push({
      model: tableConfig,
      tabHeader: 'Revised',
      selected: false
    });


    tableConfig = new EclTableModel();
    manager = new EclTableColumnManager();
    manager.addTextColumn('code', 'HCPCS Code', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('deleted', 'Deleted', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('newEffectiveDate', 'New Effective Date', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('oldDescription', 'Old Description', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('newDescription', 'New Description', '10%', true, EclColumn.TEXT, false, 100);
    manager.addTextColumn('currentMaxUnits', 'Current Max Units', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('newMaxUnits', 'New Max Units', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('mdComments', 'Peer Reviewer Comments', '10%', true, EclColumn.TEXT, false, 100);

    tableConfig.columns = manager.getColumns();
    tableConfig.paginationSize = 5;
    tableConfig.excelFileName = 'Reinstated Codes';
    tableConfig.url = `${url}SSIM_TYPE_REINSTATED`;
    tableConfig.lazy = true;

    tableModels.push({
      model: tableConfig,
      tabHeader: 'Reinstated',
      selected: false
    });


    tableConfig = new EclTableModel();
    manager = new EclTableColumnManager();
    manager.addTextColumn('code', 'HCPCS Code', null, true, EclColumn.TEXT, false);
    manager.addTextColumn('description', 'Description', '40%', true, EclColumn.TEXT, false, 400);
    manager.addTextColumn('mdComments', 'Peer Reviewer Comments', '40%', true, EclColumn.TEXT, false, 400);

    tableConfig.columns = manager.getColumns();
    tableConfig.paginationSize = 5;
    tableConfig.excelFileName = 'Resequenced Codes';
    tableConfig.url = `${url}SSIM_TYPE_RESEQUENCED`;
    tableConfig.lazy = true;

    tableModels.push({
      model: tableConfig,
      tabHeader: 'Resequenced',
      selected: false
    });


    this.codesTablesConfig = tableModels;

  }
}
