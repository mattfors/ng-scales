import { NgScalesDataMapper, NgScalesMapperDefinition } from '../ng-scales-setup';
import { HardwareScaleReportEvent } from './hardware-scale.interface';
import { shiftDecimalPlaces } from './hid-scale.utils';


export const DYMO_M25_MAPPER = (arrayBuffer: ArrayBuffer): HardwareScaleReportEvent => {
  const unsigned = new Uint8Array(arrayBuffer);
  const signed = new Int8Array(arrayBuffer);
  let weight = shiftDecimalPlaces(unsigned[3] + 256 * unsigned[4], signed[2]);
  if (unsigned[0] === 5) {
    weight *= -1;
  }
  return {
    units: unsigned[1] === 2 ? 'g' : 'oz',
    weight
  };
}

/* DYMO M25 25 Lb Digital Postal Scale */
export const DYMO_M25: NgScalesMapperDefinition = {
  vendorId: 2338,
  productId: 32771,
  mapper: DYMO_M25_MAPPER
}

export const SUPPORTED_SCALES: NgScalesMapperDefinition[] = [DYMO_M25];

export const DEFAULT_MAPPER: NgScalesDataMapper = (arrayBuffer: ArrayBuffer): HardwareScaleReportEvent => {
  return {
    weight: new DataView(arrayBuffer).getInt8(0)
  };
}
