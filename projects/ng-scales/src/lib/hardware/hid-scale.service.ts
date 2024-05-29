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
  tap,
} from 'rxjs';
import {
  HardwareScaleInterface,
  HardwareScaleReportEvent,
} from './hardware-scale.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { equalsHIDDevice } from './hid-scale.utils';
import { HidScaleMapperService } from './hid-scale-mapper.service';
import { HidDataMapper } from '../ng-scales-setup';
import { NavigatorService } from './navigator.service';
import { SUPPORTED_SCALES } from './hid-scale-mapper-config';

@Injectable()
export class HidScaleService implements HardwareScaleInterface {
  private _report: Subject<HardwareScaleReportEvent> =
    new Subject<HardwareScaleReportEvent>();
  private _connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );

  private hidDevice!: HIDDevice;

  private subscriptions: Subscription = new Subscription();

  reportEvent = () => this._report.asObservable();
  readonly connected: Observable<boolean> = this._connected.asObservable();
  readonly supported: boolean;

  constructor(
    private hidScaleMapperService: HidScaleMapperService,
    private navigatorService: NavigatorService,
  ) {
    this.supported = this.navigatorService.supported;
  }

  open(): Observable<void> {
    if (!this.supported || this._connected.value) {
      return of();
    }
    return this.navigatorService
      .requestDevice(SUPPORTED_SCALES)
      .pipe(
        mergeMap((d) => fromPromise(d.open()).pipe(tap(() => this.start(d)))),
      );
  }

  private start(d: HIDDevice): void {
    this.hidDevice = d;
    this._connected.next(true);
    const hidMapper: HidDataMapper =
      this.hidScaleMapperService.getHIDDataMapper(d);
    this.subscriptions.add(
      fromEvent<HIDInputReportEvent>(d, 'inputreport')
        .pipe(
          map((e) => hidMapper(e.data.buffer)),
          distinctUntilKeyChanged('weight'),
        )
        .subscribe((e) => this._report.next(e)),
    );
    this.subscriptions.add(
      this.navigatorService
        .addHidEventListener('disconnect')
        .pipe(filter((e) => this.isOwnHidDevice(e.device)))
        .subscribe(() => {
          this._connected.next(false);
          from(this.hidDevice.close()).subscribe();
        }),
    );
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
