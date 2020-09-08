import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryUpdateHistoryComponent } from './industry-update-history.component';

describe('IndustryUpdateHistoryComponent', () => {
  let component: IndustryUpdateHistoryComponent;
  let fixture: ComponentFixture<IndustryUpdateHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryUpdateHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryUpdateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
