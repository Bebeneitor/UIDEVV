import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcdCodeComponent } from './icd-code.component';

describe('IcdCodeComponent', () => {
  let component: IcdCodeComponent;
  let fixture: ComponentFixture<IcdCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcdCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcdCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
