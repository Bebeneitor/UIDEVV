import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Categories } from 'src/app/shared/models/categories';
import { AppUtils } from 'src/app/shared/services/utils';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserTeamCategoryMapDto } from 'src/app/shared/models/dto/user-team-category-map-dto';
import { RoleSetupService } from 'src/app/services/role-setup.service';

const FIELD_CATEGORY = "categoryName";
const FIELD_SELECTED_CCA = "selectedCCA";
const FIELD_SELECTED_PO = "selectedPO";

@Component({
  selector: 'app-cca-po-setup',
  templateUrl: './cca-po-setup.component.html',
  styleUrls: ['./cca-po-setup.component.css']
})
export class CcaPoSetupComponent implements OnInit {

  @Input() creationOrMaintenance: boolean;
  @Input() selectedCreationCategoryMapDtoList: UserTeamCategoryMapDto[];
  @Input() selectedMaintenanceCategoryMapDtoList: UserTeamCategoryMapDto[];
  @Input() roleCCA: boolean;
  @Input() rolePO: boolean;
  @Input() teamSelected: number;
  @Input() roleDisable: boolean;
  @Input() categoryMappingData: UserTeamCategoryMapDto[]; // list to show the userCategoryMappingData values
  @Input() categoryMappingDataList: UserTeamCategoryMapDto[];// parent list with actual categoryMappingData without any user specific

  @ViewChild('viewGrid',{static: true}) viewGrid: Table;

  cols: any[];
  loading: boolean;
  selectedRMUserTeamCategoryMapObj: UserTeamCategoryMapDto;

  constructor(private roleSetupService: RoleSetupService) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'categoryName', header: 'Categories', width: '60%' },
      { field: 'selectedCCA', header: 'CCA', width: '20%' },
      { field: 'selectedPO', header: 'PO', width: '20%' }
    ];
  }
  /* Method to fetch all the available categories in the user team category DTO format */

  returnUpdatedRMSelectedMappingList() {
    let userSelectedMaintenanceCategoryMappingList: UserTeamCategoryMapDto[] = [];

    this.selectedMaintenanceCategoryMapDtoList.forEach(selectedUserTeamCategoryDto => {
      if (selectedUserTeamCategoryDto.rolePO && selectedUserTeamCategoryDto.selectedCCA) {
        selectedUserTeamCategoryDto.selectedPO = false;
        userSelectedMaintenanceCategoryMappingList.push(selectedUserTeamCategoryDto);
      } else if ((!selectedUserTeamCategoryDto.rolePO)&&(selectedUserTeamCategoryDto.selectedCCA || selectedUserTeamCategoryDto.selectedPO)) {
        userSelectedMaintenanceCategoryMappingList.push(selectedUserTeamCategoryDto);
      } else if (selectedUserTeamCategoryDto.categoryMappingId) {
        userSelectedMaintenanceCategoryMappingList.push(selectedUserTeamCategoryDto);
      }
    });
    return userSelectedMaintenanceCategoryMappingList;
  }

  /* Method to load the selected user team category mapping data for the selected user
  using the rule creation or maintenace flag*/

  loadSelectedUserTeamCategoryMapping(selectedUserTeamCategoryMappingList: UserTeamCategoryMapDto[], creationOrMaintenance: boolean) {
    this.categoryMappingData = [];
    if (creationOrMaintenance) {
      this.categoryMappingData = [];
      this.getNewCategoriesList();
      if (selectedUserTeamCategoryMappingList.length > 0) {
        selectedUserTeamCategoryMappingList.forEach(selectedUserTeamCategoryDto => {
          this.categoryMappingData.forEach(UserTeamCategoryMappingDtoObj => {
            if (UserTeamCategoryMappingDtoObj.categoryId === selectedUserTeamCategoryDto.categoryId) {
              UserTeamCategoryMappingDtoObj.categoryMappingId = selectedUserTeamCategoryDto.categoryMappingId;
              this.returnUserTeamCategoryMapDtoObject(selectedUserTeamCategoryDto, UserTeamCategoryMappingDtoObj);
            }
          });
        });
      } else {
        this.categoryMappingData = null;
        this.categoryMappingData = [];
        this.getNewCategoriesList();
      }
    } else {
      this.categoryMappingData = [];
      this.categoryMappingData = this.categoryMappingDataList;
      if (selectedUserTeamCategoryMappingList.length > 0) {
        this.categoryMappingData = selectedUserTeamCategoryMappingList;
      }
    }
  }

  /* Method to refresh the categoryMappingDataList from the original reference list*/

  getNewCategoriesList() {
    this.categoryMappingData = [];
    this.categoryMappingDataList.forEach(UserTeamCategoryMappingDtoObj => {
      UserTeamCategoryMappingDtoObj.selectedCCA = false;
      UserTeamCategoryMappingDtoObj.selectedPO = false;
      UserTeamCategoryMappingDtoObj.categoryMappingId = null;
      UserTeamCategoryMappingDtoObj.teamId = null;
      this.categoryMappingData.push(UserTeamCategoryMappingDtoObj);
    });
  }

  /* Method to update the user team category mapping dto selection list
  based on rule creation or rule maintenance flag */

  updateUserTeamCategoryMapping(selectedUserTeamCategoryDto: UserTeamCategoryMapDto) {
    if (this.rolePO || this.roleCCA) {
      if (selectedUserTeamCategoryDto.selectedCCA || selectedUserTeamCategoryDto.selectedPO) {
        if (!this.creationOrMaintenance) {
          this.addRMUserTeamCategoryMapping(selectedUserTeamCategoryDto);
        } else {
          this.addRCUserTeamCategoryMapping(selectedUserTeamCategoryDto);
        }
      } else {
        if (!this.creationOrMaintenance) {
          this.removeRMUserTeamCategoryMapping(selectedUserTeamCategoryDto);
        } else {
          this.removeRCUserTeamCategoryMapping(selectedUserTeamCategoryDto);
        }
      }
    }
  }

  /* Method to assign data from one user team category dto object to another dto object */

  returnUserTeamCategoryMapDtoObject(selectedUserTeamCategoryDto: UserTeamCategoryMapDto, newUserTeamCategoryMapDto: UserTeamCategoryMapDto) {
    newUserTeamCategoryMapDto.categoryId = selectedUserTeamCategoryDto.categoryId;
    newUserTeamCategoryMapDto.categoryName = selectedUserTeamCategoryDto.categoryName;
    newUserTeamCategoryMapDto.selectedCCA = selectedUserTeamCategoryDto.selectedCCA;
    newUserTeamCategoryMapDto.selectedPO = selectedUserTeamCategoryDto.selectedPO;
    newUserTeamCategoryMapDto.functionType = selectedUserTeamCategoryDto.functionType;
    newUserTeamCategoryMapDto.teamId = selectedUserTeamCategoryDto.teamId;
  }

  /* Method to add or update the rule maintenance category mapping dto list
  based on the category selection */

  addRMUserTeamCategoryMapping(selectedUserTeamCategoryDto: UserTeamCategoryMapDto) {
    if (selectedUserTeamCategoryDto.categoryMappingId) {
      this.selectedMaintenanceCategoryMapDtoList.forEach(userTeamCategoryMappingDto => {
        if (selectedUserTeamCategoryDto.categoryMappingId === userTeamCategoryMappingDto.categoryMappingId) {
          this.returnUserTeamCategoryMapDtoObject(selectedUserTeamCategoryDto, userTeamCategoryMappingDto);
        }
      });
    } else {
      this.selectedMaintenanceCategoryMapDtoList.forEach(userTeamCategoryMappingDto => {
        if (selectedUserTeamCategoryDto.categoryId === userTeamCategoryMappingDto.categoryId) {
          this.returnUserTeamCategoryMapDtoObject(selectedUserTeamCategoryDto, userTeamCategoryMappingDto);
        }
      });
    }
  }

  /* Method to remove the selected user team category dto object from the rule maintenance
  category mapping dto list based on the category selection */

  removeRMUserTeamCategoryMapping(selectedUserTeamCategoryDto: UserTeamCategoryMapDto) {
    if (selectedUserTeamCategoryDto.categoryMappingId) {
      this.selectedMaintenanceCategoryMapDtoList.forEach(userTeamCategoryMappingDto => {
        if (selectedUserTeamCategoryDto.categoryMappingId === userTeamCategoryMappingDto.categoryMappingId) {
          userTeamCategoryMappingDto.selectedCCA = selectedUserTeamCategoryDto.selectedCCA;
          userTeamCategoryMappingDto.selectedPO = selectedUserTeamCategoryDto.selectedPO;
        }
      });
    } else {
      this.selectedMaintenanceCategoryMapDtoList.forEach(userTeamCategoryMappingDto => {
        if (selectedUserTeamCategoryDto.categoryId === userTeamCategoryMappingDto.categoryId) {
          userTeamCategoryMappingDto.selectedCCA = selectedUserTeamCategoryDto.selectedCCA;
          userTeamCategoryMappingDto.selectedPO = selectedUserTeamCategoryDto.selectedPO;
        }
      });
    }
  }

  /* Method to add or update the rule creation category mapping dto list
 based on the category selection */

  addRCUserTeamCategoryMapping(selectedUserTeamCategoryDto: UserTeamCategoryMapDto) {
    if (this.teamSelected) {
      if (selectedUserTeamCategoryDto.categoryMappingId) {
        this.selectedCreationCategoryMapDtoList.forEach(userTeamCategoryMappingDto => {
          if (selectedUserTeamCategoryDto.categoryMappingId === userTeamCategoryMappingDto.categoryMappingId) {
            this.returnUserTeamCategoryMapDtoObject(selectedUserTeamCategoryDto, userTeamCategoryMappingDto);
            userTeamCategoryMappingDto.functionType = 'RC';
          }
        });
      } else {
        let newUserTeamCategoryMapDto: UserTeamCategoryMapDto;
        newUserTeamCategoryMapDto = new UserTeamCategoryMapDto();
        this.returnUserTeamCategoryMapDtoObject(selectedUserTeamCategoryDto, newUserTeamCategoryMapDto);
        newUserTeamCategoryMapDto.teamId = this.teamSelected;
        newUserTeamCategoryMapDto.functionType = 'RC';
        let userTeamCategoryMapArray = [];
        userTeamCategoryMapArray = this.selectedCreationCategoryMapDtoList.filter(userTeamCategoryDto =>
          (userTeamCategoryDto.teamId === newUserTeamCategoryMapDto.teamId) && (userTeamCategoryDto.categoryId === newUserTeamCategoryMapDto.categoryId));
        if (userTeamCategoryMapArray.length > 0) {
          this.selectedCreationCategoryMapDtoList.forEach(userTeamCategoryDto => {
            if ((userTeamCategoryDto.teamId === newUserTeamCategoryMapDto.teamId) && (userTeamCategoryDto.categoryId === newUserTeamCategoryMapDto.categoryId)) {
              this.returnUserTeamCategoryMapDtoObject(selectedUserTeamCategoryDto, userTeamCategoryDto);
              userTeamCategoryDto.teamId = this.teamSelected;
              userTeamCategoryDto.functionType = 'RC';
            }
          });
        } else {
          this.selectedCreationCategoryMapDtoList.push(newUserTeamCategoryMapDto);
        }
      }
    } else {
      selectedUserTeamCategoryDto.selectedCCA = false;
      selectedUserTeamCategoryDto.selectedPO = false;
    }
  }

  /* Method to remove the selected user team category dto object from the rule creation
  category mapping dto list based on the category selection */

  removeRCUserTeamCategoryMapping(selectedUserTeamCategoryDto: UserTeamCategoryMapDto) {
    if (selectedUserTeamCategoryDto.categoryMappingId) {
      this.selectedCreationCategoryMapDtoList.forEach(userTeamCategoryMappingDto => {
        if (userTeamCategoryMappingDto.categoryMappingId === selectedUserTeamCategoryDto.categoryMappingId) {
          userTeamCategoryMappingDto.selectedCCA = selectedUserTeamCategoryDto.selectedCCA;
          userTeamCategoryMappingDto.selectedPO = selectedUserTeamCategoryDto.selectedPO;
        }
      }
      );
    } else {
      this.selectedCreationCategoryMapDtoList = this.selectedCreationCategoryMapDtoList.filter(userTeamCategoryMappingDto =>
        (userTeamCategoryMappingDto.categoryId !== selectedUserTeamCategoryDto.categoryId) && (userTeamCategoryMappingDto.teamId !== selectedUserTeamCategoryDto.teamId));
    }
  }

  customSort(event: SortEvent) {
    
    let result = null;
    
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let selectedPO1 = data1.rolePO;
      let selectedPO2 = data2.rolePO;
     
      if((event.field === FIELD_CATEGORY || event.field === FIELD_SELECTED_CCA) && (selectedPO1 === false || selectedPO2 === false)){
         return 0;
      }    

      else if (value1 == null && value2 != null)
          result = -1;
      else if (value1 != null && value2 == null)
          result = 1;
      else if (value1 == null && value2 == null)
          result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
          result = value1.localeCompare(value2);
      else
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;          
      return (event.order * result);
      
  });  
}



}
