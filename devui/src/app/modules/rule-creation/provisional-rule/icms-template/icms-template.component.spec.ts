import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcmsTemplateComponent } from './icms-template.component';

describe('IcmsTemplateComponent', () => {
  let component: IcmsTemplateComponent;
  let fixture: ComponentFixture<IcmsTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcmsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcmsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
