import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

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

export const NG_SCALE_HARDWARE: InjectionToken<HardwareScaleInterface> = new InjectionToken<HardwareScaleInterface>('HardwareScaleInterface');
