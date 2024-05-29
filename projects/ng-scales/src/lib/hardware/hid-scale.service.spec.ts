import { TestBed } from '@angular/core/testing';

import { HidScaleService } from './hid-scale.service';
import { HidScaleMapperService } from './hid-scale-mapper.service';
import { NavigatorService } from './navigator.service';
import { of } from 'rxjs';
import { provideNgScalesForTest } from './mock-scale.service';

describe('HidScaleService', () => {
  let service: HidScaleService;
  let navigatorService: NavigatorService;

  let mockHIDDevice: jasmine.SpyObj<HIDDevice>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HidScaleService,
        HidScaleMapperService,
        provideNgScalesForTest()
      ]
    });
    service = TestBed.inject(HidScaleService);
    navigatorService = TestBed.inject(NavigatorService);

    spyOn(navigatorService, 'addHidEventListener').and.returnValue(of());

    mockHIDDevice = jasmine.createSpyObj('HIDDevice', [
      'open', 'close', 'addEventListener', 'removeEventListener'
    ]);
    mockHIDDevice.open.and.returnValue(Promise.resolve());
    mockHIDDevice.close.and.returnValue(Promise.resolve());

    spyOn(navigatorService, 'requestDevices').and.returnValue(of([mockHIDDevice] as HIDDevice[]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open device and add listeners', (done: DoneFn) => {
    service.open().subscribe(() => {
      service.connected.subscribe(c => {
        expect(c).toBeTrue();
        service.open().subscribe();
        expect(mockHIDDevice.open).toHaveBeenCalled();
        expect(mockHIDDevice.addEventListener).toHaveBeenCalledTimes(1);
        expect(mockHIDDevice.addEventListener).toHaveBeenCalledWith('inputreport', jasmine.any(Function), undefined);

        expect(navigatorService.addHidEventListener).toHaveBeenCalledTimes(1);
        expect(navigatorService.addHidEventListener).toHaveBeenCalledWith('disconnect');
        done();
      });
    })
  });

  it('should close device and remove listeners', (done: DoneFn) => {
    service.open().subscribe(() => {
      service.close().subscribe(() => {
        service.connected.subscribe(c => {
          expect(mockHIDDevice.close).toHaveBeenCalled();
          expect(c).toBeFalse();
          done();
        })
      })
    });

  });

});
