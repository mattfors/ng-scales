import { HidDataMapper } from './hid-scale.service';
import { HardwareScaleReportEvent } from './hardware-scale.interface';
import { getHIDDataMapperKey } from './hid-scale.utils';



export const DYMO_M25: HIDDeviceFilter = {vendorId: 2338, productId: 32771} /* DYMO M25 25 Lb Digital Postal Scale */
export const SUPPORTED_SCALES: HIDDeviceFilter[] = [DYMO_M25];

export const DATA_MAPPERS: Record<string, HidDataMapper> = {};

DATA_MAPPERS[getHIDDataMapperKey(DYMO_M25)] = (arrayBuffer: ArrayBuffer): HardwareScaleReportEvent => {
  const d = new Uint8Array(arrayBuffer);
  let weight = (d[3] + 256 * d[4])/10;
  if (d[0] === 5) {
    weight *= -1;
  }
  return {
    units: d[1] === 2 ? 'g' : 'oz',
    weight
  };
}





