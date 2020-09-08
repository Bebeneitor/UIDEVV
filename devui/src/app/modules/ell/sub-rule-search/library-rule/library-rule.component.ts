import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DialogService, } from "primeng/api";
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EllMidRuleService } from 'src/app/services/ell-mid-rule.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { RuleDetailDecisionPointComponent } from '../../rule-detail-decision-point/rule-detail-decision-point.component'
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { Constants } from 'src/app/shared/models/constants';

@Component({
  selector: 'app-library-rule',
  templateUrl: './library-rule.component.html',
  styleUrls: ['./library-rule.component.css']
})
export class LibraryRuleComponent implements OnInit {

  @ViewChild('eclTable') eclTable: EclTableComponent;

  tableConfig: EclTableModel;
  enabledEclTable: boolean;

  constructor(private ellMidRuleService: EllMidRuleService, private dialogService : DialogService,
    private eclConstantsService : ECLConstantsService) { }

  ngOnInit() {
    this.enabledEclTable = false;
    this.ellMidRuleService.loadReleaseLogKey().then((response: BaseResponse) => {
      let releaseLogKey = response.data;
      this.initializeTableConfig(releaseLogKey);
    });
  }

  /**
   * This method is for show the result search
   * @param ellSearchDto
   */
  showResultSearch(ellSearchDto  : EllSearchDto){
    this.enabledEclTable = false;
    this.ellMidRuleService.loadReleaseLogKey().then((response: BaseResponse) => {
      let releaseLogKey = response.data;
      this.initializeTableConfig(releaseLogKey, ellSearchDto);
    });
  }

  /**
  * This method is to initialize table config.
  * 
  * @param releaseLogKey - Last release log key.
  * @param ellSearchDto  - Ell search dto.
  */
  private initializeTableConfig(releaseLogKey: number, ellSearchDto?: EllSearchDto) {
    let eclTableParameters = this.getTableParameters();
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_LIBRARY}/${releaseLogKey}/${RoutingConstants.MID_RULES_URL}`;
    if (ellSearchDto) {
      if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
        uri = `${uri}?keyword-search=${encodeURIComponent(ellSearchDto.keyword)}`;
      }
    }
    this.tableConfig = new EclTableModel();
    this.tableConfig.filterGlobal = false;
    this.tableConfig.export = false;
    this.tableConfig.lazy = true;
    this.tableConfig.url = uri;
    this.tableConfig.columns = eclTableParameters.getColumns();
    this.tableConfig.excelFileName = "Library Rules";
    this.tableConfig.scrollable = true;
    this.tableConfig.horizontalScrollable = true;
    this.tableConfig.verticalScrollable = false;
    this.tableConfig.scrollHeight = '750px';  
    this.enabledEclTable = true;
  }

  
  /**
  * This method is to get the table parameters be means of the selected type.
  */
 //Description, Rationale, Script, and Notes columns should duplicate width.
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('midRuleKey', 'Mid Rule',                              '90px', false, EclColumn.TEXT, false, alignment);
    manager.addTextColumn('ruleVersion', 'Version',                              '90px', false, EclColumn.TEXT, false, 30, alignment);
    manager.addTextColumn('subRuleKey', 'Sub Rule',                              '90px', false, EclColumn.TEXT, false,  30, alignment);
    manager.addTextColumn('ellSubRuleDto.subRuleDescUnresolved', 'Description',  '400px', false, EclColumn.TEXT, false, 500, alignment);
    manager.addTextColumn('ellSubRuleDto.subRuleRationale', 'Rationale',         '400px', false, EclColumn.TEXT, false, 500, alignment);
    manager.addTextColumn('ellSubRuleDto.subRuleScript', 'Script',               '400px', false, EclColumn.TEXT, false, 500, alignment);
    manager.addTextColumn('ellPolicyDto.policyTypeDesc', 'Policy',               '160px', false, EclColumn.TEXT, false, 100, alignment);
    manager.addTextColumn('ellPolicyDto.medPolTitle', 'Med Policy',              '230px', false, EclColumn.TEXT, false, 200, alignment);
    manager.addTextColumn('ellSubRuleDto.subRuleNotes', 'Notes',                 '400px', false, EclColumn.TEXT, false, 500, alignment);
    manager.addTextColumn('ellSubRuleDto.citRemarks', 'CIT Remarks',             '90px', false, EclColumn.TEXT, false, 30, alignment);
    manager.addTextColumn('reasonCode', 'Reason Codes',                          '90px', false, EclColumn.TEXT, false, 30, alignment);
    manager.addDateColumn('ellSubRuleDto.dateAdded', 'Date Added',               '90px', false, false);
    return manager;
  }

  /**
  * This method is used to show Rule detail modal.
  *
  * @param $event.
  */
  viewRuleDetailModal(rowData: any) {
    const ref = this.dialogService.open(RuleDetailDecisionPointComponent, {
      data: {
        type: this.eclConstantsService.LONG_VERSION,
        releaseLogKey: rowData.releaseLogKey,
        midRuleKey: rowData.midRuleKey
      },
      header: 'Mid Rule Details',
      width:  '80%',
      height: '92%',
      contentStyle: {
        'max-height'    : '92%',
        'min-height'    : '92%',
        'overflow'      : 'auto',
        'padding-top'   : '20px',
        'padding-bottom': '20px',
        'border'        : 'none'
      }
    });
  } 

}
