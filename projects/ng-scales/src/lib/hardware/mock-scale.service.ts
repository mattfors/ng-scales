import { Injectable, Provider } from '@angular/core';
import {
  HARDWARE_SCALE_INTERFACE,
  HardwareScaleInterface,
  HardwareScaleReportEvent,
} from './hardware-scale.interface';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { NgScalesService } from '../ng-scales.service';
import {
  HID_SCALE_MAPPERS,
  HidScaleMapperService,
} from './hid-scale-mapper.service';
import { SUPPORTED_SCALES } from './hid-scale-mapper-config';

@Injectable()
export class MockScaleService implements HardwareScaleInterface {
  _connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  _report: Subject<HardwareScaleReportEvent> =
    new Subject<HardwareScaleReportEvent>();

  connected: Observable<boolean> = this._connected.asObservable();
  supported: boolean = true;

  close = () => {
    this._connected.next(false);
    return of(undefined);
  };
  open = () => {
    this._connected.next(true);
    return of(undefined);
  };

  reportEvent = () => this._report.asObservable();

  setWeight(weight: number): void {
    this._report.next({ weight });
  }
}

export function provideNgScalesForTest(): Provider[] {
  return [
    NgScalesService,
    HidScaleMapperService,
    MockScaleService,
    {
      provide: HARDWARE_SCALE_INTERFACE,
      useClass: MockScaleService,
    },
    {
      provide: HID_SCALE_MAPPERS,
      useValue: SUPPORTED_SCALES,
    },
  ];
}
