import { Component, OnInit, ViewChild } from '@angular/core';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { DialogService, } from "primeng/api";
import { SubRuleDetailComponent } from '../sub-rule-detail/sub-rule-detail.component';
import { TableDetailDto } from 'src/app/shared/models/dto/table-detail-dto';

@Component({
  selector: 'app-payer-catalog',
  templateUrl: './payer-catalog.component.html',
  styleUrls: ['./payer-catalog.component.css']
})
export class PayerCatalogComponent implements OnInit {

  @ViewChild('payerTableConf',{static: true}) payerTableConf: EclTableComponent;
  payerTable : EclTableModel ;

  constructor(private dialogService: DialogService) { }

  ngOnInit() {
    this.initializeTableConfig();
  }

  /**
   * This Method is for config the ecl-table for payer catalog data. 
   * @param ellSearchDto 
   */
  private initializeTableConfig(ellSearchDto?  : EllSearchDto){   
        
    let eclTableParameters = this.getTableParameters();
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_PAYER}/${RoutingConstants.ELL_PAYER_CATALOG}/`;        
    
    if (ellSearchDto) {
      if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
        uri = `${uri}?keyword-search=${encodeURIComponent(ellSearchDto.keyword)}`;
      }
    }
    
    this.payerTable = new EclTableModel();    
    this.payerTable.filterGlobal = false;
    this.payerTable.export = true;
    this.payerTable.lazy = true;
    this.payerTable.url = uri;
    this.payerTable.columns = eclTableParameters.getColumns();
    this.payerTable.excelFileName = "Payers";  
    this.payerTable.scrollable = true;
    this.payerTable.verticalScrollable = false;
  } 

  /**
   * This methos is for config the columns in table for Payer catalog.
   */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('payerShort',  'Payer Short', null, false, EclColumn.TEXT, false,alignment);
    manager.addTextColumn('payerKey',    'Payer Key',   null, false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('payerName',   'Payer Name',  null, false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('claimType',   'Claim Types', null, false, EclColumn.TEXT, false,0,alignment);
    return manager;
  } 

    /**
   * This method is for show the result search.
   * @param ellSearchDto.
   */
  showResultSearch(ellSearchDto: EllSearchDto) {
       
    this.initializeTableConfig(ellSearchDto);  
    setTimeout(()=>{
      this.payerTableConf.refreshTable();    
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
      header : `Payer Detail`,
      tableDetailDto: this.getDataForDetail(rowData),
      pdfFileName : "Payer",
      visibleCloseButton : false        
    }      
    ,
    header: 'Payer',
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
    { title: 'Payer Short', value: rowData['payerShort']},
    { title: 'Payer Key',   value: rowData['payerKey']},
    { title: 'Payer Name',  value: rowData['payerName']},
    { title: 'Claim Types', value: rowData['claimType']}
  ];
  return tableDetailDto;
}   

}
