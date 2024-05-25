import { TestBed } from '@angular/core/testing';

import { HidScaleService } from './hid-scale.service';

describe('HidScaleService', () => {
  let service: HidScaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HidScaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
