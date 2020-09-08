import { Component, OnInit, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { Constants } from 'src/app/shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { DialogService } from 'primeng/api';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { MetadataCacheService } from 'src/app/services/metadata-cache.service';
import { MetaTagDto } from 'src/app/shared/models/dto/metaTag-dto';
import { FilterDto } from 'src/app/shared/models/dto/filter-dto';
import { EclCacheLbvSearchDto } from 'src/app/shared/models/dto/ecl-cache-lbv-search-dto';
import { FilterTagSequenceDto } from 'src/app/shared/models/dto/filter-tag-sequence-dto';
import { TagSequenceDto } from 'src/app/shared/models/dto/tag-sequence-dto';
import { ConfirmationService } from 'primeng/api';
import * as _ from 'underscore';
import { UpdateFilterTagComponent } from 'src/app/shared/components/update-filter-tag/update-filter-tag.component';
import { StorageService } from 'src/app/services/storage.service';
import { EmailReport } from '../ecl-rules-catalogue/email-report/email-report.component';
import { TagDto } from 'src/app/shared/models/dto/tag-dto';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { UtilsService } from 'src/app/services/utils.service';

const enum SUBJECT {
  category = 'category',
  lob = 'lob', state = 'state', jurisdiction = 'jurisdiction', icd_desc = 'icd_desc', icd = 'icd',
  cpt_desc = 'cpt_desc', cpt = 'cpt', hcpcs_desc = 'hcpcs_desc', hcpcs = 'hcpcs',
  hcpcs_proc_type = 'hcpcs_proc_type', cpt_proc_type = 'cpt_proc_type'
};

const SUCESS_UPDATE = 'Successfully Updated.';
const SUCCESS_DELETE = 'Successfully Deleted.';
const CONFIRM_DELETE_FILTER = 'Are you sure you want to delete Filter : ';
const CONFIRM_DELETE_TAG = 'Filters associated only to this tag will be removed. Are you sure you want to delete Tag : ';
const ERROR_DELETE = 'Error in Deletion.';
const REPORT_SUCCESS = 'Report Generated Successfully.';
const SELECT_TAG_MSG = 'Choose a tag to send email.';
const REPORT_NO_RECORDS = 'Tag has no filters associated with, to generate report';

@Component({
  selector: 'app-tagfilter-management',
  templateUrl: './tagfilter-management.component.html',
  styleUrls: ['./tagfilter-management.component.css'],
  providers: [ConfirmationService]
})
export class TagfilterManagementComponent implements OnInit {


  @ViewChild('tableResults') tableResults: EclTableComponent;

  blockedDocument: boolean = false;

  tableConfig: EclTableModel = null;

  userId: number;
  selectedTag: MetaTagDto = null;
  tagDPList: any[] = [];
  selectedFilter: FilterDto = null;
  filterDPList: any[] = [];
  selectedTagSeq: TagSequenceDto = null;
  tagSeqList: any[] = [];
  conditionString: string;
  expDate: string = '';
  createdScreen: string;
  disableEdit: boolean = true;
  disableDelete: boolean = true;
  disableEmail: boolean = true;
  disableExport: boolean = true;
  disableExtend: boolean = true;
  filterTagSeqList: FilterTagSequenceDto[] = [];
  filterList: FilterDto[] = [];
  tagList: MetaTagDto[] = [];

  constructor(private utils: AppUtils, private metadataCacheService: MetadataCacheService,
    private dialogService: DialogService,
    private toastService: ToastMessageService,
    private confirmationService: ConfirmationService, 
    private storageService: StorageService, private utilsService: UtilsService) { }

  ngOnInit() {

    this.userId = this.utils.getLoggedUserId();
    this.utilsService.getCacheUrl().subscribe((response: any) => {
      Constants.redisCacheUrl = response.data;
      this.loadAllTags();
      this.loadAllFilters();
    });
    this.tableResults.hasPreviousFilter = false;
    this.initiateTableModel();
    this.tableResults.totalRecords = 0;
    this.tableResults.loading = false;
    this.tableResults.value = [{},{},{},{},{}];
  }

  ngOnDestroy() {
    if (!this.storageService.exists(Constants.PARENT_NAVIGATION)) {
      if (this.tableConfig.storageFilterKey)
        this.storageService.remove(this.tableConfig.storageFilterKey);
    }
  }

  loadAllTags() {
    this.resetTag();
    return new Promise(resolve => {
      this.metadataCacheService.getTagsbyUserId(this.userId).subscribe((tags: MetaTagDto[]) => {
        this.tagList = tags;
        tags.forEach((tag: MetaTagDto) => this.tagDPList.push({ label: tag.tagName, value: tag }));
        resolve();
      });
    });
  }

  loadAllFilters() {
    return new Promise(resolve => {
      this.filterDPList = [];
      this.filterList = [];
      this.selectedFilter = null;
      this.metadataCacheService.getFiltersbyUserId(this.userId).subscribe((response: any) => {
        if (response != undefined && response.data != undefined) {
          this.filterList = response.data;
          this.filterList.forEach((filter: FilterDto) => this.filterDPList.push({ label: filter.filterName, value: filter }));
          resolve();
        }
      });
    });
  }

  loadFilterbyTagId(fromDropdown : boolean) {
    return new Promise(resolve => {
      this.resetFilter();
      if (this.selectedTag != null) {
        if (fromDropdown) {
          this.displayTable();
        }
        this.expDate = this.selectedTag.tagExpiryDate;
        this.disableExtend = false;
        this.disableEdit = false;
        this.disableDelete = false;
        this.metadataCacheService.getFilterTagseqbyTag(this.selectedTag.tagId).subscribe((response: any) => {
          if (null != response && typeof response.associatedFilterTagSequences != undefined
            && response.associatedFilterTagSequences.length > 0) {
            this.filterTagSeqList = response.associatedFilterTagSequences;
            this.filterTagSeqList.forEach((item: FilterTagSequenceDto) => {
              this.filterList.push(item.filterDto);
              this.filterDPList.push({ label: item.filterDto.filterName, value: item.filterDto });
              this.tagSeqList.push({ label: item.tagSequenceDto.tagSequenceId, value: item.tagSequenceDto });
              this.disableExport = false;
              this.disableEmail = false;
              resolve();
            });
          } else {
           resolve();
          }
          
        });
      }
    });
  }

  showTagSeqInfo() {
    if (this.selectedTag != null && this.selectedTagSeq != null) {
      this.selectedFilter = this.filterTagSeqList.find(i => i.tagSequenceDto.tagSequenceId == this.selectedTagSeq.tagSequenceId).filterDto;
      this.showFilterInfo(false);
    }
  }

  showFilterInfo(fromFilter: boolean) {
    this.createdScreen = '';
    if (this.selectedFilter != null) {
      if (this.selectedTag != null)  {
        this.displayTable();
      }
      this.getValuesfromFilterDto(this.selectedFilter.filterCondition);
      this.createdScreen = this.selectedFilter.screenName;

      if (this.selectedTag != null) {
        if (fromFilter) {
          this.selectedTagSeq = this.filterTagSeqList.find(i => i.filterDto.filterId == this.selectedFilter.filterId).tagSequenceDto;
        }
        this.disableEdit = false; // enable edit as tag is selected
      } else {
        this.disableEdit = !this.selectedFilter.isEditDeleteAllowed;
      }
      this.disableDelete = !this.selectedFilter.isEditDeleteAllowed;
    }
  }

  extendExpiry() {
    this.metadataCacheService.getTagExpExtend(this.selectedTag.tagId).subscribe((response: any) => {
      if (null != response && null != response.data) {
        this.expDate = response.data.tagExpiryDate;
      }
    });
  }

  updateData() {
    if (this.selectedFilter != null || this.selectedTag != null) {
      const ref = this.dialogService.open(UpdateFilterTagComponent, {
        data: {
          filter: this.selectedFilter,
          tag: this.selectedTag
        },
        header: 'Edit Tag/Filter',
        closable: false,
        closeOnEscape: false
      });
      ref.onClose.subscribe((returnValue: any) => {
        if (typeof returnValue !== undefined && returnValue) {
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, SUCESS_UPDATE, 2000, true);
          this.repopulateDropdown(true);
        }
      });
    }
  }

  deleteData() {
    let msg = '';
    let sucMsg = '';
    if (this.selectedFilter != null) {
      msg = CONFIRM_DELETE_FILTER + this.selectedFilter.filterName + '?';
      sucMsg = 'Filter ' + SUCCESS_DELETE;
    }
    if (this.selectedTag != null && this.selectedFilter == null) {
      msg = CONFIRM_DELETE_TAG + this.selectedTag.tagName + '?';
      sucMsg = 'Tag ' + SUCCESS_DELETE;
    }

    if (this.selectedTag != null || this.selectedFilter != null) {
      this.confirmationService.confirm({
        message: msg,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        key:'filterTagDelete',
        accept: () => {
          let delinfo: TagDto = new TagDto();
          if (null != this.selectedTag)
            delinfo.tagId = this.selectedTag.tagId;
          else
            delinfo.tagId = null;
          if (null != this.selectedFilter)
            delinfo.filterId = this.selectedFilter.filterId;
          else
            delinfo.filterId = null;
          this.metadataCacheService.deleteTagFilter(delinfo).subscribe((response: any) => {
            this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, sucMsg, 2000, true);
            this.repopulateDropdown(false);
          }, (err) => {
            this.toastService.messageError('Error!', ERROR_DELETE);
          });

        }
      });
    }
  }

  repopulateDropdown(isEdit: boolean) {
    let prevFilter = _.clone(this.selectedFilter);
    let prevTag = _.clone(this.selectedTag);
    this.blockedDocument = true;
    if (this.selectedTag !== null && this.selectedFilter !== null) {
      if (isEdit) { //Update
        this.loadAllTags().then(() => {
          this.selectedTag = this.tagList.find(x => x.tagId === prevTag.tagId);
          this.loadFilterbyTagId(false).then(() => {
            this.selectedFilter = this.filterList.find(x => x.filterId === prevFilter.filterId);
            this.showFilterInfo(true);            
          this.blockedDocument = false;  
          });
        });
      } else { // Delete
        this.loadFilterbyTagId(false).then(() => {
          this.displayTable();          
          this.blockedDocument = false;  
        });
      }
    } else if (this.selectedTag == null && this.selectedFilter != null) {
      this.resetFilter();
      this.loadAllFilters().then(() => {
        if (isEdit) {
          this.selectedFilter = this.filterList.find(x => x.filterId === prevFilter.filterId);
          this.showFilterInfo(true);
        } else {
          this.disableEdit = true;
          this.disableDelete = true;
        }
        this.blockedDocument = false;  
      });
    } else if (this.selectedTag !== null && this.selectedFilter == null) {
      this.loadAllTags().then(() => {
        if (isEdit) {
          this.selectedTag = this.tagList.find(x => x.tagId === prevTag.tagId);
          this.loadFilterbyTagId(false).then(() => {         
          this.blockedDocument = false;  
          });
        }  else {
          this.loadAllFilters().then(() => {
            this.tableResults.totalRecords = 0;
            this.tableResults.loading = false;
            this.tableResults.value = [{},{},{},{},{}];
            this.blockedDocument = false;  
          });
        }           
      });      
    }
  }

  private getReportName() {
    let todayDate = new Date();
    let dateLongFormat = (todayDate.getMonth() + 1).toString()
      + " " + todayDate.getDate().toString()
      + " " + todayDate.getFullYear().toString();
    let currentDate = new Date(dateLongFormat).toString().substring(0, 15);
    return this.selectedTag.tagName + "_Report_" + currentDate + ".xlsx";
  }

  generateReport() {
    this.blockedDocument = true;
    this.metadataCacheService.generateTagReport(this.selectedTag.tagId).subscribe((response: any) => {
      if (typeof response != undefined && response) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        let blob = new Blob([response], { type: Constants.FILE_TYPE }), url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = this.getReportName();
        a.click();
        window.URL.revokeObjectURL(url);
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, REPORT_SUCCESS, 2000, true);
      } else {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_WARN, REPORT_NO_RECORDS, 2000, true);
      }
      this.blockedDocument = false;
    }, (err) => { this.blockedDocument = false; });
  }

  sendEmail() {
    if (this.selectedTag != null) {
      this.dialogService.open(EmailReport, {
        header: "EMAIL NOTIFICATION",
        width: '50%',
        data: {
          reportName: this.getReportName(),
          tagId: this.selectedTag.tagId
        },
        closable: false,
        closeOnEscape: false
      });
    } else {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, SELECT_TAG_MSG, 2000, true);
    }
  }

  onServiceCall(ev: any) {
    if (ev.action === Constants.ECL_TABLE_END_SERVICE_CALL) {
      if (this.tableResults.totalRecords == 0) {
      this.tableResults.loading = false;
      this.tableResults.value = [{},{},{},{},{}];
      }
    }
  }

  initiateTableModel() {
    let tableConfig = new EclTableModel();
    // initially tableConfig.url is null to block initial request.
    tableConfig.lazy = true;
    tableConfig.sortOrder = 1;
    tableConfig.showRecords = true;
    tableConfig.paginationSize = 50;
    tableConfig.filterGlobal = false;
    tableConfig.export = false;
    tableConfig.criteriaFilters = this.getJsonRequest();
    this.checkVisibleColumns(tableConfig);
    this.tableConfig = tableConfig;
  }


  resetAll() {    
    this.blockedDocument = true;  
    this.resetTag();
    this.initiateTableModel();
    this.tableResults.clearFilters();
    this.storageService.remove(this.tableConfig.storageFilterKey);
    this.tableResults.initializeFilterColumnValues();
    this.tableResults.keywordSearch = '';
    this.tableResults.totalRecords = 0;
    this.tableConfig.cacheRequest = null;
    this.tableResults.loading = false;
    this.tableResults.value = [{},{},{},{},{}];
    this.loadAllTags();
    this.loadAllFilters().then(()=>{this.blockedDocument=false;}); 
  }

  resetTag() {
    this.disableExtend = true;
    this.disableEdit = true;
    this.disableDelete = true;
    this.disableExport = true;
    this.disableEmail = true;
    this.tagDPList = [];
    this.tagList = [];
    this.selectedTag = null;
    this.resetFilter();
  }

  resetFilter() {
    this.filterDPList = [];
    this.filterList = [];
    this.tagSeqList = [];
    this.selectedFilter = null;
    this.selectedTagSeq = null;
    this.conditionString = '';
    this.createdScreen = '';
    this.expDate = '';
  }

  /**
 * Method is called to build string representaion of the entire condition
 * in filter or to set the dropdown selected values with the values in the 
 * chosen saved filter condition. 
 * @param filterCondition 
 * @param isSavedFilter true for dropdown values; false to construct string 
 * 
 */

  getValuesfromFilterDto(filterCondition) {
    let filterConditionString: string = '';
    let condArray: EclCacheLbvSearchDto[] = JSON.parse(filterCondition);
    this.conditionString = '';
    condArray.forEach((item, index) => {
      switch (item.subject.toLowerCase()) {
        case SUBJECT.lob:
          filterConditionString = this.getConditionListString(SUBJECT.lob, item);
          break;
        case SUBJECT.category:
          filterConditionString = this.getConditionListString(SUBJECT.category, item);
          break;
        case SUBJECT.jurisdiction:
          filterConditionString = this.getConditionListString(SUBJECT.jurisdiction, item);
          break;
        case SUBJECT.state:
          filterConditionString = this.getConditionListString(SUBJECT.state, item);
          break;
        case SUBJECT.cpt_desc:
          filterConditionString = SUBJECT.cpt_desc.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          break;
        case SUBJECT.hcpcs_desc:
          filterConditionString = SUBJECT.hcpcs_desc.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          break;
        case SUBJECT.icd_desc:
          filterConditionString = SUBJECT.icd_desc.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          break;
        case SUBJECT.cpt:
          filterConditionString = SUBJECT.cpt.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          if (typeof item.associateCondition != 'undefined' && item.associateCondition) {
            filterConditionString = filterConditionString + ' AND ' + this.getConditionListString(SUBJECT.cpt_proc_type, item.associateCondition);
          }
          break;
        case SUBJECT.hcpcs:
          filterConditionString = SUBJECT.hcpcs.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          if (typeof item.associateCondition != 'undefined' && item.associateCondition) {
            filterConditionString = filterConditionString + ' AND ' + this.getConditionListString(SUBJECT.hcpcs_proc_type, item.associateCondition);
          }
          break;
        case SUBJECT.icd:
          filterConditionString = SUBJECT.icd.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          break;
      }
      if (index > 0)
        this.conditionString = this.conditionString + ' ' + item.preOperator + ' ' + filterConditionString;
      else
        this.conditionString = filterConditionString;
    });


  }


  getConditionListString(subject, filter) {
    return (subject.toUpperCase() + ' ' + filter.operator + ' (' + filter.value + ')');
  }

  /**
 * Validate which columns needs to be displayed
 */
  checkVisibleColumns(tableConfig) {
    let colManager = new EclTableColumnManager();
    colManager.addTextColumn('ruleCode', 'Rule Code', '20%', false, null, true);
    colManager.addTextColumn('filterName', 'Filter Name', '80%', false, null, true);
    tableConfig.columns = colManager.getColumns();
  }

  displayTable() {
    return new Promise((resolve, reject) => {
      let request: any = this.getJsonRequest();
      this.tableConfig.criteriaFilters = request;

      //Build columns based in request
      this.checkVisibleColumns(this.tableConfig);
      this.tableConfig.cacheService = true;
      this.tableConfig.cacheRequest = [request];

      // set url value:   
      this.tableConfig.url = RoutingConstants.METADATA + '/' + RoutingConstants.METADATA_TAG + '/' + RoutingConstants.METADATA_TAG_RULES;

      this.tableResults.clearFilters();
      this.tableResults.totalRecords = 0;
      this.tableResults.loadData(null);
      resolve();
    });
  }

  getJsonRequest() {
    let json = {};
    json["tagId"] = this.selectedTag !== null ? this.selectedTag.tagId : null;
    json["filterId"] = this.selectedFilter !== null ? this.selectedFilter.filterId : null;
    return json;
  }

}
