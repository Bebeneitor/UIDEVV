import { Component, OnInit, ViewChild } from '@angular/core';
import { TeamUpdatesReportService } from 'src/app/services/team-updates-report.service';
import { ActivatedRoute } from '@angular/router';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { Constants } from "src/app/shared/models/constants";
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { SelectItem } from 'primeng/api';
import { ToastMessageService } from 'src/app/services/toast-message.service';


const KEY_GLOBAL_VIEW = 0;
@Component({
  selector: 'app-team-updates-report',
  templateUrl: './team-updates-report.component.html',
  styleUrls: ['./team-updates-report.component.css']
})
export class TeamUpdatesReportComponent implements OnInit {

  @ViewChild('eclTableAllStatuses') eclTableAllStatuses: EclTableComponent;
  @ViewChild('eclTableIdeasGenerated') eclTableIdeasGenerated: EclTableComponent;
  @ViewChild('eclTableProvisionalRulesGenerated') eclTableProvisionalRulesGenerated: EclTableComponent;
  @ViewChild('eclTableProvisionalRulesAssigned') eclTableProvisionalRulesAssigned: EclTableComponent;
  @ViewChild('eclTableRulesGenerated') eclTableRulesGenerated: EclTableComponent;
  @ViewChild('eclTableShelved') eclTableShelved: EclTableComponent;
  @ViewChild('eclTableInvalid') eclTableInvalid: EclTableComponent;
  @ViewChild('eclTableDuplicated') eclTableDuplicated: EclTableComponent;
  @ViewChild('calendar', undefined) calendar: any;

  localConstants = Constants;
  yearValidRangeEft : string ;

  tableConfig: EclTableModel;
  enabledEclTable: string;

  teams: SelectItem[];
  selectedTeam: number;

  teamMembers: SelectItem[];
  selectedTeamMember: number;

  categories: SelectItem[];
  selectedCategory: number;

  statuses: SelectItem[];
  selectedStatus: string;

  selectedDates: Date[];
  maxDate: Date;

  dataChartTeam       : any;
  optionsCharTeam     : any;
  dataChartTeamMember : any;
  optionsChartTeamMember   : any;

  blockedDocument: boolean;
  isSelectedTeamMember: boolean;

  private thereAreParams: boolean;
  private teamParam: number;
  private memberParam: number;
  private statusParam: string;
  private today      : Date;
  private tomorrow   : Date;

  constructor(
    private teamUpdatesReportService: TeamUpdatesReportService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastMessageService) {

    this.tableConfig = new EclTableModel();
    this.tableConfig.lazy = true;
    this.tableConfig.sortOrder = 1;
    this.tableConfig.checkBoxSelection = false;

    this.blockedDocument = false;
    this.isSelectedTeamMember = false;
    this.thereAreParams = false;

    this.today = new Date();
    this.today.setHours(0,0,0,0);

    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.today.getDate() + 1);

    this.maxDate = this.today;
    this.dataChartTeam= {};
    this.dataChartTeamMember = {}

    this.yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  }

  ngOnInit() {
    this.statuses = this.teamUpdatesReportService.getStatuses();
    this.fillCategories();

    this.activatedRoute.queryParams.subscribe(params => {
      this.teamParam   = params['teamId'];
      this.memberParam = params['userId'];
      this.statusParam = params['status'];
      this.validateParameters(this.teamParam, this.memberParam, this.statusParam);
      this.fillTeamsByLoggerUser();
    });
  }

  /**
   * This method is used to validate input params.
   * 
   *  @param teamId - Team id
   *  @param userId - User Id
   *  @param status - Status id
  */
  validateParameters(teamId: number, userId: number, status: string) {
    if(!teamId && !userId && !status){
      this.thereAreParams = false;
    }else{
      this.thereAreParams = !isNaN(teamId) && !isNaN(userId) && (
        (status === Constants.ALL_STATUSES) || (status === Constants.IDEAS_GENERATED) || 
        (status === Constants.PROVISIONAL_RULES_GENERATED) || (status === Constants.PROVISIONAL_RULES_ASSIGNED) ||
        (status === Constants.RULES_GENERATED) || (status === Constants.SHELVED) ||
        (status === Constants.INVALID) || (status === Constants.DUPLICATED));
      
      if (!this.thereAreParams){
        this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR,
          "Please enter valid arguments in request params");
      }
    }
  }

  /**
   * This method is used to fill teams by logger user.
  */
  private fillTeamsByLoggerUser(): void {
    this.teamUpdatesReportService.getTeamsByLoggerUser().then((response: SelectItem[]) => {
      if (response && response.length > 0) {
        this.teams = response;
        if (this.thereAreParams) {
          if (this.teams.find(e => e.value == this.teamParam) !== undefined) {
            this.selectedTeam = Number(this.teamParam);
          } else {
            this.resetSelection();
          }
        } else {
          this.selectedTeam = this.teams[0].value;
        }
        this.fillUsersByTeam();
      }
    });
  }

  /**
   * This method is to fill users by team.
  */
  fillUsersByTeam() {
    this.teamUpdatesReportService.getUsersByTeam(this.selectedTeam).then((response: any) => {
      if (response && response.length > 0) {
        this.teamMembers = response;
        if (this.thereAreParams) {
          if (this.teamMembers.find(tm => tm.value == this.memberParam) !== undefined) {
            this.selectedTeamMember = Number(this.memberParam);
            this.fillStatuses();
          } else {
            this.resetSelection();
          }
        } else {
          this.selectedTeamMember = undefined;
        }
      }
    });
  }

  /**
   * This method is to get the status.
  */
  fillStatuses() {
    if (this.thereAreParams) {
      if (this.statuses.find(s => s.value == this.statusParam) !== undefined) {
        this.selectedStatus = String(this.statusParam);
        this.searchDataTable();
      } else {
        this.resetSelection();
      }
    } else {
      this.selectedStatus = undefined;
    }
  }

  /**
  * This method is to fill users by team.
 */
  fillCategories() {
    this.teamUpdatesReportService.getCategories().then((response: any) => {
      if (response && response.length > 0) {
        this.categories = response;
      }
    });
  }

  /**
   * This method is to get the table data from the back-end.
  */
  searchDataTable() {
    this.blockedDocument = true;
    this.initializeTableConfig();
    if (this.enabledEclTable === this.selectedStatus) {
      this.resetTable(this.selectedStatus);
    } else {
      this.enabledEclTable = this.selectedStatus;
    }
    this.thereAreParams = false;
    this.searchDataCharts();
  }

  /**
   * This method is to get the data charts from the back-end.
  */
  private searchDataCharts() {
    let startDate : Date;
    let endDate   : Date;
    if (this.selectedDates && this.selectedDates !== null && this.selectedDates.length === 2) {
      [startDate, endDate] = this.selectedDates;
      if (endDate !== null) endDate.setHours(0, 0, 0, 0);
      endDate = (endDate !== null) ? (endDate.getTime() === this.today.getTime() ? this.tomorrow : endDate) : this.tomorrow;
    }
    this.resetCharts();
    //Team Chart
    this.teamUpdatesReportService.getDataChart(
      this.selectedTeam, KEY_GLOBAL_VIEW, this.selectedCategory, startDate, endDate).then(data =>{
        this.dataChartTeam = data;

        let selectedItem = this.teams.find(tm => tm.value == this.selectedTeam);
        this.optionsCharTeam = {
          title: {
              display: true,
              text: selectedItem.label,
          }
        };
        this.blockedDocument = false;
      }).catch(data => {
        this.dataChartTeam = data;
        this.blockedDocument = false;
      });

    //Team Member Chart
    this.isSelectedTeamMember = (this.selectedTeamMember && this.selectedTeamMember > KEY_GLOBAL_VIEW);
    if(this.isSelectedTeamMember){
      this.teamUpdatesReportService.getDataChart(
        this.selectedTeam, this.selectedTeamMember, this.selectedCategory, startDate, endDate).then(data =>{
          this.dataChartTeamMember = data;

          let selectedItem = this.teamMembers.find(tm => tm.value == this.selectedTeamMember);
          this.optionsChartTeamMember = {
            title: {
                display: true,
                text: selectedItem.label,
            }
          };
        }).catch(data => {this.dataChartTeamMember = data});
    }
  }

  /**
   * This method is to reset the table.
  */
  private resetTable(selectStatus: string) {
    switch (selectStatus) {
      case Constants.ALL_STATUSES:
        this.eclTableAllStatuses.resetDataTable();
        break;
      case Constants.IDEAS_GENERATED:
        this.eclTableIdeasGenerated.resetDataTable();
        break;
      case Constants.PROVISIONAL_RULES_GENERATED:
        this.eclTableProvisionalRulesGenerated.resetDataTable();
        break;
      case Constants.PROVISIONAL_RULES_ASSIGNED:
        this.eclTableProvisionalRulesAssigned.resetDataTable();
        break;
      case Constants.RULES_GENERATED:
        this.eclTableRulesGenerated.resetDataTable();
        break;
      case Constants.SHELVED:
        this.eclTableShelved.resetDataTable();
        break;
      case Constants.INVALID:
        this.eclTableInvalid.resetDataTable();
        break;
      case Constants.DUPLICATED:
        this.eclTableDuplicated.resetDataTable();
        break;
    }
  }

  /**
   * This method is to initialize table config.
  */
  private initializeTableConfig() {
    let eclTableParameters = this.getTableParameters(this.selectedStatus);
    let uri = RoutingConstants.TEAMS_URL + "/" + RoutingConstants.GET_TEAM_USER_ITEMS_DETAILS_URL + "?teamId=" + this.selectedTeam + "&userId=" + this.selectedTeamMember + "&status=" + eclTableParameters.status;
    if (this.selectedCategory !== undefined) {
      uri = uri + "&categoryId=" + this.selectedCategory;
    }
    if (this.selectedDates !== undefined && this.selectedDates !== null && this.selectedDates.length === 2) {
      let [startDate, endDate] = this.selectedDates;
      if (endDate !== null) endDate.setHours(0, 0, 0, 0);
      endDate = (endDate !== null) ? (endDate.getTime() === this.today.getTime() ?  this.tomorrow : endDate) :  this.tomorrow ;
      uri = uri + "&startDate=" + this.teamUpdatesReportService.parseDate(startDate) + "&endDate=" + this.teamUpdatesReportService.parseDate(endDate);
    }
    this.tableConfig.url = uri;
    this.tableConfig.columns = eclTableParameters.eclColumns;
    this.tableConfig.excelFileName = eclTableParameters.fileName;
  }

  /**
   * This method is to get the table parameters be means of the selected type.
  */
  private getTableParameters(selectedStatus: string): EclTableParameters {
    let eclTableParameters: EclTableParameters;
    let manager = new EclTableColumnManager();
    let status: string;
    let fileName: string;
    const alignment = 'center';
    switch (selectedStatus) {
      case Constants.ALL_STATUSES:
        fileName = "All Statuses";
        status = "ALL_STATUS";
        manager.addTextColumn('itemCode', 'ID',                            '20%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemName', 'Name',                          '30%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemStageDesc', 'Stage',                    '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCategoryDesc', 'Category',              '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCreatedFirstName', 'By',                '20%', true, EclColumn.TEXT, true,  0, alignment);
        break;
      case Constants.IDEAS_GENERATED:
        fileName = "Ideas Generated";
        status = "IDEA_CREATED";
        manager.addTextColumn('itemCode', 'Idea ID',                       '20%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemName', 'Idea Name',                     '30%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemStageDesc', 'Stage',                    '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCategoryDesc', 'Category',              '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCreatedFirstName', 'Idea Generated By', '20%', true, EclColumn.TEXT, true,  0, alignment);
        break;
      case Constants.PROVISIONAL_RULES_GENERATED:
        fileName = "Provisional Rules Generated";
        status = "PROVISIONAL_RULE_CREATED";
        manager.addTextColumn('itemCode', 'Provisional Rule ID',                       '20%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemName', 'Provisional Rule Name',                     '30%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemRuleStatusDesc', 'Status',                          '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCategoryDesc', 'Category',                          '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCreatedFirstName', 'Provisional Rule Generated By', '20%', true, EclColumn.TEXT, true,  0, alignment);
        break;
      case Constants.PROVISIONAL_RULES_ASSIGNED:
        fileName = "Provisional Rules Assigned";
        status = "PROVISIONAL_RULE_ASSIGNED";
        manager.addTextColumn('itemCode', 'Provisional Rule ID',                       '20%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemName', 'Provisional Rule Name',                     '30%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemRuleStatusDesc', 'Status',                          '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCategoryDesc', 'Category',                          '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemAssignedFirstName', 'Provisional Rule Assigned To', '20%', true, EclColumn.TEXT, true,  0, alignment);
        break;
      case Constants.RULES_GENERATED:
        fileName = "Rules Generated";
        status = "RULE_CREATED";
        manager.addTextColumn('itemCode', 'Rule ID',                       '20%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemName', 'Rule Name',                     '30%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemRuleStatusDesc', 'Status',              '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCategoryDesc', 'Category',              '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCreatedFirstName', 'Rule Generated By', '20%', true, EclColumn.TEXT, true,  0, alignment);
        break;
      case Constants.SHELVED:
        fileName = "Shelved";
        status = "SHELVED";
        manager.addTextColumn('itemCode', 'Provisional Rule ID',                             '20%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemName', 'Provisional Rule Name',                           '30%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemRuleStatusDesc', 'Status',                                '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCategoryDesc', 'Category',                                '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCreatedFirstName', 'Provisional Rule Generated By',       '20%', true, EclColumn.TEXT, true,  0, alignment);
        break;
      case Constants.INVALID:
        fileName = "Invalid";
        status = "INVALID";
        manager.addTextColumn('itemCode', 'Idea ID',                      '20%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemName', 'Idea Name',                    '30%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemStageDesc', 'Stage',                   '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCategoryDesc', 'Category',             '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCreatedFirstName', 'Idea Generated By','20%', true, EclColumn.TEXT, true,  0, alignment);
        break;
      case Constants.DUPLICATED:
        fileName = "Duplicated";
        status = "DUPLICATED";
        manager.addTextColumn('itemCode', 'Idea ID',                       '20%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemName', 'Idea Name',                     '30%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemStageDesc', 'Stage',                    '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCategoryDesc', 'Category',              '15%', true, EclColumn.TEXT, true,  0, alignment);
        manager.addTextColumn('itemCreatedFirstName', 'Idea Generated By', '20%', true, EclColumn.TEXT, true,  0, alignment);
        break;

    }
    eclTableParameters = {
      fileName: fileName,
      status: status,
      eclColumns: manager.getColumns()
    };
    return eclTableParameters;
  }


  /**
   * This method is to reset any selection at the screen.
  */
  private resetSelection() {
    this.thereAreParams = false;
    this.selectedTeam = this.teams[0].value;
    this.selectedTeamMember = undefined;
    this.selectedCategory =  undefined;
    this.selectedCategory = undefined;
    this.selectedDates = undefined;
    this.resetCharts();
  } 

  /**
   * This method is to reset charts.
  */
  private resetCharts(){
    this.dataChartTeam     = {};
    this.dataChartTeamMember = {};
    this.optionsCharTeam     = undefined;
    this.optionsChartTeamMember   = undefined;
  }

  onSelect(){
    if(this.selectedDates[0] && this.selectedDates[1]){
      this.calendar.overlayVisible = false;
    }
  }

}

interface EclTableParameters {
  eclColumns: EclColumn[];
  fileName: string;
  status: string;
}