import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcdComponent } from './icd.component';

describe('IcdComponent', () => {
  let component: IcdComponent;
  let fixture: ComponentFixture<IcdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
