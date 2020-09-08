import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RuleApplicationComponent } from './rule-application.component';
import { By } from '@angular/platform-browser';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('RuleApplicationComponent', () => {
  let component: RuleApplicationComponent;
  let fixture: ComponentFixture<RuleApplicationComponent>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleApplicationComponent ],
      imports: [TableModule, TabViewModule,RouterTestingModule.withRoutes([]),HttpClientTestingModule, DynamicDialogModule, BrowserDynamicTestingModule],
      providers: [DynamicDialogConfig, DynamicDialogRef]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a message if the current rule is not applicable to any rule engine', () =>{
    let el = fixture.debugElement.query(By.css('.notApplicable'));
    let spanEl = el.nativeElement;
    if(component.icmsApplications.length < 1){
    expect(spanEl.innerHTML).toContain('This rule has not been applied yet to any rule engine');
    }
  });
  it('should display a message if the current rule is not applicable to any rule engine', () =>{
    let el = fixture.debugElement.query(By.css('.notApplicable'));
    let spanEl = el.nativeElement;
    if(component.cvpApplications.length < 1){
    expect(spanEl.innerHTML).toContain('This rule has not been applied yet to any rule engine');
    }
  });
  it('should display a message if the current rule is not applicable to any rule engine', () =>{
    let el = fixture.debugElement.query(By.css('.notApplicable'));
    let spanEl = el.nativeElement;
    if(component.rcaApplications.length < 1){
    expect(spanEl.innerHTML).toContain('This rule has not been applied yet to any rule engine');
    }
  });
  it('should display a message if the current rule is not applicable to any rule engine', () =>{
    let el = fixture.debugElement.query(By.css('.notApplicable'));
    let spanEl = el.nativeElement;
    if(component.rpeApplications.length < 1){
    expect(spanEl.innerHTML).toContain('This rule has not been applied yet to any rule engine');
    }
  });
  it('should display a message if the current rule is not applicable to any rule engine', () =>{
    let el = fixture.debugElement.query(By.css('.notApplicable'));
    let spanEl = el.nativeElement;
    if(component.ccvApplications.length < 1){
    expect(spanEl.innerHTML).toContain('This rule has not been applied yet to any rule engine');
    }
  });
});
