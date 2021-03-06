import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { IdeaService } from 'src/app/services/idea.service';
import { RuleEngineTemplateService } from 'src/app/services/rule-engine-template.service';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EclIcmsNotifiedRulesDto } from 'src/app/shared/models/dto/ecl-icms-notified-rules-dto';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { Constants } from '../../../../shared/models/constants';
import { AppUtils } from '../../../../shared/services/utils';
import { forkJoin } from 'rxjs';
import { RrUtils } from 'src/app/modules/research-requests/services/rr-utils.component';

@Component({
  selector: 'app-icms-template',
  templateUrl: './icms-template.component.html',
  styleUrls: ['./icms-template.component.css']
})
export class IcmsTemplateComponent implements OnInit {
  headerText = 'Confirmation';
  @ViewChild('pridControl',{static: true}) pridControl: ElementRef;
  createProjectForm: FormGroup;

  submmitedTemplate = false;

  notifiedRules: any;
  goToFirstPage = false;
  ruleInfo: RuleInfo;
  eclIcmsRules: any;
  eclIcmsNotifiedRules: EclIcmsNotifiedRulesDto;
  saveBtnDisable = false;
  submitBtnDisable = false;
  disableCvSource = false;
  isSubmit = false;
  Message: string;
  saveDisplay = false;
  clients: any[] = [];
  categories: any[] = [];
  response: boolean = false;
  cvSources: any[] = [];
  changeSources: any[] = [];
  reasonCodes: any[] = [];
  industrialUpdates: any[] = [];
  libraryStatus: any[] = [];
  motherBabyFlag: any[] = [];
  users: any[] = [];
  anlysts: any[] = [];
  medicalDirectors: any[] = [];
  claimTypLinks: any[] = [];
  lobs = [];
  OOSs: any[] = [];
  claimTypeLinks: any[] = [];
  cvCodes: any[] = [];
  medicalPolicies: any[] = [];
  refTitles: any[] = [];
  icmClaimType: any[] = [];
  icmoClaimType: any[] = [];
  duplicateChecking: any[] = [];
  policyTypes: any[] = [];
  loading: boolean = false;
  minDate: Date = new Date(1752, 1, 1);
  maxDate: Date = new Date(2050, 1, 1);
  implementationDt = new Date();
  dialogLeftPosition = 350;
  templateStatus: string;
  arrayMessage = [];

  icm = [];
  icmo = [];

  requiredFields = [
    { name: 'PRID', isValid: false },
    { name: 'Description', isValid: false },
    { name: 'Medical Policy', isValid: false },
    { name: 'Primary Reference', isValid: false },
    { name: 'Reason Codes', isValid: false },
    { name: 'CV Code (Edit Flag)', isValid: false },
    { name: 'Industry Update Required', isValid: false },
    { name: 'Client Required', isValid: false },
    { name: 'Claim Type', isValid: false },
    { name: 'Duplicate Checking', isValid: false }
  ];

  projectRequiredFields = [
    { name: 'Name', isValid: false },
    { name: 'Summary', isValid: false },
    { name: 'Description', isValid: false }
  ];

  projectCreationModal;
  lotusNotesUrl;

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  constructor(private ruleEngineTemplateService: RuleEngineTemplateService, private ideaService: IdeaService, private ruleInfoService: RuleInfoService,
    private util: AppUtils, public config: DynamicDialogConfig, private utilService: UtilsService, private eclConstant: ECLConstantsService,
    public ref: DynamicDialogRef, private fb: FormBuilder, private sanitization: DomSanitizer, private catalogUtils: RrUtils) {
    this.eclIcmsNotifiedRules = new EclIcmsNotifiedRulesDto();
    this.ruleInfo = new RuleInfo();
  }

  ngOnInit() {
    this.loadInternalCatalogs();
    this.readLookupValues();
    this.getAllLOBs();
    this.getIcmsCatalog()
    .then(() => this.loadDataToFields());

    // Create the prid project form.
    this.createProjectForm = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      summary: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });
  }


  private loadInternalCatalogs() {
    this.icmClaimType = [
      { name: 'ICM Facility-Type F', id: 'F' },
      { name: 'ICM ASC-Type A', id: 'A' },
      { name: 'Professional-Type P', id: 'P' }
    ];
    this.icmoClaimType = [
      { name: 'ICMO Facility-Type O', id: 'O' },
      { name: 'ICMO Inpatient-Type I', id: 'I' },
      { name: 'ICMP ASC-Type S', id: 'S' }
    ];
    this.duplicateChecking = [
      { name: 'Temp Rules Database', id: '1' },
      { name: 'Rules Maintenance', id: '2' },
      { name: 'CCI Table', id: '3' },
      { name: 'Max Units Tables (Frequency logic only)', id: '4' }
    ];
  }

  private async readLookupValues() {
    this.industrialUpdates = await this.getLookupValues(this.eclConstant.LOOKUP_TYPE_ICMS_INDUSTRY_UPDATE);
    this.getMotherBabyFlag(this.eclConstant.LOOKUP_TYPE_ICMS_MOTHER_BABY_FLAG);
    this.libraryStatus = await this.getLookupValues(this.eclConstant.LOOKUP_TYPE_ICMS_LIBRARY_STATUS)
    this.OOSs = await this.getLookupValues(this.eclConstant.LOOKUP_TYPE_ICMS_OOS)
    this.policyTypes = await this.getLookupValues(this.eclConstant.LOOKUP_TYPE_ICMS_POLICY_TYPES)
  }

  /**
   * Creates the project prid and populates the prid field.
   */
  submitProjectCreation() {
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
        this.eclIcmsNotifiedRules = { ...this.eclIcmsNotifiedRules, prid: response.data.prid, pridDetails: response.data };
        this.checkIsValid(response.data.prid, 'PRID');
        this.lotusNotesUrl = this.sanitization.bypassSecurityTrustUrl(response.data.url);
        this.projectCreationModal = false;
        this.Message = 'PRID Creation successful';
      } else {
        this.Message = response.message;
      }
      this.createProjectForm.reset();
      this.headerText = 'Information';
      this.saveDisplay = true;
    }, error => {
      this.createProjectForm.reset();
    });
  }

  loadDataToFields() {
    this.loading = true;
    this.ruleInfo = this.config.data.rule;
    let notes = this.config.data.notes;


    this.ruleEngineTemplateService.getICMSTemplate(this.ruleInfo.ruleId,
      Constants.RMR_TEMPLATE_IS_NOT_SUBMITTED, Constants.RMR_TEMP_TYPE).subscribe(response => {

        setTimeout(() => {
          if (response.data == null || response.data === undefined) {
            this.templateStatus = 'New';
            this.eclIcmsNotifiedRules = new EclIcmsNotifiedRulesDto();
            this.eclIcmsNotifiedRules.ruleId = this.ruleInfo.ruleId;
            this.eclIcmsNotifiedRules.description = this.ruleInfo.ruleDescription;

            // Mapping new elements into the template ecl-12033;
            // load notes
            this.eclIcmsNotifiedRules.notes = notes;
            const cvCode = this.cvCodes.find(code => code.value.name === this.config.data.cvCode);
            if (cvCode) {
              this.eclIcmsNotifiedRules.cvCode = cvCode.value;
            }

            // load claimTypes
            const ruleClaimTypes = this.ruleInfo.claimsType;
            if (ruleClaimTypes) {
              ruleClaimTypes.forEach(element => {
                this.icmClaimType.forEach(claimTy => {
                  if (element.claimType.lookupCode.trim() === claimTy.id) {
                    const ele = this.icmClaimType.find(icm => icm.id === claimTy.id);
                    this.icm.push(ele);
                  }
                });
    
                this.icmoClaimType.forEach(claimTy => {
                  if (element.claimType.lookupCode.trim() === claimTy.id) {
                    const ele = this.icmoClaimType.find(icmo => icmo.id === claimTy.id);
                    this.icmo.push(ele);
                  }
                })
              });
            }
            
            this.eclIcmsNotifiedRules.claimTypes = [...this.icm, ...this.icmo];
            this.eclIcmsNotifiedRules.claimTypesICM = [...this.icm];
            this.eclIcmsNotifiedRules.claimTypesICMO = [...this.icmo];

            if (this.ruleInfo.clientRationale !== undefined && this.ruleInfo.clientRationale !== null) {
              this.eclIcmsNotifiedRules.rationale = this.ruleInfo.clientRationale;
            }

            this.eclIcmsNotifiedRules.eclnumber = this.ruleInfo.ruleCode;
            this.eclIcmsNotifiedRules.status = 'Draft';
            this.eclIcmsNotifiedRules.createdBy = this.util.getLoggedUserId();

            //start: autopopulate when data is empty
            // destructuring version
            let { ruleLogicOriginal, eclReferences, scriptRationale, otherExceptions, clientRationale, ruleCode } = this.ruleInfo;
            let { prm } = this.config.data;
            const medicalPolicy = this.ruleInfo.category.categoryDesc;
            if (prm !== undefined && prm !== null) {
              this.eclIcmsNotifiedRules.prid = prm;
            }
            // Load primary and secondary reference based on rule details page
            if (eclReferences && eclReferences.length > 0) {
              const firstRefence = this.refTitles.find(element => {
                return element.label.toString().toUpperCase() === eclReferences[0].refInfo.referenceName.toUpperCase();
              })

              let secondRefence = null;
              if (eclReferences.length > 1) {
                secondRefence = this.refTitles.find(element => {
                  return element.label.toString().toUpperCase() === eclReferences[1].refInfo.referenceName.toUpperCase();;
                })
              }
              if (firstRefence && secondRefence) {
                this.eclIcmsNotifiedRules.primaryRefTitle = firstRefence.value;
                this.eclIcmsNotifiedRules.secondaryRefTitle = secondRefence.value;
              } else if (firstRefence && !secondRefence) {
                this.eclIcmsNotifiedRules.primaryRefTitle = firstRefence.value;
              }
            }

            if (ruleCode !== undefined && ruleCode !== null) {
              this.eclIcmsNotifiedRules.tempRuleNumber = ruleCode;
            }
            this.eclIcmsNotifiedRules.analyst = this.util.getLoggedUserId();
            this.eclIcmsNotifiedRules.writtenBy = this.util.getLoggedUserId();
            if (ruleLogicOriginal !== undefined && ruleLogicOriginal !== null) {
              this.eclIcmsNotifiedRules.description = ruleLogicOriginal;
            }

            // If we have lobs in config object we add them to template.
            this.eclIcmsNotifiedRules.lob = [];
            if (this.config.data.lobs) {
              this.config.data.lobs.forEach(inConfigLob => {
                this.lobs.forEach(lobInCatalog => {
                  if (lobInCatalog.value.id === inConfigLob) {
                    this.eclIcmsNotifiedRules.lob.push(lobInCatalog.value);
                  }
                });
              });
            }

            this.eclIcmsNotifiedRules.subRuleDosTo = new Date(9999, 11, 31);
            this.eclIcmsNotifiedRules.subRuleDosFrom = Constants.SUB_RULE_DOS_FROM_DATE;

            if (ruleLogicOriginal !== undefined && ruleLogicOriginal !== null) {
              this.eclIcmsNotifiedRules.midRuleDesc = ruleLogicOriginal;
            }

            this.eclIcmsNotifiedRules.libraryStatus = this.libraryStatus[0].value;            

            if (scriptRationale !== undefined && scriptRationale !== null) {
              this.eclIcmsNotifiedRules.script = scriptRationale;
            }
            if (clientRationale !== undefined && clientRationale !== null) {
              this.eclIcmsNotifiedRules.rationale = clientRationale;
            }
            
            const medicalPolicySelected = this.medicalPolicies.find(element => element.value.name === medicalPolicy);
            if (medicalPolicySelected) {
              this.eclIcmsNotifiedRules.medicalPolicy = medicalPolicySelected.value;
            }
            //end: autopopulate when data is empty
            this.eclIcmsNotifiedRules.motherBabyFlag = 0;

            if(this.ruleInfo && this.ruleInfo.pdgTemplateDto && this.ruleInfo.pdgTemplateDto.pdgId){
              this.setPdgFields();
            }
          } else {
            this.eclIcmsNotifiedRules = response.data.icmsTemplateDetails;

            if (response.data.submitted === true) {
              this.eclIcmsNotifiedRules.reasonCodes = response.data.icmsTemplateDetails.reasonCodes[0];
            }
            this.submmitedTemplate = response.data.submitted;

            // Load lobs.
            const responseLobs = [...response.data.icmsTemplateDetails.lob];
            if (responseLobs && responseLobs.length > 0) {
              this.eclIcmsNotifiedRules.lob = [];
              this.lobs.forEach(element => {
                responseLobs.forEach(responseElement => {
                  if (element.value.name === responseElement.name) {
                    this.eclIcmsNotifiedRules.lob.push(element.value);
                  }
                });
              });
            }

            // Load primary reference
            const responsePrimaryRef = { ...response.data.icmsTemplateDetails.primaryRefTitle };
            if (responsePrimaryRef) {
              this.refTitles.forEach(element => {
                if (element.value.name === responsePrimaryRef.name) {
                  this.eclIcmsNotifiedRules.primaryRefTitle = element.value;
                }
              });
            }

            // Load secondary reference
            const repsonseSecondaryRef = { ...response.data.icmsTemplateDetails.secondaryRefTitle };
            if (repsonseSecondaryRef) {
              this.refTitles.forEach(element => {
                if (element.value.name === repsonseSecondaryRef.name) {
                  this.eclIcmsNotifiedRules.secondaryRefTitle = element.value;
                }
              });
            }

            // Load peer reviewer 
            const peerReviewer = +response.data.icmsTemplateDetails.medicalDirector;
            if (peerReviewer > 0) {
              this.medicalDirectors.forEach(element => {
                if (element.value === peerReviewer) {
                  this.eclIcmsNotifiedRules.medicalDirector = element.value;
                }
              });
            }
            this.templateStatus = response.data.icmsTemplateDetails.templateStatus;
            if (this.eclIcmsNotifiedRules.pridDetails) {
              this.lotusNotesUrl = this.sanitization.bypassSecurityTrustUrl(this.eclIcmsNotifiedRules.pridDetails.url);
            }

            if (this.eclIcmsNotifiedRules.implementationDt !== undefined && this.eclIcmsNotifiedRules.implementationDt !== null) {
              this.eclIcmsNotifiedRules.implementationDt = new Date(this.eclIcmsNotifiedRules.implementationDt);
            }
            if (this.eclIcmsNotifiedRules.modifiedOn !== undefined && this.eclIcmsNotifiedRules.modifiedOn !== null) {
              this.eclIcmsNotifiedRules.modifiedOn = new Date(this.eclIcmsNotifiedRules.modifiedOn);
            }
            if (this.eclIcmsNotifiedRules.subRuleDosFrom !== undefined && this.eclIcmsNotifiedRules.subRuleDosFrom !== null) {
              this.eclIcmsNotifiedRules.subRuleDosFrom = new Date(this.eclIcmsNotifiedRules.subRuleDosFrom);
            }
            if (this.eclIcmsNotifiedRules.subRuleDosTo !== undefined && this.eclIcmsNotifiedRules.subRuleDosTo !== null) {
              this.eclIcmsNotifiedRules.subRuleDosTo = new Date(this.eclIcmsNotifiedRules.subRuleDosTo);
            }
            if (this.eclIcmsNotifiedRules.approvalSentDt !== undefined && this.eclIcmsNotifiedRules.approvalSentDt !== null) {
              this.eclIcmsNotifiedRules.approvalSentDt = new Date(this.eclIcmsNotifiedRules.approvalSentDt);
            }
            if (this.eclIcmsNotifiedRules.approvedDt !== undefined && this.eclIcmsNotifiedRules.approvedDt !== null) {
              this.eclIcmsNotifiedRules.approvedDt = new Date(this.eclIcmsNotifiedRules.approvedDt);
            }
            // 1.	CLAIM TYPE: We are unable to select more than one claim type. It would be great to have checkboxes against every type so that multiple can be selected. 
            if (this.eclIcmsNotifiedRules && this.eclIcmsNotifiedRules.claimTypes
              && this.eclIcmsNotifiedRules.claimTypes.length > 0) {
              this.eclIcmsNotifiedRules.claimTypes.forEach(element => {

                this.icmClaimType.forEach(claimTy => {
                  if (element.name === claimTy.name) {
                    this.icm.push(element);
                  }
                });

                this.icmoClaimType.forEach(claimTy => {
                  if (element.name === claimTy.name) {
                    this.icmo.push(element);
                  }
                })
              });
            }
          }
          if (this.eclIcmsNotifiedRules === undefined || this.eclIcmsNotifiedRules.createdBy === undefined && response.data.submitted === false) {
            this.saveBtnDisable = false;
            this.submitBtnDisable = false;
          } else if (this.eclIcmsNotifiedRules !== undefined && this.eclIcmsNotifiedRules.createdBy !== this.util.getLoggedUserId() && response.data.submitted === true) {
            this.saveBtnDisable = true;
            this.submitBtnDisable = true;
          }
          this.checkWhetherValidFields();
          this.loading = false;
         
        }, 2000);
      });

    this.ruleEngineTemplateService.getICMSRulesByRule(this.ruleInfo.ruleId).subscribe(responseData => {
      const getIcmsRules = responseData.data;
      if (getIcmsRules && getIcmsRules.submitted != null && getIcmsRules.submitted === true && this.submmitedTemplate === true) {
        this.saveBtnDisable = true;
        this.submitBtnDisable = true;
      } else {
        this.saveBtnDisable = false;
        this.submitBtnDisable = false;
      }
    });
   
  }

  checkWhetherValidFields(){
     // Check if stored values are valid or not.
     const { prid, description, medicalPolicy, primaryRefTitle, cvCode, clients, industryUpdateReqd, reasonCodes, duplicateChecking } = this.eclIcmsNotifiedRules;

     this.requiredFields.forEach(field => {

       if (field.name === 'PRID') {
         field.isValid = (!prid || prid.length === 0) ? false : true;
       } else if (field.name === 'Description') {
         field.isValid = (!description || description.length === 0) ? false : true;
       } else if (field.name === 'Medical Policy') {
         field.isValid = !medicalPolicy ? false : true;
       } else if (field.name === 'Client Required') {
         field.isValid = (!clients || clients.length <= 0) ? false : true;
       } else if (field.name === 'Primary Reference') {
         field.isValid = !primaryRefTitle ? false : true;
       } else if (field.name === 'CV Code (Edit Flag)') {
         field.isValid = !cvCode ? false : true;
       } else if (field.name === 'Reason Codes') {
         field.isValid = (!reasonCodes || reasonCodes.length <= 0) ? false : true;
       } else if (field.name === 'Industry Update Required') {
         field.isValid = !industryUpdateReqd ? false : true;
       } else if (field.name === 'Claim Type') {
         field.isValid = (this.icm.length === 0 && this.icmo.length === 0) ? false : true;
       } else if (field.name === 'Duplicate Checking') {
         field.isValid = (!duplicateChecking || duplicateChecking.length < Constants.DUPLICATE_CHECKING_REQUIRED) ? false : true;
       }
     });
  }

   /**
  * set pdg specific data in the object
  */
  setPdgFields() {
    let pdgTemplateDto = this.ruleInfo.pdgTemplateDto;
    this.eclIcmsNotifiedRules.primaryRefTitle = null;
    this.eclIcmsNotifiedRules.secondaryRefTitle = null;

    this.eclIcmsNotifiedRules.duplicateChecking = this.duplicateChecking;
    this.eclIcmsNotifiedRules.subRuleDosFrom = new Date(pdgTemplateDto.dosFrom);
    this.eclIcmsNotifiedRules.subRuleDosTo = new Date(pdgTemplateDto.dosTo);
    this.getFirstCCAFromLibraryRule(this.ruleInfo, Constants.ECL_PROVISIONAL_STAGE).then(res => {
      this.eclIcmsNotifiedRules.analyst = res;
    });
    this.util.getAllLookUpsByTypeAndDescription(Constants.ICMS_REF_TITLE, Constants.STATE, []).then((dest: any[]) => {
      dest.forEach(item => {
        let lookups = item.label.split("-");
        let lookupCode = lookups[0].trim();
        let lookupDesc = lookups[1].trim();
        if (item.value == pdgTemplateDto.primaryReferenceTitle) {
          this.eclIcmsNotifiedRules.primaryRefTitle = { name: lookupDesc, id: lookupCode };
        } else if (item.value == pdgTemplateDto.secondaryReferenceTitle) {
          this.eclIcmsNotifiedRules.secondaryRefTitle = { name: lookupDesc, id: lookupCode };
        }
      });
    }).then(() => {
      this.util.getAllLookUpsByTypeAndDescription(Constants.ICMS_INDUSTRY_UPDATE, Constants.MCAID, []).then((dest: any[]) => {
        dest.forEach(item => {
          if (item.value == pdgTemplateDto.industryUpdateRequired) {
            let label = item.label.replace(/ /g, '')
            this.eclIcmsNotifiedRules.industryUpdateReqd = { name: item.label, id: label };
          }
        });

        this.reasonCodes.forEach(item => {
          if (item.value.id == pdgTemplateDto.reasonCodeAndDescription) {
            this.eclIcmsNotifiedRules.reasonCodes = { name: item.value.name, id: item.value.id };
          }
        });

        this.clients.forEach(client => {
          if (client.value == "MCD") {
            this.eclIcmsNotifiedRules.clients = ["MCD"];
          }
        });
        this.checkWhetherValidFields();
      });

    });
  }

  private getAllfieldsInJson() {
    this.eclIcmsRules = [];
    let eclIcmsNotdRule = new EclIcmsNotifiedRulesDto();
    eclIcmsNotdRule = this.eclIcmsNotifiedRules;

    eclIcmsNotdRule.productType = '';
    eclIcmsNotdRule.midRuleDesc = '';
    eclIcmsNotdRule.resolvedDescription = '';

    // if prid are different then we remove the prid generated.
    if (eclIcmsNotdRule.pridDetails) {
      if (eclIcmsNotdRule.prid.localeCompare(eclIcmsNotdRule.pridDetails.prid) !== 0) {
        eclIcmsNotdRule.pridDetails = null;
      }
    }

    return {
      ruleId: this.ruleInfo.ruleId,
      ruleCode: this.ruleInfo.ruleCode,
      icmsTemplateDetails: eclIcmsNotdRule,
      submittedBy: this.util.getLoggedUserId(),
      rmrTypeCode: Constants.RMR_TEMP_TYPE,
      submitted: false,
    };
  }

  public showPridCreationForm() {
    this.projectCreationModal = true;
    setTimeout(() => {
      this.arrayMessage = [];
      this.arrayMessage = Object.assign([], [{ severity: 'info', summary: 'Info', detail: 'This will create a Stub Project Request in Lotus Notes, along to a PRID.  Please note that for using this PRID to create RMR, the Project request should be fully processed and Submitted in Lotus Notes.' }]);
    }, 1000);


  }
  /**
   * Checks if the changed value is valid or not.
   * @param event that fires the value
   * @param field that we want to evaluate.
   */
  checkIsValid(event, field) {
    let element = this.requiredFields.find(el => el.name === field);
    if (typeof event === 'number' || event instanceof Number) {
      if (event && event > 0) {
        element.isValid = true;
      } else {
        element.isValid = false;
      }
    } else if (typeof event === 'string' || event instanceof String) {
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
   * Checks if the fiel needs to be mark as required.
   * @param field to be evaluated
   */
  setRequired(field: string) {
    const element = this.requiredFields.find(el => el.name === field);
    return !element.isValid;
  }

  /**
   * Checks if the fiel needs to be mark as required.
   * @param field to be evaluated
   */
  setRequiredForProject(field: string) {
    const element = this.requiredFields.find(el => el.name === field);
    return !element.isValid;
  }

  /**
   * Checks if the form is valid if so then we save/submit it, otherwise shows error message.
   * @param templateForm form to be saved or submitted to icms.
   */
  isValidForm(templateForm) {
    let pridErrorMessage = '';

    // We check if we have pattern error.
    if (templateForm.invalid) {
      if (templateForm.controls.prid && templateForm.controls.prid.errors && templateForm.controls.prid.errors.pattern) {
        pridErrorMessage = `'PRID' field only allows Alphanumeric values`;
      }
    }

    // We get all error fields and create error message.
    const invalidFields = this.requiredFields.filter(el => el.isValid === false).map(el => ` '${el.name}'`).join(',');

    if (invalidFields.length > 0 && pridErrorMessage.length > 0) {
      this.dialogLeftPosition = 150;
      this.Message = `The fields ${invalidFields} cannot be empty, ${pridErrorMessage}`;
      this.headerText = 'Information';
      this.saveDisplay = true;
      return false;
    } else if (invalidFields.length === 0 && pridErrorMessage.length > 0) {
      this.dialogLeftPosition = 350;
      this.Message = pridErrorMessage;
      this.headerText = 'Information';
      this.saveDisplay = true;
      return false;
    } else if (invalidFields.length > 0 && pridErrorMessage.length === 0) {
      this.dialogLeftPosition = 150;
      this.Message = `The field(s) ${invalidFields} cannot be incomplete.`;
      this.headerText = 'Information';
      this.saveDisplay = true;
      return false;
    }

    return true;
  }

  saveIcmsRule(templateForm) {
    if (this.isValidForm(templateForm)) {
      const eclIcmsObj = this.getAllfieldsInJson();
      eclIcmsObj.icmsTemplateDetails.templateStatus = 'Saved';
      this.ruleEngineTemplateService.saveIcmsRules(eclIcmsObj).subscribe(response => {
        this.eclIcmsNotifiedRules = response.data;
        if ((response.data != null)) {
          this.headerText = 'Confirmation';
          this.saveDisplay = true;
          this.Message = 'ICMS template Details Saved Successfully.';
        }
        this.loadDataToFields();
      });
    }
  }

  submitTemplate(templateForm) {
    if (this.isValidForm(templateForm)) {
      const eclIcmsObj = this.getAllfieldsInJson();
      eclIcmsObj.icmsTemplateDetails.templateStatus = 'Sent to Lotus Notes';

      this.saveBtnDisable = true;
      this.submitBtnDisable = true;
      eclIcmsObj.submitted = true;

      this.ruleEngineTemplateService.submitIcmsRules(eclIcmsObj).subscribe(response => {
        this.isSubmit = true;
        this.eclIcmsNotifiedRules = response.data;
        if ((response.data != null)) {
          this.saveDisplay = true;
          this.Message = 'ICMS Template Details Submitted Successfully';
        }
        this.loadDataToFields();
      }, (error) => {
        this.saveBtnDisable = false;
        this.submitBtnDisable = false;
      });
    }
  }

  onHide(event) {
    this.arrayMessage = [];
  }

  saveDialog() {
    this.saveDisplay = false;
    if (this.isSubmit) {
      this.ref.close();
    }
  }

  private getMotherBabyFlag(motherBabyFlag): void {
    this.utilService.getAllLookUps(motherBabyFlag).subscribe(response => {
      response.forEach(motherBabyFl => {
        this.motherBabyFlag.push({
          label: motherBabyFl.lookupDesc,
          value: motherBabyFl.lookupId
        });
      });
    });
  }

  private getLookupValues(lookupSearchValue): Promise<any[]> {
    const result: any[] = [];
    return new Promise((resolve, reject) => {
      this.utilService.getAllLookUps(lookupSearchValue).subscribe(response => {
        response.forEach(lookupValue => {
          result.push({
            label: lookupValue.lookupDesc,
            value: {
              name: lookupValue.lookupDesc,
              id: lookupValue.lookupCode,
            }
          });
        });
        resolve(result);
      });
    })
  }

  private getAllClientInfo(): void {
    this.ruleEngineTemplateService.getClientInfo(Constants.ICMS_NAME_VALUE).subscribe(response => {
      response.data.forEach(client => {
        this.clients.push({
          label: client.clientDesc,
          value: client.clientShortDesc,
        });
      });
    });
  }

  private getIcmsCatalog(): Promise<any> {
    this.loading = true;
    const result: any[] = [];
    this.readAndLoadCategory();
    return new Promise((resolve, reject) => {
      forkJoin([
        this.utilService.getIcmsCatalog(),
        this.utilService.getAllUsers(),
        this.utilService.getUsersByRole(this.eclConstant.USERS_CLINICAL_CONTENT_ANALYST),
        this.utilService.getUsersByRole(this.eclConstant.USERS_MEDICAL_DIRECTOR_ROLE)
       ]).subscribe(([response, allUsers, allAnalysts, allPeerReviewer]) => {

        this.users = this.catalogUtils.convertIntoSelectItemArray(allUsers, 'firstName', 'userId');
        this.anlysts = this.catalogUtils.convertIntoSelectItemArray(allAnalysts, 'firstName', 'userId');
        this.medicalDirectors = this.catalogUtils.convertIntoSelectItemArray(allPeerReviewer, 'firstName', 'userId');
        this.cvSources = response.data.cvSources.map(
          element => {
            return {
              label: element.icmsValue,
              value: {
                name: element.icmsValue,
                id: element.icmsId
              }
            }
          }
        );
        if (this.cvSources.length == 0) {
          this.getLookupValues(this.eclConstant.LOOKUP_TYPE_ICMS_CV_SOURCE)
            .then(r => this.cvSources = r);
        }

        this.cvCodes = response.data.cvCodes.map(
          element => {
            return {
              label: element.icmsValue,
              value: {
                name: element.icmsValue,
                id: element.icmsId
              }
            }
          }
        );
        if (this.cvCodes.length == 0) {
          this.getLookupValues(this.eclConstant.LOOKUP_TYPE_ICMS_CV_CODE)
            .then(r => this.cvCodes = r);
        }

        this.refTitles = response.data.refTitles.map(
          element => {
            return {
              label: element.icmsValue,
              value: {
                name: element.icmsValue,
                id: element.icmsId
              }
            }
          }
        );
        if (this.refTitles.length == 0) {
          this.getLookupValues(this.eclConstant.LOOKUP_TYPE_ICMS_REF_TITLE)
            .then(r => this.refTitles = r);
        }

        this.claimTypeLinks = response.data.claimTypes.map(
          element => {
            return {
              label: element.icmsValue,
              value: {
                name: element.icmsValue,
                id: element.icmsId
              }
            }
          }
        );
        if (this.claimTypeLinks.length == 0) {
          this.getLookupValues(this.eclConstant.LOOKUP_TYPE_ICMS_CLAIM_TYPE_LINK)
            .then(r => this.claimTypeLinks = r);
        }

        this.changeSources = response.data.changeSource.map(
          element => {
            return {
              label: element.icmsValue,
              value: {
                name: element.icmsValue,
                id: element.icmsId
              }
            }
          }
        );
        if (this.changeSources.length == 0) {
          this.getLookupValues(this.eclConstant.LOOKUP_TYPE_ICMS_CHANGE_SOURCE)
            .then(r => this.changeSources = r);
        }

        this.reasonCodes = response.data.reasonCodes.map(
          element => {
            return {
              label: element.icmsValue,
              value: {
                name: element.icmsValue,
                id: element.icmsId
              }
            }
          }
        );
        if (this.reasonCodes.length == 0) {
          this.getLookupValues(this.eclConstant.LOOKUP_TYPE_ICMS_REASON_CODES)
            .then(r => this.reasonCodes = r);
        }

        this.clients = response.data.clients.map(
          element => {
            return {
              label: element.icmsValue,
              value: element.icmsId
            }
          }
        );
        if (this.clients.length == 0) {
          this.getAllClientInfo();
        }
        this.loading = false;
        resolve(true);
      });    
    })   
  }

  private readAndLoadCategory() {
    this.util.getAllCategoriesByPromise(this.categories)
      .then(() => this.categories.forEach((element: any) => {
        this.medicalPolicies.push({
          label: element.label,
          value: {
            name: element.label,
            id: element.value.toString()
          }
        }
        );
      }));
  }

  private getAllLOBs(): void {
    this.util.getAllLobs(this.lobs).then((data: any[]) => {
      this.lobs = data;
    });
  }

  /**
   * Every time the claim type changes we check if is a valid selection.
   * @param event that hass the current value.
   */
  onClaimTypeSelection(event): void {
    this.eclIcmsNotifiedRules.claimTypes = [...this.icm, ...this.icmo];
    this.eclIcmsNotifiedRules.claimTypesICM = [...this.icm];
    this.eclIcmsNotifiedRules.claimTypesICMO = [...this.icmo];
    const claimTypesSelected = this.requiredFields.find(el => el.name === 'Claim Type');

    if (!this.eclIcmsNotifiedRules.claimTypes || this.eclIcmsNotifiedRules.claimTypes.length === 0) {
      claimTypesSelected.isValid = false;
    } else {
      claimTypesSelected.isValid = true;
    }
  }

  /**
 * Every time the duplicate checking changes we check if is a valid selection.
 * @param event that has the current value.
 */
  onDuplicateCheckingSelection(event): void {
    const duplicateCheckingSelected = this.requiredFields.find(el => el.name === 'Duplicate Checking');

    if (!this.eclIcmsNotifiedRules.duplicateChecking || this.eclIcmsNotifiedRules.duplicateChecking.length < Constants.DUPLICATE_CHECKING_REQUIRED) {

      duplicateCheckingSelected.isValid = false;
    } else {
      duplicateCheckingSelected.isValid = true;
    }
  }

  onCvCodeChange(event): void {
    if (event.value.name.trim() === 'CORE') {
      this.disableCvSource = !this.disableCvSource;
      this.eclIcmsNotifiedRules.cvSource = null;
    } else {
      this.disableCvSource = false;
    }
  }

  exportAsCSV() {
    const filename = 'ICMSTemplateToCSV';
    this.loadDataToFields();
    let eclIcmsObj = this.getAllfieldsInJson();

    let createHeader = new EclIcmsNotifiedRulesDto();
    let headerList = {
      eclIcmsNotdRule: createHeader,
    };

    let csvData = this.convertToCSV(eclIcmsObj.icmsTemplateDetails);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });

    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);

    let isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;

    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }


  private convertToCSV(objArray) {
    let count = 0;
    let header: any[] = [];
    let jsonData: any[] = [];

    let obj = JSON.stringify(objArray);
    JSON.parse(obj, (key, value) => {
      if ((key !== 'code')) {
        if (typeof value !== 'object' && value !== undefined) {
          header[count] = key;
          jsonData[count] = value;
          count = count + 1;
        }
      }
    });
    let str = '';
    let row = 'S.No, ';
    let data = 'Data, ';
    for (let index in header) {
      row += header[index] + ', ';
      data += jsonData[index] + ', ';
    }
    row = row.slice(0, -1);
    data = data.slice(0, -1);
    str += row + '\r\n';
    str += data + '\r\n';

    return str;
  }

  /**
	 * This method is used for getting the id of the fist CCA who worked on the rule
	 * @param ruleId
	 * @param stageId
	 * @return cca id
	 */
  getFirstCCAFromLibraryRule(ruleInfo: RuleInfo, stageId): Promise<number> {
    let parentRuleId = ruleInfo.parentRuleId;
    let lookupList = [Constants.PROV_DRAFT_STATUS_CODE];
    return new Promise<number>((resolve) => {
      this.ruleInfoService.getFirstCCAFromLibraryRule(parentRuleId, stageId, lookupList).subscribe((res: any) => {
        let assignedTo = res.data[0].assignedTo.userId;
        resolve(assignedTo);
      });
    });
  }

  get creationName() { return this.createProjectForm.get('name'); }
  get creationSummary() { return this.createProjectForm.get('summary'); }
  get creationDescription() { return this.createProjectForm.get('description'); }

  
  /**
   * Short by selection.
   *
   * @param field that we want to evaluate.
   */
  shortBySelection(field: string) {
    if(field && field === 'Client Required'){
      for(let i = 0; i < this.eclIcmsNotifiedRules.clients.length; i++){
        let selected = this.eclIcmsNotifiedRules.clients[i];
        for(let j = 0; j < this.clients.length; j++){
          if(this.clients[j].value === selected){
            this.array_move(this.clients, j, 0);
            break;
          }
        }
      } 
    }
  }

  private array_move(arr: any, old_index : number, new_index :number) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }
}
