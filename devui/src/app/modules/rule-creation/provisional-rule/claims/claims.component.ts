import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { ProvisionalRuleService } from 'src/app/services/provisional-rule.service';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { RuleRevenueCodeDto } from 'src/app/shared/models/dto/rule-revenue-code-dto';
import { claimService } from 'src/app/services/claim-service';
import { Constants } from 'src/app/shared/models/constants';
import { SelectItem } from 'primeng/api';


@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  currRuleInfo: RuleInfo;
  parentRuleInfo: RuleInfo;
  @Input() set ruleInfo(rule: RuleInfo) {
    if (rule && rule.ruleId) {
      this.currRuleInfo = rule;
      this.loadClaimsTabData(rule);
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

  /*  Revenue Codes */
  revenueCodesList: any[] = [];
  selectedRevenueCodesList: any[];
  selectedRevenueCodeIncList: any[] = [];
  selecetdRevenueCodeExcList: any[] = [];
  revenueIncludeList: any[] = [];
  revenueExcludeList: any[] = [];
  originalRevenueIncludeList: any[] = [];
  originalRevenueExcludeList: any[] = [];

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
  CLAIM_PLACE_OF_SERVICE: string;
  CLAIM_BILL_TYPES: string;
  CLAIM_TYPE: string;
  originalTypesStyle = { 'width': '100%', 'overflow': 'auto', 'height': '110px', 'border': '1px solid #31006F' };

  display: boolean;
  message: string;
  isClaimTypesChanged: boolean = false;
  isExtraClick: boolean = false;

  constructor(private utilService: UtilsService, private provisionalRuleService: ProvisionalRuleService, private claimService: claimService) {
    this.selectedClaim = null;
    this.selectedClaimService = null;
    this.selectedIncClaim = null;
    this.selectedExcClaim = null;
    this.selectedBillClaims = null;
    this.selectedBillIncClaims = null;
    this.selectedBillExcClaims = null;
    this.CLAIM_PLACE_OF_SERVICE = 'CLAIM_PLACE_OF_SERVICE';
    this.CLAIM_TYPE = 'CLAIM_TYPE';
    this.CLAIM_BILL_TYPES = 'CLAIM_BILL_TYPES';
    this.selectedClaimType = Constants.CLAIM_PROFESSIONAL_VALUE;
  }

  ngOnInit() {
    this.getAllBillTypeClaims(this.CLAIM_BILL_TYPES);
    this.getAllProfessionalClaims(this.CLAIM_PLACE_OF_SERVICE);
    this.getAllRevenueCodes();
    if (this.currRuleInfo && !this.currRuleInfo.claimTypId) {
      this.billTypes = false;
      this.professionalClaims = false;
      this.currRuleInfo.claimTypId = 26;
      this.selectedClaim = this.currRuleInfo.claimTypId;
    }
    this.selectedClaimType = Constants.CLAIM_PROFESSIONAL_VALUE;

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
      // Revenue
      this.claimService.getAllRuleRevenueCodes(rule.ruleId).subscribe(resp => {
        if (resp && resp.data) {
          this.getAllRuleRevenueCodes(resp.data);
        }
      });
      // Setting claim Type Changes
      this.onClaimTypeChange(this.selectedClaimType);
    }
    if (this.fromMaintenanceProcess) {
      this.getAllExistingPlacesOfService(rule.parentRuleId, true);
      this.claimService.getAllRuleRevenueCodes(rule.parentRuleId).subscribe(resp => {
        if (resp && resp.data) {
          this.getAllRuleRevenueCodes(resp.data, true);
        }
      });
    }
  }

  /**
   * onClaimTypeChange - show include and exclude list based on claim type change.
   * @param claimSelected claim type that been selected.
   */
  onClaimTypeChange(claimSelected: string) {
    if (claimSelected) {
      if (claimSelected === Constants.CLAIM_FACILITY_TYPE) {
        this.setClaim(false, true, false);
      } else if (claimSelected === Constants.CLAIM_REVENUE_CODES_TYPE) {
        this.setClaim(false, false, true);
      } else {
        this.setClaim(true, false, false);
      }
    }
  }

  /**
   * Setting the booleans of each claim type
   * @param professional Professional Claim Type
   * @param facility  Facility Claim Type
   * @param revenueCodes Revenue Codes
   */
  setClaim(professional, facility, revenueCodes) {
    this.professional = professional;
    this.facility = facility;
    this.revenueCodes = revenueCodes;
  }

  /* This method will fetch and generate the list of available Revenue Codes*/
  getAllRevenueCodes() {
    return new Promise((resolve, reject) => {
      this.utilService.getAllRevenueCodes().subscribe(response => {
        if (response && response.data) {
          this.revenueCodesList = response.data.map(rCode => {
            return this.getRevenueCodesListObj(rCode);
          })
          resolve();
        }
      });
    });
  }

  /**
   * getAllRuleRevenueCodes - populate the existing rule revenue codes include and exclude list
   * @param ruleRevenueCodesList List of of rule Revenue Codes List
   */
  getAllRuleRevenueCodes(ruleRevenueCodesList, loadOriginal?: boolean) {
    if (loadOriginal) {
      this.originalRevenueIncludeList = [];
      this.originalRevenueExcludeList = [];
      ruleRevenueCodesList.forEach(ruleRevenueCode => {
        let revenueCode = this.generateRevenueCodeDtoObj(ruleRevenueCode);
        this.generateRevenueCodesList(revenueCode, ruleRevenueCode.codeInclusionStatus, loadOriginal);
      });
    } else {
      this.revenueIncludeList = [];
      this.revenueExcludeList = [];
      this.ruleRevenueCodesList = ruleRevenueCodesList;
      this.ruleRevenueCodesList.forEach(ruleRevenueCode => {
        let revenueCode = this.generateRevenueCodeDtoObj(ruleRevenueCode);
        this.generateRevenueCodesList(revenueCode, ruleRevenueCode.codeInclusionStatus);
        this.revenueCodesList = this.revenueCodesList.filter(revCode => ruleRevenueCode.revenueCode !== revCode.value.revenueCode);
      });
    }
  }


  /**
   * getRevenueCodesListOBj - Mapping SelectItem Object to display Revenue Codes
   * @param revenueCode Revenue Code Object to be mapped.
   */
  getRevenueCodesListObj(revenueCode) {
    let revenueCodeListObj: SelectItem = {
      "label": `${revenueCode.revenueCode}-${revenueCode.revenueCodeDesc}`,
      "value": revenueCode
    }
    return revenueCodeListObj;
  }

  /**
  * revenueCodesAdd - selected revenue codes will be added to inclusion/exclusion list
  * @param revCodelistType flag to set if (true/include) or (false/exclude)
  */
  revenueCodesAdd(revCodelistType: boolean) {
    if (this.selectedRevenueCodesList.length > 0) {
      this.selectedRevenueCodesList.forEach(selectedCode => {
        this.generateRevenueCodesList(selectedCode, revCodelistType);
        this.ruleRevenueCodesList.push(this.generateRuleRevenueCodeDtoObj(selectedCode, revCodelistType));
        this.revenueCodesList = this.revenueCodesList.filter(revenueCode =>
          revenueCode.value.revenueCode !== selectedCode.revenueCode
        );
      });
      this.selectedRevenueCodesList = [];
    }
  }

  /**
   * revenueCodesRemove - Remove revenue codes from inclusion/exclusion list
   * @param revCodelistType removed based on boolean (true/include) or (false/exclude)
   */
  revenueCodesRemove(revCodelistType: boolean) {
    if (revCodelistType) {
      if (this.selectedRevenueCodeIncList.length > 0) {
        this.selectedRevenueCodeIncList.forEach(selectedRevenueCodeDtoObj => {
          this.revenueCodesList.push(this.getRevenueCodesListObj(selectedRevenueCodeDtoObj));
          this.revenueIncludeList = this.revenueIncludeList.filter(revenueCodeDtoObj =>
            revenueCodeDtoObj.value.revenueCode !== selectedRevenueCodeDtoObj.revenueCode
          );
          this.ruleRevenueCodesList = this.ruleRevenueCodesList.filter(ruleRevenueObj =>
            ruleRevenueObj.revenueCode !== selectedRevenueCodeDtoObj.revenueCode
          );
        });
        this.selectedRevenueCodeIncList = [];
      }
    } else {
      if (this.selecetdRevenueCodeExcList.length > 0) {
        this.selecetdRevenueCodeExcList.forEach(selectedRevenueCodeDtoObj => {
          this.revenueCodesList.push(this.getRevenueCodesListObj(selectedRevenueCodeDtoObj));
          this.revenueExcludeList = this.revenueExcludeList.filter(revenueCodeDtoObj =>
            revenueCodeDtoObj.value.revenueCode !== selectedRevenueCodeDtoObj.revenueCode
          );
          this.ruleRevenueCodesList = this.ruleRevenueCodesList.filter(ruleRevenueObj =>
            ruleRevenueObj.revenueCode !== selectedRevenueCodeDtoObj.revenueCode
          );
        });
        this.selecetdRevenueCodeExcList = [];
      }
    }

  }

  /**
   * generateRuleRevenueCodeDtoObj - Callback method to return RuleRevenueCodeDto Object
   * @param selectedCode revenue code that has been selected by user
   * @param revCodelistType flag to set if (true/include) or (false/exclude)
   */
  generateRuleRevenueCodeDtoObj(selectedCode, revCodelistType: boolean) {
    let ruleRevenueCode = new RuleRevenueCodeDto();
    ruleRevenueCode.revenueCode = selectedCode.revenueCode;
    ruleRevenueCode.revenueCodeDesc = selectedCode.revenueCodeDesc;
    ruleRevenueCode.codeInclusionStatus = revCodelistType;
    return ruleRevenueCode;
  }

  /**
   * generateRevenueCodeDtoObj - mapping to revenueCodeDtoObj Object
   * @param ruleRevenueCode ruleRevenueCode Object to map
   */
  generateRevenueCodeDtoObj(ruleRevenueCode) {
    let revenueCode = {
      "revenueCode": ruleRevenueCode.revenueCode,
      "revenueCodeDesc": ruleRevenueCode.revenueCodeDesc
    }
    return revenueCode;
  }

  /**
   * generateRevenueCodesList - Setting inclusion/exclusion list for revenue codes
   * @param selectedCode RevenueCode that has been selected
   * @param revCodelistType flag to set if (true/include) or (false/exclude)
   */
  generateRevenueCodesList(selectedCode, revCodelistType: boolean, loadOriginal?: boolean) {
    if (loadOriginal) {
      if (revCodelistType) {
        this.originalRevenueIncludeList.push(this.getRevenueCodesListObj(selectedCode))
      } else {
        this.originalRevenueExcludeList.push(this.getRevenueCodesListObj(selectedCode));
      }
    } else {
      if (revCodelistType) {
        this.revenueIncludeList.push(this.getRevenueCodesListObj(selectedCode))
      } else {
        this.revenueExcludeList.push(this.getRevenueCodesListObj(selectedCode));
      }
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

  /* Function to fetch all the professional claim types on load */
  getAllProfessionalClaims(professionalType) {
    return new Promise((resolve, reject) => {
      this.utilService.getAllLookUps(professionalType).subscribe(response => {
        this.claimServices = response.map(claimservice => {
          return {
            "label": claimservice.lookupDesc,
            "value": claimservice.lookupId
          }
        });
      });
      resolve();
    });
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
      this.excludedClaimServices =[];
      this.includedClaimServices =[];
      this.excludedBillClaims =[];
      this.includedBillClaims =[];
    }
  }
}
