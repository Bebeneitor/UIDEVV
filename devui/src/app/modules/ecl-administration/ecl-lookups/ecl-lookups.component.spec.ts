import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EclLookupsComponent } from './ecl-lookups.component';

describe('EclLookupsComponent', () => {
  let component: EclLookupsComponent;
  let fixture: ComponentFixture<EclLookupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EclLookupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EclLookupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
