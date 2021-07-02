import { EclToolBar } from './ecl-tool-bar';
import { EclColumn } from './ecl-column';
import { EclAsyncFileDetails } from './ecl-async-file-details';

export class EclTableModel {

    filterGlobal: boolean;
    sort: boolean;
    sortBy: string;
    sortOrder: number;
    dataKey: string;
    checkBoxSelection: boolean;
    checkBoxRestriction: boolean;
    export: boolean;
    toolBar : EclToolBar;
    url: string;
    isFullURL: boolean;
    lazy: boolean;
    showRecords: boolean;
    showPaginator: boolean;
    showPaginatorOptions: boolean;
    paginationSize: number;
    columns: EclColumn[];
    frozenColumns: EclColumn[];
    excelFileName: string;
    exportReferences: boolean;
    scrollable: boolean;
    horizontalScrollable: boolean;
    verticalScrollable: boolean;
    scrollHeight: string;
    criteriaFilters:any;
    data: any;
    extraBodyKeys: any;
    storageFilterKey:string;
    cacheRequest : any[];
    cacheService : boolean;
    asyncDownload: boolean;
    asyncFileDetails: EclAsyncFileDetails;
    spinner : boolean;
    endpointType: string;
    checkBoxSelectAll: boolean;
    customSort: boolean;
    selectionMode: string;
    
    constructor() {
        this.filterGlobal = true;
        this.sort = true;
        this.sortOrder = 1;
        this.checkBoxSelection = false;
        this.export = true;
        this.toolBar = null;
        this.lazy = false;
        this.showRecords = true;
        this.paginationSize = 10;
        this.exportReferences = false;
        this.showPaginator = true;
        this.showPaginatorOptions = true;
        this.scrollable = false;
        this.horizontalScrollable = false;
        this.verticalScrollable = true;
        this.scrollHeight = '250px';
        this.isFullURL = false;
        this.criteriaFilters = null;
        this.extraBodyKeys = null;
        this.storageFilterKey = null;
        this.cacheService = false;
        this.asyncDownload = false;
        this.asyncFileDetails = null;
        this.spinner = true;
        this.endpointType = null;
        this.checkBoxSelectAll = false;
        this.customSort = false;
        this.selectionMode = '';
        this.checkBoxRestriction = false;
    }
}