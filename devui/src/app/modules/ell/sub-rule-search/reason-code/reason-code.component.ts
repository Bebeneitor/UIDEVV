import { Component, OnInit, ViewChild } from '@angular/core';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { DialogService, } from "primeng/api";
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';
import { TableDetailDto } from 'src/app/shared/models/dto/table-detail-dto';
import { SubRuleDetailComponent } from '../sub-rule-detail/sub-rule-detail.component';

@Component({
  selector: 'app-reason-code',
  templateUrl: './reason-code.component.html',
  styleUrls: ['./reason-code.component.css']
})
export class ReasonCodeComponent implements OnInit {

  @ViewChild('reasonTableConf',{static: true}) reasonTableConf: EclTableComponent;
  reasonTable : EclTableModel ;

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
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_REASON}/${RoutingConstants.ELL_REASON_CODE}`;        
    
    if (ellSearchDto) {
      if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
        uri = `${uri}?keyword-search=${encodeURIComponent(ellSearchDto.keyword)}`;
      }
    }
    
    this.reasonTable = new EclTableModel();    
    this.reasonTable.filterGlobal = false;
    this.reasonTable.export = true;
    this.reasonTable.lazy = true;
    this.reasonTable.url = uri;
    this.reasonTable.columns = eclTableParameters.getColumns();
    this.reasonTable.excelFileName = "Reason Codes";  
    this.reasonTable.scrollable = true;
    this.reasonTable.verticalScrollable = false;
    this.reasonTable.horizontalScrollable = true;
  }  

  /**
   * This methos is for config the columns in table for Payer catalog.
   */
  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('reasonCodeId',       'Reason Code',      '100px', false, EclColumn.TEXT, false,alignment);
    manager.addTextColumn('reasonDescription',  'Reason Desc',      '250px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('reasonRationale',    'Rationale',        '250px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('hipaaCode',          'HIPAA Code',       '110px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('libraryStatusKey',   'Lib Status Key',   '110px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('icm',                'ICM 10',           '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('icmo',               'ICMO 10',          '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('deactivated',        'Deactivated 10',   '110px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('dialogLkp1',         'Dialog Lookup',    '280px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('dialogLkp2',         'Dialog lookup',    '300px', false, EclColumn.TEXT, false,0,alignment);          
    return manager;
  } 

/**
 * This method is for show the result search.
 * @param ellSearchDto.
 */
  showResultSearch(ellSearchDto: EllSearchDto) {

    this.initializeTableConfig(ellSearchDto);
    setTimeout(() => {
      this.reasonTableConf.refreshTable();
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
        header: `Reason Code`,
        tableDetailDto: this.getDataForDetail(rowData),
        pdfFileName: "Reason Codes Detail",
        visibleCloseButton: false
      }
      ,
      header: 'Reason Code Detail',
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
      { title: 'Reason Code', value: rowData['reasonCodeId'] },
      { title: 'Reason Desc', value: rowData['reasonDescription'] },
      { title: 'Rationale', value: rowData['reasonRationale'] },
      { title: 'HIPAA Code', value: rowData['hipaaCode'] },
      { title: 'Lib Status Key', value: rowData['libraryStatusKey'] },
      { title: 'ICM 10', value: rowData['icm'] },
      { title: 'ICMO 10', value: rowData['icmo'] },
      { title: 'Deactivated 10', value: rowData['deactivated'] },
      { title: 'Dialog Lookup', value: rowData['dialogLkp1'] },
      { title: 'Dialog lookup', value: rowData['dialogLkp2'] }
    ];
    return tableDetailDto;
  }

}
