import { TestBed } from '@angular/core/testing';

import { ImpactsService } from './impacts.service';

describe('ImpactsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImpactsService = TestBed.get(ImpactsService);
    expect(service).toBeTruthy();
  });
});
