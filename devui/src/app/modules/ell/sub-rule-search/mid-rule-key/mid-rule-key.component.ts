import { Component, OnInit } from '@angular/core';
import { DialogService, } from "primeng/api";
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { EllMidRuleKeyService } from 'src/app/services/ell-mid-rule-key.service';
import { RuleDetailDecisionPointComponent } from '../../rule-detail-decision-point/rule-detail-decision-point.component'
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { Constants } from 'src/app/shared/models/constants';

@Component({
  selector: 'app-mid-rule-key',
  templateUrl: './mid-rule-key.component.html',
  styleUrls: ['./mid-rule-key.component.css']
})
export class MidRuleKeyComponent implements OnInit {

  tableConfig: EclTableModel;
  enabledEclTable: boolean;

  constructor(private ellMidRuleKeyService : EllMidRuleKeyService, private dialogService: DialogService, 
    private eclConstantsService: ECLConstantsService) { }

  ngOnInit() {
    this.enabledEclTable = false;
    this.ellMidRuleKeyService.loadReleaseLogKey().then((response: BaseResponse) => {
      let releaseLogKey = response.data;
      this.initializeTableConfig(releaseLogKey);
    });
  }

  /**
   * This method is for showing the result search.
   * @param ellSearchDto - Ell search dto.
   */
  showResultSearch(ellSearchDto: EllSearchDto){
    this.enabledEclTable = false;
    this.ellMidRuleKeyService.loadReleaseLogKey().then((response: BaseResponse) => {
      let releaseLogKey = response.data;
      this.initializeTableConfig(releaseLogKey, ellSearchDto);
    });
  }

  /**
  * This method is used to show Rule detail modal.
  *
  * @param $event.
  */
  viewRuleDetailModal(rowData: any){
    const ref = this.dialogService.open(RuleDetailDecisionPointComponent, {
      data: {
        type: this.eclConstantsService.SMALL_VERSION,
        releaseLogKey: rowData.releaseLogKey,
        midRuleKey: rowData.key
      },
      header: 'Mid Rule Detail',
      width: '80%',
      height: '92%',
      contentStyle: {
        'max-height': '92%',
        'min-height': '92%',
        'overflow': 'auto',
        'padding-top': '20px',
        'padding-bottom': '20px',
        'border': 'none' }
    });
  }


  /**
  * This method is used to initialize table config.
  *
  * @param releaseLogKey - Last release log key.
  * @param ellSearchDto  - Ell search dto.
  */
  private initializeTableConfig(releaseLogKey: number, ellSearchDto?: EllSearchDto) {
    let eclTableParameters = this.getTableParameters();
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_MID_RULES}/${releaseLogKey}`;
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
    this.tableConfig.excelFileName = "Mid Rule Key";
    this.enabledEclTable = true;
  }

  /**
  * This method is used to get the table parameters be means of the selected type.
  */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('key', 'Key'                  , '30%', false, EclColumn.TEXT, false, alignment);
    manager.addTextColumn('decisionKey', 'Decision Key' , '70%', false, EclColumn.TEXT, false, 0, alignment);
    return manager;
  }

}
