import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestedRulesComponent } from './ingested-rules.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { RuleIngestionService } from '../../services/rule-ingestion.service';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('IngestedRulesComponent', () => {
  let component: IngestedRulesComponent;
  let fixture: ComponentFixture<IngestedRulesComponent>;
  let debugElement: DebugElement;
  let ingestionRulesService: RuleIngestionService;
  let searchIngestedRulesSpy;
  const route = ({ data: of({ pageTitle: 'List of ingested rules' }) } as any);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IngestedRulesComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MultiSelectModule,
        CalendarModule,
        HttpClientTestingModule
      ],
      providers: [{ provide: ActivatedRoute, useValue: route }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestedRulesComponent);
    component = fixture.componentInstance;

    debugElement = fixture.debugElement;
    ingestionRulesService = debugElement.injector.get(RuleIngestionService);
    //searchIngestedRulesSpy = spyOn(ingestionRulesService, 'searchIngestedRules').and.callThrough();


    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should contain property called pageTitle', async(() => {
    expect(component.pageTitle).toBeTruthy('pageTitle property not defined');
  }));

  it('should PageTitle value should be List of ingested rules', async(() => {
    expect(component.pageTitle).toEqual('List of ingested rules');
  }));

  it('should render pageTitle in a h5 tag', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = debugElement.nativeElement;
      const titleElement = compiled.querySelector('h5');
      expect(titleElement.textContent).toContain('List of ingested rules');
    });
  }));

  it('should render Filter by tag label', async(() => {
    const fixture = TestBed.createComponent(IngestedRulesComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = debugElement.nativeElement;
      const filterTag = compiled.querySelector('#filterBy')
      expect(filterTag.textContent).toContain('Filter By:');
    });
  }));

  it('should render From tag label', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement;
      const fromLabel = compiled.query(By.css("label[for=rangeCalendar]"));
      expect(fromLabel.nativeElement.textContent).toBe('Implementation date range');
    });
  }));

  it('should render the line of bussines tag label', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const fromLabel = debugElement.query(By.css("label[for=lineOfBusinessSelect]"));
      expect(fromLabel.nativeElement.textContent).toBe('Line of Business');
    });
  }));

  it('should render the Category tag label', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const fromLabel = debugElement.query(By.css("label[for=categorySelect]"));
      expect(fromLabel.nativeElement.textContent).toBe('Category');
    });
  }));

  it('should render the State tag label', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const fromLabel = debugElement.query(By.css("label[for=stateSelect]"));
      expect(fromLabel.nativeElement.textContent).toBe('State');
    });
  }));

  it('should have a property called loading', async(() => {
    expect(component.loading).toBeFalsy();
  }));
/*
  it('should have a property called user', async(() => {
    //expect(component.user).toBeFalsy();
  }));
*/
  it('should have a property called activeIndex', async(() => {
    expect(component.activeIndex).toEqual(0);
  }));

  it('should have a property called selectedRuleOverlay', async(() => {
    expect(component.selectedRuleOverlay).toBeUndefined();
  }));

  it('should have a property called selectedRuleOverlay', async(() => {
    expect(component.selectedRuleOverlay).toBeUndefined();
  }));
/*
  it('should have a property called filters', async(() => {
    const testFilters = {
      range: null,
      lineOfBusiness: null,
      category: null,
      state: null,
      type: null
    };

    //expect(component.filters).toEqual(testFilters);
  }));
*/
  it('should searchIngestedRules to be called ones on init method', async(() => {
    //expect(searchIngestedRulesSpy).toHaveBeenCalled();
  }));

  it('multi select for line of business should be defined', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const select = debugElement.query(By.css('p-multiSelect[id=lineOfBusinessSelect]'));
      expect(select).toBeTruthy();
    });
  }));

  it('multi select for categories should be defined', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const select = debugElement.query(By.css('p-multiSelect[id=categorySelect]'));
      expect(select).toBeTruthy();
    });
  }));

  it('multi select for states should be defined', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const select = debugElement.query(By.css('p-multiSelect[id=stateSelect]'));
      expect(select).toBeTruthy();
    });
  }));

  it('multi select for types should be defined', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const select = debugElement.query(By.css('p-multiSelect[id=typeSelect]'));
      expect(select).toBeTruthy();
    });
  }));
});
