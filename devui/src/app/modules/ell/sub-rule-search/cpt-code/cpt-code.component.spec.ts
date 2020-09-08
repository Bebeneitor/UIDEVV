import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptCodeComponent } from './cpt-code.component';

describe('CptCodeComponent', () => {
  let component: CptCodeComponent;
  let fixture: ComponentFixture<CptCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
