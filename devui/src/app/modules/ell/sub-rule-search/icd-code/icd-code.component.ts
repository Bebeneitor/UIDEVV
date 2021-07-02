import { Component, OnInit, ViewChild } from '@angular/core';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { DialogService, } from "primeng/api";
import { SubRuleDetailComponent } from '../sub-rule-detail/sub-rule-detail.component';
import { TableDetailDto } from 'src/app/shared/models/dto/table-detail-dto';

@Component({
  selector: 'app-icd-code',
  templateUrl: './icd-code.component.html',
  styleUrls: ['./icd-code.component.css']
})
export class IcdCodeComponent implements OnInit {
  
  @ViewChild('icdTableView',{static: true}) icdTableView: EclTableComponent;
  icdTable : EclTableModel ;

  constructor(private dialogService: DialogService) { }

  ngOnInit() {
    this.initializeTableConfig();
  }

  /**
   * This Method is for config the ecl-table for ICD Codes data. 
   * @param ellSearchDto 
   */
  private initializeTableConfig(ellSearchDto?  : EllSearchDto){   
        
    let eclTableParameters = this.getTableParameters();
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_ICD_CODE}/`;        
    
    if (ellSearchDto) {
      if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
        uri = `${uri}?keyword-search=${encodeURIComponent(ellSearchDto.keyword)}`;
      }
    }
    
    this.icdTable = new EclTableModel();    
    this.icdTable.filterGlobal = false;
    this.icdTable.export = true;
    this.icdTable.lazy = true;
    this.icdTable.url = uri;
    this.icdTable.columns = eclTableParameters.getColumns();
    this.icdTable.excelFileName = "ICD Codes";  
  } 
  
  /**
   * This methos is for config the columns in table for ICD Codes.
   */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('icdCodeDetail',  'ICD Code',                null, false, EclColumn.TEXT, false,alignment);
    manager.addTextColumn('icdDesc',      'ICD Description',  null, false, EclColumn.TEXT, false,0,alignment);
    return manager;
  } 

  showResultSearch(ellSearchDto  : EllSearchDto){     
    this.initializeTableConfig(ellSearchDto);  
    setTimeout(()=>{
      this.icdTableView.refreshTable();    
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
      header : `ICD Codes Detail`,
      tableDetailDto: this.getDataForDetail(rowData),
      pdfFileName : "ICD Codes",
      visibleCloseButton : false        
    }      
    ,
    header: 'ICD Codes',
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
    { title: 'ICD Code',               value: rowData['icdCodeDetail']},
    { title: 'ICD Description', value: rowData['icdDesc'],  }
  ];
  return tableDetailDto;
} 

}
