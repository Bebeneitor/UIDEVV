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
  selector: 'app-cpt-code',
  templateUrl: './cpt-code.component.html',
  styleUrls: ['./cpt-code.component.css']
})
export class CptCodeComponent implements OnInit {
  @ViewChild('cptTableView') cptTableView: EclTableComponent;

  cptTable : EclTableModel ;
  constructor(private dialogService: DialogService) { }

  ngOnInit() {
    this.initializeTableConfig();
  }

  /**
   * This Method is for config the ecl-table for CPT Codes data. 
   * @param ellSearchDto 
   */
  private initializeTableConfig(ellSearchDto?  : EllSearchDto){   
        
    let eclTableParameters = this.getTableParameters();
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_CPT_CODE}/`;        
    
    if (ellSearchDto) {
      if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
        uri = `${uri}?keyword-search=${encodeURIComponent(ellSearchDto.keyword)}`;
      }
    }
    
    this.cptTable = new EclTableModel();    
    this.cptTable.filterGlobal = false;
    this.cptTable.export = true;
    this.cptTable.lazy = true;
    this.cptTable.url = uri;
    this.cptTable.columns = eclTableParameters.getColumns();
    this.cptTable.excelFileName = "CPT Codes";
  
  }  

  /**
   * This methos is for config the columns in table for CPT Codes.
   */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('cptCodeValue',     'CPT',                null, false, EclColumn.TEXT, false,alignment);
    manager.addTextColumn('cptCodeShortDesc', 'Short Description',  null, false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('cptCodeMedDesc',   'Medium Description', null, false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('cptCodeDesc',      'Long Description',   null, false, EclColumn.TEXT, false,0,alignment);
    return manager;
  }  

  showResultSearch(ellSearchDto  : EllSearchDto){     
    this.initializeTableConfig(ellSearchDto);  
    setTimeout(()=>{
      this.cptTableView.refreshTable();    
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
        header : `CPT Codes Detail`,
        tableDetailDto: this.getDataForDetail(rowData),
        pdfFileName : "CPT Codes"        
      }      
      ,
      header: 'CPT Codes',
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
    { title: 'CPT',               value: rowData['cptCodeValue']},
    { title: 'Short Description', value: rowData['cptCodeShortDesc'],  },
    { title: 'Medium Description', value: rowData['cptCodeMedDesc'],      },
    { title: 'Long Description', value: rowData['cptCodeDesc'],      }
  ];
  return tableDetailDto;
} 

}
