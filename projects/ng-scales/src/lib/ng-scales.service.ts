import { Injectable } from '@angular/core';
import { HardwareScaleInterface, HardwareScaleReportEvent } from './hardware/hardware-scale.interface';
import { BehaviorSubject, debounceTime, Observable, tap } from 'rxjs';
import { HidScaleService } from './hardware/hid-scale.service';

@Injectable({
  providedIn: 'root'
})
export class NgScalesService implements HardwareScaleInterface{

  private _reading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _zeroed: BehaviorSubject<boolean> = new BehaviorSubject(false);

  readonly reading: Observable<boolean> = this._reading.asObservable();
  readonly zeroed: Observable<boolean> = this._zeroed.asObservable();
  readonly connected: Observable<boolean> = this.scale.connected;
  readonly supported: boolean = this.scale.supported;

  close = () => this.scale.close();
  open = () => this.scale.open();

  constructor(private scale: HidScaleService) {
  }

  reportEvent(dueTime: number = 300): Observable<HardwareScaleReportEvent> {
    return this.scale.reportEvent().pipe(
      tap(() => this._reading.next(true)),
      debounceTime(dueTime),
      tap((e: HardwareScaleReportEvent) => {
        this._reading.next(false)
        this._zeroed.next(e.weight === 0);
      })
    )
  }
}
