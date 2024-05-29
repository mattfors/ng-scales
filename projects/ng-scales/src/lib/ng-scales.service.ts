import { Inject, Injectable } from '@angular/core';
import {
  HARDWARE_SCALE_INTERFACE,
  HardwareScaleInterface,
  HardwareScaleReportEvent,
} from './hardware/hardware-scale.interface';
import { BehaviorSubject, debounceTime, Observable, tap } from 'rxjs';

@Injectable()
export class NgScalesService {
  private _reading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _zeroed: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _supported: BehaviorSubject<boolean> = new BehaviorSubject(false);

  readonly reading: Observable<boolean> = this._reading.asObservable();
  readonly zeroed: Observable<boolean> = this._zeroed.asObservable();
  readonly supported: Observable<boolean> = this._supported.asObservable();
  readonly connected: Observable<boolean> = this.scale.connected;

  close = () => this.scale.close();
  open = () => this.scale.open();

  constructor(
    @Inject(HARDWARE_SCALE_INTERFACE) private scale: HardwareScaleInterface,
  ) {
    this._supported.next(this.scale.supported);
  }

  reportEvent(dueTime: number = 300): Observable<HardwareScaleReportEvent> {
    return this.scale.reportEvent().pipe(
      tap(() => this._reading.next(true)),
      debounceTime(dueTime),
      tap((e: HardwareScaleReportEvent) => {
        this._reading.next(false);
        this._zeroed.next(e.weight === 0);
      }),
    );
  }
}
