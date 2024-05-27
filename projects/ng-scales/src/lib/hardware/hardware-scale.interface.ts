import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export const HARDWARE_SCALE_INTERFACE = new InjectionToken<HardwareScaleInterface>('HardwareScaleInterface');


export interface HardwareScaleReportEvent {
  weight: number;
  units?: string;
}

export interface HardwareScaleInterface {
  readonly supported: boolean;
  connected: Observable<boolean>;
  open(): Observable<void>;
  close(): Observable<void>;
  reportEvent(): Observable<HardwareScaleReportEvent>;
}
