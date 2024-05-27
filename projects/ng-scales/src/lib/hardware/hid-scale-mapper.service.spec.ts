import { TestBed } from '@angular/core/testing';

import { HidScaleMapperService } from './hid-scale-mapper.service';

describe('HidScaleMapperService', () => {
  let service: HidScaleMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HidScaleMapperService]
    });
    service = TestBed.inject(HidScaleMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
