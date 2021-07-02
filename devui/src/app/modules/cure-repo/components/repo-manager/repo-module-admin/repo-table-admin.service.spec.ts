import { TestBed } from '@angular/core/testing';

import { RepoTableAdminService } from './repo-table-admin.service';

describe('RepoTableAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RepoTableAdminService = TestBed.get(RepoTableAdminService);
    expect(service).toBeTruthy();
  });
});
