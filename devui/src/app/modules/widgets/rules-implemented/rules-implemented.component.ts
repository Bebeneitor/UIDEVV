import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Constants } from 'src/app/shared/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rules-implemented',
  templateUrl: './rules-implemented.component.html',
  styleUrls: ['./rules-implemented.component.css']
})
export class RulesImplementedComponent implements OnInit {

  @Input()
  title: string = "";

  @ViewChild("dt",{static: true}) dt;

  typeView: string = "bubble";

  cols: any[];
  data: any[] = [];
  categories: any[];

  startDate: Date;
  endDate: Date;

  bubbleData: any = [];

  minDate: Date = Constants.MIN_VALID_DATE;;
  maxDate: Date = new Date();

  engines: any = [
  ];

  selectedEngine: any = null;
  isClick: boolean = false;

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  
  constructor(private dashboardService: DashboardService,
    private utils: AppUtils, private storageService : StorageService,
    private router : Router) { }

  ngOnInit() {

    this.checkDates();

    this.categories = [{ label: 'All Categories', value: null }];
    this.utils.getAllCategoriesWidgets(this.categories).then((res: any) => {
      this.categories = res;
      this.cols = [
        { field: 'id', header: 'Rule ID' },
        { field: 'name', header: 'Rule Description' },
        { field: 'engine', header: 'Rule Processing Engine' },
        { field: 'category', header: 'Category' }
      ];

      this.engines.push({ label: 'All Engines', value: null });
      this.utils.getAllEnginesWidgets(this.engines).then((response : any) => {
        this.loadData();
      });
    });

  }

  /**
   * Change view mode (BUBBLE, TABLE)
   * @param view
   */
  changeView(view) {

    if (this.selectedEngine != null) {
      this.selectedEngine = null;
      this.dt.filter(null, 'engine', 'contains');
    }

    if (view == "bubble") {
      this.isClick = false;
    }

    if (this.typeView === view) {
      return;
    }

    this.typeView = view;

    if (this.typeView === "bubble") {
      this.createChart();
    }
  }

  /**
   * Create bubble view when user select 'Bubble'
   */
  createChart() {

    let availableColors = Constants.AVAILABLE_COLORS;
    let indexColor = 1;
    let children = [{ "name": "ALL", "value": this.data.length, "color": availableColors[0] }];

    for (let i = 1; i < this.engines.length; i++) {

      let count = 0;

      for (let j = 0; j < this.data.length; j++) {
        if (this.data[j].engine == this.engines[i].label) {
          count++;
        }
      }

      children.push({
        "name": this.engines[i].label,
        "value": count,
        "color": availableColors[indexColor]
      });

      indexColor++;

      if(indexColor > availableColors.length - 1) {
        indexColor = 0;
      }

    }

    this.bubbleData = children;
  }

  /**
   * Load data from service and parse to correct structure
   */
  loadData() {

    let is = this;

    this.data = [];

    this.dashboardService.getRulesImplemented(this.utils.getLoggedUserId(), this.startDate, this.endDate).subscribe((response: any) => {
      if (response.code == 200) {
        response.data.forEach(resp => {
          is.data.push({
            "id": resp.ruleCode,
            "name": resp.ruleName,
            "category": resp.categoryDesc,
            "engine": resp.ruleProcessEngine,
            "ruleId": this.utils.encodeString(resp.ruleId)
          });
        });
      }

      this.data = JSON.parse(JSON.stringify(this.data));

      if (this.typeView === "bubble") {
        this.createChart();
      }
    });
  }

  /**
   * Show table view filtered by engine selected in bubble view
   * @param engine
   */
  showFilteredData(engine) {

    if (engine.toUpperCase() == "ALL") {
      engine = null;
    }

    this.changeView("table");
    this.isClick = true;
    this.selectedEngine = engine;
    this.dt.filter(engine, 'engine', 'contains');
  }

  /**
   * Return to previous view
   */
  return() {
    this.selectedEngine = null;
    this.dt.filter(null, 'engine', 'contains');
    this.typeView = "bubble";
    this.isClick = false;
  }

  /**
   * Refresh data in widget
   */
  refresh() {
    this.loadData();
  }

  /**
   * Check if we have dates stored in session
   */
  checkDates() {
    if (this.storageService.exists("DATES_RULES_IMPLEMENTED_START")) {
      this.startDate = new Date(this.storageService.get("DATES_RULES_IMPLEMENTED_START", true).date);
    } else {
      this.startDate = new Date();
    }

    if (this.storageService.exists("DATES_RULES_IMPLEMENTED_END")) {
      this.endDate = new Date(this.storageService.get("DATES_RULES_IMPLEMENTED_END", true).date);
    } else {
      this.endDate = new Date();
    }
  }

  /**
   * Store date selected in session for this widget
   * @param type START OR END
   */
  saveDate(type) {
    if (type == "START") {
      this.storageService.set("DATES_RULES_IMPLEMENTED_START", { date: this.startDate }, true);
    } else {
      this.storageService.set("DATES_RULES_IMPLEMENTED_END", { date: this.endDate }, true);
    }
  }

  /**
   * Navigate to detail
   * @param id
   */
  redirect(id, type) {
    this.storageService.set("PARENT_NAVIGATION", "RULES_IMPLEMENTED", false);
    this.router.navigate(['item-detail', id, type]);
  }

}
