import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasGeneratedComponent } from './ideas-generated.component';

describe('IdeasGeneratedComponent', () => {
  let component: IdeasGeneratedComponent;
  let fixture: ComponentFixture<IdeasGeneratedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeasGeneratedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeasGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
