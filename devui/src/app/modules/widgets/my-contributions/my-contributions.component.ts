import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Constants } from 'src/app/shared/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-contributions',
  templateUrl: './my-contributions.component.html',
  styleUrls: ['./my-contributions.component.css']
})

export class MyContributionsComponent implements OnInit {

  @Input()
  title: string = '';

  typeView: string = "chart"; //table and chart

  startDate: Date;
  endDate: Date;

  data: any; // Data chart

  selectedTab: string = "rules";

  //Tables
  colsRules: any[];
  dataRules: any[] = [];

  colsIdeas: any[];
  dataIdeas: any[] = [];

  categories: any[];

  minDate: Date = Constants.MIN_VALID_DATE;;
  maxDate: Date = new Date();

  @ViewChild("dt2") dt2;
  @ViewChild("dt3") dt3;

  options: any;

  @ViewChild('start') start;

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  constructor(private utils: AppUtils, private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService, private storageService: StorageService,
    private router : Router) { }

  ngOnInit() {

    this.options = {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: {
            show: true
          },
          ticks: {
            beginAtZero: true,
            userCallback: function (label, index, labels) {
              // when the floored value is the same as the value we have a whole number
              if (Math.floor(label) === label) {
                return label;
              }

            }
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: 0
          }
        }]
      }
    };

    this.checkDates();

    this.categories = [{ label: 'All Categories', value: null }];
    this.utils.getAllCategoriesWidgets(this.categories).then((res: any) => {
      this.categories = res;

      this.colsIdeas = [
        { field: 'id', header: 'Idea ID' },
        { field: 'name', header: 'Idea Name' },
        { field: 'category', header: 'Category' },
        { field: 'date', header: 'Registry Date' },
        { field: 'eclStageShort', header: 'Stage' },
        { field: 'eclStatusDesc', header: 'Status' }
      ];

      this.colsRules = [
        { field: 'id', header: 'Rule ID' },
        { field: 'name', header: 'Rule Name' },
        { field: 'category', header: 'Category' },
        { field: 'date', header: 'Registry Date' },
        { field: 'eclStageShort', header: 'Stage' },
        { field: 'eclStatusDesc', header: 'Status' },
        { field: 'ideaCode', header: 'Idea Code' }
      ];

      this.loadData();
    });

  }

  /**
   * Load data from backend service and parse to correct structure
   */
  loadData() {

    let userId = this.utils.getLoggedUserId();

    this.dashboardService.getMyContributions(userId, this.startDate, this.endDate).subscribe((response: any) => {
      if (response.code == 200) {
        this.dataRules = [];
        this.dataIdeas = [];

        let values = [response.data.rulesGenerated, response.data.ideasGenerated];

        for (let i = 0; i < values[0].length; i++) {
          this.dataRules.push({
            "id": values[0][i].ruleCode,
            "name": values[0][i].ruleName,
            "category": values[0][i].categoryDesc,
            "date": this.dashboardService.parseDate(new Date(values[0][i].createDate.replace("-","/"))).split(" ")[0],
            "dateObj": (new Date(values[0][i].createDate.split(".")[0]+ " 00:00:00")),
            "eclStageShort": values[0][i].eclStageDesc,
            "eclStatusDesc" : values[0][i].eclStatusDesc,
            "ruleId": this.utils.encodeString(values[0][i].ruleId),
            "ideaId" : this.utils.encodeString(values[0][i].ideaId != undefined && values[0][i].ideaId != null ? values[0][i].ideaId : ""),
            "ideaCode" : values[0][i].ideaCode != undefined && values[0][i].ideaCode != null ? values[0][i].ideaCode : ""
          });
        }

        //Order by date asc
        this.dataRules.sort(function (a, b) {
          return a.dateObj - b.dateObj;
        });

        for (let i = 0; i < values[1].length; i++) {
          this.dataIdeas.push({
            "id": values[1][i].ideaCode,
            "name": values[1][i].ideaName,
            "category": values[1][i].categoryDesc,
            "date": this.dashboardService.parseDate(new Date(values[1][i].createDate)).split(" ")[0],
            "dateObj": (new Date(values[1][i].createDate)),
            "eclStageShort": values[1][i].eclStageDesc,
            "eclStatusDesc" : values[1][i].eclStatusDesc,
            "ideaId": this.utils.encodeString(values[1][i].ideaId)
          });
        }

        this.dataIdeas.sort(function (a, b) {
          return a.dateObj - b.dateObj;
        });

        if (this.typeView === "chart") {
          this.createChart();
        }
      }
    });

  }

  /**
   * Change view mode (TABLE, CHART)
   * @param view view mode
   */
  changeView(view) {

    if (view === "table") {
      this.selectedTab = "rules";
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
   * Create line chart when user select chart view
   */
  createChart() {

    //Parse information

    let labels = [];
    let dataRules = [];
    let dataIdeas = [];
    let mapRules = {};
    let mapIdeas = {};

    //Generate labels in bais days of rules and ideas array
    let startRule = this.dataRules.length > 0 ? this.dataRules[0].dateObj : null;
    let endRule = this.dataRules.length > 0 ? this.dataRules[this.dataRules.length - 1].dateObj : null;

    let startIdea = this.dataIdeas.length > 0 ? this.dataIdeas[0].dateObj : null;
    let endIdea = this.dataIdeas.length > 0 ? this.dataIdeas[this.dataIdeas.length - 1].dateObj : null;
    
    let start = startRule;
    let end = endRule;

    if (start == null) {
      start = startIdea;
    } else {
      if (startIdea != null && startRule > startIdea) {
        start = startIdea;
      } else {
        start = startRule;
      }
    }

    if (end == null) {
      end = endIdea;
    } else {      
        if (endIdea != null && endRule < endIdea) {
          end = endIdea;
        } 
    }

    if(start != null){
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);
    } 

    if(end !=null){
      end.setHours(0);
      end.setMinutes(0);
      end.setSeconds(0);
    }

    let loop = new Date(start);

    while (loop <= end) {
      labels.push(this.dashboardService.parseDate(loop).split(" ")[0]);
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }

    for (let i = 0; i < labels.length; i++) {
      mapRules[labels[i]] = 0;
      mapIdeas[labels[i]] = 0;
    }

    for (let i = 0; i < this.dataRules.length; i++) {
      if (mapRules[this.dataRules[i].date] == undefined) {
        mapRules[this.dataRules[i].date] = 1;
      } else {
        mapRules[this.dataRules[i].date] = mapRules[this.dataRules[i].date] + 1;
      }
    }

    for (let i = 0; i < this.dataIdeas.length; i++) {
      if (mapIdeas[this.dataIdeas[i].date] == undefined) {
        mapIdeas[this.dataIdeas[i].date] = 1;
      } else {
        mapIdeas[this.dataIdeas[i].date] = mapIdeas[this.dataIdeas[i].date] + 1;
      }
    }

    let arrRules = Object.keys(mapRules);
    for (let i = 0; i < arrRules.length; i++) {
      dataRules.push(mapRules[arrRules[i]]);
    }

    let arrIdeas = Object.keys(mapIdeas);
    for (let i = 0; i < arrIdeas.length; i++) {
      dataIdeas.push(mapIdeas[arrIdeas[i]]);
    }

    this.data = {
      labels: labels,
      datasets: [
        {
          label: 'Rules',
          data: dataRules,
          fill: false,
          borderColor: 'rgb(149, 121, 211)'
        },
        {
          label: 'Ideas',
          data: dataIdeas,
          fill: false,
          borderColor: 'rgb(51, 51, 51)'
        }
      ]
    }
  }

  /**
   * When user select tab IDEAS or RULES
   * @param event
   */
  selectData(event) {
    if (event.element._datasetIndex == 0) {
      this.selectedTab = "rules";
    } else {
      this.selectedTab = "ideas";
    }

    this.changeView("tablex");
  }

  /**
   * Refresh data in the widget
   */
  refresh() {
    this.loadData();
  }

  /**
   * Check if we have dates stored in session
   */
  checkDates() {
    if (this.storageService.exists("DATES_MY_CONTRIBUTIONS_START")) {
      this.startDate = new Date(this.storageService.get("DATES_MY_CONTRIBUTIONS_START", true).date);
    } else {
      this.startDate = new Date();
      this.startDate.setMonth(this.startDate.getMonth() - 1);
      this.start.value = this.startDate;
      this.cdr.detectChanges();
    }

    if (this.storageService.exists("DATES_MY_CONTRIBUTIONS_END")) {
      this.endDate = new Date(this.storageService.get("DATES_MY_CONTRIBUTIONS_END", true).date);
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
      this.storageService.set("DATES_MY_CONTRIBUTIONS_START", { date: this.startDate }, true);
    } else {
      this.storageService.set("DATES_MY_CONTRIBUTIONS_END", { date: this.endDate }, true);
    }
  }

  /**
   * Navigate to detail
   * @param id
   */
  redirect(id, type) {
    this.storageService.set("PARENT_NAVIGATION", "MY_CONTRIBUTIONS", false);
    this.router.navigate(['item-detail', id, type]);
  }

  /**
   * Handler for manage event when change tab
   * @param event 
   */
  handleChange(event) {
    switch(event.index) {
      case 0:
        this.selectedTab = 'rules';
        break;
      case 1:
        this.selectedTab = 'ideas';
        break;
    }
  }
}
