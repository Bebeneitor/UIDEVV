import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataViewModule } from 'primeng/dataview';
import { BlockUIModule, DialogModule, FileUploadModule, PanelModule } from 'primeng/primeng';
import { Observable, of } from 'rxjs';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { ProcedureCodeDto } from 'src/app/shared/models/dto/procedure-code-dto';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { DifMarkupsEditorComponent } from '../components/dif-markups-editor/dif-markups-editor.component';
import { ProcedureCodeBoxComponent } from '../components/procedure-code-box/procedure-code-box.component';
import { ProvisionalRuleCodesComponent } from './provisional-rule-codes.component';


describe('ProvisionalRuleCodesComponent', () => {
  let component: ProvisionalRuleCodesComponent;
  let fixture: ComponentFixture<ProvisionalRuleCodesComponent>;
  let injector: TestBed;
  let ruleInfoService: RuleInfoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionalRuleCodesComponent, ProcedureCodeBoxComponent, DifMarkupsEditorComponent ],
      imports:[FormsModule, DataViewModule, FileUploadModule, DialogModule, BlockUIModule, 
        PanelModule, BrowserAnimationsModule, HttpClientTestingModule],
      providers:[RuleInfoService]
    })
    .compileComponents();
    injector = getTestBed();
    ruleInfoService = injector.get(RuleInfoService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionalRuleCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create set ruleInfo', () => {
    let procCodeDto: ProcedureCodeDto = new ProcedureCodeDto();
    procCodeDto.denyCodes = 'A1010, A1020 - A1030, A1040, A1050 - A1060';
    spyOn(ruleInfoService, "getAllRuleProcedureCodes").and.returnValue(createProcedureCodes(procCodeDto));
  
    let ruleInfo: RuleInfo = createRuleInfo();
    component.ruleInfo = ruleInfo;
    fixture.detectChanges();
    expect(ruleInfoService.getAllRuleProcedureCodes).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('should create and set ruleInfo ruleMaintenance', () => {
    let procCodeDto: ProcedureCodeDto = new ProcedureCodeDto();
    procCodeDto.denyCodes = 'A1010, A1020 - A1030, A1040, A1050 - A1060';
    let origProcCodeDto: ProcedureCodeDto = new ProcedureCodeDto();
    origProcCodeDto.denyCodes = 'A1025 - A1030, A1045, A1000';
    // one value for ruleInfo and other for parentRuleId
    spyOn(ruleInfoService, "getAllRuleProcedureCodes").and
      .returnValues(createProcedureCodes(procCodeDto), createProcedureCodes(origProcCodeDto));

    let ruleInfo: RuleInfo = createRuleInfoMaintenance();
    component.ruleInfo = ruleInfo;
    fixture.detectChanges();
    expect(ruleInfoService.getAllRuleProcedureCodes).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('should create set ruleInfo ruleMaintenance no originalProcCodes', () => {
    let procCodeDto: ProcedureCodeDto = new ProcedureCodeDto();
    procCodeDto.denyCodes = 'A1010, A1020 - A1030, A1040, A1050 - A1060';
    let origProcCodeDto: ProcedureCodeDto = new ProcedureCodeDto();
    origProcCodeDto.denyCodes = '';
    // one value for ruleInfo and other for parentRuleId
    spyOn(ruleInfoService, "getAllRuleProcedureCodes").and
      .returnValues(createProcedureCodes(procCodeDto), createProcedureCodes(origProcCodeDto));

    let ruleInfo: RuleInfo = createRuleInfoMaintenance();
    component.ruleInfo = ruleInfo;
    fixture.detectChanges();
    
    expect(ruleInfoService.getAllRuleProcedureCodes).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('should show pending Procedure codes', () => {
    let procCodeDto: ProcedureCodeDto = new ProcedureCodeDto();
    procCodeDto.pendingProcedureCodes = 'A1010, A1020 - A1030, A1040, A1050 - A1060';
    spyOn(ruleInfoService, "getAllRuleProcedureCodes").and.returnValue(createProcedureCodes(procCodeDto));
  
    let ruleInfo: RuleInfo = createRuleInfo();
    component.ruleInfo = ruleInfo;
    fixture.detectChanges();
    expect(ruleInfoService.getAllRuleProcedureCodes).toHaveBeenCalled();
    expect(component).toBeTruthy();
    expect(component.procCodeBoxes.last.procedureCodes).toBe(procCodeDto.pendingProcedureCodes);
  });

});

function createRuleInfo(): RuleInfo {
  let ruleInfo = new RuleInfo();
  ruleInfo.ruleId = 100;
  ruleInfo.ruleStatusId = {ruleStatusId: 9, ruleStatusDesc: 'Library Rule', ruleStatusDisplayName:''};
  return ruleInfo;
}

function createRuleInfoMaintenance(): RuleInfo {
  let ruleInfo = new RuleInfo();
  ruleInfo.ruleId = 100;
  ruleInfo.ruleStatusId = {ruleStatusId: 15, ruleStatusDesc: 'Pot Impacted', ruleStatusDisplayName:''};
  ruleInfo.parentRuleId = 110;
  return ruleInfo;
}


function createProcedureCodes(procCodeDto: ProcedureCodeDto): Observable<BaseResponse> {
  let baseResp: BaseResponse = {code:200, data: procCodeDto, details:'', message: ''};
  return of(baseResp);
}