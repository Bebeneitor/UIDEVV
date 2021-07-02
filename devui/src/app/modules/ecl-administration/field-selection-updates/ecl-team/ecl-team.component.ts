import { Component, OnInit, ViewChild, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { Table } from 'primeng/table';
import { Subject, of, Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime, mergeMap } from 'rxjs/operators';
import { FieldSelectionService } from 'src/app/services/field-selection.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserTeamCategoryMapRequestDto } from 'src/app/shared/models/dto/user-team-category-map-request-dto';
import { AppUtils } from 'src/app/shared/services/utils';
import { UserTeamCategoryMapDto } from 'src/app/shared/models/dto/user-team-category-map-dto';
import { Constants } from 'src/app/shared/models/constants';
import { TeamDto } from 'src/app/shared/models/dto/team-dto';

@Component({
  selector: 'app-ecl-team',
  templateUrl: './ecl-team.component.html',
  styleUrls: ['./ecl-team.component.css']
})

export class EclTeamComponent implements OnInit, OnDestroy {

  @ViewChild('dt',{static: true}) dataTable: Table;
  @Input() fieldSaveButton: boolean;
  @Input() default: boolean;
  @Output() saveButtonChange = new EventEmitter<Boolean>();
  @Output() defaultEmit = new EventEmitter<Boolean>();

  selectedTeams: any = [];
  categories: any[] = [];
  users: any[] = [];
  rcUsers: any[] = [];
  tempUsers: any[] = [];
  tempTeams: any[] = [];
  loading: boolean;
  selectedcca: any[] = [];
  selectedpo: any[] = [];
  addTeam: Subject<string> = new Subject<string>();
  filterTeam: Subject<string> = new Subject<string>();
  teamSub = new Subscription;
  teamFilterSub = new Subscription;
  catFilterdFlag: boolean = false;
  nameFilteredFlag: boolean = false;
  catTempUsers: any[] = [];
  nameTempUsers: any[] = [];
  savedCatString: string;
  savedNamestring: string;

  showTeam: boolean = false;
  teamList: any[] = [];

  cols = [
    { field: 'categories', header: 'Category', width: '66%' },
    { field: 'CCA', header: 'CCA', width: '17%' },
    { field: 'PO', header: 'PO', width: '17%' },
  ];

  pageTitle: string;
  rowCategoryMetadata: any;
  expandedRows: {} = {};
  userId: number = 0;
  rowExpand: boolean = false;
  tableLoaded: boolean = false;
  totalRecords: number = 0;
  temFilterField: string = "";
  newTeamField: string = "";
  showRuleCreation: boolean = false;
  userTeamCategoryMapRequest: UserTeamCategoryMapRequestDto = new UserTeamCategoryMapRequestDto();
  userTeamCategoryMapList: UserTeamCategoryMapDto[] = [];

  constructor(private util: AppUtils, private fielSelectionService: FieldSelectionService, private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.userId = this.util.getLoggedUserId();
    this.userTeamCategoryMapRequest.loggedInUserId = this.userId;
    this.userTeamCategoryMapRequest.fieldSelection = "team";

    this.fielSelectionService.getAllTeams().subscribe((response: any) => {
      response.data.forEach((team: any, index: number) => {
        this.teamList.push({ label: team.teamName, value: index });
      });
    });

    this.tempTeams = this.teamList;

    this.teamSub = this.filterTeam.pipe(
      distinctUntilChanged(),
      mergeMap(search => of(search).pipe(
        debounceTime(500)
      )),
    ).subscribe(item => {
      if (item !== '' && item !== null && item !== undefined) {
        this.teamList = this.tempTeams;
        this.teamList = this.teamList.filter(value => {
          return (value.label.trim().toLowerCase()).includes(item.trim().toLowerCase());
        });
      } else {
        this.teamList = this.tempTeams;
      }
    });

    this.teamFilterSub = this.addTeam.pipe(
      debounceTime(1200),
      distinctUntilChanged(),
      mergeMap(search => of(search).pipe(
        debounceTime(500)
      )),
    ).subscribe(item => {
      if (item !== '' && item !== null && item !== undefined) {
        this.fieldSaveButton = true;
        let teamReq = {
          saveBool: this.fieldSaveButton,
          teamValue: item
        }
      }
    });

    this.fielSelectionService.getUsersWithRolesByCategory().subscribe((response: any) => {
      response.data.forEach((category: any) => {
        let categoryName: string = category.categoryName;
        let categoryId: number = category.categoryId;
        let userRoles: any[] = category.userRoles;
        userRoles.forEach((user: any) => {
          this.rcUsers.push({
            categoryName: categoryName,
            categoryId: categoryId,
            userId: user.userId,
            firstName: user.userName,
            enabledCCA: user.roleCCA,
            checkedCCA: false,
            enabledPO: user.rolePO,
            checkedPO: false,
          });
        });
      });
      this.tempUsers = this.rcUsers;
      this.updateRowCategoryMetadata();
    });
  }

  ngOnDestroy() {
    this.teamSub.unsubscribe();
    this.teamFilterSub.unsubscribe();
  }

  showTeamChange() {
    this.showTeam = this.showTeam ? false : true;
    this.showRuleCreation = this.showTeam;
    if (this.showRuleCreation) {
      this.fieldSaveButton = true;
      this.saveButtonChange.emit(this.fieldSaveButton);
      this.newTeamField = "";
      this.userTeamCategoryMapRequest = new UserTeamCategoryMapRequestDto();
      this.teamList = [];
      this.rcUsers = [];
      this.ngOnInit();
    }
  }

  customSort(event: any) {
    this.rcUsers = event.data.reverse();
    this.updateRowCategoryMetadata();
  }

  onTypeNewTeamName() {
    this.fieldSaveButton = !this.checkNullForTeamName(this.newTeamField);
    this.saveButtonChange.emit(this.fieldSaveButton);
    this.newTeamField = this.util.capitalize(this.newTeamField);
    this.userTeamCategoryMapList.forEach((team: any) => team.teamName = this.newTeamField);
  }

  checkUncheckUserRol(rowData: any, role: string) {
    if (!this.existCategoryAndUserInList(rowData.categoryId, rowData.userId)) {
      let userTeamCategoryMap = new UserTeamCategoryMapDto();
      userTeamCategoryMap.userId = rowData.userId;
      userTeamCategoryMap.userName = rowData.userName;
      if (this.checkNullForTeamName(this.newTeamField)) {
        userTeamCategoryMap.teamName = this.newTeamField.trim();
      }
      userTeamCategoryMap.categoryId = rowData.categoryId;
      userTeamCategoryMap.categoryName = rowData.categoryName;
      userTeamCategoryMap.roleCCA = rowData.enabledCCA;
      userTeamCategoryMap.rolePO = rowData.enabledPO;
      userTeamCategoryMap.selectedCCA = rowData.checkedCCA;
      userTeamCategoryMap.selectedPO = rowData.checkedPO;
      userTeamCategoryMap.functionType = Constants.FUNCTION_TYPE_RC;
      this.userTeamCategoryMapList.push(userTeamCategoryMap);
    } else {
      this.userTeamCategoryMapList.forEach((categoryUser: any, index: number) => {
        if (categoryUser.categoryId == rowData.categoryId && categoryUser.userId == rowData.userId) {
          switch (role) {
            case "CCA":
              categoryUser.selectedCCA = rowData.checkedCCA;
              break;
            case "PO":
              categoryUser.selectedPO = rowData.checkedPO;
              break;
          }
          if (categoryUser.selectedCCA == false && categoryUser.selectedPO == false) {
            this.userTeamCategoryMapList.splice(index, 1);
          }
        }
      });
    }
    this.userTeamCategoryMapRequest.userTeamCategoryMapDtoList = this.userTeamCategoryMapList;
    console.log(this.userTeamCategoryMapList);
  }

  existCategoryAndUserInList(categoryId: number, userId: number): boolean {
    return this.userTeamCategoryMapList.some((categoryUser: any) =>
      categoryUser.categoryId == categoryId && categoryUser.userId == userId);
  }

  getFirstName(names: string) {
    return (names) ? names : '';
  }

  /**
   * Clean up of functionalities array (remove duplicated elements)
   * @param elements array of elements
   */
  uniqueElements(elements: any[]) {
    let auxElements = [];
    elements.forEach((item: any) => { auxElements.push(item) });
    return auxElements;
  }

  /**
   * Does the grouping of the CategoryName for rcUser Object
   */
  updateRowCategoryMetadata() {
    this.rowCategoryMetadata = {};
    if (this.rcUsers) {
      this.rcUsers.forEach((users, index) => {
        if (index === 0) {
          this.rowCategoryMetadata[users.categoryName] = { index: 0, size: 1 };
        } else {
          let previousRowData: any = this.rcUsers[index - 1];
          let previousCategoryName: string = previousRowData.categoryName;
          if (users.categoryName === previousCategoryName) {
            this.rowCategoryMetadata[users.categoryName].size++;
          } else {
            this.rowCategoryMetadata[users.categoryName] = { index: index, size: 1 };
          }
        }
      })
    }
  }

  /**
   * Expanding Row will Collapse All rows or Expand All rows
   */
  expandingRows() {
    if (!this.rowExpand) {
      this.rcUsers.forEach(users => {
        this.dataTable.expandedRowKeys[users.categoryName] = true;
      })
      this.rowExpand = true;
    } else {
      this.rcUsers.forEach(users => {
        this.dataTable.expandedRowKeys[users.categoryName] = false;
      })
      this.rowExpand = false;
    }
  }

  /**
   * CUSTOM FILTER FOR USERS NOT ACCORDION HEADERS
   * @param event Value to filter for
   */
  async customFilter(event: any) {
    if (!event && !this.catFilterdFlag) {
      this.rcUsers = this.tempUsers;
      this.nameFilteredFlag = false;
      this.updateRowCategoryMetadata();
    } else if (!event && this.catFilterdFlag) {
      this.rcUsers = this.tempUsers.filter(value => {
        return value.categoryName.toLowerCase().includes(this.savedCatString);
      })
      this.nameFilteredFlag = false;
      this.updateRowCategoryMetadata();
    } else {
      this.savedNamestring = event;
      if (!this.catFilterdFlag) {
        this.rcUsers = await this.tempUsers.filter(value => {
          return value.firstName.toLowerCase().includes(event.toLowerCase());
        }
        ).sort((a, b) => (a.categoryName > b.categoryName) ? 1 : ((b.categoryName > a.categoryName) ? -1 : 0));
        this.nameTempUsers = this.rcUsers;
        this.nameFilteredFlag = true;
        this.updateRowCategoryMetadata();
      } else {
        this.rcUsers = await this.tempUsers.filter(value => {
          return value.firstName.toLowerCase().includes(event.toLowerCase());
        }
        ).filter(value => {
          return value.categoryName.toLowerCase().includes(this.savedCatString.toLowerCase());
        }
        ).sort((a, b) => (a.categoryName > b.categoryName) ? 1 : ((b.categoryName > a.categoryName) ? -1 : 0));
        this.nameTempUsers = this.rcUsers;
        this.nameFilteredFlag = true;
        this.updateRowCategoryMetadata();
      }
    }
  }

  async customFilterHeaders(event: any) {
    if (!event && !this.nameFilteredFlag) {
      this.rcUsers = this.tempUsers;
      this.catFilterdFlag = false;
      this.updateRowCategoryMetadata()
    } else if (!event && this.nameFilteredFlag) {
      this.rcUsers = this.nameTempUsers;
      this.rcUsers = this.tempUsers.filter(value => {
        return value.firstName.toLowerCase().includes(this.savedNamestring);
      })
      this.updateRowCategoryMetadata();
    } else {
      this.savedCatString = event;
      if (!this.nameFilteredFlag) {
        this.rcUsers = await this.tempUsers.filter(value => {
          return value.categoryName.toLowerCase().includes(event.toLowerCase());
        }
        ).sort((a, b) => (a.categoryName > b.categoryName) ? 1 : ((b.categoryName > a.categoryName) ? -1 : 0));
        this.catTempUsers = this.rcUsers;
        this.catFilterdFlag = true;
        this.updateRowCategoryMetadata();
      } else {
        this.rcUsers = await this.tempUsers.filter(value => {
          return value.categoryName.toLowerCase().includes(event.toLowerCase());
        }
        ).filter(value => {
          return value.firstName.toLowerCase().includes(this.savedNamestring.toLowerCase());
        }
        ).sort((a, b) => (a.categoryName > b.categoryName) ? 1 : ((b.categoryName > a.categoryName) ? -1 : 0));
        this.catTempUsers = this.rcUsers;
        this.catFilterdFlag = true;
        this.updateRowCategoryMetadata();
      }
    }
  }

  refreshScreen() {
    this.fieldSaveButton = true;
    this.saveButtonChange.emit(this.fieldSaveButton);
    this.temFilterField = "";
    this.newTeamField = "";
    this.userTeamCategoryMapRequest = new UserTeamCategoryMapRequestDto();
    this.showRuleCreation = false;
    this.showTeam = false;
    this.teamList = [];
    this.rcUsers = [];
    this.ngOnInit();
  }

  checkNullForTeamName(teamName: string): boolean {
    let resp = false;
    if (teamName != null && teamName.trim() != '') {
      resp = true;
    }
    return resp;
  }

  existTeam(): boolean {
    let teamList: any[] = this.teamList;
    let newTeam: string;
    if (this.checkNullForTeamName(this.newTeamField)) {
      newTeam = this.newTeamField.trim();
    }
    return teamList.some((team: any) => team.label.trim().toLowerCase() === newTeam.toLowerCase());
  }

  /* Method to save a new team with the users and roles selected */
  saveNewTeam() {
    if (!this.existTeam() && this.checkNullForTeamName(this.newTeamField)) {
      this.confirmationService.confirm({
        key: "confirmCreateTeam",
        message: 'Are you sure you would like to create a New Team?',
        accept: () => {
          //Actual logic to perform when new team confirmation is yes
          let request = this.userTeamCategoryMapRequest;
          if (request.userTeamCategoryMapDtoList == undefined || request.userTeamCategoryMapDtoList == null) {
            let teamDto = new TeamDto();
            teamDto.teamName = this.newTeamField.trim();
            teamDto.loggedInUserId = this.userId;
            this.fielSelectionService.saveTeam(teamDto).subscribe((response: any) => {
              if (response.code == 200) {
                this.confirmationService.confirm({
                  key: "newTeamSuccessfully",
                  message: this.newTeamField.trim() + " created successfully",
                  accept: () => {
                    this.refereshFieldSelection();
                  }
                });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000, closable: true });
              }
            });
          } else {
            this.fielSelectionService.saveUserCategoriesMap(request).subscribe((response: any) => {
              if (response.code == 200) {
                this.confirmationService.confirm({
                  key: "newTeamSuccessfully",
                  message: this.newTeamField.trim() + " created successfully",
                  accept: () => {
                    this.refereshFieldSelection();
                  }
                });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000, closable: true });
              }
            });
          }
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn', summary: 'Warning',
        detail: "Team \"" + this.newTeamField + "\" already exists", life: 3000, closable: true
      });
    }
  }

  refereshFieldSelection() {
    this.fieldSaveButton = true;
    this.saveButtonChange.emit(this.fieldSaveButton);
    this.default = true;
    this.defaultEmit.emit(this.default);
  }

}