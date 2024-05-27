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
import { equalsHIDDevice } from './hid-scale.utils';
import { HidScaleMapperService } from './hid-scale-mapper.service';
import { HidDataMapper } from '../ng-scales-setup';


@Injectable()
export class HidScaleService implements HardwareScaleInterface {

  private _report: Subject<HardwareScaleReportEvent> = new Subject<HardwareScaleReportEvent>()
  private _connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private hidDevice!: HIDDevice;
  private subscriptions: Subscription = new Subscription();

  reportEvent = () => this._report.asObservable();
  readonly connected: Observable<boolean> = this._connected.asObservable();
  readonly supported: boolean = ('hid' in navigator);

  constructor(private hidScaleMapperService: HidScaleMapperService) {
  }

  open(): Observable<void> {
    if (!this.supported || this._connected.value) {
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
    this._connected.next(true);
    const hidMapper: HidDataMapper = this.hidScaleMapperService.getHIDDataMapper(d)
    this.subscriptions.add(
      fromEvent<HIDInputReportEvent>(d, 'inputreport')
        .pipe(
          map(e => hidMapper(e.data.buffer)),
          distinctUntilKeyChanged('weight')
        ).subscribe(
        e => this._report.next(e)
      ));

    this.subscriptions.add(
      fromEvent<HIDInputReportEvent>(navigator.hid, 'disconnect')
        .pipe(
          filter(e => this.isOwnHidDevice(e.device)))
        .subscribe(dev => {
          this._connected.next(false);
          from(this.hidDevice.close()).subscribe();
        }));
  }

  close(): Observable<void> {
    this.subscriptions.unsubscribe();
    this._connected.next(false);
    return this.hidDevice ? from(this.hidDevice.close()) : of();
  }

  private isOwnHidDevice(d: HIDDevice): boolean {
    return this.hidDevice && equalsHIDDevice(this.hidDevice, d);
  }





}
