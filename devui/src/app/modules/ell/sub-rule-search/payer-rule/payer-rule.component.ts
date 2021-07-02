import { RuleDetailDecisionPointComponent } from './../../rule-detail-decision-point/rule-detail-decision-point.component';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { EllPayerService } from 'src/app/services/ell-payer.service';
import { DialogService, } from "primeng/api";
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Accordion } from 'primeng/primeng';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { Constants } from 'src/app/shared/models/constants';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { EclAsyncFileDetails } from 'src/app/shared/components/ecl-table/model/ecl-async-file-details';

@Component({
  selector: 'app-payer-rule',
  templateUrl: './payer-rule.component.html',
  styleUrls: ['./payer-rule.component.css']
})
export class PayerRuleComponent implements OnInit {
  
  ellSearchDto  : EllSearchDto;
  @ViewChild('payerTableView',{static: true}) payerTableView: EclTableComponent;
  @ViewChild('resultTableView',{static: true}) resultTableView: EclTableComponent;
  @ViewChild('accordion',{static: true}) accordion: Accordion;
  
  payers: String[] = [];
  loadPayers:boolean = false;
  loadTableByPayer:boolean = false;  
  blockedDocument:boolean=true; 
  payerTable : EclTableModel = null;
  resultTableFilter : EclTableModel = null;
  payerSelected:String;
  index:number = null;
  lastIndex:number = -1;
  showResultLayer:boolean = false;
  tableName: String = '';

  constructor(private ellPayerService: EllPayerService, private dialogService: DialogService,
    private eclConstantsService: ECLConstantsService) { }

  ngOnInit() {    
    this.blockedDocument = true;
    this.loadPayersLabels();     
  }

  /**
   * When the acordion opens we create the table model.
   * @param accordionIndex accrdion tab index.
   */
  onTabOpen(accordionIndex: number) {
    this.tableName = this.payers[accordionIndex];    
    this.loadTable();
  }

  /**
   * This methos loads all the payers from data base.
   */
  loadPayersLabels(){        

    this.ellPayerService.loadAllPayers().subscribe((response: BaseResponse)=>{    
      this.payers = response.data;

      setTimeout(()=>{
        this.blockedDocument = false;   
        this.loadPayers = true;     
      },1000);
      
    }); 

  }

  loadTable(){  
    this.payerTable = new EclTableModel();
    this.initializeTableConfigForPayer(this.payerTable);
    this.loadTableByPayer=true;
  }

  private initializeTableConfigForPayer(table: EclTableModel){      
    table.url = RoutingConstants.ELL_URL + "/" + RoutingConstants.ELL_PAYER + "/" + this.tableName + "/" +RoutingConstants.ELL_SUB_RULELS_BY_PAYERS;
    table.columns = this.initializeTableColumnsForPayers();
    table.lazy = true;
    table.sortOrder = 1;
    table.checkBoxSelection = false;    
    table.excelFileName = "Payers";
    table.filterGlobal = false; 
    table.scrollable = true;
    table.horizontalScrollable = true;
    table.verticalScrollable = false;
    table.scrollHeight = '550px';
    table.asyncDownload = true;
    let asyncFileDetails = new EclAsyncFileDetails();
    asyncFileDetails.fileName = 'Payers';
    asyncFileDetails.processCode = 'ELL_QUERY';
    asyncFileDetails.extraDetails = { valueStr1: this.tableName }
    table.asyncFileDetails = asyncFileDetails;
  }

  private initializeTableColumnsForPayers(): EclColumn[] {
    const alignment = 'center';
    let manager = new EclTableColumnManager();  
    manager.addTextColumn('midRuleKey',       'Mid Rule',     '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('ruleVersion',      'Version',      '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('subRuleKey',       'Sub Rule',     '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('subRuleDesc',      'Description',  '400px', false, EclColumn.TEXT, false,500,alignment);
    manager.addTextColumn('subRuleRationale', 'Rationale',    '400px', false, EclColumn.TEXT, false,500,alignment);
    manager.addTextColumn('subRuleScript',    'Script',       '400px', false, EclColumn.TEXT, false,500,alignment);
    manager.addTextColumn('subRuleNotes',     'Notes',        '400px', false, EclColumn.TEXT, false,500,alignment);
    manager.addTextColumn('specCode',         'Spec Code',    '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('citRemarks',       'CIT Remarks',  '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('coreOptKey',       'Core Opt Key', '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('reasonCode',       'Reason Code',  '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('dateAdded',        'Date Added',   '90px', false, EclColumn.TEXT, false,0,alignment);
    return manager.getColumns();
  }

  /**
   * This method is for show the accordion payer or the result layer
   * @param ellSearchDto
   */
  showResultSearch(ellSearchDto  : EllSearchDto){
    
    if(ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0){    
      this.loadPayers = false;
      this.loadTableForResult(ellSearchDto.keyword);
      setTimeout(()=>{
        this.resultTableView.refreshTable();    
      }, 1000);
      this.showResultLayer=true;

    }
    else{
      this.loadPayers = true;      
      this.showResultLayer=false;
    }
    
  }

  cleanResult(){    
    this.loadPayers = true;      
    this.showResultLayer=false;
  }

  /**
   * This method is for load the table for the result
   * @param keyword 
   */
  loadTableForResult(keyword:string){
    this.resultTableFilter = new EclTableModel();
    this.initializeTableConfigForResult(this.resultTableFilter,keyword);
    this.loadTableByPayer=true;
  }

  /**
   * This method is for set the table for results
   * @param table 
   * @param keywordSearch 
   */
  private initializeTableConfigForResult(table: EclTableModel,keywordSearch:string){    
    let keyword: String = Constants.KEYWORD_TYPE_SEARCH.toLocaleLowerCase();
    table.url = RoutingConstants.ELL_URL + "/" + RoutingConstants.ELL_PAYER + "/" + RoutingConstants.ELL_FILTER_BY_KEYWORD + "?" + keyword + "="+encodeURIComponent(keywordSearch);    
    table.columns = this.initializeTableColumnsForResult();
    table.lazy = true;
    table.sortOrder = 1;
    table.checkBoxSelection = false;    
    table.excelFileName = "Payers";
    table.filterGlobal = false;    
    table.scrollable = true;
    table.horizontalScrollable = true;
    table.verticalScrollable = false;   
    table.scrollHeight = '550px'; 
  }

  /**
   * This method is for config the columns for the table result
   */
  private initializeTableColumnsForResult(): EclColumn[] {
    const alignment = 'center';
    let manager = new EclTableColumnManager();  
    manager.addTextColumn('midRuleKey',       'Mid Rule',     '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('ruleVersion',      'Version',      '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('subRuleKey',       'Sub Rule',     '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('subRuleDesc',      'Description',  '400px', false, EclColumn.TEXT, false,500,alignment);
    manager.addTextColumn('subRuleRationale', 'Rationale',    '400px', false, EclColumn.TEXT, false,500,alignment);
    manager.addTextColumn('subRuleScript',    'Script',       '400px', false, EclColumn.TEXT, false,500,alignment);
    manager.addTextColumn('subRuleNotes',     'Notes',        '400px', false, EclColumn.TEXT, false,500,alignment);
    manager.addTextColumn('specCode',         'Spec Code',    '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('citRemarks',       'CIT Remarks',  '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('coreOptKey',       'Core Opt Key', '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('reasonCode',       'Reason Code',  '90px', false, EclColumn.TEXT, false,0,alignment);
    manager.addTextColumn('dateAdded',        'Date Added',   '90px', false, EclColumn.TEXT, false,0,alignment);
    return manager.getColumns();
  }

  
  /**
  * This method is used to show Rule detail modal.
  *
  * @param $event.
  */
  viewRuleDetailModal(rowData: any) {
    const ref = this.dialogService.open(RuleDetailDecisionPointComponent, {
      data: {
        type: this.eclConstantsService.LONG_VERSION,
        releaseLogKey: rowData.releaseLogKey,
        midRuleKey: rowData.midRuleKey
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
        'border': 'none'
      }
    });
  }


}
