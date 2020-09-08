import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/shared/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';

@Component({
  selector: 'app-ideas-generated',
  templateUrl: './ideas-generated.component.html',
  styleUrls: ['./ideas-generated.component.css']
})
export class IdeasGeneratedComponent implements OnInit {

  @Input()
  title: string = "";

  typeView: string = "table";

  cols: any[];
  data: any[] = [];
  categories: any[];

  types: any = [
    { label: "All", value: null },
    { label: "Idea", value: "Idea" },
    { label: "Draft", value: "Draft" },
    { label: "Provisional Rule", value: "Provisional Rule" },
  ];

  status: any = [
  ];

  dataChart: any;
  options: any;

  startDate: Date;
  endDate: Date;
  userId: number;
  newideaId: number;

  selectedCategory: any = null;
  selectedType: any = null;
  selectedStatus: any = null;
  isClick: boolean = false;

  minDate: Date = Constants.MIN_VALID_DATE;
  maxDate: Date = new Date();

  groupBy: string = "category";

  @ViewChild("dt") dt;

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  constructor(private dashBoardService: DashboardService, private util: AppUtils,
    private router: Router, private storageService: StorageService, private eclConstantsService:ECLConstantsService) { }

  ngOnInit() {

    this.options = {
      legend: {
        position: 'left',
        display: false
      }
    };

    this.checkDates();

    this.categories = [{ label: 'All', value: null }, { label: 'Uncategorized', value: 'Uncategorized' }];
    this.util.getAllCategoriesWidgets(this.categories).then((res: any) => {
      this.categories = res;
      this.cols = [
        { field: 'id', header: 'Idea ID' },
        { field: 'name', header: 'Idea Name' },
        { field: 'category', header: 'Category' },
        { field: 'type', header: 'Type' },
        { field: 'status', header: 'Status' },
      ];

      this.loadData();
    });

  }

  /**
   * Change the view type in screen
   * @param view type of view
   */
  changeView(view) {

    if (this.selectedCategory != null) {
      this.selectedCategory = null;
      this.dt.filter(null, 'category', 'contains');
    }

    if (this.selectedType != null) {
      this.selectedType = null;
      this.dt.filter(null, 'type', 'contains');
    }

    if (this.selectedStatus != null) {
      this.selectedStatus = null;
      this.dt.filter(null, 'status', 'contains');
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
   * Create donut chart when user select chart view
   */
  createChart() {

    let labels = [];
    let data = [];
    let colors = [];

    let availableColors = Constants.AVAILABLE_COLORS;

    let indexColor = 0;

    let arrLabels = null;
    let field = null;

    if (this.groupBy == "category") {
      arrLabels = this.categories;
      field = "category";
    } else if (this.groupBy == "type") {
      arrLabels = this.types;
      field = "type";
    }
    else if (this.groupBy == "status") {
      arrLabels = this.status;
      field = "status";
    }

    for (let i = 1; i < arrLabels.length; i++) {
      labels.push(arrLabels[i].label);
    }

    for (let i = 0; i < labels.length; i++) {
      let count = 0;

      for (let j = 0; j < this.data.length; j++) {
        if (labels[i] === this.data[j][field]) {
          count++;
        }
      }

      data.push(count);
      colors.push(availableColors[indexColor]);

      if(count > 0) {
        indexColor++;
      }

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
   * Load data from the service in base of dates
   */
  loadData() {

    this.data = [];

    this.status = [{ label: "All", value: null }];

    this.userId = this.util.getLoggedUserId();
    this.dashBoardService.getIdeasGenerated(this.userId, 3, this.startDate, this.endDate)
      .subscribe(
        (dataService: any) => {
          if (dataService.code == 200) {
            //put all data from service in data object.
            let arrStatus = [];

            for (let i = 0; i < dataService.data.length; i++) {

              this.data.push({
                "id": dataService.data[i].ideaCode,
                "name": dataService.data[i].ideaName,
                "category": dataService.data[i].categoryDesc == null ? 'Uncategorized' : dataService.data[i].categoryDesc,
                "ideaId": dataService.data[i].ideaId,
                "status": dataService.data[i].eclStatusDesc,
                "type": dataService.data[i].eclStageDesc
              });

              arrStatus.push(dataService.data[i].eclStatusDesc);
            }

            let unique = arrStatus.filter(function(elem, index, self) {
              return index === self.indexOf(elem);
            });

            unique.forEach(element => {
              this.status.push({ label: element, value: element });
            });

            this.data = JSON.parse(JSON.stringify(this.data));

            if (this.typeView === "chart") {
              this.createChart();
            }
          }
        }
      );


  }

  /**
   * Event when user clicks on category inside donut chart, the page will show all records
   * with that categry
   * @param event
   */
  selectData(event) {
    let label = (event.dataset[event.element._index]._model.label);
    this.changeView("table");
    this.isClick = true;

    switch (this.groupBy) {
      case "category":
        this.selectedCategory = label;
        this.dt.filter(label, 'category', 'equals');
        break;
      case "type":
        this.selectedType = label;
        this.dt.filter(label, 'type', 'equals');
        break;
      case "status":
        this.selectedStatus = label;
        this.dt.filter(label, 'status', 'equals');
        break;
    }
  }

  /**
   * Change again to chart view
   */
  return() {
    this.selectedCategory = null;
    this.selectedType = null;
    this.selectedStatus = null;
    this.dt.filter(null, 'category', 'contains');
    this.dt.filter(null, 'status', 'contains');
    this.dt.filter(null, 'type', 'contains');
    this.typeView = "chart";
    this.isClick = false;
  }

  /**
   * Action for refresh data
   */
  refresh() {
    this.loadData();
  }

  /**
   * Navigate to detail
   * @param id
   */
  redirect(rowData,type) {        
    if(rowData.type === this.eclConstantsService.RULE_STAGE_PROVISIONAL_RULE_DESCRIPTION){
      type=this.eclConstantsService.RULE_STAGE_DESCRIPTION;
    }
    this.storageService.set("PARENT_NAVIGATION", "IDEAS_GENERATED", false);
    this.router.navigate(['item-detail', this.util.encodeString(rowData.ideaId), type]);
  }

  /**
   * Check if we have dates stored in session
   */
  checkDates() {
    if (this.storageService.exists("DATES_IDEAS_GENERATED_START")) {
      this.startDate = new Date(this.storageService.get("DATES_IDEAS_GENERATED_START", true).date);
    } else {
      this.startDate = new Date();
    }

    if (this.storageService.exists("DATES_IDEAS_GENERATED_END")) {
      this.endDate = new Date(this.storageService.get("DATES_IDEAS_GENERATED_END", true).date);
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
      this.storageService.set("DATES_IDEAS_GENERATED_START", { date: this.startDate }, true);
    } else {
      this.storageService.set("DATES_IDEAS_GENERATED_END", { date: this.endDate }, true);
    }
  }

}
