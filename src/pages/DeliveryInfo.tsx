import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import type { CreateOrderDto, OrderFeeResponse } from '../types/order';

// --- MOCK DATA (Tạo sẵn để test theo yêu cầu) ---
// Lưu ý: ID sản phẩm phải tồn tại trong DB của bạn (Product table)
const MOCK_ITEMS = [
  { productId: 1, quantity: 2, name: "Sản phẩm Demo A" }, 
  { productId: 2, quantity: 1, name: "Sản phẩm Demo B" },
];

export default function DeliveryInfo() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form nhập liệu của người dùng
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    shippingAddress: '',
    city: 'Hà Nội', // Giá trị mặc định
  });

  // State hiển thị phí (Lấy từ API)
  const [feeData, setFeeData] = useState<OrderFeeResponse>({
    subtotal: 0,
    vatAmount: 0,
    shippingFee: 0,
    totalAmount: 0,
    currency: 'VND'
  });

  // 1. Hàm gọi API Tính Phí (calculate-fee)
  const handleCalculateFee = async () => {
    try {
      // Chuẩn bị payload đúng chuẩn DTO
      const payload: CreateOrderDto = {
        ...form,
        items: MOCK_ITEMS.map(i => ({ productId: i.productId, quantity: i.quantity }))
      };

      // Gọi API Backend
      const data = await orderService.calculateFee(payload);
      setFeeData(data);
    } catch (error) {
      console.error("Lỗi tính phí:", error);
    }
  };

  // Tự động tính lại phí khi user đổi Thành phố
  useEffect(() => {
    handleCalculateFee();
  }, [form.city]);

  // 2. Hàm xử lý Tạo Đơn Hàng (place-order)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.shippingAddress || !form.email) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      setIsLoading(true);

      const payload: CreateOrderDto = {
        ...form,
        items: MOCK_ITEMS.map(i => ({ productId: i.productId, quantity: i.quantity }))
      };

      // Gọi API tạo đơn hàng (Status: PENDING)
      const newOrder = await orderService.placeOrder(payload);
      
      console.log("Order Created:", newOrder);

      // Chuyển sang trang Payment, mang theo thông tin đơn hàng vừa tạo
      navigate('/payment', { 
        state: { 
          orderId: newOrder.id,        // ID đơn hàng từ DB
          totalAmount: newOrder.totalAmount, // Tổng tiền từ DB
          feeData: feeData             // Thông tin chi tiết phí để hiển thị lại nếu cần
        } 
      });

    } catch (error) {
      console.error("Lỗi tạo đơn hàng:", error);
      alert("Không thể tạo đơn hàng. Vui lòng kiểm tra lại (ví dụ: Sản phẩm hết hàng).");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg p-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        
        {/* CỘT TRÁI: Form Nhập Liệu */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin giao hàng</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Họ tên *</label>
                  <input type="text" className={inputClass} required
                    value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Số điện thoại *</label>
                  <input type="tel" className={inputClass} required
                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email *</label>
              <input type="email" className={inputClass} required
                 value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Tỉnh / Thành phố</label>
              <select className={inputClass} value={form.city} onChange={e => setForm({...form, city: e.target.value})}>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Khác">Tỉnh thành khác</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Địa chỉ chi tiết *</label>
              <input type="text" className={inputClass} required
                 value={form.shippingAddress} onChange={e => setForm({...form, shippingAddress: e.target.value})} />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`mt-4 w-full text-white p-4 rounded-lg font-bold transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isLoading ? 'Đang xử lý...' : 'Xác nhận & Tạo đơn hàng'}
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: Tóm tắt đơn hàng (Mock Data + Fee từ API) */}
        <div className="w-full md:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Đơn hàng (Mock Data)</h3>
                
                {/* List sản phẩm giả định */}
                <div className="mb-4 space-y-3">
                    {MOCK_ITEMS.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-dashed pb-2 last:border-0">
                           <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-500">ID: {item.productId} | SL: {item.quantity}</p>
                           </div>
                        </div>
                    ))}
                </div>

                {/* Phần hiển thị tiền tính từ API */}
                <div className="space-y-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span className="font-medium">{feeData.subtotal.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>VAT (10%):</span>
                        <span>{feeData.vatAmount.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                        <span>Phí vận chuyển:</span>
                        <span className="font-medium">{feeData.shippingFee.toLocaleString()} ₫</span>
                    </div>
                    <div className="border-t border-gray-300 my-2 pt-2 flex justify-between items-end">
                        <span className="font-bold text-gray-800">Tổng thanh toán:</span>
                        <span className="text-xl font-bold text-red-600">{feeData.totalAmount.toLocaleString()} ₫</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}