import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ResearchRequestService } from 'src/app/services/research-request.service';

import { ResearchRequestSearchComponent } from './research-request-search.component';

describe('ResearchRequestSearchComponent', () => {
  let component: ResearchRequestSearchComponent;
  let fixture: ComponentFixture<ResearchRequestSearchComponent>;
  let rrService: ResearchRequestService;
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestSearchComponent ],
      providers: [ ResearchRequestService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestSearchComponent);
    component = fixture.componentInstance;

    rrService = fixture.debugElement.injector.get(ResearchRequestService);
    
    spy = spyOn(rrService, 'getResearchRequestClients').and.returnValue(of([ {label: 'jeff', value: 0}, {label: 'jason', value: 1}]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searchText is not a null', () => {
    expect(component.searchText).toBe('');
  });

  it('client list should only get called once and update view', () => {
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.all().length).toEqual(2);
  })



});
