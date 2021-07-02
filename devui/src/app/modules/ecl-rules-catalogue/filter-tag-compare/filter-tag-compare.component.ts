import { Component, OnInit, ViewChild } from '@angular/core';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import * as _ from 'underscore';
import { CompareTableComponent } from './compare-table/compare-table.component';
import { StorageService } from 'src/app/services/storage.service';

const TAG_REQUEST_QUERY = 'tagRequest';
const PREVIOUS_COMPARE_TABLE_FILTER = 'PREVIOUS_COMPARE_TABLE_FILTER';

@Component({
  selector: 'app-filter-tag-compare',
  templateUrl: './filter-tag-compare.component.html',
  styleUrls: ['./filter-tag-compare.component.css']
})
export class FilterTagCompareComponent implements OnInit {
  @ViewChild('taggedRules',{static: true}) taggedRules: CompareTableComponent;
  @ViewChild('newResults',{static: true}) newResults: CompareTableComponent;
  tagResultTableConfig: EclTableModel = new EclTableModel();
  newResultTableConfig: EclTableModel = new EclTableModel();
  filterId: any;
  taggedResult: any;
  newRuleResults: any[];
  totalTaggedResult: number;
  totalNewResults: number;
  tagTableConfig: EclTableModel;
  newViewResultTableConfig: EclTableModel;
  endPoint : string;
  isEqualizeHeight : boolean = false;
  tagRequest: any;
  cacheRequest:any;
  totalNewRules: any = 0;
  
  constructor(private storageService: StorageService) { }

  ngOnInit() {
    this.initaiteTagResultTableModel();
    this.initaiteNewResultTableModel();
  }

  ngOnDestroy(){
    localStorage.removeItem(TAG_REQUEST_QUERY);
  }

  checkVisibleColumns(tableConfig) {
    let colManager = new EclTableColumnManager();
    colManager.addTextColumn('ruleCode', 'Rule Id', '20%', true,  EclColumn.TEXT, true);
    colManager.addTextColumn('midRule', 'Mid Rule', '15%', true,  EclColumn.TEXT, true);
    colManager.addTextColumn('version', 'Version', '15%', true,  EclColumn.TEXT, true);
    colManager.addDateColumn('logicEffectiveDate', 'LE Date', '20%', true, true, 'date', 'MM/dd/yyyy');
    colManager.addTextColumn('ruleName', 'Rule Name', '30%', true, EclColumn.TEXT, true);
    tableConfig.columns = colManager.getColumns();
  }

  initiateTableModel(tableConfig) {
    tableConfig.lazy = true;
    tableConfig.sortOrder = 1;
    tableConfig.showRecords = true;
    tableConfig.paginationSize = 50;
    tableConfig.filterGlobal = false;
    tableConfig.export = false;
    tableConfig.storageFilterKey = PREVIOUS_COMPARE_TABLE_FILTER;
    this.checkVisibleColumns(tableConfig);
  }

  initaiteTagResultTableModel(){
    this.taggedResult = [{},{},{},{},{}];
    this.taggedRules.hasPreviousFilter = false;
    this.taggedRules.totalRecords = 0;
    this.taggedRules.loading = false;
    this.taggedRules.value = [{},{},{},{},{}];
    let tableConfig = new EclTableModel();
    this.initiateTableModel(tableConfig);
    this.tagResultTableConfig = tableConfig;
  }

  initaiteNewResultTableModel(){
    this.newResults.hasPreviousFilter = false;
    this.newResults.totalRecords = 0;
    this.newResults.loading = false;
    this.newResults.value = [{},{},{},{},{}];
    this.newRuleResults = [{},{},{},{},{}];
    let tableConfig = new EclTableModel();
    this.initiateTableModel(tableConfig);
    this.newResultTableConfig = tableConfig;
  }
  
  /* Assigning table results to the fileds to compare and equalize the rows of two tables 
  and resetting the table values if there is no result from the service in ECL table*/
  onServiceCallCompare(ev: any) {
    if (ev.action === Constants.ECL_TABLE_END_SERVICE_CALL) {
      if(this.newResultTableConfig.endpointType === RoutingConstants.METADATA_TAG_DETAILS_COMPARE || this.tagResultTableConfig.endpointType === RoutingConstants.METADATA_TAG_DETAILS_COMPARE){
        if(ev.endPoint === this.newResultTableConfig.url){
          const { newRules, taggedRules } = this.newResults.compareResult;
          this.newResults.value = newRules.dtoList;
          this.taggedRules.value = taggedRules.dtoList;
          this.newResults.totalRecords = newRules.totalRecords;
          this.taggedRules.totalRecords = taggedRules.totalRecords;
          this.totalNewRules = this.newResults.compareResult.totalNewRules;
          if(this.taggedRules.totalRecords > this.newResults.firstIndex){
            this.taggedRules.firstIndex =  this.newResults.firstIndex;
            this.tagResultTableConfig.paginationSize = this.newResults.tableModel.paginationSize;
          }else{
            this.taggedRules.firstIndex = 0;
          }
          this.taggedRules.resetTableFilter();
        }else if(ev.endPoint === this.tagResultTableConfig.url){
          const { newRules, taggedRules } = this.taggedRules.compareResult;
          this.newResults.value = newRules.dtoList;
          this.taggedRules.value = taggedRules.dtoList;
          this.newResults.totalRecords = newRules.totalRecords;
          this.taggedRules.totalRecords = taggedRules.totalRecords;
          this.totalNewRules = this.taggedRules.compareResult.totalNewRules;
          if(this.newResults.totalRecords > this.taggedRules.firstIndex){
            this.newResults.firstIndex =  this.taggedRules.firstIndex;
            this.newResultTableConfig.paginationSize = this.taggedRules.tableModel.paginationSize;
          }else{
            this.newResults.firstIndex = 0;
          }
          this.newResults.resetTableFilter();
        }
      }
      if (this.taggedRules.totalRecords == 0) {
        this.taggedRules.loading = false;
        this.taggedRules.value = [{},{},{},{},{}];
        this.taggedResult = [{},{},{},{},{}];
        this.totalTaggedResult  = 0;
      }else{
        if(this.tagResultTableConfig.endpointType !== RoutingConstants.METADATA_TAG_DETAILS_COMPARE){
          this.taggedRules.value = this.taggedRules.value.filter((value: {}) => Object.keys(value).length !== 0);
        }
          this.taggedResult = this.taggedRules.value;
        this.totalTaggedResult  = this.taggedRules.totalRecords;
      }
      if (this.newResults.totalRecords == 0) {
        this.newResults.loading = false;
        this.newResults.value = [{},{},{},{},{}];
        this.newRuleResults = [{},{},{},{},{}];
        this.totalNewResults = 0;
      }else{
        if(this.tagResultTableConfig.endpointType !== RoutingConstants.METADATA_TAG_DETAILS_COMPARE){
          this.newResults.value = this.newResults.value.filter((value: {}) => Object.keys(value).length !== 0);
        }
        this.newRuleResults = this.newResults.value;
        this.totalNewResults = this.newResults.totalRecords;
      }

      this.equalizeTableRow();
    }
  }

  triggerTagRulesTable(){
    this.taggedRules.value = [];
    this.taggedRules.totalRecords = 0;
    this.taggedRules.value =  _.clone(this.taggedResult);
    this.taggedRules.totalRecords = _.clone(this.totalTaggedResult);
    this.newRuleResults =  this.newRuleResults.filter((value: {}) => Object.keys(value).length !== 0);
    if(! this.newRuleResults.length){
      this.newRuleResults = [{},{},{},{},{}];
    }
    this.newResults.value = this.newRuleResults
    this.equalizeTableRow();
  }

  triggerNewResultTable(){
    this.newResults.value = [];
    this.newResults.totalRecords = 0;
    this.newResults.value =  _.clone(this.newRuleResults);
    this.newResults.totalRecords = _.clone(this.totalNewResults);
    this.equalizeTableRow();
  }

  // Appending empty rows to the table to equlaize the row count if any of the table has more rows
  equalizeTableRow(){
    if(this.taggedResult.length < this.newRuleResults.length && this.taggedRules.value.length < this.newResults.value.length){
      let requiredRows = this.newRuleResults.length - this.taggedResult.length;
      for(let i=0; i < requiredRows; i++){
         this.taggedRules.value.push({});
      }
    } 
    if(this.newRuleResults.length < this.taggedResult.length && this.newResults.value.length < this.taggedRules.value.length){
      let requiredRows = this.taggedResult.length - this.newRuleResults.length;
      for(let i=0; i < requiredRows; i++){
        this.newResults.value.push({});
      }
    }
    this.isEqualizeHeight = true;
  }

  ngAfterViewChecked(){
    this.equalizeHeight();
  }

  //Equalize the height of rows based on the height of adjacent row in next table
  equalizeHeight(){
    if(this.isEqualizeHeight ===true){
      const taggedTableRows = document.getElementById('taggedRuleTable').getElementsByClassName('ui-selectable-row');
      const newResultTableRows = document.getElementById('newResultTable').getElementsByClassName('ui-selectable-row');
        if(taggedTableRows !== undefined && newResultTableRows !== undefined){
          let recordSize = 0;
          this.taggedRules.value.length > this.newResults.value.length ? recordSize = this.taggedRules.value.length : recordSize = this.newResults.value.length;
          for(let i=0;i< recordSize;i++){
            let taggedTableRowsHeight = taggedTableRows[i].querySelector("td").offsetHeight;
            let newResultTableRowsHeight = newResultTableRows[i].querySelector("td").offsetHeight;
            if(taggedTableRowsHeight > newResultTableRowsHeight){
              taggedTableRows[i].querySelectorAll("td")[0].height = taggedTableRowsHeight+'px';
              newResultTableRows[i].querySelectorAll("td")[0].height = taggedTableRowsHeight+'px';
            }else{
              taggedTableRows[i].querySelector("td").height = newResultTableRowsHeight+'px';
              newResultTableRows[i].querySelector("td").height = newResultTableRowsHeight+'px';
            }
          }
        this.isEqualizeHeight = false;
      }
    }
  }

  reset(){
    this.initaiteTagResultTableModel();
    this.initaiteNewResultTableModel();
    this.clearTaggedResult();
    this.clearNewResults();
    if (this.tagResultTableConfig.storageFilterKey)
      this.storageService.remove(this.tagResultTableConfig.storageFilterKey);
    if (this.newResultTableConfig.storageFilterKey)
      this.storageService.remove(this.newResultTableConfig.storageFilterKey);
    this.newResults.clearFilters();
    this.taggedRules.clearFilters();
    this.totalNewRules = 0;
  }

  clearTaggedResult(){
    localStorage.removeItem(TAG_REQUEST_QUERY);
    this.taggedResult = [];
    this.totalTaggedResult = 0;
    this.taggedRules.value = [{},{},{},{},{}];
    this.taggedRules.totalRecords = 0;
    this.initaiteTagResultTableModel();
  }

  clearNewResults(){
    this.newRuleResults = [];
    this.newResults.value = [{},{},{},{},{}];
    this.newResults.totalRecords = 0;
    this.totalNewResults = 0;
  }

  clearTagResultTableConfig(){
    this.taggedResult = [{},{},{},{},{}];
    this.totalTaggedResult  = 0;
    this.tagResultTableConfig.url = '';
    this.tagResultTableConfig.cacheRequest = [];
    this.triggerTagRulesTable();
  }

  clearNewResultTableConfig(){
    this.newRuleResults = [{},{},{},{},{}];
    this.totalNewResults = 0;
    this.newResultTableConfig.url = '';
    this.newResultTableConfig.cacheRequest = [];
    this.triggerNewResultTable();
  }
  
}
