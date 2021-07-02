import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, OnChanges, SimpleChange, Inject, LOCALE_ID } from '@angular/core';
import { LazyLoadEvent, ConfirmationService, SortEvent } from 'primeng/api';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { AppUtils } from 'src/app/shared/services/utils';
import { EclColumn } from './model/ecl-column';
import { EclTableModel } from './model/ecl-table-model';
import { EclTableService } from './service/ecl-table.service';
import { Constants } from '../../models/constants';
import { CacheRequestDto } from 'src/app/shared/models/dto/cache-request-dto';
import * as _ from 'underscore';
import { StorageService } from 'src/app/services/storage.service';
import { OverlayPanel } from 'primeng/primeng';
import { getDrugVersionId } from 'src/app/modules/dnb/utils/tools.utils';
import { DatePipe, SlicePipe } from '@angular/common';
import { EclColumnStyleCondition, EclColumnStyles } from './model/ecl-column-style';
import { EclButtonTable, EclButtonTableCondition } from './model/ecl-button';

const jsPDF = require('jspdf');
require('jspdf-autotable');

const ALL_LABEL = 'All';
const ACTIVE_LABEL = 'Active';
const INACTIVE_LABEL = 'Inactive';
const CONTAINS_FILTER = 'contains';
const CUSTOM_DATE_FILTER = 'customDate';
const CUSTOM_DATE_FILTER_STRING='customDateString';
const EXCEL_LABEL = 'excel';
const ASC_ORDER = 'asc';
const DESC_ORDER = 'desc';
const MESSAGE_EXPORTING = 'Exporting data, please wait...';
const TITLE_EMPTY = 'No data';
const MESSAGE_EMPTY = 'Data Table is Empty';
const PAGINATION_PARAM = 'pagination';
const GLOBAL_FILTER_PARAM = 'globalFilter';
const SORTING_PARAM = 'sorting';
const CRITERIA_FILTERS = 'criteriaFilters';
const FILTERING_PARAM = 'filters';
const FILTER_DATE = 'date';

@Component({
  selector: 'ecl-table',
  templateUrl: './ecl-table.component.html',
  styleUrls: ['./ecl-table.component.css']
})

export class EclTableComponent implements OnInit, OnDestroy, OnChanges {

  @Input('tableModel') tableModel: EclTableModel = null;

  @Output() onHoverColumn = new EventEmitter<any>();
  @Output() onSelectRecord = new EventEmitter<any>();
  @Output() onUnSelectRecord = new EventEmitter<any>();
  @Output() onAcctionLink = new EventEmitter<any>();
  @Output() onAcctionIcon = new EventEmitter<any>();
  @Output() onAcctionButton = new EventEmitter<any>();
  @Output() onActionCheckChild = new EventEmitter<any>();
  @Output() onActionMultiLineLinkChild = new EventEmitter<any>();
  @Output() onActionSwitchChange = new EventEmitter<any>();
  @Output() onServiceCall = new EventEmitter<any>();
  @Output() onTrashButtonCall = new EventEmitter<any>();
  @Output() onRecoveryButtonCall = new EventEmitter<any>();

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
  loadingText: string = '';
  exportableColumns: EclColumn[] = [];

  customFilterOptions: any[] = [];
  categories: any[] = [];
  lobs: any[] = [];
  jurisdictions: any[] = [];
  states: any[] = [];
  status: any[] = [];
  dataColumnCheck: any[] = [];

  templateColumnsConstant: any = EclColumn;

  columnMappings: any[];
  hasPreviousFilter: boolean = false;
  filterColumnValues: any = [];
  iconOptions: any[] = [];

  popUpOverlayInfo: any = { data: { description: null, href: null }, isLink: false, isList: false };

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  excelButton: any = null;
  pdfButton: any = null;

  //Handle comments column
  displayComments: boolean = false;
  loadedComments: string[] = [];
  moduleIdComments: number = 0;
  columnConfig: any;
  commentToAdd: string = '';

  checkedRestriction: boolean = false;

  noDebounceFilter = this.filter;
  constructor(private service: EclTableService, private excelService: ExcelService, private toast: ToastMessageService,
    private dashboardService: DashboardService, private util: AppUtils, private storageService: StorageService,
    private confirmationService: ConfirmationService, private datePipe: DatePipe, @Inject(LOCALE_ID) private locale: string,
    private slicePipe: SlicePipe) {
    this.filter = _.debounce(this.filter, 1000);
    this.filterGlobalData = _.debounce(this.filterGlobalData, 1000);

  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') {
        if (value1.includes("%"))
          result = this.isColumnPercentage(value1, value2);
        else if (event.field.includes('.') && value1 === '')
          result = this.isColumnObject(event, data1, data2);
        else
          result = value1.localeCompare(value2);
      } else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      return (event.order * result);
    });
  }

  isColumnPercentage(value1, value2) {
    value1 = +value1.replace('%', '')
    value2 = +value2.replace('%', '')
    return (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
  }

  isColumnObject(event, data1, data2) {
    let field = event.field.split('.');
    let val1 = "";
    let val2 = "";

    if (data1[field[0]] !== undefined)
      val1 = data1[field[0]][field[1]];
    if (data2[field[0]] !== undefined)
      val2 = data2[field[0]][field[1]];
    return val1.localeCompare(val2);
  }

  ngOnInit() {
    if (this.tableModel.export && this.tableModel.excelFileName == null) {
      this.tableModel.excelFileName = new Date().getTime().toString();
    }
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

    if (this.eclTable !== undefined &&
      this.eclTable.filterConstraints !== undefined) {
        this.eclTable.filterConstraints[CUSTOM_DATE_FILTER_STRING] = (value, filter): boolean => {
          const dateValue = new Date(value)
          const dateFilter = new Date(filter)
          return this.dashboardService.parseDate(new Date(dateValue.getTime())) == this.dashboardService.parseDate(new Date(dateFilter.getTime()));
      }
    }
    let loadCategories = false;
    let loadLobs = false;
    let loadJurisdictions = false;
    let loadStates = false;
    let loadStatus = false;

    this.tableModel.columns.forEach(item => {
      if (item.columnType != EclColumn.ICON && item.columnType != EclColumn.BUTTONS && item.columnType != EclColumn.CHECK) {
        this.exportableColumns.push(item);
      }

      switch (item.filterType) {
        case EclColumn.CATEGORY:
          loadCategories = true;
          break;
        case EclColumn.LOB:
          loadLobs = true;
          break;
        case EclColumn.JURISDICTION:
          loadJurisdictions = true;
          break;
        case EclColumn.STATE:
          loadStates = true;
          break;
        case EclColumn.STATUS:
          loadStatus = true;
          break;
      }
    });

    Promise.all([
      this.loadCategories(loadCategories),
      this.loadLobs(loadLobs),
      this.loadJurisdictions(loadJurisdictions),
      this.loadStates(loadStates),
      this.loadStatus(loadStatus)
    ]).then(response => {
      //Catalogues loaded
    });

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

  ngOnDestroy(): void {
  }

  ngOnChanges(changes): void {
    if (changes && changes.tableModel && changes.tableModel.previousValue) {
      this.resetDataTable();
    }
  }

  ngAfterViewInit() {
    this.excelButton = document.querySelector(".excel-button");
    this.pdfButton = document.querySelector(".pdf-button");
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

  loadLobs(load: boolean) {
    return new Promise(resolve => {
      if (load) {
        this.lobs = [{ label: ALL_LABEL, value: null }];
        this.util.getAllLobs(this.lobs).then((response: any) => {
          this.lobs = response;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  loadJurisdictions(load: boolean) {
    return new Promise(resolve => {
      if (load) {
        this.jurisdictions = [{ label: ALL_LABEL, value: null }];
        this.util.getAllJurisdictionsWidgets(this.jurisdictions).then((response: any) => {
          this.jurisdictions = response;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  loadStates(load: boolean) {
    return new Promise(resolve => {
      if (load) {
        this.states = [{ label: ALL_LABEL, value: null }];
        this.util.getAllStates(this.states).then((response: any) => {
          this.states = response;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  loadStatus(load: boolean) {
    return new Promise(resolve => {
      if (load) {
        this.status = [{ label: ALL_LABEL, value: null }, { label: ACTIVE_LABEL, value: { id: 1, name: ACTIVE_LABEL } }, { label: INACTIVE_LABEL, value: { id: 2, value: INACTIVE_LABEL } }];
        resolve();
      } else {
        resolve();
      }
    });
  }

  loadCategories(load: boolean) {
    return new Promise(resolve => {
      if (load) {
        this.categories = [{ label: ALL_LABEL, value: null }];
        this.util.getAllCategories(this.categories).then((response: any) => {
          this.categories = response;
          resolve();
        });
      } else {
        resolve();
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
      if (columnFilter.value !== undefined && columnFilter.value != null)
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
      setTimeout(() => {
        this.tableModel.sortBy = null;
      }, 0);
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
    if (this.tableModel.storageFilterKey) this.restorePreviousFilter(event);
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
    }
  }

  /**
   * Filter by column
   * @param value value entered on input
   * @param field field name in json
   * @param type type of column
   */
  filter(value, field, type: string = EclColumn.TEXT) {
    if (value === null && field === null) {
      let data = this.getColumnFilters();
      if (data.length > 0) {
        if (data[0].columnName !== undefined)
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

    switch (type) {
      case EclColumn.DROPDOWN:
        let customOptions = this.customFilterOptions.find(item => item.value === value);
        value = customOptions.value != null ? customOptions.value : null;
        break;
      case EclColumn.CATEGORY:
        let category = this.categories.find(item => item.value === value);
        if (category.value != null) {
          value = this.tableModel.lazy ? category.value.id : category.value.name;
        }
        break;
      case EclColumn.LOB:
        let lob = this.lobs.find(item => item.value === value);
        if (lob.value != null) {
          value = this.tableModel.lazy ? lob.value.id : lob.value.name;
        }
        break;
      case EclColumn.JURISDICTION:
        let jurisdiction = this.jurisdictions.find(item => item.value === value);
        if (jurisdiction.value != null) {
          value = this.tableModel.lazy ? jurisdiction.value.id : jurisdiction.value.name;
        }
        break;
      case EclColumn.STATE:
        let state = this.states.find(item => item.value === value);
        if (state.value != null) {
          value = this.tableModel.lazy ? state.value.id : state.value.name;
        }
        break;
      case EclColumn.STATUS:
        let status = this.status.find(item => item.value === value);
        if (status.value != null) {
          value = this.tableModel.lazy ? status.value.id : status.value.name;
        }
        break;

    }

    if(this.tableModel.checkBoxRestriction) {
      this.selectAllRows(false);
    }

   
    if (type === EclColumn.DATE_TIME_ZONE && this.tableModel.lazy) {
      this.filters[field] = "";
      if(value){
      var dateISO = new Date(value);
      var getDate = new Date(dateISO).getDate();
      var getMonth = new Date(dateISO).getMonth();
      var getFullYear = new Date(dateISO).getFullYear();      
      this.filters[field] =
      {
        from:value? new Date(
          getFullYear,
          getMonth,
          getDate,
          0,
          0,
          0
        ).toISOString():null,
        to: this.filters.reviewDtTo =value? new Date(
          getFullYear,
          getMonth,
          getDate,
          23,
          59,
          59
        ).toISOString():null
      }

      }       
    } else {
      this.filters[field] = value;
    }

    let tableFilter = { globalFilter: this.keywordSearch, localFilters: this.filters, filtersColumns: this.filterColumnValues, pagination: null }
    if (this.tableModel.storageFilterKey)
      this.storageService.set(this.tableModel.storageFilterKey, tableFilter, true);

    if (this.tableModel.lazy) {
      this.firstIndex = 0;
      this.search(this.sortObject);

    } else {
      let typeFilter = CONTAINS_FILTER;
      if (value != null && (type == EclColumn.DATE || type == EclColumn.DATE_TIME_ZONE)) {
        switch (type) {
          case EclColumn.DATE:
            typeFilter = CUSTOM_DATE_FILTER;
            break;
            case  EclColumn.DATE_TIME_ZONE:          
            typeFilter = CUSTOM_DATE_FILTER_STRING;   
            if(value){      
            var date = new Date(value);
            var getDate = new Date(date).getDate();
            var getMonth = new Date(date).getMonth();
            var getYear = new Date(date).getFullYear();
            var getCustomDate= getDate<10?`0${getDate}`:getDate;
            var getCustomMonth= getMonth<10?`0${getMonth+1}`:getMonth+1;              
            value = `${getCustomMonth}/${getCustomDate}/${getYear}`
            }
          break;
        }
      }
      this.eclTable.filter(value, field, typeFilter)
    }
  }


  /**
   * Filter data by global filter
   * @param value entered in input text
   */
  filterGlobalData(event) {

    this.clearFilters();    

    if (this.tableModel.lazy) {

      this.firstIndex = 0;
      this.search(this.sortObject);

    } else {
      let tableFilter = { globalFilter: this.keywordSearch, localFilters: this.filters, filtersColumns: this.filterColumnValues, pagination: null }
      if (this.tableModel.storageFilterKey)
        this.storageService.set(this.tableModel.storageFilterKey, tableFilter, true);
      this.eclTable.filterGlobal(this.keywordSearch, CONTAINS_FILTER);
    }

    if(this.tableModel.checkBoxRestriction) {
      this.selectAllRows(false);
    }
  }

  /**
   * Search information in backend
   */
  search(sorting = null) {
    if (!this.tableModel.url) {
      return;
    }
    //Filters, keywords, sorting, pagination
    this.onServiceCall.emit({ action: Constants.ECL_TABLE_START_SERVICE_CALL });
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
    if (this.tableModel.lazy) {
      request[FILTERING_PARAM] = realFilters;
    } else {
      request[FILTERING_PARAM] = [];
    }

    this.loading = true;
    let tableFilter = { globalFilter: this.keywordSearch, localFilters: this.filters, filtersColumns: this.filterColumnValues, pagination: request[PAGINATION_PARAM] }
    if (this.tableModel.storageFilterKey)
      this.storageService.set(this.tableModel.storageFilterKey, tableFilter, true);

    if (this.tableModel.cacheService) {
      this.cacheRequestDto = new CacheRequestDto();
      this.cacheRequestDto.cacheRequstList = this.tableModel.cacheRequest;
      request[CRITERIA_FILTERS] = this.cacheRequestDto;
      // If we recieve from the consumer extra body parameters we add them to the body property.
      if (this.tableModel.extraBodyKeys) {
        request = { tableOptions: { ...request }, ...this.tableModel.extraBodyKeys };
      }
      this.service.getCacheData(this.tableModel.url, request, this.tableModel.columns).subscribe((response: any) => {
        if (this.tableModel.lazy) {
          this.totalRecords = response.data.totalRecords;
        } else {
          this.totalRecords = response.data.dtoList.length;
        }
        this.value = response.data.dtoList;
        let preSelection = this.setPreSelection(this.value)
        this.loading = false;
        this.onServiceCall.emit({ action: Constants.ECL_TABLE_END_SERVICE_CALL });
        this.selectedRecords = [...preSelection];
        this.parseDates();
        this.restoreNoLazyFilters();
      }, error => {
        this.loading = false;
      });
    } else {
      request[CRITERIA_FILTERS] = this.tableModel.criteriaFilters;
      // If we recieve from the consumer extra body parameters we add them to the body property.
      if (this.tableModel.extraBodyKeys) {
        request = { tableOptions: { ...request }, ...this.tableModel.extraBodyKeys };
      }
      this.service.getData(this.tableModel.url, request, this.tableModel.isFullURL, this.tableModel.columns).subscribe((response: BaseResponse) => {

        if (this.tableModel.lazy) {
          this.totalRecords = response.data.totalRecords;
        } else {
          this.totalRecords = response.data.dtoList.length;
        }
        this.value = response.data.dtoList;
        let preSelection = this.setPreSelection(this.value)
        this.loading = false;
        this.onServiceCall.emit({ action: Constants.ECL_TABLE_END_SERVICE_CALL });
        this.columnMappings = response.data.columnMappings;
        this.selectedRecords = [...preSelection];
        this.parseDates();
        this.restoreNoLazyFilters();
      }, error => {
        this.loading = false;
      });
    }
  }

  /**
   * For no lazy tables, dates change to a locale and pipe this date must be in the table instead of the server's response
   */
  parseDates() {
    this.value = this.value.map(row => {
      const dateCols = this.tableModel.columns.filter(row => row.filterType === EclColumn.DATE_TEXT);
      dateCols.forEach(col => {
        const pipe = col.pipeName == null || col.pipeFormat == null ? 'MM/dd/yyyy' : col.pipeFormat;
        row[col.field] = this.datePipe.transform(row[col.field], pipe, this.locale)
      })
      return row;
    })
  }
  /**
   * after data retrieval, reset filters for no lazy calls
   */
  restoreNoLazyFilters() {
    if (!this.tableModel.lazy && this.keywordSearch) {
      this.eclTable.filterGlobal(this.keywordSearch, CONTAINS_FILTER)
    } else {
      if (!this.tableModel.lazy && this.filtersColumns) {
        Object.keys(this.filtersColumns).forEach(key => {
          const value = this.filtersColumns[key];
          if (value !== "") {
            this.noDebounceFilter(value, key);
          }
        })
      }
    }
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
    if (name.includes('?')) {
      parts = name.split('?')
    }
    return this.getName(parts);
  }


  getName(parts: string[]) {
    let p: string = '';
    if (parts.length > 1) {
      parts.forEach((part: string, index: number) => {

        if (index > 0) {
          p += part + '.';
        }
      });
      p = p.slice(0, -1);
    } else {
      p = JSON.parse(JSON.stringify(parts)).pop();
    }
    return p;
  }

  splitDataColumnAsList(data, field, partOfData = "") {
    let value = data;
    let midRuleData = [];
    let array = field.split('?');
    const midRules = array[0];
    if (value.hasOwnProperty(midRules) && value[midRules] instanceof Array) {
      let values = value[midRules];
      let key = array[1];
      if (partOfData === 'integer') {
        midRuleData = values
          .filter(mr => Object.keys(mr).length > 0)
          .map(mr => Math.floor(mr[key]) || "");
      } else if (partOfData === 'decimal') {
        midRuleData = values
          .filter(mr => Object.keys(mr).length > 0)
          .map(mr => mr[key].split('.')[1] || "");
      } else {
        midRuleData = values
          .filter(mr => Object.keys(mr).length > 0)
          .map(mr => mr[key] || "");
      }
    }
    return midRuleData;
  }

  splitAttributes(data, field, col = null, truncValue=true) {
    let value = data;
    let array = field.split('.');
    array.forEach(item => {
      if (value[item] === undefined) {
        value = ""
      } else {
        value = value[item];
      }
    });

    if (this.isDate(value)) {
      value = this.parseDate(value);
    }
    if (col && col.columnType === "text") {

      if(Array.isArray(value)) {
        value = value.toString();
      }
      let maxLength = truncValue ? col.maxLength : 0;
      value  = this.util.getSlicedXmlValue(value, maxLength);
    }

    // In case we have added or deleted markups we transform them into a valid styled html element.
    // value = this.util.getElementWithMarkups(this.getSlicedValue(value, col));
    return value == null || value == undefined ? '' : value;
  }


  /**
   * REturns the value without markups to check the size.
   * @param data to be validated
   * @param field to be validated
   */
  checkInnerValueSize(data, field) {
    let value = data;
    let array = field.split('.');
    array.forEach(item => {
      if (value[item] === undefined) {
        value = ""
      } else {
        value = value[item];
      }
    });

    if (this.isDate(value)) {
      value = this.parseDate(value);
    }

     value  = this.util.onlyRemoveMarkups(value);
    return value == null || value == undefined ? '' : value;
  }

 /**
  * Returns the sliced value.
  * @param value to be sliced
  * @param col to check if we have to slice
  */
  getSlicedValue(value, col) {
    if ((col && col.maxLength > 0 && col.columnType === this.templateColumnsConstant.TEXT)) {
      let removedMarkupsValue: string = this.util.onlyRemoveMarkups(value);
      if (removedMarkupsValue.length > col.maxLength) {
        const isDeleted = value.includes('<deleted>');
        const isAdded = value.includes('<added>');

        removedMarkupsValue = `${this.slicePipe.transform(removedMarkupsValue, 0, col.maxLength)}...`;
        let addedContent = '';
        let deletedContent = '';
        let noAddedDeletedContent = '';


        if (isDeleted || isAdded) {
          if (isDeleted) {
            deletedContent = `<deleted>${removedMarkupsValue}</deleted>`;
          }
          if (isAdded) {
            addedContent += `<added>${removedMarkupsValue}</added>`;
          }
        } else {
          noAddedDeletedContent = removedMarkupsValue;
        }

        value = `${addedContent}${deletedContent}${noAddedDeletedContent}`;
      }
    }

    return value;
  }

  isDate(value: string): boolean {
    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value);
  }

  /**
   * Refresh grid data when clear filters
   */
  resetDataTable(reloadData: boolean = true) {

    if(this.tableModel.storageFilterKey) {
      this.storageService.remove(this.tableModel.storageFilterKey);
    }

    this.firstIndex = 0;
    this.keywordSearch = '';
    this.clearFilters();
    this.savedSelRecords = [];

    this.checkedRestriction = false;
    this.selectAllRows(false);

    if(reloadData) {
      if (this.tableModel.lazy) {
        this.search(this.sortObject);
      } else {
        this.eclTable.filterGlobal(this.keywordSearch, CONTAINS_FILTER);
      }
    }
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
   * ExportData function will grab information and do the null checking
   * @param type determines if Excel or Print
   */
  exportData(type: string = '', columnValues: any[] = [], column?: string) {

    //TODO PUT LOADING HERE
    this.loadingText = MESSAGE_EXPORTING;

    let source = this.eclTable.value,
      filter = this.eclTable.filteredValue,
      select = this.savedSelRecords,
      trimPageTitle = this.tableModel.excelFileName.replace(/\s/g, '');

    if (this.tableModel.asyncDownload) {
      const asyncDetails = {
        fileName: this.tableModel.asyncFileDetails.fileName,
        processCode: this.tableModel.asyncFileDetails.processCode,
        type,
        extraDetails: { ... this.tableModel.asyncFileDetails.extraDetails }
      };

      if (this.nullCheck(source)) {
        if (asyncDetails.fileName && asyncDetails.processCode) {
          this.checkSourceValuesAsync(source, filter, select, asyncDetails);
        }
      }
    } else if (this.nullCheck(source)) {

      this.checkSourceValues(source, filter, select).then((response: any) => {

        if (columnValues.length > 0) {
          this.customColumnValues(response, columnValues, column);
        }

        if (type == EXCEL_LABEL) {
          this.excelService.exportAsExcelFile(response, trimPageTitle, this.exportableColumns, this.exportableColumns);
        } else {

          response = this.parseColumns(response);

          var exportColumns: any[];
          exportColumns = this.exportableColumns.map(col => ({ title: col.header, dataKey: col.field }));

          let doc = new jsPDF('l', 'pt');
          doc.autoTable(exportColumns, response, {
            headStyles: {
              fillColor: Constants.AVAILABLE_COLORS[0]
            }
          });

          doc.save(this.tableModel.excelFileName + '.pdf');
        }
        this.loadingText = '';
      });
    } else {
      this.toast.messageWarning(TITLE_EMPTY, MESSAGE_EMPTY, 3000, false);
      this.loadingText = '';
    }

  }

  /**
  * This method is used by the trash button in toolBar
  */
  deleteSelection() {
    this.onTrashButtonCall.emit(this.selectedRecords);
  }

  /**
   * This method is used by the recovery button in toolBar.
   */
  onRecoveryIcon() {
    this.onRecoveryButtonCall.emit(this.selectedRecords);
  }

  private parseColumns(response: any): any {
    response.forEach((value: any, index: number) => {
      this.exportableColumns.forEach((column: any) => {
        let fieldValue = this.splitAttributes(value, column.field);
        if (column.field.toString().includes('.')) {
          response[index][column.field] = fieldValue;
        } else if (column.columnType === "date") {
          response[index][column.field] = this.parseDate(fieldValue);
        }
      });
    });
    return response;
  }

  /**
   * Checking and override of 'source'
   * @param source Main Data.
   * @param filter Override source if exist.
   * @param select Override both 'source' & 'filter' if exist.
   */
  private checkSourceValues(source, filter, select) {
    return new Promise((resolve) => {
      this.nullCheck(filter) ? source = filter : source;
      this.nullCheck(select) ? source = select : source;

      let request = {};
      if (this.tableModel.lazy && select.length <= 0) {

        request = this.setColumnOptions(request);

        request[PAGINATION_PARAM] = null;

        request[GLOBAL_FILTER_PARAM] = this.keywordSearch.toString().trim() == '' ? null : this.keywordSearch;
        if (this.sortObject != null) {
          request = this.setSortOptions(request);
        } else {
          request[SORTING_PARAM] = [];
        }
        request[FILTERING_PARAM] = this.getColumnFilters();
        request[CRITERIA_FILTERS] = this.tableModel.criteriaFilters;

        // If we recieve from the consumer extra body parameters we add them to the body property.
        if (this.tableModel.extraBodyKeys) {
          request = { tableOptions: { ...request }, ...this.tableModel.extraBodyKeys };
        }

        if (this.tableModel.cacheService) {
          this.cacheRequestDto = new CacheRequestDto();
          this.cacheRequestDto.cacheRequstList = this.tableModel.cacheRequest;
          request[CRITERIA_FILTERS] = this.cacheRequestDto;
          this.service.getCacheData(this.tableModel.url, request, this.tableModel.columns).subscribe((response: any) => {
            resolve(response.data.dtoList);
          });
        } else {
          this.service.getData(this.tableModel.url, request, this.tableModel.isFullURL, this.tableModel.columns).subscribe((response: BaseResponse) => {
            resolve(response.data.dtoList);
          });
        }

      } else {
        resolve(source);
      }
    });
  }

  private checkSourceValuesAsync(source, filter, select, asyncDetails: any) {
    this.nullCheck(filter) ? source = filter : source;
    this.nullCheck(select) ? source = select : source;

    let request = {};
    if (this.tableModel.lazy) {

      // request = this.setColumnOptions(request);

      request[PAGINATION_PARAM] = null;

      request[GLOBAL_FILTER_PARAM] = this.keywordSearch.toString().trim() == '' ? null : this.keywordSearch;
      if (this.sortObject != null) {
        request = this.setSortOptions(request);
      } else {
        request[SORTING_PARAM] = [];
      }
      request[FILTERING_PARAM] = this.getColumnFilters();

      if (this.tableModel.criteriaFilters) {
        request[CRITERIA_FILTERS] = this.tableModel.criteriaFilters;
      }

      // If we recieve from the consumer extra body parameters we add them to the body property.
      if (this.tableModel.extraBodyKeys) {
        request = { tableOptions: { ...request }, ...this.tableModel.extraBodyKeys };
      }

      let columnFields: any[] = [];
      this.exportableColumns.forEach(col => columnFields.push({ field: col.field, header: col.header }));

      const requestData = {
        fileName: `${asyncDetails.fileName}${asyncDetails.type == EXCEL_LABEL ? '.csv' : '.pdf'}`,
        processCode: asyncDetails.processCode,
        serviceParams: { ...request },
        columns: columnFields,
        extraDetails: asyncDetails.extraDetails
      }

      this.service.createAsyncFile(requestData).subscribe((response: any) => {
        this.loadingText = '';
        if (response.code == 200) {
          this.toast.messageSuccess(Constants.CONFIRMATION_WORD, Constants.FILE_INBOX_MESSAGE);
        } else {
          this.toast.messageError('Error', 'Error processing XLSX file, please try again.');
        }
      });
    }
  }

  private nullCheck(array) {
    return (array !== undefined && array !== null && array.length > 0 && Object.keys(array[0]).length > 0)
  }

  /**
   * When user moves mouse over a column
   * @param row
   * @param field
   */
  onHoverTableColumn(row: any, field: string, event: any, overlaypanel: OverlayPanel) {
    let value = this.splitAttributes(row, field)
    if(value.length > 1 || typeof value !== 'string'){
      this.onHoverColumn.emit({ row: row, field: field, overlayEvent: event, overlaypanel: overlaypanel });
    }
  }

  /**
   * When user select a row with checkbox
   * @param event
   */
  onRowSelect(event) {
    if (this.tableModel.selectionMode === 'single') {
      this.onSelectRecord.emit(this.selectedRecords);
    } else {
      this.saveRecords(event.data);
      this.onSelectRecord.emit(this.savedSelRecords);
    }
  }

  /**
   * When user unselect a row with checkbox
   * @param event
   */
  onRowUnselect(event) {
    if (this.tableModel.selectionMode === 'single') {
      this.onUnSelectRecord.emit(this.selectedRecords);
    } else {
      this.removeRecords(event.data)
      this.onUnSelectRecord.emit(this.savedSelRecords);
    }
  }

  /**
   * When user toggles the header select all checkbox
   * @param event
   */
  selectAllToggle(event) {
    if (event.checked) {
      this.value.forEach(row => {
        this.saveRecords(row);
      });
      this.onSelectRecord.emit(this.savedSelRecords);
    } else {
      this.savedSelRecords = [];
      this.onUnSelectRecord.emit(this.savedSelRecords);
    }
  }

  onAcctionLinkFu(row, field) {
    this.onAcctionLink.emit({ row: row, field: field });

  }
  onAcctionIconFu(row, field) {
    this.onAcctionIcon.emit({ row: row, field: field });
  }

  onAcctionButtonFu(row, field) {
    this.onAcctionButton.emit({ row: row, field: field });
  }

  onActionCheck(row, event, col) {
    if (col.controlCheckColumn > 0) {
      if (this.dataColumnCheck.length >= 2) {
        if (row[col.checked]) {
          let rowSearch = this.dataColumnCheck[1]
          rowSearch[col.checked] = false;
          this.dataColumnCheck = this.dataColumnCheck.filter(t => t !== rowSearch)
          let rowOne = this.dataColumnCheck[0]
          this.dataColumnCheck = this.dataColumnCheck.filter(t => t !== rowOne)
          this.dataColumnCheck.push(row)
          this.dataColumnCheck.push(rowOne)
        } else {
          this.dataColumnCheck = this.dataColumnCheck.filter(t => t !== row)
        }
      } else {
        if (row[col.checked]) {
          this.dataColumnCheck.push(row);
        } else {
          this.dataColumnCheck = this.dataColumnCheck.filter(t => t !== row)
        }
      }
    }
    this.onActionCheckChild.emit({ row: row, event: event })
  }

  onActionMultiLineLink(item, row) {
    this.onActionMultiLineLinkChild.emit({ event: item, row: row });
  }

  onSwitchChange(event, row) {
    this.onActionSwitchChange.emit({ event, midRow: row });
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


  getDrugVersionId(version) {
    return getDrugVersionId(version)
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

  /**
   * Check whether icon needs to be shown next to the link
   * @param data
   * @param textIconField
   */

  showLinkIcon(data: any, textIconField: any) {
    if (data[textIconField] === undefined)
      return false;
    else
      return data[textIconField];
  }

  /**
   * Return the style in base of some conditions
   * @param data
   * @param col
   */
  getStyle(data: any, col: EclColumn) {

    if (col.styles != null && col.styles.length > 0) {

      let styleCss = {};

      col.styles.forEach((style: EclColumnStyles) => {
        switch (style.condition.operator) {
          case '=':
            if (data[style.condition.field] == style.condition.value) {
              styleCss = style.css;
            }
            break;
          case '>':
            if (data[style.condition.field] > style.condition.value) {
              styleCss = style.css;
            }
            break;
          case '<':
            if (data[style.condition.field] < style.condition.value) {
              styleCss = style.css;
            }
            break;
        }
      });

      return styleCss;
    }

    return {};
  }

  /**
   * Return the text in base of some conditions.
   * @param rowData -  rowData.
   * @param eclButtonTable - ecl button table.
   */
  getTextWithCondition(rowData: any, eclButtonTable: EclButtonTable) {
    let outPutText = rowData[eclButtonTable.text];
    let conditions : EclButtonTableCondition[] = eclButtonTable.conditions;
    if (conditions) {
      conditions.forEach((eclButtonTableCondition: EclButtonTableCondition) => {
        switch (eclButtonTableCondition.operator) {
          case Constants.EQUAL_OPERATOR:
            if (rowData[eclButtonTable.text] === eclButtonTableCondition.value) {
              outPutText = eclButtonTableCondition.outputText;
            }
            break;
          default:
        }
      });
    }
    return outPutText;
  }

  getRangeDate(col) {
    return col.dateRange ? col.dateRange :  this.yearValidRangeEft;
  }

  getMaxDate(col) {
    return col.maxDate ? col.maxDate : null;
  }

  selectComments(event, data, overlaypanel: OverlayPanel, col) {
    
    this.commentToAdd = '';
    this.loadedComments = data[col.field];
    this.moduleIdComments = data[col.commentsConfig.fieldId];
    this.columnConfig = col;

    setTimeout(() => {
      this.displayComments = true;
    }, 50);

    overlaypanel.toggle(event);
    
  }

  getCommentsText(data, col) {

    if (data == null || data == undefined) {
      return '';
    }

    let text = '';
    
    if(data[col.field].length > 0) {
      text = data[col.field][0][col.commentsConfig.inputColumn];
    }

    return text;
  }

  addComment() {

    if(this.commentToAdd.trim() == '') {
      return;
    }

    this.service.addComment(this.columnConfig.commentsConfig.urlAdd, {
      'eclId': this.moduleIdComments,
      'comments': this.commentToAdd
    }).subscribe((response: BaseResponse) => {
      this.toast.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Comment was added successfully.');      

      this.refreshComments();      

      this.commentToAdd = '';
    });
  }

  refreshComments() {
    this.value.forEach(item => {
      if(item[this.columnConfig.commentsConfig.fieldId] == this.moduleIdComments) {
        this.service.getComments(this.columnConfig.commentsConfig.urlGet.replace('{id}', this.moduleIdComments)).subscribe((responseGet: BaseResponse) => {
          item[this.columnConfig.field] = responseGet.data;
          this.loadedComments = responseGet.data;
        });          
      }
    });
  }

  removeComment(commentObject, index) {
    //call service to remove comment in base of id
    this.service.removeComment(this.columnConfig.commentsConfig.urlRemove.replace('{id}', commentObject[this.columnConfig.commentsConfig.removeFieldId])).subscribe((response) => {
      this.refreshComments();
      this.toast.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Comment deleted successfully.');
    });
  }

  selectAllRows(checked) {
    this.checkedRestriction = checked;
    
    if(checked) {
      this.selectedRecords = this.value.filter(value => !value.checkBoxDisabled);
      this.onSelectRecord.emit(this.selectedRecords);
    } else {
      this.selectedRecords = [];
      this.savedSelRecords = [];
      this.onUnSelectRecord.emit(this.selectedRecords);
    }
  }
}
