import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LibraryViewService } from 'src/app/services/library-view.service';
import { Constants } from 'src/app/shared/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { DialogService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EclCacheLbvSearchDto } from 'src/app/shared/models/dto/ecl-cache-lbv-search-dto';
import { CreateFilterComponent } from 'src/app/shared/components/create-filter/create-filter.component';
import { TagDto } from 'src/app/shared/models/dto/tag-dto';
import { FilterDto } from 'src/app/shared/models/dto/filter-dto';
import { CreateTagComponent } from 'src/app/shared/components/create-tag/create-tag.component';
import { OverlayPanel } from 'primeng/primeng';
import { MetadataCacheService } from 'src/app/services/metadata-cache.service';
import { isNumber } from 'util';
import { FilterTagSequenceDto } from 'src/app/shared/models/dto/filter-tag-sequence-dto';
import { ConfirmationService } from 'primeng/api';
import { UtilsService } from "src/app/services/utils.service";
import { Subject } from 'rxjs';
import { KeyLimitService } from 'src/app/shared/services/utils';
import { FilterTagCompareComponent } from './filter-tag-compare/filter-tag-compare.component';
import { DatePipe } from '@angular/common';
import { CacheRequestDto } from 'src/app/shared/models/dto/cache-request-dto';
import { CompareGridRequestDto } from 'src/app/shared/models/dto/compare-grid-request-dto';
import { EclTableService } from 'src/app/shared/components/ecl-table/service/ecl-table.service';

const FILTER_CONDITION = "FILTER_CONDITION";
const RULE_CATALOG_LAST_REQUEST = "RULE_CATALOG_LAST_REQUEST";
const RULE_CAT_CACHE_LAST_REQUEST = "RULE_CAT_CACHE_LAST_REQUEST";
const DOWNLOAD_FILE_NAME = 'LibraryViewSearch';
const PREVIOUS_SEARCH_FILTERS = 'PREVIOUS_SEARCH_FILTERS';
const ADDITIONAL_SEARCH_HEADER = 'Additional Search Items';
const HIDE_SEARCH_HEADER = 'Hide Additional Search Items';
const IS_TAG_REQUEST = "IS_TAG_REQUEST";
const TAG_TABLE_CONFIG = "TAG_TABLE_CONFIG";
const JSON_TAG_DTO = "JSON_TAG_DTO";
const MATCHED_SPECIALITY_TYPE_LENGTH = 3;
const SPECIALITY_TYPE = 'SPECIALITY_TYPES';
const SUBSPECIALITY_TYPE = 'SUB_SPECIALITY_TYPES';
const MALE = 'Male';
const FEMALE = 'Female';
const BOTH = 'Both';
const SELECT = 'Select Item';
const COMMA_DELIM = ',';
const COMMA_ESCAPE = '%#%';
const SELECTION_PANEL_HEADER = 'Selected Items';
const HIDE_SELECTION_PANEL_HEADER = 'Hide Selected Items';
const ASSOCIATED_TAG_DETAILS = 'ASSOCIATED_TAG_DETAILS';
const IS_VIEW_FLAG = 'IS_VIEW_FLAG';
const ACTIVE_STATUS = 'active';
const COND_STATUS_STR = 'STATUS';
const CALENDAR_DATE_FORMAT = 'MM/dd/yyyy';
const IS_COMPARE_REQUEST = 'IS_COMPARE_REQUEST';
const CRITERIA_FILTERS = 'criteriaFilters';
const COMPARE_TAG_DTO = 'COMPARE_TAG_DTO';

enum SUBJECT {
  category = 'category',
  lob = 'lob', state = 'state', jurisdiction = 'jurisdiction', icd_desc = 'icd_desc', icd = 'icd',
  cpt_desc = 'cpt_desc', cpt = 'cpt', hcpcs_desc = 'hcpcs_desc', hcpcs = 'hcpcs',
  hcpcs_proc_type = 'hcpcs_proc_type', cpt_proc_type = 'cpt_proc_type', keyword = 'keyword',
  reference = 'reference_source', referenceTitle = 'reference_title', revenueCode = 'revenue_code',
  specialty = 'specialty', subspecialty = 'subspecialty', gender = 'gender_ind',
  rule_engine = 'rule_engine', statusActive = 'status', billTypes = 'bill_types',
  placeOfServices = 'place_of_service', logicEffectiveDate = 'rule_logic_eff_dt', globalRanges = 'global_ranges',
  policy_package = 'policy_package'
};

@Component({
  selector: 'app-ecl-rules-catalogue',
  templateUrl: './ecl-rules-catalogue.component.html',
  styleUrls: ['./ecl-rules-catalogue.component.css'],
  providers: [ConfirmationService]
})
export class EclRulesCatalogueComponent implements OnInit, OnDestroy {

  tableConfig: EclTableModel = null;
  eclCacheRequest: any[] = [];
  lbvSearchDto: EclCacheLbvSearchDto = null;
  tagDto: TagDto;
  cacheConstant = SUBJECT;
  additionalSearchPanelHeader: string = ADDITIONAL_SEARCH_HEADER;
  selectionPanelHeader: string = SELECTION_PANEL_HEADER;

  keyword: string = '';
  lobs: any[] = [];
  selectedLobs: any[] = [];
  categories: any[] = [];
  selectedCategories: any[] = [];
  jurisdictions: any[] = [];
  selectedJurisdictions: any[] = [];
  states: any[] = [];
  selectedStates: any[] = [];
  revenueCodes: any[] = [];
  selectedRevCodes: any[] = [];
  specialties: any[] = [];
  selectedSpecialty: any[] = [];
  subSpecialtyFiltered: any[] = [];
  subSpecialties: any[] = [];
  selectedSubSpecialty: any[] = [];
  genders: any[] = [{ label: SELECT, value: 0 },
  { label: MALE, value: 1 },
  { label: FEMALE, value: 2 },
  { label: BOTH, value: 3 }];
  selectedGender: number = 0;

  hcpcsCodeDescInd: string = "0";
  cptCodeDescInd: string = "0";
  icdCodeDescInd: string = "0";
  hcpcsProcCode: string = "";
  hcpcsProcDesc: string = "";
  cptProcCode: string = "";
  cptProcDesc: string = "";
  icdProcCode: string = "";
  icdProcDesc: string = "";
  hcpcProcCodeCats: any[] = [];
  selectedHcpcProcCodeCats: any[] = [];
  cptProcCodeCats: any[] = [];
  selectedCptProcCodeCats: any[] = [];
  icdProcCodeCats: any[] = [];
  selectedIcdProcCodeCats: any[] = [];

  engines: any[] = [];
  notEngines: any[] = [];
  genericEngines: any[] = [];
  selectedEngines: any[] = [];
  placeOfServices: any[] = [];
  selectedPlaceOfService: any[] = [];
  billTypes: any[] = [];
  selectedBillType: any[] = [];
  references: any[] = [];
  selectedReferences: any[] = [];
  procCodeCategories: any[] = [];
  statusActive: boolean = false;
  globalRanges: boolean = false;
  disableGlobalRange: boolean = true;
  referenceDocument: string = "";
  referenceTitle: string = "";
  procedureCode: string = "";
  dateFormat: string = Constants.DATE_FORMAT;
  yearValidRange = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  filters: any[] = [];

  blockedDocument: boolean = false;
  serviceCallsQty: number = 0;
  associatedTagDetails: FilterTagSequenceDto[];
  returnedFilterDto: FilterDto;
  //newly added variables for metadata tagging
  selectedFilterName: any = "";
  filterCondition: string = "";
  selectedTagName: any = ' ';
  selectedTagSequenceId: any = "";

  metaTagArray: TagDto[];
  tagNameArray: String[];
  createNewTagRequest: TagDto = new TagDto();
  customToolTip: string;
  disableSave: boolean = false;
  disableTag: boolean = false;
  disableTagSequence: boolean = false;
  isCompare: boolean = false;

  filterNames: any[] = [
    { label: 'Search or Create a filter', value: ' ' },
    { label: 'Create New Filter', value: 0 },
  ];
  tagNames: any[] = [
    { label: 'Search or Create a Tag', value: ' ' },
    { label: 'Create New Tag', value: 0 },
  ];
  tagSequenceIds: any[] = [
    { label: 'Select', value: 0 }
  ];
  selectedRuleIds: any[] = [];
  selectedData: any[] = [];

  conditionFilters: FilterDto[] = [];
  searchDropdownFilters: any[];
  selectedSavedFilter: any;
  selectedFilter: any;
  selectedFilterNameLabel: any;
  viewFlag: boolean = false;
  createNewFilterFlag: boolean = false;
  escapeRx = /\%#%/gi;

  @ViewChild('tableResults',{static: true}) tableResults: EclTableComponent;
  @ViewChild('compareResult',{static: true}) compareResult: FilterTagCompareComponent;

  disableSubSpecialty: boolean = true;
  isAdditionalSettings: boolean = true;
  showSelectionPanel: boolean = true;
  newFilter: boolean = false;
  compareImg = 'assets/img/compare-icon.png';


  //Key Limiter 
  limitCount: number = 100;
  showCountHcpcsCode: number = this.limitCount;
  showCountCptCode: number = this.limitCount;
  showCountHcpcsDesc: number = this.limitCount;
  showCountCptDesc: number = this.limitCount;
  logicEffectiveDate : string = '';
  tagRequest: any;
  cacheRequest: any;
  hideDeleted: boolean = false;
  showOnlyNewRules: boolean = false;
  endPoint: any;

  //Policy Package
  policyPackageValues: any = [];
  policyPackageSelected: any[] = [];

  constructor(private utils: AppUtils, private dashboardService: DashboardService, private metadataCacheService: MetadataCacheService,
    private libraryViewService: LibraryViewService, private storageService: StorageService, private dialogService: DialogService,
    private router: Router, private cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
    private toastService: ToastMessageService, private confirmationService: ConfirmationService, 
    private utilsService: UtilsService,private key: KeyLimitService, 
    private datepipe: DatePipe, private eclTableService:EclTableService) {
  }

  ngOnInit() {
    this.loadSavedFilters();
    this.loadTagNames();
    this.loadCatalogues();

    this.tableResults.hasPreviousFilter = false;
    this.initiateTableModel();
    this.tableResults.loading = false;
    this.tableResults.totalRecords = 0;
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['view'] === Constants.RULES_CATALOG_PARAMETER_VIEW_LAST_REQUEST) {
        this.fillLastRequest();
        let isTagRequest: boolean = JSON.parse(this.storageService.get(IS_TAG_REQUEST, false));
        if (isTagRequest) {
          if (this.storageService.get(TAG_TABLE_CONFIG, true) != null) {
            this.tableResults.tableModel = this.storageService.get(TAG_TABLE_CONFIG, true);
            this.tagDto = this.storageService.get(JSON_TAG_DTO, true);
            this.selectedTagName = this.tagDto.tagId;
            if (this.tagDto.filterId != 0) {
              this.selectedFilterName = this.tagDto.filterId;
            }

            if (this.tagDto.tagSequenceId != 0) {
              this.selectedTagSequenceId = this.tagDto.tagSequenceId;
            }
            this.loadFilters().then(() => {
              if (this.tagDto.filterId != 0 || this.tagDto.tagSequenceId != 0) {
                this.loadFilterCondition({ value: this.selectedFilterName });
              } else {
                this.updateTagDetails(this.tagDto);
              }
              this.fillLastRequest();
            });
          }
        } else {
          if (this.tableConfig !== null && this.storageService.exists(this.tableConfig.storageFilterKey)) {
            this.tableResults.tableModel = this.tableConfig;
            this.tableResults.hasPreviousFilter = true;
            this.viewFromSession();
          }
          this.selectedSpecialty.length ? this.disableSubSpecialty = false : this.disableSubSpecialty = true;
        }
        if(this.globalRanges == true){
          this.disableGlobalRange = false;
        }
      }
    });
    if (this.tableResults.value.length == 0) {
      this.tableResults.value = [{}, {}, {}, {}, {}];
    }
  }


  ngOnDestroy() {
    if (!this.storageService.exists(Constants.PARENT_NAVIGATION)) {
      this.storageService.remove(FILTER_CONDITION);
      this.storageService.remove(RULE_CATALOG_LAST_REQUEST);
      this.storageService.remove(RULE_CAT_CACHE_LAST_REQUEST);
      this.storageService.remove(IS_TAG_REQUEST);
      this.storageService.remove(TAG_TABLE_CONFIG);
      this.storageService.remove(JSON_TAG_DTO);
      this.storageService.remove(IS_VIEW_FLAG);
      this.storageService.remove(ASSOCIATED_TAG_DETAILS);
      this.storageService.remove(IS_COMPARE_REQUEST);
      this.storageService.remove(COMPARE_TAG_DTO);
      if (this.tableConfig.storageFilterKey)
        this.storageService.remove(this.tableConfig.storageFilterKey);
      if (this.compareResult.tagResultTableConfig.storageFilterKey)
        this.storageService.remove(this.compareResult.tagResultTableConfig.storageFilterKey);
      if (this.compareResult.newResultTableConfig.storageFilterKey)
        this.storageService.remove(this.compareResult.newResultTableConfig.storageFilterKey);
    }
  }

  /**
 * Load catalogues from backend service (Categories, Jurisdictions, States, Lobs)
 * And create engines and references array
 */
  loadCatalogues() {

    this.utils.getAllProcedureCodeOptionCodes(this.procCodeCategories).then(() => {
      this.utils.getAllCategoriesValue(this.categories, false);
      this.utils.getAllJurisdictionsValue(this.jurisdictions, false);
      this.utils.getAllStatesValue(this.states, false);
      this.utils.getAllLobsValue(this.lobs, false);
      this.utils.getAllSpecialityTypes(this.specialties, SPECIALITY_TYPE);
      this.utils.getAllSubspecialityTypes(this.subSpecialties, SUBSPECIALITY_TYPE);
      this.utils.getAllEnginesLibraryView(this.engines, false);
      this.utils.getAllPolicyPackageValue(this.policyPackageValues);

      this.references = [];
      this.utils.getAllReferencesValue(this.references, false);
      this.utils.getAllRevenueCodes(this.revenueCodes, false);
      this.utils.getAllProfessionalClaims(this.placeOfServices, false);
      this.utils.getAllBillTypeClaims(this.billTypes, false);
      this.hcpcProcCodeCats = this.procCodeCategories;
      this.cptProcCodeCats = this.procCodeCategories;
      this.icdProcCodeCats = this.procCodeCategories;
    })

  }

  loadSavedFilters() {
    this.utilsService.getCacheUrl().subscribe((response: any) => {
      Constants.redisCacheUrl = response.data;
      this.metadataCacheService.getSavedFilters().subscribe((data: FilterDto[]) => {
        this.conditionFilters = data;
        this.searchDropdownFilters = [
          { label: SELECT, value: ' ' }
        ];
        this.conditionFilters.forEach((item: FilterDto) => this.searchDropdownFilters.push({ label: item.filterName, value: item.filterId }));
      });
    });
  }


  loadTagNames() {
    this.utilsService.getCacheUrl().subscribe((response: any) => {
      Constants.redisCacheUrl = response.data;
      this.metadataCacheService.getAllTags().subscribe((tags: TagDto[]) => {
        tags.forEach((tag: TagDto) => this.tagNames.push({ label: tag.tagName, value: tag.tagId }));
      });
    });
  }

  initiateTableModel() {
    let tableConfig = new EclTableModel();
    // initially tableConfig.url is null to block initial request.
    tableConfig.lazy = true;
    tableConfig.sortOrder = 1;
    tableConfig.showRecords = true;
    tableConfig.paginationSize = 50;
    tableConfig.criteriaFilters = this.getJsonRequest();
    tableConfig.excelFileName = DOWNLOAD_FILE_NAME;
    tableConfig.storageFilterKey = PREVIOUS_SEARCH_FILTERS;
    tableConfig.filterGlobal = false;
    tableConfig.checkBoxSelection = true;
    this.checkVisibleColumns(tableConfig, tableConfig.criteriaFilters);
    this.tableConfig = tableConfig;
  }

  getConditions(event) {
    this.savedFilterReset();
    if (this.selectedSavedFilter != null && this.selectedSavedFilter > 0) {
      let selCondition = this.conditionFilters.find(i => i.filterId == this.selectedSavedFilter).filterCondition;
      this.getValuesfromFilterDto(selCondition, true);
    }
  }

  /**
   * Method is called to build string representaion of the entire condition
   * in filter or to set the dropdown selected values with the values in the 
   * chosen saved filter condition. 
   * @param filterCondition 
   * @param isSavedFilter true for dropdown values; false to construct string 
   * 
   */

  getValuesfromFilterDto(filterCondition, isSavedFilter): string {

    let conditionString: string = '';
    let filterConditionString: string = '';
    let condArray: EclCacheLbvSearchDto[] = JSON.parse(filterCondition);
    condArray.forEach((item, index) => {
      let subject = item.subject.toLowerCase();
      switch (subject) {
        case SUBJECT.policy_package:
          if (isSavedFilter) {
            this.policyPackageSelected = this.setDropdownCondValues(item, this.policyPackageValues);
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.policy_package, item);
          }
          break;        
        case SUBJECT.lob:
          if (isSavedFilter) {
            this.selectedLobs = this.setDropdownCondValues(item, this.lobs);
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.lob, item);
          }
          break;
        case SUBJECT.category:
          if (isSavedFilter) {
            this.selectedCategories = this.setDropdownCondValues(item, this.categories);
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.category, item);
          }
          break;
        case SUBJECT.jurisdiction:
          if (isSavedFilter) {
            this.selectedJurisdictions = this.setDropdownCondValues(item, this.jurisdictions);
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.jurisdiction, item);
          }
          break;
        case SUBJECT.state:
          if (isSavedFilter) {
            this.selectedStates = this.setDropdownCondValues(item, this.states);
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.state, item);
          }
          break;
        case SUBJECT.cpt_desc:
          if (isSavedFilter) {
            this.cptProcDesc = item.value;
            this.cptCodeDescInd = '1';
          } else {
            filterConditionString = SUBJECT.cpt_desc.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          break;
        case SUBJECT.hcpcs_desc:
          if (isSavedFilter) {
            this.hcpcsProcDesc = item.value;
            this.hcpcsCodeDescInd = '1';
          } else {
            filterConditionString = SUBJECT.hcpcs_desc.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          break;
        case SUBJECT.icd_desc:
          if (isSavedFilter) {
            this.icdProcDesc = item.value;
            this.icdCodeDescInd = '1';
          } else {
            filterConditionString = SUBJECT.icd_desc.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          break;
        case SUBJECT.cpt:
          if (isSavedFilter) {
            this.cptProcCode = item.value;
            this.cptCodeDescInd = '0';
          } else {
            filterConditionString = SUBJECT.cpt.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }

          let associateConditionCptProcType: any = [];
          associateConditionCptProcType = this.getValueFromConditionArr(item.associateCondition, SUBJECT.cpt_proc_type);
          if (typeof item.associateCondition != 'undefined' && Object.keys(associateConditionCptProcType).length) {
            if (isSavedFilter) {
              this.selectedCptProcCodeCats = this.setDropdownCondValues(associateConditionCptProcType, null);
            } else {
              filterConditionString = filterConditionString + ' AND ' + this.getConditionListString(SUBJECT.cpt_proc_type, associateConditionCptProcType);
            }
          }
          break;
        case SUBJECT.hcpcs:
          if (isSavedFilter) {
            this.hcpcsProcCode = item.value;
            this.hcpcsCodeDescInd = '0';
          } else {
            filterConditionString = SUBJECT.hcpcs.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          let associateConditionHcpcsProcType: any;
          associateConditionHcpcsProcType = this.getValueFromConditionArr(item.associateCondition, SUBJECT.hcpcs_proc_type);
          if (typeof item.associateCondition != 'undefined' && Object.keys(associateConditionHcpcsProcType).length) {
            if (isSavedFilter) {
              this.selectedHcpcProcCodeCats = this.setDropdownCondValues(associateConditionHcpcsProcType, null);
            } else {
              filterConditionString = filterConditionString + ' AND ' + this.getConditionListString(SUBJECT.hcpcs_proc_type, item.associateCondition[0]);
            }
          }
          break;
        case SUBJECT.icd:
          if (isSavedFilter) {
            this.icdProcCode = item.value;
            this.icdCodeDescInd = '0';
          } else {
            filterConditionString = SUBJECT.icd.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          break;
        case SUBJECT.keyword:
          if (isSavedFilter) {
            this.keyword = item.value;
          } else {
            filterConditionString = SUBJECT.keyword.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          break;
        case SUBJECT.reference:
          if (isSavedFilter) {
            this.selectedReferences = this.setDropdownCondValues(item, this.references);
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.reference, item);
          }
          break;
        case SUBJECT.referenceTitle:
          if (isSavedFilter) {
            this.referenceTitle = item.value;
          } else {
            filterConditionString = SUBJECT.referenceTitle.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          break;
        case SUBJECT.revenueCode:
          if (isSavedFilter) {
            this.selectedRevCodes = this.setDropdownCondValues(item, this.revenueCodes);
            this.additionalSearchPanelHeader = HIDE_SEARCH_HEADER;
            this.isAdditionalSettings = false;
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.revenueCode, item);
          }
          break;
        case SUBJECT.specialty:
          if (isSavedFilter) {
            this.selectedSpecialty = this.setDropdownCondValues(item, this.specialties);
            this.additionalSearchPanelHeader = HIDE_SEARCH_HEADER;
            this.isAdditionalSettings = false;
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.specialty, item);
          }
          break;
        case SUBJECT.subspecialty:
          this.filterSubSpecialty();
          if (isSavedFilter) {
            this.selectedSubSpecialty = this.setDropdownCondValues(item, this.subSpecialtyFiltered);
            this.additionalSearchPanelHeader = HIDE_SEARCH_HEADER;
            this.isAdditionalSettings = false;
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.subspecialty, item);
          }
          break;
        case SUBJECT.gender:
          let genderVal = Number.parseInt(item.value);
          if (isSavedFilter) {
            this.selectedGender = genderVal;
            this.additionalSearchPanelHeader = HIDE_SEARCH_HEADER;
            this.isAdditionalSettings = false;
          } else {
            filterConditionString = SUBJECT.gender.toUpperCase() + ' ' + item.operator + ' "' + this.getValueFromId(this.genders, genderVal) + '"';
          }
          break;
        case SUBJECT.rule_engine:
          if (isSavedFilter) {
            this.selectedEngines = this.setDropdownCondValues(item, this.engines);
            this.additionalSearchPanelHeader = HIDE_SEARCH_HEADER;
            this.isAdditionalSettings = false;
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.rule_engine, item);
          }
          break;
        case SUBJECT.statusActive:
          if (isSavedFilter) {
            this.statusActive = item.value === BOTH ? true : false;
          } else {
            filterConditionString = SUBJECT.statusActive.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          break;
        case SUBJECT.placeOfServices:
          if (isSavedFilter) {
            this.selectedPlaceOfService = this.setDropdownCondValues(item, this.placeOfServices);
            this.additionalSearchPanelHeader = HIDE_SEARCH_HEADER;
            this.isAdditionalSettings = false;
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.placeOfServices, item);
          }
          break;
        case SUBJECT.billTypes:
          if (isSavedFilter) {
            this.selectedBillType = this.setDropdownCondValues(item, this.billTypes);
            this.additionalSearchPanelHeader = HIDE_SEARCH_HEADER;
            this.isAdditionalSettings = false;
          } else {
            filterConditionString = this.getConditionListString(SUBJECT.billTypes, item);
          }
          break;
        case SUBJECT.logicEffectiveDate:
          if (isSavedFilter) {
            this.logicEffectiveDate = item.value;
          } else {
            filterConditionString = SUBJECT.logicEffectiveDate.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          break;

          
      }
      if (subject === SUBJECT.cpt || subject === SUBJECT.cpt_desc ||
        subject === SUBJECT.hcpcs || subject === SUBJECT.hcpcs_desc) {
        let associateConditionGlobalRange = this.getValueFromConditionArr(item.associateCondition, SUBJECT.globalRanges);
        if (typeof item.associateCondition != 'undefined' && Object.keys(associateConditionGlobalRange).length) {
          if (isSavedFilter) {
            this.globalRanges = (associateConditionGlobalRange.value === "true") ? true : false;
            this.disableGlobalRange = !this.globalRanges;
          } else if (filterConditionString.indexOf(SUBJECT.globalRanges) == -1) {
            filterConditionString = filterConditionString + ' AND ' + SUBJECT.globalRanges.toUpperCase() + ' = true ';
          }
        }
        
      }
      if (!isSavedFilter) {
        if (index > 0) {
          conditionString = conditionString + ' ' + item.preOperator + ' ' + filterConditionString;
        } else {
          conditionString = filterConditionString;
        }
      }
    });
    return conditionString;
  }
  getValueFromConditionArr(associateCondition:  EclCacheLbvSearchDto[], key: SUBJECT) {
    let condObj = new EclCacheLbvSearchDto();
    if (null !== associateCondition) {
      associateCondition.filter(function (cond) {
        return (cond.subject === key) ? condObj = cond : null;
      })
    }
    return condObj;
  }


  getConditionListString(subject, filter) {
    if (filter.value.indexOf(COMMA_ESCAPE) > -1)
      filter.value = filter.value.replace(this.escapeRx, COMMA_DELIM);
    return (subject.toUpperCase() + ' ' + filter.operator + ' (' + filter.value + ')');
  }


  setDropdownCondValues(item: EclCacheLbvSearchDto, masterList) {
    let condValue: any[];
    let selArray: any[] = [];
    condValue = item.value.split(COMMA_DELIM);
    condValue.forEach((data: string, index) => {
      if (data.indexOf(COMMA_ESCAPE) > -1)
        data = data.replace(this.escapeRx, COMMA_DELIM);
      if (null != masterList) {
        selArray.push(this.getIdFromValue(masterList, data));
      } else {
        selArray.push(data);
      }
    });
    return selArray;
  }

  getIdFromValue(list, id) {
    try {
      return list.find(x => x.label === id).value;
    } catch (e) { }
  }


  getCacheJsonRequest() {
    this.eclCacheRequest = [];
    if (this.policyPackageSelected.length > 0)
      this.buildListCondition(SUBJECT.policy_package, this.policyPackageSelected, 'in', this.policyPackageValues);      
    if (this.selectedCategories.length > 0)
      this.buildListCondition(SUBJECT.category, this.selectedCategories, 'in', this.categories);
    if (this.selectedLobs.length > 0)
      this.buildListCondition(SUBJECT.lob, this.selectedLobs, 'in', this.lobs);
    if (this.selectedStates.length > 0)
      this.buildListCondition(SUBJECT.state, this.selectedStates, 'in', this.states);
    if (this.selectedJurisdictions.length > 0)
      this.buildListCondition(SUBJECT.jurisdiction, this.selectedJurisdictions, 'in', this.jurisdictions);

    if (typeof this.hcpcsProcDesc != 'undefined' && this.hcpcsProcDesc)
      this.buildStringCondition(SUBJECT.hcpcs_desc, this.hcpcsProcDesc, 'like', true);
    if (typeof this.cptProcDesc != 'undefined' && this.cptProcDesc)
      this.buildStringCondition(SUBJECT.cpt_desc, this.cptProcDesc, 'like', true);
    if (typeof this.icdProcDesc != 'undefined' && this.icdProcDesc)
      this.buildStringCondition(SUBJECT.icd_desc, this.icdProcDesc, 'like', false);

    if (typeof this.hcpcsProcCode != 'undefined' && this.hcpcsProcCode)
      this.buildStringCondition(SUBJECT.hcpcs, this.hcpcsProcCode, 'in', true);
    if (typeof this.cptProcCode != 'undefined' && this.cptProcCode)
      this.buildStringCondition(SUBJECT.cpt, this.cptProcCode, 'in', true);
    if (typeof this.icdProcCode != 'undefined' && this.icdProcCode)
      this.buildStringCondition(SUBJECT.icd, this.icdProcCode, 'in', false);
    if (typeof this.keyword != 'undefined' && this.keyword)
      this.buildStringCondition(SUBJECT.keyword, this.keyword, 'like', false);
    if (this.selectedReferences.length > 0)
      this.buildListCondition(SUBJECT.reference, this.selectedReferences, 'in', this.references);
    if (typeof this.referenceTitle != 'undefined' && this.referenceTitle)
      this.buildStringCondition(SUBJECT.referenceTitle, this.referenceTitle, 'like', false);
    if (this.selectedRevCodes.length > 0)
      this.buildListCondition(SUBJECT.revenueCode, this.selectedRevCodes, 'in', this.revenueCodes);
    if (this.selectedSpecialty.length > 0)
      this.buildListCondition(SUBJECT.specialty, this.selectedSpecialty, 'in', this.specialties);
    if (this.selectedSubSpecialty.length > 0)
      this.buildListCondition(SUBJECT.subspecialty, this.selectedSubSpecialty, 'in', this.subSpecialtyFiltered);
    if (this.selectedGender > 0)
      this.buildStringCondition(SUBJECT.gender, this.selectedGender, '=', false);
    if (this.selectedEngines.length > 0)
      this.buildListCondition(SUBJECT.rule_engine, this.selectedEngines, 'in', this.engines);
    if (this.selectedPlaceOfService.length > 0)
      this.buildListCondition(SUBJECT.placeOfServices, this.selectedPlaceOfService, 'in', this.placeOfServices);
    if (this.selectedBillType.length > 0)
      this.buildListCondition(SUBJECT.billTypes, this.selectedBillType, 'in', this.billTypes);
    if (typeof this.logicEffectiveDate != 'undefined' && this.logicEffectiveDate)
      this.buildStringCondition(SUBJECT.logicEffectiveDate, this.extractDate(this.logicEffectiveDate), '>=', false);
    if (typeof this.statusActive != 'undefined' && this.statusActive) {
      this.buildStringCondition(SUBJECT.statusActive, BOTH, '=', false);
    } else {
      this.buildStringCondition(SUBJECT.statusActive, ACTIVE_STATUS, '=', false);
    }

  }

  /**  
   * Return single string of selected labels delimited by comma
  */
  getAllValuesAsStringfromAllIDs(selectedList, masterList) {
    const re = /\,/gi;
    return selectedList.map(item => this.getValueFromId(masterList, item).replace(re, COMMA_ESCAPE)).join(COMMA_DELIM);
  }

  /** 
     * Use this method  to build condition from dropdown.
     subject as conditon subject(which field), selectedList as the selected 
     values from dropdown, operator is like/in/=, masterList is the 
     list of all values displayed in dropwn to get the corresponding label
  */
  buildListCondition(subject, selectedList, operator, masterList) {
    this.buildStringCondition(subject,
      this.getAllValuesAsStringfromAllIDs(selectedList, masterList), operator, false);
  }

  /** 
   * Use this method  to build condition with simple text as value.
    subject as conditon subject(which field), selectedList as the selected 
    values from dropdown, operator is like/in/=, 
    isProcCode is false is=f associatecondition need not be build
 */
  buildStringCondition(subject, strText, operator, isProcCode) {
    this.lbvSearchDto = new EclCacheLbvSearchDto();
    this.lbvSearchDto.operator = operator;
    this.lbvSearchDto.subject = subject;
    this.lbvSearchDto.value = strText;
    if (isProcCode) {
      this.lbvSearchDto.associateCondition = [];
      if (SUBJECT.cpt == subject && this.selectedCptProcCodeCats.length > 0) {
        let codeDto = new EclCacheLbvSearchDto();
        codeDto.operator = 'in';
        codeDto.subject = SUBJECT.cpt_proc_type;
        codeDto.preOperator = 'and';
        codeDto.value = this.selectedCptProcCodeCats.join();
        this.lbvSearchDto.associateCondition.push(codeDto);
      } else if (SUBJECT.hcpcs == subject && this.selectedHcpcProcCodeCats.length > 0) {
        let codeDto = new EclCacheLbvSearchDto();
        codeDto.operator = 'in';
        codeDto.subject = SUBJECT.hcpcs_proc_type;
        codeDto.preOperator = 'and';
        codeDto.value = this.selectedHcpcProcCodeCats.join();
        this.lbvSearchDto.associateCondition.push(codeDto);
      }
      this.addGlobalRangeCondition();
    }
    if (null != this.eclCacheRequest &&
      this.eclCacheRequest.length > 0) {
      this.lbvSearchDto.preOperator = 'and';
    }
    this.eclCacheRequest.push(this.lbvSearchDto);
  }

  addGlobalRangeCondition() {
    if (this.globalRanges == true) {
      let rangeDto = new EclCacheLbvSearchDto();
      rangeDto.operator = '=';
      rangeDto.subject = SUBJECT.globalRanges;
      rangeDto.preOperator = 'and';
      rangeDto.value = "true";
      this.lbvSearchDto.associateCondition.push(rangeDto);
    }
  }


  /**
   * Parse view data to backend required structure
   */
  getJsonRequest() {
    let json = {};

    json["lobs"] = this.selectedLobs.length == 0 ? [] : this.selectedLobs;
    json["states"] = this.selectedStates.length == 0 ? [] : this.selectedStates;
    json["jurisdictions"] = this.selectedJurisdictions.length == 0 ? [] : this.selectedJurisdictions;
    json["categories"] = this.selectedCategories.length == 0 ? [] : this.selectedCategories;
    json["referenceSources"] = this.selectedReferences.length == 0 ? [] : this.selectedReferences;
    json["hcpcsProcCodeCategories"] = this.selectedHcpcProcCodeCats.length == 0 ? [] : this.selectedHcpcProcCodeCats;
    json["cptProcCodeCategories"] = this.selectedCptProcCodeCats.length == 0 ? [] : this.selectedCptProcCodeCats;
    json["referenceSources"] = this.selectedReferences.length == 0 ? [] : this.selectedReferences;
    json["revenueCodes"] = this.selectedRevCodes.length == 0 ? [] : this.selectedRevCodes;
    json["referenceDocument"] = this.referenceDocument == '' ? null : this.referenceDocument;
    json["logicEffectiveDate"] = this.extractDate(this.logicEffectiveDate);
    json["hcpcsProcCode"] = this.hcpcsProcCode;
    json["hcpcsProcDesc"] = this.hcpcsProcDesc;
    json["cptProcCode"] = this.cptProcCode;
    json["cptProcDesc"] = this.cptProcDesc;
    json["icdProcCode"] = this.icdProcCode;
    json["icdProcDesc"] = this.icdProcDesc;
    json["referenceTitle"] = this.referenceTitle;
    json["keyword"] = this.keyword;
    json["gender"] = this.selectedGender;
    json["specialties"] = this.selectedSpecialty.length == 0 ? [] : this.selectedSpecialty;
    json["selectedSubSpecialty"] = this.selectedSubSpecialty.length == 0 ? [] : this.selectedSubSpecialty;
    json["subSpecialtyFiltered"] = this.subSpecialtyFiltered.length == 0 ? [] : this.subSpecialtyFiltered;
    json["isAdditionalSettings"] = this.isAdditionalSettings;
    json["additionalSearchPanelHeader"] = this.additionalSearchPanelHeader;
    json["selectedSavedFilter"] = this.selectedSavedFilter;
    json["selectionPanelHeader"] = this.selectionPanelHeader;
    json["showSelectionPanel"] = this.showSelectionPanel;
    json["selectedEngines"] = this.selectedEngines.length == 0 ? [] : this.selectedEngines;
    json["statusActive"] = this.statusActive;
    json["globalRanges"] = this.globalRanges;
    json["selectedPlaceOfService"] = this.selectedPlaceOfService.length == 0 ? [] : this.selectedPlaceOfService;
    json["selectedBillType"] = this.selectedBillType.length == 0 ? [] : this.selectedBillType;
    return json;
  }

  /**
   * Fill request is based to the last entered information
   */
  fillLastRequest() {
    let lastRequest: any = {};
    this.filterCondition = this.storageService.get(FILTER_CONDITION, false);
    this.eclCacheRequest = this.storageService.get(RULE_CAT_CACHE_LAST_REQUEST, true);
    lastRequest = this.storageService.get(RULE_CATALOG_LAST_REQUEST, true);
    if (lastRequest) {
      this.selectedLobs = lastRequest.lobs;
      this.selectedStates = lastRequest.states;
      this.selectedJurisdictions = lastRequest.jurisdictions;
      this.selectedCategories = lastRequest.categories;
      this.hcpcsProcCode = lastRequest.hcpcsProcCode;
      this.hcpcsProcDesc = lastRequest.hcpcsProcDesc;
      this.selectedHcpcProcCodeCats = lastRequest.hcpcsProcCodeCategories;
      this.cptProcCode = lastRequest.cptProcCode;
      this.cptProcDesc = lastRequest.cptProcDesc;
      this.selectedCptProcCodeCats = lastRequest.cptProcCodeCategories;
      this.icdProcCode = lastRequest.icdProcCode;
      this.icdProcDesc = lastRequest.icdProcDesc;
      this.selectedReferences = lastRequest.referenceSources;
      this.selectedRevCodes = lastRequest.revenueCodes;
      this.keyword = lastRequest.keyword;
      this.referenceTitle = lastRequest.referenceTitle;
      this.selectedGender = lastRequest.gender;
      this.selectedSpecialty = lastRequest.specialties;
      this.selectedSubSpecialty = lastRequest.selectedSubSpecialty;
      this.subSpecialtyFiltered = lastRequest.subSpecialtyFiltered;
      this.isAdditionalSettings = lastRequest.isAdditionalSettings;
      this.additionalSearchPanelHeader = lastRequest.additionalSearchPanelHeader;
      this.selectedSavedFilter = lastRequest.selectedSavedFilter;
      this.selectionPanelHeader = lastRequest.selectionPanelHeader;
      this.showSelectionPanel = lastRequest.showSelectionPanel;
      this.selectedEngines = lastRequest.selectedEngines;
      this.statusActive = lastRequest.statusActive;
      this.globalRanges = lastRequest.globalRanges;
      this.selectedPlaceOfService = lastRequest.selectedPlaceOfService;
      this.selectedBillType = lastRequest.selectedBillType;
      this.logicEffectiveDate = lastRequest.logicEffectiveDate;
    }
  }

  /**
   * Validate which columns needs to be displayed
   */
  checkVisibleColumns(tableConfig, request) {
    let colManager = new EclTableColumnManager();

    colManager.addLinkColumn('ruleCode', 'Rule ID', '12%', true, EclColumn.TEXT, true);
    colManager.addTextColumn('midRule', 'Mid Rule', '10%', true, EclColumn.TEXT, true);
    colManager.addTextColumn('version', 'Version', '10%', true, EclColumn.TEXT, true);
    colManager.addDateColumn('logicEffectiveDate', 'Logic Effective Date', '15%', true, true, 'date', 'MM/dd/yyyy');
    colManager.addTextColumn('ruleName', 'Rule Name', '29%', true, EclColumn.TEXT, true);
    colManager.addTextColumn('category', 'Category', '12%', true, EclColumn.TEXT, true);
    colManager.addTextColumn('type', 'Type', '12%', true, EclColumn.TEXT, true);
    tableConfig.columns = colManager.getColumns();
  }

  /**
   * Update catalogue results table in bais to the entered information
   */
  updateCatalogueResults() {

    return new Promise((resolve, reject) => {

      this.storageService.set(IS_TAG_REQUEST, false, false);
      let request: any = this.getJsonRequest();
      this.tableConfig.criteriaFilters = request;
      this.storageService.set(FILTER_CONDITION, this.filterCondition, false);
      this.storageService.set(RULE_CATALOG_LAST_REQUEST, request, true);
      this.storageService.set(RULE_CAT_CACHE_LAST_REQUEST, this.eclCacheRequest, true);

      //Build columns based in request
      this.checkVisibleColumns(this.tableConfig, request);
      this.tableConfig.cacheService = true;
      this.tableConfig.cacheRequest = this.eclCacheRequest;
      this.tableConfig.endpointType = RoutingConstants.CACHE_LIBRARY_VIEW_SEARCH;
      // set url value:            
      this.tableConfig.url = RoutingConstants.CACHE_URL + RoutingConstants.CACHE_LIBRARY_VIEW_SEARCH;

      this.compareResult.newResultTableConfig.url = this.tableConfig.url;
      this.compareResult.newResultTableConfig.cacheRequest = this.tableConfig.cacheRequest;
      this.compareResult.newResultTableConfig.cacheService = this.tableConfig.cacheService
      this.compareResult.newResultTableConfig.endpointType =  this.tableConfig.endpointType;
      let cacheRequestDto = new CacheRequestDto();
      cacheRequestDto.cacheRequstList = this.tableConfig.cacheRequest;
      this.compareResult.newResultTableConfig.criteriaFilters = cacheRequestDto;

      this.tableResults.clearFilters();
      this.tableResults.totalRecords = 0;
      this.tableResults.selectedRecords = [];
      this.tableResults.savedSelRecords = [];
      this.tableResults.loadData(null);
      resolve();
    });
  }

  updateTagDetails(tagDto: TagDto) {
    this.selectedData = [];
    this.selectedRuleIds = [];
    return new Promise((resolve, reject) => {

      this.storageService.set(IS_TAG_REQUEST, true, false);
      //Build columns based in request
      this.tableConfig.criteriaFilters = tagDto;
      this.storageService.set(JSON_TAG_DTO, this.tagDto, true);
      this.storageService.set(TAG_TABLE_CONFIG, this.tableConfig, true);
      this.checkVisibleColumns(this.tableConfig, this.getJsonRequest());
      this.tableConfig.cacheService = true;
      this.tableConfig.cacheRequest = [tagDto];
      this.tableConfig.endpointType = RoutingConstants.METADATA_TAG_DETAILS;
      // set url value:      
      this.tableConfig.url = RoutingConstants.METADATA_URL + "/" + RoutingConstants.METADATA_TAG_DETAILS;

      this.compareResult.tagResultTableConfig.url = this.tableConfig.url;
      this.compareResult.tagResultTableConfig.cacheRequest = this.tableConfig.cacheRequest;
      this.compareResult.tagResultTableConfig.cacheService = this.tableConfig.cacheService
      let cacheRequestDto = new CacheRequestDto();
      cacheRequestDto.cacheRequstList = this.tableConfig.cacheRequest;
      this.compareResult.tagResultTableConfig.criteriaFilters = cacheRequestDto;
      this.tagRequest = this.tableConfig.cacheRequest;

      this.tableResults.clearFilters();
      this.tableResults.totalRecords = 0;
      this.tableResults.selectedRecords = [];
      this.tableResults.savedSelRecords = [];
      this.tableResults.loadData(null);
      resolve();
    });
  }

  resetGlobalRange() {
    if (this.cptProcCode == '' && this.cptProcDesc == '' && this.hcpcsProcCode == '' && this.hcpcsProcDesc == '') {
      this.globalRanges = false;
      this.disableGlobalRange = true;
    }else{
      this.disableGlobalRange = false;
    }
  }


  checkHcpcs(event) {
    if (this.hcpcsCodeDescInd == '1') {
      this.selectedHcpcProcCodeCats = [];
      this.hcpcsProcCode = '';
      this.showCountHcpcsCode = 100;
    } else {
      this.hcpcsProcDesc = '';
      this.showCountHcpcsDesc = 100;
    }
    this.resetGlobalRange();
  }

  checkCpt(event) {
    if (this.cptCodeDescInd == '1') {
      this.selectedCptProcCodeCats = [];
      this.cptProcCode = '';
      this.showCountCptCode = 100;
    } else {
      this.cptProcDesc = '';
      this.showCountCptDesc = 100;
    }
    this.resetGlobalRange();
  }

  checkIcd(event) {
    if (this.icdCodeDescInd == '1') {
      this.icdProcCode = '';
    } else {
      this.icdProcDesc = '';
    }
  }

  /**
   * Get label value by id in catalogues list from multiselect boxes
   * @param list List for search
   * @param id Id for search
   */
  getValueFromId(list, id) {
    try {
      return list.find(x => x.value === id).label;
    } catch (e) { }
  }

  clearTextValues(type) {
    switch (type) {
      case SUBJECT.hcpcs:
        this.hcpcsProcCode = '';
        this.selectedHcpcProcCodeCats = [];
        if (this.cptProcCode == '' && this.cptProcDesc == ''){
          this.resetGlobalRange();
        }
        break;
      case SUBJECT.cpt:
        this.cptProcCode = '';
        this.selectedCptProcCodeCats = [];
        if (this.hcpcsProcCode == '' && this.hcpcsProcDesc == ''){
          this.resetGlobalRange();
        }
        break;
      case SUBJECT.icd:
        this.icdProcCode = '';
        break;
      case SUBJECT.hcpcs_desc:
        this.hcpcsProcDesc = '';
        if (this.cptProcCode == '' && this.cptProcDesc == ''){
          this.resetGlobalRange();
        }
        break;
      case SUBJECT.cpt_desc:
        this.cptProcDesc = '';
        if (this.hcpcsProcCode == '' && this.hcpcsProcDesc == ''){
          this.resetGlobalRange();
        }
        break;
      case SUBJECT.icd_desc:
        this.icdProcDesc = '';
        break;
      case SUBJECT.keyword:
        this.keyword = '';
        break;
      case SUBJECT.gender:
        this.selectedGender = 0;
        break;
      case SUBJECT.referenceTitle:
        this.referenceTitle = '';
        break;
      case SUBJECT.statusActive:
        this.statusActive = false;
        break;
      case SUBJECT.logicEffectiveDate:
        this.logicEffectiveDate = '';
        break;
      case SUBJECT.globalRanges:
        this.globalRanges = false;
        break;
    }
  }
  /**
   * Remove item from list of selected values
   * @param list to remove item
   * @param index to remove
   * @param type name of the list
   */
  removeFromList(list, index, type) {
    let arr = JSON.parse(JSON.stringify(list));
    arr.splice(index, 1);

    switch (type) {
      case SUBJECT.lob:
        this.selectedLobs = JSON.parse(JSON.stringify(arr));
        break;
      case SUBJECT.state:
        this.selectedStates = JSON.parse(JSON.stringify(arr));
        break;
      case SUBJECT.jurisdiction:
        this.selectedJurisdictions = JSON.parse(JSON.stringify(arr));
        break;
      case SUBJECT.category:
        this.selectedCategories = JSON.parse(JSON.stringify(arr));
        break;
      case SUBJECT.reference:
        this.selectedReferences = JSON.parse(JSON.stringify(arr));
        break;
      case SUBJECT.hcpcs_proc_type:
        this.selectedHcpcProcCodeCats = JSON.parse(JSON.stringify(arr));
        break;
      case SUBJECT.cpt_proc_type:
        this.selectedCptProcCodeCats = JSON.parse(JSON.stringify(arr));
        break;
      case SUBJECT.revenueCode:
        this.selectedRevCodes = JSON.parse(JSON.stringify(arr));
        break;
      case SUBJECT.specialty:
        this.selectedSpecialty = JSON.parse(JSON.stringify(arr));
        this.filterSubSpecialty();
        break;
      case SUBJECT.subspecialty:
        this.selectedSpecialty.length ? this.selectedSubSpecialty = JSON.parse(JSON.stringify(arr)) : this.selectedSubSpecialty = [];
        break;
      case SUBJECT.rule_engine:
        this.selectedEngines = JSON.parse(JSON.stringify(arr));
        break;
      case SUBJECT.placeOfServices:
        this.selectedPlaceOfService = JSON.parse(JSON.stringify(arr));
        break;
      case SUBJECT.billTypes:
        this.selectedBillType = JSON.parse(JSON.stringify(arr));
        break;
    }
  }


  /**
   * Reset the screen view
   */
  reset() {
    this.savedFilterReset();
    this.loadSavedFilters();
    this.selectedSavedFilter = [];
    this.eclCacheRequest = [];
    this.lbvSearchDto = null;
    this.referenceDocument = '';

    this.initiateTableModel();
    this.storageService.remove(RULE_CATALOG_LAST_REQUEST);
    this.storageService.remove(RULE_CAT_CACHE_LAST_REQUEST);
    this.storageService.remove(IS_COMPARE_REQUEST);
    // for hiding the table when reset clicked
    this.tableResults.totalRecords = 0;
    this.serviceCallsQty = 0;
    this.tableResults.clearFilters();
    this.clearTableFilters();

    this.resetCatalogResultsTable();
    this.disableSave = false;
    this.tableResults.selectedRecords = [];
    this.tagNames = [
      { label: 'Search or Create a Tag', value: ' ' },
      { label: 'Create New Tag', value: 0 },
    ];
    this.loadTagNames();
    this.disableTag = false;
    this.disableTagSequence = false;
    this.selectedData = [];
    this.selectedRuleIds = [];
    this.showCountCptCode = 100;
    this.showCountHcpcsCode = 100;
    this.showCountCptDesc = 100;
    this.showCountHcpcsDesc = 100;
    this.compareResult.reset();
    this.isCompare = false;
    this.endPoint = '';
  }

  resetCatalogResultsTable() {
    this.filterNames = [
      { label: 'Search or Create a Filter', value: ' ' },
      { label: 'Create New Filter', value: 0 },
    ];
    this.selectedFilterName = " ";
    this.selectedTagName = "";
    this.tagSequenceIds = [
      { label: 'Select', value: 0 }
    ];
    this.selectedTagSequenceId = "";
    this.filterCondition = "";
    this.tableResults.value = [{}, {}, {}, {}, {}];
    this.viewFlag = false;
    this.storageService.set(IS_VIEW_FLAG, this.viewFlag, false);
    this.createNewFilterFlag = false;
    this.returnedFilterDto = null;
    this.selectedFilterNameLabel = null;
  }

  savedFilterReset() {
    this.hcpcsProcDesc = '';
    this.hcpcsProcCode = '';
    this.cptProcCode = '';
    this.cptProcDesc = '';
    this.icdProcCode = '';
    this.icdProcDesc = '';
    this.icdCodeDescInd = '0';
    this.hcpcsCodeDescInd = '0';
    this.cptCodeDescInd = '0';
    this.selectedLobs = [];
    this.selectedCategories = [];
    this.selectedJurisdictions = [];
    this.selectedReferences = [];
    this.selectedStates = [];
    this.selectedCptProcCodeCats = [];
    this.selectedHcpcProcCodeCats = [];
    this.keyword = '';
    this.referenceTitle = '';
    this.selectedRevCodes = [];
    this.selectedSubSpecialty = [];
    this.selectedSpecialty = [];
    this.disableSubSpecialty = true;
    this.selectedGender = 0;
    this.isAdditionalSettings = true;
    this.additionalSearchPanelHeader = ADDITIONAL_SEARCH_HEADER;
    this.selectionPanelHeader = SELECTION_PANEL_HEADER;
    this.showSelectionPanel = true;
    this.selectedEngines = [];
    this.statusActive = false;
    this.globalRanges = false;
    this.selectedPlaceOfService = [];
    this.selectedBillType = [];
    this.logicEffectiveDate = '';
  }


  /**
   * Request to backend services to retrieve data
   */
  view() {
    if (!this.hcpcsProcCode || this.hcpcsProcCode.length === 0) {
      this.selectedHcpcProcCodeCats = [];
    }
    if (!this.cptProcCode || this.cptProcCode.length === 0) {
      this.selectedCptProcCodeCats = [];
    }

    this.getCacheJsonRequest();
    if (null != this.eclCacheRequest && this.eclCacheRequest.length > 1) {
      let previousFilterCondition = this.filterCondition;
      this.filterCondition = this.getValuesfromFilterDto(JSON.stringify(this.eclCacheRequest), false);
      if(previousFilterCondition !== null && previousFilterCondition.indexOf(COND_STATUS_STR) < 0) {
        previousFilterCondition = `${previousFilterCondition} and ${SUBJECT.statusActive.toUpperCase()} = "${ACTIVE_STATUS}"`;
      }
      if (previousFilterCondition.trim() !== this.filterCondition.trim()) {
        this.selectedFilterName = ' ';
      }
      this.viewFromSession();
    } else {
      let warnMessage: string = 'Please Select a Search Condition';
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 5000, true);
    }
    this.selectedTagName = ' ';
    this.tagSequenceIds = [
      { label: 'Select', value: 0 }
    ];
    this.filterNames = [
      { label: 'Search or Create a filter', value: ' ' },
      { label: 'Create New Filter', value: 0 },
    ];
    if (this.selectedFilterNameLabel !== undefined && this.selectedFilterNameLabel !== '' && this.selectedFilterNameLabel !== null) {
      this.filterNames.push({ label: this.selectedFilterNameLabel, value: this.selectedFilterName });
    } else if (this.returnedFilterDto !== undefined && this.returnedFilterDto !== null) {
      this.filterNames.push({ label: this.returnedFilterDto.filterName, value: this.returnedFilterDto.filterId });
    }
    this.selectedTagSequenceId = 0;
    this.disableSave = false;
    this.tableConfig.checkBoxSelection = true;
    this.tableResults.selectedRecords = [];
    this.viewFlag = true;
    this.storageService.set(IS_VIEW_FLAG, this.viewFlag, false);
    this.createNewFilterFlag = false;
  }

  /**
 * Request to backend services to retrieve data
 */
  viewFromSession() {
    this.serviceCallsQty = 0;
    this.selectedData = [];
    this.selectedRuleIds = [];
    this.updateCatalogueResults();
  }

  /**
   * Check if need to enable states (Only if select medicaid in lobs)
   */
  checkMedicaid() {
    let check = false;
    //Enable state
    for (let i = 0; i < this.selectedLobs.length; i++) {
      if (this.selectedLobs[i] == 1) {
        check = true;
        break;
      }
    }
    // remove selected states on deselecting the medicaid
    if (!check && this.selectedStates.length > 0) {
      this.selectedStates = [];
    }
    return !check;
  }

  /**
   * Check if need to enable jurisdiction (Only if select medicare in lobs)
   */
  checkMedicare() {
    let check = false;
    //Enable jurisdiction
    for (let i = 0; i < this.selectedLobs.length; i++) {
      if (this.selectedLobs[i] == 2) {
        check = true;
        break;
      }
    }

    // remove selected jurisdictions on deselecting the medicare
    if (!check && this.selectedJurisdictions.length > 0) {
      this.selectedJurisdictions = [];
    }
    return !check;
  }

  /**
   * Navigate to detail
   * @param ev: received event from ecl-table compoment.
   */
  redirect(ev: any) {
    this.storageService.set(Constants.PARENT_NAVIGATION, Constants.PARENT_NAVIGATION_RULE_CATALOGUE, false);
    this.router.navigate(['item-detail', this.utils.encodeString(ev.row.ruleId.toString()), 'RULE']);
  }

  onServiceCall(ev: any) {
    this.blockedDocument = (ev.action === Constants.ECL_TABLE_START_SERVICE_CALL);
    if (ev.action === Constants.ECL_TABLE_END_SERVICE_CALL) {
      this.serviceCallsQty++;
      if (this.tableResults.totalRecords == 0) {
        this.tableResults.loading = false;
        this.tableConfig.checkBoxSelection = true;
        this.tableResults.value = [{}, {}, {}, {}, {}];
      }
      let isCompareRequest: boolean = JSON.parse(this.storageService.get(IS_COMPARE_REQUEST, false));
      if(isCompareRequest){
        this.identifyingNewRules(this.storageService.get(COMPARE_TAG_DTO, true));
      }
      if(this.endPoint !== RoutingConstants.METADATA_TAG_DETAILS_COMPARE){
        if(this.tableConfig.endpointType === RoutingConstants.METADATA_TAG_DETAILS){
          this.compareResult.taggedResult = this.tableResults.value;
          this.compareResult.totalTaggedResult = this.tableResults.totalRecords;
    
          if(this.selectedFilterName === ' '){
            this.compareResult.clearNewResultTableConfig();
          }
    
          this.compareResult.triggerTagRulesTable();
        }
        if(this.tableConfig.endpointType === RoutingConstants.CACHE_LIBRARY_VIEW_SEARCH){
          this.compareResult.newRuleResults = this.tableResults.value;
          this.compareResult.totalNewResults = this.tableResults.totalRecords;
          this.compareResult.clearTagResultTableConfig();
          this.compareResult.triggerNewResultTable();
        }
      }
      this.endPoint = '';
      this.activatedRoute.queryParams.subscribe(params => {
        let isCompareRequest: boolean = JSON.parse(this.storageService.get(IS_COMPARE_REQUEST, false));
        if(params['view'] === Constants.RULES_CATALOG_PARAMETER_VIEW_LAST_REQUEST && isCompareRequest){
          this.tableResults.tableModel = this.storageService.get(TAG_TABLE_CONFIG, true);
          this.compareResult.initaiteNewResultTableModel();
          this.compareResult.initaiteTagResultTableModel();
          this.compareResult.taggedRules.tableModel = this.compareResult.tagResultTableConfig;
          this.compareResult.newResults.tableModel = this.compareResult.newResultTableConfig;
          this.tagDto = this.storageService.get(JSON_TAG_DTO, true);
          let compareTagDto = this.storageService.get(COMPARE_TAG_DTO, true);
          this.selectedTagName = compareTagDto.tagId;
          let existFilterName: boolean;
          let viewFlag;

          if (this.tagDto.filterId != 0) {
            this.selectedFilterName = this.tagDto.filterId;
            this.associatedTagDetails = this.storageService.get(ASSOCIATED_TAG_DETAILS, true);
            existFilterName = this.associatedTagDetails.find((filter: FilterTagSequenceDto) =>
            filter.filterDto.filterId === this.selectedFilterName) != undefined ? true : false;
            viewFlag = this.storageService.get(IS_VIEW_FLAG, false);
          }
          this.compareResult.newResults.hasPreviousFilter = true;
          this.compareResult.taggedRules.hasPreviousFilter = true;
          if(existFilterName === true && viewFlag){
            this.loadTaggedRulesInCompare(Constants.SELECTED_FILTER);
          }else{
            this.loadTaggedRulesInCompare(Constants.SELECTED_TAG);
          }
          this.storageService.set(IS_COMPARE_REQUEST, false, false);
        }
      });
    }
  }

  clearTableFilters() {
    this.storageService.remove(this.tableConfig.storageFilterKey);
    this.tableResults.initializeFilterColumnValues();
    this.tableResults.keywordSearch = '';
  }

  loadTaggedResults() {
    if (this.viewFlag && !this.createNewFilterFlag && this.selectedTagName != 0 &&
      this.selectedFilterName === ' ') {
      this.confirmationService.confirm({
        message: 'Searched results will be lost,  Are you sure you want to proceed?',
        header: 'Confirmation',
        key: 'confirmDeleteTagFilter',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.loadFilters();
          this.viewFlag = false;
          this.storageService.set(IS_VIEW_FLAG, this.viewFlag, false);
          this.savedFilterReset();
          this.selectedSavedFilter = [];
          this.filterCondition = '';
        },
        reject: () => {
          this.selectedTagName = ' ';
        }
      });
    } else {
      this.loadFilters();
    }
  }

  loadFilters() {
    return new Promise((resolve) => {
      if (this.selectedTagName === ' ') {
        this.filterNames = [
          { label: 'Search or Create a filter', value: ' ' },
          { label: 'Create New Filter', value: 0 },
        ];
        this.selectedFilterName = " ";
        this.tagSequenceIds = [
          { label: 'Select', value: 0 }
        ];
        this.filterCondition = "";
        this.tableResults.value = [{}, {}, {}, {}, {}];
      } else if (this.selectedTagName === 0) {

        let isValidCreateTag = false;
        if (typeof this.selectedFilterName != 'undefined') {
          isValidCreateTag = true;
        }
        if (typeof this.selectedData != 'undefined' && this.selectedData && this.selectedData.length > 0) {
          isValidCreateTag = true;
        }
        if (isValidCreateTag) {
          this.createNewTag();
        } else {
          this.selectedTagName = "";
          let warnMessage: string = 'Please select Rule id(s) to create a Tag';
          this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 3000, true);
        }
      } else if (isNumber(this.selectedTagName)) {
        //update tag condition loop
        this.metadataCacheService.getFiltersAndRules(this.selectedTagName).subscribe((tagDetails: TagDto) => {
          this.associatedTagDetails = tagDetails.associatedFilterTagSequences;
          this.storageService.set(ASSOCIATED_TAG_DETAILS, this.associatedTagDetails, true);
          this.filterNames = [
            { label: 'Search or Create a filter', value: ' ' },
            { label: 'Create New Filter', value: 0 }
          ];
          this.tagSequenceIds = [
            { label: 'Select', value: 0 }
          ];
          if (typeof this.associatedTagDetails != undefined && this.associatedTagDetails) {
            this.associatedTagDetails.forEach((filter: FilterTagSequenceDto) => {
              this.filterNames.push({ label: filter.filterDto.filterName, value: filter.filterDto.filterId });
              this.tagSequenceIds.push({ label: filter.tagSequenceDto.tagSequenceId, value: filter.tagSequenceDto.tagSequenceId });
            });
          }

          if (this.selectedFilterName != ' ' && this.selectedFilterName != 0 && this.filterCondition != '') {

            let existFilterName: boolean = this.associatedTagDetails.find((filter: FilterTagSequenceDto) =>
              filter.filterDto.filterId === this.selectedFilterName) != undefined ? true : false;
            if(existFilterName === true){
              this.loadTaggedRulesInCompare(Constants.SELECTED_FILTER);
            }else{
              this.loadTaggedRulesInCompare(Constants.SELECTED_TAG);
            }
            if (existFilterName === true && !this.viewFlag) {
              let selectedFilter = this.associatedTagDetails.filter(filterDetail => filterDetail.filterDto.filterId === this.selectedFilterName);
              if(selectedFilter.length > 0){
                this.selectedTagSequenceId = selectedFilter[0].tagSequenceDto.tagSequenceId;
              }
              this.endPoint = RoutingConstants.METADATA_TAG_DETAILS_COMPARE;
              this.loadRulesDetails(Constants.SELECTED_FILTER);
            } else {              
              if (this.returnedFilterDto !== undefined && this.returnedFilterDto !== null) {
                this.disableSave = false;
                this.tableConfig.checkBoxSelection = true;
                let existingFilter = this.filterNames.filter(existFilter => existFilter.value === this.returnedFilterDto.filterId);
                if (!existingFilter.length)
                  this.filterNames.push({ label: this.returnedFilterDto.filterName, value: this.returnedFilterDto.filterId });
              } else {
                if (this.viewFlag) {  
                  this.disableSave = false; 
                } else { 
                  this.disableSave = true; 
                }
                let existingFilter = this.filterNames.filter(existFilter => existFilter.value === this.selectedFilterName);
                if (!existingFilter.length)
                  this.filterNames.push({ label: this.selectedFilterNameLabel, value: this.selectedFilterName });
              }
            }
          } else {
            if (!this.viewFlag) {
              this.retrieveTagResults();
            }
          }
          resolve();
        });
      }
    });
  }

  hideOrShowDeletedNewRules(){
    if (this.selectedFilterName != ' ' && this.selectedFilterName != 0 && this.filterCondition != '') {
      let existFilterName: boolean = this.associatedTagDetails.find((filter: FilterTagSequenceDto) =>
        filter.filterDto.filterId === this.selectedFilterName) != undefined ? true : false;
      if(existFilterName === true){
        this.loadTaggedRulesInCompare(Constants.SELECTED_FILTER);
      }else {
        this.loadTaggedRulesInCompare(Constants.SELECTED_TAG);
      }
    }
  }

  loadTaggedRulesInCompare(selectedValue: string){
    this.storageService.set(IS_COMPARE_REQUEST, true, false);
    let tagDto = new TagDto();
    if (Constants.SELECTED_FILTER === selectedValue) {
      tagDto.tagId = this.selectedTagName;
      tagDto.filterId = this.selectedFilterName;
      let selectedFilter = this.associatedTagDetails.filter(filterDetail => filterDetail.filterDto.filterId === this.selectedFilterName);
      if(selectedFilter.length > 0){
        tagDto.tagSequenceId = selectedFilter[0].tagSequenceDto.tagSequenceId;
      }else{
        let tagDtoJson = this.storageService.get(JSON_TAG_DTO, true);
        tagDto.tagSequenceId = tagDtoJson.tagSequenceId;
      }

    } else if (Constants.SELECTED_TAG === selectedValue) {
      tagDto.tagId = this.selectedTagName;
    }

    this.storageService.set(COMPARE_TAG_DTO, tagDto, true)
 
    let request = new CompareGridRequestDto();
    request.cacheRequestDto = this.eclCacheRequest;
    request.tagDto = [tagDto];
    request.hideDeleted = this.hideDeleted;
    request.showOnlyNewRules = this.showOnlyNewRules;

    let cacheRequestDto = new CacheRequestDto();
    cacheRequestDto.cacheRequstList = [request];
    this.compareResult.tagResultTableConfig.criteriaFilters = cacheRequestDto;
    this.compareResult.tagResultTableConfig.cacheService = true;
    this.compareResult.tagResultTableConfig.cacheRequest = [tagDto];
    this.compareResult.tagResultTableConfig.endpointType = RoutingConstants.METADATA_TAG_DETAILS_COMPARE;
    this.compareResult.tagResultTableConfig.url = RoutingConstants.METADATA_URL + "/" + RoutingConstants.METADATA_TAG_DETAILS_COMPARE + "/" + Constants.TAG;

    this.compareResult.newResultTableConfig.url = RoutingConstants.METADATA_URL + "/" + RoutingConstants.METADATA_TAG_DETAILS_COMPARE + "/"  + Constants.NEW;
    this.compareResult.newResultTableConfig.criteriaFilters = cacheRequestDto;
    this.compareResult.newResultTableConfig.endpointType = RoutingConstants.METADATA_TAG_DETAILS_COMPARE;
    
    this.tableResults.tableModel = this.tableConfig;
    this.tagRequest = [tagDto];
    this.endPoint = RoutingConstants.METADATA_TAG_DETAILS_COMPARE;
    this.compareResult.taggedRules.loadData(null);
    this.identifyingNewRules(tagDto);
  }

  identifyingNewRules(tagDto:any){
    if(this.tableConfig.endpointType === RoutingConstants.CACHE_LIBRARY_VIEW_SEARCH){
      let request = {};
      let cacheRequestDto = new CacheRequestDto();
      cacheRequestDto.cacheRequstList = [tagDto];
      request[CRITERIA_FILTERS] = cacheRequestDto;
      this.eclTableService.getCacheData(RoutingConstants.METADATA_URL + "/" + RoutingConstants.METADATA_TAG_DETAILS,request).subscribe(response=>{
        let tagResult = response.data.dtoList;
        if(this.tableResults.value.length){
          const eclTableRows = this.tableResults.eclTable.el.nativeElement.getElementsByClassName('ui-selectable-row');
          let i = 0;
          this.tableResults.value.forEach((rules,index)=>{
            let spanElement =  eclTableRows[index].querySelectorAll("td")[1].querySelector('div').querySelector('.newRule');
            if(spanElement !== null){
              spanElement.remove();
            }
            if(tagResult.filter(tagRule => tagRule.ruleCode === rules.ruleCode).length === 0){
              eclTableRows[index].querySelectorAll("td")[1].querySelector('div').insertAdjacentHTML('beforeend','<span class="newRule">N</span>')
            }
          })
        }
      });
    }

  }
  retrieveTagResults() {
    this.loadRulesDetails(Constants.SELECTED_TAG);
    this.disableSave = true;
    this.tableConfig.checkBoxSelection = false;
    this.tableResults.selectedRecords = [];
  }


  checkToTrigger(event: any, type: String) {
    let lastRequest = this.storageService.get(RULE_CATALOG_LAST_REQUEST, true);
    let lastCacheRequest = this.storageService.get(RULE_CAT_CACHE_LAST_REQUEST, true);

    if (lastRequest != null) {
      let lengthOfLastCacheRequest = Object.keys(lastCacheRequest).length;
      if (lengthOfLastCacheRequest > 1) {
        let previousFilterRequest = lastRequest;
        let currentFilterRequest = this.getJsonRequest();

        if (type == SUBJECT.statusActive) {
          delete previousFilterRequest.statusActive;
          delete currentFilterRequest["statusActive"];
        }else if (type == SUBJECT.globalRanges) {
          delete previousFilterRequest.globalRanges;
          delete currentFilterRequest["globalRanges"];
        }

        if (JSON.stringify(previousFilterRequest) == JSON.stringify(currentFilterRequest)) {
          this.clearTableFilters();
          this.view();
        }
      }
    }
  }

  loadFilterCondition(event: any) {
    this.disableTag = false;
    this.disableTagSequence = false;
    if (this.selectedFilterName === ' ') {
      this.tableResults.selectedRecords = [];
      this.filterCondition = "";
      this.selectedTagSequenceId = "";
    } else if (this.selectedFilterName === 0) {
      if (this.filterCondition == "") {
        let warnMessage: string = 'Please select search conditions to create a filter';
        this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 5000, true);
      } else {
        this.newFilter = true;
        this.createNewFilter();
      }
    } else {
      this.tableResults.selectedRecords = [];
      this.newFilter = false;
      if (typeof this.associatedTagDetails != undefined && this.associatedTagDetails) {
        this.disableSave = true;
        this.tableConfig.checkBoxSelection = false;
        this.associatedTagDetails.forEach((filter: FilterTagSequenceDto) => {
          if (event.value === filter.filterDto.filterId) {
            this.selectedFilterNameLabel = filter.filterDto.filterName;
            this.filterCondition = this.getValuesfromFilterDto(filter.filterDto.filterCondition, false);
            this.selectedTagSequenceId = filter.tagSequenceDto.tagSequenceId;
            this.loadRulesDetails(Constants.SELECTED_FILTER);
            this.compareResult.clearNewResultTableConfig();
            if (this.selectedFilterName != 0 && this.selectedFilterName != ' ' && this.filterCondition != '' && filter.filterDto.filterCondition != '') {
              this.savedFilterReset();
              this.selectedSavedFilter = [];
              this.getValuesfromFilterDto(filter.filterDto.filterCondition, true);
            }
          }
        });
      } else {
        this.filterCondition = this.getValuesfromFilterDto(this.returnedFilterDto.filterCondition, false);
      }
    }
  }

  loadFilterName(event: any) {
    this.tableResults.selectedRecords = [];
    if (event.value == '') {
      this.selectedFilterName = " ";
      this.filterCondition = "";
    } else {
      this.associatedTagDetails.forEach((filter: FilterTagSequenceDto) => {
        if (event.value === filter.tagSequenceDto.tagSequenceId) {
          this.selectedFilterName = filter.filterDto.filterId;
          this.filterCondition = this.getValuesfromFilterDto(filter.filterDto.filterCondition, false);
          this.loadRulesDetails(Constants.SELECTED_FILTER);
          if (this.selectedFilterName != 0 && this.selectedFilterName != ' ' && this.filterCondition != '' && filter.filterDto.filterCondition != '') {
            this.savedFilterReset();
            this.selectedSavedFilter = [];
            this.getValuesfromFilterDto(filter.filterDto.filterCondition, true);
          }
        }
      });
    }
  }


  createNewTag() {
    if (this.selectedFilterName === " " || this.selectedFilterName === 0) {
      this.filterNames = [
        { label: 'Search or Create a filter', value: ' ' },
        { label: 'Create New Filter', value: 0 }
      ];
      this.tagSequenceIds = [
        { label: 'Select', value: 0 }
      ];
      this.selectedTagName = "";
      let warnMessage: string = 'Please select or create a filter to create a Tag';
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 2000, true);
    }
    else if (this.selectedData.length > 0) {
      this.selectedRuleIds = this.selectedData.map(rule => {
        return rule.ruleCode
      });
      const ref = this.dialogService.open(CreateTagComponent, {
        data: {
          filter: this.selectedFilterName,
          ruleIds: this.selectedRuleIds
        },
        header: 'New Tag',
        closable: false,
        closeOnEscape: false,
        width: '30%'
      });
      ref.onClose.subscribe((returnValue: TagDto) => {
        if (returnValue !== undefined && returnValue.tagId !== undefined) {
          let succMessage: string = 'Tag successfully created';
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, succMessage, 2000, true);
          this.tagNames.push({ label: returnValue.tagName, value: returnValue.tagId });
          this.selectedTagName = returnValue.tagId;
          this.tagSequenceIds = [
            { label: 'Select', value: 0 }
          ];
          this.tagSequenceIds.push({ label: returnValue.tagSequenceId, value: returnValue.tagSequenceId });
          this.selectedTagSequenceId = returnValue.tagSequenceId;
          if (this.selectedFilterNameLabel !== undefined && this.selectedFilterNameLabel !== '' && this.selectedFilterNameLabel !== null) {
            this.filterNames = [
              { label: 'Search or Create a filter', value: ' ' },
              { label: 'Create New Filter', value: 0 },
            ];
            this.filterNames.push({ label: this.selectedFilterNameLabel, value: this.selectedFilterName });
          }
          this.retrieveTagResults();
          this.returnedFilterDto = null; 
          this.viewFlag = false;
          this.loadTaggedRulesInCompare(Constants.SELECTED_TAG);
        } else {
          this.selectedTagName = ' ';
        }
      });
    } else {
      this.selectedTagName = "";
      let warnMessage: string = 'Please select Rule id(s) to create a Tag';
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 2000, true);
    }
  }



  //added for metadata tagging and filter
  updateTag() {
    if (this.selectedTagName > 0) {
      let isValidCreateTag = false;

      if ((typeof this.selectedData != 'undefined' && this.selectedData && this.selectedData.length > 0)
        || (typeof this.selectedFilterName != 'undefined')) {
        isValidCreateTag = true;
      }

      if (isValidCreateTag && this.selectedData.length > 0) {
        this.createNewTagRequest.filterId = this.selectedFilterName;
        this.createNewTagRequest.action = "update";
        this.createNewTagRequest.ruleIds = this.selectedData.map(rule => {
          return rule.ruleCode
        });
        this.createNewTagRequest.tagId = this.selectedTagName;
        this.createNewTagRequest.tagSequenceId = this.selectedTagSequenceId;
        this.metadataCacheService.saveTags(this.createNewTagRequest).subscribe(
          (response: any) => {
            if (response !== undefined) {
              let succMessage: string = 'Tag successfully updated with new filter';
              this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, succMessage, 2000, true);

              /* check whether tagseq alreay exist in case of update. If so do not push */
              let existinhgTagSeq = this.tagSequenceIds.filter(item => item.value === response.data.tagSequenceId);
              if (!existinhgTagSeq.length)
                this.tagSequenceIds.push({ label: response.data.tagSequenceId, value: response.data.tagSequenceId });
              this.selectedTagSequenceId = response.data.tagSequenceId;
              this.metadataCacheService.getFiltersAndRules(this.selectedTagName).subscribe((tagDetails: TagDto) => {
                this.associatedTagDetails = tagDetails.associatedFilterTagSequences;
                this.storageService.set(ASSOCIATED_TAG_DETAILS, this.associatedTagDetails, true);
              });
              this.loadRulesDetails(Constants.SELECTED_FILTER);
              this.loadTaggedRulesInCompare(Constants.SELECTED_FILTER);
              this.tableResults.selectedRecords = [];
              this.disableSave = true;
              this.tableConfig.checkBoxSelection = false;
              this.viewFlag = false;
            }
          }
        );
        this.returnedFilterDto = null;
      } else {
        let warnMessage: string = 'Please select  Rule id(s) to update a Tag.';
        this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 2000, true);
      }
    } else {
      let warnMessage: string = 'Please select valid Tag name  to update a Tag.';
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 2000, true);
    }
  }


  showCurrent(event, description: string, overlaypanel: OverlayPanel) {
    if (typeof description != undefined && description) {
      overlaypanel.toggle(event);
      this.customToolTip = description;
    }

  }

  loadRulesDetails(selectedValue: string) {
    this.tagDto = new TagDto();
    if (Constants.SELECTED_FILTER === selectedValue) {
      this.tagDto.tagId = this.selectedTagName;
      this.tagDto.filterId = this.selectedFilterName;
      this.tagDto.tagSequenceId = this.selectedTagSequenceId;
    } else if (Constants.SELECTED_TAG === selectedValue) {
      this.tagDto.tagId = this.selectedTagName;
    }
    this.updateTagDetails(this.tagDto);
  }

  createNewFilter() {
    const ref = this.dialogService.open(CreateFilterComponent, {
      data: {
        filterCondition: JSON.stringify(this.eclCacheRequest),
        displayFilterCondition: this.getValuesfromFilterDto(JSON.stringify(this.eclCacheRequest), false),
        screenName: 'Library View search'
      },
      header: 'New Filter',
      closable: false,
      closeOnEscape: false
    });
    ref.onClose.subscribe((returnValue: FilterDto) => {
      this.returnedFilterDto = returnValue;
      if (returnValue !== undefined && returnValue.filterId !== undefined) {
        let succMessage: string = 'Filter successfully created';
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, succMessage, 2000, true);
        this.filterNames = [
          { label: 'Search or Create a filter', value: ' ' },
          { label: 'Create New Filter', value: 0 },
        ];
        this.filterNames.push({ label: returnValue.filterName, value: returnValue.filterId });
        this.selectedFilterName = returnValue.filterId;
        this.selectedFilterNameLabel = returnValue.filterName;
        this.selectedTagSequenceId = "";
        this.selectedTagName = ' ';
      } else {
        this.selectedFilterName = ' ';
      }
      this.createNewFilterFlag = true;
    });
  }

  changePanelHeader() {
    if (this.additionalSearchPanelHeader === ADDITIONAL_SEARCH_HEADER) {
      this.additionalSearchPanelHeader = HIDE_SEARCH_HEADER;
      this.isAdditionalSettings = false;
    } else if (this.additionalSearchPanelHeader === HIDE_SEARCH_HEADER) {
      this.additionalSearchPanelHeader = ADDITIONAL_SEARCH_HEADER;
      this.isAdditionalSettings = true;
    }
  }

  changeSelectionPanelHeader() {
    if (this.selectionPanelHeader === SELECTION_PANEL_HEADER) {
      this.selectionPanelHeader = HIDE_SELECTION_PANEL_HEADER;
      this.showSelectionPanel = false;
    } else if (this.selectionPanelHeader === HIDE_SELECTION_PANEL_HEADER) {
      this.selectionPanelHeader = SELECTION_PANEL_HEADER;
      this.showSelectionPanel = true;
    }
  }

  filterSubSpecialtyTypes(subSpecialties: any[], selectedSpecialties: any[]) {
    const newArray = subSpecialties.filter(({ type }) => selectedSpecialties && selectedSpecialties.includes(type.substring(0, MATCHED_SPECIALITY_TYPE_LENGTH)));
    return newArray;
  }

  filterSubSpecialty() {
    let subTypes = this.subSpecialties,
      selectInTypes = this.selectedSpecialty;
    this.subSpecialtyFiltered = this.filterSubSpecialtyTypes(subTypes, selectInTypes);
    this.selectedSpecialty.length ? this.disableSubSpecialty = false : this.disableSubSpecialty = true;
    this.selectedSubSpecialty = this.resetSelectedSubSpecailty();
  }

  resetSelectedSubSpecailty() {
    const selectedSubspecialties = this.subSpecialtyFiltered.filter(({ value }) => this.selectedSubSpecialty && this.selectedSubSpecialty.includes(value)).map(i => i.value);
    return selectedSubspecialties;
  }

  hasNoSelectedItems() {
    if (this.selectedLobs.length == 0 && this.selectedStates.length == 0 && this.selectedJurisdictions.length == 0
      && this.selectedCategories.length == 0 && this.selectedReferences.length == 0 && this.selectedHcpcProcCodeCats.length == 0
      && this.selectedCptProcCodeCats.length == 0 && this.selectedRevCodes.length == 0 && this.hcpcsProcCode == ''
      && this.hcpcsProcDesc == '' && this.cptProcCode == '' && this.cptProcDesc == '' && this.icdProcCode == ''
      && this.icdProcDesc == '' && this.referenceTitle == '' && this.keyword == '' && this.selectedGender == 0
      && this.selectedSpecialty.length == 0 && this.selectedSubSpecialty.length == 0 && this.selectedEngines.length == 0
      && this.statusActive == false && this.selectedBillType.length == 0 && this.selectedPlaceOfService.length == 0
      && (this.logicEffectiveDate == ''  || !this.logicEffectiveDate)  && this.globalRanges == false) {
      return true;
    }
    return false;
  }

  //Key Limiter 
  returnMessage(event, type: String) {
    if (type === SUBJECT.hcpcs) {
      this.showCountHcpcsCode = this.key.keyCheck(event, this.limitCount);
    } else if (type === SUBJECT.cpt) {
      this.showCountCptCode = this.key.keyCheck(event, this.limitCount);
    } else if (type === SUBJECT.hcpcs_desc) {
      this.showCountHcpcsDesc = this.key.keyCheck(event, this.limitCount);
    } else if (type === SUBJECT.cpt_desc) {
      this.showCountCptDesc = this.key.keyCheck(event, this.limitCount);
    }
    this.resetGlobalRange();
  }

  compare() {
    this.isCompare = !this.isCompare;
    this.compareResult.isEqualizeHeight = true;
  }

  extractDate(datestr: string) {
    let returnVar = '';
    if (typeof datestr != 'undefined' && datestr) {
      returnVar = this.datepipe.transform(datestr, CALENDAR_DATE_FORMAT);
    }
    return returnVar;
  }
}

