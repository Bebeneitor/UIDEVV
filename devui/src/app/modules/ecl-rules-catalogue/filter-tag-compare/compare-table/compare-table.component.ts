import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { LazyLoadEvent} from 'primeng/api';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DateUtils } from 'src/app/shared/services/utils';

import { CacheRequestDto } from 'src/app/shared/models/dto/cache-request-dto';
import * as _ from 'underscore';
import { StorageService } from 'src/app/services/storage.service';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableService } from 'src/app/shared/components/ecl-table/service/ecl-table.service';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';

const jsPDF = require('jspdf');
require('jspdf-autotable');

const CONTAINS_FILTER = 'contains';
const CUSTOM_DATE_FILTER = 'customDate';
const ASC_ORDER = 'asc';
const DESC_ORDER = 'desc';
const PAGINATION_PARAM = 'pagination';
const GLOBAL_FILTER_PARAM = 'globalFilter';
const SORTING_PARAM = 'sorting';
const CRITERIA_FILTERS = 'criteriaFilters';
const FILTERING_PARAM = 'filters';
const FILTER_DATE = 'date';

@Component({
  selector: 'compare-table',
  templateUrl: './compare-table.component.html',
  styleUrls: ['./compare-table.component.css']
})

export class CompareTableComponent implements OnInit {

  @Input('tableModel') tableModel: EclTableModel = null;

  @Output() onSelectRecord = new EventEmitter<any>();
  @Output() onUnSelectRecord = new EventEmitter<any>();
  @Output() onAcctionLink = new EventEmitter<any>();
  @Output() onServiceCall = new EventEmitter<any>();

  @ViewChild('eclTable',{static: true}) eclTable;
  keywordSearch: string = '';
  refreshTable: Function;
  loadCustomFilterOptions: Function;
  value: any[] = [];
  selectedRecords: any[] = [];
  savedSelRecords: any[] = [];
  filters: any = {};
  filterRow: boolean = false;
  filtersColumns: any = {};
  loading: boolean = true;
  firstIndex: number = 0;
  totalRecords: number = null;
  sortObject: any = null;
  cacheRequestDto: CacheRequestDto;
  customFilterOptions: any[] = [];
  templateColumnsConstant: any = EclColumn;
  columnMappings: any[];
  hasPreviousFilter: boolean = false;
  filterColumnValues: any = [];
  popUpOverlayInfo: any = { data: { description: null, href: null }, isLink: false, isList: false };
  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  compareResult: any;

  constructor(private service: EclTableService, private dateUtils: DateUtils,
    private dashboardService: DashboardService, private storageService: StorageService,
    ) {
    this.filter = _.debounce(this.filter, 1000);
  }

  ngOnInit() {

     if (!this.hasPreviousFilter)
      this.clearFilters();

    this.refreshTable = this.loadData;
    this.loadCustomFilterOptions = this.fillCustomFilterOptions;

    if (this.eclTable !== undefined &&
      this.eclTable.filterConstraints !== undefined) {
      this.eclTable.filterConstraints[CUSTOM_DATE_FILTER] = (value, filter): boolean => {
        // Make sure the value and the filter are Dates
        return this.dashboardService.parseDate(new Date(value.getTime())) == this.dashboardService.parseDate(new Date(filter.getTime()));
      }
    }

     if (!this.tableModel.lazy) {
      if (this.tableModel.data) {
        this.value = this.tableModel.data;
        this.loading = false;
      } else {
        this.loadData(null);
      }
    }
    this.initializeFilterColumnValues();
  }
  
  /** defining filtercolumnvalues to populate the filtercolumns with previous filters*/
  initializeFilterColumnValues() {
    this.filterColumnValues = [];
    Object.keys(this.filters).forEach(key => {
      this.filterColumnValues.push({ field: key, value: '', type: '' })
    })
  }
  
  fillCustomFilterOptions(columnName: string, options: any[]) {
    this.eclTable.columns.forEach((column: any) => {
      if (columnName == column.field) {
        this.customFilterOptions = options;
      }
    });
  }

  /**
   * Clear table filters
   */
  clearFilters() {
    this.tableModel.columns.forEach(item => {
      this.filters[item.field] = (item.filterType == EclColumn.CATEGORY) ? null : '';
      this.filtersColumns[item.field] = null;
    });

    for (let index: number = 0; index < this.tableModel.columns.length; index++) {
      if (this.tableModel.columns[index].filter) {
        this.filterRow = true;
        break;
      }
    }

  }

  /**
   * Get column filters from this table
   */
  getColumnFilters() {
    let filters = [];
    this.tableModel.columns.forEach(item => {
      if (item.filter) {
        this.setObject(item.field, this.filters[item.field], filters);
      }
    });

    // Removing all empty filters.
    return filters.filter(columnFilter => {
      if(columnFilter.value !== undefined)
        return columnFilter.value || columnFilter.value.length > 0;
    });

  }

  /**
   * Function to load data from backend
   */
  loadData(event: LazyLoadEvent) {
    let sort = null;
    if (this.tableModel.sortBy != null && event != null) {
      event.sortField = this.tableModel.sortBy;
      event.sortOrder = this.tableModel.sortOrder;
      this.tableModel.sortBy = null;
    }

    if (event != null && event.sortField != undefined && event.sortOrder != undefined) {
      sort = {
        field: event.sortField,
        order: Number(event.sortOrder) == 1 ? ASC_ORDER : DESC_ORDER
      }

      this.sortObject = sort;
    }
   
    if (event != null) {
      this.firstIndex = event.first;
      this.tableModel.paginationSize = this.eclTable.rows;
    }
    if (this.hasPreviousFilter === true) this.restorePreviousFilter(event);
    this.search(this.sortObject);
  }

  /** Restoring filter parameters */
  restorePreviousFilter(event: LazyLoadEvent) {
    if (this.tableModel.storageFilterKey && this.storageService.exists(this.tableModel.storageFilterKey)) {
      let storageFilter = this.storageService.get(this.tableModel.storageFilterKey, true);
      this.keywordSearch = storageFilter.globalFilter;
      this.filters = storageFilter.localFilters;
      this.filterColumnValues = storageFilter.filtersColumns;
      storageFilter.filtersColumns.forEach(element => {
        if (element.type === FILTER_DATE && element.value !== null && element.value !== '') {
          this.filtersColumns[element.field] = new Date(element.value);
        } else {
          (storageFilter.globalFilter !== '' && storageFilter.globalFilter !== null) ? this.filtersColumns[element.field] = '' : this.filtersColumns[element.field] = element.value;
        }
      });
      if (event === null && storageFilter.pagination !== null) {
        this.firstIndex = storageFilter.pagination.index;
        this.tableModel.paginationSize = storageFilter.pagination.pageSize;
      }
      if(!this.tableModel.lazy)this.filter(null,null)
    }
  }

  /**
   * Filter by column
   * @param value value entered on input
   * @param field field name in json
   * @param type type of column
   */
  filter(value, field, type: string = EclColumn.TEXT) {
   
    if(value === null && field === null){
     let data = this.getColumnFilters();
     if(data.length > 0){
      if(data[0].columnName !== undefined)
         field = data[0].columnName
      value = data[0].value
     }
    }
    this.filtersColumns[field] = value;
    this.filterColumnValues.forEach(element => {
      if (element.field === field) {
        element.value = value;
        element.type = type
      }
    });

    this.filters[field] = value;

    let tableFilter = { globalFilter: this.keywordSearch, localFilters: this.filters, filtersColumns: this.filterColumnValues, pagination: null }
    if (this.tableModel.storageFilterKey)
      this.storageService.set(this.tableModel.storageFilterKey, tableFilter, true);

    if (this.tableModel.lazy) {
      this.firstIndex = 0;
      this.search(this.sortObject);

    } else {
      let typeFilter = CONTAINS_FILTER;
      if (value != null && type == EclColumn.DATE) {
        switch (type) {
          case EclColumn.DATE:
            typeFilter = CUSTOM_DATE_FILTER;
            break;
        }
      }
      this.eclTable.filter(value, field, typeFilter)
    }
  }

  /**
   * Search information in backend
   */
  search(sorting = null) {
    this.compareResult = '';
    if (!this.tableModel.url) {
      return;
    }
    //Filters, keywords, sorting, pagination
    let request = {};
    request = this.setColumnOptions(request);

    if (this.tableModel.lazy) {
      request[PAGINATION_PARAM] = {
        index: this.firstIndex,
        pageSize: this.tableModel.paginationSize
      }
    } else {
      request[PAGINATION_PARAM] = null;
    }
    let localFilters = JSON.parse(JSON.stringify(this.filters));
    let realFilters = [];
    this.tableModel.columns.forEach(item => {
      if (item.filter) {
        this.setObject(item.field, localFilters[item.field], realFilters);
      }
    });

    request[GLOBAL_FILTER_PARAM] = this.keywordSearch.toString().trim() === '' ? null : this.keywordSearch;

    // Check if we have some sort options.
    if (sorting) {
      request = this.setSortOptions(request);
    } else {
      request[SORTING_PARAM] = [];
    }

    // Removing all empty filters.
    realFilters = realFilters.filter(columnFilter => {
      return columnFilter.value && columnFilter.value.toString().length > 0;
    });

    request[FILTERING_PARAM] = realFilters;

    this.loading = true;
    let tableFilter = { globalFilter: this.keywordSearch, localFilters: this.filters, filtersColumns: this.filterColumnValues, pagination: request[PAGINATION_PARAM] }
    if (this.tableModel.storageFilterKey){
      this.storageService.set(this.tableModel.storageFilterKey, tableFilter, true);
    }
    request[CRITERIA_FILTERS] = this.tableModel.criteriaFilters;
    // If we recieve from the consumer extra body parameters we add them to the body property.
    if (this.tableModel.extraBodyKeys) {
      request = { tableOptions: { ...request }, ...this.tableModel.extraBodyKeys };
    }
    this.getData(request);

  }
 /*  api call to get the rule details for compare grid */
  private getData(request: any){
    this.service.getCompareGridData(this.tableModel.url, request, this.tableModel.columns).subscribe((response: any) => {
      let preSelection;
      if(this.tableModel.endpointType === RoutingConstants.METADATA_TAG_DETAILS || this.tableModel.endpointType === RoutingConstants.CACHE_LIBRARY_VIEW_SEARCH){
        if (this.tableModel.lazy) {
          this.totalRecords = response.data.totalRecords;
        } else {
          this.totalRecords = response.data.dtoList.length;
        }
        this.value = response.data.dtoList;
        preSelection = this.setPreSelection(this.value);
        this.onServiceCall.emit({ action: Constants.ECL_TABLE_END_SERVICE_CALL });
        this.selectedRecords = [...preSelection];
        
      }else {
        this.compareResult = response.data;
        this.onServiceCall.emit({ action: Constants.ECL_TABLE_END_SERVICE_CALL ,endPoint:this.tableModel.url});
      }
      
      this.loading = false;
    });
  }

  /**
   * Check to see if user has made selection and it's in the current page to be pre-selected
   * @param tempValue value that will be mutated inside with no outside conflicts
   */
  private setPreSelection(tempValue: any) {
    let preSelectValues: any;
    if (this.savedSelRecords.length > 0 && tempValue.length > 0) {
      preSelectValues = tempValue.filter(rowData => {
        let tempData = rowData;
        tempData = this.removeCategoryIdCol(tempData);
        const val: any[] = Object.values(tempData);
        const rec: any[] = this.savedSelRecords.map(value => {
          value = this.removeCategoryIdCol(value);
          return Object.values(value)
        });
        if (!val || !rec) return;
        let result;
        let stop = false;
        rec.forEach(e1 => {
          // Checking array first element via ID of each table.
          if (e1[0] === val[0]) {
            result = true;
            stop = true;
          } else {
            if (!stop) { result = false; }
          }
        });
        return result;
      });
      return preSelectValues;
    } else {
      const emptyArray = [];
      return emptyArray;
    }
  }

  /**
   * Remove categoryIdCol
   * - CategoryID is removed for a quick fix (Not long term solution)
   * - data must not contain categoryDesc and categoryId.
   * @deprecated Remove once categoryId is no longer initlzed. 
   * @param tempData Removing the object property 'categoryId'
   */
  private removeCategoryIdCol(tempData: any) {
    if (tempData.categoryId !== undefined) { delete tempData.categoryId; }
    return tempData;
  }

  /**
  * This adds the column related properties to the request object
  * @param request Object to be sent to the backend
  */
  private setColumnOptions(request) {
    request.columns = this.tableModel.columns.map(column => column.field);
    return request;
  }

  /**
  * This adds the sorting related properties to the request object
  * @param request Object to be sent to the backend
  */
  private setSortOptions(request) {
    const field = this.getColumnName(this.sortObject.field);
    const columnMapping = this.columnMappings ? this.columnMappings.find(element => element.columnName === field) : null;
    const fixedSort = {
      field,
      order: this.sortObject.order,
      entity: columnMapping ? columnMapping.entity : null
    };
    request[SORTING_PARAM] = [fixedSort];
    return request;
  }

  setObject(name, value, context) {
    const columnName = this.getColumnName(name);
    const columnMapping = this.columnMappings ? this.columnMappings.find(element => element.columnName === columnName) : null;
    context.push({
      columnName,
      value,
      entity: columnMapping ? columnMapping.entity : null
    });

    return context;
  }

  
  getColumnName(name: string): string {
    let parts: string[] = name.split('.');    
    if(name.includes('?')){
      parts = name.split('?')
    }
    return this.getName(parts);
  }


  getName(parts: string[]){
    let name: string = '';
    if (parts.length > 1) {
      parts.forEach((part: string, index: number) => {

        if (index > 0) {
          name += part + '.';
        }
      });
      name = name.slice(0, -1);
    } else {
      name = JSON.parse(JSON.stringify(parts)).pop();
    }
    return name;
  }

  splitAttributes(data, field) {
    let value = data;
    let array = field.split('.');
      array.forEach(item => {
           if(value[item] === undefined){
             value = ""
           }else{
             value = value[item];
           }
      });
 
    if (this.dateUtils.isDate(value)) {
      value = this.parseDate(value);
    }
    return value == null || value == undefined ? '' : value;
  }

  /**
   * Refresh grid data when clear filters
   */
  resetDataTable() {
    this.firstIndex = 0;
    this.keywordSearch = '';
    this.clearFilters();
    this.savedSelRecords = [];
    this.search(this.sortObject);
  }

  customColumnValues(response: any, columnValues: any[], column: string) {
    response.forEach((res: any) => {
      columnValues.forEach((columnValue: any) => {
        if (res[column] === columnValue.value) {
          res[column] = columnValue.label;
        }
      });
    });
  }

 
  /**
   * When user select a row with checkbox
   * @param event
   */
  onRowSelect(event) {
    this.saveRecords(event.data);
    this.onSelectRecord.emit(this.savedSelRecords);
  }

  /**
   * When user unselect a row with checkbox
   * @param event
   */
  onRowUnselect(event) {
    this.removeRecords(event.data)
    this.onUnSelectRecord.emit(this.savedSelRecords);
  }

  onAcctionLinkFu(row, field) {
    this.onAcctionLink.emit({ row: row, field: field });

  }
  


  /**
   * Parse dates
   * @param date
   */
  parseDate(date: any) {
    let month: string = date.toString().substring(5, 7);
    let day: string = date.toString().substring(8, 10);
    let year: string = date.toString().substring(0, 4);
    return this.dashboardService.parseDate(new Date(month + "-" + day + "-" + year));
  }
  
  /**
   * Save the Records for across pagination, filter and page length changes
   * @param selection Selection that will be saved.
   */
  saveRecords(selection: any) {
    if (selection && this.savedSelRecords.length > 0) {
      for (let i = 0; this.savedSelRecords.length > i; i++) {
        const rowData = this.savedSelRecords[i];
        const { save, sel } = this.unknownObjToArray(rowData, selection);
        if (!save || !sel) return
        if (save.indexOf(sel[0]) === -1) {
          this.savedSelRecords.push(selection)
          break;
        }
      }
    } else {
      this.savedSelRecords.push(selection)
    }
  }

  /**
   * Remove the records for across pagination, filter and page length changes
   * @param selection selection that will be removed.
   */
  removeRecords(selection: any) {
    if (selection) {
      this.savedSelRecords = this.savedSelRecords.filter(rowData => {
        const { save, sel } = this.unknownObjToArray(rowData, selection);
        if (!save || !sel) return;
        return sel[0] === save[0] ? false : true;
      })
    }
  }

  /**
   * Formating Unknown Object into Array
   * @param rowData Object in savedSelSelection
   * @param selection Object that been newly selected
   */
  private unknownObjToArray(rowData: any, selection: any) {
    rowData = this.removeCategoryIdCol(rowData);
    selection = this.removeCategoryIdCol(selection);
    const save: any[] = Object.values(rowData);
    const sel: any[] = Object.values(selection);
    return { save, sel };
  }

  /* setting the filter option in table */
  resetTableFilter(){
    if (this.tableModel.storageFilterKey && this.storageService.exists(this.tableModel.storageFilterKey)) {
      let storageFilter = this.storageService.get(this.tableModel.storageFilterKey, true);
      this.keywordSearch = storageFilter.globalFilter;
      this.filters = storageFilter.localFilters;
      this.filterColumnValues = storageFilter.filtersColumns;
      storageFilter.filtersColumns.forEach(element => {
        if (element.type === FILTER_DATE && element.value !== null && element.value !== '') {
          this.filtersColumns[element.field] = new Date(element.value);
        } else {
          (storageFilter.globalFilter !== '' && storageFilter.globalFilter !== null) ? this.filtersColumns[element.field] = '' : this.filtersColumns[element.field] = element.value;
        }
      });
      if(!this.tableModel.lazy)this.filter(null,null)
    }
  }
}
