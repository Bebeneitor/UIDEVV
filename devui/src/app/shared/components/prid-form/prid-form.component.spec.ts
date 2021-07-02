import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PridFormComponent } from './prid-form.component';

describe('PridFormComponent', () => {
  let component: PridFormComponent;
  let fixture: ComponentFixture<PridFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PridFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PridFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
