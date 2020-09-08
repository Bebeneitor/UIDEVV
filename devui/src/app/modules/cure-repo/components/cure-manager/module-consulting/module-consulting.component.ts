import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { flatMap } from 'rxjs/operators';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { DataType } from '../../../models/cure-attribute-type.enum';
import { ModuleConsultingService } from './module-consulting.service';

@Component({
  selector: 'app-module-queries',
  templateUrl: './module-consulting.component.html',
  styleUrls: ['./module-consulting.component.css']
})
export class ModuleConsultingComponent implements OnInit {
  attrbutesDatatypes = DataType;

  modulesForm: FormGroup;
  modulesList: SelectItem[] = [];
  parametersList: SelectItem[];
  lastModuleSelection;
  blocked: boolean = false;
  blockedMessage: string = '';
  exactMatch: boolean = false;

  moduleSelection = [];
  attributeSelection: { module: any, attribute: any, index: any }[] = [];
  yearValidRange = `${Constants.MIN_VALID_YEAR}:${Constants.MAX_VALID_YEAR}`;

  formLastChange: any[];

  constructor(private fb: FormBuilder, private moduleConsultingService: ModuleConsultingService,
    private fileManagerService: FileManagerService, private messageService: ToastMessageService,
    private confirmationService: ConfirmationService) { }


  /**
   * On component init load the modules data and create the module form.
   */
  ngOnInit() {
    this.createModuleForm();
    this.loadModules();
  }



  /**
   * Load the acordion controls.
   */
  loadAccordions() {
    // Get the modules that have saved queries.
    const modulesWithSavedQueries = this.modulesList.filter(module => module.value.savedQuery.hasOwnProperty('queryId')).map(module => module.value);

    // Set the value to the modules control.
    this.modules.setValue(modulesWithSavedQueries);

    const selectedModules = this.modules.value;

    // Check if module control has values if so then add the module to the accordion component.
    if (selectedModules && selectedModules.length > 0) {
      for (let index = 0; index < selectedModules.length; index++) {
        const currentModule = selectedModules[index];

        // Add the module to the module array.
        this.addModule(currentModule);
      }
    }
    this.toggleUiBlock(false);
  }

  /**
   * Gets the data and map it to the SelectedItem Interface.
   */
  loadModules() {
    this.toggleUiBlock(true, 'Loading modules, please wait...');

    this.moduleConsultingService.getModules().subscribe((modules: any[]) => {
      this.modulesList = modules;

      // When the modules are loaded we load the accordion controls.
      this.loadAccordions();
    }, this.responseErrorCallBack);
  }

  /**
   * Adds the attribute to the given module attributes list.
   */
  createFormControlAttribute(currentModule, element, index, toAddAttr, moduleAttributesSelection: FormArray) {

    let value;
    let attribute;

    // Check if we have any value added before adding new elements if so 
    // We set the value to the last selection
    let valueFromLastSelection;
    if (this.formLastChange) {
      const lastSelectedModule = this.formLastChange.find(change => {
        return change.cureModuleId === currentModule.cureModuleId;
      });

      const lastSelectionAttributeValue = lastSelectedModule.lastValues.find(attr => {
        return attr.attributeId === element.attributeId;
      });

      if (lastSelectionAttributeValue) {
        valueFromLastSelection = lastSelectionAttributeValue.value;
      }
    }

    let attributeDefinition;
    // We get the attribute definition.
    attributeDefinition = currentModule.moduleAttributes.find(attr => attr.attributeId === element.attributeId);

    if (valueFromLastSelection) {
      value = valueFromLastSelection;
    } else {
      // If we have a value in the saved query then we get it from the saved query.
      if (currentModule.savedQuery && currentModule.savedQuery.queryTemplate && currentModule.savedQuery.queryTemplate.queryAttributes.length > 0) {
        attribute = currentModule.savedQuery.queryTemplate.queryAttributes.find(att => att.attributeId === element.attributeId);
      }

      // If we have an attribute then we check the value and its type.
      if (attribute) {
        if (attribute.value) {
          if (attributeDefinition.uiDataType === DataType.date) {
            value = new Date(this.moduleConsultingService.parseDateFromString(attribute.value));
          } else {
            value = attribute.value;
          }
        }
      } else {
        attribute = element;
      }
    }

    if (attributeDefinition.mandatory) {
      moduleAttributesSelection.push(new FormControl(value, Validators.required));
    } else {
      moduleAttributesSelection.push(new FormControl(value));
    }

    this.attributeSelection.push({ module: currentModule, attribute: attributeDefinition, index: index });
    toAddAttr.push(attributeDefinition);
  }

  /**
   * Toggle the ui component block.
   * @param blocked boolean that indicates if the ui will bi blocked or not.
   * @param message for the blocked ui.
   */
  toggleUiBlock(blocked: boolean, message?: string) {
    this.blocked = blocked;
    this.blockedMessage = message;
  }

  /**
   * Creates the main module form.
   */
  createModuleForm() {
    this.modulesForm = this.fb.group({
      modules: this.fb.control(null),
      selectedModules: this.fb.array([])
    });
  }

  /**
   * Returns the selectedModules control in a form array object.
   */
  get selectedModules() {
    return this.modulesForm.get('selectedModules') as FormArray;
  }

  /**
   * Returns the modules control as form array object.
   */
  get modules() {
    return this.modulesForm.get('modules') as FormControl;
  }

  /**
   * Adds an element to module selection control.
   * @param module 
   */
  addModule(module) {
    this.selectedModules.push(this.fb.group({
      attributes: this.fb.control(null),
      selectedAttributes: this.fb.array([]),
      exactMatch : this.fb.control(false)
    }));
    this.moduleSelection.push(module);
    this.setAttributesToModule(module, this.selectedModules.length - 1);
  }

  /**
   * Fires when the module selection panel is closed.
   * @param event Dom Original Event value.
   */
  onModuleSelectionHide(): void {
    this.resetSelectedModules();
  }

  /**
   * Resets the module selection to the default value.
   */
  resetSelectedModules(): void {
    // Check if module control has values if so then add the module to the accordion component.
    const modules = this.modules.value;
    const selectedModules = this.selectedModules;

    if (modules && modules.length > 0) {

      this.toggleUiBlock(true, 'Loading modules, please wait...');

      // If we add one or more modules.
      if (modules.length > selectedModules.length) {
        const filteredModules = modules.filter(module => this.moduleSelection.indexOf(module) === -1);

        filteredModules.forEach(module => this.addModule(module));
      }

      // If we remove one or more modules.
      else if (modules.length < selectedModules.length) {

        const validSelectedModules = [...this.lastModuleSelection.value];
        for (let i = selectedModules.length - 1; i >= 0; i--) {
          const selectedModuleId = this.moduleSelection[i].cureModuleId;

          const checkIncuded = this.moduleSelection.find(element => element.cureModuleId === selectedModuleId);
          const isModuleIncluded = validSelectedModules.includes(checkIncuded);

          if (!isModuleIncluded) {
            selectedModules.removeAt(i);
            this.moduleSelection = this.moduleSelection.filter(x => x.cureModuleId !== selectedModuleId);
            this.attributeSelection = this.attributeSelection.filter(att => att.module.cureModuleId !== selectedModuleId);
          }
        }
      }

      this.toggleUiBlock(false);
    } else {
      this.resetAll();
    }
  }

  /**
   * Resets all the controls and form.
   */
  resetAll() {
    for (let i = this.selectedModules.length - 1; i >= 0; i--)
      this.selectedModules.removeAt(i);

    this.moduleSelection = [];
    this.attributeSelection = [];
    this.modulesForm.reset();
  }

  /**
   * Every time the module control changes stores the last value in the lastModuleSelection Property.
   * @param event that contains the value and the selected or unselected itemValue.
   */
  onModuleSelectionChange(event): void {
    if (event.value.length > 0) {
      this.lastModuleSelection = event;
    }
  }

  /**
   * Restest the attributes selection every time the panel hides.
   * @param module 
   * @param i 
   */
  onAttributeSelectionhide(module, i): void {
    this.setAttributesToModule(module, i, false);
  }

  /**
   * Gets the selected attributes element.
   * @param moduleId id for the module attributes selection.
   */
  getModuleAttributesControl(moduleId: number): { module: any, attribute: any, index: any }[] {
    const module = this.moduleSelection[moduleId];
    return this.attributeSelection.filter(attribute => attribute.module.cureModuleId === module.cureModuleId);
  }

  /**
   * Sets the width of the calendar element.
   * @param moduleId to get te list of attributes
   */
  setAttributeSize(moduleId) {
    const module = this.moduleSelection[moduleId];
    if( this.attributeSelection.filter(attribute => attribute.module.cureModuleId === module.cureModuleId).length > 2) {
      return '100%';
    } else {
      return '300px';
    }
  }

  /**
   * Checks if the module selected is invalid, if so button to export data is disabled.
   * @param i to get the index module.
   */
  moduleNotValid(moduleIndex: number): boolean {
    return (this.selectedModules.at(moduleIndex) as FormGroup).invalid;
  }

  attributeNotValid(moduleIndex: number, attributeIndex: number): FormControl {
    const module = this.selectedModules.at(moduleIndex);
    const selectedAttributes = module.get('selectedAttributes') as FormArray;
    const control = selectedAttributes.at(attributeIndex) as FormControl;
    if (control) {
      return control;
    }
  }

  /**
   * Return the attributes control from the selected module.  
   * @param moduleIndex to be selected.
   */
  attributesControlByModule(moduleIndex: number): AbstractControl {
    return (this.selectedModules.at(moduleIndex) as FormGroup).get('attributes');
  }

  /**
   * Exports the data for the selected module index.
   * @param moduleIndex to be selected.
   */
  exportToExcel(moduleIndex: number): void {
    this.toggleUiBlock(true, 'Getting data to export, please wait...');
    const dataToSave = this.selectedModules.at(moduleIndex);
    const module = this.moduleSelection[moduleIndex];
    this.moduleConsultingService.exportModuleData(module, dataToSave.value).subscribe((response: any) => {
      if (response.code === 200) {
        this.toggleUiBlock(false);
        this.messageService.messageSuccess(Constants.CONFIRMATION_WORD, Constants.FILE_INBOX_MESSAGE);
      } else {
        this.messageService.messageError('Error', 'Error processing XLSX file, please try again.');
        this.toggleUiBlock(false);
      }
    }, this.responseErrorCallBack);
  }

  /**
   * Saves the query and sets the value to the current module.
   * @param moduleIndex to be saved.
   */
  saveQuery(moduleIndex: number): void {
    this.toggleUiBlock(true, 'Saving current query, please wait...');
    const dataToSave = this.selectedModules.at(moduleIndex);
    const module = this.moduleSelection[moduleIndex];

    this.moduleConsultingService.saveQuery(module, dataToSave.value).pipe(flatMap((response: BaseResponse) => {
      return this.moduleConsultingService.getSavedQueryByModuleId(module.cureModuleId);
    })).subscribe((response: BaseResponse) => {

      // Set the value to the list elements and to the module it self.
      const moduleFromList = this.modulesList.find(mod => mod.value.cureModuleId === module.cureModuleId);
      moduleFromList.value.savedQuery = response.data[0];
      module.savedQuery = response.data[0];

      this.messageService.messageSuccess('Info', 'Query saved successfully.');
      this.toggleUiBlock(false);
    }, this.responseErrorCallBack);
  }

  /**
   * Sets the attributes controls for the module.
   * @param currentModule to apply changes
   * @param index for the accordion managment.
   */
  setAttributesToModule(currentModule, index, setFromSavedQuery: boolean = true) {
    // get the selected module control.
    const moduleForm = this.selectedModules.at(index) as FormGroup;
    const attributesValue = [];

    const moduleFromSelection = this.moduleSelection[index];

    const moduleAttributesSelection = moduleForm.get('selectedAttributes') as FormArray;

    const moduleAttributes = moduleForm.get('attributes') as FormArray;

    // Reset the attributes array.
    for (let i = moduleAttributesSelection.length - 1; i >= 0; i--)
      moduleAttributesSelection.removeAt(i);

    const filteredAttributes = this.attributeSelection.filter(module => module.module.cureModuleId !== moduleFromSelection.cureModuleId);
    this.attributeSelection = [...filteredAttributes];

    // If we have a saved query then we set the value from query 
    // otherwise from the array attributes value.
    let attList;
    if (setFromSavedQuery) {
      if (currentModule.savedQuery.queryTemplate) {
        attList = currentModule.savedQuery.queryTemplate.queryAttributes;
        const exactMatch = moduleForm.get('exactMatch') as FormControl; 
        exactMatch.setValue(currentModule.savedQuery.queryTemplate.exactMatch);
      }
    } else {
      attList = moduleAttributes.value;
    }

    // If we have attributest we loopt and create the dynamic control.
    if (attList && attList.length > 0) {
      attList.forEach(element => this.createFormControlAttribute(currentModule, element, index, attributesValue, moduleAttributesSelection));

      // Update the value and validity of the control module.
      moduleAttributes.setValue([...attributesValue]);
      moduleAttributes.updateValueAndValidity();
      moduleAttributesSelection.updateValueAndValidity();
    }
  }

  /**
   * Unlocks the screen every time there is a response error.
   * @param error that the request throws.
   */
  responseErrorCallBack = (error) => {
    this.toggleUiBlock(false);
  }

  /**
   * When the attributes panel opens we store the las modules selection into a variable 
   * So we can stor the form controls values for latter usage.
   */
  onPanelOpen() {
    const selected = [];
    const lastSelection = this.modulesForm.get('selectedModules').value as any[];
    if (lastSelection && lastSelection.length > 0) {
      lastSelection.forEach((element, index) => {
        const attributes = [];
        if (element.attributes && element.attributes.length > 0) {
          element.attributes.forEach((att, j) => {
            attributes.push({
              attributeId: att.attributeId,
              value: element.selectedAttributes[j]
            });
          });
        }
        selected.push({ lastValues: attributes, cureModuleId: this.moduleSelection[index].cureModuleId })
      });
    }

    this.formLastChange = selected;
  }

}
