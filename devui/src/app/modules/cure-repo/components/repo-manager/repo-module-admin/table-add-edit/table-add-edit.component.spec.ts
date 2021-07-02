import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAddEditComponent } from './table-add-edit.component';
import { ReactiveFormsModule, FormGroup, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { DialogModule } from 'primeng/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogService, MessageService } from 'primeng/api';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TableAddEditComponent', () => {
  let component: TableAddEditComponent;
  let fixture: ComponentFixture<TableAddEditComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableAddEditComponent],
      imports: [
        ReactiveFormsModule,
        CardModule,
        EclTableModule,
        DialogModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [DialogService, MessageService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAddEditComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('Should create add edit Component', () => {
    expect(component).toBeTruthy();
  });

  it('Should contain a FormGroup property called tableFormGroup', () => {
    expect(component['tableFormGroup']).toBeTruthy('tableFormGroup undefined');
  });

  it('tableFormGroup invalid when empty', () => {
    expect(component['tableFormGroup'].invalid).toBeTruthy('Invalid property is not true');
  });

  it('tableFormGroup should have 3 form controls', () => {
    let counter = 0;
    const formGroup = component['tableFormGroup'] as FormGroup;
    Object.keys(formGroup.controls).forEach(() => counter++);
    expect(counter).toBe(3);
  });

  it('Should contain tableName control and validity', () => {
    const formGroup = component['tableFormGroup'] as FormGroup;
    const formControl = formGroup.get('tableName') as FormControl;

    expect(formControl).toBeDefined('formControl tableName not defined');

    expect(formControl.invalid).toBeTruthy('tableControl is not invalid');

    let errors = {};
    errors = formControl.errors || {};
    expect(errors['required']).toBeTruthy();

    formControl.setValue('Test');
    errors = formControl.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Should contain tableNameInDb control and validity', () => {
    const formGroup = component['tableFormGroup'] as FormGroup;
    const formControl = formGroup.get('tableNameInDb') as FormControl;
    expect(formControl).toBeDefined('formControl tableName not defined');

    expect(formControl.invalid).toBeTruthy('tableControl is not invalid');

    let errors = {};
    errors = formControl.errors || {};
    expect(errors['required']).toBeTruthy();

    formControl.setValue('Test');
    errors = formControl.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Should contain tableOwnerInDb control and validity', () => {
    const formGroup = component['tableFormGroup'] as FormGroup;
    const formControl = formGroup.get('tableNameInDb') as FormControl;

    expect(formControl).toBeDefined('formControl tableName not defined');

    let errors = {};
    errors = formControl.errors || {};
    expect(errors['required']).toBeTruthy();

    formControl.setValue('Test');
    errors = formControl.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Should contain a label called Table Name', () => {
    const labelControl = el.nativeElement.querySelector('#tableNameLabel');
    expect(labelControl.innerText).toBe('*Table Name');
  });

  it('Should contain a label called Table Name in DB', () => {
    const labelControl = el.nativeElement.querySelector('#tableNameInDb');
    expect(labelControl.innerText).toBe('*Table Name in DB');
  });

  it('Should contain a label called Table Owner in DB', () => {
    const labelControl = el.nativeElement.querySelector('#tableOwnerInDb');
    expect(labelControl.innerText).toBe('*Table Owner in DB');
  });

  it('Form should be valid when setting value to controls', () => {
    expect(component['tableFormGroup'].valid).toBeFalsy();


    component['tableFormGroup'].get('tableName').setValue("test");
    component['tableFormGroup'].get('tableNameInDb').setValue("123456789");
    component['tableFormGroup'].get('tableOwnerInDb').setValue("123456789");
    expect(component['tableFormGroup'].valid).toBeTruthy();
  });

  it('attributesTableModel should be defined', () => {
    expect(component['searchCriteriaTableModel']).toBeDefined();
  });

  it('attributesTable viewchild property should be defined', () => {
    expect(component['searchCriteriaTableReference']).toBeDefined();
  });

  it('should show required message validity', () => {
    component['tableFormGroup'].get('tableName').setValue("test");
    component['tableFormGroup'].get('tableNameInDb').setValue("123456789");
    component['tableFormGroup'].get('tableOwnerInDb').setValue("123456789");
    fixture.detectChanges();
    let requiredSpans: DebugElement[] = el.queryAll(By.css('.text-danger'));

    expect(requiredSpans.length).toBe(0);


    component['tableFormGroup'].get('tableName').setValue(null);
    component['tableFormGroup'].get('tableName').markAsTouched();
    fixture.detectChanges();
    requiredSpans = el.queryAll(By.css('.text-danger'));

    expect(requiredSpans.length).toBe(1);


    component['tableFormGroup'].get('tableNameInDb').setValue(null);
    component['tableFormGroup'].get('tableNameInDb').markAsTouched();
    fixture.detectChanges();
    requiredSpans = el.queryAll(By.css('.text-danger'));

    expect(requiredSpans.length).toBe(2);


    component['tableFormGroup'].get('tableOwnerInDb').setValue(null);
    component['tableFormGroup'].get('tableOwnerInDb').markAsTouched();
    fixture.detectChanges();
    requiredSpans = el.queryAll(By.css('.text-danger'));

    expect(requiredSpans.length).toBe(3);
  });

  it('should reset the form', () => {
    component['tableFormGroup'].get('tableName').setValue('test');
    component['tableFormGroup'].get('tableNameInDb').setValue('test');
    component['tableFormGroup'].get('tableOwnerInDb').setValue('test');
    fixture.detectChanges();
    let requiredSpans: DebugElement[] = el.queryAll(By.css('.text-danger'));

    expect(requiredSpans.length).toBe(0);


    component['tableFormGroup'].reset();
    component['formReference'].nativeElement.reset();
    component['tableFormGroup'].markAsUntouched();
    
    component['tableFormGroup'].get('tableName').markAsUntouched();
    component['tableFormGroup'].get('tableNameInDb').markAsUntouched();
    component['tableFormGroup'].get('tableOwnerInDb').markAsUntouched();
    component['tableFormGroup'].get('tableOwnerInDb').setErrors(null);
    component['tableFormGroup'].get('tableName').setErrors(null);
    component['tableFormGroup'].get('tableNameInDb').setErrors(null);
    component['tableFormGroup'].updateValueAndValidity();
    fixture.detectChanges();
    requiredSpans = el.queryAll(By.css('.text-danger'));
    
    expect(requiredSpans.length).toBe(0);

  });
  
  it('should have a property called  formReference', () => {
    expect(component['formReference']).toBeDefined('form reference not defined');
  });
  
});

