import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodIdeasComponent } from './good-ideas.component';

describe('GoodIdeasComponent', () => {
  let component: GoodIdeasComponent;
  let fixture: ComponentFixture<GoodIdeasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodIdeasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodIdeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
