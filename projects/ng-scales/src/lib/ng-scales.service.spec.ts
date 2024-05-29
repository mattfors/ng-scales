import { TestBed } from '@angular/core/testing';

import { NgScalesService } from './ng-scales.service';
import { provideNgScalesForTest } from './hardware/mock-scale.service';

describe('NgScalesService', () => {
  let service: NgScalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNgScalesForTest()],
    });
    service = TestBed.inject(NgScalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
