import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useCart } from '../context/CartContext';
import type { OrderFeeResponse } from '../types/order';
import { Trash2, ArrowLeft, MapPin, Phone, Mail, User, Home } from 'lucide-react';

export default function DeliveryInfo() {
  const navigate = useNavigate();
  
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    shippingAddress: '',
    city: 'Hanoi',
  });

  const [feeData, setFeeData] = useState<OrderFeeResponse>({
    subtotal: 0,
    vatAmount: 0,
    shippingFee: 0,
    totalAmount: 0,
    currency: 'VND'
  });

  const handleCalculateFee = async () => {
    if (cartItems.length === 0) {
        setFeeData({ subtotal: 0, vatAmount: 0, shippingFee: 0, totalAmount: 0, currency: 'VND' });
        return;
    }

    try {
      const itemsPayload = cartItems.map(i => ({ 
        productId: i.productId, 
        quantity: i.quantity,
        type: i.type
      }));

      const payload: any = {
        customerName: form.customerName || "Guest Checking Fee",
        email: form.email || "guest@example.com",
        phone: form.phone || "0000000000",
        shippingAddress: form.shippingAddress || "Check Fee Address",
        
        city: form.city,
        items: itemsPayload
      };

      const data = await orderService.calculateFee(payload);
      setFeeData(data);
    } catch (error) {
      console.error("Lỗi tính phí:", error);
    }
  };

  useEffect(() => {
    handleCalculateFee();
  }, [form.city, cartItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
        alert("Giỏ hàng đang trống! Vui lòng mua thêm sản phẩm.");
        return;
    }

    if (!form.customerName || !form.phone || !form.email || !form.shippingAddress) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    try {
      setIsLoading(true);

      const payload: any = {
        ...form,
        items: cartItems.map(i => ({ 
            productId: i.productId, 
            quantity: i.quantity,
            type: i.type 
        }))
      };

      const newOrder = await orderService.placeOrder(payload);
      
      console.log("Order Created:", newOrder);

      clearCart();

      navigate('/payment', { 
        state: { 
          orderId: newOrder.id, 
          totalAmount: newOrder.totalAmount,
          feeData: feeData 
        } 
      });

    } catch (error) {
      console.error("Lỗi tạo đơn hàng:", error);
      alert("Không thể tạo đơn hàng. Vui lòng kiểm tra lại số lượng tồn kho!");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200";

  if (cartItems.length === 0) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <Trash2 size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h2>
                  <p className="text-gray-500 mb-6">Hãy thêm vài món đồ thú vị vào giỏ nhé!</p>
                  <button onClick={() => navigate('/')} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2">
                      <ArrowLeft size={20}/> Quay lại mua sắm
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        
        <div className="flex-1 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
             <button 
              onClick={() => navigate('/')}
              className="bg-white border border-gray-300 p-2.5 rounded-full text-gray-600 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-all shadow-sm"
              title="Về trang chủ"
           >
              <Home size={20} />
           </button>
             <h2 className="text-2xl font-bold text-gray-800">Thông tin giao hàng</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <User className="absolute top-3.5 left-3 text-gray-400" size={18}/>
                  <input type="text" placeholder="Họ tên người nhận" className={inputClass} required
                    value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} />
                </div>
                <div className="relative">
                  <Phone className="absolute top-3.5 left-3 text-gray-400" size={18}/>
                  <input type="tel" placeholder="Số điện thoại" className={inputClass} required
                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
            </div>

            <div className="relative">
              <Mail className="absolute top-3.5 left-3 text-gray-400" size={18}/>
              <input type="email" placeholder="Email nhận thông báo" className={inputClass} required
                 value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            
            <div className="relative">
               <MapPin className="absolute top-3.5 left-3 text-gray-400" size={18}/>
               <select className={inputClass} value={form.city} onChange={e => setForm({...form, city: e.target.value})}>
                  <option value="Hanoi">Hà Nội</option>
                  <option value="Ho Chi Minh City">TP. Hồ Chí Minh</option>
                  <option value="Da Nang">Đà Nẵng</option>
                  <option value="Hai Phong">Hải Phòng</option>
                  <option value="Other">Tỉnh thành khác</option>
               </select>
            </div>

            <div className="relative">
               <MapPin className="absolute top-3.5 left-3 text-gray-400" size={18}/>
               <input type="text" placeholder="Địa chỉ chi tiết (Số nhà, Đường, Phường/Xã...)" className={inputClass} required
                 value={form.shippingAddress} onChange={e => setForm({...form, shippingAddress: e.target.value})} />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`mt-4 w-full text-white p-4 rounded-lg font-bold text-lg transition shadow-md flex items-center justify-center gap-2
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:shadow-lg'}`}
            >
              {isLoading ? (
                  <>Đang xử lý...</>
              ) : (
                  <>Xác nhận & Thanh toán</>
              )}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-5/12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
                <h3 className="text-xl font-bold mb-4 border-b pb-3 flex justify-between items-center text-gray-800">
                    Đơn hàng <span className="text-sm font-normal text-gray-500">({cartItems.length} sản phẩm)</span>
                </h3>
                
                <div className="mb-4 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                        <div key={`${item.productId}-${item.type}`} className="flex gap-3 items-start border-b border-gray-100 pb-4 last:border-0 group">
                           <div className="relative w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden bg-gray-50">
                               <img src={item.imageUrl || 'https://placehold.co/100'} alt={item.name} className="w-full h-full object-cover" />
                               <span className="absolute bottom-0 left-0 right-0 bg-gray-800/70 text-white text-[9px] text-center uppercase py-0.5">
                                   {item.type}
                               </span>
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-800 line-clamp-2 text-sm mb-1" title={item.name}>{item.name}</p>
                              
                              <div className="flex justify-between items-end">
                                  <div>
                                      <p className="text-red-600 font-bold text-sm">{item.price.toLocaleString()} ₫</p>
                                      
                                      <div className="flex items-center border border-gray-300 rounded mt-1 w-fit bg-gray-50">
                                          <button 
                                            type="button"
                                            onClick={() => updateQuantity(item.productId, item.type, item.quantity - 1)} 
                                            className="px-2 py-0.5 hover:bg-gray-200 text-gray-600 font-bold"
                                            disabled={item.quantity <= 1}
                                          >-</button>
                                          <span className="px-2 text-sm font-medium min-w-[24px] text-center bg-white border-x border-gray-300 h-full flex items-center justify-center">
                                              {item.quantity}
                                          </span>
                                          <button 
                                            type="button"
                                            onClick={() => updateQuantity(item.productId, item.type, item.quantity + 1)} 
                                            className="px-2 py-0.5 hover:bg-gray-200 text-gray-600 font-bold"
                                          >+</button>
                                      </div>
                                  </div>

                                  <button 
                                    onClick={() => {
                                        if(window.confirm("Xóa sản phẩm này khỏi giỏ?")) 
                                            removeFromCart(item.productId, item.type)
                                    }} 
                                    className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded transition"
                                    title="Xóa sản phẩm"
                                  >
                                      <Trash2 size={18} />
                                  </button>
                              </div>
                           </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100">
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span>Tạm tính:</span>
                        <span className="font-medium">{feeData.subtotal.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span>VAT (10%):</span>
                        <span>{feeData.vatAmount.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between text-blue-600 text-sm font-medium">
                        <span>Phí vận chuyển:</span>
                        <span>{feeData.shippingFee.toLocaleString()} ₫</span>
                    </div>
                    
                    <div className="border-t border-gray-200 my-2 pt-3 flex justify-between items-end">
                        <span className="font-bold text-gray-800 text-base">Tổng thanh toán:</span>
                        <div className="text-right">
                             <span className="text-2xl font-bold text-red-600 block leading-none">
                                 {feeData.totalAmount.toLocaleString()} ₫
                             </span>
                             <span className="text-[10px] text-gray-400 font-normal">(Đã bao gồm VAT)</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}