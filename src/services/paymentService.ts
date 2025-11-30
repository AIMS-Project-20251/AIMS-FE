import axiosClient from "../api/axiosClient";

export const paymentService = {
  createPaymentUrl: async (orderId: number, method: "VIETQR" | "PAYPAL") => {
    const response = await axiosClient.post("/pay-order/create", {
      orderId: orderId,
      method: method,
    });
    return response.data;
  },

  confirmVietQR: async (orderId: number) => {
    const response = await axiosClient.post("/pay-order/confirm-vietqr", {
      vietQROrderId: String(orderId),
    });
    return response.data;
  },
};
