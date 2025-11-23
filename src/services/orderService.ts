import axiosClient from "../api/axiosClient";
import type { CreateOrderDto, OrderFeeResponse } from "../types/order";

export const orderService = {
  // 1. Gọi API tính phí (Calculate Fee)
  calculateFee: async (data: CreateOrderDto): Promise<OrderFeeResponse> => {
    const response = await axiosClient.post("/place-order/calculate-fee", data);
    return response.data;
  },

  // 2. Gọi API tạo đơn hàng (Place Order)
  placeOrder: async (data: CreateOrderDto) => {
    const response = await axiosClient.post("/place-order", data);
    return response.data;
  },
};
