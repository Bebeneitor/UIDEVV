import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/api';
import { IdeaService } from 'src/app/services/idea.service';
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
import { EclTableCommentsConfig } from 'src/app/shared/components/ecl-table/model/ecl-comments-config';
import { StorageService } from 'src/app/services/storage.service';

const TAB_INDEX_ASSIGNED = 1;

@Component({
  selector: 'app-assignment-new-idea',
  templateUrl: './assignment-new-idea.component.html',
  styleUrls: ['./assignment-new-idea.component.css'],
  providers: [DialogService]
})
export class AssignmentNewIdeaComponent implements OnInit {

  @ViewChild('notAssignedTable',{static: false}) notAssignedTable: EclTableComponent;
  @ViewChild('assignedTable',{static: false}) assignedTable: EclTableComponent;
  @ViewChild('returnedTable',{static: false}) returnedTable: EclTableComponent;

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

  showIdeaModal: boolean = false;

  allReferenceInfo: any[];

  usersTeams: UserTeamCategoryMapDto[] = [];

  tabIndex: number = 0;
  selectedDropBox: any;
  setFilter: string;

  teamReturnedTab: any;
  teamAssignedTab: any;
  teamNotAssignedTab: any;
  extraDropDownOptions: any = [];

  constructor(public dialogService: DialogService, private ideaService: IdeaService, private router: Router, 
    private http: HttpClient, private utils: AppUtils, public route: ActivatedRoute, private eclConstantsService: ECLConstantsService, 
    private fieldSelectionUpdatesService: FieldSelectionUpdatesService, private storage: StorageService) { }


  ngOnInit() {
    this.pageTitle = this.route.snapshot.data.pageTitle;
    this.userId = this.utils.getLoggedUserId();

    this.route.queryParams.subscribe(params => {

      if (params['filter']) {
        this.setFilter = params['filter'];
      }
    });

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

    this.initTeamsFunctionality();
    this.getAllResearchAnalysts();

  }

  researchRequestSetFilter() {
    if (this.setFilter) {
      this.notAssignedTable.keywordSearch = this.setFilter;
      this.notAssignedTable.search();
    }
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
        this.notAssignedTable.selectedRecords = [];
        this.notAssignedTable.savedSelRecords = [];
        break;
      case Constants.ASSIGNED_STATUS:
        this.assignedTable.resetDataTable();
        this.assignedSelectedRules = [];
        this.assignedTable.selectedRecords = [];
        this.assignedTable.savedSelRecords = [];
        break;
      case Constants.RETURNED_STATUS:
        this.returnedTable.resetDataTable();
        this.returnedSelectedRules = [];
        this.returnedTable.selectedRecords = [];
        this.returnedTable.savedSelRecords = [];
        break;
    }
  }

  initTableConfig(tableModel: EclTableModel, tabIndicator: number) {
    tableModel.url = RoutingConstants.IDEAS_URL + '/' + RoutingConstants.ASSIGN_NEW_IDEA;
    tableModel.lazy = true;
    tableModel.checkBoxSelection = true;
    tableModel.sortBy = 'daysOld';
    tableModel.sortOrder = 0;
    tableModel.columns = this.initTableColumns();
    tableModel.extraBodyKeys = { workflowId: tabIndicator };
    tableModel.excelFileName = 'Assignment for New Idea';
  }

  initTableColumns() {


    let commentsConfig = new EclTableCommentsConfig();
    commentsConfig.urlGet = environment.restServiceUrl + RoutingConstants.IDEAS_URL + '/{id}/' + RoutingConstants.IDEA_COMMENTS;
    commentsConfig.urlAdd = environment.restServiceUrl + RoutingConstants.IDEAS_URL + '/' + RoutingConstants.IDEA_COMMENTS;
    commentsConfig.urlRemove = environment.restServiceUrl + RoutingConstants.IDEAS_URL + '/' + RoutingConstants.IDEA_COMMENTS + '/{id}';
    commentsConfig.displayColumns = [
      { 'field': 'comments', 'header': 'Comment'}, 
      { 'field': 'createdUser', 'header': 'Created By'}, 
      { 'field': 'creationDate', 'header': 'Creation Date'}
    ];
    commentsConfig.inputColumn = 'comments';
    commentsConfig.fieldId = 'ideaId';
    commentsConfig.removeFieldId = 'commentId';
    commentsConfig.useDeleteButton = false;

    let manager = new EclTableColumnManager();
    manager.addLinkColumnWithIcon('ideaCode', 'Idea ID', null, true, EclColumn.TEXT, true, 'left', 'researchRequestIdeaIndicator', Constants.RESEARCH_REQUEST_INDICATOR_CLASS);
    manager.addTextColumn('createdBy', 'Idea Creator', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ideaName', 'Idea Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ideaDescription', 'Idea Description', null, true, EclColumn.TEXT, true, 100);
    manager.addOverlayPanelColumn('refCountDescription', 'References', null, false, EclColumn.TEXT, false);
    manager.addTextColumn('daysOld', 'Days Old', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('lookupDesc', 'Status', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ideaAssignedTo', 'Assigned To', null, true, EclColumn.TEXT, true);
    manager.addCommentsColumn('existingCommentsList', 'Comments', null, commentsConfig);
    return manager.getColumns();
  }

  refreshEclTable(table: EclTableComponent) {
    table.resetDataTable();
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
          if (this.setFilter) {
            this.researchRequestSetFilter();
            this.setFilter = null;
          }
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

  private getAllResearchAnalysts(): void {
    this.utils.getAllResearchAnalysts(this.researchAnalystUsers);
  }


  handleTabViewChange(event: any) {
    this.tabIndex = event.index;
    if (this.tabIndex === 0) {
      this.notAssignedTabModel.sortBy = 'daysOld';
      this.notAssignedTabModel.sortOrder = 0;
    } else if (this.tabIndex === 1) {
      this.assignedTabModel.sortBy = 'daysOld';
      this.assignedTabModel.sortOrder = 0;
    } else if (this.tabIndex === 2) {
      this.returnedTabModel.sortBy= 'daysOld';
      this.returnedTabModel.sortOrder = 0;
    }   
    this.initTeamsFunctionality();
  }

  showIdeaOrReferenceInfo(event: any) {

    if(event.field == "ideaCode") {

      this.storage.set("PARENT_NAVIGATION", "ASSIGNMENT_FOR_NEW_IDEA", false);

      this.router.navigate(['newIdea', this.utils.encodeString(event.row.ideaId.toString())],
      {queryParams: {fromAssignmentForNewIdeaScreen: true}}
      );

    } else if(event.field == "refCountDescription") {
    
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

  }

  showReturnComments(event: any) {
    if (event.field == "lookupDesc") {
      const overlaypanel: OverlayPanel = event.overlaypanel;
      this.returnedTable.popUpOverlayInfo = { data: { description: event.row.reviewComments, href: null }, isLink: false, isList: false };
      overlaypanel.toggle(event.overlayEvent);
    }
  }

}
