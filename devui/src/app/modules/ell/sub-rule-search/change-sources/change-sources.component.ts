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
  selector: 'app-change-sources',
  templateUrl: './change-sources.component.html',
  styleUrls: ['./change-sources.component.css']
})
export class ChangeSourcesComponent implements OnInit {

  tableConfig: EclTableModel;
  enabledEclTable: boolean;

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
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_CHANGE_RESOURCE}/${RoutingConstants.ELL_CHANGE_SOURCES}`;
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
    this.tableConfig.excelFileName = "Change Sources";
    this.enabledEclTable = true;
  }

  /**
  * This method is to get the table parameters.
  */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('changeSourceKey',  'Key',         '20%', false, EclColumn.TEXT, false, alignment);
    manager.addTextColumn('changeSourceDesc', 'Description', '60%', false, EclColumn.TEXT, false, 0, alignment);
    manager.addTextColumn('hidden10',         'Hidden',      '20%', false, EclColumn.TEXT, false, 0, alignment);
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

  viewSubRuleDetailModal(rowData: any) {
    const ref = this.dialogService.open(SubRuleDetailComponent, {
      data: {
        header : `Change Source Detail`,
        tableDetailDto: this.getDataForDetail(rowData), 
        pdfFileName : `Change Source Detail`,
      }
      ,
      header: 'Change Source',
      width: '60%',
      contentStyle: {
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
      { title: 'Change Source Key',  value: rowData['changeSourceKey'], },
      { title: 'Description',        value: rowData['changeSourceDesc'], },
      { title: 'Hidden 10',          value: rowData['hidden10'],  }
    ];
    return tableDetailDto;
  } 

}
