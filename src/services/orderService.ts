import axiosClient from "../api/axiosClient";
import type { CreateOrderDto, OrderFeeResponse } from "../types/order";

export const orderService = {
  calculateFee: async (data: CreateOrderDto): Promise<OrderFeeResponse> => {
    const response = await axiosClient.post("/place-order/calculate-fee", data);
    return response.data;
  },

  placeOrder: async (data: CreateOrderDto) => {
    const response = await axiosClient.post("/place-order", data);
    return response.data;
  },

  getOrderStatus: async (orderId: number) => {
    const response = await axiosClient.get(`/place-order/${orderId}`);
    return response.data;
  },
};
