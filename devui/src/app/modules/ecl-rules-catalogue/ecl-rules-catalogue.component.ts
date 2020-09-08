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

enum SUBJECT {
  category = 'category',
  lob = 'lob', state = 'state', jurisdiction = 'jurisdiction', icd_desc = 'icd_desc', icd = 'icd',
  cpt_desc = 'cpt_desc', cpt = 'cpt', hcpcs_desc = 'hcpcs_desc', hcpcs = 'hcpcs',
  hcpcs_proc_type = 'hcpcs_proc_type', cpt_proc_type = 'cpt_proc_type', keyword = 'keyword',
  reference = 'reference_source', referenceTitle = 'reference_title', revenueCode = 'revenue_code',
  specialty = 'specialty', subspecialty = 'subspecialty', gender = 'gender_ind', rule_engine = "rule_engine", statusActive = 'status_active'
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
  referenceDocument: string = "";
  referenceTitle: string = "";
  procedureCode: string = "";
  dateFormat: string = Constants.DATE_FORMAT;
  startDate: Date;
  endDate: Date;
  minDate: Date = Constants.MIN_VALID_DATE;
  filters: any[] = [];

  maxDate: Date = new Date();
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

  @ViewChild('tableResults') tableResults: EclTableComponent;

  yearValidRange = `${Constants.MIN_VALID_YEAR}:${Constants.MAX_VALID_YEAR}`;
  disableView: boolean = false;
  disableSubSpecialty: boolean = true;
  isAdditionalSettings: boolean = true;
  showSelectionPanel: boolean = true;

  constructor(private utils: AppUtils, private dashboardService: DashboardService, private metadataCacheService: MetadataCacheService,
    private libraryViewService: LibraryViewService, private storageService: StorageService, private dialogService: DialogService,
    private router: Router, private cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
    private toastService: ToastMessageService, private confirmationService: ConfirmationService, private utilsService: UtilsService,) {
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
            });
          }
        } else {
          this.fillLastRequest();
          if (this.tableConfig !== null && this.storageService.exists(this.tableConfig.storageFilterKey)) {
            this.tableResults.tableModel = this.tableConfig;
            this.tableResults.hasPreviousFilter = true;
            this.viewFromSession();
          }
          this.selectedSpecialty.length ? this.disableSubSpecialty = false : this.disableSubSpecialty = true;
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
      if (this.tableConfig.storageFilterKey)
        this.storageService.remove(this.tableConfig.storageFilterKey);
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
      this.utils.getAllEngines(this.engines, false);

      this.references = [];
      this.utils.getAllReferencesValue(this.references, false);
      this.utils.getAllRevenueCodes(this.revenueCodes, false);
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
      switch (item.subject.toLowerCase()) {
        case SUBJECT.lob:
          if (isSavedFilter) this.selectedLobs = this.setDropdownCondValues(item, this.lobs);
          else filterConditionString = this.getConditionListString(SUBJECT.lob, item);
          break;
        case SUBJECT.category:
          if (isSavedFilter) this.selectedCategories = this.setDropdownCondValues(item, this.categories);
          else filterConditionString = this.getConditionListString(SUBJECT.category, item);
          break;
        case SUBJECT.jurisdiction:
          if (isSavedFilter) this.selectedJurisdictions = this.setDropdownCondValues(item, this.jurisdictions);
          else filterConditionString = this.getConditionListString(SUBJECT.jurisdiction, item);
          break;
        case SUBJECT.state:
          if (isSavedFilter) this.selectedStates = this.setDropdownCondValues(item, this.states);
          else filterConditionString = this.getConditionListString(SUBJECT.state, item);
          break;
        case SUBJECT.cpt_desc:
          if (isSavedFilter) {
            this.cptProcDesc = item.value;
            this.cptCodeDescInd = '1';
          } else filterConditionString = SUBJECT.cpt_desc.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          break;
        case SUBJECT.hcpcs_desc:
          if (isSavedFilter) {
            this.hcpcsProcDesc = item.value;
            this.hcpcsCodeDescInd = '1';
          } else filterConditionString = SUBJECT.hcpcs_desc.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          break;
        case SUBJECT.icd_desc:
          if (isSavedFilter) {
            this.icdProcDesc = item.value;
            this.icdCodeDescInd = '1';
          } else filterConditionString = SUBJECT.icd_desc.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          break;
        case SUBJECT.cpt:
          if (isSavedFilter) {
            this.cptProcCode = item.value;
            this.cptCodeDescInd = '0';
          } else {
            filterConditionString = SUBJECT.cpt.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          if (typeof item.associateCondition != 'undefined' && item.associateCondition) {
            if (isSavedFilter) this.selectedCptProcCodeCats = this.setDropdownCondValues(item.associateCondition, null);
            else filterConditionString = filterConditionString + ' AND ' + this.getConditionListString(SUBJECT.cpt_proc_type, item.associateCondition);
          }
          break;
        case SUBJECT.hcpcs:
          if (isSavedFilter) {
            this.hcpcsProcCode = item.value;
            this.hcpcsCodeDescInd = '0';
          } else {
            filterConditionString = SUBJECT.hcpcs.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          if (typeof item.associateCondition != 'undefined' && item.associateCondition) {
            if (isSavedFilter) this.selectedHcpcProcCodeCats = this.setDropdownCondValues(item.associateCondition, null);
            else filterConditionString = filterConditionString + ' AND ' + this.getConditionListString(SUBJECT.hcpcs_proc_type, item.associateCondition);
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
          } else filterConditionString = this.getConditionListString(SUBJECT.specialty, item);
          break;
        case SUBJECT.subspecialty:
          this.filterSubSpecialty();
          if (isSavedFilter) {
            this.selectedSubSpecialty = this.setDropdownCondValues(item, this.subSpecialtyFiltered);
            this.additionalSearchPanelHeader = HIDE_SEARCH_HEADER;
            this.isAdditionalSettings = false;
          } else filterConditionString = this.getConditionListString(SUBJECT.subspecialty, item);
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
          }  else {
            filterConditionString = this.getConditionListString(SUBJECT.rule_engine, item);
          }
          break;
        case SUBJECT.statusActive:
          let statusActive = (item.value == 'true');
          if (isSavedFilter) {
            this.statusActive = statusActive;
          } else {
            filterConditionString = SUBJECT.statusActive.toUpperCase() + ' ' + item.operator + ' "' + item.value + '" ';
          }
          break; 
      }

      if (!isSavedFilter) {
        if (index > 0)
          conditionString = conditionString + ' ' + item.preOperator + ' ' + filterConditionString;
        else
          conditionString = filterConditionString;
      }
    });

    return conditionString;
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
      if (null != masterList) selArray.push(this.getIdFromValue(masterList, data));
      else selArray.push(data);
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
    if (this.selectedCategories.length > 0)
      this.buildListCondition(SUBJECT.category, this.selectedCategories, 'in', this.categories);
    if (this.selectedLobs.length > 0)
      this.buildListCondition(SUBJECT.lob, this.selectedLobs, 'in', this.lobs);
    if (this.selectedStates.length > 0)
      this.buildListCondition(SUBJECT.state, this.selectedStates, 'in', this.states);
    if (this.selectedJurisdictions.length > 0)
      this.buildListCondition(SUBJECT.jurisdiction, this.selectedJurisdictions, 'in', this.jurisdictions);

    if (typeof this.hcpcsProcDesc != 'undefined' && this.hcpcsProcDesc)
      this.buildStringCondition(SUBJECT.hcpcs_desc, this.hcpcsProcDesc, 'like', false);
    if (typeof this.cptProcDesc != 'undefined' && this.cptProcDesc)
      this.buildStringCondition(SUBJECT.cpt_desc, this.cptProcDesc, 'like', false);
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
    if (typeof this.statusActive != 'undefined' && this.statusActive)
      this.buildStringCondition(SUBJECT.statusActive, this.statusActive, '=', false);
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
      if (SUBJECT.cpt == subject && this.selectedCptProcCodeCats.length > 0) {
        let codeDto = new EclCacheLbvSearchDto();
        codeDto.operator = 'in';
        codeDto.subject = SUBJECT.cpt_proc_type;
        codeDto.preOperator = 'and';
        codeDto.value = this.selectedCptProcCodeCats.join();
        this.lbvSearchDto.associateCondition = codeDto;
      } else if (SUBJECT.hcpcs == subject && this.selectedHcpcProcCodeCats.length > 0) {
        let codeDto = new EclCacheLbvSearchDto();
        codeDto.operator = 'in';
        codeDto.subject = SUBJECT.hcpcs_proc_type;
        codeDto.preOperator = 'and';
        codeDto.value = this.selectedHcpcProcCodeCats.join();
        this.lbvSearchDto.associateCondition = codeDto;
      }

    }
    if (null != this.eclCacheRequest &&
      this.eclCacheRequest.length > 0) {
      this.lbvSearchDto.preOperator = 'and';
    }
    this.eclCacheRequest.push(this.lbvSearchDto);
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
    json["logicEffectiveDate"] = {
      "initialDate": this.startDate,
      "finalDate": this.endDate
    };
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

      // set url value:            
      this.tableConfig.url = RoutingConstants.CACHE_URL + RoutingConstants.CACHE_LIBRARY_VIEW_SEARCH;

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

      // set url value:      
      this.tableConfig.url = RoutingConstants.METADATA_URL + "/" + RoutingConstants.METADATA_TAG_DETAILS;
      this.tableResults.clearFilters();
      this.tableResults.totalRecords = 0;
      this.tableResults.selectedRecords = [];
      this.tableResults.savedSelRecords = [];
      this.tableResults.loadData(null);
      resolve();
    });
  }


  checkHcpcs(event) {
    if (this.hcpcsCodeDescInd == '1') {
      this.selectedHcpcProcCodeCats = [];
      this.hcpcsProcCode = '';
    } else {
      this.hcpcsProcDesc = '';
    }
  }

  checkCpt(event) {
    if (this.cptCodeDescInd == '1') {
      this.selectedCptProcCodeCats = [];
      this.cptProcCode = '';
    } else {
      this.cptProcDesc = '';
    }
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
        break;
      case SUBJECT.cpt:
        this.cptProcCode = '';
        this.selectedCptProcCodeCats = [];
        break;
      case SUBJECT.icd:
        this.icdProcCode = '';
        break;
      case SUBJECT.hcpcs_desc:
        this.hcpcsProcDesc = '';
        break;
      case SUBJECT.cpt_desc:
        this.cptProcDesc = '';
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

    this.startDate = null;
    this.endDate = null;
    this.initiateTableModel();
    this.storageService.remove(RULE_CATALOG_LAST_REQUEST);
    this.storageService.remove(RULE_CAT_CACHE_LAST_REQUEST);
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
    this.disableView = false;
    this.disableTag = false;
    this.disableTagSequence = false;
    this.selectedData = [];
    this.selectedRuleIds = [];
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
    if (null != this.eclCacheRequest && this.eclCacheRequest.length > 0) {
      let previousFilterCondition = this.filterCondition;
      this.filterCondition = this.getValuesfromFilterDto(JSON.stringify(this.eclCacheRequest), false);
      if (previousFilterCondition !== this.filterCondition) {
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
            if (existFilterName === true && !this.viewFlag) {
              this.retrieveTagResults();
            } else {
              this.disableSave = false;
              if (this.returnedFilterDto !== undefined && this.returnedFilterDto !== null) {
                this.tableConfig.checkBoxSelection = true;
                let existingFilter = this.filterNames.filter(existFilter => existFilter.value === this.returnedFilterDto.filterId);
                if (!existingFilter.length)
                  this.filterNames.push({ label: this.returnedFilterDto.filterName, value: this.returnedFilterDto.filterId });
              } else {
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

  retrieveTagResults() {
    this.loadRulesDetails(Constants.SELECTED_TAG);
    this.disableSave = true;
    this.tableConfig.checkBoxSelection = false;
    this.tableResults.selectedRecords = [];
  }


  checkToTrigger(event: any) {
    let lastRequest = this.storageService.get(RULE_CATALOG_LAST_REQUEST, true);
    let lastCacheRequest = this.storageService.get(RULE_CAT_CACHE_LAST_REQUEST, true);

    if (lastRequest != null) {
      let foundStatusActive = lastCacheRequest.find(condition => {
        return condition.subject === SUBJECT.statusActive
      });

      let lengthOfLastCacheRequest = Object.keys(lastCacheRequest).length;
      if ((event == true && typeof foundStatusActive == 'undefined') || (event == false && typeof foundStatusActive !== 'undefined' && lengthOfLastCacheRequest > 1)) {
        let previousFilterRequest = lastRequest;
        let currentFilterRequest = this.getJsonRequest();

        delete previousFilterRequest.statusActive;
        delete currentFilterRequest["statusActive"];

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
    this.tableResults.selectedRecords = [];
    if (this.selectedFilterName === ' ') {
      this.filterCondition = "";
      this.selectedTagSequenceId = "";
    } else if (this.selectedFilterName === 0) {
      if (this.filterCondition == "") {
        let warnMessage: string = 'Please select search conditions to create a filter';
        this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 5000, true);
      } else {
        this.createNewFilter();
      }
    } else {
      if (typeof this.associatedTagDetails != undefined && this.associatedTagDetails) {
        this.disableSave = true;
        this.tableConfig.checkBoxSelection = false;
        this.associatedTagDetails.forEach((filter: FilterTagSequenceDto) => {
          if (event.value === filter.filterDto.filterId) {
            this.selectedFilterNameLabel = filter.filterDto.filterName;
            this.filterCondition = this.getValuesfromFilterDto(filter.filterDto.filterCondition, false);
            this.selectedTagSequenceId = filter.tagSequenceDto.tagSequenceId;
            this.loadRulesDetails(Constants.SELECTED_FILTER);
            if (this.selectedFilterName != 0 && this.selectedFilterName != ' ' && this.filterCondition != '' && filter.filterDto.filterCondition != '') {
              this.savedFilterReset();
              this.selectedSavedFilter = [];
              this.getValuesfromFilterDto(filter.filterDto.filterCondition, true);
            }
            //disable tagname, tagsequence  & view button if the currently selected filter is not created by logged in user and it is a private filter
            this.disableView = filter.filterDto.disableView;
            if (this.disableView) {
              this.disableTag = true;
              this.disableTagSequence = true;
            } else {
              this.disableTag = false;
              this.disableTagSequence = false;
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
          //disable view button if the currently selected filter is not created by logged in user and it is a private filter
          this.disableView = filter.filterDto.disableView;
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
              });
              this.loadRulesDetails(Constants.SELECTED_FILTER);
              this.tableResults.selectedRecords = [];
              this.disableSave = true;
              this.tableConfig.checkBoxSelection = false;
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

  hasSelectedItems() {
    if (this.selectedLobs.length == 0 && this.selectedStates.length == 0 && this.selectedJurisdictions.length == 0 
      && this.selectedCategories.length == 0 && this.selectedReferences.length == 0 && this.selectedHcpcProcCodeCats.length == 0 
      && this.selectedCptProcCodeCats.length == 0 && this.selectedRevCodes.length == 0 && this.hcpcsProcCode == '' 
      && this.hcpcsProcDesc == '' && this.cptProcCode == '' && this.cptProcDesc == '' && this.icdProcCode == '' 
      && this.icdProcDesc == '' && this.referenceTitle == '' && this.keyword == '' && this.selectedGender == 0 
      && this.selectedSpecialty.length == 0  && this.selectedSubSpecialty.length == 0 && this.selectedEngines.length == 0 && this.statusActive == false) {
        return true;
    }
    return false;
  }

}
