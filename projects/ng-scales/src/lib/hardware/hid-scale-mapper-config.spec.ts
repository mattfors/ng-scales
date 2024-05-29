import { DYMO_M25_MAPPER } from './hid-scale-mapper-config';
import { HardwareScaleReportEvent } from './hardware-scale.interface';

describe('HidScaleMapperConfig', () => {



  it('should map dymo 25 data to grams weight', () => {
    let v:  ArrayBuffer = new Uint8Array([4, 2, 255, 234, 0]).buffer;
    let o: HardwareScaleReportEvent = DYMO_M25_MAPPER(v);
    expect(o.weight).toEqual(23.4);
    expect(o.units).toEqual('g');
  });

  it('should map dymo 25 data to ounces weight', () => {
    let v:  ArrayBuffer = new Uint8Array([4, 11, 255, 100, 8]).buffer;
    let o: HardwareScaleReportEvent = DYMO_M25_MAPPER(v);
    expect(o.weight).toEqual(214.8);
    expect(o.units).toEqual('oz');
  });


});
