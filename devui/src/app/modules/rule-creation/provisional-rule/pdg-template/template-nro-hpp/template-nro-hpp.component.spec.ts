import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateNroHPPComponent } from './template-nro-hpp.component';

describe('NroComponent', () => {
  let component: TemplateNroHPPComponent;
  let fixture: ComponentFixture<TemplateNroHPPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateNroHPPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateNroHPPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
