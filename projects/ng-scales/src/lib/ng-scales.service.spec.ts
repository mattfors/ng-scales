import { TestBed } from '@angular/core/testing';

import { NgScalesService } from './ng-scales.service';

describe('NgScalesService', () => {
  let service: NgScalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgScalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
