import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

import { Constants } from 'src/app/shared/models/constants';

@Component({
    selector: 'attribute-add-edit',
    templateUrl: './module-attribute-add-edit.component.html',
    styleUrls:['./module-attribute-add-edit-component.css']
})
export class ModuleAttributeAddEditComponent implements OnInit{

    attributeTemplateForm: FormGroup;

    attribute: any;
    uiDataTypes = [
        {label: 'Text', value: 'text'},
        {label: 'Date', value: 'date'},
    ];

    formInactiveFlag = false;
    buttonFlag = false;

    constructor(private fb: FormBuilder, private config: DynamicDialogConfig,
        private ref: DynamicDialogRef) { }
    
    ngOnInit(): void {
        this.attribute = this.config.data.attribute;

        if(this.attribute){
            this.formInactiveFlag = this.attribute.status !== Constants.ACTIVE_STRING_VALUE;
        }else{
            this.attribute = {
                attributeId: 0,
                attributeName: '',
                columnName: '',
                mandatory: false,
                uiDataType: '',
                status: Constants.ACTIVE_STRING_VALUE,
                mode: Constants.ADD_MODE,
                randomId: Math.floor(Math.random() * 5000)  
            }
        }
        this.attributeTemplateForm = this.fb.group({
            attributeName: new FormControl({value:null, disabled: this.formInactiveFlag}, [Validators.required]),
            columnName: new FormControl({value:null, disabled: this.formInactiveFlag}, [Validators.required]),
            uiDataTypesDD: new FormControl({value:null, disabled: this.formInactiveFlag}, [Validators.required]),
            mandatory: new FormControl({value:null, disabled: this.formInactiveFlag}, [Validators.required])
        });
        
        this.attributeTemplateForm.setValue({ attributeName: this.attribute.attributeName,
            columnName: this.attribute.columnName,
            uiDataTypesDD: {value: this.attribute.uiDataType}, 
            mandatory: this.attribute.mandatory});

        this.buttonFlag = this.attribute.attributeId === 0 && this.attribute.mode === Constants.ADD_MODE ? true : false;
        
    }

    activateAttribute(){
        this.attribute.status = Constants.ACTIVE_STRING_VALUE;
        this.formInactiveFlag = false;
        Object.keys(this.attributeTemplateForm.controls).forEach(key => {
            this.attributeTemplateForm.get(key).enable();
        });
    }

    updateAttribute(){
        if(this.attributeTemplateForm.invalid){
            Object.keys(this.attributeTemplateForm.controls).forEach(key => {
                if(key === 'uiDataTypesDD' && this.attributeTemplateForm.get(key).value.value === ''){
                    this.attributeTemplateForm.controls[key].setErrors({'incorrect': true});
                }
                this.attributeTemplateForm.controls[key].markAsTouched();
            });
            return;
        }

        let resultAttribute = {... this.attribute};
        Object.keys(this.attributeTemplateForm.controls).forEach(key => {
            if(key === 'uiDataTypesDD'){
                resultAttribute = {... resultAttribute, uiDataType: this.attributeTemplateForm.get(key).value.value};
            } else {
                resultAttribute = {... resultAttribute, [key]: this.attributeTemplateForm.get(key).value}
            }
            
        });
        this.ref.close(resultAttribute);
    }

    isInvalidElement(name): boolean{
        const controls = this.attributeTemplateForm.controls;
        if(controls[name].invalid && controls[name].touched){
            return true;
        }
        return false;
    }

    changedValue(name){
        if(this.attributeTemplateForm.get(name).value.value === ''){
            this.attributeTemplateForm.controls[name].setErrors({'incorrect': false})
        }
    }
}