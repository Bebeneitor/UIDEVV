import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { PolicyPackage } from 'src/app/shared/models/policy-package';
import { AppUtils } from 'src/app/shared/services/utils';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { ConfirmationService } from 'primeng/api';
import { PolicyPackageService } from 'src/app/services/policy-package.service';

const WARN_MESSAGE = 'Please enter a new policy package';
const MESSAGE_HEADER = 'Policy Package Exists!';
const SAVE_MESSAGE = 'New policy package added successfully';

@Component({
  selector: 'app-policy-package',
  templateUrl: './policy-package.component.html',
  styleUrls: ['./policy-package.component.css']
})
export class PolicyPackageComponent implements OnInit {

  @Input() fieldSaveButton: boolean;
  @Output() saveButtonChange = new EventEmitter();

  searchPolicyPackageName: string; 
  policyPackageList: string[] = [];
  policyPackageOptions: string[] = [];
  addNewPolicyPackage: boolean = false;
  selectedPolicyPackage: string;
  newPolicyPackageObj: PolicyPackage;
  userId: number;

  constructor(
    private utilsService: UtilsService , 
    private utils: AppUtils,
    private toastMessageService: ToastMessageService,
    private confirmationService: ConfirmationService,
    private policyPackageService: PolicyPackageService) { }

  ngOnInit() {
    this.getAllPolicyPackageSources();
    this.addNewPolicyPackage = false;
    this.userId = this.utils.getLoggedUserId();
  }

  /* Method to show and hide the input text box in the list to enter new reference source */
  showPolicyPackageInput() {
    if (this.addNewPolicyPackage) {
      this.addNewPolicyPackage = false;
    } else {
      this.addNewPolicyPackage = true;
    }
  }

  /* Method to create policyPackageDto Object and enable and disable the save button in parent component */
  checkPolicyPackage(){
    this.newPolicyPackageObj = new PolicyPackage();
    if (this.selectedPolicyPackage.trim()) {
      this.newPolicyPackageObj.policyPackageName = this.selectedPolicyPackage.trim();      
      this.fieldSaveButton = false;
      this.saveButtonChange.emit(this.fieldSaveButton);

    } else {
      this.fieldSaveButton = true;
      this.saveButtonChange.emit(this.fieldSaveButton);
    }    
  }  

  /* Method to search and filter the available policy package list and show the list based on the search criteria */
  searchPolicyPackageList() {

    if (this.searchPolicyPackageName.trim()) {
      this.policyPackageList = this.policyPackageOptions.filter(pp =>
        pp.toLowerCase().includes(this.searchPolicyPackageName.toLowerCase()));
    } else {
      this.policyPackageList = this.policyPackageOptions;
    }

  }

  /* Method to fetch all the available policy package*/
  getAllPolicyPackageSources() {
    this.utilsService.getAllPolicyPackage().subscribe(response => {
      this.policyPackageList = [];
      this.policyPackageOptions = [];
      response.data.forEach(policyPackage => {
        this.policyPackageList.push(policyPackage.policyPackageName);
        this.policyPackageOptions.push(policyPackage.policyPackageName);
      });
    });
  }

  /* Method to refresh the fields */
  refreshPolicyPackage(){
    this.selectedPolicyPackage = '';
    this.checkPolicyPackage();
  }

  /* Method to refresh and reset the entire page */
  refreshAddPolicyPackage() {    
    this.getAllPolicyPackageSources();
    this.addNewPolicyPackage = false;
    this.selectedPolicyPackage = '';
    this.checkPolicyPackage();
  }

  /* Method to show a pop up message to accept or decline to save new policy package*/
  savePolicyPackageValidation() {

    if(this.validateNewPolicyPackageSave()){

      this.confirmationService.confirm({

        message: 'Are you sure you would like to create a new policy package?',
        header: 'Save Confirmation',
        icon: 'pi pi-info-circle',

        accept: () => {
          this.fieldSaveButton = true;
          this.saveButtonChange.emit(this.fieldSaveButton);
          this.saveNewReferenceSource();
        },

        reject: () => {
          this.refreshPolicyPackage();
        }

      });

    } else{
      this.toastMessageService.messageWarning(MESSAGE_HEADER, WARN_MESSAGE);
      this.refreshPolicyPackage();
    }

  }

  /* Method to save the added new PolicyPackage source if the user accepts*/
  saveNewReferenceSource() {
    
    this.policyPackageService.saveNewPolicyPackage(this.newPolicyPackageObj).subscribe(response=>{
      if(response && response.code === 200){
        this.toastMessageService.messageSuccess(this.toastMessageService.SUCCESS, SAVE_MESSAGE);
        this.getAllPolicyPackageSources();
        this.addNewPolicyPackage=false;
        this.refreshPolicyPackage();
      }
      else{
        this.toastMessageService.messageWarning(response.message, WARN_MESSAGE);
        this.refreshPolicyPackage();
      }
    });


  }  

  /* Method to validate and return a boolean if the added policy package is new or not */
  validateNewPolicyPackageSave(){
    if(this.selectedPolicyPackage){

      for(var option of this.policyPackageOptions){
        if(option.trim().toLowerCase() === this.selectedPolicyPackage.trim().toLowerCase()){
          return false;
        }
      }      
      
      return true;
    }     
    return false;  
  }

}
