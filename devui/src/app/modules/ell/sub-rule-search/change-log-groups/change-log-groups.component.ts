import { TableDetailDto } from 'src/app/shared/models/dto/table-detail-dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/api';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { ChangeLogGroupsService } from './change-log-groups.service';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { SubRuleDetailComponent } from '../sub-rule-detail/sub-rule-detail.component';

@Component({
  selector: 'ecl-change-log-groups',
  templateUrl: './change-log-groups.component.html',
  styleUrls: ['./change-log-groups.component.css']
})
export class ChangeLogGroupsComponent implements OnInit {

  changeLogs;
  logTableModel;
  tableConfig : EclTableModel ;  
  blockedDocument = true;
  tableName: string = '';
  mainResult: boolean;
  searchResult: boolean;
  @ViewChild('tableResult') tableResult: EclTableComponent;

  constructor(private changeLogGroupsService: ChangeLogGroupsService, private dialogService: DialogService) { }

  ngOnInit() {
    this.changeLogGroupsService.getChangeLogs().subscribe((response: BaseResponse) => {
      this.changeLogs = response.data;
      this.blockedDocument = false;
      this.mainResult=true;
      this.searchResult=false;
    }, error => {
      this.blockedDocument = false;
    });   
  }

  /**
   * Creates the table model object for the specific tab index of the accordion.
   * @param accordionIndex accrdion tab index.
   */
  createTableModel(accordionIndex: number): void {
    const logElement = this.changeLogs[accordionIndex];

    const manager = new EclTableColumnManager();
    const alignment = 'center';
    manager.addLinkColumn('logComment', 'Group Name', null, false, EclColumn.TEXT, false);
    manager.addTextColumn('logKey', 'Group Name Key', '10%', false, EclColumn.TEXT, false, null, alignment);
    manager.addTextColumn('logDesc', 'Dialog List', null, false, EclColumn.TEXT, false);

    const eclTableModel = new EclTableModel();

    eclTableModel.url = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_CHANGE_RESOURCE}/${logElement}/${RoutingConstants.ELL_SUB_RULELS_BY_PAYERS}`; 
    eclTableModel.columns = manager.getColumns();
    eclTableModel.lazy = true;
    eclTableModel.sortOrder = 1;
    eclTableModel.checkBoxSelection = false;
    eclTableModel.excelFileName = "sub-rules-by-log-groups";
    eclTableModel.filterGlobal = false;
    eclTableModel.scrollable = true;

    this.logTableModel = eclTableModel;
   
  }

  /**
   * When the acordion opens we create the table model.
   * @param accordionIndex accrdion tab index.
   */
  onTabOpen(accordionIndex: number) {
    this.tableName = this.changeLogs[accordionIndex];
    this.createTableModel(accordionIndex);
  }

  /**
   * Opens a details component for the specific change log.
   * @param event that contains the row data.
   */
  openChangeLogDetails(rowData: any) {
    this.dialogService.open(SubRuleDetailComponent, {
      data: {
        header : `Change Log Group Detail`,
        tableDetailDto: this.getDataForDetail(rowData), 
        pdfFileName : `Change Log Group Detail`,
      },
      header: 'Change Log Group',
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
      { title: 'Group Table',    value: this.tableName,         },
      { title: 'Group Name',     value: rowData['logComment'],  },
      { title: 'Group Name Key', value: rowData['logKey'],      }
    ];
    return tableDetailDto;
  } 
  
  /**
   * This method is for show all the result records from search bar
   * @param ellSearchDto 
   */
  showResultSearch(ellSearchDto  : EllSearchDto){    
   
    //search only if there any text in the box search area.
    if(ellSearchDto.keyword.length > 0){
      
      this.initializeTableConfig(ellSearchDto);          
      this.mainResult = false;
      this.searchResult = true;             
      
      setTimeout(()=>{
        this.tableResult.refreshTable();    
      },1000);
      
    }
             
  }

  private initializeTableConfig(ellSearchDto  : EllSearchDto){   
    const logElement = this.changeLogs[0];
    
    let eclTableParameters = this.getTableParameters();
    let uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_CHANGE_RESOURCE}/${logElement}/${RoutingConstants.ELL_SUB_RULELS_BY_PAYERS}`;        
    
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
    this.tableConfig.excelFileName = "grup-log-filter";
  
  }

  private getTableParameters() {
    const alignment = 'center';
    let manager = new EclTableColumnManager();
    manager.addTextColumn('logTable', 'Table Name', null, false, EclColumn.TEXT, false);
    manager.addLinkColumn('logComment', 'Group Name', null, false, EclColumn.TEXT, false);
    manager.addLinkColumn('logKey', 'Group Name Key', '10%', false, EclColumn.TEXT, false,alignment);
    manager.addTextColumn('logDesc', 'Dialog List', null, false, EclColumn.TEXT, false);
    return manager;
  }

  cleanResult(){
    this.mainResult = true;
    this.searchResult = false;
  }
}
