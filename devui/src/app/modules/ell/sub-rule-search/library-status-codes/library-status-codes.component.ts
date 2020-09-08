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
  selector: 'app-library-status-codes',
  templateUrl: './library-status-codes.component.html',
  styleUrls: ['./library-status-codes.component.css']
})
export class LibraryStatusCodesComponent implements OnInit {

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
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_LIBRARY}/${RoutingConstants.ELL_STATUS_CODES}`;
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
    this.tableConfig.excelFileName = "Library Status Codes";
    this.enabledEclTable = true;
  }

  /**
  * This method is to get the table parameters.
  */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('libraryStatusKey',        'Key',                '20%', false, EclColumn.TEXT, false,    alignment);
    manager.addTextColumn('libraryStatusDesc',       'Description',        '40%', false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('libraryDialogListValues', 'Dialog List Values', '40%', false, EclColumn.TEXT, false, 0, alignment);
    return manager;
  }

  /**
   * This method is for show the detail.
   * @param rowData from ecl table.
   */
  viewSubRuleDetailDialog(rowData: any) {
    const dialog = this.dialogService.open(SubRuleDetailComponent, {
      data: {
        header: `Library Status Codes Detail`,
        tableDetailDto: this.getDataForShowingDetail(rowData),
        pdfFileName: `Library Status Codes Detail`,
      }
      ,
      header: 'Library Status Codes',
      width: '60%',
      contentStyle: {
        'padding-top': '20px',
        'padding-bottom': '40px',
        'border': 'none'
      }
    });
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
      { title: 'Key',                value: rowData['libraryStatusKey'], },
      { title: 'Description',        value: rowData['libraryStatusDesc'], },
      { title: 'Dialog List Values', value: rowData['libraryDialogListValues'], }
    ];
    return tableDetailDto;
  }
  

}
