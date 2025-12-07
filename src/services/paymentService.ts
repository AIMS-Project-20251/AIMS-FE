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

  confirmPaypal: async (token: string) => {
    const response = await axiosClient.get("/pay-order/confirm-paypal", {
      params: { token },
    });
    return response.data;
  },

  cancelPaypal: async (token: string) => {
    const response = await axiosClient.get("/pay-order/cancel-paypal", {
      params: { token },
    });
    return response.data;
  },
};
