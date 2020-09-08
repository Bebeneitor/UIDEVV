import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnDialogComponent } from './return-dialog.component';

describe('ReturnDialogComponent', () => {
  let component: ReturnDialogComponent;
  let fixture: ComponentFixture<ReturnDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
