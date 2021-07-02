import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { BlockUIModule, CalendarModule, DialogService, MessageService, MultiSelectModule, OverlayPanelModule, TabViewModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RuleIngestionService } from '../../services/rule-ingestion.service';
import { IngestedRulesComponent } from './ingested-rules.component';
import { cols, cvRuleValues, user, allowedExtensions, colsWithOnlyInputs } from './test-data';
import { By } from '@angular/platform-browser';

describe('IngestedRulesComponent', () => {
  let component: IngestedRulesComponent;
  let fixture: ComponentFixture<IngestedRulesComponent>;
  let el: DebugElement;
  let ingestionRulesService: any;
  let authService: any;
  let permissionsService: any;
  let activatedRoute: ActivatedRoute;
  const route = ({ data: of({ pageTitle: 'List of ingested rules' }), queryParams: of({ tab: 'ICMS' }) } as any);


  beforeEach(async(() => {
    const ingestionRulesServiceSpy = jasmine.createSpyObj('RuleIngestionService', ['uploadFile', 'saveRules']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getLoggedUser', 'login']);
    const permissionsServiceSpy = jasmine.createSpyObj('NgxPermissionsService', ['getPermission']);

    TestBed.configureTestingModule({
      declarations: [IngestedRulesComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MultiSelectModule,
        CalendarModule,
        HttpClientTestingModule,
        BlockUIModule, TabViewModule,
        EclTableModule,
        SharedModule,
        ToastModule,
        OverlayPanelModule,
        RouterTestingModule.withRoutes([]),
        NgxPermissionsModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useValue: route }, MessageService, DialogService, { provide: AuthService, useValue: authServiceSpy }, { provide: RuleIngestionService, useValue: ingestionRulesServiceSpy }, { provide: ActivatedRoute, useValue: route },
      { provide: NgxPermissionsService, useValue: permissionsServiceSpy }
      ]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(IngestedRulesComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;

        ingestionRulesService = TestBed.get(RuleIngestionService);
        ingestionRulesService.cols = cols;
        ingestionRulesService.colsWithOnlyInputs = colsWithOnlyInputs;

        authService = TestBed.get(AuthService);
        authService.getLoggedUser.and.returnValue(user);

        activatedRoute = TestBed.get(ActivatedRoute);

        permissionsService = TestBed.get(NgxPermissionsService);

        fixture.detectChanges();
      });
  }));

  it('should create Ingested rules component ', () => {
    expect(component).toBeTruthy('Component has not been created');
  });

  it('should have userRoles property and it should have atleast 1 role', () => {
    expect(component.userRoles).toBeTruthy('userRoles has not been initialize');
    expect(component.userRoles.length).toBeGreaterThan(0, 'userRoles empty');
  });

  it('userHasCvpRole should be defined', () => {
    expect(component.userHasCvpRole).toBeTruthy('userHasCvpRole has not been initialize');
  });

  it('indexTab should be 1', () => {
    activatedRoute.queryParams = of({ tab: 'CVP' });
    activatedRoute = TestBed.get(ActivatedRoute);
    fixture = TestBed.createComponent(IngestedRulesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.activeTab).toBe(1, 'userHasCvpRole has not been initialize');
  });

  it('cvpUserRoleOnly should be false', async(() => {
    permissionsService.getPermission.and.returnValue = { name: 'ROLE_CCA', validationFunction: null };

    expect(component.cvpUserRoleOnly).toBeFalsy('cvpUserRoleOnly should be false');
  }));

  it('cvpUserRoleOnly should be null, yes and no', async(() => {
    const ruleValues = cvRuleValues;
    expect(component.cvRuleValues).toEqual(ruleValues, 'ruleValues values not correct');
  }));

  it('table configuration should be declared', async(() => {
    expect(component.tableConfig).toBeTruthy('Main table configuration should be declared.');
  }));

  it('CVPtable configuration should be declared', async(() => {
    expect(component.cvpTableConfig).toBeTruthy('CVP table configuration should be declared.');
  }));

  it('should contain property called pageTitle', async(() => {
    expect(component.pageTitle).toBeTruthy('pageTitle property not defined');
  }));

  it('CPE table configuration should be defined', () => {
    expect(component.cpeTableConfig).toBeTruthy('cpeTableConfig is undefined');
  });

  it('should PageTitle value should be List of ingested rules', async(() => {
    expect(component.pageTitle).toEqual('List of ingested rules');
  }));

  it('should fileUpladerOptions should be defined and have a value', async(() => {
    expect(component.fileUpladerOptions).toBeTruthy();
    expect(component.fileUpladerOptions.allowExtensions).toEqual(allowedExtensions);
  }));

  it('should remove decimal value', () => {
    let noDecimal = component.removeDecimalPart('0.0');
    expect(noDecimal).toBe('0');

    noDecimal = component.removeDecimalPart('1');
    expect(noDecimal).toBe('1');
  });

  it('should remove decimal value with no decimal', () => {
    let noDecimal = component.removeDecimalPart('1');
    expect(noDecimal).toBe('1');
  });

  it('colShouldHaveInpControl() should return false', () => {
    let columnNoInput = component.colShouldHaveInpControl({ field: 'dummyColumn' });
    expect(columnNoInput).toBeFalsy();
  });

  it('colShouldHaveInpControl() should return true', () => {
    let columnNoInput = component.colShouldHaveInpControl({ field: 'ruleCode' });
    expect(columnNoInput).toBeTruthy();
  });

  it('should render pageTitle in a h5 tag', async(() => {
    const compiled = el.nativeElement;
    const titleElement = compiled.querySelector('h5');
    expect(titleElement.textContent).toContain('List of ingested rules');
  }));

  it('should have a property called loading', async(() => {
    expect(component.loading).toBeFalsy();
  }));

  it('should have a property called activeIndex', async(() => {
    expect(component.activeIndex).toEqual(0);
  }));

  it('should have a property called selectedRuleOverlay', async(() => {
    expect(component.selectedRuleOverlay).toBeUndefined();
  }));

  it('should getLoggedUserId() to be called ones on init method', async(() => {
    expect(authService.getLoggedUser).toHaveBeenCalled();
  }));

  it('Should have 3 tabs', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const tabs: DebugElement[] = el.queryAll(By.css('.ui-tabview-title'));
      expect(tabs).toBeTruthy();

      expect(tabs.length).toBe(3);
    });
  }));

  it('tab 2 title should be CVP', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const tabs: DebugElement[] = el.queryAll(By.css('.ui-tabview-title'));
      const icmsTab = tabs[1];

      expect(icmsTab.nativeElement.innerHTML).toBe('CVP');
    });
  }));

  it('tab 3 title should be CPE', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const tabs: DebugElement[] = el.queryAll(By.css('.ui-tabview-title'));
      const icmsTab = tabs[2];

      expect(icmsTab.nativeElement.innerHTML).toBe('CPE');
    });
  }));

  it('tab 1 title should be ICMS', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const tabs: DebugElement[] = el.queryAll(By.css('.ui-tabview-title'));
      const icmsTab = tabs[0];

      expect(icmsTab.nativeElement.innerHTML).toBe('ICMS');
    });
  }));
});