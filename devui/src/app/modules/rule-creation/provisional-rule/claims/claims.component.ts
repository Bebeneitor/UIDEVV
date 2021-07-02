import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { claimService } from 'src/app/services/claim-service';
import { ProvisionalRuleService } from 'src/app/services/provisional-rule.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Constants } from 'src/app/shared/models/constants';
import { RuleRevenueCodeDto } from 'src/app/shared/models/dto/rule-revenue-code-dto';
import { RuleInfo } from 'src/app/shared/models/rule-info';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  currRuleInfo;
  parentRuleInfo: RuleInfo;
  selectedClaimTypesToolTip: string;
  parentClaimTypesToolTip: string;
  @Input() set ruleInfo(rule: RuleInfo) {
    if (rule && rule.ruleId) {
      this.currRuleInfo = rule;
      this.loadClaimsTabData(rule);

      if (this.currRuleInfo.claimsType) {
        this.claimTypesSelection = this.currRuleInfo.claimsType.map(claim => claim.claimType.lookupId);
      }
    }
  };
  @Input() set ruleInfoOriginal(value: RuleInfo) {
    if (value) {
      this.parentRuleInfo = value;
    }
  }
  @Input() provDialogDisable: boolean;
  @Input() ruleRevenueCodesList: RuleRevenueCodeDto[];
  @Input() fromMaintenanceProcess: boolean;
  claimTypes: any[] = [];
  claimTypesRc: any[] = [];

  @Input() set pdgClaimTypeSelected(pdgClaims:any){
    if (pdgClaims) {
      this.claimTypesSelection = pdgClaims;
      this.setToolTipValueOnChange();
    }
  }

  includedClaimServices: any[] = [];
  excludedClaimServices: any[] = [];
  includedBillClaims: any[] = [];
  excludedBillClaims: any[] = [];

  originalIncludedClaimServices: any[] = [];
  originalExcludedClaimServices: any[] = [];
  originalIncludedBillClaims: any[] = [];
  originalExcludedBillClaims: any[] = [];

  /* Professional Claim */
  selectedClaim: any; //to check the existing claim type and update on change
  claimServices: any[] = [];
  originalClaimservices: any[] = [];
  selectedClaimService: any[];
  selectedIncClaim: any[] = [];
  selectedExcClaim: any[] = [];

  claimType: any; // claimtype radio selection

  /* Bill Type Claim */
  billClaimLists: any[] = [];
  selectedBillClaims: any[];
  selectedBillIncClaims: any[] = [];
  selectedBillExcClaims: any[] = [];

  /* boolean values to show and hide the div */
  professional: boolean = false;
  facility: boolean = false;
  revenueCodes: boolean = false;

  selectedClaimType: any;

  professionalClaims: boolean;
  billTypes: boolean;
  label: string;
  status: string;
  value: string;
  CLAIM_BILL_TYPES: string;
  CLAIM_TYPE: string;
  originalTypesStyle = { 'width': '100%', 'overflow': 'auto', 'height': '110px', 'border': '1px solid #31006F' };

  display: boolean;
  message: string;
  isClaimTypesChanged: boolean = false;
  isExtraClick: boolean = false;

  claimTypesSelection: any;
  claimTypesSelectionRc: any;

  constructor(private utilService: UtilsService, private provisionalRuleService: ProvisionalRuleService, private claimService: claimService) {
    this.selectedClaim = null;
    this.selectedClaimService = null;
    this.selectedIncClaim = null;
    this.selectedExcClaim = null;
    this.selectedBillClaims = null;
    this.selectedBillIncClaims = null;
    this.selectedBillExcClaims = null;
    this.CLAIM_TYPE = 'CLAIM_TYPE';
    this.CLAIM_BILL_TYPES = 'CLAIM_BILL_TYPES';
    this.selectedClaimType = Constants.CLAIM_FACILITY_TYPE;
  }

  ngOnInit() {

    this.claimService.getClaimTypes().subscribe(claimTypes => {
      this.claimTypes = claimTypes;
      setTimeout(() => {
        this.setToolTipValueOnChange();
      }, 2000);
    });
    this.claimService.getClaimTypes().subscribe(claimTypesRc => this.claimTypesRc = claimTypesRc);

    this.getAllBillTypeClaims(this.CLAIM_BILL_TYPES);
    if (this.currRuleInfo && !this.currRuleInfo.claimTypId) {
      this.billTypes = false;
      this.professionalClaims = false;
      this.currRuleInfo.claimTypId = 26;
      this.selectedClaim = this.currRuleInfo.claimTypId;
    }
    this.selectedClaimType = Constants.CLAIM_FACILITY_TYPE;

    this.message = 'Place of Service and Bill Types selections will be lost if Claim Types is changed.';
    this.onClaimTypeChange(this.selectedClaimType);
  }

  /**
  * loadClaimsTabData - Load entire claims tab data.
  * @param rule - RuleInfo Object o load the Claims Data with
  */
  loadClaimsTabData(rule: RuleInfo) {
    if (rule && rule.ruleId) {
      // Professional and Facility
      this.getAllExistingPlacesOfService(rule.ruleId).then(() => {
        this.removeExistingPlacesOfServiceFromParent();
      });
      // Setting claim Type Changes
      this.onClaimTypeChange(this.selectedClaimType);
    }
    if (this.fromMaintenanceProcess) {
      this.getParentSelectedClaimTypes(rule.parentRuleId);
      this.getAllExistingPlacesOfService(rule.parentRuleId, true);
    }
  }

  getParentSelectedClaimTypes(parentRuleId: number) {
    this.claimService.getParentSelectedClaimTypes(parentRuleId).subscribe(response => {
      if (response.data !== null && response.data !== undefined) {
        let selectedOriginalClaimTypes: any[] = response.data;
        this.claimTypesSelectionRc = selectedOriginalClaimTypes.map(claim => claim.claimType.lookupId);
        setTimeout(() => {
          if(this.claimTypesSelectionRc) {
              this.parentClaimTypesToolTip = this.claimTypes.filter(claim => this.claimTypesSelectionRc.includes(claim.value)).map(claim => claim.label).join(', ');
          }
        }, 2000);  
      }
    });
  }

  /**
   * onClaimTypeChange - show include and exclude list based on claim type change.
   * @param claimSelected claim type that been selected.
   */
  onClaimTypeChange(claimSelected: string) {
    if (claimSelected) {
        this.facility = true;
    }
  }



  /* Function to remove the existing place of service from the parent place of service list */
  removeExistingPlacesOfServiceFromParent() {
    let arr = [];

    for (let i = 0; i < this.claimServices.length; i++) {
      //If exists in excluded or included array discard the item
      let exists = false;

      for (let j = 0; j < this.includedClaimServices.length; j++) {
        if (this.claimServices[i].label == this.includedClaimServices[j].label) {
          exists = true;
        }
      }

      for (let j = 0; j < this.excludedClaimServices.length; j++) {
        if (this.claimServices[i].label == this.excludedClaimServices[j].label) {
          exists = true;
        }
      }

      if (!exists) {
        arr.push(this.claimServices[i]);
      }
    }
    this.claimServices = JSON.parse(JSON.stringify(arr));
  }

  /* Function to move to includes plave of service or bill types list from the selected place of service or bill types parent list */
  moveToIncludeR(value) {
    if (value.target.id === 'P') {
      for (const claim of this.claimServices) {
        for (const selectedCl of this.selectedClaimService) {
          if (selectedCl === claim.value) {
            this.includedClaimServices.push(claim);
            break;
          }
        }
      }
      for (const inclClaim of this.includedClaimServices) {
        const index: number = this.claimServices.indexOf(inclClaim, 0);
        if (index > -1) {
          this.claimServices.splice(index, 1);
        }
      }
    } else {
      /*Move to Include Right side for Bill Type*/
      for (const bill of this.billClaimLists) {
        for (const selectedBill of this.selectedBillClaims) {
          if (selectedBill === bill.value) {
            this.includedBillClaims.push(bill);
            break;
          }
        }
      }
      for (const inclBill of this.includedBillClaims) {
        const index: number = this.billClaimLists.indexOf(inclBill, 0);
        if (index > -1) {
          this.billClaimLists.splice(index, 1);
        }
      }
    }
  }

  /* Function to move to parent place of service or bill types list from the includes place of service or bill types list*/
  moveToIncludeL(value) {
    if (value.target.id === 'P') {
      for (let includeClaim of this.includedClaimServices) {
        for (let selectedClm of this.selectedIncClaim) {
          if (selectedClm === includeClaim.value) {
            this.claimServices.push(includeClaim);
            break;
          }
        }
      }
      for (const claimServ of this.claimServices) {
        const index: number = this.includedClaimServices.indexOf(claimServ, 0);
        if (index > -1) {
          this.includedClaimServices.splice(index, 1);
        }
      }
    } else {
      /*Move to Include Left side for Bill Type*/
      for (let includeBill of this.includedBillClaims) {
        for (let selectedBill of this.selectedBillIncClaims) {
          if (selectedBill === includeBill.value) {
            this.billClaimLists.push(includeBill);
            break;
          }
        }
      }
      for (const bill of this.billClaimLists) {
        const index: number = this.includedBillClaims.indexOf(bill, 0);
        if (index > -1) {
          this.includedBillClaims.splice(index, 1);
        }
      }
    }
  }

  /* Function to move to exclude place of service or bill types list from the selected place of service or bill types  parent list */
  moveToExcludeR(value) {
    if (value.target.id === 'P') {
      for (const claim of this.claimServices) {
        for (const selectedClaimS of this.selectedClaimService) {
          if (selectedClaimS === claim.value) {
            this.excludedClaimServices.push(claim);
            break;
          }
        }
      }
      for (const claim of this.excludedClaimServices) {
        const index: number = this.claimServices.indexOf(claim, 0);
        if (index > -1) {
          this.claimServices.splice(index, 1);
        }
      }
    } else {
      /*Move to Exclude Right side for Bill Type*/
      for (const bill of this.billClaimLists) {
        for (const selectedBillC of this.selectedBillClaims) {
          if (selectedBillC === bill.value) {
            this.excludedBillClaims.push(bill);
            break;
          }
        }
      }
      for (const claim of this.excludedBillClaims) {
        const index: number = this.billClaimLists.indexOf(claim, 0);
        if (index > -1) {
          this.billClaimLists.splice(index, 1);
        }
      }
    }
  }

  /* Function to move to parent  place of service or bill types list from the selected place of service or bill types excludes list */
  moveToExcludeL(value) {
    if (value.target.id === 'P') {
      for (let excludeClaim of this.excludedClaimServices) {
        for (let selectedExClaim of this.selectedExcClaim) {
          if (selectedExClaim === excludeClaim.value) {
            this.claimServices.push(excludeClaim);
            break;
          }
        }
      }
      for (const claim of this.claimServices) {
        const index: number = this.excludedClaimServices.indexOf(claim, 0);
        if (index > -1) {
          this.excludedClaimServices.splice(index, 1);
        }
      }
    } else {
      /*Move to Exclude Left side for Bill Type*/
      for (let excludeBill of this.excludedBillClaims) {
        for (let seleclExBill of this.selectedBillExcClaims) {
          if (seleclExBill === excludeBill.value) {
            this.billClaimLists.push(excludeBill);
            break;
          }
        }
      }
      for (const claim of this.billClaimLists) {
        const index: number = this.excludedBillClaims.indexOf(claim, 0);
        if (index > -1) {
          this.excludedBillClaims.splice(index, 1);
        }
      }

    }
  }

  /**
   * getAllBillTypeClaims - Fetch all bill types on load
   * @param billType string to pull correct lookups for billTypes
   */
  getAllBillTypeClaims(billType: string) {
    this.utilService.getAllLookUps(billType).subscribe(response => {
      this.billClaimLists = response.map(billtypeclaim => {
        return {
          "label": billtypeclaim.lookupDesc,
          "value": billtypeclaim.lookupId
        };
      });
    });
  }

  /* Function to fetch all the existing place of service by ruleId on load*/
  getAllExistingPlacesOfService(ruleId, loadOriginal?) {
    this.resetIncludeExcludValues(loadOriginal);
    return new Promise((resolve, reject) => {
      this.provisionalRuleService.findClaimPlacesOfServiceById(ruleId).subscribe(resp => {
        if (resp && resp.data) {
          resp.data.forEach(element => {
            this.assignIncludeExclude(element, loadOriginal);
          });
        }
        resolve();
      });
    });
  }

  /* Callback Function to assign the existing include and exclude values to the respective lists*/
  assignIncludeExclude(element, loadOriginal?: boolean) {
    if (element != null) {
      if (element.claimSubtypeIdVal === 27) {
        if (loadOriginal) {
          if (element.inclusionStatus === 0) {
            this.originalExcludedClaimServices.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
          } else {
            this.originalIncludedClaimServices.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
          }
        } else {
          if (element.inclusionStatus === 0) {
            this.excludedClaimServices.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
          } else {
            this.includedClaimServices.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
          }
        }
      } else if (element.claimSubtypeIdVal === 28) {
        if (loadOriginal) {
          if (element.inclusionStatus === 0) {
            this.originalExcludedBillClaims.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
          } else {
            this.originalIncludedBillClaims.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
          }
        } else {
          if (element.inclusionStatus === 0) {
            this.excludedBillClaims.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
          } else {
            this.includedBillClaims.push({ "label": element.claimsServiceDesc, "value": element.claimsServiceId });
          }
        }
      }
    }
  }
  resetIncludeExcludValues(loadOriginal?: boolean) {
    if (loadOriginal) {
      this.originalExcludedClaimServices = [];
      this.originalIncludedClaimServices = [];
      this.originalExcludedBillClaims = [];
      this.originalIncludedBillClaims = [];
    } else {
      this.excludedClaimServices = [];
      this.includedClaimServices = [];
      this.excludedBillClaims = [];
      this.includedBillClaims = [];
    }
  }

  setToolTipValueOnChange() {
    if (this.claimTypesSelection) {
      this.selectedClaimTypesToolTip = this.claimTypes.filter(claim => this.claimTypesSelection.includes(claim.value)).map(claim => claim.label).join(', ');
    }
  }
}
