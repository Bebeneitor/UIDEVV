import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedRulesComponent } from './updated-rules.component';

describe('UpdatedRulesComponent', () => {
  let component: UpdatedRulesComponent;
  let fixture: ComponentFixture<UpdatedRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatedRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
