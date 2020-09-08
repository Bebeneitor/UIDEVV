import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcaPoSetupComponent } from './cca-po-setup.component';

describe('CcaPoSetupComponent', () => {
  let component: CcaPoSetupComponent;
  let fixture: ComponentFixture<CcaPoSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcaPoSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcaPoSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
