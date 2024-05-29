import { Inject, Injectable } from '@angular/core';
import { filter, from, fromEvent, map, Observable, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { equalsHIDDevice } from './hid-scale.utils';

@Injectable({
  providedIn: 'root',
})
export class NavigatorService {
  readonly navigator: Navigator | undefined;
  readonly supported: boolean;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.navigator = this.document?.defaultView?.navigator;
    this.supported = !!this.navigator && 'hid' in this.navigator;
  }

  requestDevice(filters: HIDDeviceFilter[]): Observable<HIDDevice> {
    return this.requestDevices(filters).pipe(
      filter((devices) => devices.length > 0),
      map((devices) => devices[0]),
    );
  }

  requestDevices(filters: HIDDeviceFilter[]): Observable<HIDDevice[]> {
    return this.navigator
      ? from(this.navigator.hid.requestDevice({ filters }))
      : of();
  }

  addHidEventListener(eventName: string): Observable<HIDInputReportEvent> {
    return this.navigator
      ? fromEvent<HIDInputReportEvent>(this.navigator.hid, eventName)
      : of();
  }

  disconnectListener(): Observable<HIDInputReportEvent> {
    return this.addHidEventListener('disconnect');
  }

  disconnectListenerForDevice(
    device: HIDDevice,
  ): Observable<HIDInputReportEvent> {
    return this.disconnectListener().pipe(
      filter((e) => equalsHIDDevice(device, e.device)),
    );
  }
}
