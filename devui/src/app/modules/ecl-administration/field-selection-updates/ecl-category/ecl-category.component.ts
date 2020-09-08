import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppUtils } from "../../../../shared/services/utils";
import { FieldSelectionUpdatesService } from "../../../../services/field-selection-updates.service";
import { Table } from "primeng/table";
import { Constants } from "../../../../shared/models/constants";
import { UserTeamCategoryMapDto } from "../../../../shared/models/dto/user-team-category-map-dto";
import { UserTeamCategoryMapRequestDto } from "../../../../shared/models/dto/user-team-category-map-request-dto";

@Component({
  selector: 'app-ecl-category',
  templateUrl: './ecl-category.component.html',
  styleUrls: ['./ecl-category.component.css']
})

export class EclCategoryComponent implements OnInit {

  @ViewChild('dt') dataTable: Table;
  @Input() fieldSaveButton: boolean;
  @Output() saveCategory = new EventEmitter();
  @Input() default: boolean;
  @Output() defaultEmit = new EventEmitter();
  @Output() isNewCategoryDuplicated: EventEmitter<boolean> = new EventEmitter();

  selectedCategories: any = [];
  categories: any[] = [];
  categoriesList: string[] = [];
  categoryOptions: string[] = [];
  rmUsers: UserTeamCategoryMapDto[] = [];
  rcUsers: UserTeamCategoryMapDto[] = [];
  originalRcUsers: UserTeamCategoryMapDto[] = [];
  originalRmUsers: UserTeamCategoryMapDto[] = [];

  loading: boolean;
  searchCategoryName: string;
  selectedCategory: string;
  rowGroupMetadata: any;
  rowExpand: boolean = false;
  addNewCategory: boolean = false; //boolean value to show and hide the input field
  addNewUserRole: boolean = false;

  /***Indicators for category setup validations***/
  hasAtLeastOnePoInRuleCreation: boolean = false;
  hasAtLeastOneCcaInRuleCreation: boolean = false;
  isRuleCreationValid: boolean = false;
  hasExactlyOnePoInRuleMaintenance: boolean = false;
  hasAtLeastOneCcaInRuleMaintenance: boolean = false;

  /***Indicators to enable Save button***/
  isNewCategoryStarted: boolean = false;
  isRuleCreationStarted: boolean = false;
  isRuleMaintenanceCcaStarted: boolean = false;
  isRuleMaintenancePoStarted: boolean = false;

  /***For save and warning diaglog***/
  saveMessage: string;
  warningMessage: string;
  saveDisplay: boolean = false;
  warningDisplay: boolean = false;
  confirmOk: boolean = false;

  /** for save new category**/
  selectedRMUserDto: UserTeamCategoryMapDto;
  selectedRCUserDto: UserTeamCategoryMapDto;
  selectedUserTeamCategoryMapDtoList: UserTeamCategoryMapDto[] = [];
  userTeamCategoryMapRequestDto: UserTeamCategoryMapRequestDto;
  tempRMUsers: UserTeamCategoryMapDto[] = [];
  tempRCUsers: UserTeamCategoryMapDto[] = [];




  cols = [
    { field: 'User', header: 'User', width: '30%' },
    { field: 'CCA', header: 'CCA', width: '10%' },
    { field: 'PO', header: 'PO', width: '10%' },
  ];

  rcCols = [
    { field: 'Team', header: 'Team', width: '66%' },
    { field: 'CCA', header: 'CCA', width: '17%' },
    { field: 'PO', header: 'PO', width: '17%' },
  ];

  constructor(private util: AppUtils, private fieldSelectionUpdatesService: FieldSelectionUpdatesService) { }

  ngOnInit() {
    this.fetchAllCategories();
    this.fetchUsersforRMSelections();
    this.fetchUsersforRCSelections();
    this.loading = false;
    this.addNewCategory = false;
    this.addNewUserRole = false;
    this.confirmOk = false;
    this.userTeamCategoryMapRequestDto = new UserTeamCategoryMapRequestDto();
    this.userTeamCategoryMapRequestDto.fieldSelection = Constants.CATEGORY;
    this.userTeamCategoryMapRequestDto.loggedInUserId = this.util.getLoggedUserId();
  }

  /* Method to show and hide the input text box in the list to enter new category */
  showNewCategoryInput() {
    if (this.addNewCategory && this.addNewUserRole) {
      this.addNewCategory = false;
      this.addNewUserRole = false;
    } else {
      this.addNewCategory = true;
      this.addNewUserRole = true;
    }
  }

  /* Method to fetch all the available categories and add them to categories lists */
  fetchAllCategories() {
    this.util.getAllCategoriesForUserSetup(this.categories).then((res: any) => {
      let categoriesList: any = [];
      this.categoriesList = [];
      this.categoryOptions = [];
      categoriesList = res;
      categoriesList.forEach(category => {
        this.categoriesList.push(category.label);
        this.categoryOptions.push(category.label);
      });
    });
  }

  /* Method to search and filter the available categories list and show the list based on the search criteria */
  searchCategoryList() {
    if (this.searchCategoryName) {
      this.categoriesList = this.categoryOptions.filter(category =>
        category.toLowerCase().includes(this.searchCategoryName.toLowerCase()));
    } else {
      this.categoriesList = this.categoryOptions;
    }
  }

  /* Method to check if the new category entered already exists or not */
  checkDupCategory() {
    this.validateDuplicatedCategory();
    this.enableSaveButton();
  }

  pasteDupCategory(event: ClipboardEvent) {
    let pastedText = event.clipboardData.getData('text');
    if (pastedText) {
      this.validateDuplicatedCategory(pastedText.toLowerCase());
      this.enableSaveButton();
    }
  }

  /* Method to check if the new category entered already exists or not */
  validateDuplicatedCategory(value?) {
    const catLower = this.categoriesList.map(ele => ele.toLowerCase());
    const selectCatLower = this.selectedCategory.toLowerCase() || value;
    if (catLower.includes(selectCatLower)) {
      this.isNewCategoryStarted = true;
      this.isNewCategoryDuplicated.emit(true);
    } else if (!this.selectedCategory) {
      this.isNewCategoryStarted = false;
    } else {
      this.isNewCategoryStarted = true;
      this.isNewCategoryDuplicated.emit(false);
    }
  }

  /***Method to validate Rule Creation section***/
  validateRuleCreationSelection() {
    const teamNameList = this.rcUsers.map(ele => ele.teamName);
    const teamNameListNoDuplicates = [...new Set(teamNameList)];
    this.hasAtLeastOnePoInRuleCreation = false;
    this.hasAtLeastOneCcaInRuleCreation = false;

    let itemsInTeam: any[] = [];
    let selectedCcaList: any[] = [];
    let selectedPoList: any[] = [];
    for (let teamN of teamNameListNoDuplicates) {
      itemsInTeam = this.rcUsers.filter(item => item.teamName === teamN);
      selectedCcaList = itemsInTeam.filter(item => item.selectedCCA === true);
      if (selectedCcaList.length > 0) {
        this.hasAtLeastOneCcaInRuleCreation = true;
      } else {
        this.hasAtLeastOneCcaInRuleCreation = false;
      }

      itemsInTeam = this.rcUsers.filter(item => item.teamName === teamN);
      selectedPoList = itemsInTeam.filter(item => item.selectedPO === true);
      if (selectedPoList.length > 0) {
        this.hasAtLeastOnePoInRuleCreation = true;
      } else {
        this.hasAtLeastOnePoInRuleCreation = false;
      }

      if (this.hasAtLeastOneCcaInRuleCreation && this.hasAtLeastOnePoInRuleCreation) {
        this.isRuleCreationValid = true;
        break;
      } else if ((!this.hasAtLeastOneCcaInRuleCreation && this.hasAtLeastOnePoInRuleCreation) ||
        (this.hasAtLeastOneCcaInRuleCreation && !this.hasAtLeastOnePoInRuleCreation)) {
        this.isRuleCreationValid = false;
      }

    }

  }

  /***Method to validate Rule Maintenance section***/
  validateRuleMaintenanceSelection() {
    const ccaListRoleNotNull = this.rmUsers.filter(user => user.selectedCCA != null);
    const ccaList = ccaListRoleNotNull.filter(user => user.selectedCCA);
    if (ccaList.length > 0) {
      this.hasAtLeastOneCcaInRuleMaintenance = true;
    } else {
      this.hasAtLeastOneCcaInRuleMaintenance = false;
      return;
    }

    const poListRoleNotNull = this.rmUsers.filter(user => user.selectedPO != null);
    const poList = poListRoleNotNull.filter(user => user.selectedPO);
    if (poList.length === 1) {
      this.hasExactlyOnePoInRuleMaintenance = true;
    } else {
      this.hasExactlyOnePoInRuleMaintenance = false;
      return;
    }
  }

  /***Method to save a new category***/
  saveNewCategory() {
    this.saveMessage = 'Are you sure you would like to create a new category?';
    this.saveDisplay = true;
  }

  /***OK button is clicked on warningDisplay dialog***/
  warningDialogOk() {
    this.warningDisplay = false;
    if (this.confirmOk) {
      this.refereshFieldSelection();
    }
  }

  /***Yes button is clicked on saveDisplay dialog***/
  saveDialogYes() {
    this.saveDisplay = false;
    /******************************************************************************* */
    /****************************Call Save service here*******************************/
    /******************************************************************************* */

    this.userTeamCategoryMapRequestDto.userTeamCategoryMapDtoList = [];
    this.selectedUserTeamCategoryMapDtoList = [];
    /*** Rule Maintenance Users filter based on selected PO and CCA ***/
    this.tempRMUsers = this.rmUsers.filter(rmUser => {
      if (rmUser.selectedCCA && rmUser.selectedPO) {
        return rmUser;
      } else if (rmUser.selectedCCA) {
        return rmUser;
      } else if (rmUser.selectedPO) {
        return rmUser;
      }
    });

    if (this.tempRMUsers && this.tempRMUsers.length > 0) {
      this.tempRMUsers.forEach(rm => {
        this.selectedRMUserDto = new UserTeamCategoryMapDto;
        this.selectedRMUserDto.categoryName = this.selectedCategory;
        this.selectedRMUserDto.functionType = Constants.FUNCTION_TYPE_RM;
        this.selectedRMUserDto.userId = rm.userId;
        this.selectedRMUserDto.selectedPO = rm.selectedPO;
        this.selectedRMUserDto.selectedCCA = rm.selectedCCA;
        this.selectedUserTeamCategoryMapDtoList.push(this.selectedRMUserDto);
      });
    }

    /*** Rule Creation Users filter based on selected PO and CCA ***/
    this.tempRCUsers = this.rcUsers.filter(rcUser => {
      if (rcUser.selectedCCA && rcUser.selectedPO) {
        return rcUser;
      } else if (rcUser.selectedCCA) {
        return rcUser;
      } else if (rcUser.selectedPO) {
        return rcUser;
      }
    });

    if (this.tempRCUsers && this.tempRCUsers.length > 0) {
      this.tempRCUsers.forEach(rc => {
        this.selectedRCUserDto = new UserTeamCategoryMapDto;
        this.selectedRCUserDto.categoryName = this.selectedCategory;
        this.selectedRCUserDto.functionType = Constants.FUNCTION_TYPE_RC;
        this.selectedRCUserDto.teamId = rc.teamId;
        this.selectedRCUserDto.userId = rc.userId;
        this.selectedRCUserDto.selectedPO = rc.selectedPO;
        this.selectedRCUserDto.selectedCCA = rc.selectedCCA;
        this.selectedUserTeamCategoryMapDtoList.push(this.selectedRCUserDto);
      });
    }

    this.userTeamCategoryMapRequestDto.userTeamCategoryMapDtoList = this.selectedUserTeamCategoryMapDtoList;

    this.fieldSelectionUpdatesService.saveSelectedCategory(this.userTeamCategoryMapRequestDto).subscribe(resp => {
      if (resp && resp !== []) {
        this.warningMessage = `${this.selectedCategory} created successfully`;
        this.warningDisplay = true;
        this.confirmOk = true;
      }
    });
  }

  /***Refresh the page***/
  refreshAddCategory() {
    this.fetchAllCategories();
    this.fetchUsersforRMSelections();
    this.fetchUsersforRCSelections();
    this.loading = false;
    this.addNewCategory = false;
    this.selectedCategory = "";
    this.addNewUserRole = false;
    this.userTeamCategoryMapRequestDto.userTeamCategoryMapDtoList = [];
    this.selectedUserTeamCategoryMapDtoList = [];
    this.saveCategory.emit(true);
  }

  /***No button is clicked on saveDisplay dialog***/
  saveDialogNo() {
    this.saveDisplay = false;
  }

  /***Method to indicate Rule Creation CCA and PO are ticked***/
  ruleCreationTicked() {
    this.validateRuleCreationSelection();
    if (this.isRuleCreationValid) {
      this.isRuleCreationStarted = true;
    } else {
      this.isRuleCreationStarted = false;
    }
    this.enableSaveButton();
  }

  /***Method to indicate Rule Maintenance CCA is ticked***/
  ruleMaintenanceCcaTicked() {
    let tempUsers: any[] = [];
    tempUsers = this.rmUsers.filter(rmUser => rmUser.selectedCCA);
    if (tempUsers.length > 0) {
      this.isRuleMaintenanceCcaStarted = true;
    } else {
      this.isRuleMaintenanceCcaStarted = false;
    }
    this.enableSaveButton();
  }

  /***Method to indicate Rule Maintenance PO is ticked***/
  ruleMaintenancePoTicked(tickedUser) {
    if (tickedUser.selectedPO) {
      let tempUsers = this.rmUsers;
      this.rmUsers = this.originalRmUsers;
      this.rmUsers.forEach(user => user.selectedPO = (user.userId === tickedUser.userId));
      this.rmUsers = tempUsers;
      this.isRuleMaintenancePoStarted = true;
    } else {
      this.isRuleMaintenancePoStarted = false;
    }
    this.enableSaveButton();
  }

  /***Method to enable Save button */
  enableSaveButton() {
    if (this.isNewCategoryStarted && this.isRuleCreationStarted &&
      this.isRuleMaintenanceCcaStarted && this.isRuleMaintenancePoStarted) {

      this.saveCategory.emit(false);  //false -> Save button is enable
    } else {
      this.saveCategory.emit(true); //true -> Save button is disable
    }
  }

  private fetchUsersforRMSelections(): void {
    this.loading = true;
    this.fieldSelectionUpdatesService.getAllUsersForRM().subscribe((response: any) => {
      if (response.data != null && response.data != undefined && response.data != {}) {
        this.rmUsers = response.data;
        this.originalRmUsers = this.rmUsers;
        this.loading = false;
      }
    });
  }

  getFirstName(names: string) {
    return (names) ? names : '';
  }

  private fetchUsersforRCSelections(): void {
    this.loading = true;
    this.fieldSelectionUpdatesService.getAllTeamUsersForRC().subscribe((response: any) => {
      if (response.data != null && response.data != undefined && response.data != {}) {
        this.rcUsers = response.data;
        this.updateRowGroupMetaData();
        this.originalRcUsers = this.rcUsers;
        this.loading = false;
      }
    });

  }

  /**
   * Clean up of functionalities array (remove duplicated elements)
   * @param elements array of elements
   */
  uniqueElements(elements) {

    let auxElements = [];
    elements.forEach(item => { auxElements.push(item) });
    return auxElements;
  }


  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.rcUsers) {
      this.rcUsers.forEach((users, index) => {
        if (index === 0) {
          this.rowGroupMetadata[users.teamName] = { index: 0, size: 1 };
        } else {
          let previousRowData: any = this.rcUsers[index - 1];
          let previousGroupName: string = previousRowData.teamName;
          if (users.teamName === previousGroupName) {
            this.rowGroupMetadata[users.teamName].size++;
          } else {
            this.rowGroupMetadata[users.teamName] = { index: index, size: 1 };
          }
        }
      })

    }
  }

  /*
   * Expanding Row will Collapse All rows or Expand All rows
   */
  expandingRows() {
    if (!this.rowExpand) {
      this.rcUsers.forEach(users => {
        this.dataTable.expandedRowKeys[users.teamName] = true;
      });
      this.rowExpand = true;
    } else {
      this.rcUsers.forEach(users => {
        this.dataTable.expandedRowKeys[users.teamName] = false;
      });
      this.rowExpand = false;
    }
  }

  /**
   * CUSTOM FILTER FOR USERS NOT ACCORDION HEADERS
   * @param event Value to filter for
   * @param colField Column filed to check against
   */
  customFilter(event) {
    this.rcUsers = this.originalRcUsers;
    this.rcUsers = this.rcUsers.filter(value => {
      return value.userName.toLowerCase().includes(event.toLowerCase());
    });
    this.updateRowGroupMetaData();
  }
  /***Search filter for Team accordian***/
  customFilterHeaders(event) {
    this.rcUsers = this.originalRcUsers;
    this.rcUsers = this.rcUsers.filter(value => {
      return value.teamName.toLowerCase().includes(event.toLowerCase());
    });
    this.updateRowGroupMetaData();
  }

  /***Search for users in Rule Maintenance***/
  userRmSearch(event) {
    this.rmUsers = this.originalRmUsers;
    this.rmUsers = this.rmUsers.filter(value => {
      return value.userName.toLowerCase().includes(event.toLowerCase());
    });
  }

  refereshFieldSelection() {
    this.fieldSaveButton = true;
    this.saveCategory.emit(this.fieldSaveButton);
    this.default = true;
    this.defaultEmit.emit(this.default);
  }

}
