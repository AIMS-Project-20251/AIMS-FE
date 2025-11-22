// src/pages/DeliveryInfo.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateShippingFee } from '../utils/shippingCalculator';

export default function DeliveryInfo() {
  const navigate = useNavigate();
  
  // Mock data từ Cart
  const cartTotal = 150000; // Tổng tiền hàng (chưa VAT)
  const cartWeight = 2.5;   // Tổng trọng lượng (kg)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    province: 'Hà Nội', // Default để tính phí demo
    note: ''
  });

  const [shippingFee, setShippingFee] = useState(0);

  // Tính lại phí ship mỗi khi đổi Tỉnh/Thành [cite: 62]
  useEffect(() => {
    const fee = calculateShippingFee(cartWeight, form.province, cartTotal);
    setShippingFee(fee);
  }, [form.province]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields [cite: 61]
    if (!form.name || !form.address || !form.phone) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    
    // Chuyển sang trang thanh toán kèm dữ liệu order
    navigate('/payment', { state: { ...form, shippingFee, cartTotal } });
  };

  return (
    <div className="container mx-auto p-4 flex gap-6">
      {/* Cột trái: Form nhập liệu [cite: 59] */}
      <div className="w-2/3 bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Họ tên người nhận *" 
            className="border p-2 rounded"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          />
          <input 
            type="tel" placeholder="Số điện thoại *" 
            className="border p-2 rounded"
            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
          />
          <input 
            type="email" placeholder="Email (nhận thông báo đơn hàng)" 
            className="border p-2 rounded"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          />
          
          <select 
            className="border p-2 rounded"
            value={form.province} 
            onChange={e => setForm({...form, province: e.target.value})}
          >
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng (Khác)</option>
          </select>

          <input 
            type="text" placeholder="Địa chỉ chi tiết *" 
            className="border p-2 rounded"
            value={form.address} onChange={e => setForm({...form, address: e.target.value})}
          />
          
          <textarea 
            placeholder="Ghi chú giao hàng" 
            className="border p-2 rounded"
            value={form.note} onChange={e => setForm({...form, note: e.target.value})}
          />

          <button type="submit" className="bg-red-600 text-white p-3 rounded font-bold hover:bg-red-700">
            Xác nhận thông tin giao hàng
          </button>
        </form>
      </div>

      {/* Cột phải: Cart Summary & Shipping Fee Display [cite: 60, 62] */}
      <div className="w-1/3 bg-gray-50 p-6 rounded h-fit">
        <h3 className="font-bold mb-3">Tóm tắt đơn hàng</h3>
        <div className="flex justify-between mb-2">
          <span>Tạm tính:</span>
          <span>{cartTotal.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between mb-2 text-blue-600">
          <span>Phí vận chuyển:</span>
          <span>{shippingFee.toLocaleString()} VND</span>
        </div>
        <div className="text-xs text-gray-500 mb-4">
          (Đã áp dụng chính sách hỗ trợ phí ship cho đơn {'>'} 100k)
        </div>
        <hr className="my-2"/>
        <div className="flex justify-between font-bold text-lg">
          <span>Tổng cộng:</span>
          {/* Chưa cộng VAT ở bước này, hoặc cộng tùy logic hiển thị */}
          <span>{(cartTotal + shippingFee).toLocaleString()} VND</span>
        </div>
      </div>
    </div>
  );
}