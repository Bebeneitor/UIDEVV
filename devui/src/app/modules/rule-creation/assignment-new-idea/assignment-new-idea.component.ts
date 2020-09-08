import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/api';
import { IdeaService } from 'src/app/services/idea.service';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { environment } from 'src/environments/environment';
import { ECLConstantsService } from "../../../services/ecl-constants.service";
import { AppUtils } from "../../../shared/services/utils";

import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { UserTeamCategoryMapDto } from "../../../shared/models/dto/user-team-category-map-dto";
import { FieldSelectionUpdatesService } from "../../../services/field-selection-updates.service";
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { Constants } from 'src/app/shared/models/constants';
import { OverlayPanel } from 'primeng/primeng';


@Component({
  selector: 'app-assignment-new-idea',
  templateUrl: './assignment-new-idea.component.html',
  styleUrls: ['./assignment-new-idea.component.css'],
  providers: [DialogService]
})
export class AssignmentNewIdeaComponent implements OnInit {

  @ViewChild('notAssignedTable') notAssignedTable: EclTableComponent;
  @ViewChild('assignedTable') assignedTable: EclTableComponent;
  @ViewChild('returnedTable') returnedTable: EclTableComponent;

  constantsHeader: any = Constants;

  notAssignedTabModel: EclTableModel;
  assignedTabModel: EclTableModel;
  returnedTabModel: EclTableModel;

  notAssignedSelectedRules = [];
  assignedSelectedRules = [];
  returnedSelectedRules = [];

  ruleStatus: number;
  pageTitle: string;
  tabName: string;
  userId: number;

  lobs: any[] = [{ label: "ALL", value: null }];
  categories: any[] = [{ label: "ALL", value: null }];
  states: any[] = [{ label: "ALL", value: null }];
  comments: any[] = [{ label: "Select Comment", value: null }];
  users: any[] = [{ label: "Search for User", value: null }];
  researchAnalystUsers: any[] = [{ label: "Search for User", value: null }];
  jurisdictions: any[] = [{ label: "ALL", value: null }];

  allIdea: any[];
  selectedIdeasNotAssigned: RuleInfo[];
  selectedIdeasAssigned: RuleInfo[];
  selectedIdeasReturned: RuleInfo[];

  loading: boolean;
  customToolTip: string;

  filteredIdeasNotAssigned: any[];
  filteredIdeasAssigned: any[];
  filteredIdeasReturned: any[];

  filteredIdeasNotAssignedOriginal: any[];
  filteredIdeasAssignedOriginal: any[];
  filteredIdeasReturnedOriginal: any[];

  columnsToExport: any[] = [];

  selectedLOB: string = '';
  selectedState: string = '';
  selectedCategory: string = '';
  selectedJurisdiction: string = '';
  selectedUserNotAssigned: string = '';
  selectedUserAssigned: string = '';
  selectedUserReturned: string = '';
  selectedComment: string = '';
  indexVal: number = 0;

  showIdeaModal: boolean = false;

  allReferenceInfo: any[];

  usersTeams: UserTeamCategoryMapDto[] = [];

  tabIndex: number = 0;
  selectedDropBox: any;

  teamReturnedTab: any;
  teamAssignedTab: any;
  teamNotAssignedTab: any;
  extraDropDownOptions: any = [];

  constructor(public dialogService: DialogService, private ideaService: IdeaService, private ruleInfoService: RuleInfoService, private http: HttpClient, private utils: AppUtils,
    public route: ActivatedRoute, private eclConstantsService: ECLConstantsService, private fieldSelectionUpdatesService: FieldSelectionUpdatesService) { }


  ngOnInit() {
    this.pageTitle = this.route.snapshot.data.pageTitle;
    this.userId = this.utils.getLoggedUserId();

    this.notAssignedTabModel = new EclTableModel();
    this.assignedTabModel = new EclTableModel();
    this.returnedTabModel = new EclTableModel();

    this.initTableConfig(this.notAssignedTabModel, Constants.NOT_ASSIGNED_IDEA_WORKFLOW_ID);
    this.initTableConfig(this.assignedTabModel, Constants.ASSIGNED_IDEA_WORKFLOW_ID);
    this.initTableConfig(this.returnedTabModel, Constants.RETURNED_IDEA_WORKFLOW_ID);

    this.ruleStatus = 1;


    this.selectedUserNotAssigned = '';
    this.selectedUserAssigned = '';
    this.selectedUserReturned = '';
    this.loading = true;

    this.getAllUsers();
    this.initTeamsFunctionality();
    this.getAllResearchAnalysts();

  }


  reassignIdeasNotAssigned(event: any) {

    this.loading = true;
    let requestBody: any;
    let selectedIdeaIdsNotAssigned: any[] = [];
    let username: string = '';

    selectedIdeaIdsNotAssigned = this.selectedIdeasNotAssigned.map(idea => {
      return idea.ideaId;
    });


    requestBody = { "userId": this.selectedUserNotAssigned, "recordIds": selectedIdeaIdsNotAssigned, "stageId": this.ruleStatus };

    this.http.post(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.REASSIGN_URL, requestBody).subscribe(response => {
      for (let user of this.users) {
        if (user.value == this.selectedUserNotAssigned) {
          username = user.label;
          break;
        }
      }

      for (let selectedIdea of this.selectedIdeasNotAssigned) {
        selectedIdea.assignedTo = username;
      }

      this.selectedUserNotAssigned = null;
      this.selectedComment = null;
      this.loading = false;
      this.selectedIdeasNotAssigned = null;

      this.resetDataTable(Constants.NOT_ASSIGN_STATUS);

    });
  }

  reassignIdeasAssigned(event: any) {

    this.loading = true;
    let requestBody: any;
    let selectedIdeaIdsAssigned: any[] = [];
    let username: string = '';

    selectedIdeaIdsAssigned = this.selectedIdeasAssigned.map(idea => {
      return idea.ideaId;
    });


    requestBody = { "userId": this.selectedUserAssigned, "recordIds": selectedIdeaIdsAssigned, "stageId": this.ruleStatus };

    this.http.post(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.REASSIGN_URL, requestBody).subscribe(response => {
      for (let user of this.users) {
        if (user.value == this.selectedUserAssigned) {
          username = user.label;
          break;
        }
      }

      for (let selectedIdea of this.selectedIdeasAssigned) {
        selectedIdea.assignedTo = username;
      }

      this.selectedUserAssigned = null;
      this.selectedComment = null;
      this.loading = false;
      this.selectedIdeasAssigned = null;
      this.resetDataTable(Constants.ASSIGNED_STATUS);

    });

  }

  reassignIdeasReturned(event: any) {

    this.loading = true;
    let requestBody: any;
    let selectedIdeaIds: any[] = [];
    let username: string = '';

    selectedIdeaIds = this.selectedIdeasReturned.map(idea => {
      return idea.ideaId;
    });


    requestBody = { "userId": this.selectedUserReturned, "recordIds": selectedIdeaIds, "stageId": this.ruleStatus, 'workflowId': this.eclConstantsService.RULE_STATUS_IDEA_RETURNED };

    this.http.post(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.REASSIGN_URL, requestBody).subscribe(response => {
      for (let user of this.researchAnalystUsers) {
        if (user.value == this.selectedUserReturned) {
          username = user.label;
          break;
        }
      }

      for (let selectedIdea of this.selectedIdeasReturned) {
        selectedIdea.assignedTo = username;
      }

      this.selectedUserReturned = null;
      this.selectedComment = null;
      this.loading = false;
      this.selectedIdeasReturned = null;
      this.resetDataTable(Constants.RETURNED_STATUS);

    });

  }

  resetDataTable(selectedTab: string) {
    switch (selectedTab) {
      case Constants.NOT_ASSIGN_STATUS:
        this.notAssignedTable.resetDataTable();
        this.notAssignedSelectedRules = [];
        this.notAssignedTable.refreshTable();
        this.notAssignedTable.selectedRecords = [];
        this.notAssignedTable.savedSelRecords = [];
        break;
      case Constants.ASSIGNED_STATUS:
        this.assignedTable.resetDataTable();
        this.assignedSelectedRules = [];
        this.assignedTable.refreshTable();
        this.assignedTable.selectedRecords = [];
        this.assignedTable.savedSelRecords = [];
        break;
      case Constants.RETURNED_STATUS:
        this.returnedTable.resetDataTable();
        this.returnedSelectedRules = [];
        this.returnedTable.refreshTable();
        this.returnedTable.selectedRecords = [];
        this.returnedTable.savedSelRecords = [];
        break;
    }
  }

  initTableConfig(tableModel: EclTableModel, tabIndicator: number) {
    tableModel.url = RoutingConstants.IDEAS_URL + '/' + RoutingConstants.ASSIGN_NEW_IDEA;
    tableModel.lazy = true;
    tableModel.checkBoxSelection = true;
    tableModel.sortOrder = 1;
    tableModel.columns = this.initTableColumns();
    tableModel.extraBodyKeys = { workflowId: tabIndicator };    
    tableModel.excelFileName = 'Assignment for New Idea';
  }

  initTableColumns() {
    let manager = new EclTableColumnManager();
    manager.addTextColumn('ideaCode', 'Idea ID', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('createdBy', 'Idea Creator', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ideaName', 'Idea Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ideaDescription', 'Idea Description', null, true, EclColumn.TEXT, true,100);    
    manager.addOverlayPanelColumn('refCountDescription', 'References', null, false, EclColumn.TEXT, false);
    manager.addTextColumn('daysOld', 'Days Old', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('lookupDesc', 'Status', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ideaAssignedTo', 'Assigned To', null, true, EclColumn.TEXT, true);
    return manager.getColumns();
  }

  refreshEclTable(table: EclTableComponent) {
    table.refreshTable();
  }

  setSelectRules(event: any, currentTab: string) {
    switch (currentTab) {
      case Constants.NOT_ASSIGN_STATUS:
        this.selectedIdeasNotAssigned = event;
        break;
      case Constants.ASSIGNED_STATUS:
        this.selectedIdeasAssigned = event;
        break;
      case Constants.RETURNED_STATUS:
        this.selectedIdeasReturned = event;
        break;
    }
  }

  onServiceCall(event: { action: string }, selectedTab: string) {
    if (event.action === Constants.ECL_TABLE_END_SERVICE_CALL) {
      switch (selectedTab) {
        case Constants.NOT_ASSIGN_STATUS:
          this.notAssignedSelectedRules = [];
          this.notAssignedTable.selectedRecords = [];
          break;
        case Constants.ASSIGNED_STATUS:
          this.assignedSelectedRules = [];
          this.assignedTable.selectedRecords = [];
          break;
        case Constants.RETURNED_STATUS:
          this.returnedSelectedRules = [];
          this.returnedTable.selectedRecords = [];
          break;
      }
    }
  }

  initTeamsFunctionality() {
    this.extraDropDownOptions = [];
    this.tabIndex;
    this.loading = true;
    this.fieldSelectionUpdatesService.getAllTeamUsersForRC().subscribe((response: any) => {
      if (response.data) {
        this.usersTeams = response.data;
        let tempTeamList = this.usersTeams.map(ele => {
          return { label: ele.teamName, value: ele.teamId };
        });
        let teamIdList = this.usersTeams.map(ele => ele.teamId);
        teamIdList = [...new Set(teamIdList)];

        teamIdList.forEach(id => {
          this.extraDropDownOptions = [...this.extraDropDownOptions,
          tempTeamList.find(team => team.value === id)];
        });
        this.extraDropDownOptions = [{ label: 'All', value: '' }, ...this.extraDropDownOptions];

        this.loading = false;
      }
    });

  }

  filterByTeams(currentTab: string) {
    switch (currentTab) {
      case Constants.NOT_ASSIGN_STATUS:
        this.notAssignedTabModel.criteriaFilters = {};
        this.notAssignedTabModel.criteriaFilters = {
          "columnName": "teamId",
          "value": this.teamNotAssignedTab,
          "entity": "eclTeamsJoin"
        };
        this.notAssignedTable.loadData(null);        
        break;
      case Constants.ASSIGNED_STATUS:
        this.assignedTabModel.criteriaFilters = {};
        this.assignedTabModel.criteriaFilters = {
          "columnName": "teamId",
          "value": this.teamAssignedTab,
          "entity": "eclTeamsJoin"
        };
        this.assignedTable.loadData(null);        
        break;
      case Constants.RETURNED_STATUS:
        this.returnedTabModel.criteriaFilters = {};
        this.returnedTabModel.criteriaFilters = {
          "columnName": "teamId",
          "value": this.teamReturnedTab,
          "entity": "eclTeamsJoin"
        };
        this.returnedTable.loadData(null);
        break;
    }
  }

  private getAllUsers(): void {
    this.utils.getAllCCAOfPOAssignedTeam(this.userId, this.users);
  }

  private getAllResearchAnalysts(): void {
    this.utils.getAllResearchAnalysts(this.researchAnalystUsers);
  }


  handleTabViewChange(event: any) {
    this.tabIndex = event.index;
    this.initTeamsFunctionality();
  }

  showReferenceInfo(event: any) {
    this.ideaService.getAllReferenceInfo(event.row.ideaId).subscribe((response: any) => {
      this.allReferenceInfo = [];
      response.data.forEach(element => {
        this.allReferenceInfo.push({
          "description": element.referenceName,
          "href": element.referenceUrl
        });
      });
      const referenceInfo = {
        data: this.allReferenceInfo,
        isLink: true,
        isList: true
      };
      if (this.tabIndex == 0) { this.notAssignedTable.popUpOverlayInfo = referenceInfo; }
      else if (this.tabIndex == 1) { this.assignedTable.popUpOverlayInfo = referenceInfo; }
      else if (this.tabIndex == 2) { this.returnedTable.popUpOverlayInfo = referenceInfo }
    });
  }

  showReturnComments(event: any) {
    if(event.field == "lookupDesc") {
      const overlaypanel: OverlayPanel = event.overlaypanel;
      this.returnedTable.popUpOverlayInfo = { data: { description: event.row.reviewComments, href: null}, isLink: false, isList: false };
      overlaypanel.toggle(event.overlayEvent);
    }
  }

}
