import { HidDataMapper } from './hid-scale.service';
import { DATA_MAPPERS } from './hid-scale.constants';

export function equalsHIDDevice(a: HIDDevice, b: HIDDevice): boolean {
  return a.vendorId === b.vendorId && a.productId === b.productId;
}

export const getHIDDataMapperKey = (d: HIDDevice| HIDDeviceFilter): string => {
  return `${d.vendorId}-${d.productId}`
};

export const getHIDDataMapper = (d: HIDDevice| HIDDeviceFilter): HidDataMapper => {
  return DATA_MAPPERS[getHIDDataMapperKey(d)];
};
