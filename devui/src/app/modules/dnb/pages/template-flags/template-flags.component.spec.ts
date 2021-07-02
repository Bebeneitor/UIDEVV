import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateFlagsComponent } from './template-flags.component';

describe('TemplateFlagsComponent', () => {
  let component: TemplateFlagsComponent;
  let fixture: ComponentFixture<TemplateFlagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateFlagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
