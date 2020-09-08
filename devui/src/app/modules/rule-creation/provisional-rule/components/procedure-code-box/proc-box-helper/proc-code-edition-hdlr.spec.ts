import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUI, Panel } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProcedureCodeBoxComponent } from 'src/app/modules/rule-creation/provisional-rule/components/procedure-code-box/procedure-code-box.component';
import { ProcCodeEditionHandler } from './proc-code-edition-hdlr';
import { ProcCodeBoxHelper } from './proc-code-box-helper';
import { ProcCodeClassesHelper } from './proc-code-classes-helper';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProcCodeEditionHdlr', () => {
  let component: ProcedureCodeBoxComponent;
  let fixture: ComponentFixture<ProcedureCodeBoxComponent>;
  let nativeElement: Element;
  let procCodeEditionHandler: ProcCodeEditionHandler;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedureCodeBoxComponent, BlockUI, Panel],
      imports: [BrowserAnimationsModule, HttpClientTestingModule],
      providers: [ProcedureCodesService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedureCodeBoxComponent);
    component = fixture.componentInstance;
    component.procCodeType = 'HCPCS';
    nativeElement = component.procCodeBox.nativeElement;
    component.ngOnInit();
    procCodeEditionHandler = component.procCodeEditionHandler;
    fixture.detectChanges();
  });

  it('should Create', () => {
    expect(procCodeEditionHandler).toBeDefined();;
  });

  it('insert string - initial', () => {
      let value = 'stringToAdd';
      procCodeEditionHandler.addStringAtPosition(value, 0);
      expect(nativeElement.childElementCount).toBe(1);
      expect(nativeElement.firstElementChild.textContent).toBe(value);
  });

  it('insert string - greater than end', () => {
    let value = 'stringToAdd';
    procCodeEditionHandler.addStringAtPosition(value, 10);
    expect(nativeElement.childElementCount).toBe(1);
    expect(nativeElement.firstElementChild.textContent).toBe(value);
  });

  it('insert string - greater than end 2', () => {
    let initValue = 'C0001';
    component.procedureCodes = initValue;
    let value = 'C0002';
    procCodeEditionHandler.addStringAtPosition(value, initValue.length);
    expect(nativeElement.childElementCount).toBe(1);
    expect(nativeElement.firstElementChild.textContent).toBe(initValue + value);
  });

  it('insert string - middle', () => {
    let initValue = 'C0001';
    component.procedureCodes = initValue;
    let value = 'X';
    procCodeEditionHandler.addStringAtPosition(value, 'C0'.length);
    expect(nativeElement.childElementCount).toBe(1);
    expect(nativeElement.firstElementChild.textContent).toBe('C0X001');
  });

  it('insert string - codes', () => {
    let value = 'C0001-C0010,A1287';
    procCodeEditionHandler.addStringAtPosition(value, 0);
    expect(nativeElement.childElementCount).toBe(5);
  });

  it('insert string - space end', () => {
    let value = 'C0001';
    component.procedureCodes = value;
    procCodeEditionHandler.addStringAtPosition(' ', value.length);
    expect(nativeElement.childElementCount).toBe(2);
  });

  it('insert string - dash end', () => {
    let value = 'C0001';
    component.procedureCodes = value;
    procCodeEditionHandler.addStringAtPosition('-', value.length);
    expect(nativeElement.childElementCount).toBe(2);
  });

  it('insert string - codes end', () => {
    let value = 'C0001';
    component.procedureCodes = value;
    procCodeEditionHandler.addStringAtPosition(', 12762 - A23323', value.length);
    expect(nativeElement.childElementCount).toBe(5);
  });

  it('insert string - codes middle', () => {
    let value = 'C0001';
    component.procedureCodes = value;
    procCodeEditionHandler.addStringAtPosition('002, 12762 - A23323, C0', 'C0'.length);
    expect(nativeElement.childElementCount).toBe(7);
  });

  it('insert space after coma', () => {
    let value = 'A1234';
    component.procedureCodes = value;
    procCodeEditionHandler.addStringAtPosition(',', value.length);
    expect(nativeElement.childElementCount).toBe(2)
    procCodeEditionHandler.addStringAtPosition(' ', value.length + 1);
    expect(nativeElement.childElementCount).toBe(2)
    expect(nativeElement.textContent).toBe('A1234, ');
    expect(nativeElement.children[1].textContent).toBe(', ');
  })

  it('delete all content 1 - node', () => {
    let value = 'A12345';
    component.procedureCodes = value;
    procCodeEditionHandler.deleteStringAtPosition(0, value.length);
    expect(nativeElement.childElementCount).toBe(0);
  })

  it('delete content -midle node', () => {
    let value = 'A12345 - B23011';
    component.procedureCodes = value;
    procCodeEditionHandler.deleteStringAtPosition('A12345 - B'.length, 2);
    expect(nativeElement.childElementCount).toBe(3)
    expect(nativeElement.children[2].textContent).toBe('B011');
  })

  it('delete text - include node to delete', () => {
    let value = 'A12345 - B23011, C11231';
    component.procedureCodes = value;
    procCodeEditionHandler.deleteStringAtPosition('A1234'.length, '5 - B23011, C11'.length);
    expect(nativeElement.childElementCount).toBe(1)
    expect(nativeElement.textContent).toBe('A1234231');
  })
  // Tests comparing to original.
  it('change retainded code', () => {
    component.originalProcedureCodes = 'A1010';
    component.procedureCodes = 'A1010';
    procCodeEditionHandler.deleteStringAtPosition('A10'.length, 1);
    expect(nativeElement.childElementCount).toBe(2);
    expect(nativeElement.textContent).toBe('A1010A100');
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.DELETED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.ADDED_BAD_CODE_CLASS);
  })

  it('change update retained code to valid code', () => {
    component.originalProcedureCodes = 'A100';
    component.procedureCodes = 'A100';
    component.compareToOriginal = true;
    component.procCodeEditionHandler.addStringAtPosition('1', 'A10'.length);
    expect(nativeElement.childElementCount).toBe(2);
    expect(nativeElement.textContent).toBe('A100A1010');
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.DELETED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.ADDED_CODE_CLASS);
  })

  it('delete retained code sep.', () => {
    component.originalProcedureCodes = 'A100,';
    component.procedureCodes = 'A100';
    component.compareToOriginal = true;
    component.procCodeEditionHandler.addStringAtPosition(',', 'A100'.length);
    expect(nativeElement.childElementCount).toBe(2);
    expect(nativeElement.textContent).toBe('A100,');
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.RETAINED_BAD_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.RETAINED_SEP_CLASS);
  })

  it('delete retained code sep.-2', () => {
    component.originalProcedureCodes = 'A1001,A1010';
    component.procedureCodes = 'A1001';
    component.compareToOriginal = true;
    component.procCodeEditionHandler.addStringAtPosition(',', 'A1001'.length);
    expect(nativeElement.childElementCount).toBe(3);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.RETAINED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.RETAINED_SEP_CLASS);
    expect(nativeElement.children[2].className).toBe(ProcCodeClassesHelper.DELETED_CODE_CLASS);
  })

  it('delete retained code sep.-From end part', () => {
    component.originalProcedureCodes = 'A1001,A1010';
    component.procedureCodes = 'A1001';
    component.compareToOriginal = true;
    component.procCodeEditionHandler.addStringAtPosition(',', 'A1001, '.length);
    expect(nativeElement.childElementCount).toBe(3);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.RETAINED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.RETAINED_SEP_CLASS);
    expect(nativeElement.children[2].className).toBe(ProcCodeClassesHelper.DELETED_CODE_CLASS);
  })

  it('delete retained code sep. revert deleted', () => {
    component.originalProcedureCodes = 'A1001,A1010';
    component.procedureCodes = 'A1001';
    component.compareToOriginal = true;
    component.procCodeEditionHandler.addStringAtPosition(',', 'A1001, '.length);
    component.procCodeEditionHandler.addStringAtPosition('A1010', 'A1001, '.length);
    expect(nativeElement.childElementCount).toBe(3);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.RETAINED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.RETAINED_SEP_CLASS);
    expect(nativeElement.children[2].className).toBe(ProcCodeClassesHelper.RETAINED_CODE_CLASS);
  })

  it('delete retained code', () => {
    component.originalProcedureCodes = 'A1001,A1010';
    component.procedureCodes = 'A1001,A1010';
    component.compareToOriginal = true;
    component.procCodeEditionHandler.deleteStringAtPosition('A1001, '.length, 'A1010'.length)
    expect(nativeElement.childElementCount).toBe(3);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.RETAINED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.RETAINED_SEP_CLASS);
    expect(nativeElement.children[2].className).toBe(ProcCodeClassesHelper.DELETED_CODE_CLASS);
  })

  it('should not change deleted items', () => {
    component.originalProcedureCodes = 'A1001,A1010';
    component.procedureCodes = 'A1001';
    component.compareToOriginal = true;
    component.procCodeEditionHandler.addStringAtPosition('X', 'A1001, A1'.length)
    expect(nativeElement.childElementCount).toBe(3);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.RETAINED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.DELETED_SEP_CLASS);
    expect(nativeElement.children[2].className).toBe(ProcCodeClassesHelper.DELETED_CODE_CLASS);
    expect(nativeElement.children[2].textContent).toBe('A1010');
  })
  it('should add before retained item', () => {
    component.originalProcedureCodes = ',';
    component.procedureCodes = ',';
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.RETAINED_SEP_CLASS);
    component.compareToOriginal = true;
    component.procCodeEditionHandler.addStringAtPosition('A', 0)
    expect(nativeElement.childElementCount).toBe(2);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.ADDED_BAD_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.RETAINED_SEP_CLASS);
    expect(nativeElement.children[0].textContent).toBe('A');
  })


  it('should change deleted item to retained', () => {
    component.originalProcedureCodes = 'A1001,';
    component.procedureCodes = 'A100,';
    component.compareToOriginal = true;
    component.procCodeEditionHandler.addStringAtPosition('1', 'A1001A100'.length)
    expect(nativeElement.childElementCount).toBe(2);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.RETAINED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.RETAINED_SEP_CLASS);
    expect(nativeElement.children[0].textContent).toBe('A1001');
  })


})
