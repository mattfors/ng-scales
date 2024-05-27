import { TestBed } from '@angular/core/testing';

import { HidScaleService } from './hid-scale.service';
import { HidScaleMapperService } from './hid-scale-mapper.service';

describe('HidScaleService', () => {
  let service: HidScaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HidScaleService, HidScaleMapperService]
    });
    service = TestBed.inject(HidScaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
