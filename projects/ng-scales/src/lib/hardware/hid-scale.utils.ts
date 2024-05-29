export function equalsHIDDevice(
  a: {vendorId: number, productId: number},
  b: {vendorId: number, productId: number}): boolean {
  return a.vendorId === b.vendorId && a.productId === b.productId;
}


export const shiftDecimalPlaces = (number: number, shift: number): number =>  {
  let result: number;
  if (shift > 0) {
    result = number * Math.pow(10, shift);
  } else if (shift < 0) {
    result = number / Math.pow(10, -shift);
  } else {
    result = number;
  }
  return result;
}
