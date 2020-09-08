import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LazyLoadEvent, DialogService } from 'primeng/api';
import { IdeaService } from 'src/app/services/idea.service';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { StorageService } from 'src/app/services/storage.service';
import { lvsDto } from 'src/app/shared/models/dto/library-view-search-dto';
import { AppUtils } from 'src/app/shared/services/utils';
import { ProvisionalRuleComponent } from '../rule-creation/provisional-rule/provisional-rule.component';

@Component({
  selector: 'app-library-view',
  templateUrl: './library-view.component.html',
  styleUrls: ['./library-view.component.css']
})
export class LibraryViewComponent implements OnInit, AfterViewInit {

  cols: any[];

  //Filtering
  data: any[] = [];

  totalRecords: number;
  searchForm: FormGroup;

  //ngModel
  selectedBusiness: any[];
  toggleSH: boolean = true;

  //Interface Object to transfer values over to back-end
  lvsDto: lvsDto = {
    lob: 0, jurisdiction: 0, state: 0, category: 0,
    ruleDescription: '', references: '', SourceID: 0, ruleLogic: '',
    begin: null, end: null, pageNumber: -1, pageSize: 500, rows: 0, orderBy: 'r.ruleId', order: 'ASC'
  };

  constructor(private idSrv: IdeaService,
    private rule: RuleInfoService,
    private util: AppUtils,
    private strSrv: StorageService,
    private fb: FormBuilder, private dialogService: DialogService) {
  }

  
  ngOnInit() {
    this.searchForm = this.fb.group({
      lobControl: ['testLob'],
      jurControl: ['testjur'],
      stateControl: ['teststate'],
      catControl: ['testcat'],
      refControl: ['testref']
    });

    this.lvsDto.begin = new Date("1970-01-01T19:00:00.000Z");
    this.lvsDto.end = new Date("1970-01-01T19:00:00.000Z");

    this.cols = [
      { mdlField: 'ruleId', field: 'ruleId', header: 'Rule ID', width: '90px' },
      { mdlField: 'ruleDescription', field: 'ruleDesc', header: 'Rule Description', width: '280px' },
      { mdlField: 'lob.lobDesc', field: 'lobDesc', header: 'Line of Business' },
      { mdlField: 'category.categoryDesc', field: 'categoryDesc', header: 'Category' },
      { mdlField: 'state.stateDesc', field: 'state', header: 'State' },
      { mdlField: 'jurisdiction.jurisdictionDesc', field: 'jurisdiction', header: 'Jurisdiction' }
    ];

  }

  ngAfterViewInit() {

  }

  lazyLoad(event: LazyLoadEvent) {
    this.lvsDto.pageNumber = event.first
    this.lvsDto.pageSize = event.rows

    let field = event.multiSortMeta
    if (field !== undefined) {
      field.forEach(field => {

        if (field.field === 'ruleId') {
          this.lvsDto.orderBy = 'r.ruleId';
        }
        else if (field.field === 'lobDesc') {
          this.lvsDto.orderBy = "r.lob";
        }
        else if (field.field === 'ruleDesc') {
          this.lvsDto.orderBy = "r.ruleDescription";
        }
        else if (field.field === 'categoryDesc') {
          this.lvsDto.orderBy = 'r.category';
        }
        else if (field.field === 'state') {
          this.lvsDto.orderBy = 'r.state';
        }
        else {
          this.lvsDto.orderBy = 'r.jurisdiction';
        };

        const orderNum = field.order;
        if (orderNum === -1) {
          this.lvsDto.order = 'DESC';

        } else {
          this.lvsDto.order = 'ASC';
        };
      })
    };

    if (this.lvsDto.lob !== 0 && this.lvsDto.jurisdiction !== 0 && this.lvsDto.state !== 0 && this.lvsDto.category !== 0,
        this.lvsDto.SourceID !== 0 && this.lvsDto.references !== '', this.lvsDto.ruleDescription !== '', this.lvsDto.ruleLogic !== '') {
        this.searchSubmit();
    }

  }

  clear() {
    this.lvsDto.lob = 0
    this.lvsDto.jurisdiction = 0;
    this.lvsDto.state = 0;
    this.lvsDto.category = 0;
    this.lvsDto.references = '';
    this.lvsDto.SourceID = 0;
    this.lvsDto.ruleDescription = '';
    this.lvsDto.ruleLogic = '';
    this.lvsDto.begin = new Date("1970-01-01T19:00:00.000Z");
    this.lvsDto.end = new Date("1970-01-01T19:00:00.000Z");
    this.data = [];

  }
  private async countSearch() {
    const tmpnum = this.lvsDto.pageNumber;
    this.lvsDto.pageNumber = -1;

    this.rule.getLibViewSearch(this.lvsDto).subscribe((data: []) => {

      this.totalRecords = data.length;
      this.lvsDto.pageSize = 10;
    });

    this.lvsDto.pageNumber = tmpnum;
  }

  private async searchSubmit() {

    this.countSearch();

    this.rule.getLibViewSearch(this.lvsDto).subscribe((data: []) => {

      let tmpData = [];

      data.forEach(ele => {

        let elset = [];
        this.cols.forEach(col => {
          elset[col.field] = this.getPropByString(ele, col.mdlField);
        })
        tmpData.push(elset);
      });
      this.data = tmpData;

    });
  }

  private medicareCheck() {
    
  }

  //onChange & Input $event will call this to set up the dto to be transferred over.
  lobInput(event) {
    this.lvsDto.lob = event.value
    
  }
  jurInput(event) {
    this.lvsDto.jurisdiction = event.value;
  }
  stateInput(event) {
    this.lvsDto.state = event.value;
  }
  catInput(event) {
    this.lvsDto.category = event.value;
  }
  refDocInput(event) {
    this.lvsDto.references = event;
  }
  refSrcInput(event) {
    this.lvsDto.SourceID = event.value;
  }
  ruleDescInput(event) {
    this.lvsDto.ruleDescription = event;
  }
  ruleLogicInput(event) {
    this.lvsDto.ruleLogic = event;
  }
  beginInput(event) {
    this.lvsDto.begin = new Date(event);
    this.lvsDto.begin.toUTCString();
  }
  endInput(event) {
    this.lvsDto.end = new Date(event);
    this.lvsDto.end.toUTCString();
  }
  //What does this do?
  getPropByString(obj: any, propString: string): any {
    if (!propString)
      return obj;

    let props = propString.split('.');
    let index = 0;

    for (let i = 0, iLen = props.length - 1; i < iLen; i++) {
      let prop = props[i];
      let candidate = obj[prop];
      if (candidate !== undefined) {
        obj = candidate;
        index = i;
      } else {
        break;
      }
    }
    return obj == null ? null : obj[props[index]];
  }

  viewRuleDialog(ruleId: any) {

    const ref = this.dialogService.open(ProvisionalRuleComponent, {
        data: {
            ruleId: ruleId,
            header: 'Library View'
        },
        header: 'Rule Details',
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
    });
}



}
