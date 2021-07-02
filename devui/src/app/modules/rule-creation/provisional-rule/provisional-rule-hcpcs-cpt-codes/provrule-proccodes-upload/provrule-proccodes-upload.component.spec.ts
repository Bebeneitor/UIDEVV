import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProccodesUploadComponent } from './provrule-proccodes-upload.component';

describe('ProccodesUploadComponent', () => {
  let component: ProccodesUploadComponent;
  let fixture: ComponentFixture<ProccodesUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProccodesUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProccodesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
