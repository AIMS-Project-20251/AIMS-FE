export interface OrderItemDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  items: OrderItemDto[];
}

export interface OrderFeeResponse {
  subtotal: number;
  vatAmount: number;
  shippingFee: number;
  totalAmount: number;
  currency: string;
}
