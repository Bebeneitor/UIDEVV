import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { ProcedureCodeBoxComponent } from './procedure-code-box.component';
import { BlockUI, Panel } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProcedureCodeValidationDto } from 'src/app/shared/models/dto/proc-code-validation-dto';
import { ProcCodesUtils } from 'src/app/modules/rule-creation/provisional-rule/components/procedure-code-box/proc-box-helper/proc-codes-utils';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { HttpClientTestingModule, HttpTestingController, RequestMatch } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';
import { ProcCodeClassesHelper } from './proc-box-helper/proc-code-classes-helper';

describe('ProcedureCodeBoxComponent', () => {
  let component: ProcedureCodeBoxComponent;
  let fixture: ComponentFixture<ProcedureCodeBoxComponent>;
  let injector: TestBed;
  let procedureCodesService: ProcedureCodesService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedureCodeBoxComponent, BlockUI, Panel],
      imports: [BrowserAnimationsModule, HttpClientTestingModule],
      providers:[ProcedureCodesService]      
    })
    .compileComponents();
    injector = getTestBed();
    procedureCodesService = injector.get(ProcedureCodesService);
    httpMock = injector.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedureCodeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('procCodeBox not null', () => {
    expect(component.procCodeBox).toBeDefined();
  });

  it('add Initial String', () => {
    let codesStr = 'C0001, C0010, C0020 - C0030, D2010 - D2050, E1209';
    component.procedureCodes = codesStr;
    expect(component.procCodeBox.nativeElement.textContent).toBe(codesStr);
  })

  it('add Initial String - Bad format', () => {
    component.ngOnInit();
    let codesStr = '&@^@@##S C0001, C0010, C0020 - C0030, D2010 - D2050, E1209';
    component.procedureCodes = codesStr;
    expect(component.procCodeBox.nativeElement.textContent).toBe(
      '&@^@@##SC0001, C0010, C0020 - C0030, D2010 - D2050, E1209');
  })

  it('updateContents - Validation', () => {
    let codesStr = 'C0001,C0010,C0020-C0030,D2010-D2050,E1209';
    let valResult = createProcValidationDtoResult(codesStr);
    component.updateProcBoxContent(codesStr, null, valResult);
    expect(component.procCodeBox.nativeElement.textContent).toBe(codesStr);
  })

  it ('update Contents - origString - simplest added-deleted case', () => {
    let codesStr = 'A0001';
    let origStr = 'B0001';
    component.updateProcBoxContent(codesStr, origStr);
    let expected = 'B0001A0001'
    expect(component.procCodeBox.nativeElement.textContent).toBe(expected);
  })

  it ('update Contents - origString - add, retained, deleted', () => {
    let codesStr = 'A0001, B0001';
    let origStr = 'A0001, C0001';
    component.updateProcBoxContent(codesStr, origStr);
  })

  it ('update Contents - origString - add, deleted in range', () => {
    let codesStr = 'A0001-B0001';
    let origStr = 'A0001-C0001';
    let expected = 'A0001-C0001B0001';
    component.updateProcBoxContent(codesStr, origStr);
    expect(component.procCodeBox.nativeElement.textContent).toBe(expected);
  })

  it ('update Contents - origString - add, deleted in range and list', () => {
    let codesStr = 'A0002,C0005-C0010,D0001';
    let origStr = 'A0001,C0001-C0010';
    let expected = 'A0001A0002,C0001C0005-C0010,D0001';
    component.updateProcBoxContent(codesStr, origStr);
    expect(component.procCodeBox.nativeElement.textContent).toBe(expected);
  })

  it ('update Contents - updated Text', () => {
    let codesStr = 'A0002,C0005-C0010,D0001';
    let origStr = 'A0001,C0001-C0010';
    component.updateProcBoxContent(codesStr, origStr);
    let updatedText = component.calculateUpdatedText();
    expect(updatedText).toBe(codesStr);
  })

  it ('update Contents - updated Text', () => {
    let codesStr = 'A0002,C0005-C0010,D0001';
    let origStr = 'A0001,C0001-C0010';
    component.updateProcBoxContent(codesStr, origStr);
    let updatedText = component.calculateUpdatedText();
    expect(updatedText).toBe(codesStr);
  })

  it ('show many procedures codes', () => {
    let data = generateBigArrays(200, 20, 10);
    component.originalProcedureCodes = data.origin;
    component.procedureCodes = data.current;
  })
  it ('show more procedures codes', () => {
    let data = generateBigArrays(500, 100, 20);
    component.originalProcedureCodes = data.origin;
    component.procedureCodes = data.current;
  })

  it ('show call procCodeTestService - all valid', () => {
    let codeType = 'HCPCS';
    component.procedureCodes = 'A0002,C0005-C0010,D0001';
    component.procCodeType = codeType;
    component.validateProcedureCodes();
    spyOn(component.onValidationResult, 'emit');
    let req = httpMock.expectOne(`${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/${RoutingConstants.PROC_CODES_VALIDATE}/${codeType}`);
    expect(req.request.method).toBe('POST');
    req.flush(buildAllValidCodes(req.request.body));
    expect(component.valMsgClass).toBe('text-success');
    expect(component.validationMsg).toBe(' All codes are valid');
    expect(component.onValidationResult.emit).toHaveBeenCalled();
  })

  it ('should call procCodeTestService - One valid', () => {
    let codeType = 'HCPCS';
    component.procedureCodes = 'A0002,C0005, C0010,D0001';
    component.procCodeType = codeType;
    spyOn(component.onValidationResult, 'emit');
    component.validateProcedureCodes();
    let req = httpMock.expectOne(`${environment.restServiceUrl}${RoutingConstants.PROC_CODES_URL}/${RoutingConstants.PROC_CODES_VALIDATE}/${codeType}`);
    expect(req.request.method).toBe('POST');
    req.flush(buildOneInValidCodes(req.request.body));
    fixture.detectChanges();
    expect(component.valMsgClass).toBe('text-danger');
    expect(component.validationMsg.indexOf('invalid codes')).toBeGreaterThanOrEqual(0);
    expect(component.procCodeBox.nativeElement.firstChild.className).toBe(ProcCodeClassesHelper.INVALID_CODE_CLASS);
    expect(component.onValidationResult.emit).toHaveBeenCalled();
  })

  it ('Should be disabled', () => {
    let codeType = 'HCPCS';
    component.procedureCodes = 'A0002,C0005, C0010,D0001';
    component.procCodeType = codeType;
    component.readOnly = true;
    expect(component.procCodeBox.nativeElement.classList.contains('cb-disabled')).toBeTruthy();
  })

  it ('Should register in service', () => {
    let codeType = 'HCPCS';
    component.procedureCodes = 'A0002,C0005, C0010,D0001';
    component.procCodeType = codeType;
    component.readOnly = true;
    spyOn(procedureCodesService, 'registerCodeBox');
    component.ngOnInit();
    expect(procedureCodesService.registerCodeBox).toHaveBeenCalledWith(component);
  })


})

function buildOneInValidCodes(codes: string[]) {
  let data = codes.map(c => { return {codeName: c, codeDescription: `Description of code ${c}`, codeStatus:'Valid'}});
  data[0].codeStatus = Constants.CODE_INVALID_STATUS;
  return {data: data};
}

function buildAllValidCodes(codes: string[]) {
  let data = codes.map(c => { return {codeName: c, codeDescription: `Description of code ${c}`, codeStatus:'Valid'}}); 
  return {data: data};
}

function createProcValidationDtoResult(codesString: string): ProcedureCodeValidationDto[] {
  let resProc: ProcedureCodeValidationDto[] = [];
  let allProc = ProcCodesUtils.extractUniqueProcedureCodes(codesString);
  for (let i = 0; i < allProc.length; i++) {
    if (i % 3) {
      resProc.push({codeName: allProc[i], codeStatus: 'valid', codeDescription:`the ${allProc[i]} description`});
    } else {
      resProc.push({codeName: allProc[i], codeStatus: 'invalid'});
    }
  }
  return resProc;
}

function generateArr(pref: string, cnt: number): string[] {
  let ret = [];
  for (let i = 0; i < cnt; i++) {
      let entry = '0000' + i;
      ret.push(pref + entry.substr(entry.length - 4));
  }
  return ret;
}

function generateBigArrays(cnt: number, difCnt: number, difAdd: number) {
  let origin = generateArr('A', cnt);
  let current = generateArr('A', cnt);
  // some differences.
  let pref = 'B';
  let cntDif = cnt / difAdd;
  for (let j = 0; j < cntDif; j++) {
      let tmpArr = generateArr(String.fromCharCode(pref.charCodeAt(0) + j), difAdd);        
      current.splice(j * difCnt, difAdd, ...tmpArr);
  }
  return {origin: origin.join(','), current: current.join(',')};
}