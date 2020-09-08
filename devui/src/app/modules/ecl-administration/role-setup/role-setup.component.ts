import { Component, OnInit, OnDestroy, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Elements } from 'src/app/shared/models/elements';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleSetupService } from 'src/app/services/role-setup.service';
import { Users } from 'src/app/shared/models/users';
import {ConfirmationService} from 'primeng/api';
import { UserAccessDto } from 'src/app/shared/models/dto/user-access-dto';
import { Constants } from 'src/app/shared/models/constants';
import { CcaPoSetupComponent } from './components/cca-po-setup/cca-po-setup.component';
import { UserTeamCategoryMapDto } from 'src/app/shared/models/dto/user-team-category-map-dto';
import { AppUtils } from 'src/app/shared/services/utils';


const PAGE_TITLE = 'User Authority Setup';
const WARN_HEADING = 'Warning!';
const USER_WARN_MESSAGE = 'Please select a user';
const ROLE_WARN_MESSAGE = 'Please select a role and team for the selected User';
const ENGINE_WARN_MESSAGE = 'Please select Rule Engine for the selected user'
const USER_ISSUE_HEADER = 'User access Setup Issue!';
const USER_TEAM_ISSUE_MESSAGE = 'Please select a Team for the User selected';
const USER_TEAM_CATEGORY_MAP_ISSUE_MESSAGE = 'Please add category details for the team selected for Rule Creation';
const USER_EXISTING_MESSAGE = 'User already exists please add a new user';
const ISSUE_MESSAGE = 'Try again or contact the administrator';
const SUCCESS_HEADER = 'Save Success';
const SUCCESS_MESSAGE = 'User access setup saved successfully';
const TEAM_DESELECT_MESSAGE = 'By removing a Team all category and team mapping will be removed. Are you sure you would like to proceed?';
const ROLE_DESELECT_MESSAGE = ' By removing a role assignment all category and team mapping will be removed. Are you sure you would like to proceed?';
@Component({
    selector: 'ecl-role-setup',
    templateUrl: './role-setup.component.html',
    styleUrls: ['./role-setup.component.css'],
    providers: [ConfirmationService]
})

export class RoleSetupComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChildren(CcaPoSetupComponent) ccaPoMappingComponent: QueryList<CcaPoSetupComponent>;
    displayViewAssignmentsComponent: boolean = false;
    functionType: any;
    pageTitle: string;
    roles: any[];// list to show the available roles
    roleObjList: any[] // list of all available roles Objects
    selectedRoles: number[];
    originalSelectedRoles: number[];
    selectedEngines: number[];
    selectedTeams: any[];
    teamsList: number[];
    selectedCreationCategoryMapDtoList: UserTeamCategoryMapDto[];
    selectedMaintenanceCategoryMapDtoList: UserTeamCategoryMapDto[];
    engines: any[];
    teams: any[];
    cols: any[];
    functionalities: any[];
    elements: Elements[];
    disableAccess: boolean = true;
    roleFunctionalityAccess: any[];
    selectedUser: Users;
    teamSelected: number;
    selectedUserName: string;
    userAccessDto: UserAccessDto;
    newUser: boolean = true;
    userSelected: boolean = false;
    userList: any[] = [];
    loggedInUserId: number; // logged in user Id

    successHeader: string;
    message: string;
    display: boolean = false;
    //true if not ediatble and false if editable flag for the username
    selectedEditable: boolean;
    loading: boolean;
    saveDisable: boolean;
    //boolean values to handle the child component behavioural changes
    creationOrMaintenance: boolean;//boolean value to fetch the category mapping data based on rule creation or maintenance(true: creation)
    ruleCreation: boolean;
    ruleMaintenance: boolean;
    rolePO: boolean;
    roleCCA: boolean;
    rolePOId: number;
    roleCCAId: number;
    teamValidation: boolean;
    categoryMappingDataRC: UserTeamCategoryMapDto[]; // list to show the userCategoryMappingData values
    categoryMappingDataListRC: UserTeamCategoryMapDto[];// parent list with actual categoryMappingData without any user specific
    categoryMappingDataRM: UserTeamCategoryMapDto[]; // list to show the userCategoryMappingData values
    categoryMappingDataListRM: UserTeamCategoryMapDto[];// parent list with actual categoryMappingData without any user specific

    constructor(private utilService: UtilsService, private route: ActivatedRoute, private router: Router, private roleSetupService: RoleSetupService,
        private confirmationService: ConfirmationService, private utils: AppUtils) {
        this.roles = [];
        this.functionalities = [];
        this.teams = [];
        this.engines = [];
        this.userAccessDto = new UserAccessDto();
        this.selectedUser = new Users();
        this.creationOrMaintenance = true;
        this.ruleCreation = true;
        this.ruleMaintenance = true;
        this.rolePO = false;
        this.roleCCA = false;
        this.teamValidation = false;
        this.saveDisable = false;
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'teamName', header: 'Teams', width: '80%' }
        ];
        this.saveDisable = false;
        this.getAllRoles();
        this.getAllRuleEngines();
        this.getAllRoleFunctionalities();
        this.getAllTeams();
        this.fetchAllUserSetUpCategoriesRM();
        this.fetchAllUserSetUpCategoriesRC();
        this.selectedRoles = [];
        this.originalSelectedRoles = [];
        this.selectedEngines = [];
        this.selectedTeams = [];
        this.selectedCreationCategoryMapDtoList = [];
        this.selectedMaintenanceCategoryMapDtoList = [];
        this.pageTitle = PAGE_TITLE;
        this.route.data.subscribe(params => {
            this.newUser = params['newUser'];
        });
        if (this.newUser) {
            this.selectedRoles = [];
            this.originalSelectedRoles = [];
            this.selectedEngines = [];
            this.selectedTeams = [];
            this.selectedEditable = false;
        }
        this.loading = true;
        this.loading = false;
        this.loggedInUserId = this.utils.getLoggedUserId();

    }

    ngAfterViewInit() {
        this.validateSelectedRole();
        if (sessionStorage.getItem("userAuthSetup")) {
            this.selectedUser = JSON.parse(sessionStorage.getItem("userAuthSetup"));
            this.selectedUserName = this.selectedUser.firstName;
            this.newUser = false;
            this.selectedEditable = true;
            this.getUserAccess(this.selectedUser.userId);
        }
    }

    ngOnDestroy() {
        if (sessionStorage.getItem("userAuthSetup")) {
            sessionStorage.removeItem("userAuthSetup");
        }
        if (sessionStorage.getItem("newUserSetUp")) {
            sessionStorage.removeItem("newUserSetUp");
        }
    }

    /* Method to select default role */
    selectDefaultRole() {
        if (this.roles.length > 0) {
            this.roles.forEach(role => {
                if (role.label === Constants.DEFAULT_ROLE) {
                    if (this.selectedRoles.includes(role.value)) {
                        //do nothing
                    } else {
                        this.selectedRoles.push(role.value);
                    }
                }
            });
        }
    }

    /* Method to enable and disable the CCA and PO flags based on the selected Roles*/
    validateSelectedRole() {
        if (this.selectedRoles) {
            if (this.selectedRoles.includes(this.roleCCAId)) {
                this.roleCCA = true;
            } else {
                this.roleCCA = false;
            }
            if (this.selectedRoles.includes(this.rolePOId)) {
                this.rolePO = true;
            } else {
                this.rolePO = false;
            }
            if (this.selectedRoles.includes(this.rolePOId) || this.selectedRoles.includes(this.roleCCAId)) {
                this.ruleMaintenance = false;
            } else {
                this.ruleMaintenance = true;
            }
        }
    }

    /* Function to search and add the user from the LDAP Library */

    searchUser() {
        if (this.selectedUserName.length >= 4) {
            
            this.roleSetupService.searchUserByName(this.trimSearchValue(this.selectedUserName)).subscribe(response => {
                if (response.data !== undefined && response.data !== null) {
                    if (response.data.length <= 0) {
                        this.newUser = true;
                        this.selectedEditable = false;
                    } else {
                        this.userList = [];
                        response.data.forEach(user => {
                            if (this.selectedUserName === user.userName) {
                                this.selectedUser = new Users();
                                this.selectedUser.userName = user.userName;
                                this.selectedUser.firstName = user.userName;
                                this.selectedUser.email = user.email;
                                this.selectedUserName = user.userName;

                            } else {
                                this.userList.push(user);
                            }
                        });
                        if (this.selectedUserName === this.selectedUser.userName) {
                            this.newUser = false;
                            this.saveDisable = false;
                            this.ruleCreation = true;
                            this.selectedRoles = [];
                            this.selectedEngines = [];
                            this.selectedTeams = [];
                            this.userList = [];
                            if (this.selectedUser.email) {
                                this.searchSelectedUserByEmail(this.selectedUser.email);
                            }
                        } else {
                            this.newUser = true;
                            this.selectedEditable = false;
                        }
                    }
                }
            });
        }
    }
/* Method to disable the user setup page and save button based on the user search */
    saveButtonDisable() {
        if (this.selectedUserName.length > 4 && this.selectedUser.userName) {
            this.saveDisable = false;
        } else {
            this.saveDisable = true;
            this.ruleMaintenance = true;
            this.ruleCreation = true;
            this.newUser = true;
        }
    }

    /* Function to search the selected user and add the deleted user */
    searchSelectedUserByEmail(email: string) {
        let userId;
        this.roleSetupService.searchUserByEmail(email).subscribe(response => {
            if (response.data != null && response.data != undefined && response.data != {}) {
                this.userAccessDto = response.data;
                userId = this.userAccessDto.userId;
                this.getUserAccess(userId);
            } else {
                this.selectDefaultRole();//assigning a default role if the user does not exist
                this.originalSelectedRoles = this.selectedRoles;
                this.validateSelectedRole();
                this.resetFlags();
                this.selectedCreationCategoryMapDtoList = [];
                this.fetchAllUserSetUpCategoriesRC();
                this.fetchAllUserSetUpCategoriesRM();
                this.showRoleFunctionalitiesAccess();
                this.selectedMaintenanceCategoryMapDtoList = this.categoryMappingDataListRM;
            }
        });
    }

    /* Method to fetch rule Maintenance categories */
    fetchAllUserSetUpCategoriesRM() {
        this.loading = true;
        this.roleSetupService.fetchAllUserSetUpCategoriesRM().subscribe(response => {
            if (response.data !== null && response.data !== undefined) {
                this.categoryMappingDataRM = [];
                this.categoryMappingDataListRM = [];
                let categories: any[] = response.data;
                this.categoryMappingDataRM = categories;
                this.categoryMappingDataListRM = categories;
            }
            this.loading = false;
        });
    }

    /* Method to fetch rule creation categories */
    fetchAllUserSetUpCategoriesRC() {
        this.loading = true;
        this.roleSetupService.fetchAllUserSetUpCategoriesRC().subscribe(response => {
            if (response.data !== null && response.data !== undefined) {
                this.categoryMappingDataRC = [];
                this.categoryMappingDataListRC = [];
                let categories: any[] = response.data;
                this.categoryMappingDataRC = categories;
                this.categoryMappingDataListRC = categories;
            }
            this.loading = false;
        });
    }

    /* Function to exit the user authority setup screen */

    exitUserAccess() {
        this.confirmationService.confirm({
            message: 'Do you really want to exit from user access setup? All unsaved changes will be lost!',
            header: 'Exit Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                if (sessionStorage.getItem("userAuthSetup")) {
                    sessionStorage.removeItem("userAuthSetup");
                } 
                if (sessionStorage.getItem("newUserSetUp")) {
                    sessionStorage.removeItem("newUserSetUp");
                }
                this.router.navigate(['/ecl-user-directory']);
            },
            reject: () => {
            }
        });
    }

    /* Functions to refresh the selected user existing access details */

    refreshUserAccess() {
        this.loading = true;
        if (this.selectedUser && this.selectedUser.userId) {
            this.confirmationService.confirm({
                message: 'Do you really want to refresh? All unsaved changes will be lost!',
                header: 'Refresh Confirmation',
                icon: 'pi pi-info-circle',
                accept: () => {
                    this.resetCategoriesList();
                    this.getUserAccess(this.selectedUser.userId);
                    if (sessionStorage.getItem("newUserSetUp")) {
                        sessionStorage.removeItem("newUserSetUp");
                    }
                },
                reject: () => {
                    this.loading = false;
                }
            });
        } else {
            this.loading = false;
        }
    }

    resetCategoriesList() {
        this.ccaPoMappingComponent.first.getNewCategoriesList();
        this.ccaPoMappingComponent.last.getNewCategoriesList();
    }

    /* Functions to get the selected user existing access details */

    getUserAccess(userId: number) {
        this.loading = true;
        this.roleSetupService.getUserAccess(userId).subscribe(response => {
            if (response.data != null && response.data != undefined && response.data != {}) {
                this.userAccessDto = response.data;
                this.resetCategoriesList();
                this.showSelectedUser(this.userAccessDto);
                this.showRoleFunctionalitiesAccess();
                this.loading = false;
            } else {
                this.loading = false;
            }
        });
    }

    /* Functions to show the selected user existing access details */

    showSelectedUser(userAccessDto: UserAccessDto) {
        this.selectedUser = new Users();
        this.selectedRoles = [];
        this.selectedEngines = [];
        this.selectedTeams = [];
        this.selectedCreationCategoryMapDtoList = [];
        this.selectedMaintenanceCategoryMapDtoList = [];
        this.selectedUserName = userAccessDto.firstName;
        this.selectedRoles = userAccessDto.rolesList;
        this.originalSelectedRoles = this.selectedRoles;
        this.selectedEngines = userAccessDto.ruleEnginesList;
        this.selectedTeams = this.teams.filter(team => userAccessDto.teamsList.includes(team.teamId));
        this.selectedUser.firstName = userAccessDto.firstName;
        this.selectedUser.userName = userAccessDto.userName;
        this.selectedUser.email = userAccessDto.email;
        this.selectedUser.userId = userAccessDto.userId;
        this.selectedCreationCategoryMapDtoList = userAccessDto.creationCategoryMapDtoList;
        this.selectedMaintenanceCategoryMapDtoList = userAccessDto.maintenanceCategoryMapDtoList;
        this.ccaPoMappingComponent.last.loadSelectedUserTeamCategoryMapping(this.selectedMaintenanceCategoryMapDtoList, !this.creationOrMaintenance);
        this.validateSelectedRole();
        this.selectDefaultRole();
        this.resetFlags();//method to reset required flags
    }

    validateSave() {
        let res: boolean = false;
    }
    /* Method to show validation message
    @Param: header
    @Param: message
    */
    validationMessage(header: string, message: string) {
        this.successHeader = header;
        this.message = message;
        this.display = true;

    }

    /* Method to validate save and rule engines selection */
    saveValidation() {
        let saveValidate: boolean = false;
        if (this.selectedUser === undefined) {
            saveValidate = false;
            this.validationMessage(WARN_HEADING, USER_WARN_MESSAGE);
        } else if (!this.userRoleTeamValidation()) {
            saveValidate = false;
        } else if (this.selectedEngines.length <= 0) {
            saveValidate = false;
            this.validationMessage(WARN_HEADING, ENGINE_WARN_MESSAGE);
        } else {
            saveValidate = true;
        }
        return saveValidate;
    }

    /* Method to return list of teams mapped to categories from the category mapped dto list */
    returnMappedTeamSelection() {
        let teamsMapped: number[] = [];
        this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.forEach(selectedCreationMapping => {
            teamsMapped.push(selectedCreationMapping.teamId);
        });
        return teamsMapped;
    }

    /* Method to validate user role team selection */

    userRoleTeamValidation() {
        let validate: boolean = false;
        if (this.selectedRoles.length > 0) {
            validate = true; // true if the roles are added to the user
            if (this.selectedRoles.includes(this.roleCCAId) || this.selectedRoles.includes(this.rolePOId)) {
                if (this.selectedTeams.length <= 0 && this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.length > 0) {
                    validate = false;
                    this.validationMessage(WARN_HEADING, USER_TEAM_ISSUE_MESSAGE);
                } else if (this.selectedTeams.length > 0 && this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.length <= 0) {
                    validate = false;
                    this.validationMessage(WARN_HEADING, USER_TEAM_CATEGORY_MAP_ISSUE_MESSAGE);
                } else if (this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.length > 0) {
                    let teamsMapped: number[] = [];
                    let teamExists: boolean = true;
                    teamsMapped = this.returnMappedTeamSelection();
                    this.returnTeamsList().forEach(teamId => {
                        if (teamExists) {
                            if (teamsMapped.includes(teamId)) {
                                teamExists = true; //
                            } else {
                                teamExists = false; // category mapping does not exist so boolean value 'false'
                                validate = false;
                                this.validationMessage(WARN_HEADING, USER_TEAM_CATEGORY_MAP_ISSUE_MESSAGE);
                            }
                        }
                    });
                }
            } else {
                validate = true;
            }
        } else {
            validate = false;
            this.validationMessage(WARN_HEADING, ROLE_WARN_MESSAGE);
        }
        return validate;
    }

    /* Functions to save the user access details selected */

    saveUserAccess() {
        if (this.saveValidation()) {
            this.saveDisable = true;
            this.loading = true;
            this.buildUserAccessDtoObject();
            this.roleSetupService.setUserAccess(this.userAccessDto).subscribe(response => {
                if (response) {
                    if (response.data.userId !== null && response.data.userId !== 0 && response.data.userId !== undefined) {
                        this.validationMessage(SUCCESS_HEADER, SUCCESS_MESSAGE);
                        this.loading = false;
                        this.resetCategoriesList();
                        this.showSelectedUser(response.data);
                        this.saveDisable = false;
                    } else if (response.data.userId === null || response.data.userId === 0 || response.data.userId === undefined) {
                        this.validationMessage(USER_ISSUE_HEADER, USER_EXISTING_MESSAGE);
                        this.saveDisable = false;
                        this.loading = false;
                    } else {
                        this.validationMessage(USER_ISSUE_HEADER, ISSUE_MESSAGE);
                        this.saveDisable = false;
                        this.loading = false;
                    }
                } else {
                    this.loading = false;
                }
            });
        }
    }

    /* Method to return the teamsList from the Selected Teams object List */
    resetFlags() {
        this.teamSelected = null;
        this.ruleCreation = true;
    }

    /* Method to return the teamsList from the Selected Teams object List */
    returnTeamsList() {
        this.teamsList = [];
        this.selectedTeams.forEach(team => {
            this.teamsList.push(team.teamId);
        });
        return this.teamsList;
    }

    /* Method to create the UserAccessDTO Object*/

    buildUserAccessDtoObject() {
        this.userAccessDto = new UserAccessDto();
        this.userAccessDto.email = this.selectedUser.email;
        this.userAccessDto.firstName = this.selectedUser.firstName;
        this.userAccessDto.userName = this.selectedUser.userName;
        this.userAccessDto.rolesList = this.selectedRoles;
        this.userAccessDto.ruleEnginesList = this.selectedEngines;
        this.userAccessDto.loggedInUserId = this.loggedInUserId;
        if (this.selectedUser.userId) {
            this.userAccessDto.userId = this.selectedUser.userId;
        }
        this.userAccessDto.teamsList = [];
        this.userAccessDto.teamsList = this.returnTeamsList();
        this.userAccessDto.creationCategoryMapDtoList = this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList;
        this.userAccessDto.maintenanceCategoryMapDtoList = this.ccaPoMappingComponent.last.returnUpdatedRMSelectedMappingList();
    }

    /* Functions to fetch all the Available RoleFunctionality and access dynamically on intial load of the module */

    private getAllRoleFunctionalities(): void {

        this.roleSetupService.getAllRoleFunctionalities().subscribe(response => {
            let roleFunctionalityAccess: any[] = response.data;
            this.roleFunctionalityAccess = [];
            if (roleFunctionalityAccess != null || roleFunctionalityAccess != undefined || roleFunctionalityAccess != []) {
                roleFunctionalityAccess.forEach(roleAccess => {
                    this.roleFunctionalityAccess.push(roleAccess);
                });
            }
        });
    }


    /* Functions to show all the Available RoleFunctionality and access dynamically on selecting the role */

    showRoleFunctionalitiesAccess() {
        let roles = this.selectedRoles;
        let functionalityIdArray: any[] = [];
        if (roles !== null && roles !== undefined && roles.length > 0) {
            this.roleSetupService.getUserRoleFunctionalityElements(roles).subscribe(response => {
                let roleFunctionalityAccess: any[] = response.data;
                this.roleFunctionalityAccess = [];
                if (roleFunctionalityAccess != null || roleFunctionalityAccess != undefined || roleFunctionalityAccess != []) {
                    roleFunctionalityAccess.forEach(roleAccess => {
                        this.roleFunctionalityAccess.push(roleAccess);
                    });
                    if (this.roleFunctionalityAccess !== null && this.roleFunctionalityAccess !== undefined) {
                        this.functionalities = [];
                        this.roleFunctionalityAccess.forEach(roleFunctionality => {
                            this.functionalities.push(roleFunctionality);
                        });
                    }
                }
            });
        } else {
            this.getAllFunctionalityAccess();
        }
    }

    /* Functions to fetch all the Available Roles dynamically on intial load of the module */

    private getAllRoles(): void {
        this.utilService.getAllRoles().subscribe(response => {
            let availableRoles: any[] = response;
            this.roles = [];
            this.roleObjList = [];
            this.roleObjList = availableRoles;
            if (availableRoles != null || availableRoles != undefined || availableRoles != []) {
                availableRoles.forEach(role => {
                    this.roles.push({ label: role.roleDescription, value: role.roleId });
                    if (role.roleName === Constants.CCA_ROLE) {
                        this.roleCCAId = role.roleId;
                    } else if (role.roleName === Constants.PO_ROLE) {
                        this.rolePOId = role.roleId;
                    }
                });
                if (this.roles.length > 1) {
                    for (let entry of this.roles) {
                        if (entry.label === Constants.DEFAULT_ROLE) {
                            entry["disabled"] = true;
                        }
                    }
                }
            }
        });
    }

    /* Method to fetch all the Teams values available dynamically on intial load of the module */

    private getAllRuleEngines(): void {
        this.utilService.getAllRuleEngines().subscribe(response => {
            let availableTeams: any[] = response.data;
            this.engines = [];
            if (availableTeams != null || availableTeams != undefined || availableTeams != []) {
                availableTeams.forEach(team => {
                    this.engines.push({ label: team.description, value: team.id });
                });
            }
        });
    }

    /* Method to fetch all the teams available */

    private getAllTeams(): void {
        this.utilService.getAllTeams().subscribe(response => {
            if (response.data !== null && response.data !== undefined) {
                this.teams = [];
                let teamsList = [];
                teamsList = response.data;
                teamsList.forEach(team => {
                    this.teams.push(team);
                });
            }
        });
    }

    /* Functions to fetch all the Access dynamically on intial load of the module */

    private getAllFunctionalityAccess(): void {
        this.utilService.getAllFunctionalityAccess().subscribe(response => {
            let availableFunctionalityAccess: any[] = response.data;
            this.functionalities = [];
            if (availableFunctionalityAccess != null || availableFunctionalityAccess != undefined || availableFunctionalityAccess != []) {
                availableFunctionalityAccess.forEach(functionalityAccess => {
                    this.functionalities.push(functionalityAccess);
                });
            }
        });
    }

    /**
     * Clean up of functionalities array (remove duplicated elements)
     * @param elements array of elements
     */
    uniqueElements(elements) {
        let auxElements = [];
        if (elements.length > 0) {
            elements.forEach(item => {
                let exists = false;
                auxElements.forEach(auxItem => {
                    if (item.elementId === auxItem.elementId) {
                        exists = true;
                    }
                });
                if (!exists) {
                    auxElements.push(item);
                }
            });
        }

        return auxElements;
    }

    /* Method to show the role validation message on unselecting the team for a user*/
    roleConfirmationMessage() {
        let roleId = this.originalSelectedRoles.filter(role => this.selectedRoles.indexOf(role) < 0)[0];
        this.originalSelectedRoles = this.selectedRoles;
        if ((roleId === this.rolePOId) || (roleId === this.roleCCAId)) {
            this.confirmationService.confirm({
                message: ROLE_DESELECT_MESSAGE,
                header: WARN_HEADING,
                icon: 'pi pi-info-circle',
                accept: () => {
                    if (roleId === this.rolePOId) {
                        this.removePORoleMappingData();
                    } else {
                        this.removeCCARoleMappingData();
                    }
                    this.resetTeams(); // reset teams list if both the CCA and PO roles are removed
                },
                reject: () => {
                    this.addSelectedRole(roleId);
                    this.validateSelectedRole(); //validate after adding back the role
                    this.showRoleFunctionalitiesAccess();// show selected Roles Functionality Access
                }
            });
        }
    }
    /* Method to add toggled selected role to the roles list*/
    addSelectedRole(roleId: number) {
        if (this.selectedRoles.length > 0) {
            this.selectedRoles.push(roleId);

        } else {
            this.selectedRoles = [];
            this.selectedRoles.push(roleId);
        }
    }

    /* Method to reset teams if CCA and PO role is removed*/
    resetTeams() {
        if ((!this.selectedRoles.includes(this.rolePOId)) && (!this.selectedRoles.includes(this.roleCCAId))) {
            this.selectedTeams = [];
            this.teamSelected = null;
            this.ccaPoMappingComponent.first.getNewCategoriesList();
        }
        if (this.teamSelected) {
            this.loadRCTeamCategoryMapping(this.teamSelected);
        }
    }

    /* Method to remove PO role mapping from the selected category mapping list if PO role is unselected */
    removePORoleMappingData() {
        this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.forEach(selectedMappingObj => {
            selectedMappingObj.selectedPO = false;
        });
        this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList = this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.filter(selectedMappingObj =>
            ((selectedMappingObj.categoryMappingId !== null) || (selectedMappingObj.selectedCCA === true))
        );
        this.ccaPoMappingComponent.last.selectedMaintenanceCategoryMapDtoList.forEach(selectedMappingObj => {
            if (!selectedMappingObj.rolePO) {
                selectedMappingObj.selectedPO = false;
            }
        });
    }

    /* Method to remove CCA role mapping from the selected category mapping list if CCA role is unselected */
    removeCCARoleMappingData() {
        this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.forEach(selectedMappingObj => {
            selectedMappingObj.selectedCCA = false;
        });
        this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList = this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.filter(selectedMappingObj =>
            ((selectedMappingObj.categoryMappingId !== null) || (selectedMappingObj.selectedPO === true))
        );
        this.ccaPoMappingComponent.last.selectedMaintenanceCategoryMapDtoList.forEach(selectedMappingObj => {
            selectedMappingObj.selectedCCA = false;
        });
        this.ccaPoMappingComponent.last.loadSelectedUserTeamCategoryMapping(this.ccaPoMappingComponent.last.selectedMaintenanceCategoryMapDtoList, !this.creationOrMaintenance);
    }

    /* Method to show the team validation message on unselecting the team for a user*/
    teamConfirmationMessage(team: any) {
        this.confirmationService.confirm({
            message: TEAM_DESELECT_MESSAGE,
            header: WARN_HEADING,
            icon: 'pi pi-info-circle',
            accept: () => {
                this.removeSelectedTeamMapping(team);
            },
            reject: () => {
                this.addSelectedTeam(team);
            }
        });
    }

    /* Method to add toggled selected team to the teams list*/
    addSelectedTeam(team) {
        let teamList = [];
        teamList = this.selectedTeams;
        if (teamList.length > 0) {
            this.selectedTeams = [];
            teamList.forEach(teamObj => {
                this.selectedTeams.push(teamObj);
            });
            this.selectedTeams.push(team);
        } else {
            this.selectedTeams = [];
            this.selectedTeams.push(team);
        }
    }

    /* Method to remove the user team category mapping from the rule creation selected list when a team is unselected */
    removeSelectedTeamMapping(selectedTeam: any) {
        this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.forEach(selectedMappingObj => {
            if (selectedMappingObj.categoryMappingId) {
                if (selectedMappingObj.teamId === selectedTeam.teamId) {
                    selectedMappingObj.selectedCCA = false;
                    selectedMappingObj.selectedPO = false;
                    selectedMappingObj.teamId = null;
                }
            }
        });
        this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList =
            this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.filter(selectedUserTeamCategoryMapObj =>
                selectedUserTeamCategoryMapObj.teamId !== selectedTeam.teamId
            );

        if (this.teamSelected === selectedTeam.teamId) {
            this.teamSelected = null;
            this.ccaPoMappingComponent.first.getNewCategoriesList();// refersh the rule creation category mapping list if the selected team is removed
        }
    }

    /* Method to load the existing userCategoryMapping of rule creation
    based on the team selection of the user*/

    loadSelectedTeamCategoryMapping(selectedTeam: any) {
        if (this.selectedTeams.length > 0) {
            if (this.selectedTeams.includes(selectedTeam)) {
                this.teamSelected = selectedTeam.teamId;
                this.ruleCreation = false;
                this.loadRCTeamCategoryMapping(selectedTeam.teamId);
            }
        } else {
            this.ruleCreation = true;
        }
    }

  showDialog(functionType: any) {
    this.displayViewAssignmentsComponent = true;
    this.functionType = functionType;
  }

  onDialogClose(event) {
    this.displayViewAssignmentsComponent = event;
  }

    /* Method to load the existing userCategoryMapping of rule creation
    based on the team selection of the user by passing the selected teamId*/

    loadRCTeamCategoryMapping(selectedTeamId: number) {
        let selectedTeamCategoryMappingList = [];
        this.selectedTeams.forEach(team => {
            if (team.teamId === selectedTeamId) {
                if (this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList) {
                    this.ccaPoMappingComponent.first.selectedCreationCategoryMapDtoList.forEach(selectedMappingObj => {
                        if (selectedTeamId === selectedMappingObj.teamId) {
                            selectedTeamCategoryMappingList.push(selectedMappingObj);
                        }
                    });
                }
            }
        });
        this.ccaPoMappingComponent.first.loadSelectedUserTeamCategoryMapping(selectedTeamCategoryMappingList, this.creationOrMaintenance);
    }

    trimSearchValue(selectedUserName: string){        
             return selectedUserName.replace(/[%;]/g, "");;
    }
}
