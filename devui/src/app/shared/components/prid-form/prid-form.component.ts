import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PridService } from './services/prid.service';
import { RuleEngineTemplateService } from 'src/app/services/rule-engine-template.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';

@Component({
  selector: 'ecl-prid-form',
  templateUrl: './prid-form.component.html',
  styleUrls: ['./prid-form.component.css']
})
export class PridFormComponent implements OnInit {

  createProjectForm: FormGroup;
  lotusNotesUrl;
  showPrid: boolean;
  isSubmitEnabled: boolean;
  isNotCreated: boolean;
  pridDetails: any;
  message: string;
  headerText = 'Confirmation';
  impactData: any;

  requiredFields = [
    { name: 'prid', isValid: false },
    { name: 'name', isValid: false },
    { name: 'summary', isValid: false },
    { name: 'description', isValid: false }
  ];

  //PRID Validations
  pridPattern="[A-Za-z0-9--]{0,200}";

  arrayMessage: any[];
  dialogService: any;

  constructor(private fb: FormBuilder,
              public pridService: PridService,
              private ruleEngineTemplateService: RuleEngineTemplateService,
              private sanitization: DomSanitizer,
              public config: DynamicDialogConfig,
              private toastService: ToastMessageService,
              public ref: DynamicDialogRef,
              private confirmationService: ConfirmationService
             ) { }

  ngOnInit() {
    this.impactData = this.config.data;
    this.showPrid = false;
    this.isSubmitEnabled = false;
    this.isNotCreated = true;

    // Create the prid project form.
    this.createProjectForm = this.fb.group({
      prid: new FormControl(null, [Validators.required, Validators.pattern('[A-Za-z0-9--]{0,200}')]),
      name: new FormControl(null, [Validators.required]),
      summary: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });

  }

  /**
   * Open the dialog window which creates anew PRID or validates it
   */
  public showPridCreationForm() {
    this.showPrid = true;
    this.createProjectForm.get('prid').clearValidators();
    this.createProjectForm.get('prid').updateValueAndValidity();
    setTimeout(() => {
      this.arrayMessage = [];
      this.arrayMessage = Object.assign([], [{ severity: 'info', summary: 'Info', detail: 'This will create a Stub Project Request in Lotus Notes, along to a PRID.  Please note that for using this PRID to create RMR, the Project request should be fully processed and Submitted in Lotus Notes.' }]); 
    }, 1000);

  }

  /**
   * Validates if a field is has valid information
   * @param field 
   */
  isValidField(field) {
    return field != null && field != undefined && field.value != "";
  }

  /**
   * Submit and validates the prid field.
   */
   submitProjectCreation() {
     this.createProjectForm.get('name').clearValidators();
     this.createProjectForm.get('name').updateValueAndValidity();
     this.createProjectForm.get('summary').clearValidators();
     this.createProjectForm.get('summary').updateValueAndValidity();
     this.createProjectForm.get('description').clearValidators();
     this.createProjectForm.get('description').updateValueAndValidity();

    if (this.createProjectForm.invalid) {
      return;
    }

    const detailRequestDto = {
      updateInstanceKey: this.impactData.updateInstanceKey, 
      currentImpactSeq: this.impactData.impactSeq, 
      prid: this.createProjectForm.get('prid').value 
    };

    this.pridService.submitProjectCreation(detailRequestDto).subscribe(response => {
      if (response && response.code === 200) {

        this.createProjectForm.get('name').setValidators([Validators.required]);
        this.createProjectForm.get('name').updateValueAndValidity();
        this.createProjectForm.get('summary').setValidators([Validators.required]);
        this.createProjectForm.get('summary').updateValueAndValidity();
        this.createProjectForm.get('description').setValidators([Validators.required]);
        this.createProjectForm.get('description').updateValueAndValidity();

        this.pridDetails = response.data;
        this.message = 'The ECL IDs update in ICMS process is started, after completion you will receive an email.';
        this.toastService.messageSuccess('Info', this.message);
        this.ref.close();
      } else {
        this.message = response.message;
      }
      
    }, error => {
      this.createProjectForm.reset();
      this.message = 'PRID is not valid, please provide a new one';
      this.ref.close();
      
    });

  }

   /**
   * Creates the prid and populates the prid field.
   */
   createPrid(){
    if (this.createProjectForm.invalid) {
      return;
    }

    const body = {
      createdBy: this.creationName.value,
      summary: this.creationSummary.value,
      description: this.creationDescription.value
    };

    this.ruleEngineTemplateService.submitProjectCreation(body).subscribe(response => {
      if (response && response.code === 200) {

        this.createProjectForm.get('prid').setValidators([Validators.required, Validators.pattern(this.pridPattern)]);
        this.createProjectForm.get('prid').updateValueAndValidity();
    
        this.getControl('prid').setValue(response.data.prid);
        this.pridDetails = response.data;

        this.checkIsValid(response.data.prid, 'prid');
        this.lotusNotesUrl = this.sanitization.bypassSecurityTrustUrl(response.data.url);
        this.showPrid = true;
        this.isNotCreated = false;
        this.message = 'PRID Creation successful';
      } else {
        this.message = response.message;
      }
      this.headerText = 'Information';
      this.isSubmitEnabled = true;
    }, error => {
      this.createProjectForm.reset();
    });

  }

  /**
   * Returns the Abstract control by name.
   * @param controlName that we want to get
   */
  getControl(controlName: string) {
    return this.createProjectForm.get(controlName);
  }

  /**
   * Checks if the changed value is valid or not.
   * @param event that fires the value
   * @param field that we want to evaluate.
   */
  checkIsValid(event, field) {
    let element = this.requiredFields.find(el => el.name === field);
    if (typeof event === 'string' || event instanceof String) {
      if (event && event.length > 0) {
        element.isValid = true;
      } else {
        element.isValid = false;
      }
    } else if (event && typeof event === 'object' && event.constructor === Object) {
      if (event) {
        element.isValid = true;
      } else {
        element.isValid = false;
      }
    } else {
      if (event.length > 0) {
        element.isValid = true;
      } else {
        element.isValid = false;
      }
    }
  }

  /**
   * Enables the Submit button if there a PRID value in the field
   */
  enableSubmit(){
    if(!this.showPrid)
      if(this.isValidField(this.createProjectForm.controls.prid)) 
        this.isSubmitEnabled = true;
      else
        this.isSubmitEnabled = false;
  }
  
  /**
   * Gets the user name
   */
  get creationName() { return this.createProjectForm.get('name'); }

  /**
   * Gets the summary value
   */
  get creationSummary() { return this.createProjectForm.get('summary'); }

  /**
   * Get the description value
   */
  get creationDescription() { return this.createProjectForm.get('description'); }

}
