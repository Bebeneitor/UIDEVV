import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSourcesComponent } from './change-sources.component';

describe('ChangeSourcesComponent', () => {
  let component: ChangeSourcesComponent;
  let fixture: ComponentFixture<ChangeSourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeSourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
