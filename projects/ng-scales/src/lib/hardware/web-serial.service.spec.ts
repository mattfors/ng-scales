import { TestBed } from '@angular/core/testing';

import { WebSerialService } from './web-serial.service';

describe('WebSerialService', () => {
  let service: WebSerialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSerialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
