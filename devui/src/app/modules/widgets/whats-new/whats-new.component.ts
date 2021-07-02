import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Constants } from 'src/app/shared/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-whats-new',
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.css']
})
export class WhatsNewComponent implements OnInit {

  @Input()
  title: string = "";

  typeView: string = "table";

  cols: any[];
  data: any[] = [];
  categories: any[];

  dataChart: any;
  options: any;

  startDate: Date;
  endDate: Date;

  selectedCategory: any = null;
  isClick: boolean = false;

  minDate : Date = Constants.MIN_VALID_DATE;
  maxDate : Date = new Date();

  @ViewChild("dt",{static: true}) dt;

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  constructor(private util: AppUtils, private dashboardService: DashboardService, 
    private storageService : StorageService, private router : Router) { }

  ngOnInit() {

    this.checkDates();

    this.options = {
      legend: {
        position: 'left',
        display: false
      }
    };

    this.categories = [{ label: 'All Categories', value: null }];
    this.util.getAllCategoriesWidgets(this.categories).then((res: any) => {
      this.categories = res;
      this.cols = [
        { field: 'id', header: 'Rule ID' },
        { field: 'name', header: 'Rule Name' },
        { field: 'category', header: 'Category' },
        { field: 'provRuleCode', header: 'Provisional Rule ID' },
        { field: 'ideaCode', header: 'Idea Code' },
      ];

      this.loadData();
    });

  }

  /**
   * Change view (CHART, TABLE)
   * @param view view mode
   */
  changeView(view) {

    if (this.selectedCategory != null) {
      this.selectedCategory = null;
      this.dt.filter(null, 'category', 'contains');
    }

    if (view == "chart") {
      this.isClick = false;
    }

    if (this.typeView === view) {
      return;
    }

    this.typeView = view;

    if (this.typeView === "chart") {
      this.createChart();
    }
  }

  /**
   * Create donut chart when user select 'Chart' View
   */
  createChart() {

    let labels = [];
    let data = [];
    let colors = [];

    let availableColors = Constants.AVAILABLE_COLORS;

    let indexColor = 0;

    for (let i = 1; i < this.categories.length; i++) {
      labels.push(this.categories[i].label);
    }

    for (let i = 0; i < labels.length; i++) {
      let count = 0;

      for (let j = 0; j < this.data.length; j++) {
        if (labels[i] === this.data[j].category) {
          count++;
        }
      }

      data.push(count);
      colors.push(availableColors[indexColor]);

      indexColor++;

      if (indexColor > availableColors.length - 1) {
        indexColor = 0;
      }
    }

    this.dataChart = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }]
    };
  }

  /**
   * Load data from backend service and parse to correct structure
   */
  loadData() {

    this.data = [];

    let userId = this.util.getLoggedUserId();

    this.dashboardService.getNewRulesInECL(userId, this.startDate, this.endDate).subscribe((dataService: any) => {
      if (dataService.code == 200) {
        for (let i = 0; i < dataService.data.length; i++) {

          this.data.push({
            "id": dataService.data[i].ruleCode,
            "provRuleId": this.util.encodeString(dataService.data[i].provRuleId),
            "provRuleCode": dataService.data[i].provRuleCode,
            "ruleId": this.util.encodeString(dataService.data[i].ruleId),
            "name": dataService.data[i].ruleName,
            "category": dataService.data[i].categoryDesc,
            "ideaId" : this.util.encodeString(dataService.data[i].ideaId != undefined && dataService.data[i].ideaId != null ? dataService.data[i].ideaId : ""),
            "ideaCode" : dataService.data[i].ideaCode != undefined && dataService.data[i].ideaCode != null ? dataService.data[i].ideaCode : ""
          });
        }

        this.data = JSON.parse(JSON.stringify(this.data));

        if (this.typeView === "chart") {
          this.createChart();
        }
      }
    });
  }

  /**
   * Show table view filtered by category when user select one in chart view
   * @param event
   */
  selectData(event) {
    let category = (event.dataset[event.element._index]._model.label);
    this.changeView("table");
    this.isClick = true;
    this.selectedCategory = category;
    this.dt.filter(category, 'category', 'contains');
  }

  /**
   * Return to previous view
   */
  return() {
    this.selectedCategory = null;
    this.dt.filter(null, 'category', 'contains');
    this.typeView = "chart";
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
    if (this.storageService.exists("DATES_NEW_RULES_START")) {
      this.startDate = new Date(this.storageService.get("DATES_NEW_RULES_START", true).date);
    } else {
      this.startDate = new Date();
    }

    if (this.storageService.exists("DATES_NEW_RULES_END")) {
      this.endDate = new Date(this.storageService.get("DATES_NEW_RULES_END", true).date);
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
      this.storageService.set("DATES_NEW_RULES_START", { date: this.startDate }, true);
    } else {
      this.storageService.set("DATES_NEW_RULES_END", { date: this.endDate }, true);
    }
  }

  /**
   * Navigate to detail
   * @param id
   */
  redirect(id, type) {
    if(type === 'IDEA'){
      this.router.navigate(['newIdea', id]);
    } else {
      this.router.navigate(['item-detail', id, type]);
    }
    this.storageService.set("PARENT_NAVIGATION", "WHATS_NEW", false);
  }

}
