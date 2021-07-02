import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerFavoritesComponent } from './marker-favorites.component';

describe('MarkerFavoritesComponent', () => {
  let component: MarkerFavoritesComponent;
  let fixture: ComponentFixture<MarkerFavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerFavoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
