export function equalsHIDDevice(
  a: {vendorId: number, productId: number},
  b: {vendorId: number, productId: number}): boolean {
  return a.vendorId === b.vendorId && a.productId === b.productId;
}

