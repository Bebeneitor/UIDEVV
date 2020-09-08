import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { Constants } from 'src/app/shared/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { GoodIdeasServiceService } from 'src/app/services/good-ideas-service.service';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {

  @Input()
  title: string = "";

  tasks: any = [];

  typeView: string = "list"; //table and chart

  options: any;
  data: any;

  userId: number;
  myTaskNums: any = [];

  cols: any[];
  ideasGenerated: any = [];
  rulesGenerated: any = [];
  goodIdeas: any = [];

  constructor(private dashboardService: DashboardService, private util: AppUtils,
    private permissions: NgxPermissionsService, private router: Router,
    private storageService: StorageService, private goodIdeaService : GoodIdeasServiceService) { }

  ngOnInit() {

    this.options = {
      legend: {
        position: 'bottom',
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontSize: 11
          }
        }],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontSize: 11
            }
          }
        ]
      }
    };

    this.loadData();//Loading data to my-task widget.
  }

  /**
   * Change view mode (table, chart, badges)
   * @param view view mode
   */
  changeView(view) {

    if (this.typeView === view) {
      return;
    }

    this.typeView = view;

    if (this.typeView === "chart") {
      this.createChart();
    }
  }

  /**
   * Create bar chart when user select chart view
   */
  createChart() {

    let labels = [];
    let data = [];
    let colors = [];

    for (let i = 0; i < this.tasks.length; i++) {

      labels.push(this.tasks[i].acronym.toUpperCase());
      data.push(this.tasks[i].count);
      colors.push(this.tasks[i].cssColor);
    }

    this.data = {
      labels: labels,
      datasetLabel: [],
      datasets: [
        {
          backgroundColor: colors,
          borderColor: colors,
          data: data,
          fill: false
        }
      ]
    }
  }

  /**
   * Call service backend
   * @param userId user logged
   */
  private getIdeasForCheck(userId: number) {

    return new Promise((resolve) => {

      let value: any = [];

      this.dashboardService.getAllIdeasForCheck(userId).subscribe((data: []) => {
        value = data;
        resolve(value);
      });

    });

  }

  /**
   * Get data for widget and parse to correct structre in front end
   */
  loadData() {
    this.userId = this.util.getLoggedUserId();
    this.getIdeasForCheck(this.userId).then((response: any) => {

      let ideasResearch = 0;
      let provisionalRulesApproval = 0;
      let medicalReview = 0;
      let rulesNeedsInfo = 0;
      let rulesNeedsAnalysis = 0;
      let rulesNeedsApproval = 0;
      let medicalReviewMaintenance = 0;
      let newVersionsNeedReassignment = 0
      let existingVersionsNeedReassignment = 0
      let ideasNeedManualAssignment = 0
      let newRuleNeedMedicalReassignment = 0;
      let existingRulesNeedMedicalReassignment = 0;
      let rulesNeedMoreInfo = 0;

      this.tasks = [];            
      let goodIdeas = 0;

      //Permissions for validate, the user only can view the categories in base of permissions
      let permissionResearchAnalysis = this.permissions.getPermission("ROLE_CCA") != undefined;
      let permissionPolicyOwner = this.permissions.getPermission("ROLE_PO") != undefined;
      let permissionMedicalDirector = this.permissions.getPermission("ROLE_MD") != undefined;

      if (response.code == 200) {

        goodIdeas = response.data.goodIdeas.length;
        ideasResearch = response.data.ideasForMyTaskAccount;
        rulesNeedsInfo = response.data.rulesForMyTaskAccount;
        rulesNeedsApproval = response.data.ruleUpdateNeedingApproval;
        rulesNeedsAnalysis = response.data.rulesNeedingImpactAnalysis;
        newVersionsNeedReassignment = response.data.newVersionsNeedReassignment;
        existingVersionsNeedReassignment = response.data.existingVersionsNeedReassignment;
        ideasNeedManualAssignment = response.data.ideasNeedManualAssignment;
        newRuleNeedMedicalReassignment = response.data.newRuleNeedMedicalReassignment;
        existingRulesNeedMedicalReassignment = response.data.existingRulesNeedMedicalReassignment;
        rulesNeedMoreInfo = response.data.rulesNeedMoreInfo;
        medicalReview = response.data.medicalReview;

        for (let i = 0; i < response.data.accountStatus.length; i++) {
          switch (response.data.accountStatus[i].lookUpId) {
            case 41:
              provisionalRulesApproval = provisionalRulesApproval + response.data.accountStatus[i].count;
              break;
            case 65:              
              break;
            case 60:
            case 287:
            case 288:
            case 289:
              medicalReviewMaintenance = medicalReviewMaintenance + response.data.accountStatus[i].count;
              break;
          }
        }

        if (permissionMedicalDirector) {
          this.tasks.push({
            "id": 3,
            "name": "Provisional rule needing peer approval",
            "count": medicalReview,
            "color": "primary",
            "cssColor": Constants.AVAILABLE_COLORS[0]
          });
          this.tasks.push({
            "id": 7,
            "name": "Existing/new version needing peer review",
            "count": medicalReviewMaintenance,
            "color": "danger",
            "cssColor": Constants.AVAILABLE_COLORS[1]
          });
        }

        if (permissionPolicyOwner) {
          this.tasks.push({
            "id": 2,
            "name": "Provisional rules needing approval",
            "count": provisionalRulesApproval,
            "color": "success",
            "cssColor": Constants.AVAILABLE_COLORS[2]
          });
          this.tasks.push({
            "id": 6,
            "name": "New/existing version needing approval",
            "count": rulesNeedsApproval,
            "color": "secondary",
            "cssColor": Constants.AVAILABLE_COLORS[3]
          });
        }

        if (permissionResearchAnalysis) {
          this.tasks.push({
            "id": 1,
            "name": "Ideas needing research",
            "count": ideasResearch,
            "color": "primary",
            "cssColor": Constants.AVAILABLE_COLORS[0]
          });
          this.tasks.push({
            "id": 4,
            "name": "Provisional rule needs more info",
            "count": rulesNeedsInfo,
            "color": "danger",
            "cssColor": Constants.AVAILABLE_COLORS[1]
          });
          this.tasks.push({
            "id": 5,
            "name": "Rules needing impact analysis",
            "count": rulesNeedsAnalysis,
            "color": "success",
            "cssColor": Constants.AVAILABLE_COLORS[2]
          });
        }

        if (permissionPolicyOwner) {
          this.tasks.push({
            "id": 8,
            "name": "New version needing reassignment",
            "count": newVersionsNeedReassignment,
            "color": "secondary",
            "cssColor": Constants.AVAILABLE_COLORS[3]
          });

          this.tasks.push({
            "id": 10,
            "name": "Existing version needing reassignment",
            "count": existingVersionsNeedReassignment,
            "color": "primary",
            "cssColor": Constants.AVAILABLE_COLORS[0]
          });

          this.tasks.push({
            "id": 9,
            "name": "Ideas needing manual assignment",
            "count": ideasNeedManualAssignment,
            "color": "danger",
            "cssColor": Constants.AVAILABLE_COLORS[1]
          });
        }

        if (permissionMedicalDirector) {
          this.tasks.push({
            "id": 11,
            "name": "New rule needing peer reassignment",
            "count": newRuleNeedMedicalReassignment,
            "color": "success",
            "cssColor": Constants.AVAILABLE_COLORS[2]
          });

          this.tasks.push({
            "id": 12,
            "name": "Existing rule needing peer reassignment",
            "count": existingRulesNeedMedicalReassignment,
            "color": "secondary",
            "cssColor": Constants.AVAILABLE_COLORS[3]
          });
        }

        if (permissionMedicalDirector || permissionPolicyOwner) {
          this.tasks.push({
            "id": 13,
            "name": "Good ideas",
            "count": goodIdeas,
            "color": "primary",
            "cssColor": Constants.AVAILABLE_COLORS[0]
          });
        }

        if(permissionResearchAnalysis){
          this.tasks.push({
            "id": 14,
            "name": "Rule needs more info",
            "count": rulesNeedMoreInfo,
            "color": "danger",
            "cssColor": Constants.AVAILABLE_COLORS[1]
          });
        }

        for (let i = 0; i < this.tasks.length; i++) {
          let acronym = this.tasks[i].name.match(/\b(\w)/g).join('');
          this.tasks[i].acronym = acronym.toUpperCase();
        }
      }
    });

  }

  /** 
   * Event when user set click in category in bar chart
   * @param event
   */
  selectData(event) {

    let label = (event.dataset[event.element._index]._model.label);

    //check item id
    let id = -1;

    this.tasks.forEach(element => {
      if (element.acronym == label) {
        id = element.id;
      }
    });

    if (id > 0) {
      this.clickItem(id);
    }
  }

  /**
   * Show table view or redirect to other page in base of category selected
   * @param id
   */
  clickItem(id) {
    switch (id) {
      case 1: 
        this.router.navigate(["/ideas-needing-research"], {queryParams: {tab: Constants.ASSIGNED_TAB}});
        break;
      case 2:
        this.router.navigate(["/ruleApproval"]);
        break;
      case 3:
        this.router.navigate(["/mdApprovalPR"]);
        break;
      case 4: 
        this.router.navigate(["/ideas-needing-research"], {queryParams: {tab: Constants.RETURNED_TAB}});
        break;
      case 5:
        this.router.navigate(["/ruleForImpactAnalysis"], {queryParams: {tab: Constants.ASSIGNED_TAB}});
        break;
      case 6:
        this.router.navigate(["/ruleForPOApproval"]);
        break;
      case 7:
        this.router.navigate(["/mdApprovalRM"]);
        break;
      case 8:        
        this.router.navigate(["/reAssignForRuleApprovalReturned"]);
        break;
      case 9:
        this.router.navigate(["/assignmentNewIdea"]);
        break;
      case 10:
        this.router.navigate(["/reAssignForRuleUpdateApproval"]);
        break;
      case 11:
        this.router.navigate(["/assignForMDApprovalNR"], {queryParams: {tab: Constants.RETURNED_TAB}});
        break;
      case 12:
        this.router.navigate(["/assignForMDApprovalRM"], {queryParams: {tab: Constants.RETURNED_TAB}});
        break;
      case 13: 
        this.router.navigate(["/good-ideas"]);
        break;
      case 14:
        this.router.navigate(["/ruleForImpactAnalysis"], {queryParams: {tab: Constants.RETURNED_TAB}});
        break;  
    }
  }

  /**
   * Refresh data in widget
   */
  refresh() {
    this.loadData();
  }

  /**
   * Check array length for set correct grid system from bootstrap
   * (responsive)
   */
  checkArrayLength() {
    switch (this.tasks.length) {
      case 1: return 12;
      case 2: return 6;
      case 3: return 4;
      case 4: return 3;
      case 5: return 4;
      case 6: return 4;
      case 7: return 3;
    }
  }

  /**
   * Navigate to detail
   * @param id
   */
  redirect(id, type, goodIdeaDate) {

    if(type == "IDEA" && goodIdeaDate) {
      //Call service to remove good idea date beacause with the redirection we consider the user review it
      this.goodIdeaService.updateStatusToReviewedInGoodIdeas(Number(this.util.decodeString(id))).then((response : any) => {

        //Redirect after remove from good ideas
        this.storageService.set("PARENT_NAVIGATION", "MY_TASKS", false);
        this.router.navigate(['item-detail', id, type]);
      });
    } else {
      this.storageService.set("PARENT_NAVIGATION", "MY_TASKS", false);
      this.router.navigate(['item-detail', id, type]);
    }    
  }
}
