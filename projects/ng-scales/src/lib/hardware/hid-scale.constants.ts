import { HardwareScaleReportEvent } from './hardware-scale.interface';
import { NgScalesDataMapper, NgScalesMapperDefinition } from '../ng-scales-setup';

/* DYMO M25 25 Lb Digital Postal Scale */
export const DYMO_M25: NgScalesMapperDefinition = {
  vendorId: 2338,
  productId: 32771,
  mapper: (arrayBuffer: ArrayBuffer): HardwareScaleReportEvent => {
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
}
export const SUPPORTED_SCALES: NgScalesMapperDefinition[] = [DYMO_M25];

export const DEFAULT_MAPPER: NgScalesDataMapper = (arrayBuffer: ArrayBuffer): HardwareScaleReportEvent => {
  return {
    weight: new DataView(arrayBuffer).getInt8(0)
  };
}



