import { TestBed } from '@angular/core/testing';

import { RuleIngestionService } from './rule-ingestion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('RuleIngestionService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should get profile data of user', () => {
    const approvedResponseSpected = { "code": 200, "message": "Approved successfully" };
    const ruleIngestionService = TestBed.get(RuleIngestionService);
    const http = TestBed.get(HttpTestingController);
    let approveResponse;
    const rules = [
      {
        "ruleId": 11556.4,
        "category": "Anesthesia Policy",
        "lobs": "Medicare",
        "source": "ICMS",
        "jurisdictions": null,
        "states": "GA",
        "ruleDescription": "Description 1"
      },
      {
        "ruleId": 11556.5,
        "category": "Anesthesia Policy",
        "lobs": "Medicare",
        "source": "ICMS",
        "jurisdictions": null,
        "states": "GA",
        "ruleDescription": "Description 2"
      },
      {
        "ruleId": 11556.6,
        "category": "Anesthesia Policy",
        "lobs": "Medicare",
        "source": "ICMS",
        "jurisdictions": null,
        "states": "GA",
        "ruleDescription": "Description 3"
      },
      {
        "ruleId": 11556.7,
        "category": "Anesthesia Policy",
        "lobs": "Medicare",
        "source": "ICMS",
        "jurisdictions": null,
        "states": "GA",
        "ruleDescription": "Description 4"
      }
    ];

    ruleIngestionService.saveRules(rules).subscribe((response) => {
      approveResponse = response;
    });

    http.expectOne('http://localhost:8080/rule-ingestion/approve').flush(approvedResponseSpected);
    expect(approveResponse).toEqual(approvedResponseSpected);
  });

  it('should be created', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service).toBeTruthy();
  });

  it('Should have a property invalidFileTypeMessageSummary', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.invalidFileTypeMessageSummary).toBeDefined();
  });

  it('Should property invalidFileTypeMessageSummary content to be File does not contain the required format, please verify and try again', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.invalidFileTypeMessageSummary).toBe('File does not contain the required format, please verify and try again');
  });

  it('Should have a property fileTypeMessageDetail', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.fileTypeMessageDetail).toBeDefined();
  });

  it('Should property fileTypeMessageDetail empty content', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.fileTypeMessageDetail).toBe('');
  });

  it('Should property colsWithOnlyInputs to be defined', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.colsWithOnlyInputs).toBeDefined();
  });

  it(`Should property colsWithOnlyInputs to be ['ruleId', 'ruleDescription', 'source']`, () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    const colsInputs = ['ruleId', 'ruleDescription', 'source'];

    expect(service.colsWithOnlyInputs).toEqual(colsInputs);
  });

  it('Should property lobs to be defined', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.lobs).toBeDefined();
  });

  it(`Should property lobs to be [{ label: "ALL", value: null }]`, () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    const colsInputs = [{ label: "ALL", value: null }];

    expect(service.lobs).toEqual(colsInputs);
  });

  it('Should property categories to be defined', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.categories).toBeDefined();
  });

  it(`Should property categories to be [{ label: "ALL", value: null }]`, () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    const colsInputs = [{ label: "ALL", value: null }];

    expect(service.categories).toEqual(colsInputs);
  });

  it('Should property states to be defined', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.states).toBeDefined();
  });

  it(`Should property states to be [{ label: "ALL", value: null }]`, () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    const colsInputs = [{ label: "ALL", value: null }];

    expect(service.states).toEqual(colsInputs);
  });


  it('Should property comments to be defined', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.comments).toBeDefined();
  });

  it(`Should property comments to be [{ label: "Select Comment", value: null }]`, () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    const colsInputs = [{ label: "Select Comment", value: null }];

    expect(service.comments).toEqual(colsInputs);
  });

  it('Should property users to be defined', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.users).toBeDefined();
  });

  it(`Should property users to be [{ label: "Search for User", value: null }]`, () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    const colsInputs = [{ label: "Search for User", value: null }];

    expect(service.users).toEqual(colsInputs);
  });

  it('Should property jurisdictions to be defined', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.jurisdictions).toBeDefined();
  });

  it(`Should property jurisdictions to be [{ label: "ALL", value: null }]`, () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    const colsInputs = [{ label: "ALL", value: null }];

    expect(service.jurisdictions).toEqual(colsInputs);
  });

  it('Should property cols to be defined', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.cols).toBeDefined();
  });

  it(`Should property cols to be [
    { field: 'ruleId', header: 'Rule ID', width: '8%' },
    { field: 'category', header: 'Category', width: '25%' },
    { field: 'lob', header: 'Line of Business', width: '11%' },
    { field: 'source', header: 'Source', width: '6%' },
    { field: 'jurisdiction', header: 'Jurisdiction', width: '8%' },
    { field: 'ruleDescription', header: 'Rule Description', width: '8%' }
  ]`, () => {
      const service: RuleIngestionService = TestBed.get(RuleIngestionService);
      const cols = [
        { field: 'ruleId', header: 'Rule ID', width: '8%' },
        { field: 'category', header: 'Category', width: '25%' },
        { field: 'lob', header: 'Line of Business', width: '11%' },
        { field: 'source', header: 'Source', width: '6%' },
        { field: 'jurisdiction', header: 'Jurisdiction', width: '8%' },
        { field: 'ruleDescription', header: 'Rule Description', width: '8%' }
      ];

      expect(service.cols).toEqual(cols);
    });


  it('Should property stepsItems to be defined', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.stepsItems).toBeDefined();
  });

  it(`Should property stepsItems to be stepsItems = [
      { label: 'Select Rules' },
      { label: 'Approve Rules' }
    ]`, () => {
      const service: RuleIngestionService = TestBed.get(RuleIngestionService);
      const stepsItems = [
        { label: 'Select Rules' },
        { label: 'Approve Rules' }
      ];

      expect(service.stepsItems).toEqual(stepsItems);
    });

  it('Should property stepsItems to be defined', () => {
    const service: RuleIngestionService = TestBed.get(RuleIngestionService);
    expect(service.stepsItems).toBeDefined();
  });
});
