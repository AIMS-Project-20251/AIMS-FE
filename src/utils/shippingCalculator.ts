// src/utils/shippingCalculator.ts

export const calculateShippingFee = (
  weight: number,
  province: string,
  subtotal: number
): number => {
  // Logic miễn phí vận chuyển: Đơn hàng > 100k được hỗ trợ tối đa 25k [cite: 71]
  const MAX_SUPPORT = 25000;

  let baseFee = 0;

  // Logic tính phí cơ bản [cite: 73, 74]
  const isMajorCity = ["Hà Nội", "Hồ Chí Minh"].includes(province);

  if (isMajorCity) {
    // 22k cho 3kg đầu
    baseFee = 22000;
    if (weight > 3) {
      // Cộng thêm 2.5k cho mỗi 0.5kg tiếp theo [cite: 75]
      baseFee += Math.ceil((weight - 3) / 0.5) * 2500;
    }
  } else {
    // 30k cho 0.5kg đầu
    baseFee = 30000;
    if (weight > 0.5) {
      baseFee += Math.ceil((weight - 0.5) / 0.5) * 2500;
    }
  }

  // Áp dụng hỗ trợ phí ship
  if (subtotal > 100000) {
    return Math.max(0, baseFee - MAX_SUPPORT);
  }

  return baseFee;
};
