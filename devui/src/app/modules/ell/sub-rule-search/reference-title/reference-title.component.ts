import { Component, OnInit, ViewChild } from '@angular/core';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { DialogService, } from "primeng/api";
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { TableDetailDto } from 'src/app/shared/models/dto/table-detail-dto';
import { SubRuleDetailComponent } from '../sub-rule-detail/sub-rule-detail.component';

@Component({
  selector: 'app-reference-title',
  templateUrl: './reference-title.component.html'
})
export class ReferenceTitleComponent implements OnInit {

  @ViewChild('refTitleTableView',{static: true}) refTitleTableView: EclTableComponent;
  refTable : EclTableModel ;

  constructor(private dialogService: DialogService) { }

  ngOnInit() {
    this.initializeTableConfig();
  }

  /**
   * This Method is for config the ecl-table for reference title data. 
   * @param ellSearchDto 
   */
  initializeTableConfig(ellSearchDto?  : EllSearchDto) {
    
    let eclTableParameters = this.getTableParameters();
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_REFERENCE_TITLE}/`;        
    
    if (ellSearchDto) {
      if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
        uri = `${uri}?keyword-search=${encodeURIComponent(ellSearchDto.keyword)}`;
      }
    }
    
    this.refTable = new EclTableModel();    
    this.refTable.filterGlobal = false;
    this.refTable.export = true;
    this.refTable.lazy = true;
    this.refTable.url = uri;
    this.refTable.columns = eclTableParameters.getColumns();
    this.refTable.excelFileName = "Reference Titles";    

  }

  /**
   * This methos is for config the columns in table for  reference title data.
   */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('refTitleKey',  'Ref Title Key',  null, false, EclColumn.TEXT, false,alignment);
    manager.addTextColumn('refTitleDesc', 'Description',    null, false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('refSourceKey', 'Ref Source Key', null, false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('refTypeKey',   'Ref Type Key',   null, false, EclColumn.TEXT, false,0,alignment);
    return manager;
  } 

  /**
   * This method is for show the result search.
   * @param ellSearchDto.
   */
  showResultSearch(ellSearchDto: EllSearchDto) {    
    this.initializeTableConfig(ellSearchDto);  
    setTimeout(()=>{
      this.refTitleTableView.refreshTable();    
    }, 1000); 
  }


  /**
  * This method is used to show Rule detail modal.
  *
  * @param $event.
  */
 viewRuleDetailModal(rowData: any) {    

  const ref = this.dialogService.open(SubRuleDetailComponent, {
    
    data: {
      header : `Reference Title Detail`,
      tableDetailDto: this.getDataForDetail(rowData),
      pdfFileName : "Reference Titles Detail",
      visibleCloseButton : false        
    }      
    ,
    header: 'Reference Title',
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
  private getDataForDetail(rowData: any) {
    let tableDetailDto: TableDetailDto[] = [
      { title: 'Ref Title Key', value: rowData['refTitleKey'] },
      { title: 'Description', value: rowData['refTitleDesc'] },
      { title: 'Ref Source Key', value: rowData['refSourceKey'] },
      { title: 'Ref Type Key', value: rowData['refTypeKey'] },
      { title: 'Core Enhanced Key', value: rowData['coreEnhancedKey'] },
      { title: 'Core Enhanced Desc', value: rowData['coreEnhancedDesc'] }
    ];
    return tableDetailDto;
  } 


}
