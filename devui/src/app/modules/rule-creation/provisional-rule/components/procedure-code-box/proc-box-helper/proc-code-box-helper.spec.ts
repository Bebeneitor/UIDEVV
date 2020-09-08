import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUI, Panel } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProcedureCodeBoxComponent } from 'src/app/modules/rule-creation/provisional-rule/components/procedure-code-box/procedure-code-box.component';
import { ProcCodeBoxHelper } from './proc-code-box-helper';
import { ProcCodeClassesHelper } from './proc-code-classes-helper';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { HttpClientModule } from '@angular/common/http';

describe('ProcCodeBoxHelper', () => {
  let component: ProcedureCodeBoxComponent;
  let fixture: ComponentFixture<ProcedureCodeBoxComponent>;
  let nativeElement: Element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedureCodeBoxComponent, BlockUI, Panel],
      imports: [BrowserAnimationsModule, HttpClientModule],
      providers: [ProcedureCodesService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedureCodeBoxComponent);
    component = fixture.componentInstance;
    component.procCodeType = 'HCPCS';
    nativeElement = component.procCodeBox.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getNodeAtTextPosition - Ok', () => {
    let codesStr = 'C0001, C0010, C0020 - C0030, D2010 - D2050, E1209';
    component.procedureCodes = codesStr;
    let node = ProcCodeBoxHelper.getElementAtTextPosition(nativeElement, 10);
    expect(node).toBeDefined();
    expect(node.className.toLowerCase() === 'span');
    expect(node.firstChild.nodeValue).toBe('C0010');
  })

  it('getNodeAtTextPosition - grater than length', () => {
    let codesStr = 'C0001, C0010, C0020 - C0030, D2010 - D2050, E1209';
    component.procedureCodes = codesStr;
    let node = ProcCodeBoxHelper.getElementAtTextPosition(nativeElement, codesStr.length + 2);
    expect(node).toBeDefined();
    expect(node.firstChild.nodeValue).toBe('E1209');
  })

  it('getNodeAtTextPosition - at initial node', () => {
    let codesStr = 'C0001, C0010, C0020 - C0030, D2010 - D2050, E1209';
    component.procedureCodes = codesStr;
    let node = ProcCodeBoxHelper.getElementAtTextPosition(nativeElement, 'C0001, '.length);
    expect(node).toBeDefined();
    expect(node.firstChild.nodeValue).toBe('C0010');
  })

  it ('delete Node From Parent', () => {
    let codesStr = 'C0001, C0010, C0020';
    component.procedureCodes = codesStr;
    let chldCnt = nativeElement.childElementCount;
    let node = ProcCodeBoxHelper.getElementAtTextPosition(nativeElement, 'C0001, C0'.length);
    expect(node).toBeDefined();
    ProcCodeBoxHelper.removeNodeFromParent(nativeElement, node);
    expect(nativeElement.childElementCount).toBe(chldCnt - 1);
  })

  it('getStringLengthBeforeElement - ok', () => {
    let codesStr = 'C0001, C0010, C0020';
    component.procedureCodes = codesStr;
    let node = ProcCodeBoxHelper.getElementAtTextPosition(nativeElement, 'C0001, C0'.length);
    let lng = ProcCodeBoxHelper.getStringLengthBeforeElement(nativeElement, node);
    expect(lng).toBe('C0001, '.length);
  })

  it('getStringLengthBeforeElement - initialNode', () => {
    let codesStr = 'C0001, C0010, C0020';
    component.procedureCodes = codesStr;
    let node = ProcCodeBoxHelper.getElementAtTextPosition(nativeElement, 2);
    let lng = ProcCodeBoxHelper.getStringLengthBeforeElement(nativeElement, node);
    expect(lng).toBe(0);
  })

  it('append element childe', () => {
      component.ngOnInit();
      let procBoxHelper = component.procCodeBoxHelper;
      let codeVal = 'newCodeToAdd';
      procBoxHelper.appendChildForCodeItem(codeVal);
      expect(nativeElement.childElementCount).toBe(1);
      expect(nativeElement.firstElementChild.firstChild).toBeDefined();
      expect(nativeElement.firstElementChild.firstChild.nodeValue).toBe('newCodeToAdd');
  })

  it ('Delete node -non static - 3 nodes', () => {
    component.procedureCodes = 'C0001, C0010, C0020';
    component.ngOnInit();
    let procBoxHelper = component.procCodeBoxHelper;
    procBoxHelper.removeChildElement(component.procCodeBox.nativeElement.children[3]);
    expect(nativeElement.childElementCount).toBe(4);
  })

  it ('Delete node between 2 nodes', () => {
    component.procedureCodes = 'C0001, C0010, C0020';
    component.ngOnInit();
    let procBoxHelper = component.procCodeBoxHelper;
    procBoxHelper.removeChildBetweenTwoElements(nativeElement.children[0],
      nativeElement.children[4]);
    expect(nativeElement.childElementCount).toBe(2);
  })

  it ('Delete node content - aded node', () => {
    component.procedureCodes = 'C0001,C0030'
    component.ngOnInit();
    let procBoxHelper = component.procCodeBoxHelper;
    procBoxHelper.deleteChildContent(nativeElement.children[0]);
    expect(nativeElement.childElementCount).toBe(2);
  })

  it ('Delete node content - retained node', () => {
    component.originalProcedureCodes = 'C0001,C0030'
    component.procedureCodes = 'C0001,C0010,C0020';
    component.ngOnInit();
    let procBoxHelper = component.procCodeBoxHelper;
    procBoxHelper.deleteChildContent(nativeElement.children[0]);
    expect(ProcCodeClassesHelper.isElementCodeDeleted(nativeElement.children[0]));
  })

  it('inserted bad code', () => {
    component.procedureCodes = 'A12345';
    component.compareToOriginal = true;
    component.ngOnInit();
    expect(nativeElement.childElementCount).toBe(1);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.ADDED_BAD_CODE_CLASS);
  })  

  it('retained bad code', () => {
    component.originalProcedureCodes = 'A12345';
    component.procedureCodes = 'A12345';
    component.compareToOriginal = true;
    component.ngOnInit();
    expect(nativeElement.childElementCount).toBe(1);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.RETAINED_BAD_CODE_CLASS);
  })  

  it('deleted code', () => {
    component.originalProcedureCodes = 'A1234-A1010';
    component.procedureCodes = 'A1001-A1010';
    component.compareToOriginal = true;
    component.ngOnInit();
    expect(nativeElement.childElementCount).toBe(4);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.DELETED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.ADDED_CODE_CLASS);
    expect(nativeElement.children[2].className).toBe(ProcCodeClassesHelper.RETAINED_SEP_CLASS);
    expect(nativeElement.children[3].className).toBe(ProcCodeClassesHelper.RETAINED_CODE_CLASS);
  })  
 
  it('inserted code and separator', () => {
    component.procedureCodes = 'A1234, ';
    component.compareToOriginal = true;
    component.ngOnInit();
    expect(nativeElement.childElementCount).toBe(2);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.ADDED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.ADDED_SEP_CLASS);
  })  

  it('inserted change separator comma by dash', () => {
    component.originalProcedureCodes = 'A1001,A1010'
    component.procedureCodes = 'A1001-A1010';
    component.compareToOriginal = true;
    component.ngOnInit();
    expect(nativeElement.childElementCount).toBe(4);
    expect(nativeElement.children[0].className).toBe(ProcCodeClassesHelper.RETAINED_CODE_CLASS);
    expect(nativeElement.children[1].className).toBe(ProcCodeClassesHelper.DELETED_SEP_CLASS);
    expect(nativeElement.children[2].className).toBe(ProcCodeClassesHelper.ADDED_SEP_CLASS);
    expect(nativeElement.children[3].className).toBe(ProcCodeClassesHelper.RETAINED_CODE_CLASS);
  })  

})
