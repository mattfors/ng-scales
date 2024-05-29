import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { equalsHIDDevice } from './hid-scale.utils';
import { HidDataMapper, NgScalesMapperDefinition } from '../ng-scales-setup';
import { DEFAULT_MAPPER } from './hid-scale-mapper-config';

export const HID_SCALE_MAPPERS: InjectionToken<NgScalesMapperDefinition[]>
  = new InjectionToken<NgScalesMapperDefinition[]>('HidScaleMappers');

@Injectable()
export class HidScaleMapperService {

  constructor(@Inject(HID_SCALE_MAPPERS) @Optional() private mappers: NgScalesMapperDefinition[] = []) { }

  getHIDDataMapper = (device: HIDDevice): HidDataMapper => {
    const m = this.mappers.find(m => equalsHIDDevice(m, device));
    if (m) {
      return m.mapper;
    }
    return DEFAULT_MAPPER;
  };
}
