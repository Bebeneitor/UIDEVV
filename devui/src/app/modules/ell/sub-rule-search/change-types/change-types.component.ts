import { TableDetailDto } from './../../../../shared/models/dto/table-detail-dto';
import { Component, OnInit } from '@angular/core';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { DialogService, } from "primeng/api";
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';
import { SubRuleDetailComponent } from '../sub-rule-detail/sub-rule-detail.component';

@Component({
  selector: 'app-change-types',
  templateUrl: './change-types.component.html',
  styleUrls: ['./change-types.component.css']
})
export class ChangeTypesComponent implements OnInit {

  tableConfig: EclTableModel;
  enabledEclTable: boolean;

  constructor( private dialogService: DialogService) { }

  ngOnInit() {
    this.enabledEclTable = false;
    this.initializeTableConfig();
  }

  /**
  * This method is to initialize table config.
  * 
  * @param ellSearchDto  - Ell search dto.
  */
  private initializeTableConfig(ellSearchDto?: EllSearchDto) {
    let eclTableParameters = this.getTableParameters();    
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_CHANGE_RESOURCE}/${RoutingConstants.ELL_CHANGE_TYPES}`;
    if (ellSearchDto) {
      if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
        uri = `${uri}?keyword-search=${encodeURIComponent(ellSearchDto.keyword)}`;
      }
    }
    this.tableConfig = new EclTableModel();
    this.tableConfig.filterGlobal = false;
    this.tableConfig.export = true;
    this.tableConfig.lazy = true;
    this.tableConfig.url = uri;
    this.tableConfig.columns = eclTableParameters.getColumns();
    this.tableConfig.excelFileName = "Change Types";
    this.enabledEclTable = true;
    this.tableConfig.scrollable=true;
    this.tableConfig.verticalScrollable = false;
    this.tableConfig.horizontalScrollable=true;
    this.tableConfig.scrollHeight="350px";
    this.tableConfig.sortOrder = 1;
  }

  /**
  * This method is to get the table parameters be means of the selected type.
  */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    
    manager.addLinkColumn('changeTypeKey',      'Key',                    null, false, EclColumn.TEXT, false, alignment);
    manager.addLinkColumn('changeTypeDesc',     'Description',            null, false, EclColumn.TEXT, false, alignment);
    manager.addTextColumn('changeScope',        'Scope',                  null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqSubRule10',       'SR',                     null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqPayer10',         'Payer',                  null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('editorialOnly10',    'Editorial',              null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('hidden10',           'Hidden',                 null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('retired10',          'Retired',                null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqTesting10',       'Testing',                null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('lockdownAccessKey',  'Lockdown key',           null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqBwGroup10',       'REQ_BW_GROUP_10',        null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqBwPairsDevs10',   'REQ_BW_PAIRS_DEVS_10',   null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqCciDeviations10', 'REQ_CCI_DEVIATIONS_10',  null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqModConfig10',     'REQ_MOD_CONFIG_10',      null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqModRank10',       'REQ_MOD_RANK_10',        null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqMuv10',           'REQ_MUV_10',             null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqBoGroup10',       'REQ_BO_GROUP_10',        null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqBoPairsDevs10',   'REQ_BO_PAIRS_DEVS_10',   null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqCci10',           'REQ_CCI_10',             null, false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('reqRevHcpcs10',      'REQ_REV_HCPCS_10',       null, false, EclColumn.TEXT, false, 0, alignment);   
    manager.addTextColumn('reqPolicySet10',     'REQ_POLICY_SET_10',      null, false, EclColumn.TEXT, false, 0, alignment);    
    return manager;
  }

  /**
   * This method is for show the result search
   * @param ellSearchDto
   */
  showResultSearch(ellSearchDto  : EllSearchDto){
    this.enabledEclTable = false;
    setTimeout(()=>{
      this.initializeTableConfig(ellSearchDto);     
    }, 100);
  }  

  /**
  * This method is used to show Rule detail modal.
  *
  * @param $event.
  */
  viewRuleDetailModal(rowData: any) {

    const ref = this.dialogService.open(SubRuleDetailComponent, {

      data: {
        header : `Change Type Key: ${rowData.changeTypeKey}`,
        tableDetailDto: this.getDataForDetail(rowData), 
        pdfFileName : `Change Types Detail`,
      }
      ,
      header: 'Change Types',
      width: '80%',
      height: '92%',
      contentStyle: {
        'max-height': '92%',
        'min-height': '92%',
        'overflow': 'auto',
        'padding-top': '20px',
        'padding-bottom': '40px',
        'border': 'none'
      }

    });

  }

  /**
  * This method is used to get data for detail screen.
  */
  private getDataForDetail(rowData: any){
    let tableDetailDto : TableDetailDto[] =  [
      { title: 'Change Type Key',      value: rowData['changeTypeKey'],      },
      { title: 'Description',          value: rowData['changeTypeDesc'],     },
      { title: 'Change Scope',         value: rowData['changeScope'],        },
      { title: 'Requires Sub Rule 10', value: rowData['reqSubRule10'],       },
      { title: 'Requires Payer 10',    value: rowData['reqPayer10'],         },
      { title: 'REQ_MUV_10',           value: rowData['reqMuv10'],           },
      { title: 'REQ_MOD_CONFIG_10',    value: rowData['reqModConfig10'],     },
      { title: 'REQ_MOD_RANK_10',      value: rowData['reqModRank10'],       },
      { title: 'REQ_CCI_DEVIATIONS_10',value: rowData['reqCciDeviations10'], },
      { title: 'REQ_BW_GROUP_10',      value: rowData['reqBwGroup10'],       },
      { title: 'REQ_BW_PAIRS_DEVS_10', value: rowData['reqBwPairsDevs10'],   },
      { title: 'REQ_BO_GROUP_10',      value: rowData['reqBoGroup10'],       },
      { title: 'REQ_BO_PAIRS_DEVS_10', value: rowData['reqBoPairsDevs10'],   },
      { title: 'REQ_CCI_10',           value: rowData['reqCci10'],           },
      { title: 'REQ_POLICY_SET_10',    value: rowData['reqPolicySet10'],     },
      { title: 'REQ_REV_HCPCS_10',     value: rowData['reqRevHcpcs10'],      },
      { title: 'Editorial Only 10',    value: rowData['editorialOnly10'],    },
      { title: 'Hidden 10',            value: rowData['hidden10'],           },
      { title: 'Retired 10',           value: rowData['retired10'],          },
      { title: 'Requires Testing',     value: rowData['reqTesting10'],       },
      { title: 'Lockdown Access Key',  value: rowData['lockdownAccessKey'],  }
    ];
    return tableDetailDto;
  } 

}