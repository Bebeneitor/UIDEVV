import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/shared/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { BaseResponse } from 'src/app/shared/models/base-response';

const TYPE_CHART = 'chart';
const TYPE_TABLE = 'table';
const SHELVED_LABEL = 'Shelved';
const INVALID_LABEL = 'Invalid';
const DUPLICATED_LABEL = 'Duplicated'

@Component({
  selector: 'app-deprecated-rules',
  templateUrl: './deprecated-rules.component.html',
  styleUrls: ['./deprecated-rules.component.css']
})
export class DeprecatedRulesComponent implements OnInit {

  @Input()
  title: string = "";

  typeView: string = TYPE_CHART;

  colsProvisionalRule: any[];
  colsIdeas: any[];
  dataShelved: any[] = [];
  dataInvalid: any[] = [];
  dataDuplicated: any[] = [];
  categories: any[];

  dataChart: any;
  options: any;

  startDate: Date;
  endDate: Date;
  userId: number;

  selectedCategory: any = null;
  isClick: boolean = false;

  minDate: Date = Constants.MIN_VALID_DATE;
  maxDate: Date = new Date();

  activeIndex: number = 0;

  counters: any = null;
  totalItems: number = 0;

  @ViewChild('dd',{static: true}) dd;
  @ViewChild('ds',{static: true}) ds;
  @ViewChild('di',{static: true}) di;

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  constructor(private dashBoardService: DashboardService, private util: AppUtils,
    private router: Router, private storageService: StorageService, private eclConstantsService: ECLConstantsService) { }

  ngOnInit() {

    this.options = {
      legend: {
        position: 'bottom'
      }
    };

    this.checkDates();

    this.categories = [{ label: 'All', value: null }];
    this.util.getAllCategoriesWidgets(this.categories).then((res: any) => {

      this.categories = res;

      this.colsProvisionalRule = [
        { field: 'ruleCode', header: 'Provisional Rule ID' },
        { field: 'ruleName', header: 'Provisional Rule Name' },
        { field: 'ruleDescription', header: 'Provisional Rule Description' },
        { field: 'categoryDesc', header: 'Category' }
      ];

      this.colsIdeas = [
        { field: 'ruleCode', header: 'Idea ID' },
        { field: 'ruleName', header: 'Idea Name' },
        { field: 'ruleDescription', header: 'Idea Description' },
        { field: 'categoryDesc', header: 'Category' }
      ];

      this.loadCounters();
    });

  }

  /**
   * Change the view type in screen
   * @param view type of view
   */
  changeView(view) {

    if (view == TYPE_CHART) {
      this.isClick = false;
    }

    if (this.typeView === view) {
      return;
    }

    this.typeView = view;

    if (this.typeView === TYPE_CHART) {
      this.loadCounters();
    } else {
      this.loadData();
    }
  }

  /**
   * Create donut chart when user select chart view
   */
  createChart() {

    let labels = [SHELVED_LABEL, INVALID_LABEL, DUPLICATED_LABEL];
    let data = [];

    this.totalItems = 0;

    this.counters.forEach(counter => {
      this.totalItems = this.totalItems + counter.count;
    });

    labels.forEach(label => {

      let count = 0;

      this.counters.forEach(counter => {
        if (counter.ruleDescr == label) {
          count = counter.count;
        }
      });

      data.push(count);

    });

    this.dataChart = {
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(149, 121, 211, 0.6)',
          'rgba(51, 51, 51, 0.6)',
          'rgba(233, 0, 139, 0.6)'
        ],
        label: 'Deprecated Items'
      }],
      labels: labels
    };
  }

  loadCounters() {
    this.dashBoardService.getCountDeprecatedItems(this.startDate, this.endDate).subscribe((response: any) => {
      this.counters = response.data;

      this.createChart();
    });
  }

  /**
   * Load data from the service in base of dates
   */
  loadData() {

    let label = '';

    switch (this.activeIndex) {
      case 0:
        label = SHELVED_LABEL;
        break;
      case 1:
        label = INVALID_LABEL;
        break;
      case 2:
        label = DUPLICATED_LABEL;
        break;
    }

    //getStatus
    let status = -1;

    this.counters.forEach(counter => {
      if (counter.ruleDescr == label) {
        status = counter.ruleStatusId;
      }
    });

    this.dashBoardService.getListDeprecatedItems(this.startDate, this.endDate, status).subscribe((response: any) => {

      switch (this.activeIndex) {
        case 0:
          this.dataShelved = response.data;
          this.dataShelved = JSON.parse(JSON.stringify(this.dataShelved));
          break;
        case 1:
          this.dataInvalid = response.data;
          this.dataInvalid = JSON.parse(JSON.stringify(this.dataInvalid));
          break;
        case 2:
          this.dataDuplicated = response.data;
          this.dataDuplicated = JSON.parse(JSON.stringify(this.dataDuplicated));
          break;
      }
    });

  }

  /**
   * Event when user clicks on category inside donut chart, the page will show all records
   * with that categry
   * @param event
   */
  selectData(event) {
    let label = (event.dataset[event.element._index]._model.label);
    
    this.isClick = true;
    switch (label) {
      case SHELVED_LABEL:
        this.activeIndex = 0;
        break;
      case INVALID_LABEL:
        this.activeIndex = 1;
        break;
      case DUPLICATED_LABEL:
        this.activeIndex = 2;
        break;
    }

    this.changeView(TYPE_TABLE);

  }

  handleChange(event) {
    this.activeIndex = event.index;
    this.loadData();
  }

  /**
   * Change again to chart view
   */
  return() {
    this.selectedCategory = null;
    this.typeView = TYPE_CHART;
    this.isClick = false;
  }

  /**
   * Action for refresh data
   */
  refresh() {
    if (this.typeView == TYPE_CHART) {
      this.loadCounters();
    } else {
      this.loadData();
    }
  }

  /**
   * Navigate to detail
   * @param id
   */
  redirect(rowData, type) {
    if (rowData.type === this.eclConstantsService.RULE_STAGE_PROVISIONAL_RULE_DESCRIPTION) {
      type = this.eclConstantsService.RULE_STAGE_DESCRIPTION;
    }
    this.storageService.set('PARENT_NAVIGATION', 'DEPRECATED_RULES', false);
    this.router.navigate(['item-detail', this.util.encodeString(rowData.ruleId), type]);
  }

  /**
   * Check if we have dates stored in session
   */
  checkDates() {
    if (this.storageService.exists('DATES_DEPRECATED_RULES_START')) {
      this.startDate = new Date(this.storageService.get('DATES_DEPRECATED_RULES_START', true).date);
    } else {
      this.startDate = new Date();
    }

    if (this.storageService.exists('DATES_DEPRECATED_RULES_END')) {
      this.endDate = new Date(this.storageService.get('DATES_DEPRECATED_RULES_END', true).date);
    } else {
      this.endDate = new Date();
    }
  }

  /**
   * Store date selected in session for this widget
   * @param type START OR END
   */
  saveDate(type) {
    if (type == 'START') {
      this.storageService.set('DATES_DEPRECATED_RULES_START', { date: this.startDate }, true);
    } else {
      this.storageService.set('DATES_DEPRECATED_RULES_END', { date: this.endDate }, true);
    }
  }

}
