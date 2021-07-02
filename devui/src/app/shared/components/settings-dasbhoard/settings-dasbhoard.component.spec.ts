import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDasbhoardComponent } from './settings-dasbhoard.component';

describe('SettingsDasbhoardComponent', () => {
  let component: SettingsDasbhoardComponent;
  let fixture: ComponentFixture<SettingsDasbhoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsDasbhoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDasbhoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
