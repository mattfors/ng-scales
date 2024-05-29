import { NgScalesService } from './ng-scales.service';
import { HidScaleService } from './hardware/hid-scale.service';
import { Provider } from '@angular/core';
import { HARDWARE_SCALE_INTERFACE, HardwareScaleReportEvent } from './hardware/hardware-scale.interface';

import {
  HID_SCALE_MAPPERS,
  HidScaleMapperService,
} from './hardware/hid-scale-mapper.service';
import { SUPPORTED_SCALES } from './hardware/hid-scale-mapper-config';

export type NgScalesDataMapper = (arrayBuffer: ArrayBuffer) => HardwareScaleReportEvent;
export type HidDataMapper = (arrayBuffer: ArrayBuffer) => HardwareScaleReportEvent;

export interface NgScalesMapperDefinition {
  vendorId: number;
  productId: number;
  mapper: NgScalesDataMapper;
};

export interface NgScalesConfig {
  mappers: NgScalesMapperDefinition[];
}

export function provideNgScales(config: NgScalesConfig = {mappers:[]}): Provider[] {
  return [
    NgScalesService,
    HidScaleMapperService,
    {
      /* My intention is to support serial scales in the future */
      provide: HARDWARE_SCALE_INTERFACE,
      useClass: HidScaleService
    },
    {
      provide: HID_SCALE_MAPPERS,
      useValue: [...config.mappers, ...SUPPORTED_SCALES]
    }
  ];
}
