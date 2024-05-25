import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilKeyChanged,
  filter,
  from,
  fromEvent,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  Subscription,
  tap
} from 'rxjs';
import { HardwareScaleInterface, HardwareScaleReportEvent } from './hardware-scale.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { SUPPORTED_SCALES } from './hid-scale.constants';
import { equalsHIDDevice, getHIDDataMapper } from './hid-scale.utils';


export type HidDataMapper = (arrayBuffer: ArrayBuffer) => HardwareScaleReportEvent;

@Injectable({
  providedIn: 'root'
})
export class HidScaleService implements HardwareScaleInterface {

  private s: Subject<HardwareScaleReportEvent> = new Subject<HardwareScaleReportEvent>()
  private c: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private hidDevice!: HIDDevice;
  private subscriptions: Subscription = new Subscription();

  reportEvent = () => this.s.asObservable();
  readonly connected = this.c.asObservable();
  readonly supported: boolean = ('hid' in navigator);

  open(): Observable<void> {
    if (!this.supported || this.c.value) {
      return of();
    }
    return from(navigator.hid.requestDevice({filters: SUPPORTED_SCALES}))
      .pipe(
        filter(devices => devices.length > 0),
        map(devices => devices[0])
      ).pipe(
        mergeMap(d => fromPromise(d.open())
          .pipe(tap(() => this.start(d)))
        )
      );
  }

  private start(d: HIDDevice): void {
    this.hidDevice = d;
    this.c.next(true);
    this.subscriptions.add(
      fromEvent<HIDInputReportEvent>(d, 'inputreport')
        .pipe(
          map(e => getHIDDataMapper(d)(e.data.buffer)),
          distinctUntilKeyChanged('weight')
        ).subscribe(
        e => this.s.next(e)
      ));

    this.subscriptions.add(
      fromEvent<HIDInputReportEvent>(navigator.hid, 'disconnect')
        .pipe(
          filter(e => this.isOwnHidDevice(e.device)))
        .subscribe(dev => {
          this.c.next(false);
          from(this.hidDevice.close()).subscribe();
        }));
  }

  close(): Observable<void> {
    this.subscriptions.unsubscribe();
    this.c.next(false);
    return this.hidDevice ? from(this.hidDevice.close()) : of();
  }

  private isOwnHidDevice(d: HIDDevice): boolean {
    return this.hidDevice && equalsHIDDevice(this.hidDevice, d);
  }





}
