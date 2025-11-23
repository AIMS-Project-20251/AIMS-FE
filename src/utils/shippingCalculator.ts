export const calculateShippingFee = (
  weight: number,
  province: string,
  subtotal: number
): number => {
  const MAX_SUPPORT = 25000;

  let baseFee = 0;

  const isMajorCity = ["Hà Nội", "Hồ Chí Minh"].includes(province);

  if (isMajorCity) {
    baseFee = 22000;
    if (weight > 3) {
      baseFee += Math.ceil((weight - 3) / 0.5) * 2500;
    }
  } else {
    baseFee = 30000;
    if (weight > 0.5) {
      baseFee += Math.ceil((weight - 0.5) / 0.5) * 2500;
    }
  }

  if (subtotal > 100000) {
    return Math.max(0, baseFee - MAX_SUPPORT);
  }

  return baseFee;
};
