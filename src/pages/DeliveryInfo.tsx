import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateShippingFee } from '../utils/shippingCalculator';

export default function DeliveryInfo() {
  const navigate = useNavigate();
  
  // Mock data
  const cartTotal = 150000;
  const cartWeight = 2.5;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    province: 'Hà Nội',
    note: ''
  });

  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const fee = calculateShippingFee(cartWeight, form.province, cartTotal);
    setShippingFee(fee);
  }, [form.province]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    navigate('/payment', { state: { ...form, shippingFee, cartTotal } });
  };

  // Class chung cho các ô input để đỡ viết lại nhiều lần
  // focus:ring-2 focus:ring-red-500: Hiệu ứng viền đỏ khi bấm vào
  const inputClass = "w-full border border-gray-300 rounded-lg p-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200";

  return (
    // Wrapper bao ngoài: Nền xám nhẹ, căn giữa nội dung
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      
      {/* Container chính: Giới hạn chiều rộng tối đa (max-w-5xl) và căn giữa (mx-auto) */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        
        {/* CỘT TRÁI: FORM NHẬP LIỆU */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span className="bg-red-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">1</span>
            Thông tin giao hàng
          </h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Họ tên */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600">Họ tên người nhận <span className="text-red-500">*</span></label>
                    <input 
                        type="text" placeholder="Nguyễn Văn A" 
                        className={inputClass}
                        value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    />
                </div>
                {/* SĐT */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                        type="tel" placeholder="09xx xxx xxx" 
                        className={inputClass}
                        value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    />
                </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Email nhận thông báo</label>
                <input 
                    type="email" placeholder="example@email.com" 
                    className={inputClass}
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                />
            </div>
            
            {/* Tỉnh thành */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Tỉnh / Thành phố</label>
                <select 
                    className={inputClass}
                    value={form.province} 
                    onChange={e => setForm({...form, province: e.target.value})}
                >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng (Khác)</option>
                </select>
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                <input 
                    type="text" placeholder="Số nhà, tên đường, phường/xã..." 
                    className={inputClass}
                    value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                />
            </div>
            
            {/* Ghi chú */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Ghi chú giao hàng</label>
                <textarea 
                    rows={3}
                    placeholder="Ví dụ: Gọi trước khi giao, giao giờ hành chính..." 
                    className={inputClass}
                    value={form.note} onChange={e => setForm({...form, note: e.target.value})}
                />
            </div>

            <button type="submit" className="mt-4 w-full bg-red-600 text-white p-4 rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Xác nhận & Thanh toán
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <div className="w-full md:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Tóm tắt đơn hàng</h3>
                
                {/* List sản phẩm demo (Nếu muốn đẹp hơn) */}
                <div className="mb-4 text-sm text-gray-500">
                    <p>1x Sách giáo khoa Toán 1</p>
                    <p>2x Bút bi Thiên Long</p>
                    <p className="italic mt-1 text-xs">... và các sản phẩm khác</p>
                </div>

                <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span className="font-medium">{cartTotal.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                        <span>Phí vận chuyển:</span>
                        <span className="font-medium">{shippingFee.toLocaleString()} ₫</span>
                    </div>
                    
                    {/* Badge thông báo miễn phí ship */}
                    {cartTotal > 100000 && (
                         <div className="bg-green-100 text-green-700 text-xs p-2 rounded flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Đã hỗ trợ tối đa 25k phí ship
                         </div>
                    )}
                </div>
                
                <div className="border-t my-4 border-dashed border-gray-300"></div>
                
                <div className="flex justify-between items-end">
                    <span className="font-bold text-gray-600">Tổng cộng:</span>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-red-600">{(cartTotal + shippingFee).toLocaleString()} ₫</span>
                        <span className="text-xs text-gray-400">(Đã bao gồm VAT nếu có)</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}