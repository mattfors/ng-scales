import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilKeyChanged,
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
  private inputReportSub!: Subscription;
  private disconnectSub!: Subscription;

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

    this.inputReportSub = this.inputReportListener(d)
      .pipe(
        map((e) => hidMapper(e.data.buffer)),
        distinctUntilKeyChanged('weight'),
      )
      .subscribe((e) => this._report.next(e));

    this.disconnectSub = this.navigatorService
      .disconnectListenerForDevice(d)
      .subscribe(() => this.close());
  }

  private inputReportListener(
    device: HIDDevice,
  ): Observable<HIDInputReportEvent> {
    return fromEvent<HIDInputReportEvent>(device, 'inputreport');
  }

  close(): Observable<void> {
    if (this.inputReportSub) this.inputReportSub.unsubscribe();
    if (this.disconnectSub) this.disconnectSub.unsubscribe();
    this._connected.next(false);
    return this.hidDevice ? from(this.hidDevice.close()) : of();
  }
}
