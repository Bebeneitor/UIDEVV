import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerCatalogComponent } from './payer-catalog.component';

describe('PayerCatalogComponent', () => {
  let component: PayerCatalogComponent;
  let fixture: ComponentFixture<PayerCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayerCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
