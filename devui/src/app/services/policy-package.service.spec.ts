import { TestBed } from '@angular/core/testing';

import { PolicyPackageService } from './policy-package.service';

describe('PolicyPackageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolicyPackageService = TestBed.get(PolicyPackageService);
    expect(service).toBeTruthy();
  });
});
