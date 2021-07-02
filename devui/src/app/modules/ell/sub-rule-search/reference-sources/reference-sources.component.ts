import { Component, OnInit } from '@angular/core';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { DialogService, } from "primeng/api";
import { SubRuleDetailComponent } from '../sub-rule-detail/sub-rule-detail.component';
import { TableDetailDto } from 'src/app/shared/models/dto/table-detail-dto';

@Component({
  selector: 'app-reference-sources',
  templateUrl: './reference-sources.component.html',
  styleUrls: ['./reference-sources.component.css']
})
export class ReferenceSourcesComponent implements OnInit {

  enabledEclTable: boolean;
  tableConfig: EclTableModel;

  constructor(private dialogService: DialogService) { }

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
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_REFERENCE}/${RoutingConstants.ELL_SOURCES}`;
    if (ellSearchDto) {
      if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
        uri = `${uri}?keyword-search=${encodeURIComponent(ellSearchDto.keyword)}`;
      }
    }
    this.tableConfig = new EclTableModel();
    this.tableConfig.filterGlobal = false;
    this.tableConfig.lazy = true;
    this.tableConfig.url = uri;
    this.tableConfig.columns = eclTableParameters.getColumns();
    this.tableConfig.excelFileName = "Reference Sources";
    this.enabledEclTable = true;
  }

  /**
   * This method is to get the table parameters.
   */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('refSourceKey',    'Ref Source Key',    '20%', false, EclColumn.TEXT, false, alignment);
    manager.addTextColumn('refSourceDesc',   'Description',       '60%', false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('coreEnhancedKey', 'Core Enhanced Key', '20%', false, EclColumn.TEXT, false, 0, alignment);
    return manager;
  }

  /**
   * This method is for show the result search.
   * @param ellSearchDto.
   */
  showResultSearch(ellSearchDto: EllSearchDto) {
    this.enabledEclTable = false;
    setTimeout(() => {
      this.initializeTableConfig(ellSearchDto);
    }, 100);
  }

  /**
   * This method is used to get data for detail screen.
   * @param rowData from ecl table.
   */
  private getDataForShowingDetail(rowData: any) {
    let tableDetailDto: TableDetailDto[] = [
      { title: 'Reference Source Key',          value: rowData['refSourceKey'], },
      { title: 'Reference Source Description',  value: rowData['refSourceDesc'], },
      { title: 'Core Enhanced Key',             value: rowData['coreEnhancedKey'], },
    ];
    return tableDetailDto;
  }

  /**
   * This method is for show the detail.
   * @param rowData from ecl table.
   */
  viewSubRuleDetailDialog(rowData: any) {
    this.dialogService.open(SubRuleDetailComponent, {
      data: {
        header: `Reference Sources Detail`,
        tableDetailDto: this.getDataForShowingDetail(rowData),
        pdfFileName: `Reference Sources Detail`,
      },
      header: 'Reference Sources',
      width: '60%',
      contentStyle: {
        'padding-top': '20px',
        'padding-bottom': '40px',
        'border': 'none'
      }
    });
  }

}
