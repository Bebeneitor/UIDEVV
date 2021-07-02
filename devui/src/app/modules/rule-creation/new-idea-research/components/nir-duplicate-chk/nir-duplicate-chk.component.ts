import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { ActivatedRoute } from '@angular/router';
import { LineOfBusiness } from 'src/app/shared/models/line-of-business';
import { IdeaService } from 'src/app/services/idea.service';
import { debounceTime, distinctUntilChanged, mergeMap, map } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { OverlayPanel, MessageService, DialogService } from 'primeng/primeng';
import { NewIdeaComponent } from '../../../new-idea/newIdea.component';
import { ProvisionalRuleComponent } from '../../../provisional-rule/provisional-rule.component';
import { Table } from 'primeng/table';
import { Constants } from 'src/app/shared/models/constants';


const EXISTING_IDEA = Constants.EXISTING_IDEA;
const INVALID_IDEA = Constants.INVALID_IDEA;
const NULL_IDEA = Constants.NULL_IDEA;
const RULE_STAT_LIB_RULE = 9;

@Component({
  selector: 'NirDuplicateChk',
  templateUrl: './nir-duplicate-chk.component.html',
  styleUrls: ['./nir-duplicate-chk.component.css'],
  providers: []
})

export class NewIdeaResearchDuplicateCheckComponent implements OnInit {

  @Input() readOnlyView;
  @ViewChild('dt',{static: true}) dataTable: Table;

  //Primeng Values
  data: any[] = [];
  tempData: any[] = [];
  cols: any[];
  userId: number;
  duplicateStatus: any[];
  ideaStatus: any[];

  //Filtering
  totalRecords: number;
  toggleSH: boolean = true;
  dupCmtToggle: boolean = true;
  ideaCmtToggle: boolean = true;
  lob: LineOfBusiness;
  lobs: any[];
  selectedDupStatus: number = 0;
  inputDupCmt: string;
  selectedIdeaStatus: number = 0;
  inputIdeaStatusCmt: string;
  customToolTip: string;

  // Search Query
  searchString: string;
  searchUpdated = new Subject<String>();
  searchChangeBool: boolean = false;
  newSearch: string;
  searchChanged: Subject<string> = new Subject<string>();
  setRow: number;
  setOne: number = 1;
  ruleStatus: number;
  pageName: string;
  loading: boolean;

  constructor(private util: AppUtils, public route: ActivatedRoute,
    private ideaService: IdeaService, private searchMessage: MessageService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.searchChanged.pipe(
      map(event => event),
      debounceTime(1200),
      distinctUntilChanged(),
      mergeMap(search => of(search).pipe(
        debounceTime(1200)
      )),
    ).subscribe(item => {
      if (item === "") {
        this.data = undefined;
        this.setOne = 0;
        this.loading = false;
      } else {
        const validationResult = this.validateSearchCriteriaWildcard(item);
        if (validationResult.isNotValid) {
          this.searchMessage.add({ severity: 'warn', summary: 'Input',
            detail: Constants.ERROR_SEARCHING_WITH_WC_START_END.replace('replaceWord', validationResult.reservedWord.toUpperCase()),
            life: 2000, closable: false });
          this.searchChangeBool = true;
        } else if (item.length < 3) {
          this.searchMessage.add({ severity: 'warn', summary: 'Input', detail: 'Must have more than 3 letter or numbers!', life: 2000, closable: false })
          this.searchChangeBool = true;
        } else if (item.match(Constants.SPECIAL_CHAR)) {
          this.searchMessage.add({ severity: 'warn', summary: 'Input', detail: 'Cannot have special character in the search!', life: 2000, closable: false })
          this.searchChangeBool = true;
        } else {
          this.loading = true;
          this.ideaService.findByNewIdeaSearch(item).pipe(map((data: any) => {
            const modifiedData = [];
            data.data.forEach(element => {
              modifiedData.push({
                ...element,
                cptCode: (element.denyProcedureCodes ? element.denyProcedureCodes + ' ' + Constants.DASH_CHAR + ' ' : '')
                  + (element.pendingProcedureCodes ? element.pendingProcedureCodes + ' ' + Constants.DASH_CHAR + ' ' : '')
                  + (element.reduceProcedureCodes ? element.reduceProcedureCodes + ' ' + Constants.DASH_CHAR + ' ' : '')
                  + (element.reduceUnits ? element.reduceUnits + ' ' + Constants.DASH_CHAR + ' ' : '')
                  + (element.applyPercReduction ? element.applyPercReduction : '')
              });
            });
            return { ...data, data: modifiedData };
          })).subscribe((list: any) => {
            this.data = list.data;
            if (this.data.length === 0) {
              this.searchMessage.add({ severity: 'success', summary: 'Info', detail: 'No search result found', life: 2000, closable: false })
              this.setOne = 0;
            } else {
              this.searchMessage.add({ severity: 'success', summary: 'Info', detail: 'Search result was a success!', life: 2000, closable: false })
              this.setOne = 1;
            }
            this.setRow = this.dataTable.rows;
            this.tempData = list.data;
            this.searchChangeBool = true;
            this.loading = false;
          })
        }
      }
    });

    this.duplicateStatus = [{ label: 'New Idea', value: 1 }, { label: 'Existing Idea', value: EXISTING_IDEA }];
    this.ideaStatus = [{ label: 'Valid Idea', value: 1 }, { label: 'Invalid Idea', value: INVALID_IDEA }];

    this.route.data.subscribe(params => {
      this.ruleStatus = params['ruleStatus'];
      this.pageName = params['pageTitle'];
      this.userId = this.util.getLoggedUserId()
    });

    this.updateDupStatus();
    this.updateIdeaStatus();
    this.cols = [
      { field: 'code', header: 'Id' },
      { field: 'lineOfBusiness', header: 'Line of Business' },
      { field: 'category', header: 'Category' },
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description', width: '210px' },
      { field: 'cptCode', header: 'CPT Code' },
      { field: 'status', header: 'Status' }
    ];
    if (this.selectedDupStatus === 2 || this.selectedDupStatus === 1) {
      document.getElementById('disable-dup-state').setAttribute('disabled', 'true');
      document.getElementById('disable-dup-state').removeAttribute('disabled');
    }
    if (this.selectedIdeaStatus === 2 || this.selectedIdeaStatus === 1) {
      document.getElementById('disable-idea-state').setAttribute('disabled', 'true');
      document.getElementById('disable-idea-state').removeAttribute('disabled');
    }
  }

  clearSearchBox() {
    if (this.data) {
      this.searchChanged.next('');
      this.searchString = '';
      this.searchChangeBool = false;
    } else {
      this.searchString = '';
      this.searchChangeBool = false;
    }

  }

  /**
   * This method validates the search criteria and return a object with two properties true or false in case the query 
   * is valid or not, and the reserved word to send warning message if starts and ends with any reserved words.
   * @param query to be evaluated. 
   */
  validateSearchCriteriaWildcard(query: string) {
    let isNotValid = false;
    let reservedWord = '';
    for (let index = 0; index < Constants.RESERVED_WORDS.length; index++) {
      const formattedItem = query.toLowerCase().trim();
      reservedWord = Constants.RESERVED_WORDS[index];
      if(formattedItem.includes(reservedWord)){
        isNotValid = (formattedItem.startsWith(reservedWord)||formattedItem.endsWith(reservedWord));
        if (isNotValid){
          return {isNotValid, reservedWord};
        }
      }
    }
    return {isNotValid, reservedWord};
  }

  paginate(event) {
    if (this.setRow !== this.dataTable.rows) {
      this.setRow = this.dataTable.rows;
      let lastPage = Math.ceil(this.dataTable.totalRecords / this.dataTable.rows);
      let page = lastPage - 1;
      this.dataTable.onPageChange({
        lastPage,
        page,
        first: page * this.dataTable.rows,
        rows: this.dataTable.rows
      });

    }

  }

  colShouldOrder(col: any): boolean {
    let woOrder = ["review", "comments", "matches", "chsel"];
    return (woOrder.indexOf(col.field) < 0);
  }

  colShouldHaveInpControl(col: any): boolean {
    let wInpCtl = ['ruleCode', 'ruleName'];
    return (wInpCtl.indexOf(col.field) >= 0);
  }

  print() {
    window.print();
  }

  showCurrent(event, description: string, overlaypanel: OverlayPanel) {
    overlaypanel.toggle(event);
    this.customToolTip = description;

  }

  showCurrentCptCode(event, cptCode: string, overlaypanel: OverlayPanel) {
    overlaypanel.toggle(event);
    this.customToolTip = cptCode;

  }

  updateDupStatus() {
    if (this.selectedDupStatus === NULL_IDEA) {
      this.dupCmtToggle = true;
    } else if (this.selectedDupStatus === EXISTING_IDEA) {
      this.dupCmtToggle = false;
    } else {
      this.dupCmtToggle = false;
    }
  }

  updateIdeaStatus() {
    if (this.selectedIdeaStatus === NULL_IDEA) {
      this.ideaCmtToggle = true;
    } else if (this.selectedIdeaStatus === INVALID_IDEA) {
      this.ideaCmtToggle = false;
    } else {
      this.ideaCmtToggle = false;
    }
  }

  /**
   * Determine if selected row represents an idea.
   * @param rowData Selected row.
   */
  isIdeaRow(rowData: any): boolean {
    return (0 === rowData.ruleStatusId);
  }
  /**
   * Response to click event. Show Idea or Rule details info.
   * @param rowData Selected date.
   */
  onIdClick(rowData: any) {
    if (this.isIdeaRow(rowData)) {
      this.showIdeaDetailsScreen(rowData);
    } else {
      this.showRuleDetailsScreen(rowData);
    }
  }

  showIdeaDetailsScreen(rowData: any) {
    this.dialogService.open(NewIdeaComponent, {
      data: {
        ideaId: rowData.id,
      },
      header: 'Idea Details',
      width: '80%',
      height: '95%',
      contentStyle: { "max-height": "95%", "overflow": "auto" }
    });
  }

  showRuleDetailsScreen(rowData: any) {
    this.dialogService.open(ProvisionalRuleComponent, {
      data: {
        ruleId: rowData.id,
        ruleReview: true,
        provisionalRuleCreation: false,
        readWrite: false,
        readOnlyView: true,
        fromMaintenanceProcess: (RULE_STAT_LIB_RULE === rowData.ruleStatusId ? true : false)
      },
      header: (RULE_STAT_LIB_RULE === rowData.ruleStatusId ? 'Library Rule Details' : 'Provisional Rule Details'),
      width: '80%',
      height: '92%',
      closeOnEscape: false,
      closable: false,
      contentStyle: { 
        'max-height': '92%', 
        'overflow': 'auto',
        'padding-top': '0', 
        'padding-bottom': '0', 
        'border': 'none' }
    })
  }
}
